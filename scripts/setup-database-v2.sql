-- Kontaktperson Platform Database Setup v2
-- Complete schema with proper role separation
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- Roles: 'admin', 'social_worker', 'volunteer'
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'volunteer' CHECK (role IN ('admin', 'social_worker', 'volunteer')),
  municipality TEXT,
  avatar_url TEXT,
  phone TEXT,
  must_change_password BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SOCIAL WORKERS TABLE
-- access_level: 'viewer', 'approver', 'admin'
-- =============================================
CREATE TABLE IF NOT EXISTS social_workers (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  employee_id TEXT UNIQUE,
  department TEXT,
  title TEXT,
  phone_work TEXT,
  phone_mobile TEXT,
  office_address TEXT,
  municipalities TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  access_level TEXT DEFAULT 'viewer' CHECK (access_level IN ('viewer', 'approver', 'admin')),
  max_cases INTEGER DEFAULT 10,
  current_cases INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'on_leave')),
  invitation_token TEXT,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  invitation_accepted_at TIMESTAMP WITH TIME ZONE,
  invited_by UUID REFERENCES profiles(id),
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VOLUNTEERS TABLE (applications)
-- =============================================
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  birth_year INTEGER,
  age INTEGER,
  gender TEXT,
  municipality TEXT NOT NULL,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  
  -- Languages and skills
  languages TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  
  -- Application details
  experience TEXT,
  motivation TEXT,
  availability TEXT[] DEFAULT '{}',
  available_for TEXT[] DEFAULT '{}',
  experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'experienced', 'expert')),
  
  -- Practical info
  has_drivers_license BOOLEAN DEFAULT false,
  has_car BOOLEAN DEFAULT false,
  max_distance_km INTEGER DEFAULT 10,
  
  -- References
  reference_name_1 TEXT,
  reference_phone_1 TEXT,
  reference_relation_1 TEXT,
  reference_name_2 TEXT,
  reference_phone_2 TEXT,
  reference_relation_2 TEXT,
  
  -- Consent
  accepts_background_check BOOLEAN DEFAULT false,
  accepts_terms BOOLEAN DEFAULT false,
  accepts_data_processing BOOLEAN DEFAULT false,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'inactive', 'withdrawn')),
  
  -- Approval/Rejection tracking
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approval_notes TEXT,
  rejected_by UUID REFERENCES profiles(id),
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Background check
  background_check_status TEXT DEFAULT 'not_requested' CHECK (background_check_status IN ('not_requested', 'requested', 'pending', 'approved', 'rejected', 'expired')),
  background_check_requested_at TIMESTAMP WITH TIME ZONE,
  background_check_completed_at TIMESTAMP WITH TIME ZONE,
  background_check_expires_at TIMESTAMP WITH TIME ZONE,
  background_check_document_url TEXT,
  
  -- Assignment
  assigned_social_worker UUID REFERENCES profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  
  -- Coordinates for map
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VETTING NOTES TABLE (internal notes by social workers)
-- =============================================
CREATE TABLE IF NOT EXISTS vetting_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'interview', 'reference_check', 'background_check', 'status_change', 'internal')),
  content TEXT NOT NULL,
  is_visible_to_volunteer BOOLEAN DEFAULT false,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- REFERENCE CHECKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reference_checks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE NOT NULL,
  checked_by UUID REFERENCES profiles(id) NOT NULL,
  reference_number INTEGER CHECK (reference_number IN (1, 2)),
  contact_date TIMESTAMP WITH TIME ZONE,
  contact_method TEXT CHECK (contact_method IN ('phone', 'email', 'in_person')),
  response_summary TEXT,
  recommendation TEXT CHECK (recommendation IN ('positive', 'neutral', 'negative', 'no_response')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VOLUNTEER DOCUMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS volunteer_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  document_type TEXT NOT NULL CHECK (document_type IN ('background_check', 'certification', 'reference_letter', 'id_document', 'other')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUDIT LOG TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  performed_by UUID REFERENCES profiles(id),
  target_user UUID,
  old_values JSONB,
  new_values JSONB,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EMAIL NOTIFICATIONS LOG
-- =============================================
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  recipient_id UUID REFERENCES profiles(id),
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MUNICIPALITIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS municipalities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  county TEXT,
  region TEXT,
  population INTEGER,
  area_km2 DECIMAL(10, 2),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SYSTEM SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_municipality ON profiles(municipality);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

CREATE INDEX IF NOT EXISTS idx_social_workers_status ON social_workers(status);
CREATE INDEX IF NOT EXISTS idx_social_workers_access_level ON social_workers(access_level);
CREATE INDEX IF NOT EXISTS idx_social_workers_municipalities ON social_workers USING GIN(municipalities);

CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);
CREATE INDEX IF NOT EXISTS idx_volunteers_municipality ON volunteers(municipality);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_background_check ON volunteers(background_check_status);
CREATE INDEX IF NOT EXISTS idx_volunteers_languages ON volunteers USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_volunteers_assigned ON volunteers(assigned_social_worker);

CREATE INDEX IF NOT EXISTS idx_vetting_notes_volunteer ON vetting_notes(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_vetting_notes_author ON vetting_notes(author_id);

CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_performed_by ON audit_log(performed_by);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_log(created_at);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reference_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - PROFILES
-- =============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_admin" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- RLS POLICIES - SOCIAL WORKERS
-- =============================================
DROP POLICY IF EXISTS "Social workers can view own profile" ON social_workers;
DROP POLICY IF EXISTS "Admins can view all social workers" ON social_workers;

CREATE POLICY "social_workers_select_own" ON social_workers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "social_workers_select_admin" ON social_workers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "social_workers_all_admin" ON social_workers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "social_workers_update_own" ON social_workers
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- RLS POLICIES - VOLUNTEERS
-- =============================================
DROP POLICY IF EXISTS "Social workers can view volunteers in their municipality" ON volunteers;
DROP POLICY IF EXISTS "Admins can view all volunteers" ON volunteers;

-- Volunteers can view their own application
CREATE POLICY "volunteers_select_own" ON volunteers
  FOR SELECT USING (user_id = auth.uid() OR email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- Volunteers can update their own application (when pending)
CREATE POLICY "volunteers_update_own" ON volunteers
  FOR UPDATE USING (
    (user_id = auth.uid() OR email = (SELECT email FROM profiles WHERE id = auth.uid()))
    AND status IN ('pending', 'under_review')
  );

-- Social workers can view volunteers in their municipalities
CREATE POLICY "volunteers_select_social_worker" ON volunteers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM social_workers sw
      WHERE sw.id = auth.uid()
      AND sw.status = 'active'
      AND volunteers.municipality = ANY(sw.municipalities)
    )
  );

-- Social workers with approver/admin access can update volunteers
CREATE POLICY "volunteers_update_social_worker" ON volunteers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM social_workers sw
      WHERE sw.id = auth.uid()
      AND sw.status = 'active'
      AND sw.access_level IN ('approver', 'admin')
      AND volunteers.municipality = ANY(sw.municipalities)
    )
  );

-- Admins can do everything with volunteers (read-only for stats)
CREATE POLICY "volunteers_select_admin" ON volunteers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Anyone can insert (public registration)
CREATE POLICY "volunteers_insert_public" ON volunteers
  FOR INSERT WITH CHECK (true);

-- =============================================
-- RLS POLICIES - VETTING NOTES (NEVER visible to volunteers)
-- =============================================
CREATE POLICY "vetting_notes_select_social_worker" ON vetting_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM social_workers sw
      WHERE sw.id = auth.uid()
      AND sw.status = 'active'
    )
  );

CREATE POLICY "vetting_notes_insert_social_worker" ON vetting_notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_workers sw
      WHERE sw.id = auth.uid()
      AND sw.status = 'active'
      AND sw.access_level IN ('approver', 'admin')
    )
  );

CREATE POLICY "vetting_notes_select_admin" ON vetting_notes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- RLS POLICIES - REFERENCE CHECKS
-- =============================================
CREATE POLICY "reference_checks_social_worker" ON reference_checks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM social_workers sw
      WHERE sw.id = auth.uid()
      AND sw.status = 'active'
      AND sw.access_level IN ('approver', 'admin')
    )
  );

CREATE POLICY "reference_checks_admin" ON reference_checks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- RLS POLICIES - VOLUNTEER DOCUMENTS
-- =============================================
CREATE POLICY "volunteer_documents_select_own" ON volunteer_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM volunteers v
      WHERE v.id = volunteer_id
      AND (v.user_id = auth.uid() OR v.email = (SELECT email FROM profiles WHERE id = auth.uid()))
    )
  );

CREATE POLICY "volunteer_documents_select_social_worker" ON volunteer_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM social_workers sw
      WHERE sw.id = auth.uid()
      AND sw.status = 'active'
    )
  );

CREATE POLICY "volunteer_documents_insert_own" ON volunteer_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM volunteers v
      WHERE v.id = volunteer_id
      AND (v.user_id = auth.uid() OR v.email = (SELECT email FROM profiles WHERE id = auth.uid()))
    )
  );

-- =============================================
-- RLS POLICIES - AUDIT LOG (Admin only)
-- =============================================
CREATE POLICY "audit_log_admin" ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "audit_log_insert" ON audit_log
  FOR INSERT WITH CHECK (true);

-- =============================================
-- RLS POLICIES - EMAIL NOTIFICATIONS
-- =============================================
CREATE POLICY "email_notifications_admin" ON email_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- RLS POLICIES - MUNICIPALITIES (Public read)
-- =============================================
CREATE POLICY "municipalities_select_all" ON municipalities
  FOR SELECT USING (true);

CREATE POLICY "municipalities_admin" ON municipalities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- RLS POLICIES - SYSTEM SETTINGS (Admin only)
-- =============================================
CREATE POLICY "system_settings_admin" ON system_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO audit_log (action, entity_type, entity_id, performed_by, old_values, new_values, details)
  VALUES (p_action, p_entity_type, p_entity_id, auth.uid(), p_old_values, p_new_values, p_details)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_social_workers_updated_at ON social_workers;
DROP TRIGGER IF EXISTS update_volunteers_updated_at ON volunteers;
DROP TRIGGER IF EXISTS update_vetting_notes_updated_at ON vetting_notes;
DROP TRIGGER IF EXISTS update_municipalities_updated_at ON municipalities;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_workers_updated_at BEFORE UPDATE ON social_workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vetting_notes_updated_at BEFORE UPDATE ON vetting_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_municipalities_updated_at BEFORE UPDATE ON municipalities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA - MUNICIPALITIES
-- =============================================
INSERT INTO municipalities (name, code, county, region) VALUES
('Stockholm', '0180', 'Stockholms län', 'Svealand'),
('Göteborg', '1480', 'Västra Götalands län', 'Götaland'),
('Malmö', '1280', 'Skåne län', 'Götaland'),
('Uppsala', '0380', 'Uppsala län', 'Svealand'),
('Linköping', '0580', 'Östergötlands län', 'Götaland'),
('Örebro', '1880', 'Örebro län', 'Svealand'),
('Västerås', '1980', 'Västmanlands län', 'Svealand'),
('Helsingborg', '1283', 'Skåne län', 'Götaland'),
('Norrköping', '0581', 'Östergötlands län', 'Götaland'),
('Jönköping', '0680', 'Jönköpings län', 'Götaland'),
('Umeå', '2480', 'Västerbottens län', 'Norrland'),
('Lund', '1281', 'Skåne län', 'Götaland'),
('Borås', '1490', 'Västra Götalands län', 'Götaland'),
('Huddinge', '0126', 'Stockholms län', 'Svealand'),
('Eskilstuna', '0484', 'Södermanlands län', 'Svealand'),
('Gävle', '2180', 'Gävleborgs län', 'Norrland'),
('Södertälje', '0181', 'Stockholms län', 'Svealand'),
('Karlstad', '1780', 'Värmlands län', 'Svealand'),
('Täby', '0160', 'Stockholms län', 'Svealand'),
('Växjö', '0780', 'Kronobergs län', 'Götaland')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- DEFAULT SYSTEM SETTINGS
-- =============================================
INSERT INTO system_settings (key, value, description) VALUES
('approved_email_domains', '["kommun.se", "stockholm.se", "goteborg.se", "malmo.se", "region.se"]', 'Email domains allowed for social worker registration'),
('background_check_validity_days', '365', 'Number of days a background check is valid'),
('max_pending_applications_per_municipality', '100', 'Maximum pending applications per municipality'),
('email_notifications_enabled', 'true', 'Whether email notifications are enabled'),
('volunteer_min_age', '18', 'Minimum age for volunteers'),
('volunteer_max_age', '100', 'Maximum age for volunteers')
ON CONFLICT (key) DO NOTHING;
