-- USERS (agents + admin)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT, -- 'admin', 'agent'
  avatar_url TEXT,
  commission_rate DECIMAL(5,2), -- ex: 5.00%
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTIES
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  agent_id UUID REFERENCES users(id),
  
  title TEXT NOT NULL,
  description TEXT,
  type TEXT, -- 'house', 'apartment', 'land', 'villa'
  status TEXT DEFAULT 'available',
  transaction_type TEXT, -- 'sale', 'rent'
  
  -- Location
  city TEXT DEFAULT 'Lubumbashi',
  neighborhood TEXT, -- Golf, Katuba, Kenya, etc.
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Details
  price DECIMAL(12, 2),
  currency TEXT DEFAULT 'USD',
  bedrooms INT,
  bathrooms INT,
  surface_area DECIMAL(10, 2),
  
  -- Features
  has_parking BOOLEAN,
  has_garden BOOLEAN,
  has_pool BOOLEAN,
  has_security BOOLEAN,
  has_generator BOOLEAN,
  furnished BOOLEAN,
  
  images TEXT[],
  views_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTS (prospects)
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  preferred_budget_max DECIMAL(12, 2),
  preferred_neighborhoods TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISITS
CREATE TABLE visits (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  agent_id UUID REFERENCES users(id),
  client_id UUID REFERENCES clients(id),
  
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEADS
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  agent_id UUID REFERENCES users(id),
  
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,
  message TEXT,
  source TEXT, -- 'app', 'website', 'facebook', 'referral'
  status TEXT DEFAULT 'new',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAVORITES (clients qui ont téléchargé l'app)
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  client_phone TEXT, -- Identifiant unique
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
