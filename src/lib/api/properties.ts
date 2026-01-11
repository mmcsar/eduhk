/**
 * MMC Immo - API Propriétés
 * Fonctions CRUD pour les propriétés immobilières
 */

import { supabase } from '../supabase';
import type {
  Property,
  PropertyInsert,
  PropertyUpdate,
  PropertyFilters,
  PropertySortOptions,
  PropertyWithAgent,
} from '../database.types';

// Type helper pour les réponses Supabase
type SupabaseResponse<T> = { data: T | null; error: Error | null };

// ============================================
// LECTURE
// ============================================

/**
 * Récupérer toutes les propriétés publiées avec filtres
 */
export async function getProperties(
  filters?: PropertyFilters,
  sort?: PropertySortOptions,
  page: number = 1,
  pageSize: number = 20
): Promise<{ data: PropertyWithAgent[]; count: number }> {
  let query = supabase
    .from('properties_with_agent')
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  // Appliquer les filtres
  if (filters) {
    if (filters.city) {
      query = query.eq('city', filters.city);
    }
    if (filters.neighborhood) {
      query = query.eq('neighborhood', filters.neighborhood);
    }
    if (filters.neighborhoods && filters.neighborhoods.length > 0) {
      query = query.in('neighborhood', filters.neighborhoods);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.types && filters.types.length > 0) {
      query = query.in('type', filters.types);
    }
    if (filters.transaction_type) {
      query = query.eq('transaction_type', filters.transaction_type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.price_min !== undefined) {
      query = query.gte('price', filters.price_min);
    }
    if (filters.price_max !== undefined) {
      query = query.lte('price', filters.price_max);
    }
    if (filters.bedrooms_min !== undefined) {
      query = query.gte('bedrooms', filters.bedrooms_min);
    }
    if (filters.bedrooms_max !== undefined) {
      query = query.lte('bedrooms', filters.bedrooms_max);
    }
    if (filters.bathrooms_min !== undefined) {
      query = query.gte('bathrooms', filters.bathrooms_min);
    }
    if (filters.surface_area_min !== undefined) {
      query = query.gte('surface_area', filters.surface_area_min);
    }
    if (filters.surface_area_max !== undefined) {
      query = query.lte('surface_area', filters.surface_area_max);
    }
    if (filters.has_parking !== undefined) {
      query = query.eq('has_parking', filters.has_parking);
    }
    if (filters.has_garden !== undefined) {
      query = query.eq('has_garden', filters.has_garden);
    }
    if (filters.has_pool !== undefined) {
      query = query.eq('has_pool', filters.has_pool);
    }
    if (filters.has_security !== undefined) {
      query = query.eq('has_security', filters.has_security);
    }
    if (filters.has_generator !== undefined) {
      query = query.eq('has_generator', filters.has_generator);
    }
    if (filters.furnished !== undefined) {
      query = query.eq('furnished', filters.furnished);
    }
    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }
    if (filters.agent_id) {
      query = query.eq('agent_id', filters.agent_id);
    }
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,neighborhood.ilike.%${filters.search}%`
      );
    }
  }

  // Tri
  if (sort) {
    query = query.order(sort.field, { ascending: sort.direction === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: (data as unknown as PropertyWithAgent[]) || [],
    count: count || 0,
  };
}

/**
 * Récupérer une propriété par ID
 */
export async function getPropertyById(id: string): Promise<PropertyWithAgent | null> {
  const { data, error } = await supabase
    .from('properties_with_agent')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data as unknown as PropertyWithAgent;
}

/**
 * Récupérer les propriétés en vedette
 */
export async function getFeaturedProperties(limit: number = 6): Promise<PropertyWithAgent[]> {
  const { data, error } = await supabase
    .from('properties_with_agent')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data as unknown as PropertyWithAgent[]) || [];
}

/**
 * Récupérer les propriétés d'un agent
 */
export async function getAgentProperties(agentId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data || [];
}

/**
 * Propriétés similaires
 */
export async function getSimilarProperties(
  property: Property,
  limit: number = 4
): Promise<PropertyWithAgent[]> {
  const { data, error } = await supabase
    .from('properties_with_agent')
    .select('*')
    .eq('is_published', true)
    .eq('status', 'available')
    .eq('transaction_type', property.transaction_type)
    .neq('id', property.id)
    .or(
      `neighborhood.eq.${property.neighborhood},type.eq.${property.type}`
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data as unknown as PropertyWithAgent[]) || [];
}

// ============================================
// CRÉATION
// ============================================

/**
 * Créer une nouvelle propriété
 */
export async function createProperty(property: PropertyInsert): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert(property as Record<string, unknown>)
    .select()
    .single();

  if (error) throw error;

  return data as Property;
}

// ============================================
// MISE À JOUR
// ============================================

/**
 * Mettre à jour une propriété
 */
export async function updateProperty(id: string, updates: PropertyUpdate): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .update(updates as Record<string, unknown>)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data as Property;
}

/**
 * Publier/Dépublier une propriété
 */
export async function togglePublishProperty(id: string, isPublished: boolean): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .update({ is_published: isPublished })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Mettre en vedette une propriété
 */
export async function toggleFeatureProperty(id: string, isFeatured: boolean): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .update({ is_featured: isFeatured })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Changer le statut d'une propriété
 */
export async function updatePropertyStatus(
  id: string,
  status: Property['status']
): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// SUPPRESSION
// ============================================

/**
 * Supprimer une propriété
 */
export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================
// ANALYTICS
// ============================================

/**
 * Enregistrer une vue de propriété
 */
export async function trackPropertyView(
  propertyId: string,
  viewerPhone?: string,
  source: string = 'app'
): Promise<void> {
  const { error } = await supabase
    .from('property_views')
    .insert({
      property_id: propertyId,
      viewer_phone: viewerPhone,
      source,
    });

  if (error) {
    console.warn('Erreur tracking view:', error);
  }
}

/**
 * Récupérer les stats de vues d'une propriété
 */
export async function getPropertyViewStats(
  propertyId: string,
  days: number = 30
): Promise<{ date: string; count: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('property_views')
    .select('viewed_at')
    .eq('property_id', propertyId)
    .gte('viewed_at', startDate.toISOString());

  if (error) throw error;

  // Grouper par jour
  const grouped = (data || []).reduce((acc, view) => {
    const date = new Date(view.viewed_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}
