-- Complete Database Setup for Kontaktperson Platform
-- Run this ENTIRE script in your Supabase SQL Editor
-- This will create/update all tables needed for the application

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
DROP TABLE IF EXISTS social_workers CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow insert for authenticated users" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- 2. SOCIAL WORKERS TABLE
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

-- Enable RLS
ALTER TABLE social_workers ENABLE ROW LEVEL SECURITY;

-- Social workers policies
CREATE POLICY "Social workers can view own record" ON social_workers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow insert for authenticated" ON social_workers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for own record" ON social_workers FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- 3. VOLUNTEERS TABLE
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'active', 'inactive')),
  background_check_status TEXT DEFAULT 'not_requested' CHECK (background_check_status IN ('not_requested', 'pending', 'approved', 'rejected', 'expired')),
  assigned_social_worker UUID,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_municipality ON volunteers(municipality);
CREATE INDEX idx_volunteers_email ON volunteers(email);

-- Enable RLS
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Volunteers policies - allow anonymous registration
CREATE POLICY "Anyone can register as volunteer" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view volunteers" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Anyone can update volunteers" ON volunteers FOR UPDATE USING (true);

-- ============================================
-- 4. CREATE INITIAL ADMIN USER
-- ============================================
-- Note: You need to first create a user in Supabase Auth, then run this:
-- Replace 'YOUR_ADMIN_USER_ID' with the actual user ID from auth.users

-- INSERT INTO profiles (id, email, full_name, role, municipality)
-- VALUES ('YOUR_ADMIN_USER_ID', 'admin@example.com', 'System Admin', 'admin', 'Stockholm');

-- ============================================
-- 5. VERIFY TABLES
-- ============================================
SELECT 'profiles' as table_name, count(*) as row_count FROM profiles
UNION ALL
SELECT 'social_workers', count(*) FROM social_workers
UNION ALL
SELECT 'volunteers', count(*) FROM volunteers;
