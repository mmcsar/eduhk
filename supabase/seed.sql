-- MMC Immo - Données de seed pour développement
-- Ce fichier ajoute des données de test pour développement local

-- ============================================
-- UTILISATEURS DE TEST
-- ============================================

-- Admin principal
INSERT INTO users (id, email, full_name, phone, role, commission_rate, is_active, bio, whatsapp_number)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@mmcimmo.cd',
  'Admin MMC',
  '+243999000001',
  'admin',
  0.00,
  true,
  'Administrateur principal de MMC Immo',
  '+243999000001'
);

-- Agents de test
INSERT INTO users (id, email, full_name, phone, role, commission_rate, is_active, bio, whatsapp_number) VALUES
  ('00000000-0000-0000-0000-000000000002', 'jean@mmcimmo.cd', 'Jean Kabongo', '+243999000002', 'agent', 5.00, true, 'Spécialiste des villas de standing au Golf et Bel-Air', '+243999000002'),
  ('00000000-0000-0000-0000-000000000003', 'marie@mmcimmo.cd', 'Marie Mwamba', '+243999000003', 'agent', 5.00, true, 'Experte en appartements et locations', '+243999000003'),
  ('00000000-0000-0000-0000-000000000004', 'patrick@mmcimmo.cd', 'Patrick Kasongo', '+243999000004', 'agent', 4.50, true, 'Spécialiste terrains et investissements', '+243999000004'),
  ('00000000-0000-0000-0000-000000000005', 'sarah@mmcimmo.cd', 'Sarah Kalumba', '+243999000005', 'agent', 5.00, true, 'Conseillère immobilière polyvalente', '+243999000005');

-- ============================================
-- PROPRIÉTÉS DE TEST
-- ============================================

-- Villas au Golf
INSERT INTO properties (id, agent_id, title, description, type, status, transaction_type, city, neighborhood, address, latitude, longitude, price, currency, bedrooms, bathrooms, surface_area, land_area, has_parking, parking_spots, has_garden, has_pool, has_security, has_generator, has_water_tank, furnished, images, is_featured, is_published)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Villa Luxueuse 5 Chambres - Golf',
    'Magnifique villa de standing dans le quartier prisé du Golf. Cette propriété exceptionnelle offre un cadre de vie idéal pour une famille. Finitions haut de gamme, jardin paysager, piscine privée.',
    'villa',
    'available',
    'sale',
    'Lubumbashi',
    'Golf',
    'Avenue du Golf, n°45',
    -11.6600,
    27.4800,
    450000.00,
    'USD',
    5,
    4,
    350.00,
    800.00,
    true,
    3,
    true,
    true,
    true,
    true,
    true,
    false,
    ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Villa Moderne 4 Chambres avec Piscine',
    'Belle villa contemporaine avec architecture moderne. Grand salon, cuisine américaine équipée, suite parentale avec dressing. Piscine avec terrasse.',
    'villa',
    'available',
    'sale',
    'Lubumbashi',
    'Golf',
    'Avenue des Palmiers, n°12',
    -11.6620,
    27.4850,
    320000.00,
    'USD',
    4,
    3,
    280.00,
    600.00,
    true,
    2,
    true,
    true,
    true,
    true,
    true,
    true,
    ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    true,
    true
  );

-- Maisons à Bel-Air
INSERT INTO properties (id, agent_id, title, description, type, status, transaction_type, city, neighborhood, address, price, currency, bedrooms, bathrooms, surface_area, land_area, has_parking, has_garden, has_security, has_generator, images, is_published)
VALUES
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Maison Familiale 4 Chambres - Bel-Air',
    'Jolie maison familiale dans un quartier calme et sécurisé. Proche des écoles et commerces. Parfait pour une famille.',
    'house',
    'available',
    'sale',
    'Lubumbashi',
    'Bel-Air',
    'Avenue Bel-Air, n°78',
    180000.00,
    'USD',
    4,
    2,
    200.00,
    400.00,
    true,
    true,
    true,
    true,
    ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
    true
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000003',
    'Maison Rénovée 3 Chambres',
    'Maison entièrement rénovée avec goût. Nouvelles installations électriques et plomberie. Cuisine moderne équipée.',
    'house',
    'available',
    'sale',
    'Lubumbashi',
    'Bel-Air',
    'Rue des Fleurs, n°23',
    145000.00,
    'USD',
    3,
    2,
    160.00,
    350.00,
    true,
    true,
    false,
    true,
    ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    true
  );

-- Appartements
INSERT INTO properties (id, agent_id, title, description, type, status, transaction_type, city, neighborhood, address, price, currency, bedrooms, bathrooms, surface_area, has_parking, has_security, furnished, images, is_published)
VALUES
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000003',
    'Appartement 2 Chambres - Centre Ville',
    'Bel appartement au 3ème étage avec ascenseur. Vue sur la ville. Parking souterrain inclus. Idéal pour jeune couple ou célibataire.',
    'apartment',
    'available',
    'rent',
    'Lubumbashi',
    'Commune Lubumbashi',
    'Avenue Mobutu, Immeuble Galaxy',
    800.00,
    'USD',
    2,
    1,
    85.00,
    true,
    true,
    true,
    ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    true
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000005',
    'Studio Moderne Meublé',
    'Studio moderne entièrement meublé et équipé. Parfait pour expatrié ou professionnel. Bail flexible.',
    'apartment',
    'available',
    'rent',
    'Lubumbashi',
    'Kenya',
    'Avenue Kenya, Résidence Palm',
    500.00,
    'USD',
    1,
    1,
    45.00,
    false,
    true,
    true,
    ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    true
  );

-- Terrains
INSERT INTO properties (id, agent_id, title, description, type, status, transaction_type, city, neighborhood, address, price, currency, land_area, images, is_published)
VALUES
  (
    '10000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000004',
    'Terrain Constructible 1000m² - Lido Golf',
    'Excellent terrain plat dans le nouveau quartier Lido Golf. Tous les documents en règle. Idéal pour construction villa.',
    'land',
    'available',
    'sale',
    'Lubumbashi',
    'Lido Golf',
    'Lido Golf, Parcelle 156',
    85000.00,
    'USD',
    1000.00,
    ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    true
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000004',
    'Terrain 500m² - Kampemba',
    'Terrain abordable pour première construction. Quartier en développement. Bon investissement.',
    'land',
    'available',
    'sale',
    'Lubumbashi',
    'Kampemba',
    'Avenue Principale Kampemba',
    25000.00,
    'USD',
    500.00,
    ARRAY['https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800'],
    true
  );

-- Local commercial
INSERT INTO properties (id, agent_id, title, description, type, status, transaction_type, city, neighborhood, address, price, currency, surface_area, has_parking, images, is_published)
VALUES
  (
    '10000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000005',
    'Local Commercial 200m² - Avenue Commerciale',
    'Grand local commercial sur avenue passante. Idéal pour boutique, restaurant ou bureau. Grande vitrine.',
    'commercial',
    'available',
    'rent',
    'Lubumbashi',
    'Kenya',
    'Avenue du Commerce, n°89',
    2500.00,
    'USD',
    200.00,
    true,
    ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    true
  );

-- Propriété vendue (pour stats)
INSERT INTO properties (id, agent_id, title, description, type, status, transaction_type, city, neighborhood, price, currency, bedrooms, bathrooms, images, is_published)
VALUES
  (
    '10000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000002',
    'Villa 3 Chambres - VENDUE',
    'Cette propriété a été vendue.',
    'villa',
    'sold',
    'sale',
    'Lubumbashi',
    'Golf',
    220000.00,
    'USD',
    3,
    2,
    ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'],
    true
  );

-- ============================================
-- CLIENTS DE TEST
-- ============================================

INSERT INTO clients (id, full_name, phone, email, preferred_budget_max, preferred_neighborhoods, source)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Emmanuel Lukusa', '+243970000001', 'emmanuel@email.com', 300000.00, ARRAY['Golf', 'Bel-Air'], 'app'),
  ('20000000-0000-0000-0000-000000000002', 'Grâce Mutombo', '+243970000002', 'grace@email.com', 150000.00, ARRAY['Bel-Air', 'Kenya'], 'facebook'),
  ('20000000-0000-0000-0000-000000000003', 'David Ilunga', '+243970000003', 'david@email.com', 1000.00, ARRAY['Commune Lubumbashi'], 'whatsapp'),
  ('20000000-0000-0000-0000-000000000004', 'Carine Kashala', '+243970000004', NULL, 50000.00, ARRAY['Kampemba'], 'referral');

-- ============================================
-- LEADS DE TEST
-- ============================================

INSERT INTO leads (id, property_id, agent_id, client_id, client_name, client_phone, message, source, status)
VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Emmanuel Lukusa', '+243970000001', 'Je suis très intéressé par cette villa. Quand puis-je la visiter?', 'app', 'contacted'),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Grâce Mutombo', '+243970000002', 'Bonjour, cette maison m''intéresse. Le prix est-il négociable?', 'facebook', 'new'),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'David Ilunga', '+243970000003', 'Je cherche un appartement pour 6 mois. Disponibilité?', 'whatsapp', 'qualified'),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', NULL, 'Client Converti', '+243970000005', 'Achat finalisé', 'app', 'won');

-- ============================================
-- VISITES DE TEST
-- ============================================

INSERT INTO visits (id, property_id, agent_id, client_id, scheduled_at, status, notes)
VALUES
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', NOW() + INTERVAL '2 days', 'confirmed', 'Client très motivé'),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', NOW() + INTERVAL '1 day', 'pending', NULL),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', NOW() - INTERVAL '3 days', 'completed', 'Le client a aimé l''appartement'),
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', NULL, NOW() - INTERVAL '1 day', 'no_show', 'Client n''est pas venu');

-- ============================================
-- FAVORIS DE TEST
-- ============================================

INSERT INTO favorites (client_phone, property_id)
VALUES
  ('+243970000001', '10000000-0000-0000-0000-000000000001'),
  ('+243970000001', '10000000-0000-0000-0000-000000000002'),
  ('+243970000002', '10000000-0000-0000-0000-000000000003'),
  ('+243970000002', '10000000-0000-0000-0000-000000000005'),
  ('+243970000003', '10000000-0000-0000-0000-000000000005');

-- ============================================
-- VUES DE PROPRIÉTÉS (pour stats)
-- ============================================

INSERT INTO property_views (property_id, source, viewed_at)
SELECT 
  '10000000-0000-0000-0000-000000000001',
  'app',
  NOW() - (random() * INTERVAL '30 days')
FROM generate_series(1, 45);

INSERT INTO property_views (property_id, source, viewed_at)
SELECT 
  '10000000-0000-0000-0000-000000000002',
  'app',
  NOW() - (random() * INTERVAL '30 days')
FROM generate_series(1, 32);

INSERT INTO property_views (property_id, source, viewed_at)
SELECT 
  '10000000-0000-0000-0000-000000000003',
  'web',
  NOW() - (random() * INTERVAL '30 days')
FROM generate_series(1, 28);

-- ============================================
-- NOTIFICATIONS DE TEST
-- ============================================

INSERT INTO notifications (user_id, title, body, type, reference_type, reference_id, is_read)
VALUES
  ('00000000-0000-0000-0000-000000000002', 'Nouveau lead!', 'Emmanuel Lukusa est intéressé par Villa Luxueuse 5 Chambres', 'lead', 'lead', '30000000-0000-0000-0000-000000000001', false),
  ('00000000-0000-0000-0000-000000000003', 'Visite confirmée', 'Votre visite de demain avec Grâce Mutombo est confirmée', 'visit', 'visit', '40000000-0000-0000-0000-000000000002', false),
  ('00000000-0000-0000-0000-000000000002', 'Félicitations!', 'Vous avez vendu une propriété ce mois-ci', 'system', NULL, NULL, true);

-- Note: Pour les utilisateurs auth, vous devez les créer via Supabase Dashboard ou API admin
-- Ces users dans la table public.users sont liés aux auth.users par leur ID
