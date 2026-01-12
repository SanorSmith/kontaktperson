-- COMPLETE DATABASE SETUP FOR KONTAKTPERSON PLATFORM
-- Run this ENTIRE script in Supabase SQL Editor
-- This will set up all tables and RLS policies correctly

-- ============================================
-- STEP 1: DROP EXISTING TABLES (clean slate)
-- ============================================
DROP TABLE IF EXISTS social_workers CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- STEP 2: CREATE PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'volunteer' CHECK (role IN ('admin', 'social_worker', 'volunteer')),
  municipality TEXT,
  must_change_password BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE SOCIAL_WORKERS TABLE
-- ============================================
CREATE TABLE social_workers (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  employee_id TEXT,
  department TEXT,
  phone_work TEXT,
  phone_mobile TEXT,
  access_level TEXT DEFAULT 'viewer' CHECK (access_level IN ('viewer', 'approver', 'admin')),
  municipalities TEXT[],
  specializations TEXT[],
  max_volunteers INTEGER DEFAULT 10,
  current_volunteers INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 4: CREATE VOLUNTEERS TABLE
-- ============================================
CREATE TABLE volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
  availability TEXT[],
  has_drivers_license BOOLEAN DEFAULT false,
  has_car BOOLEAN DEFAULT false,
  accepts_background_check BOOLEAN DEFAULT false,
  accepts_terms BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  background_check_status TEXT DEFAULT 'not_requested',
  assigned_social_worker UUID,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 5: ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: CREATE RLS POLICIES
-- ============================================

-- PROFILES: Allow authenticated users to read ALL profiles
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT TO authenticated USING (true);

-- PROFILES: Allow authenticated users to insert
CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT TO authenticated WITH CHECK (true);

-- PROFILES: Allow users to update their own profile
CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- SOCIAL_WORKERS: Allow authenticated users to read ALL
CREATE POLICY "social_workers_select" ON social_workers
  FOR SELECT TO authenticated USING (true);

-- SOCIAL_WORKERS: Allow authenticated users to insert
CREATE POLICY "social_workers_insert" ON social_workers
  FOR INSERT TO authenticated WITH CHECK (true);

-- SOCIAL_WORKERS: Allow users to update their own record
CREATE POLICY "social_workers_update" ON social_workers
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- VOLUNTEERS: Allow anyone to insert (for registration)
CREATE POLICY "volunteers_insert" ON volunteers
  FOR INSERT WITH CHECK (true);

-- VOLUNTEERS: Allow authenticated users to read
CREATE POLICY "volunteers_select" ON volunteers
  FOR SELECT TO authenticated USING (true);

-- VOLUNTEERS: Allow authenticated users to update
CREATE POLICY "volunteers_update" ON volunteers
  FOR UPDATE TO authenticated USING (true);

-- ============================================
-- STEP 7: CREATE INDEXES
-- ============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_municipality ON volunteers(municipality);

-- ============================================
-- STEP 8: VERIFY SETUP
-- ============================================
SELECT 'Setup complete!' as status;

-- Show table counts
SELECT 'profiles' as table_name, count(*) as count FROM profiles
UNION ALL
SELECT 'social_workers', count(*) FROM social_workers
UNION ALL
SELECT 'volunteers', count(*) FROM volunteers;
