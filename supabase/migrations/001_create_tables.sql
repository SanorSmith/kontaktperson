-- ============================================
-- Migration 001: Create Base Tables
-- ============================================
-- This migration creates the core tables for the Kontaktperson Platform
-- with strict separation between volunteers and social workers

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- Base profile for ALL users (volunteers, social workers, admins)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('volunteer', 'social_worker', 'admin')),
  municipality TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);

COMMENT ON TABLE profiles IS 'Base profile table for all users in the system';
COMMENT ON COLUMN profiles.role IS 'User role: volunteer, social_worker, or admin';

-- ============================================
-- TABLE: municipalities
-- Swedish municipalities data
-- ============================================
CREATE TABLE municipalities (
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

CREATE INDEX idx_municipalities_name ON municipalities(name);
CREATE INDEX idx_municipalities_county ON municipalities(county);

COMMENT ON TABLE municipalities IS 'Swedish municipalities with geographic data';
COMMENT ON COLUMN municipalities.geometry IS 'GeoJSON polygon for municipality boundaries';

-- ============================================
-- TABLE: volunteers
-- ONLY volunteer-specific data
-- ============================================
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Personal Info
  age INTEGER CHECK (age >= 18 AND age <= 100),
  gender TEXT,
  languages TEXT[] DEFAULT '{}',
  
  -- Application Info
  interests TEXT[] DEFAULT '{}',
  experience_text TEXT,
  motivation_text TEXT NOT NULL,
  
  -- Availability
  available_for TEXT[] DEFAULT '{}',
  available_days TEXT[] DEFAULT '{}',
  hours_per_week INTEGER CHECK (hours_per_week >= 1 AND hours_per_week <= 40),
  
  -- Location (approximate for privacy)
  municipality_id TEXT NOT NULL REFERENCES municipalities(id),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  
  -- Vetting
  background_check_status TEXT DEFAULT 'not_started' 
    CHECK (background_check_status IN ('not_started', 'pending', 'approved', 'rejected', 'expired')),
  background_check_date TIMESTAMPTZ,
  reference_1_name TEXT,
  reference_1_contact TEXT,
  reference_2_name TEXT,
  reference_2_contact TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_volunteers_municipality ON volunteers(municipality_id);
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_profile ON volunteers(profile_id);
CREATE INDEX idx_volunteers_background_check ON volunteers(background_check_status);

COMMENT ON TABLE volunteers IS 'Volunteer-specific data - only accessible to volunteers themselves and authorized social workers';
COMMENT ON COLUMN volunteers.motivation_text IS 'Why the person wants to be a volunteer - shown anonymously to social workers';
COMMENT ON COLUMN volunteers.status IS 'Application status: pending, approved, rejected, or inactive';

-- ============================================
-- TABLE: social_workers
-- ONLY municipality staff data
-- ============================================
CREATE TABLE social_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Work Info
  municipality_id TEXT NOT NULL REFERENCES municipalities(id),
  department TEXT NOT NULL,
  employee_id TEXT NOT NULL UNIQUE,
  position TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  work_email TEXT NOT NULL UNIQUE,
  
  -- Access Level
  access_level TEXT DEFAULT 'viewer' 
    CHECK (access_level IN ('viewer', 'approver', 'admin')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_social_workers_municipality ON social_workers(municipality_id);
CREATE INDEX idx_social_workers_profile ON social_workers(profile_id);
CREATE INDEX idx_social_workers_verified ON social_workers(verified);
CREATE INDEX idx_social_workers_work_email ON social_workers(work_email);

COMMENT ON TABLE social_workers IS 'Municipality staff data - requires verification before access';
COMMENT ON COLUMN social_workers.access_level IS 'viewer: can only view, approver: can approve volunteers, admin: full access';
COMMENT ON COLUMN social_workers.verified IS 'Must be verified by admin before gaining access';

-- ============================================
-- TABLE: vetting_notes
-- Internal notes by social workers about volunteers
-- ============================================
CREATE TABLE vetting_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE NOT NULL,
  social_worker_id UUID REFERENCES social_workers(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  note_type TEXT CHECK (note_type IN ('general', 'interview', 'reference_check', 'background_check', 'status_change')),
  status_change TEXT,
  is_internal BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vetting_notes_volunteer ON vetting_notes(volunteer_id);
CREATE INDEX idx_vetting_notes_worker ON vetting_notes(social_worker_id);
CREATE INDEX idx_vetting_notes_type ON vetting_notes(note_type);

COMMENT ON TABLE vetting_notes IS 'Internal notes by social workers - NOT visible to volunteers';
COMMENT ON COLUMN vetting_notes.is_internal IS 'If true, note is only visible to social workers';

-- ============================================
-- TABLE: volunteer_assignments
-- Track which volunteers are assigned to which clients
-- ============================================
CREATE TABLE volunteer_assignments (
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

CREATE INDEX idx_assignments_volunteer ON volunteer_assignments(volunteer_id);
CREATE INDEX idx_assignments_social_worker ON volunteer_assignments(social_worker_id);
CREATE INDEX idx_assignments_status ON volunteer_assignments(status);

COMMENT ON TABLE volunteer_assignments IS 'Track volunteer-client assignments';
COMMENT ON COLUMN volunteer_assignments.client_reference IS 'Anonymous client reference - no personal data';

-- ============================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at
BEFORE UPDATE ON volunteers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_workers_updated_at
BEFORE UPDATE ON social_workers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON volunteer_assignments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CONSTRAINTS: Ensure role consistency
-- ============================================

-- Ensure volunteers table only contains volunteer profiles
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

CREATE TRIGGER enforce_volunteer_role
BEFORE INSERT OR UPDATE ON volunteers
FOR EACH ROW EXECUTE FUNCTION check_volunteer_role();

-- Ensure social_workers table only contains social_worker profiles
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

CREATE TRIGGER enforce_social_worker_role
BEFORE INSERT OR UPDATE ON social_workers
FOR EACH ROW EXECUTE FUNCTION check_social_worker_role();
