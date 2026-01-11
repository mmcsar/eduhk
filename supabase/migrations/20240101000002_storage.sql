-- MMC Immo - Configuration du Storage Supabase
-- Buckets pour les images et fichiers

-- ============================================
-- BUCKETS
-- ============================================

-- Bucket pour les images de propriétés
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true, -- Public pour affichage dans l'app
  5242880, -- 5MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
);

-- Bucket pour les avatars des agents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Bucket pour les documents (contrats, etc.) - privé
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false, -- Privé
  10485760, -- 10MB max
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
);

-- ============================================
-- POLICIES: PROPERTY-IMAGES
-- ============================================

-- Lecture publique
CREATE POLICY "property_images_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Upload: Agents authentifiés
CREATE POLICY "property_images_agent_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);

-- Update: Propriétaire du fichier ou Admin
CREATE POLICY "property_images_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
);

-- Delete: Propriétaire ou Admin
CREATE POLICY "property_images_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
);

-- ============================================
-- POLICIES: AVATARS
-- ============================================

-- Lecture publique
CREATE POLICY "avatars_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Upload: Utilisateur pour son propre avatar
CREATE POLICY "avatars_user_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update: Propriétaire
CREATE POLICY "avatars_user_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Delete: Propriétaire ou Admin
CREATE POLICY "avatars_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  )
);

-- ============================================
-- POLICIES: DOCUMENTS
-- ============================================

-- Lecture: Utilisateurs authentifiés
CREATE POLICY "documents_authenticated_read"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.role() = 'authenticated'
);

-- Upload: Agents
CREATE POLICY "documents_agent_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('agent', 'admin'))
);

-- Delete: Admin seulement
CREATE POLICY "documents_admin_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents'
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
