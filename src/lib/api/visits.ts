/**
 * MMC Immo - API Visites
 * Fonctions CRUD pour les visites de propriétés
 */

import { supabase } from '../supabase';
import type {
  Visit,
  VisitInsert,
  VisitUpdate,
  VisitStatus,
  VisitWithDetails,
} from '../database.types';

// ============================================
// LECTURE
// ============================================

/**
 * Récupérer les visites d'un agent
 */
export async function getAgentVisits(
  agentId: string,
  status?: VisitStatus,
  startDate?: Date,
  endDate?: Date
): Promise<VisitWithDetails[]> {
  let query = supabase
    .from('visits')
    .select(
      `
      *,
      property:properties(id, title, images, address, neighborhood),
      client:clients(id, full_name, phone, email)
    `
    )
    .eq('agent_id', agentId);

  if (status) {
    query = query.eq('status', status);
  }

  if (startDate) {
    query = query.gte('scheduled_at', startDate.toISOString());
  }

  if (endDate) {
    query = query.lte('scheduled_at', endDate.toISOString());
  }

  query = query.order('scheduled_at', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;

  return (data as unknown as VisitWithDetails[]) || [];
}

/**
 * Récupérer les visites d'une propriété
 */
export async function getPropertyVisits(propertyId: string): Promise<VisitWithDetails[]> {
  const { data, error } = await supabase
    .from('visits')
    .select(
      `
      *,
      agent:users(id, full_name, phone),
      client:clients(id, full_name, phone, email)
    `
    )
    .eq('property_id', propertyId)
    .order('scheduled_at', { ascending: false });

  if (error) throw error;

  return (data as unknown as VisitWithDetails[]) || [];
}

/**
 * Récupérer une visite par ID
 */
export async function getVisitById(id: string): Promise<VisitWithDetails | null> {
  const { data, error } = await supabase
    .from('visits')
    .select(
      `
      *,
      property:properties(id, title, images, address, neighborhood, price, agent_id),
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

  return data as unknown as VisitWithDetails;
}

/**
 * Visites du jour pour un agent
 */
export async function getTodayVisits(agentId: string): Promise<VisitWithDetails[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getAgentVisits(agentId, undefined, today, tomorrow);
}

/**
 * Visites à venir (prochains 7 jours)
 */
export async function getUpcomingVisits(
  agentId: string,
  days: number = 7
): Promise<VisitWithDetails[]> {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return getAgentVisits(agentId, undefined, now, endDate);
}

/**
 * Visites en attente de confirmation
 */
export async function getPendingVisits(agentId: string): Promise<VisitWithDetails[]> {
  return getAgentVisits(agentId, 'pending');
}

// ============================================
// CRÉATION
// ============================================

/**
 * Créer une nouvelle visite
 */
export async function createVisit(visit: VisitInsert): Promise<Visit> {
  const { data, error } = await supabase
    .from('visits')
    .insert(visit)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Planifier une visite (depuis l'app client)
 */
export async function scheduleVisit(
  propertyId: string,
  agentId: string,
  clientId: string | null,
  scheduledAt: Date,
  notes?: string
): Promise<Visit> {
  return createVisit({
    property_id: propertyId,
    agent_id: agentId,
    client_id: clientId,
    scheduled_at: scheduledAt.toISOString(),
    duration_minutes: 30,
    status: 'pending',
    notes: notes || null,
    client_feedback: null,
    agent_notes: null,
    interest_level: null,
    reminder_sent: false,
  });
}

// ============================================
// MISE À JOUR
// ============================================

/**
 * Mettre à jour une visite
 */
export async function updateVisit(id: string, updates: VisitUpdate): Promise<Visit> {
  const { data, error } = await supabase
    .from('visits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Confirmer une visite
 */
export async function confirmVisit(id: string): Promise<Visit> {
  return updateVisit(id, { status: 'confirmed' });
}

/**
 * Annuler une visite
 */
export async function cancelVisit(id: string, reason?: string): Promise<Visit> {
  return updateVisit(id, {
    status: 'cancelled',
    notes: reason,
  });
}

/**
 * Marquer comme terminée avec feedback
 */
export async function completeVisit(
  id: string,
  clientFeedback?: string,
  agentNotes?: string,
  interestLevel?: number
): Promise<Visit> {
  return updateVisit(id, {
    status: 'completed',
    client_feedback: clientFeedback || null,
    agent_notes: agentNotes || null,
    interest_level: interestLevel || null,
  });
}

/**
 * Marquer comme no-show (client absent)
 */
export async function markNoShow(id: string, notes?: string): Promise<Visit> {
  return updateVisit(id, {
    status: 'no_show',
    agent_notes: notes || null,
  });
}

/**
 * Reprogrammer une visite
 */
export async function rescheduleVisit(id: string, newDate: Date): Promise<Visit> {
  return updateVisit(id, {
    scheduled_at: newDate.toISOString(),
    status: 'pending',
    reminder_sent: false,
  });
}

/**
 * Marquer le rappel comme envoyé
 */
export async function markReminderSent(id: string): Promise<Visit> {
  return updateVisit(id, { reminder_sent: true });
}

// ============================================
// SUPPRESSION
// ============================================

/**
 * Supprimer une visite
 */
export async function deleteVisit(id: string): Promise<void> {
  const { error } = await supabase.from('visits').delete().eq('id', id);

  if (error) throw error;
}

// ============================================
// STATISTIQUES
// ============================================

/**
 * Stats des visites par statut
 */
export async function getVisitStatsByStatus(
  agentId: string
): Promise<Record<VisitStatus, number>> {
  const { data, error } = await supabase
    .from('visits')
    .select('status')
    .eq('agent_id', agentId);

  if (error) throw error;

  const stats: Record<VisitStatus, number> = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
  };

  (data || []).forEach((visit) => {
    stats[visit.status as VisitStatus]++;
  });

  return stats;
}

/**
 * Nombre de visites ce mois
 */
export async function getMonthlyVisitCount(agentId?: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  let query = supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .gte('scheduled_at', startOfMonth.toISOString());

  if (agentId) {
    query = query.eq('agent_id', agentId);
  }

  const { count, error } = await query;

  if (error) throw error;

  return count || 0;
}

/**
 * Taux de conversion visite -> intérêt élevé
 */
export async function getHighInterestRate(agentId: string): Promise<number> {
  const { data, error } = await supabase
    .from('visits')
    .select('interest_level')
    .eq('agent_id', agentId)
    .eq('status', 'completed')
    .not('interest_level', 'is', null);

  if (error) throw error;

  const total = data?.length || 0;
  const highInterest = data?.filter((v) => (v.interest_level || 0) >= 4).length || 0;

  return total > 0 ? (highInterest / total) * 100 : 0;
}
