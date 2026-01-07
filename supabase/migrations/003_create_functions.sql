-- ============================================
-- Migration 003: Helper Functions
-- ============================================
-- This migration creates helper functions for registration
-- and common operations with proper security

-- ============================================
-- FUNCTION: Create Volunteer Profile
-- ============================================
CREATE OR REPLACE FUNCTION create_volunteer_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_municipality TEXT,
  p_age INTEGER,
  p_gender TEXT DEFAULT NULL,
  p_languages TEXT[] DEFAULT '{}',
  p_motivation TEXT DEFAULT '',
  p_interests TEXT[] DEFAULT '{}',
  p_available_for TEXT[] DEFAULT '{}',
  p_available_days TEXT[] DEFAULT '{}',
  p_hours_per_week INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_profile_id UUID;
  v_volunteer_id UUID;
BEGIN
  -- Validate municipality exists
  IF NOT EXISTS (SELECT 1 FROM municipalities WHERE id = p_municipality) THEN
    RAISE EXCEPTION 'Invalid municipality: %', p_municipality;
  END IF;

  -- Create base profile with role='volunteer'
  INSERT INTO profiles (user_id, full_name, email, phone, role, municipality)
  VALUES (p_user_id, p_full_name, p_email, p_phone, 'volunteer', p_municipality)
  RETURNING id INTO v_profile_id;
  
  -- Create volunteer entry
  INSERT INTO volunteers (
    profile_id, 
    age, 
    gender,
    languages,
    motivation_text, 
    interests,
    available_for,
    available_days,
    hours_per_week,
    municipality_id, 
    status
  )
  VALUES (
    v_profile_id, 
    p_age, 
    p_gender,
    p_languages,
    p_motivation, 
    p_interests,
    p_available_for,
    p_available_days,
    p_hours_per_week,
    p_municipality, 
    'pending'
  )
  RETURNING id INTO v_volunteer_id;
  
  RETURN v_volunteer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_volunteer_profile IS 'Creates a complete volunteer profile with base profile and volunteer-specific data';

-- ============================================
-- FUNCTION: Create Social Worker Profile
-- ============================================
CREATE OR REPLACE FUNCTION create_social_worker_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_work_email TEXT,
  p_phone TEXT,
  p_municipality TEXT,
  p_department TEXT,
  p_employee_id TEXT,
  p_position TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_profile_id UUID;
  v_social_worker_id UUID;
BEGIN
  -- Validate municipality exists
  IF NOT EXISTS (SELECT 1 FROM municipalities WHERE id = p_municipality) THEN
    RAISE EXCEPTION 'Invalid municipality: %', p_municipality;
  END IF;

  -- Validate work email domain (should be @kommun.se or @stad.se)
  IF p_work_email NOT LIKE '%@kommun.se' AND p_work_email NOT LIKE '%@stad.se' THEN
    RAISE EXCEPTION 'Work email must be a valid municipality email (@kommun.se or @stad.se)';
  END IF;

  -- Create base profile with role='social_worker'
  INSERT INTO profiles (user_id, full_name, email, phone, role, municipality)
  VALUES (p_user_id, p_full_name, p_email, p_phone, 'social_worker', p_municipality)
  RETURNING id INTO v_profile_id;
  
  -- Create social worker entry (requires verification)
  INSERT INTO social_workers (
    profile_id, 
    municipality_id, 
    department, 
    employee_id, 
    position,
    work_email, 
    verified,
    access_level
  )
  VALUES (
    v_profile_id, 
    p_municipality, 
    p_department, 
    p_employee_id, 
    p_position,
    p_work_email, 
    FALSE, -- Requires admin verification
    'viewer' -- Default access level
  )
  RETURNING id INTO v_social_worker_id;
  
  RETURN v_social_worker_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_social_worker_profile IS 'Creates a social worker profile - requires admin verification before access';

-- ============================================
-- FUNCTION: Approve Volunteer
-- ============================================
CREATE OR REPLACE FUNCTION approve_volunteer(
  p_volunteer_id UUID,
  p_approver_profile_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_approver_role TEXT;
  v_approver_access TEXT;
  v_volunteer_municipality TEXT;
  v_approver_municipality TEXT;
BEGIN
  -- Get approver role and access level
  SELECT p.role, sw.access_level, sw.municipality_id
  INTO v_approver_role, v_approver_access, v_approver_municipality
  FROM profiles p
  LEFT JOIN social_workers sw ON sw.profile_id = p.id
  WHERE p.id = p_approver_profile_id;

  -- Get volunteer municipality
  SELECT municipality_id INTO v_volunteer_municipality
  FROM volunteers
  WHERE id = p_volunteer_id;

  -- Check authorization
  IF v_approver_role = 'admin' THEN
    -- Admins can approve anyone
    NULL;
  ELSIF v_approver_role = 'social_worker' AND v_approver_access IN ('approver', 'admin') THEN
    -- Social workers can only approve in their municipality
    IF v_approver_municipality != v_volunteer_municipality THEN
      RAISE EXCEPTION 'Social workers can only approve volunteers in their municipality';
    END IF;
  ELSE
    RAISE EXCEPTION 'User does not have permission to approve volunteers';
  END IF;

  -- Update volunteer status
  UPDATE volunteers
  SET 
    status = 'approved',
    approved_by = p_approver_profile_id,
    approved_at = NOW()
  WHERE id = p_volunteer_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION approve_volunteer IS 'Approves a volunteer application - only callable by approvers/admins';

-- ============================================
-- FUNCTION: Reject Volunteer
-- ============================================
CREATE OR REPLACE FUNCTION reject_volunteer(
  p_volunteer_id UUID,
  p_approver_profile_id UUID,
  p_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_approver_role TEXT;
  v_approver_access TEXT;
  v_volunteer_municipality TEXT;
  v_approver_municipality TEXT;
BEGIN
  -- Get approver role and access level
  SELECT p.role, sw.access_level, sw.municipality_id
  INTO v_approver_role, v_approver_access, v_approver_municipality
  FROM profiles p
  LEFT JOIN social_workers sw ON sw.profile_id = p.id
  WHERE p.id = p_approver_profile_id;

  -- Get volunteer municipality
  SELECT municipality_id INTO v_volunteer_municipality
  FROM volunteers
  WHERE id = p_volunteer_id;

  -- Check authorization
  IF v_approver_role = 'admin' THEN
    NULL;
  ELSIF v_approver_role = 'social_worker' AND v_approver_access IN ('approver', 'admin') THEN
    IF v_approver_municipality != v_volunteer_municipality THEN
      RAISE EXCEPTION 'Social workers can only reject volunteers in their municipality';
    END IF;
  ELSE
    RAISE EXCEPTION 'User does not have permission to reject volunteers';
  END IF;

  -- Update volunteer status
  UPDATE volunteers
  SET 
    status = 'rejected',
    rejection_reason = p_reason,
    approved_by = p_approver_profile_id,
    approved_at = NOW()
  WHERE id = p_volunteer_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION reject_volunteer IS 'Rejects a volunteer application with reason';

-- ============================================
-- FUNCTION: Verify Social Worker
-- ============================================
CREATE OR REPLACE FUNCTION verify_social_worker(
  p_social_worker_id UUID,
  p_admin_profile_id UUID,
  p_access_level TEXT DEFAULT 'viewer'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_admin_role TEXT;
BEGIN
  -- Verify caller is admin
  SELECT role INTO v_admin_role
  FROM profiles
  WHERE id = p_admin_profile_id;

  IF v_admin_role != 'admin' THEN
    RAISE EXCEPTION 'Only admins can verify social workers';
  END IF;

  -- Verify access level is valid
  IF p_access_level NOT IN ('viewer', 'approver', 'admin') THEN
    RAISE EXCEPTION 'Invalid access level: %', p_access_level;
  END IF;

  -- Update social worker
  UPDATE social_workers
  SET 
    verified = TRUE,
    verified_by = p_admin_profile_id,
    verified_at = NOW(),
    access_level = p_access_level
  WHERE id = p_social_worker_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION verify_social_worker IS 'Verifies a social worker and sets their access level - admin only';

-- ============================================
-- FUNCTION: Get Volunteers by Municipality
-- ============================================
CREATE OR REPLACE FUNCTION get_volunteers_by_municipality(
  p_municipality_id TEXT,
  p_status TEXT DEFAULT NULL
)
RETURNS TABLE (
  volunteer_id UUID,
  profile_id UUID,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  languages TEXT[],
  motivation_text TEXT,
  interests TEXT[],
  available_for TEXT[],
  available_days TEXT[],
  hours_per_week INTEGER,
  status TEXT,
  background_check_status TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.profile_id,
    p.full_name,
    v.age,
    v.gender,
    v.languages,
    v.motivation_text,
    v.interests,
    v.available_for,
    v.available_days,
    v.hours_per_week,
    v.status,
    v.background_check_status,
    v.created_at
  FROM volunteers v
  JOIN profiles p ON v.profile_id = p.id
  WHERE v.municipality_id = p_municipality_id
    AND (p_status IS NULL OR v.status = p_status)
  ORDER BY v.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_volunteers_by_municipality IS 'Gets volunteers for a municipality with optional status filter';

-- ============================================
-- FUNCTION: Add Vetting Note
-- ============================================
CREATE OR REPLACE FUNCTION add_vetting_note(
  p_volunteer_id UUID,
  p_social_worker_id UUID,
  p_note TEXT,
  p_note_type TEXT DEFAULT 'general',
  p_status_change TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_note_id UUID;
BEGIN
  -- Validate note type
  IF p_note_type NOT IN ('general', 'interview', 'reference_check', 'background_check', 'status_change') THEN
    RAISE EXCEPTION 'Invalid note type: %', p_note_type;
  END IF;

  -- Insert note
  INSERT INTO vetting_notes (
    volunteer_id,
    social_worker_id,
    note,
    note_type,
    status_change
  )
  VALUES (
    p_volunteer_id,
    p_social_worker_id,
    p_note,
    p_note_type,
    p_status_change
  )
  RETURNING id INTO v_note_id;

  RETURN v_note_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION add_vetting_note IS 'Adds a vetting note for a volunteer';

-- ============================================
-- FUNCTION: Get User Role
-- ============================================
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM profiles
  WHERE user_id = p_user_id;
  
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_role IS 'Gets the role of a user by their auth user_id';

-- ============================================
-- FUNCTION: Check Social Worker Access
-- ============================================
CREATE OR REPLACE FUNCTION check_social_worker_access(
  p_user_id UUID,
  p_required_level TEXT DEFAULT 'viewer'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_verified BOOLEAN;
  v_access_level TEXT;
BEGIN
  SELECT sw.verified, sw.access_level
  INTO v_verified, v_access_level
  FROM social_workers sw
  JOIN profiles p ON sw.profile_id = p.id
  WHERE p.user_id = p_user_id;

  IF NOT v_verified THEN
    RETURN FALSE;
  END IF;

  -- Check access level hierarchy: admin > approver > viewer
  IF p_required_level = 'viewer' THEN
    RETURN v_access_level IN ('viewer', 'approver', 'admin');
  ELSIF p_required_level = 'approver' THEN
    RETURN v_access_level IN ('approver', 'admin');
  ELSIF p_required_level = 'admin' THEN
    RETURN v_access_level = 'admin';
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_social_worker_access IS 'Checks if a social worker has the required access level';
