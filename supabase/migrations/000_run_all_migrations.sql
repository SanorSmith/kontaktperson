-- ============================================
-- CONSOLIDATED MIGRATION: Run All Migrations (001-005)
-- ============================================
-- This file combines all migrations into one for easy execution
-- Run this in Supabase SQL Editor to set up the entire database

-- ============================================
-- Migration 001: Create Base Tables
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE: profiles
-- Drop and recreate to ensure clean state
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('volunteer', 'social_worker', 'admin')),
  municipality TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint if auth.users exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    BEGIN
      ALTER TABLE profiles 
      ADD CONSTRAINT profiles_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_object THEN
        -- Constraint already exists, ignore
        NULL;
    END;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- TABLE: municipalities
CREATE TABLE IF NOT EXISTS municipalities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  county TEXT NOT NULL,
  region TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  geometry JSONB,
  contact_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_municipalities_name ON municipalities(name);
CREATE INDEX IF NOT EXISTS idx_municipalities_county ON municipalities(county);

-- TABLE: volunteers
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 100),
  gender TEXT,
  languages TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  experience_text TEXT,
  motivation_text TEXT NOT NULL,
  available_for TEXT[] DEFAULT '{}',
  available_days TEXT[] DEFAULT '{}',
  hours_per_week INTEGER CHECK (hours_per_week >= 1 AND hours_per_week <= 40),
  municipality_id TEXT NOT NULL REFERENCES municipalities(id),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  background_check_status TEXT DEFAULT 'not_started' 
    CHECK (background_check_status IN ('not_started', 'pending', 'approved', 'rejected', 'expired')),
  background_check_date TIMESTAMPTZ,
  reference_1_name TEXT,
  reference_1_contact TEXT,
  reference_2_name TEXT,
  reference_2_contact TEXT,
  status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_volunteers_municipality ON volunteers(municipality_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_profile ON volunteers(profile_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_background_check ON volunteers(background_check_status);

-- TABLE: social_workers
CREATE TABLE IF NOT EXISTS social_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  municipality_id TEXT NOT NULL REFERENCES municipalities(id),
  department TEXT NOT NULL,
  employee_id TEXT NOT NULL UNIQUE,
  position TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  work_email TEXT NOT NULL UNIQUE,
  access_level TEXT DEFAULT 'viewer' 
    CHECK (access_level IN ('viewer', 'approver', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_workers_municipality ON social_workers(municipality_id);
CREATE INDEX IF NOT EXISTS idx_social_workers_profile ON social_workers(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_workers_verified ON social_workers(verified);
CREATE INDEX IF NOT EXISTS idx_social_workers_work_email ON social_workers(work_email);

-- TABLE: vetting_notes
CREATE TABLE IF NOT EXISTS vetting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE NOT NULL,
  social_worker_id UUID REFERENCES social_workers(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  note_type TEXT CHECK (note_type IN ('general', 'interview', 'reference_check', 'background_check', 'status_change')),
  status_change TEXT,
  is_internal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vetting_notes_volunteer ON vetting_notes(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_vetting_notes_worker ON vetting_notes(social_worker_id);
CREATE INDEX IF NOT EXISTS idx_vetting_notes_type ON vetting_notes(note_type);

-- TABLE: volunteer_assignments
CREATE TABLE IF NOT EXISTS volunteer_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE NOT NULL,
  social_worker_id UUID REFERENCES social_workers(id) ON DELETE SET NULL NOT NULL,
  client_reference TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_volunteer ON volunteer_assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_assignments_social_worker ON volunteer_assignments(social_worker_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON volunteer_assignments(status);

-- TRIGGERS: Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_volunteers_updated_at ON volunteers;
CREATE TRIGGER update_volunteers_updated_at
BEFORE UPDATE ON volunteers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_workers_updated_at ON social_workers;
CREATE TRIGGER update_social_workers_updated_at
BEFORE UPDATE ON social_workers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assignments_updated_at ON volunteer_assignments;
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON volunteer_assignments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CONSTRAINTS: Role consistency
CREATE OR REPLACE FUNCTION check_volunteer_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = NEW.profile_id 
    AND role = 'volunteer'
  ) THEN
    RAISE EXCEPTION 'Profile must have role=volunteer to create volunteer entry';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_volunteer_role ON volunteers;
CREATE TRIGGER enforce_volunteer_role
BEFORE INSERT OR UPDATE ON volunteers
FOR EACH ROW EXECUTE FUNCTION check_volunteer_role();

CREATE OR REPLACE FUNCTION check_social_worker_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = NEW.profile_id 
    AND role = 'social_worker'
  ) THEN
    RAISE EXCEPTION 'Profile must have role=social_worker to create social worker entry';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_social_worker_role ON social_workers;
CREATE TRIGGER enforce_social_worker_role
BEFORE INSERT OR UPDATE ON social_workers
FOR EACH ROW EXECUTE FUNCTION check_social_worker_role();

-- ============================================
-- Migration 002: Enable RLS
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Volunteers can view own data" ON volunteers;
DROP POLICY IF EXISTS "Volunteers can update own data" ON volunteers;
DROP POLICY IF EXISTS "Social workers can view approved volunteers in their municipality" ON volunteers;
DROP POLICY IF EXISTS "Admins can view all volunteers" ON volunteers;
DROP POLICY IF EXISTS "Social workers can view own data" ON social_workers;
DROP POLICY IF EXISTS "Admins can view all social workers" ON social_workers;
DROP POLICY IF EXISTS "Social workers can view notes for accessible volunteers" ON vetting_notes;
DROP POLICY IF EXISTS "Social workers can create notes" ON vetting_notes;
DROP POLICY IF EXISTS "Admins can view all notes" ON vetting_notes;
DROP POLICY IF EXISTS "Social workers can view assignments they created" ON volunteer_assignments;
DROP POLICY IF EXISTS "Volunteers can view their assignments" ON volunteer_assignments;
DROP POLICY IF EXISTS "Social workers can create assignments" ON volunteer_assignments;
DROP POLICY IF EXISTS "Admins can view all assignments" ON volunteer_assignments;
DROP POLICY IF EXISTS "Anyone can view municipalities" ON municipalities;

-- RLS POLICIES: profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- RLS POLICIES: volunteers
CREATE POLICY "Volunteers can view own data"
ON volunteers FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Volunteers can update own data"
ON volunteers FOR UPDATE
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Social workers can view approved volunteers in their municipality"
ON volunteers FOR SELECT
USING (
  status = 'approved'
  AND municipality_id IN (
    SELECT sw.municipality_id
    FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = TRUE
  )
);

CREATE POLICY "Admins can view all volunteers"
ON volunteers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- RLS POLICIES: social_workers
CREATE POLICY "Social workers can view own data"
ON social_workers FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all social workers"
ON social_workers FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- RLS POLICIES: vetting_notes
CREATE POLICY "Social workers can view notes for accessible volunteers"
ON vetting_notes FOR SELECT
USING (
  volunteer_id IN (
    SELECT v.id FROM volunteers v
    JOIN social_workers sw ON v.municipality_id = sw.municipality_id
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = TRUE
  )
);

CREATE POLICY "Social workers can create notes"
ON vetting_notes FOR INSERT
WITH CHECK (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = TRUE
  )
);

CREATE POLICY "Admins can view all notes"
ON vetting_notes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- RLS POLICIES: volunteer_assignments
CREATE POLICY "Social workers can view assignments they created"
ON volunteer_assignments FOR SELECT
USING (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "Volunteers can view their assignments"
ON volunteer_assignments FOR SELECT
USING (
  volunteer_id IN (
    SELECT v.id FROM volunteers v
    JOIN profiles p ON v.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "Social workers can create assignments"
ON volunteer_assignments FOR INSERT
WITH CHECK (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.access_level IN ('approver', 'admin')
  )
);

CREATE POLICY "Admins can view all assignments"
ON volunteer_assignments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- RLS POLICIES: municipalities
CREATE POLICY "Anyone can view municipalities"
ON municipalities FOR SELECT
TO PUBLIC
USING (true);

-- ============================================
-- Migration 004: Seed Data
-- ============================================

INSERT INTO municipalities (id, name, county, lat, lng) VALUES
('stockholm', 'Stockholm', 'Stockholms län', 59.3293, 18.0686),
('goteborg', 'Göteborg', 'Västra Götalands län', 57.7089, 11.9746),
('malmo', 'Malmö', 'Skåne län', 55.6050, 13.0038),
('uppsala', 'Uppsala', 'Uppsala län', 59.8586, 17.6389),
('linkoping', 'Linköping', 'Östergötlands län', 58.4108, 15.6214),
('orebro', 'Örebro', 'Örebro län', 59.2753, 15.2134),
('vasteras', 'Västerås', 'Västmanlands län', 59.6099, 16.5448),
('helsingborg', 'Helsingborg', 'Skåne län', 56.0465, 12.6945),
('norrkoping', 'Norrköping', 'Östergötlands län', 58.5877, 16.1924),
('jonkoping', 'Jönköping', 'Jönköpings län', 57.7826, 14.1618),
('umea', 'Umeå', 'Västerbottens län', 63.8258, 20.2630),
('lund', 'Lund', 'Skåne län', 55.7047, 13.1910),
('boras', 'Borås', 'Västra Götalands län', 57.7210, 12.9401),
('sundsvall', 'Sundsvall', 'Västernorrlands län', 62.3908, 17.3069),
('gavle', 'Gävle', 'Gävleborgs län', 60.6749, 17.1413)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Migration 005: Invitation System
-- ============================================

-- Add invitation columns to social_workers
ALTER TABLE social_workers
ADD COLUMN IF NOT EXISTS invitation_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS invitation_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS activation_ip TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_social_workers_invitation_token ON social_workers(invitation_token);
CREATE INDEX IF NOT EXISTS idx_social_workers_invited_by ON social_workers(invited_by);

-- Create audit log table
CREATE TABLE IF NOT EXISTS social_worker_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  social_worker_id UUID REFERENCES social_workers(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES profiles(id),
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_social_worker ON social_worker_audit_log(social_worker_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON social_worker_audit_log(created_at);

-- Create approved email domains table
CREATE TABLE IF NOT EXISTS approved_email_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  municipality_id TEXT REFERENCES municipalities(id),
  is_active BOOLEAN DEFAULT TRUE,
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approved_domains_domain ON approved_email_domains(domain);

-- Seed approved domains
INSERT INTO approved_email_domains (domain, is_active) VALUES
('kommun.se', TRUE),
('goteborg.se', TRUE),
('stockholm.se', TRUE),
('malmo.se', TRUE),
('uppsala.se', TRUE),
('linkoping.se', TRUE),
('orebro.se', TRUE),
('vasteras.se', TRUE),
('helsingborg.se', TRUE),
('norrkoping.se', TRUE),
('jonkoping.se', TRUE),
('umea.se', TRUE),
('lund.se', TRUE),
('boras.se', TRUE),
('sundsvall.se', TRUE),
('gavle.se', TRUE),
('eskilstuna.se', TRUE),
('sodertalje.se', TRUE),
('karlstad.se', TRUE),
('vaxjo.se', TRUE)
ON CONFLICT (domain) DO NOTHING;

-- Function: validate_invitation_token
CREATE OR REPLACE FUNCTION validate_invitation_token(p_token TEXT)
RETURNS TABLE(
  is_valid BOOLEAN,
  social_worker_id UUID,
  profile_id UUID,
  full_name TEXT,
  email TEXT,
  work_email TEXT,
  municipality_id TEXT,
  municipality_name TEXT,
  department TEXT,
  job_position TEXT,
  access_level TEXT,
  expires_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (sw.invitation_expires_at > NOW() AND sw.verified = FALSE) AS is_valid,
    sw.id,
    sw.profile_id,
    p.full_name,
    p.email,
    sw.work_email,
    sw.municipality_id,
    m.name AS municipality_name,
    sw.department,
    sw.position AS job_position,
    sw.access_level,
    sw.invitation_expires_at
  FROM social_workers sw
  JOIN profiles p ON sw.profile_id = p.id
  JOIN municipalities m ON sw.municipality_id = m.id
  WHERE sw.invitation_token = p_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables
ALTER TABLE social_worker_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE approved_email_domains ENABLE ROW LEVEL SECURITY;

-- RLS policies for audit log
DROP POLICY IF EXISTS "Admins view all audit logs" ON social_worker_audit_log;
CREATE POLICY "Admins view all audit logs"
ON social_worker_audit_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Social workers view own audit logs" ON social_worker_audit_log;
CREATE POLICY "Social workers view own audit logs"
ON social_worker_audit_log FOR SELECT
USING (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- RLS policies for approved domains
DROP POLICY IF EXISTS "Anyone can view approved domains" ON approved_email_domains;
CREATE POLICY "Anyone can view approved domains"
ON approved_email_domains FOR SELECT
TO PUBLIC
USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins manage approved domains" ON approved_email_domains;
CREATE POLICY "Admins manage approved domains"
ON approved_email_domains FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- All tables, functions, and policies have been created
-- You can now use the social worker invitation system
