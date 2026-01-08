-- ============================================
-- Migration 005: Social Worker Invitation System
-- ============================================
-- Adds invitation tokens, expiry, and verification tracking

-- ============================================
-- ADD INVITATION COLUMNS TO social_workers
-- ============================================

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

-- Add index for token lookups
CREATE INDEX IF NOT EXISTS idx_social_workers_invitation_token ON social_workers(invitation_token);
CREATE INDEX IF NOT EXISTS idx_social_workers_invited_by ON social_workers(invited_by);

-- ============================================
-- CREATE AUDIT LOG TABLE
-- ============================================

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

CREATE INDEX idx_audit_log_social_worker ON social_worker_audit_log(social_worker_id);
CREATE INDEX idx_audit_log_created_at ON social_worker_audit_log(created_at);

COMMENT ON TABLE social_worker_audit_log IS 'Audit trail for all social worker account actions';

-- ============================================
-- CREATE APPROVED EMAIL DOMAINS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS approved_email_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT UNIQUE NOT NULL,
  municipality_id TEXT REFERENCES municipalities(id),
  is_active BOOLEAN DEFAULT TRUE,
  added_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_approved_domains_domain ON approved_email_domains(domain);

COMMENT ON TABLE approved_email_domains IS 'Whitelist of approved email domains for social workers';

-- Seed common Swedish municipality domains
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

-- ============================================
-- FUNCTION: Create Social Worker Invitation
-- ============================================

CREATE OR REPLACE FUNCTION create_social_worker_invitation(
  p_admin_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_work_email TEXT,
  p_phone TEXT,
  p_municipality TEXT,
  p_department TEXT,
  p_employee_id TEXT DEFAULT NULL,
  p_position TEXT DEFAULT 'Socialsekreterare',
  p_access_level TEXT DEFAULT 'viewer',
  p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
  social_worker_id UUID,
  invitation_token TEXT,
  expires_at TIMESTAMPTZ
) AS $$
DECLARE
  v_user_id UUID;
  v_profile_id UUID;
  v_social_worker_id UUID;
  v_token TEXT;
  v_expires TIMESTAMPTZ;
  v_temp_password TEXT;
BEGIN
  -- Validate admin permissions
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can create social worker invitations';
  END IF;

  -- Validate municipality exists
  IF NOT EXISTS (SELECT 1 FROM municipalities WHERE id = p_municipality) THEN
    RAISE EXCEPTION 'Invalid municipality: %', p_municipality;
  END IF;

  -- Validate work email domain
  IF NOT EXISTS (
    SELECT 1 FROM approved_email_domains 
    WHERE p_work_email LIKE '%@' || domain 
    AND is_active = TRUE
  ) THEN
    RAISE EXCEPTION 'Work email domain not approved: %', p_work_email;
  END IF;

  -- Check if work email already exists
  IF EXISTS (SELECT 1 FROM social_workers WHERE work_email = p_work_email) THEN
    RAISE EXCEPTION 'Social worker with this work email already exists';
  END IF;

  -- Generate secure random token (32 bytes = 44 chars base64)
  v_token := encode(gen_random_bytes(32), 'base64');
  v_token := replace(replace(replace(v_token, '/', '_'), '+', '-'), '=', '');
  v_expires := NOW() + INTERVAL '7 days';
  
  -- Generate temporary password (will be replaced when user accepts invitation)
  v_temp_password := encode(gen_random_bytes(32), 'hex');
  
  -- Create auth user with temporary password
  -- Note: In production, use Supabase Admin API
  -- This is a placeholder - actual implementation depends on your auth setup
  v_user_id := gen_random_uuid(); -- Placeholder
  
  -- Create profile
  INSERT INTO profiles (user_id, full_name, email, phone, role, municipality)
  VALUES (v_user_id, p_name, p_email, p_phone, 'social_worker', p_municipality)
  RETURNING id INTO v_profile_id;
  
  -- Create social worker entry
  INSERT INTO social_workers (
    profile_id,
    municipality_id,
    department,
    employee_id,
    position,
    work_email,
    access_level,
    verified,
    invitation_token,
    invitation_expires_at,
    invitation_sent_at,
    invited_by,
    is_active
  )
  VALUES (
    v_profile_id,
    p_municipality,
    p_department,
    p_employee_id,
    p_position,
    p_work_email,
    p_access_level,
    FALSE,
    v_token,
    v_expires,
    NOW(),
    p_admin_id,
    FALSE -- Not active until invitation accepted
  )
  RETURNING id INTO v_social_worker_id;
  
  -- Log the invitation
  INSERT INTO social_worker_audit_log (
    social_worker_id,
    action,
    performed_by,
    details
  )
  VALUES (
    v_social_worker_id,
    'invitation_created',
    p_admin_id,
    jsonb_build_object(
      'work_email', p_work_email,
      'municipality', p_municipality,
      'access_level', p_access_level,
      'notes', p_notes
    )
  );
  
  RETURN QUERY SELECT v_social_worker_id, v_token, v_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION create_social_worker_invitation IS 'Creates a social worker invitation with secure token - admin only';

-- ============================================
-- FUNCTION: Validate Invitation Token
-- ============================================

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

COMMENT ON FUNCTION validate_invitation_token IS 'Validates invitation token and returns social worker details';

-- ============================================
-- FUNCTION: Accept Social Worker Invitation
-- ============================================

CREATE OR REPLACE FUNCTION accept_social_worker_invitation(
  p_token TEXT,
  p_password TEXT,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS TABLE(
  success BOOLEAN,
  user_id UUID,
  profile_id UUID,
  message TEXT
) AS $$
DECLARE
  v_user_id UUID;
  v_profile_id UUID;
  v_social_worker_id UUID;
  v_is_valid BOOLEAN;
BEGIN
  -- Validate token
  SELECT 
    (sw.invitation_expires_at > NOW() AND sw.verified = FALSE),
    p.user_id,
    sw.profile_id,
    sw.id
  INTO v_is_valid, v_user_id, v_profile_id, v_social_worker_id
  FROM social_workers sw
  JOIN profiles p ON sw.profile_id = p.id
  WHERE sw.invitation_token = p_token;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, 'Invalid invitation token'::TEXT;
    RETURN;
  END IF;
  
  IF NOT v_is_valid THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, 'Invitation has expired or already been used'::TEXT;
    RETURN;
  END IF;
  
  -- Validate password strength (basic check)
  IF LENGTH(p_password) < 8 THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, NULL::UUID, 'Password must be at least 8 characters'::TEXT;
    RETURN;
  END IF;
  
  -- Update password in auth.users
  -- Note: In production, use Supabase Admin API
  -- This is a placeholder for the actual password update
  
  -- Mark as verified and active
  UPDATE social_workers
  SET 
    verified = TRUE,
    verified_at = NOW(),
    invitation_accepted_at = NOW(),
    invitation_token = NULL, -- Clear token after use
    invitation_expires_at = NULL,
    activation_ip = p_ip_address,
    is_active = TRUE
  WHERE id = v_social_worker_id;
  
  -- Log the acceptance
  INSERT INTO social_worker_audit_log (
    social_worker_id,
    action,
    details,
    ip_address
  )
  VALUES (
    v_social_worker_id,
    'invitation_accepted',
    jsonb_build_object('accepted_at', NOW()),
    p_ip_address
  );
  
  RETURN QUERY SELECT TRUE, v_user_id, v_profile_id, 'Invitation accepted successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION accept_social_worker_invitation IS 'Accepts invitation and activates social worker account';

-- ============================================
-- FUNCTION: Resend Invitation
-- ============================================

CREATE OR REPLACE FUNCTION resend_social_worker_invitation(
  p_social_worker_id UUID,
  p_admin_id UUID
)
RETURNS TABLE(
  new_token TEXT,
  expires_at TIMESTAMPTZ
) AS $$
DECLARE
  v_token TEXT;
  v_expires TIMESTAMPTZ;
BEGIN
  -- Validate admin permissions
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can resend invitations';
  END IF;

  -- Check if social worker exists and is not yet verified
  IF NOT EXISTS (
    SELECT 1 FROM social_workers 
    WHERE id = p_social_worker_id 
    AND verified = FALSE
  ) THEN
    RAISE EXCEPTION 'Social worker not found or already verified';
  END IF;

  -- Generate new token
  v_token := encode(gen_random_bytes(32), 'base64');
  v_token := replace(replace(replace(v_token, '/', '_'), '+', '-'), '=', '');
  v_expires := NOW() + INTERVAL '7 days';
  
  -- Update with new token
  UPDATE social_workers
  SET 
    invitation_token = v_token,
    invitation_expires_at = v_expires,
    invitation_sent_at = NOW()
  WHERE id = p_social_worker_id;
  
  -- Log the resend
  INSERT INTO social_worker_audit_log (
    social_worker_id,
    action,
    performed_by,
    details
  )
  VALUES (
    p_social_worker_id,
    'invitation_resent',
    p_admin_id,
    jsonb_build_object('resent_at', NOW())
  );
  
  RETURN QUERY SELECT v_token, v_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION resend_social_worker_invitation IS 'Generates new invitation token for pending social worker';

-- ============================================
-- FUNCTION: Deactivate Social Worker
-- ============================================

CREATE OR REPLACE FUNCTION deactivate_social_worker(
  p_social_worker_id UUID,
  p_admin_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate admin permissions
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can deactivate social workers';
  END IF;

  -- Deactivate
  UPDATE social_workers
  SET is_active = FALSE
  WHERE id = p_social_worker_id;
  
  -- Log the deactivation
  INSERT INTO social_worker_audit_log (
    social_worker_id,
    action,
    performed_by,
    details
  )
  VALUES (
    p_social_worker_id,
    'account_deactivated',
    p_admin_id,
    jsonb_build_object('reason', p_reason, 'deactivated_at', NOW())
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION deactivate_social_worker IS 'Deactivates a social worker account - admin only';

-- ============================================
-- FUNCTION: Track Login
-- ============================================

CREATE OR REPLACE FUNCTION track_social_worker_login(
  p_social_worker_id UUID,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE social_workers
  SET 
    last_login_at = NOW(),
    login_count = login_count + 1
  WHERE id = p_social_worker_id;
  
  INSERT INTO social_worker_audit_log (
    social_worker_id,
    action,
    ip_address,
    details
  )
  VALUES (
    p_social_worker_id,
    'login',
    p_ip_address,
    jsonb_build_object('timestamp', NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION track_social_worker_login IS 'Tracks social worker login activity';

-- ============================================
-- RLS POLICIES FOR AUDIT LOG
-- ============================================

ALTER TABLE social_worker_audit_log ENABLE ROW LEVEL SECURITY;

-- Admins can view all audit logs
CREATE POLICY "Admins view all audit logs"
ON social_worker_audit_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Social workers can view their own audit logs
CREATE POLICY "Social workers view own audit logs"
ON social_worker_audit_log FOR SELECT
USING (
  social_worker_id IN (
    SELECT sw.id FROM social_workers sw
    JOIN profiles p ON sw.profile_id = p.id
    WHERE p.user_id = auth.uid()
  )
);

-- ============================================
-- RLS POLICIES FOR APPROVED DOMAINS
-- ============================================

ALTER TABLE approved_email_domains ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved domains (needed for validation)
CREATE POLICY "Anyone can view approved domains"
ON approved_email_domains FOR SELECT
TO PUBLIC
USING (is_active = TRUE);

-- Only admins can modify domains
CREATE POLICY "Admins manage approved domains"
ON approved_email_domains FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
