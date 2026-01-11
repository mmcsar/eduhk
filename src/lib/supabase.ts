/**
 * MMC Immo - Configuration du client Supabase
 * Client pour l'application immobilière Lubumbashi
 */

import { createClient, SupabaseClient as SupabaseClientBase } from '@supabase/supabase-js';

// ============================================
// CONFIGURATION
// ============================================

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Variables Supabase manquantes. Créez un fichier .env avec:\n' +
    'VITE_SUPABASE_URL=https://votre-projet.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=votre-anon-key'
  );
}

// ============================================
// CLIENT SUPABASE
// ============================================

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-app-name': 'mmc-immo',
      },
    },
  }
);

// ============================================
// HELPERS D'AUTHENTIFICATION
// ============================================

/**
 * Connexion avec email/password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

/**
 * Déconnexion
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Récupérer la session courante
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Récupérer l'utilisateur courant
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Écouter les changements d'authentification
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// ============================================
// HELPERS STORAGE
// ============================================

const PROPERTY_IMAGES_BUCKET = 'property-images';
const AVATARS_BUCKET = 'avatars';

/**
 * Upload une image de propriété
 */
export async function uploadPropertyImage(
  propertyId: string,
  file: File,
  index: number = 0
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${propertyId}/${index}-${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .getPublicUrl(fileName);
  
  return publicUrl;
}

/**
 * Supprimer une image de propriété
 */
export async function deletePropertyImage(imageUrl: string): Promise<void> {
  // Extraire le chemin du fichier depuis l'URL
  const url = new URL(imageUrl);
  const path = url.pathname.split(`/${PROPERTY_IMAGES_BUCKET}/`)[1];
  
  if (!path) throw new Error('Chemin d\'image invalide');
  
  const { error } = await supabase.storage
    .from(PROPERTY_IMAGES_BUCKET)
    .remove([path]);
  
  if (error) throw error;
}

/**
 * Upload un avatar
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  
  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(fileName);
  
  return publicUrl;
}

// ============================================
// HELPERS REALTIME
// ============================================

/**
 * S'abonner aux nouvelles propriétés
 */
export function subscribeToNewProperties(callback: (payload: any) => void) {
  return supabase
    .channel('public:properties')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'properties',
        filter: 'is_published=eq.true',
      },
      callback
    )
    .subscribe();
}

/**
 * S'abonner aux notifications d'un agent
 */
export function subscribeToNotifications(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * S'abonner aux nouveaux leads pour un agent
 */
export function subscribeToLeads(agentId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`leads:${agentId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'leads',
        filter: `agent_id=eq.${agentId}`,
      },
      callback
    )
    .subscribe();
}

// ============================================
// EXPORT TYPE-SAFE
// ============================================

export type SupabaseClient = SupabaseClientBase;
