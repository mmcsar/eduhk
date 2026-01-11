/**
 * MMC Immo - API Leads
 * Fonctions CRUD pour les leads/prospects
 */

import { supabase } from '../supabase';
import type {
  Lead,
  LeadInsert,
  LeadUpdate,
  LeadStatus,
  LeadSource,
  LeadWithDetails,
} from '../database.types';

// ============================================
// LECTURE
// ============================================

/**
 * Récupérer les leads d'un agent
 */
export async function getAgentLeads(
  agentId: string,
  status?: LeadStatus,
  page: number = 1,
  pageSize: number = 20
): Promise<{ data: LeadWithDetails[]; count: number }> {
  let query = supabase
    .from('leads')
    .select(
      `
      *,
      property:properties(id, title, images, price, neighborhood),
      client:clients(id, full_name, phone, email)
    `,
      { count: 'exact' }
    )
    .eq('agent_id', agentId);

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('created_at', { ascending: false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: (data as unknown as LeadWithDetails[]) || [],
    count: count || 0,
  };
}

/**
 * Récupérer les leads d'une propriété
 */
export async function getPropertyLeads(propertyId: string): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
}

/**
 * Récupérer un lead par ID
 */
export async function getLeadById(id: string): Promise<LeadWithDetails | null> {
  const { data, error } = await supabase
    .from('leads')
    .select(
      `
      *,
      property:properties(id, title, images, price, neighborhood, agent_id),
      agent:users(id, full_name, phone, email, whatsapp_number),
      client:clients(id, full_name, phone, email)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as unknown as LeadWithDetails;
}

/**
 * Récupérer les leads récents (pour dashboard)
 */
export async function getRecentLeads(
  agentId?: string,
  limit: number = 10
): Promise<LeadWithDetails[]> {
  let query = supabase
    .from('leads')
    .select(
      `
      *,
      property:properties(id, title, images, price, neighborhood),
      client:clients(id, full_name, phone)
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (agentId) {
    query = query.eq('agent_id', agentId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data as unknown as LeadWithDetails[]) || [];
}

/**
 * Leads nécessitant un suivi
 */
export async function getLeadsNeedingFollowUp(agentId: string): Promise<Lead[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('agent_id', agentId)
    .in('status', ['new', 'contacted', 'qualified', 'negotiation'])
    .or(`next_follow_up_at.is.null,next_follow_up_at.lte.${now}`)
    .order('next_follow_up_at', { ascending: true });

  if (error) throw error;

  return data || [];
}

// ============================================
// CRÉATION
// ============================================

/**
 * Créer un nouveau lead (depuis l'app publique)
 */
export async function createLead(lead: Partial<LeadInsert>): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead as Record<string, unknown>)
    .select()
    .single();

  if (error) throw error;

  return data as Lead;
}

/**
 * Créer un lead depuis un formulaire de contact
 */
export async function createLeadFromContact(
  propertyId: string,
  agentId: string,
  clientName: string,
  clientPhone: string,
  clientEmail: string | null,
  message: string | null,
  source: LeadSource = 'app'
): Promise<Lead> {
  return createLead({
    property_id: propertyId,
    agent_id: agentId,
    client_name: clientName,
    client_phone: clientPhone,
    client_email: clientEmail,
    message,
    source,
    status: 'new',
  });
}

// ============================================
// MISE À JOUR
// ============================================

/**
 * Mettre à jour un lead
 */
export async function updateLead(id: string, updates: LeadUpdate): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .update(updates as Record<string, unknown>)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data as Lead;
}

/**
 * Changer le statut d'un lead
 */
export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  notes?: string
): Promise<Lead> {
  const updates: LeadUpdate = {
    status,
    last_contact_at: new Date().toISOString(),
  };

  if (notes) {
    updates.notes = notes;
  }

  if (status === 'contacted' || status === 'qualified') {
    // Premier contact
    const { data: existing } = await supabase
      .from('leads')
      .select('first_contact_at')
      .eq('id', id)
      .single();

    const existingLead = existing as { first_contact_at: string | null } | null;
    if (!existingLead?.first_contact_at) {
      updates.first_contact_at = new Date().toISOString();
    }
  }

  if (status === 'won') {
    updates.converted_at = new Date().toISOString();
  }

  return updateLead(id, updates);
}

/**
 * Planifier un suivi
 */
export async function scheduleFollowUp(
  id: string,
  followUpDate: Date,
  notes?: string
): Promise<Lead> {
  const updates: LeadUpdate = {
    next_follow_up_at: followUpDate.toISOString(),
  };

  if (notes) {
    updates.notes = notes;
  }

  return updateLead(id, updates);
}

/**
 * Assigner un lead à un agent
 */
export async function assignLeadToAgent(id: string, agentId: string): Promise<Lead> {
  return updateLead(id, { agent_id: agentId });
}

/**
 * Marquer la conversion avec valeur
 */
export async function markLeadConverted(
  id: string,
  conversionValue: number
): Promise<Lead> {
  return updateLead(id, {
    status: 'won',
    converted_at: new Date().toISOString(),
    conversion_value: conversionValue,
  });
}

// ============================================
// SUPPRESSION
// ============================================

/**
 * Supprimer un lead
 */
export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id);

  if (error) throw error;
}

// ============================================
// STATISTIQUES
// ============================================

/**
 * Stats des leads par statut pour un agent
 */
export async function getLeadStatsByStatus(
  agentId: string
): Promise<Record<LeadStatus, number>> {
  const { data, error } = await supabase
    .from('leads')
    .select('status')
    .eq('agent_id', agentId);

  if (error) throw error;

  const stats: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
  };

  const leads = (data || []) as { status: string }[];
  leads.forEach((lead) => {
    stats[lead.status as LeadStatus]++;
  });

  return stats;
}

/**
 * Stats des leads par source
 */
export async function getLeadStatsBySource(
  agentId?: string
): Promise<Record<LeadSource, number>> {
  let query = supabase.from('leads').select('source');

  if (agentId) {
    query = query.eq('agent_id', agentId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const stats: Record<LeadSource, number> = {
    app: 0,
    website: 0,
    facebook: 0,
    instagram: 0,
    whatsapp: 0,
    referral: 0,
    walk_in: 0,
    other: 0,
  };

  const leads = (data || []) as { source: string }[];
  leads.forEach((lead) => {
    stats[lead.source as LeadSource]++;
  });

  return stats;
}

/**
 * Taux de conversion
 */
export async function getConversionRate(agentId?: string): Promise<number> {
  let query = supabase.from('leads').select('status');

  if (agentId) {
    query = query.eq('agent_id', agentId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const leads = (data || []) as { status: string }[];
  const total = leads.length;
  const won = leads.filter((l) => l.status === 'won').length;

  return total > 0 ? (won / total) * 100 : 0;
}
