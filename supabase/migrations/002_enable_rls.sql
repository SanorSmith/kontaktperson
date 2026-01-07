-- ============================================
-- Migration 002: Enable Row Level Security (RLS)
-- ============================================
-- This migration enables RLS and creates security policies
-- to enforce strict data separation between user types

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: profiles
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND role = (SELECT role FROM profiles WHERE user_id = auth.uid())
);

-- Anyone authenticated can create a profile (for registration)
CREATE POLICY "Authenticated users can create profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- RLS POLICIES: municipalities
-- ============================================

-- Everyone can view municipalities (public data)
CREATE POLICY "Anyone can view municipalities"
ON municipalities FOR SELECT
TO PUBLIC
USING (true);

-- Only admins can modify municipalities
CREATE POLICY "Admins can modify municipalities"
ON municipalities FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- RLS POLICIES: volunteers
-- ============================================

-- Volunteers can view their own data
CREATE POLICY "Volunteers view own data"
ON volunteers FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'volunteer'
  )
);

-- Volunteers can update their own data (except status and vetting fields)
CREATE POLICY "Volunteers update own data"
ON volunteers FOR UPDATE
USING (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'volunteer'
  )
)
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'volunteer'
  )
  -- Prevent volunteers from changing their own status
  AND status = (SELECT status FROM volunteers WHERE profile_id = NEW.profile_id)
  AND background_check_status = (SELECT background_check_status FROM volunteers WHERE profile_id = NEW.profile_id)
);

-- Authenticated users can insert volunteer data (for registration)
CREATE POLICY "Authenticated users can register as volunteer"
ON volunteers FOR INSERT
TO authenticated
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'volunteer'
  )
);

-- Social workers can view volunteers in their municipality (approved only for viewers)
CREATE POLICY "Social workers view municipality volunteers"
ON volunteers FOR SELECT
USING (
  municipality_id IN (
    SELECT sw.municipality_id 
    FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = true
  )
  AND (
    -- Approvers and admins can see all volunteers
    EXISTS (
      SELECT 1 FROM social_workers sw
      JOIN profiles p ON sw.profile_id = p.id
      WHERE p.user_id = auth.uid()
      AND sw.access_level IN ('approver', 'admin')
    )
    -- Viewers can only see approved volunteers
    OR (
      status = 'approved'
      AND EXISTS (
        SELECT 1 FROM social_workers sw
        JOIN profiles p ON sw.profile_id = p.id
        WHERE p.user_id = auth.uid()
        AND sw.access_level = 'viewer'
      )
    )
  )
);

-- Social workers with approver access can update volunteer status
CREATE POLICY "Approvers can update volunteer status"
ON volunteers FOR UPDATE
USING (
  municipality_id IN (
    SELECT sw.municipality_id 
    FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = true
    AND sw.access_level IN ('approver', 'admin')
  )
)
WITH CHECK (
  municipality_id IN (
    SELECT sw.municipality_id 
    FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = true
    AND sw.access_level IN ('approver', 'admin')
  )
);

-- Admins can view all volunteers
CREATE POLICY "Admins view all volunteers"
ON volunteers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================
-- RLS POLICIES: social_workers
-- ============================================

-- Social workers can view their own data
CREATE POLICY "Social workers view own data"
ON social_workers FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'social_worker'
  )
);

-- Social workers can update their own non-critical data
CREATE POLICY "Social workers update own data"
ON social_workers FOR UPDATE
USING (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'social_worker'
  )
)
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id = auth.uid() 
    AND role = 'social_worker'
  )
  -- Prevent changing verification status or access level
  AND verified = (SELECT verified FROM social_workers WHERE profile_id = NEW.profile_id)
  AND access_level = (SELECT access_level FROM social_workers WHERE profile_id = NEW.profile_id)
);

-- Admins can view all social workers
CREATE POLICY "Admins view all social workers"
ON social_workers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Only admins can create social workers
CREATE POLICY "Admins create social workers"
ON social_workers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Only admins can update social worker verification and access
CREATE POLICY "Admins update social workers"
ON social_workers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Social workers in same municipality can view each other
CREATE POLICY "Social workers view colleagues"
ON social_workers FOR SELECT
USING (
  municipality_id IN (
    SELECT sw.municipality_id
    FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- ============================================
-- RLS POLICIES: vetting_notes
-- ============================================

-- Social workers can view notes for volunteers in their municipality
CREATE POLICY "Social workers view notes in municipality"
ON vetting_notes FOR SELECT
USING (
  volunteer_id IN (
    SELECT v.id FROM volunteers v
    JOIN social_workers sw ON v.municipality_id = sw.municipality_id
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = true
  )
);

-- Social workers can create notes for volunteers in their municipality
CREATE POLICY "Social workers create notes"
ON vetting_notes FOR INSERT
WITH CHECK (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = true
  )
  AND volunteer_id IN (
    SELECT v.id FROM volunteers v
    JOIN social_workers sw ON v.municipality_id = sw.municipality_id
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Social workers can update their own notes
CREATE POLICY "Social workers update own notes"
ON vetting_notes FOR UPDATE
USING (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Admins can view all notes
CREATE POLICY "Admins view all notes"
ON vetting_notes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- IMPORTANT: Volunteers CANNOT see vetting notes (no policy = no access)

-- ============================================
-- RLS POLICIES: volunteer_assignments
-- ============================================

-- Volunteers can view their own assignments
CREATE POLICY "Volunteers view own assignments"
ON volunteer_assignments FOR SELECT
USING (
  volunteer_id IN (
    SELECT v.id FROM volunteers v
    JOIN profiles p ON v.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Social workers can view assignments in their municipality
CREATE POLICY "Social workers view municipality assignments"
ON volunteer_assignments FOR SELECT
USING (
  volunteer_id IN (
    SELECT v.id FROM volunteers v
    JOIN social_workers sw ON v.municipality_id = sw.municipality_id
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = true
  )
);

-- Social workers can create assignments
CREATE POLICY "Social workers create assignments"
ON volunteer_assignments FOR INSERT
WITH CHECK (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
    AND sw.verified = true
    AND sw.access_level IN ('approver', 'admin')
  )
  AND volunteer_id IN (
    SELECT v.id FROM volunteers v
    JOIN social_workers sw ON v.municipality_id = sw.municipality_id
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Social workers can update assignments they created
CREATE POLICY "Social workers update own assignments"
ON volunteer_assignments FOR UPDATE
USING (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- Admins can view all assignments
CREATE POLICY "Admins view all assignments"
ON volunteer_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
