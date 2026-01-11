-- MMC Immo - Row Level Security (RLS) Policies
-- Sécurité au niveau des lignes pour Supabase

-- ============================================
-- ACTIVER RLS SUR TOUTES LES TABLES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Récupérer le rôle de l'utilisateur connecté
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Vérifier si l'utilisateur est agent actif
CREATE OR REPLACE FUNCTION is_active_agent()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role IN ('agent', 'admin') AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- POLICIES: USERS
-- ============================================

-- Lecture: Agents peuvent voir tous les utilisateurs actifs, Admin voit tout
CREATE POLICY "users_select_policy" ON users
  FOR SELECT
  USING (
    -- Utilisateur connecté
    auth.uid() IS NOT NULL AND (
      -- Admin voit tout
      is_admin() OR
      -- Agents voient les utilisateurs actifs
      (is_active_agent() AND is_active = true)
    )
  );

-- Insertion: Seulement Admin
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT
  WITH CHECK (is_admin());

-- Update: Admin peut tout modifier, agent peut modifier son propre profil
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE
  USING (
    is_admin() OR id = auth.uid()
  )
  WITH CHECK (
    is_admin() OR (id = auth.uid() AND role = (SELECT role FROM users WHERE id = auth.uid()))
  );

-- Delete: Seulement Admin
CREATE POLICY "users_delete_policy" ON users
  FOR DELETE
  USING (is_admin());

-- ============================================
-- POLICIES: PROPERTIES
-- ============================================

-- Lecture publique des propriétés publiées
CREATE POLICY "properties_public_select" ON properties
  FOR SELECT
  USING (
    -- Propriétés publiées = visibles par tous
    is_published = true
    OR
    -- Agents voient leurs propres propriétés
    (auth.uid() IS NOT NULL AND agent_id = auth.uid())
    OR
    -- Admin voit tout
    is_admin()
  );

-- Insertion: Agents actifs uniquement
CREATE POLICY "properties_insert_policy" ON properties
  FOR INSERT
  WITH CHECK (
    is_active_agent() AND (agent_id = auth.uid() OR is_admin())
  );

-- Update: Agent propriétaire ou Admin
CREATE POLICY "properties_update_policy" ON properties
  FOR UPDATE
  USING (
    agent_id = auth.uid() OR is_admin()
  )
  WITH CHECK (
    agent_id = auth.uid() OR is_admin()
  );

-- Delete: Agent propriétaire ou Admin
CREATE POLICY "properties_delete_policy" ON properties
  FOR DELETE
  USING (
    agent_id = auth.uid() OR is_admin()
  );

-- ============================================
-- POLICIES: CLIENTS
-- ============================================

-- Agents voient leurs clients (via leads/visits), Admin voit tout
CREATE POLICY "clients_select_policy" ON clients
  FOR SELECT
  USING (
    is_admin()
    OR
    EXISTS (
      SELECT 1 FROM leads WHERE leads.client_id = clients.id AND leads.agent_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM visits WHERE visits.client_id = clients.id AND visits.agent_id = auth.uid()
    )
  );

-- Insertion: Agents actifs
CREATE POLICY "clients_insert_policy" ON clients
  FOR INSERT
  WITH CHECK (is_active_agent());

-- Update: Agent lié ou Admin
CREATE POLICY "clients_update_policy" ON clients
  FOR UPDATE
  USING (
    is_admin()
    OR
    EXISTS (
      SELECT 1 FROM leads WHERE leads.client_id = clients.id AND leads.agent_id = auth.uid()
    )
  );

-- Delete: Admin seulement
CREATE POLICY "clients_delete_policy" ON clients
  FOR DELETE
  USING (is_admin());

-- ============================================
-- POLICIES: VISITS
-- ============================================

-- Agents voient leurs visites, Admin voit tout
CREATE POLICY "visits_select_policy" ON visits
  FOR SELECT
  USING (
    agent_id = auth.uid()
    OR
    is_admin()
    OR
    -- Agent propriétaire de la propriété
    EXISTS (
      SELECT 1 FROM properties WHERE properties.id = visits.property_id AND properties.agent_id = auth.uid()
    )
  );

-- Insertion: Agents actifs
CREATE POLICY "visits_insert_policy" ON visits
  FOR INSERT
  WITH CHECK (is_active_agent());

-- Update: Agent de la visite ou Admin
CREATE POLICY "visits_update_policy" ON visits
  FOR UPDATE
  USING (agent_id = auth.uid() OR is_admin());

-- Delete: Agent de la visite ou Admin
CREATE POLICY "visits_delete_policy" ON visits
  FOR DELETE
  USING (agent_id = auth.uid() OR is_admin());

-- ============================================
-- POLICIES: LEADS
-- ============================================

-- Agents voient leurs leads, Admin voit tout
CREATE POLICY "leads_select_policy" ON leads
  FOR SELECT
  USING (
    agent_id = auth.uid()
    OR
    is_admin()
    OR
    -- Agent propriétaire de la propriété
    EXISTS (
      SELECT 1 FROM properties WHERE properties.id = leads.property_id AND properties.agent_id = auth.uid()
    )
  );

-- Insertion: Publique (clients peuvent créer des leads) ou agents
CREATE POLICY "leads_insert_policy" ON leads
  FOR INSERT
  WITH CHECK (true); -- Les leads peuvent venir de n'importe où

-- Update: Agent du lead ou Admin
CREATE POLICY "leads_update_policy" ON leads
  FOR UPDATE
  USING (agent_id = auth.uid() OR is_admin());

-- Delete: Admin seulement
CREATE POLICY "leads_delete_policy" ON leads
  FOR DELETE
  USING (is_admin());

-- ============================================
-- POLICIES: FAVORITES
-- ============================================

-- Lecture publique (basée sur phone)
CREATE POLICY "favorites_select_policy" ON favorites
  FOR SELECT
  USING (true); -- Filtrage côté application par phone

-- Insertion publique
CREATE POLICY "favorites_insert_policy" ON favorites
  FOR INSERT
  WITH CHECK (true);

-- Delete: Propriétaire du favori
CREATE POLICY "favorites_delete_policy" ON favorites
  FOR DELETE
  USING (true); -- Filtrage côté application par phone

-- ============================================
-- POLICIES: PROPERTY_VIEWS
-- ============================================

-- Lecture: Agent propriétaire ou Admin
CREATE POLICY "property_views_select_policy" ON property_views
  FOR SELECT
  USING (
    is_admin()
    OR
    EXISTS (
      SELECT 1 FROM properties WHERE properties.id = property_views.property_id AND properties.agent_id = auth.uid()
    )
  );

-- Insertion publique (tracking)
CREATE POLICY "property_views_insert_policy" ON property_views
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- POLICIES: NEIGHBORHOODS
-- ============================================

-- Lecture publique
CREATE POLICY "neighborhoods_select_policy" ON neighborhoods
  FOR SELECT
  USING (true);

-- Modification: Admin seulement
CREATE POLICY "neighborhoods_insert_policy" ON neighborhoods
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "neighborhoods_update_policy" ON neighborhoods
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "neighborhoods_delete_policy" ON neighborhoods
  FOR DELETE
  USING (is_admin());

-- ============================================
-- POLICIES: NOTIFICATIONS
-- ============================================

-- Lecture: Propriétaire ou Admin
CREATE POLICY "notifications_select_policy" ON notifications
  FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

-- Insertion: Système ou Admin
CREATE POLICY "notifications_insert_policy" ON notifications
  FOR INSERT
  WITH CHECK (is_admin() OR is_active_agent());

-- Update: Propriétaire (pour marquer comme lu)
CREATE POLICY "notifications_update_policy" ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

-- Delete: Propriétaire ou Admin
CREATE POLICY "notifications_delete_policy" ON notifications
  FOR DELETE
  USING (user_id = auth.uid() OR is_admin());

-- ============================================
-- SERVICE ROLE BYPASS
-- ============================================
-- Note: Le service_role key bypass automatiquement RLS dans Supabase
-- Utilisez-le pour les opérations serveur/admin qui nécessitent un accès complet
