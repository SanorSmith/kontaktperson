// Role-based types for Kontaktperson Platform

// User roles
export type UserRole = 'admin' | 'social_worker' | 'volunteer';

// Social worker access levels
export type AccessLevel = 'viewer' | 'approver' | 'admin';

// Volunteer status
export type VolunteerStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'inactive' | 'withdrawn';

// Background check status
export type BackgroundCheckStatus = 'not_requested' | 'requested' | 'pending' | 'approved' | 'rejected' | 'expired';

// Social worker status
export type SocialWorkerStatus = 'pending' | 'active' | 'inactive' | 'on_leave';

// Note types for vetting
export type NoteType = 'general' | 'interview' | 'reference_check' | 'background_check' | 'status_change' | 'internal';

// Reference check recommendation
export type ReferenceRecommendation = 'positive' | 'neutral' | 'negative' | 'no_response';

// Base user profile
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  municipality: string | null;
  avatar_url: string | null;
  phone: string | null;
  must_change_password: boolean;
  email_verified: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

// Social worker profile
export interface SocialWorker {
  id: string;
  employee_id: string | null;
  department: string | null;
  title: string | null;
  phone_work: string | null;
  phone_mobile: string | null;
  office_address: string | null;
  municipalities: string[];
  specializations: string[];
  access_level: AccessLevel;
  max_cases: number;
  current_cases: number;
  status: SocialWorkerStatus;
  invitation_token: string | null;
  invitation_sent_at: string | null;
  invitation_accepted_at: string | null;
  invited_by: string | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
  // Joined from profiles
  profile?: Profile;
}

// Volunteer application
export interface Volunteer {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  birth_year: number | null;
  age: number | null;
  gender: string | null;
  municipality: string;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  
  // Languages and skills
  languages: string[];
  interests: string[];
  skills: string[];
  
  // Application details
  experience: string | null;
  motivation: string | null;
  availability: string[];
  available_for: string[];
  experience_level: 'beginner' | 'experienced' | 'expert';
  
  // Practical info
  has_drivers_license: boolean;
  has_car: boolean;
  max_distance_km: number;
  
  // References
  reference_name_1: string | null;
  reference_phone_1: string | null;
  reference_relation_1: string | null;
  reference_name_2: string | null;
  reference_phone_2: string | null;
  reference_relation_2: string | null;
  
  // Consent
  accepts_background_check: boolean;
  accepts_terms: boolean;
  accepts_data_processing: boolean;
  
  // Status
  status: VolunteerStatus;
  
  // Approval/Rejection
  approved_by: string | null;
  approved_at: string | null;
  approval_notes: string | null;
  rejected_by: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  
  // Background check
  background_check_status: BackgroundCheckStatus;
  background_check_requested_at: string | null;
  background_check_completed_at: string | null;
  background_check_expires_at: string | null;
  background_check_document_url: string | null;
  
  // Assignment
  assigned_social_worker: string | null;
  assigned_at: string | null;
  
  // Location
  latitude: number | null;
  longitude: number | null;
  
  created_at: string;
  updated_at: string;
}

// Vetting note
export interface VettingNote {
  id: string;
  volunteer_id: string;
  author_id: string;
  note_type: NoteType;
  content: string;
  is_visible_to_volunteer: boolean;
  attachments: string[];
  created_at: string;
  updated_at: string;
  // Joined
  author?: Profile;
}

// Reference check
export interface ReferenceCheck {
  id: string;
  volunteer_id: string;
  checked_by: string;
  reference_number: 1 | 2;
  contact_date: string | null;
  contact_method: 'phone' | 'email' | 'in_person' | null;
  response_summary: string | null;
  recommendation: ReferenceRecommendation | null;
  notes: string | null;
  created_at: string;
  // Joined
  checker?: Profile;
}

// Volunteer document
export interface VolunteerDocument {
  id: string;
  volunteer_id: string;
  uploaded_by: string | null;
  document_type: 'background_check' | 'certification' | 'reference_letter' | 'id_document' | 'other';
  file_name: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

// Audit log entry
export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  performed_by: string | null;
  target_user: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  details: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Joined
  performer?: Profile;
}

// Municipality
export interface Municipality {
  id: string;
  name: string;
  code: string;
  county: string | null;
  region: string | null;
  population: number | null;
  area_km2: number | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Email notification
export interface EmailNotification {
  id: string;
  recipient_email: string;
  recipient_id: string | null;
  template_name: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sent_at: string | null;
  error_message: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

// System setting
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// Permission check helpers
export interface UserPermissions {
  canViewVolunteers: boolean;
  canApproveVolunteers: boolean;
  canRejectVolunteers: boolean;
  canAddNotes: boolean;
  canManageBackgroundChecks: boolean;
  canExportData: boolean;
  canManageSocialWorkers: boolean;
  canAccessAdminPanel: boolean;
  canAccessSocialWorkerPanel: boolean;
  canAccessVolunteerPanel: boolean;
}

// Get permissions based on role and access level
export function getUserPermissions(role: UserRole, accessLevel?: AccessLevel): UserPermissions {
  if (role === 'admin') {
    return {
      canViewVolunteers: true, // Read-only stats
      canApproveVolunteers: false,
      canRejectVolunteers: false,
      canAddNotes: false,
      canManageBackgroundChecks: false,
      canExportData: true,
      canManageSocialWorkers: true,
      canAccessAdminPanel: true,
      canAccessSocialWorkerPanel: false,
      canAccessVolunteerPanel: false,
    };
  }
  
  if (role === 'social_worker') {
    const isViewer = accessLevel === 'viewer';
    const isApprover = accessLevel === 'approver' || accessLevel === 'admin';
    const isSWAdmin = accessLevel === 'admin';
    
    return {
      canViewVolunteers: true,
      canApproveVolunteers: isApprover,
      canRejectVolunteers: isApprover,
      canAddNotes: isApprover,
      canManageBackgroundChecks: isApprover,
      canExportData: isSWAdmin,
      canManageSocialWorkers: isSWAdmin,
      canAccessAdminPanel: false,
      canAccessSocialWorkerPanel: true,
      canAccessVolunteerPanel: false,
    };
  }
  
  if (role === 'volunteer') {
    return {
      canViewVolunteers: false,
      canApproveVolunteers: false,
      canRejectVolunteers: false,
      canAddNotes: false,
      canManageBackgroundChecks: false,
      canExportData: false,
      canManageSocialWorkers: false,
      canAccessAdminPanel: false,
      canAccessSocialWorkerPanel: false,
      canAccessVolunteerPanel: true,
    };
  }
  
  // Default: no permissions
  return {
    canViewVolunteers: false,
    canApproveVolunteers: false,
    canRejectVolunteers: false,
    canAddNotes: false,
    canManageBackgroundChecks: false,
    canExportData: false,
    canManageSocialWorkers: false,
    canAccessAdminPanel: false,
    canAccessSocialWorkerPanel: false,
    canAccessVolunteerPanel: false,
  };
}

// Route access mapping
export const ROLE_ROUTES: Record<UserRole, string> = {
  admin: '/admin',
  social_worker: '/social-worker/dashboard',
  volunteer: '/volunteer/dashboard',
};

// Check if user can access a route
export function canAccessRoute(role: UserRole, path: string): boolean {
  if (role === 'admin') {
    return path.startsWith('/admin');
  }
  if (role === 'social_worker') {
    return path.startsWith('/social-worker');
  }
  if (role === 'volunteer') {
    return path.startsWith('/volunteer');
  }
  return false;
}
