// Admin System TypeScript Types

export type UserRole = 'admin' | 'social_worker' | 'viewer';
export type AccessLevel = 'viewer' | 'approver' | 'admin';
export type VolunteerStatus = 'pending' | 'approved' | 'rejected' | 'inactive';
export type SocialWorkerStatus = 'pending' | 'verified' | 'inactive';
export type Position = 'Socialsekreterare' | 'Teamledare' | 'Enhetschef' | 'Chef';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  must_change_password?: boolean;
}

export interface SocialWorker {
  id: string;
  profile_id: string;
  work_email: string;
  phone: string;
  municipality_id: string;
  department: string;
  position: Position;
  employee_number?: string;
  access_level: AccessLevel;
  is_active: boolean;
  verified: boolean;
  verified_at?: string;
  invitation_token?: string;
  invitation_sent_at?: string;
  invitation_expires_at?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  profile?: Profile;
  municipality?: Municipality;
}

export interface Volunteer {
  id: string;
  profile_id: string;
  municipality_id: string;
  birth_year: number;
  phone: string;
  address?: string;
  has_drivers_license: boolean;
  has_car: boolean;
  languages: string[];
  interests: string[];
  experience?: string;
  motivation?: string;
  availability: string;
  status: VolunteerStatus;
  background_check_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  notes: VolunteerNote[];
  created_at: string;
  updated_at: string;
  // Joined fields
  profile?: Profile;
  municipality?: Municipality;
  approver?: Profile;
}

export interface VolunteerNote {
  id: string;
  volunteer_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface Municipality {
  id: string;
  name: string;
  county: string;
  region: string;
  code: string;
  coordinates?: { lat: number; lng: number };
  is_active: boolean;
  created_at: string;
}

export interface ApprovedEmailDomain {
  id: string;
  domain: string;
  municipality_id?: string;
  is_active: boolean;
  added_by: string;
  created_at: string;
  municipality?: Municipality;
  added_by_profile?: Profile;
}

export interface AuditLog {
  id: string;
  action: AuditAction;
  performed_by: string;
  target_id?: string;
  target_type?: 'social_worker' | 'volunteer' | 'profile' | 'municipality' | 'domain';
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  performer?: Profile;
  target_social_worker?: SocialWorker;
}

export type AuditAction = 
  | 'invitation_created'
  | 'invitation_accepted'
  | 'invitation_resent'
  | 'account_activated'
  | 'account_deactivated'
  | 'account_deleted'
  | 'profile_updated'
  | 'password_reset'
  | 'login_success'
  | 'login_failed'
  | 'volunteer_approved'
  | 'volunteer_rejected'
  | 'volunteer_status_changed'
  | 'permission_changed'
  | 'domain_added'
  | 'domain_removed'
  | 'municipality_added'
  | 'municipality_updated'
  | 'settings_changed';

export interface SystemSettings {
  id: string;
  platform_name: string;
  support_email: string;
  max_failed_login_attempts: number;
  session_timeout_minutes: number;
  allow_new_registrations: boolean;
  maintenance_mode: boolean;
  default_from_email: string;
  default_from_name: string;
  updated_at: string;
  updated_by: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  key: PermissionKey;
}

export type PermissionKey = 
  | 'can_search_volunteers'
  | 'can_view_full_profiles'
  | 'can_approve_applications'
  | 'can_reject_applications'
  | 'can_edit_volunteer_profiles'
  | 'can_add_notes'
  | 'can_export_data'
  | 'can_manage_users'
  | 'can_view_statistics';

export interface AccessLevelPermissions {
  access_level: AccessLevel;
  permissions: PermissionKey[];
}

export const DEFAULT_PERMISSIONS: Record<AccessLevel, PermissionKey[]> = {
  viewer: [
    'can_search_volunteers',
    'can_view_full_profiles',
  ],
  approver: [
    'can_search_volunteers',
    'can_view_full_profiles',
    'can_approve_applications',
    'can_reject_applications',
    'can_edit_volunteer_profiles',
    'can_add_notes',
    'can_export_data',
  ],
  admin: [
    'can_search_volunteers',
    'can_view_full_profiles',
    'can_approve_applications',
    'can_reject_applications',
    'can_edit_volunteer_profiles',
    'can_add_notes',
    'can_export_data',
    'can_manage_users',
    'can_view_statistics',
  ],
};

export interface DashboardStats {
  totalSocialWorkers: number;
  pendingVerification: number;
  activeAccounts: number;
  totalVolunteers: number;
  pendingVolunteers: number;
  approvedVolunteers: number;
}

export interface RecentActivity {
  id: string;
  type: 'registration' | 'verification' | 'approval' | 'rejection';
  name: string;
  email: string;
  municipality: string;
  status: string;
  date: string;
}

// Form types
export interface SocialWorkerFormData {
  full_name: string;
  email: string;
  work_email: string;
  phone: string;
  municipality_id: string;
  department: string;
  position: Position;
  employee_number?: string;
  access_level: AccessLevel;
  internal_notes?: string;
}

export interface MunicipalityFormData {
  name: string;
  county: string;
  region: string;
  code: string;
  coordinates?: { lat: number; lng: number };
}

export interface DomainFormData {
  domain: string;
  municipality_id?: string;
  is_active: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter types
export interface SocialWorkerFilters {
  municipality?: string;
  status?: 'all' | 'verified' | 'pending' | 'inactive';
  accessLevel?: AccessLevel | 'all';
  search?: string;
}

export interface VolunteerFilters {
  municipality?: string;
  status?: VolunteerStatus | 'all';
  search?: string;
}

export interface AuditLogFilters {
  dateFrom?: string;
  dateTo?: string;
  action?: AuditAction | 'all';
  performedBy?: string;
  targetId?: string;
  municipality?: string;
}
