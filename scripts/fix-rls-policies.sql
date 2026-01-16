-- Fix RLS Policies for Kontaktperson Platform
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- 1. DROP ALL existing policies
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

DROP POLICY IF EXISTS "Social workers can view own record" ON social_workers;
DROP POLICY IF EXISTS "Allow insert for authenticated" ON social_workers;
DROP POLICY IF EXISTS "Allow update for own record" ON social_workers;

-- ============================================
-- 2. CREATE simple policies that WORK
-- ============================================

-- PROFILES: Allow all authenticated users to read all profiles
CREATE POLICY "Authenticated users can read profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

-- PROFILES: Allow all authenticated users to insert
CREATE POLICY "Authenticated users can insert profiles" ON profiles
  FOR INSERT TO authenticated WITH CHECK (true);

-- PROFILES: Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- SOCIAL_WORKERS: Allow all authenticated users to read
CREATE POLICY "Authenticated users can read social_workers" ON social_workers
  FOR SELECT TO authenticated USING (true);

-- SOCIAL_WORKERS: Allow all authenticated users to insert
CREATE POLICY "Authenticated users can insert social_workers" ON social_workers
  FOR INSERT TO authenticated WITH CHECK (true);

-- SOCIAL_WORKERS: Allow users to update their own record
CREATE POLICY "Users can update own social_worker" ON social_workers
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ============================================
-- 3. Verify policies are created
-- ============================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename IN ('profiles', 'social_workers');

-- ============================================
-- 4. Check existing data
-- ============================================
SELECT 'profiles' as table_name, count(*) as count FROM profiles
UNION ALL
SELECT 'social_workers', count(*) FROM social_workers;

-- Show all profiles
SELECT id, email, full_name, role, municipality, created_at
FROM profiles
ORDER BY created_at DESC;
