/**
 * MMC Immo - Types TypeScript générés pour Supabase
 * Types de la base de données pour l'application immobilière Lubumbashi
 */

// ============================================
// TYPES ÉNUMÉRÉS
// ============================================

export type UserRole = 'admin' | 'agent';

export type PropertyType = 'house' | 'apartment' | 'land' | 'villa' | 'commercial' | 'warehouse';

export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'off_market';

export type TransactionType = 'sale' | 'rent';

export type VisitStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';

export type LeadSource = 'app' | 'website' | 'facebook' | 'instagram' | 'whatsapp' | 'referral' | 'walk_in' | 'other';

// ============================================
// TABLES
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  commission_rate: number;
  is_active: boolean;
  bio: string | null;
  whatsapp_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  agent_id: string | null;
  
  // Informations de base
  title: string;
  description: string | null;
  type: PropertyType;
  status: PropertyStatus;
  transaction_type: TransactionType;
  
  // Localisation
  city: string;
  neighborhood: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  
  // Prix
  price: number;
  currency: string;
  price_negotiable: boolean;
  
  // Caractéristiques
  bedrooms: number;
  bathrooms: number;
  surface_area: number | null;
  land_area: number | null;
  floors: number;
  year_built: number | null;
  
  // Équipements
  has_parking: boolean;
  parking_spots: number;
  has_garden: boolean;
  has_pool: boolean;
  has_security: boolean;
  has_generator: boolean;
  has_water_tank: boolean;
  has_air_conditioning: boolean;
  furnished: boolean;
  
  // Médias
  images: string[];
  video_url: string | null;
  virtual_tour_url: string | null;
  
  // Statistiques
  views_count: number;
  favorites_count: number;
  leads_count: number;
  
  // Métadonnées
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  
  // Préférences
  preferred_budget_min: number | null;
  preferred_budget_max: number | null;
  preferred_neighborhoods: string[];
  preferred_property_types: PropertyType[];
  preferred_transaction_type: TransactionType | null;
  preferred_bedrooms_min: number | null;
  
  notes: string | null;
  source: LeadSource;
  created_at: string;
  updated_at: string;
}

export interface Visit {
  id: string;
  property_id: string;
  agent_id: string | null;
  client_id: string | null;
  
  scheduled_at: string;
  duration_minutes: number;
  status: VisitStatus;
  
  notes: string | null;
  client_feedback: string | null;
  agent_notes: string | null;
  interest_level: number | null; // 1-5
  
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  property_id: string | null;
  agent_id: string | null;
  client_id: string | null;
  
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  
  first_contact_at: string | null;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  
  notes: string | null;
  converted_at: string | null;
  conversion_value: number | null;
  
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  client_phone: string;
  property_id: string;
  created_at: string;
}

export interface PropertyView {
  id: string;
  property_id: string;
  viewer_phone: string | null;
  viewer_ip: string | null;
  user_agent: string | null;
  source: string | null;
  viewed_at: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  city: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  is_popular: boolean;
  average_price_sale: number | null;
  average_price_rent: number | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  title: string;
  body: string | null;
  type: string;
  reference_type: string | null;
  reference_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

// ============================================
// TYPES D'INSERTION (sans id ni timestamps)
// ============================================

export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count' | 'leads_count' | 'published_at'> & {
  id?: string;
};

export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type VisitInsert = Omit<Visit, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type FavoriteInsert = Omit<Favorite, 'id' | 'created_at'> & {
  id?: string;
};

export type NotificationInsert = Omit<Notification, 'id' | 'created_at'> & {
  id?: string;
};

// ============================================
// TYPES DE MISE À JOUR (tous optionnels)
// ============================================

export type UserUpdate = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
export type PropertyUpdate = Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>;
export type ClientUpdate = Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;
export type VisitUpdate = Partial<Omit<Visit, 'id' | 'created_at' | 'updated_at'>>;
export type LeadUpdate = Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>;

// ============================================
// TYPES AVEC RELATIONS
// ============================================

export interface PropertyWithAgent extends Property {
  agent: User | null;
}

export interface PropertyWithDetails extends Property {
  agent: User | null;
  visits: Visit[];
  leads: Lead[];
}

export interface VisitWithDetails extends Visit {
  property: Property | null;
  agent: User | null;
  client: Client | null;
}

export interface LeadWithDetails extends Lead {
  property: Property | null;
  agent: User | null;
  client: Client | null;
}

// ============================================
// TYPES POUR VUES
// ============================================

export interface AgentStats {
  id: string;
  full_name: string;
  email: string;
  total_properties: number;
  available_properties: number;
  sold_properties: number;
  rented_properties: number;
  total_leads: number;
  converted_leads: number;
  total_visits: number;
  total_views: number;
}

export interface AdminDashboardStats {
  total_properties: number;
  available_properties: number;
  sold_properties: number;
  rented_properties: number;
  leads_this_month: number;
  visits_this_month: number;
  total_views: number;
  active_agents: number;
}

// ============================================
// TYPES POUR FILTRES DE RECHERCHE
// ============================================

export interface PropertyFilters {
  city?: string;
  neighborhood?: string;
  neighborhoods?: string[];
  type?: PropertyType;
  types?: PropertyType[];
  transaction_type?: TransactionType;
  status?: PropertyStatus;
  price_min?: number;
  price_max?: number;
  bedrooms_min?: number;
  bedrooms_max?: number;
  bathrooms_min?: number;
  surface_area_min?: number;
  surface_area_max?: number;
  has_parking?: boolean;
  has_garden?: boolean;
  has_pool?: boolean;
  has_security?: boolean;
  has_generator?: boolean;
  furnished?: boolean;
  is_featured?: boolean;
  agent_id?: string;
  search?: string; // Recherche textuelle
}

export interface PropertySortOptions {
  field: 'price' | 'created_at' | 'views_count' | 'surface_area' | 'bedrooms';
  direction: 'asc' | 'desc';
}

// ============================================
// TYPES SUPABASE DATABASE
// ============================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: UserInsert;
        Update: UserUpdate;
      };
      properties: {
        Row: Property;
        Insert: PropertyInsert;
        Update: PropertyUpdate;
      };
      clients: {
        Row: Client;
        Insert: ClientInsert;
        Update: ClientUpdate;
      };
      visits: {
        Row: Visit;
        Insert: VisitInsert;
        Update: VisitUpdate;
      };
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
      };
      favorites: {
        Row: Favorite;
        Insert: FavoriteInsert;
        Update: never;
      };
      property_views: {
        Row: PropertyView;
        Insert: Omit<PropertyView, 'id' | 'viewed_at'>;
        Update: never;
      };
      neighborhoods: {
        Row: Neighborhood;
        Insert: Omit<Neighborhood, 'id' | 'created_at'>;
        Update: Partial<Omit<Neighborhood, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: NotificationInsert;
        Update: Partial<Pick<Notification, 'is_read' | 'read_at'>>;
      };
    };
    Views: {
      properties_with_agent: {
        Row: Property & {
          agent_name: string | null;
          agent_phone: string | null;
          agent_whatsapp: string | null;
          agent_avatar: string | null;
        };
      };
      agent_stats: {
        Row: AgentStats;
      };
      admin_dashboard_stats: {
        Row: AdminDashboardStats;
      };
    };
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_active_agent: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      property_type: PropertyType;
      property_status: PropertyStatus;
      transaction_type: TransactionType;
      visit_status: VisitStatus;
      lead_status: LeadStatus;
      lead_source: LeadSource;
    };
  };
}

// ============================================
// CONSTANTES
// ============================================

export const LUBUMBASHI_NEIGHBORHOODS = [
  'Golf',
  'Bel-Air',
  'Katuba',
  'Kenya',
  'Rwashi',
  'Kampemba',
  'Annexe',
  'Commune Lubumbashi',
  'Kamalondo',
  'Ruashi',
  'Kigoma',
  'Kasungami',
  'Lido Golf',
] as const;

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'Maison' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Terrain' },
  { value: 'commercial', label: 'Local commercial' },
  { value: 'warehouse', label: 'Entrepôt' },
];

export const PROPERTY_STATUSES: { value: PropertyStatus; label: string; color: string }[] = [
  { value: 'available', label: 'Disponible', color: '#10b981' },
  { value: 'reserved', label: 'Réservé', color: '#f59e0b' },
  { value: 'sold', label: 'Vendu', color: '#6366f1' },
  { value: 'rented', label: 'Loué', color: '#8b5cf6' },
  { value: 'off_market', label: 'Hors marché', color: '#6b7280' },
];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: 'sale', label: 'Vente' },
  { value: 'rent', label: 'Location' },
];

export const LEAD_SOURCES: { value: LeadSource; label: string; icon: string }[] = [
  { value: 'app', label: 'Application', icon: '📱' },
  { value: 'website', label: 'Site web', icon: '🌐' },
  { value: 'facebook', label: 'Facebook', icon: '👤' },
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'referral', label: 'Recommandation', icon: '🤝' },
  { value: 'walk_in', label: 'Visite directe', icon: '🚶' },
  { value: 'other', label: 'Autre', icon: '📋' },
];

export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new', label: 'Nouveau', color: '#3b82f6' },
  { value: 'contacted', label: 'Contacté', color: '#8b5cf6' },
  { value: 'qualified', label: 'Qualifié', color: '#f59e0b' },
  { value: 'negotiation', label: 'Négociation', color: '#ec4899' },
  { value: 'won', label: 'Gagné', color: '#10b981' },
  { value: 'lost', label: 'Perdu', color: '#ef4444' },
];

export const VISIT_STATUSES: { value: VisitStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'En attente', color: '#f59e0b' },
  { value: 'confirmed', label: 'Confirmée', color: '#3b82f6' },
  { value: 'completed', label: 'Effectuée', color: '#10b981' },
  { value: 'cancelled', label: 'Annulée', color: '#ef4444' },
  { value: 'no_show', label: 'Absent', color: '#6b7280' },
];
