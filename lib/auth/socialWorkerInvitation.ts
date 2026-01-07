// ============================================
// Social Worker Invitation Logic
// ============================================

import { supabase } from '../supabase/auth';
import { generateInvitationEmailHTML, generateInvitationEmailText, generateResendInvitationEmailHTML, type InvitationEmailData } from '../email/invitationTemplate';

// Approved Swedish municipality email domains
const APPROVED_DOMAINS = [
  'kommun.se',
  'goteborg.se',
  'stockholm.se',
  'malmo.se',
  'uppsala.se',
  'linkoping.se',
  'orebro.se',
  'vasteras.se',
  'helsingborg.se',
  'norrkoping.se',
  'jonkoping.se',
  'umea.se',
  'lund.se',
  'boras.se',
  'sundsvall.se',
  'gavle.se',
  'eskilstuna.se',
  'sodertalje.se',
  'karlstad.se',
  'vaxjo.se'
];

export interface CreateInvitationInput {
  admin_id: string;
  name: string;
  email: string;
  work_email: string;
  phone: string;
  municipality: string;
  department: string;
  employee_id?: string;
  position?: string;
  access_level?: 'viewer' | 'approver' | 'admin';
  notes?: string;
}

export interface InvitationResult {
  success: boolean;
  social_worker_id?: string;
  invitation_token?: string;
  expires_at?: string;
  error?: string;
}

// Validate work email domain
export function validateWorkEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return APPROVED_DOMAINS.some(approvedDomain => 
    domain === approvedDomain || domain.endsWith('.' + approvedDomain)
  );
}

// Password strength validation
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (password.length < 8) {
    errors.push('Lösenordet måste vara minst 8 tecken långt');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en stor bokstav');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en liten bokstav');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst en siffra');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Lösenordet måste innehålla minst ett specialtecken');
  }
  
  // Common passwords check
  const commonPasswords = ['password', 'lösenord', '12345678', 'qwerty123', 'admin123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('Lösenordet är för vanligt, välj ett säkrare lösenord');
  }
  
  // Calculate strength
  if (errors.length === 0) {
    if (password.length >= 12 && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      strength = 'strong';
    } else if (password.length >= 10) {
      strength = 'medium';
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

// Create social worker invitation
export async function createSocialWorkerInvitation(
  input: CreateInvitationInput
): Promise<InvitationResult> {
  try {
    // Validate work email domain
    if (!validateWorkEmailDomain(input.work_email)) {
      return {
        success: false,
        error: 'Arbetsmail måste vara från en godkänd kommundomän (@kommun.se, @stockholm.se, etc.)'
      };
    }
    
    // Call database function
    const { data, error } = await supabase.rpc('create_social_worker_invitation', {
      p_admin_id: input.admin_id,
      p_name: input.name,
      p_email: input.email,
      p_work_email: input.work_email,
      p_phone: input.phone,
      p_municipality: input.municipality,
      p_department: input.department,
      p_employee_id: input.employee_id || null,
      p_position: input.position || 'Socialsekreterare',
      p_access_level: input.access_level || 'viewer',
      p_notes: input.notes || null
    });
    
    if (error) {
      console.error('Error creating invitation:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Kunde inte skapa inbjudan'
      };
    }
    
    const result = data[0];
    
    // Send invitation email
    await sendInvitationEmail({
      social_worker_id: result.social_worker_id,
      name: input.name,
      work_email: input.work_email,
      municipality: input.municipality,
      department: input.department,
      position: input.position || 'Socialsekreterare',
      access_level: input.access_level || 'viewer',
      invitation_token: result.invitation_token,
      admin_id: input.admin_id
    });
    
    return {
      success: true,
      social_worker_id: result.social_worker_id,
      invitation_token: result.invitation_token,
      expires_at: result.expires_at
    };
  } catch (error) {
    console.error('Error in createSocialWorkerInvitation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod'
    };
  }
}

// Send invitation email
async function sendInvitationEmail(params: {
  social_worker_id: string;
  name: string;
  work_email: string;
  municipality: string;
  department: string;
  position: string;
  access_level: string;
  invitation_token: string;
  admin_id: string;
}) {
  try {
    // Get admin name
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', params.admin_id)
      .single();
    
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
    
    const activationLink = `${baseUrl}/register/accept-invitation?token=${params.invitation_token}`;
    
    const emailData: InvitationEmailData = {
      name: params.name,
      municipality: params.municipality,
      department: params.department,
      position: params.position,
      work_email: params.work_email,
      access_level: params.access_level,
      activation_link: activationLink,
      invited_by_name: adminProfile?.full_name || 'Administratör',
      expires_in_days: 7
    };
    
    const htmlContent = generateInvitationEmailHTML(emailData);
    const textContent = generateInvitationEmailText(emailData);
    
    // In production, use a real email service (SendGrid, AWS SES, etc.)
    // For now, log to console
    console.log('=== INVITATION EMAIL ===');
    console.log('To:', params.work_email);
    console.log('Subject: Inbjudan till Kontaktperson Platform -', params.municipality);
    console.log('Activation Link:', activationLink);
    console.log('========================');
    
    // TODO: Implement actual email sending
    // Example with SendGrid:
    // await sendEmail({
    //   to: params.work_email,
    //   subject: `Inbjudan till Kontaktperson Platform - ${params.municipality}`,
    //   html: htmlContent,
    //   text: textContent
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
}

// Validate invitation token
export async function validateInvitationToken(token: string) {
  try {
    const { data, error } = await supabase.rpc('validate_invitation_token', {
      p_token: token
    });
    
    if (error) {
      console.error('Error validating token:', error);
      return { valid: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { valid: false, error: 'Ogiltig inbjudningslänk' };
    }
    
    const result = data[0];
    
    if (!result.is_valid) {
      return { 
        valid: false, 
        error: 'Inbjudan har löpt ut eller redan använts' 
      };
    }
    
    return {
      valid: true,
      data: {
        social_worker_id: result.social_worker_id,
        profile_id: result.profile_id,
        full_name: result.full_name,
        email: result.email,
        work_email: result.work_email,
        municipality_id: result.municipality_id,
        municipality_name: result.municipality_name,
        department: result.department,
        position: result.position,
        access_level: result.access_level,
        expires_at: result.expires_at
      }
    };
  } catch (error) {
    console.error('Error in validateInvitationToken:', error);
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod' 
    };
  }
}

// Accept invitation
export async function acceptInvitation(token: string, password: string) {
  try {
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors.join(', ')
      };
    }
    
    // Get IP address (if available)
    const ipAddress = typeof window !== 'undefined' 
      ? await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip)
          .catch(() => null)
      : null;
    
    // Accept invitation
    const { data, error } = await supabase.rpc('accept_social_worker_invitation', {
      p_token: token,
      p_password: password,
      p_ip_address: ipAddress
    });
    
    if (error) {
      console.error('Error accepting invitation:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Kunde inte aktivera kontot'
      };
    }
    
    const result = data[0];
    
    if (!result.success) {
      return {
        success: false,
        error: result.message
      };
    }
    
    return {
      success: true,
      user_id: result.user_id,
      profile_id: result.profile_id,
      message: result.message
    };
  } catch (error) {
    console.error('Error in acceptInvitation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod'
    };
  }
}

// Resend invitation
export async function resendInvitation(socialWorkerId: string, adminId: string) {
  try {
    const { data, error } = await supabase.rpc('resend_social_worker_invitation', {
      p_social_worker_id: socialWorkerId,
      p_admin_id: adminId
    });
    
    if (error) {
      console.error('Error resending invitation:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    if (!data || data.length === 0) {
      return {
        success: false,
        error: 'Kunde inte skicka om inbjudan'
      };
    }
    
    const result = data[0];
    
    // Get social worker details for email
    const { data: swData } = await supabase
      .from('social_workers')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', socialWorkerId)
      .single();
    
    if (swData) {
      // Send email with new token
      await sendInvitationEmail({
        social_worker_id: socialWorkerId,
        name: swData.profile.full_name,
        work_email: swData.work_email,
        municipality: swData.municipality_id,
        department: swData.department,
        position: swData.position,
        access_level: swData.access_level,
        invitation_token: result.new_token,
        admin_id: adminId
      });
    }
    
    return {
      success: true,
      new_token: result.new_token,
      expires_at: result.expires_at
    };
  } catch (error) {
    console.error('Error in resendInvitation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod'
    };
  }
}

// Deactivate social worker
export async function deactivateSocialWorker(
  socialWorkerId: string,
  adminId: string,
  reason?: string
) {
  try {
    const { data, error } = await supabase.rpc('deactivate_social_worker', {
      p_social_worker_id: socialWorkerId,
      p_admin_id: adminId,
      p_reason: reason || null
    });
    
    if (error) {
      console.error('Error deactivating social worker:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error in deactivateSocialWorker:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod'
    };
  }
}

// Get all social workers (admin only)
export async function getAllSocialWorkers(filters?: {
  municipality?: string;
  status?: 'verified' | 'pending' | 'inactive';
  access_level?: string;
  search?: string;
}) {
  try {
    let query = supabase
      .from('social_workers')
      .select(`
        *,
        profile:profiles(*),
        municipality:municipalities(*)
      `);
    
    // Apply filters
    if (filters?.municipality) {
      query = query.eq('municipality_id', filters.municipality);
    }
    
    if (filters?.status === 'verified') {
      query = query.eq('verified', true).eq('is_active', true);
    } else if (filters?.status === 'pending') {
      query = query.eq('verified', false);
    } else if (filters?.status === 'inactive') {
      query = query.eq('is_active', false);
    }
    
    if (filters?.access_level) {
      query = query.eq('access_level', filters.access_level);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching social workers:', error);
      return { data: null, error: error.message };
    }
    
    // Apply search filter client-side
    let filteredData = data;
    if (filters?.search && data) {
      const searchLower = filters.search.toLowerCase();
      filteredData = data.filter(sw => 
        sw.profile.full_name.toLowerCase().includes(searchLower) ||
        sw.work_email.toLowerCase().includes(searchLower) ||
        sw.department.toLowerCase().includes(searchLower)
      );
    }
    
    return { data: filteredData, error: null };
  } catch (error) {
    console.error('Error in getAllSocialWorkers:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Ett oväntat fel uppstod'
    };
  }
}
