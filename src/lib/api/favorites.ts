/**
 * MMC Immo - API Favoris
 * Fonctions pour gérer les propriétés favorites
 */

import { supabase } from '../supabase';
import type { Favorite, PropertyWithAgent } from '../database.types';

// ============================================
// LECTURE
// ============================================

/**
 * Récupérer les favoris d'un utilisateur (par téléphone)
 */
export async function getFavorites(clientPhone: string): Promise<PropertyWithAgent[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(
      `
      property_id,
      properties_with_agent:property_id(*)
    `
    )
    .eq('client_phone', clientPhone)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Extraire les propriétés
  return (data || [])
    .map((fav: any) => fav.properties_with_agent)
    .filter((p: any) => p !== null) as PropertyWithAgent[];
}

/**
 * Vérifier si une propriété est dans les favoris
 */
export async function isFavorite(clientPhone: string, propertyId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('client_phone', clientPhone)
    .eq('property_id', propertyId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return false; // Not found
    throw error;
  }

  return !!data;
}

/**
 * Récupérer les IDs des propriétés favorites
 */
export async function getFavoriteIds(clientPhone: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('property_id')
    .eq('client_phone', clientPhone);

  if (error) throw error;

  const favorites = (data || []) as { property_id: string }[];
  return favorites.map((fav) => fav.property_id);
}

/**
 * Compter les favoris d'un utilisateur
 */
export async function countFavorites(clientPhone: string): Promise<number> {
  const { count, error } = await supabase
    .from('favorites')
    .select('*', { count: 'exact', head: true })
    .eq('client_phone', clientPhone);

  if (error) throw error;

  return count || 0;
}

// ============================================
// CRÉATION / SUPPRESSION
// ============================================

/**
 * Ajouter une propriété aux favoris
 */
export async function addToFavorites(
  clientPhone: string,
  propertyId: string
): Promise<Favorite> {
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      client_phone: clientPhone,
      property_id: propertyId,
    } as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    // Déjà existant (contrainte unique)
    if (error.code === '23505') {
      const { data: existing } = await supabase
        .from('favorites')
        .select('*')
        .eq('client_phone', clientPhone)
        .eq('property_id', propertyId)
        .single();
      return existing as Favorite;
    }
    throw error;
  }

  return data as Favorite;
}

/**
 * Retirer une propriété des favoris
 */
export async function removeFromFavorites(
  clientPhone: string,
  propertyId: string
): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('client_phone', clientPhone)
    .eq('property_id', propertyId);

  if (error) throw error;
}

/**
 * Toggle favori (ajouter si pas présent, retirer si présent)
 */
export async function toggleFavorite(
  clientPhone: string,
  propertyId: string
): Promise<boolean> {
  const isAlreadyFavorite = await isFavorite(clientPhone, propertyId);

  if (isAlreadyFavorite) {
    await removeFromFavorites(clientPhone, propertyId);
    return false;
  } else {
    await addToFavorites(clientPhone, propertyId);
    return true;
  }
}

/**
 * Supprimer tous les favoris d'un utilisateur
 */
export async function clearFavorites(clientPhone: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('client_phone', clientPhone);

  if (error) throw error;
}

// ============================================
// SYNCHRONISATION LOCALE
// ============================================

/**
 * Synchroniser les favoris locaux avec le serveur
 * (Utile pour l'app mobile avec stockage local)
 */
export async function syncFavorites(
  clientPhone: string,
  localFavoriteIds: string[]
): Promise<string[]> {
  // Récupérer les favoris du serveur
  const serverFavoriteIds = await getFavoriteIds(clientPhone);

  // Favoris à ajouter (présents localement mais pas sur serveur)
  const toAdd = localFavoriteIds.filter((id) => !serverFavoriteIds.includes(id));

  // Ajouter les nouveaux favoris
  if (toAdd.length > 0) {
    const insertData = toAdd.map((property_id) => ({
      client_phone: clientPhone,
      property_id,
    }));
    
    const { error } = await supabase
      .from('favorites')
      .insert(insertData as Record<string, unknown>[]);

    if (error) {
      console.warn('Erreur sync favoris:', error);
    }
  }

  // Retourner la liste fusionnée (sans doublons)
  return [...new Set([...serverFavoriteIds, ...localFavoriteIds])];
}
