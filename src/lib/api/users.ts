/**
 * MMC Immo - API Users
 * Fonctions CRUD pour les utilisateurs (agents et admin)
 */

import { supabase } from '../supabase';
import type {
  User,
  UserInsert,
  UserUpdate,
  UserRole,
  AgentStats,
} from '../database.types';

// ============================================
// LECTURE
// ============================================

/**
 * Récupérer tous les agents actifs
 */
export async function getActiveAgents(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'agent')
    .eq('is_active', true)
    .order('full_name', { ascending: true });

  if (error) throw error;

  return data || [];
}

/**
 * Récupérer tous les utilisateurs (admin only)
 */
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
}

/**
 * Récupérer un utilisateur par ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Récupérer un utilisateur par email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export async function getCurrentUserProfile(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  return getUserById(user.id);
}

/**
 * Récupérer les stats d'un agent
 */
export async function getAgentStats(agentId: string): Promise<AgentStats | null> {
  const { data, error } = await supabase
    .from('agent_stats')
    .select('*')
    .eq('id', agentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as AgentStats;
}

/**
 * Récupérer les stats de tous les agents (classement)
 */
export async function getAllAgentStats(): Promise<AgentStats[]> {
  const { data, error } = await supabase
    .from('agent_stats')
    .select('*')
    .order('total_properties', { ascending: false });

  if (error) throw error;

  return (data as AgentStats[]) || [];
}

// ============================================
// CRÉATION
// ============================================

/**
 * Créer un nouvel utilisateur (après auth signup)
 */
export async function createUser(user: UserInsert): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Créer un agent (admin only)
 */
export async function createAgent(
  email: string,
  fullName: string,
  phone: string,
  commissionRate: number = 5.0
): Promise<User> {
  // Note: L'admin doit d'abord créer le compte auth via Supabase Dashboard
  // ou via l'API admin (service_role key)
  
  return createUser({
    email,
    full_name: fullName,
    phone,
    role: 'agent',
    commission_rate: commissionRate,
    is_active: true,
    avatar_url: null,
    bio: null,
    whatsapp_number: phone, // Par défaut même numéro
  });
}

// ============================================
// MISE À JOUR
// ============================================

/**
 * Mettre à jour un utilisateur
 */
export async function updateUser(id: string, updates: UserUpdate): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/**
 * Mettre à jour son propre profil
 */
export async function updateMyProfile(updates: UserUpdate): Promise<User> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Non authentifié');

  // Filtrer les champs autorisés (un agent ne peut pas changer son rôle)
  const allowedUpdates: UserUpdate = {
    full_name: updates.full_name,
    phone: updates.phone,
    avatar_url: updates.avatar_url,
    bio: updates.bio,
    whatsapp_number: updates.whatsapp_number,
  };

  return updateUser(user.id, allowedUpdates);
}

/**
 * Activer/Désactiver un agent (admin only)
 */
export async function toggleUserActive(id: string, isActive: boolean): Promise<User> {
  return updateUser(id, { is_active: isActive });
}

/**
 * Modifier le taux de commission (admin only)
 */
export async function updateCommissionRate(
  id: string,
  commissionRate: number
): Promise<User> {
  return updateUser(id, { commission_rate: commissionRate });
}

/**
 * Changer le rôle (admin only)
 */
export async function updateUserRole(id: string, role: UserRole): Promise<User> {
  return updateUser(id, { role });
}

// ============================================
// SUPPRESSION
// ============================================

/**
 * Supprimer un utilisateur (admin only)
 * Note: Préférer désactiver plutôt que supprimer
 */
export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('id', id);

  if (error) throw error;
}

// ============================================
// RECHERCHE
// ============================================

/**
 * Rechercher des agents par nom
 */
export async function searchAgents(query: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'agent')
    .eq('is_active', true)
    .ilike('full_name', `%${query}%`)
    .limit(10);

  if (error) throw error;

  return data || [];
}

// ============================================
// CLASSEMENT
// ============================================

/**
 * Top agents par nombre de propriétés vendues
 */
export async function getTopAgentsBySales(limit: number = 10): Promise<AgentStats[]> {
  const { data, error } = await supabase
    .from('agent_stats')
    .select('*')
    .order('sold_properties', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data as AgentStats[]) || [];
}

/**
 * Top agents par nombre de leads
 */
export async function getTopAgentsByLeads(limit: number = 10): Promise<AgentStats[]> {
  const { data, error } = await supabase
    .from('agent_stats')
    .select('*')
    .order('total_leads', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data as AgentStats[]) || [];
}

/**
 * Top agents par taux de conversion
 */
export async function getTopAgentsByConversion(limit: number = 10): Promise<AgentStats[]> {
  const stats = await getAllAgentStats();
  
  return stats
    .map((s) => ({
      ...s,
      conversionRate: s.total_leads > 0 ? s.converted_leads / s.total_leads : 0,
    }))
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, limit);
}
