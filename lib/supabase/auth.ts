// ============================================
// Supabase Auth Helper Functions
// ============================================
// Helper functions for user registration and authentication

import { createClient } from '@supabase/supabase-js';
import type { Database, VolunteerRegistrationInput, SocialWorkerRegistrationInput } from './types';

// Initialize Supabase client
// Note: Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ============================================
// Volunteer Registration
// ============================================

export async function registerVolunteer(
  email: string,
  password: string,
  volunteerData: VolunteerRegistrationInput
) {
  try {
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: volunteerData.full_name,
          role: 'volunteer',
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Step 2: Create volunteer profile using database function
    const { data: volunteerId, error: profileError } = await supabase.rpc(
      'create_volunteer_profile',
      {
        p_user_id: authData.user.id,
        p_full_name: volunteerData.full_name,
        p_email: volunteerData.email,
        p_phone: volunteerData.phone || null,
        p_municipality: volunteerData.municipality,
        p_age: volunteerData.age,
        p_gender: volunteerData.gender || null,
        p_languages: volunteerData.languages || [],
        p_motivation: volunteerData.motivation_text,
        p_interests: volunteerData.interests || [],
        p_available_for: volunteerData.available_for || [],
        p_available_days: volunteerData.available_days || [],
        p_hours_per_week: volunteerData.hours_per_week || null,
      }
    );

    if (profileError) {
      // Rollback: Delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return {
      success: true,
      user: authData.user,
      volunteerId,
      message: 'Volunteer registration successful. Please check your email to verify your account.',
    };
  } catch (error) {
    console.error('Volunteer registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

// ============================================
// Social Worker Registration
// ============================================

export async function registerSocialWorker(
  email: string,
  password: string,
  socialWorkerData: SocialWorkerRegistrationInput
) {
  try {
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: socialWorkerData.full_name,
          role: 'social_worker',
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Step 2: Create social worker profile using database function
    const { data: socialWorkerId, error: profileError } = await supabase.rpc(
      'create_social_worker_profile',
      {
        p_user_id: authData.user.id,
        p_full_name: socialWorkerData.full_name,
        p_email: socialWorkerData.email,
        p_work_email: socialWorkerData.work_email,
        p_phone: socialWorkerData.phone || null,
        p_municipality: socialWorkerData.municipality,
        p_department: socialWorkerData.department,
        p_employee_id: socialWorkerData.employee_id,
        p_position: socialWorkerData.position || null,
      }
    );

    if (profileError) {
      // Rollback: Delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return {
      success: true,
      user: authData.user,
      socialWorkerId,
      message:
        'Social worker registration successful. Your account requires admin verification before you can access the system.',
    };
  } catch (error) {
    console.error('Social worker registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

// ============================================
// Login
// ============================================

export async function login(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user role
    const { data: role, error: roleError } = await supabase.rpc('get_user_role', {
      p_user_id: data.user.id,
    });

    if (roleError) throw roleError;

    return {
      success: true,
      user: data.user,
      session: data.session,
      role,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

// ============================================
// Logout
// ============================================

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Logout failed',
    };
  }
}

// ============================================
// Get Current User
// ============================================

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) return null;

    // Get full profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user,
      profile,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// ============================================
// Get User Role
// ============================================

export async function getUserRole(userId: string) {
  try {
    const { data, error } = await supabase.rpc('get_user_role', {
      p_user_id: userId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get user role error:', error);
    return null;
  }
}

// ============================================
// Check Social Worker Access
// ============================================

export async function checkSocialWorkerAccess(
  userId: string,
  requiredLevel: 'viewer' | 'approver' | 'admin' = 'viewer'
) {
  try {
    const { data, error } = await supabase.rpc('check_social_worker_access', {
      p_user_id: userId,
      p_required_level: requiredLevel,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Check social worker access error:', error);
    return false;
  }
}

// ============================================
// Password Reset
// ============================================

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Password reset failed',
    };
  }
}

// ============================================
// Update Password
// ============================================

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error) {
    console.error('Update password error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Password update failed',
    };
  }
}

// ============================================
// Auth State Change Listener
// ============================================

export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}

// ============================================
// Verify Email
// ============================================

export async function verifyEmail(token: string) {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Email verified successfully',
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email verification failed',
    };
  }
}
