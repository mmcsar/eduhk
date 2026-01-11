/**
 * MMC Immo - API Dashboard
 * Fonctions pour les dashboards agent et admin
 */

import { supabase } from '../supabase';
import type {
  AdminDashboardStats,
  AgentStats,
  PropertyWithAgent,
  LeadWithDetails,
  VisitWithDetails,
} from '../database.types';

// ============================================
// DASHBOARD ADMIN
// ============================================

/**
 * Récupérer les statistiques globales du dashboard admin
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data, error } = await supabase
    .from('admin_dashboard_stats')
    .select('*')
    .single();

  if (error) throw error;

  return data as AdminDashboardStats;
}

/**
 * Récupérer les propriétés récentes (admin)
 */
export async function getRecentProperties(limit: number = 10): Promise<PropertyWithAgent[]> {
  const { data, error } = await supabase
    .from('properties_with_agent')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data as unknown as PropertyWithAgent[]) || [];
}

/**
 * Récupérer l'évolution des propriétés sur les 30 derniers jours
 */
export async function getPropertiesTrend(
  days: number = 30
): Promise<{ date: string; count: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('properties')
    .select('created_at')
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  const properties = (data || []) as { created_at: string }[];
  
  // Grouper par jour
  const grouped = properties.reduce((acc, prop) => {
    const date = new Date(prop.created_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Remplir les jours manquants
  const result: { date: string; count: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({ date: dateStr, count: grouped[dateStr] || 0 });
  }

  return result;
}

/**
 * Récupérer l'évolution des leads sur les 30 derniers jours
 */
export async function getLeadsTrend(
  days: number = 30
): Promise<{ date: string; count: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('leads')
    .select('created_at')
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  const leads = (data || []) as { created_at: string }[];
  
  // Grouper par jour
  const grouped = leads.reduce((acc, lead) => {
    const date = new Date(lead.created_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Remplir les jours manquants
  const result: { date: string; count: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    result.push({ date: dateStr, count: grouped[dateStr] || 0 });
  }

  return result;
}

/**
 * Revenue estimé (basé sur les ventes)
 */
export async function getEstimatedRevenue(
  period: 'month' | 'year' = 'month'
): Promise<number> {
  const startDate = new Date();
  if (period === 'month') {
    startDate.setMonth(startDate.getMonth() - 1);
  } else {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const { data, error } = await supabase
    .from('properties')
    .select('price, agent_id')
    .eq('status', 'sold')
    .gte('updated_at', startDate.toISOString());

  if (error) throw error;

  const properties = (data || []) as { price: number; agent_id: string }[];
  
  // Calculer la commission totale (supposons 5% par défaut)
  const totalRevenue = properties.reduce((sum, prop) => {
    return sum + (prop.price * 0.05); // 5% commission
  }, 0);

  return totalRevenue;
}

/**
 * Répartition par quartier
 */
export async function getDistributionByNeighborhood(): Promise<
  { neighborhood: string; count: number }[]
> {
  const { data, error } = await supabase
    .from('properties')
    .select('neighborhood')
    .eq('is_published', true);

  if (error) throw error;

  const properties = (data || []) as { neighborhood: string | null }[];
  
  // Grouper par quartier
  const grouped = properties.reduce((acc, prop) => {
    const n = prop.neighborhood || 'Autre';
    acc[n] = (acc[n] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped)
    .map(([neighborhood, count]) => ({ neighborhood, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Répartition par type de propriété
 */
export async function getDistributionByType(): Promise<
  { type: string; count: number }[]
> {
  const { data, error } = await supabase
    .from('properties')
    .select('type')
    .eq('is_published', true);

  if (error) throw error;

  const properties = (data || []) as { type: string }[];
  
  const grouped = properties.reduce((acc, prop) => {
    acc[prop.type] = (acc[prop.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped).map(([type, count]) => ({ type, count }));
}

/**
 * Répartition par gamme de prix
 */
export async function getDistributionByPriceRange(): Promise<
  { range: string; count: number }[]
> {
  const { data, error } = await supabase
    .from('properties')
    .select('price')
    .eq('is_published', true)
    .eq('transaction_type', 'sale');

  if (error) throw error;

  const properties = (data || []) as { price: number }[];
  
  const ranges = [
    { label: '< 50k', min: 0, max: 50000 },
    { label: '50k - 100k', min: 50000, max: 100000 },
    { label: '100k - 200k', min: 100000, max: 200000 },
    { label: '200k - 500k', min: 200000, max: 500000 },
    { label: '> 500k', min: 500000, max: Infinity },
  ];

  return ranges.map((r) => ({
    range: r.label,
    count: properties.filter((p) => p.price >= r.min && p.price < r.max).length,
  }));
}

// ============================================
// DASHBOARD AGENT
// ============================================

/**
 * Récupérer les stats d'un agent pour son dashboard
 */
export async function getAgentDashboardStats(agentId: string): Promise<AgentStats | null> {
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
 * Activité récente d'un agent
 */
export interface AgentActivity {
  type: 'property' | 'lead' | 'visit';
  title: string;
  description: string;
  timestamp: string;
  id: string;
}

export async function getAgentRecentActivity(
  agentId: string,
  limit: number = 10
): Promise<AgentActivity[]> {
  const activities: AgentActivity[] = [];

  // Propriétés récentes
  const { data: propertiesData } = await supabase
    .from('properties')
    .select('id, title, created_at')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(5);

  const properties = (propertiesData || []) as { id: string; title: string; created_at: string }[];
  properties.forEach((p) => {
    activities.push({
      type: 'property',
      title: 'Nouvelle propriété',
      description: p.title,
      timestamp: p.created_at,
      id: p.id,
    });
  });

  // Leads récents
  const { data: leadsData } = await supabase
    .from('leads')
    .select('id, client_name, client_phone, created_at')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(5);

  const leads = (leadsData || []) as { id: string; client_name: string | null; client_phone: string | null; created_at: string }[];
  leads.forEach((l) => {
    activities.push({
      type: 'lead',
      title: 'Nouveau lead',
      description: l.client_name || l.client_phone || 'Lead anonyme',
      timestamp: l.created_at,
      id: l.id,
    });
  });

  // Visites récentes
  const { data: visitsData } = await supabase
    .from('visits')
    .select('id, scheduled_at, status, created_at')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(5);

  const visits = (visitsData || []) as { id: string; scheduled_at: string; status: string; created_at: string }[];
  visits.forEach((v) => {
    activities.push({
      type: 'visit',
      title: 'Visite ' + v.status,
      description: new Date(v.scheduled_at).toLocaleDateString('fr-FR'),
      timestamp: v.created_at,
      id: v.id,
    });
  });

  // Trier par date et limiter
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/**
 * Performance mensuelle d'un agent
 */
export interface MonthlyPerformance {
  month: string;
  properties: number;
  leads: number;
  visits: number;
  conversions: number;
}

export async function getAgentMonthlyPerformance(
  agentId: string,
  months: number = 6
): Promise<MonthlyPerformance[]> {
  const result: MonthlyPerformance[] = [];

  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const monthStr = startOfMonth.toLocaleDateString('fr-FR', {
      month: 'short',
      year: '2-digit',
    });

    // Compter les propriétés
    const { count: propCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString());

    // Compter les leads
    const { count: leadCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString());

    // Compter les visites
    const { count: visitCount } = await supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)
      .gte('scheduled_at', startOfMonth.toISOString())
      .lte('scheduled_at', endOfMonth.toISOString());

    // Compter les conversions
    const { count: convCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId)
      .eq('status', 'won')
      .gte('converted_at', startOfMonth.toISOString())
      .lte('converted_at', endOfMonth.toISOString());

    result.push({
      month: monthStr,
      properties: propCount || 0,
      leads: leadCount || 0,
      visits: visitCount || 0,
      conversions: convCount || 0,
    });
  }

  return result.reverse();
}

/**
 * Résumé rapide pour dashboard agent
 */
export interface AgentDashboardSummary {
  stats: AgentStats | null;
  todayVisits: VisitWithDetails[];
  pendingLeads: LeadWithDetails[];
  recentActivity: AgentActivity[];
}

export async function getAgentDashboardSummary(
  agentId: string
): Promise<AgentDashboardSummary> {
  const [stats, todayVisits, pendingLeads, recentActivity] = await Promise.all([
    getAgentDashboardStats(agentId),
    // Visites du jour
    (async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data } = await supabase
        .from('visits')
        .select(
          `*, property:properties(id, title, address), client:clients(id, full_name, phone)`
        )
        .eq('agent_id', agentId)
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())
        .order('scheduled_at', { ascending: true });

      return (data as unknown as VisitWithDetails[]) || [];
    })(),
    // Leads en attente
    (async () => {
      const { data } = await supabase
        .from('leads')
        .select(
          `*, property:properties(id, title, images)`
        )
        .eq('agent_id', agentId)
        .in('status', ['new', 'contacted'])
        .order('created_at', { ascending: false })
        .limit(5);

      return (data as unknown as LeadWithDetails[]) || [];
    })(),
    getAgentRecentActivity(agentId, 5),
  ]);

  return {
    stats,
    todayVisits,
    pendingLeads,
    recentActivity,
  };
}
