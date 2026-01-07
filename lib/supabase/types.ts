// ============================================
// TypeScript Types for Supabase Database
// ============================================
// Auto-generated types matching the database schema

export type UserRole = 'volunteer' | 'social_worker' | 'admin';

export type VolunteerStatus = 'pending' | 'approved' | 'rejected' | 'inactive';

export type BackgroundCheckStatus = 'not_started' | 'pending' | 'approved' | 'rejected' | 'expired';

export type SocialWorkerAccessLevel = 'viewer' | 'approver' | 'admin';

export type NoteType = 'general' | 'interview' | 'reference_check' | 'background_check' | 'status_change';

export type AssignmentStatus = 'active' | 'completed' | 'terminated';

// ============================================
// Database Tables
// ============================================

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  municipality: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Municipality {
  id: string;
  name: string;
  county: string;
  region: string | null;
  lat: number | null;
  lng: number | null;
  geometry: any | null; // GeoJSON
  contact_email: string | null;
  created_at: string;
}

export interface Volunteer {
  id: string;
  profile_id: string;
  age: number | null;
  gender: string | null;
  languages: string[];
  interests: string[];
  experience_text: string | null;
  motivation_text: string;
  available_for: string[];
  available_days: string[];
  hours_per_week: number | null;
  municipality_id: string;
  lat: number | null;
  lng: number | null;
  background_check_status: BackgroundCheckStatus;
  background_check_date: string | null;
  reference_1_name: string | null;
  reference_1_contact: string | null;
  reference_2_name: string | null;
  reference_2_contact: string | null;
  status: VolunteerStatus;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialWorker {
  id: string;
  profile_id: string;
  municipality_id: string;
  department: string;
  employee_id: string;
  position: string | null;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  work_email: string;
  access_level: SocialWorkerAccessLevel;
  created_at: string;
  updated_at: string;
}

export interface VettingNote {
  id: string;
  volunteer_id: string;
  social_worker_id: string | null;
  note: string;
  note_type: NoteType | null;
  status_change: string | null;
  is_internal: boolean;
  created_at: string;
}

export interface VolunteerAssignment {
  id: string;
  volunteer_id: string;
  social_worker_id: string;
  client_reference: string;
  start_date: string;
  end_date: string | null;
  status: AssignmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Extended Types with Relations
// ============================================

export interface VolunteerWithProfile extends Volunteer {
  profile: Profile;
}

export interface SocialWorkerWithProfile extends SocialWorker {
  profile: Profile;
}

export interface VettingNoteWithRelations extends VettingNote {
  volunteer?: VolunteerWithProfile;
  social_worker?: SocialWorkerWithProfile;
}

export interface AssignmentWithRelations extends VolunteerAssignment {
  volunteer?: VolunteerWithProfile;
  social_worker?: SocialWorkerWithProfile;
}

// ============================================
// Form Input Types
// ============================================

export interface VolunteerRegistrationInput {
  full_name: string;
  email: string;
  phone?: string;
  municipality: string;
  age: number;
  gender?: string;
  languages?: string[];
  motivation_text: string;
  interests?: string[];
  available_for?: string[];
  available_days?: string[];
  hours_per_week?: number;
  experience_text?: string;
  reference_1_name?: string;
  reference_1_contact?: string;
  reference_2_name?: string;
  reference_2_contact?: string;
}

export interface SocialWorkerRegistrationInput {
  full_name: string;
  email: string;
  work_email: string;
  phone?: string;
  municipality: string;
  department: string;
  employee_id: string;
  position?: string;
}

export interface VettingNoteInput {
  volunteer_id: string;
  note: string;
  note_type?: NoteType;
  status_change?: string;
}

export interface AssignmentInput {
  volunteer_id: string;
  client_reference: string;
  start_date: string;
  end_date?: string;
  notes?: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Filter Types
// ============================================

export interface VolunteerFilters {
  municipality_id?: string;
  status?: VolunteerStatus;
  background_check_status?: BackgroundCheckStatus;
  languages?: string[];
  interests?: string[];
  available_for?: string[];
  min_age?: number;
  max_age?: number;
  min_hours?: number;
  max_hours?: number;
}

export interface SocialWorkerFilters {
  municipality_id?: string;
  verified?: boolean;
  access_level?: SocialWorkerAccessLevel;
  department?: string;
}

// ============================================
// Statistics Types
// ============================================

export interface MunicipalityStats {
  municipality_id: string;
  municipality_name: string;
  total_volunteers: number;
  approved_volunteers: number;
  pending_volunteers: number;
  rejected_volunteers: number;
  active_assignments: number;
}

export interface VolunteerStats {
  total: number;
  by_status: Record<VolunteerStatus, number>;
  by_municipality: Record<string, number>;
  by_background_check: Record<BackgroundCheckStatus, number>;
}

// ============================================
// Database Function Return Types
// ============================================

export interface CreateVolunteerProfileResult {
  volunteer_id: string;
}

export interface CreateSocialWorkerProfileResult {
  social_worker_id: string;
}

export interface ApproveVolunteerResult {
  success: boolean;
}

export interface RejectVolunteerResult {
  success: boolean;
}

export interface VerifySocialWorkerResult {
  success: boolean;
}

// ============================================
// Supabase Database Type
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at'>>;
      };
      municipalities: {
        Row: Municipality;
        Insert: Omit<Municipality, 'created_at'>;
        Update: Partial<Omit<Municipality, 'id' | 'created_at'>>;
      };
      volunteers: {
        Row: Volunteer;
        Insert: Omit<Volunteer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Volunteer, 'id' | 'profile_id' | 'created_at'>>;
      };
      social_workers: {
        Row: SocialWorker;
        Insert: Omit<SocialWorker, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SocialWorker, 'id' | 'profile_id' | 'created_at'>>;
      };
      vetting_notes: {
        Row: VettingNote;
        Insert: Omit<VettingNote, 'id' | 'created_at'>;
        Update: Partial<Omit<VettingNote, 'id' | 'created_at'>>;
      };
      volunteer_assignments: {
        Row: VolunteerAssignment;
        Insert: Omit<VolunteerAssignment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VolunteerAssignment, 'id' | 'created_at'>>;
      };
    };
    Functions: {
      create_volunteer_profile: {
        Args: VolunteerRegistrationInput & { p_user_id: string };
        Returns: string;
      };
      create_social_worker_profile: {
        Args: SocialWorkerRegistrationInput & { p_user_id: string };
        Returns: string;
      };
      approve_volunteer: {
        Args: { p_volunteer_id: string; p_approver_profile_id: string };
        Returns: boolean;
      };
      reject_volunteer: {
        Args: { p_volunteer_id: string; p_approver_profile_id: string; p_reason: string };
        Returns: boolean;
      };
      verify_social_worker: {
        Args: { p_social_worker_id: string; p_admin_profile_id: string; p_access_level?: SocialWorkerAccessLevel };
        Returns: boolean;
      };
      get_volunteers_by_municipality: {
        Args: { p_municipality_id: string; p_status?: VolunteerStatus };
        Returns: VolunteerWithProfile[];
      };
      add_vetting_note: {
        Args: VettingNoteInput & { p_social_worker_id: string };
        Returns: string;
      };
      get_user_role: {
        Args: { p_user_id: string };
        Returns: UserRole;
      };
      check_social_worker_access: {
        Args: { p_user_id: string; p_required_level?: SocialWorkerAccessLevel };
        Returns: boolean;
      };
    };
  };
}
