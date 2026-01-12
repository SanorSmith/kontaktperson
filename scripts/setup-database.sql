-- Kontaktperson Platform Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
-- Roles: 'admin', 'social_worker', 'volunteer'
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'volunteer' CHECK (role IN ('admin', 'social_worker', 'volunteer')),
  municipality TEXT,
  must_change_password BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  birth_year INTEGER,
  age INTEGER,
  municipality TEXT,
  address TEXT,
  postal_code TEXT,
  languages TEXT[],
  interests TEXT[],
  experience TEXT,
  motivation TEXT,
  availability TEXT,
  has_drivers_license BOOLEAN DEFAULT false,
  has_car BOOLEAN DEFAULT false,
  accepts_background_check BOOLEAN DEFAULT false,
  accepts_terms BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'inactive')),
  assigned_social_worker UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Workers table
CREATE TABLE IF NOT EXISTS social_workers (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  employee_id TEXT UNIQUE,
  department TEXT,
  phone_work TEXT,
  phone_mobile TEXT,
  address TEXT,
  postal_code TEXT,
  municipalities TEXT[],
  specializations TEXT[],
  max_volunteers INTEGER DEFAULT 10,
  current_volunteers INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS social_worker_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES profiles(id),
  target_user UUID REFERENCES profiles(id),
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Municipalities table
CREATE TABLE IF NOT EXISTS municipalities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  county TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample municipalities
INSERT INTO municipalities (name, code, county) VALUES
('Stockholm', '01', 'Stockholms län'),
('Göteborg', '02', 'Västra Götalands län'),
('Malmö', '03', 'Skåne län'),
('Uppsala', '04', 'Uppsala län'),
('Linköping', '05', 'Östergötlands län')
ON CONFLICT (name) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_municipality ON volunteers(municipality);
CREATE INDEX IF NOT EXISTS idx_social_workers_status ON social_workers(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_audit_action ON social_worker_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_performed_by ON social_worker_audit_log(performed_by);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_worker_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Volunteers RLS policies
CREATE POLICY "Social workers can view volunteers in their municipality" ON volunteers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'social_worker'
      AND volunteers.municipality = profiles.municipality
    )
  );

CREATE POLICY "Admins can view all volunteers" ON volunteers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Social Workers RLS policies
CREATE POLICY "Social workers can view own profile" ON social_workers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all social workers" ON social_workers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Audit log RLS policies
CREATE POLICY "Admins can view all audit logs" ON social_worker_audit_log
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Municipalities RLS policies
CREATE POLICY "Everyone can view municipalities" ON municipalities
  FOR SELECT USING (true);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_workers_updated_at BEFORE UPDATE ON social_workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_municipalities_updated_at BEFORE UPDATE ON municipalities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
