// ============================================
// Supabase Client Helper Functions
// ============================================
// Database query helpers for volunteers and social workers

import { supabase } from './auth';
import type {
  Volunteer,
  VolunteerWithProfile,
  SocialWorker,
  SocialWorkerWithProfile,
  VettingNote,
  VettingNoteInput,
  VolunteerFilters,
  MunicipalityStats,
  AssignmentInput,
} from './types';

// ============================================
// Volunteer Queries
// ============================================

export async function getVolunteerProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('profile.user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get volunteer profile error:', error);
    return { data: null, error };
  }
}

export async function updateVolunteerProfile(volunteerId: string, updates: Partial<Volunteer>) {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .update(updates)
      .eq('id', volunteerId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Update volunteer profile error:', error);
    return { data: null, error };
  }
}

export async function getVolunteersByMunicipality(
  municipalityId: string,
  filters?: VolunteerFilters
) {
  try {
    let query = supabase
      .from('volunteers')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('municipality_id', municipalityId);

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.background_check_status) {
      query = query.eq('background_check_status', filters.background_check_status);
    }
    if (filters?.min_age) {
      query = query.gte('age', filters.min_age);
    }
    if (filters?.max_age) {
      query = query.lte('age', filters.max_age);
    }
    if (filters?.languages && filters.languages.length > 0) {
      query = query.overlaps('languages', filters.languages);
    }
    if (filters?.interests && filters.interests.length > 0) {
      query = query.overlaps('interests', filters.interests);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get volunteers by municipality error:', error);
    return { data: null, error };
  }
}

export async function approveVolunteer(volunteerId: string, approverProfileId: string) {
  try {
    const { data, error } = await supabase.rpc('approve_volunteer', {
      p_volunteer_id: volunteerId,
      p_approver_profile_id: approverProfileId,
    });

    if (error) throw error;
    return { success: data, error: null };
  } catch (error) {
    console.error('Approve volunteer error:', error);
    return { success: false, error };
  }
}

export async function rejectVolunteer(
  volunteerId: string,
  approverProfileId: string,
  reason: string
) {
  try {
    const { data, error } = await supabase.rpc('reject_volunteer', {
      p_volunteer_id: volunteerId,
      p_approver_profile_id: approverProfileId,
      p_reason: reason,
    });

    if (error) throw error;
    return { success: data, error: null };
  } catch (error) {
    console.error('Reject volunteer error:', error);
    return { success: false, error };
  }
}

// ============================================
// Social Worker Queries
// ============================================

export async function getSocialWorkerProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('social_workers')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('profile.user_id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get social worker profile error:', error);
    return { data: null, error };
  }
}

export async function verifySocialWorker(
  socialWorkerId: string,
  adminProfileId: string,
  accessLevel: 'viewer' | 'approver' | 'admin' = 'viewer'
) {
  try {
    const { data, error } = await supabase.rpc('verify_social_worker', {
      p_social_worker_id: socialWorkerId,
      p_admin_profile_id: adminProfileId,
      p_access_level: accessLevel,
    });

    if (error) throw error;
    return { success: data, error: null };
  } catch (error) {
    console.error('Verify social worker error:', error);
    return { success: false, error };
  }
}

// ============================================
// Vetting Notes
// ============================================

export async function addVettingNote(
  socialWorkerId: string,
  noteData: VettingNoteInput
) {
  try {
    const { data, error } = await supabase.rpc('add_vetting_note', {
      p_volunteer_id: noteData.volunteer_id,
      p_social_worker_id: socialWorkerId,
      p_note: noteData.note,
      p_note_type: noteData.note_type || 'general',
      p_status_change: noteData.status_change || null,
    });

    if (error) throw error;
    return { noteId: data, error: null };
  } catch (error) {
    console.error('Add vetting note error:', error);
    return { noteId: null, error };
  }
}

export async function getVettingNotes(volunteerId: string) {
  try {
    const { data, error } = await supabase
      .from('vetting_notes')
      .select(`
        *,
        social_worker:social_workers(
          *,
          profile:profiles(*)
        )
      `)
      .eq('volunteer_id', volunteerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get vetting notes error:', error);
    return { data: null, error };
  }
}

// ============================================
// Assignments
// ============================================

export async function createAssignment(
  socialWorkerId: string,
  assignmentData: AssignmentInput
) {
  try {
    const { data, error } = await supabase
      .from('volunteer_assignments')
      .insert({
        volunteer_id: assignmentData.volunteer_id,
        social_worker_id: socialWorkerId,
        client_reference: assignmentData.client_reference,
        start_date: assignmentData.start_date,
        end_date: assignmentData.end_date || null,
        notes: assignmentData.notes || null,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Create assignment error:', error);
    return { data: null, error };
  }
}

export async function getVolunteerAssignments(volunteerId: string) {
  try {
    const { data, error } = await supabase
      .from('volunteer_assignments')
      .select(`
        *,
        social_worker:social_workers(
          *,
          profile:profiles(*)
        )
      `)
      .eq('volunteer_id', volunteerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get volunteer assignments error:', error);
    return { data: null, error };
  }
}

export async function updateAssignmentStatus(
  assignmentId: string,
  status: 'active' | 'completed' | 'terminated',
  notes?: string
) {
  try {
    const { data, error } = await supabase
      .from('volunteer_assignments')
      .update({ status, notes })
      .eq('id', assignmentId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Update assignment status error:', error);
    return { data: null, error };
  }
}

// ============================================
// Municipalities
// ============================================

export async function getAllMunicipalities() {
  try {
    const { data, error } = await supabase
      .from('municipalities')
      .select('*')
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Get municipalities error:', error);
    return { data: null, error };
  }
}

export async function getMunicipalityStats(municipalityId: string): Promise<MunicipalityStats | null> {
  try {
    // Get volunteer counts
    const { data: volunteers, error: volError } = await supabase
      .from('volunteers')
      .select('status')
      .eq('municipality_id', municipalityId);

    if (volError) throw volError;

    // Get active assignments count
    const { data: assignments, error: assignError } = await supabase
      .from('volunteer_assignments')
      .select('id')
      .eq('status', 'active')
      .in('volunteer_id', volunteers?.map(v => v.id) || []);

    if (assignError) throw assignError;

    // Get municipality name
    const { data: municipality, error: munError } = await supabase
      .from('municipalities')
      .select('name')
      .eq('id', municipalityId)
      .single();

    if (munError) throw munError;

    const stats: MunicipalityStats = {
      municipality_id: municipalityId,
      municipality_name: municipality.name,
      total_volunteers: volunteers?.length || 0,
      approved_volunteers: volunteers?.filter(v => v.status === 'approved').length || 0,
      pending_volunteers: volunteers?.filter(v => v.status === 'pending').length || 0,
      rejected_volunteers: volunteers?.filter(v => v.status === 'rejected').length || 0,
      active_assignments: assignments?.length || 0,
    };

    return stats;
  } catch (error) {
    console.error('Get municipality stats error:', error);
    return null;
  }
}

// ============================================
// Search
// ============================================

export async function searchVolunteers(searchTerm: string, municipalityId?: string) {
  try {
    let query = supabase
      .from('volunteers')
      .select(`
        *,
        profile:profiles(*)
      `);

    if (municipalityId) {
      query = query.eq('municipality_id', municipalityId);
    }

    // Search in interests, languages, and motivation text
    query = query.or(
      `interests.cs.{${searchTerm}},languages.cs.{${searchTerm}},motivation_text.ilike.%${searchTerm}%`
    );

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Search volunteers error:', error);
    return { data: null, error };
  }
}
