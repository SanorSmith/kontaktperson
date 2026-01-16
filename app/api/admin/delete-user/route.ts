import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function deleteUserHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    console.log('=== DELETE USER REQUEST ===');
    console.log('User ID:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Check if user exists before deletion
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .single();
    
    console.log('Profile before delete:', existingProfile);

    if (!existingProfile) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Delete from auth first to prevent trigger recreation
    console.log('Deleting from auth...');
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      console.error('Auth delete error:', authError);
    } else {
      console.log('Auth user deleted successfully');
    }

    // Delete from social_workers table
    console.log('Deleting from social_workers...');
    const { error: swError } = await supabaseAdmin.from('social_workers').delete().eq('id', userId);
    if (swError) {
      console.error('Social workers delete error:', swError);
    } else {
      console.log('Social worker record deleted');
    }

    // Delete from profiles table - this deletes the entire user record
    console.log('Deleting from profiles...');
    const { error: profileError, data: deletedData } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)
      .select();

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      return NextResponse.json({ error: 'Failed to delete profile: ' + profileError.message }, { status: 400 });
    }

    console.log('Profile deleted:', deletedData);

    // Final verification - check all tables
    const { data: profileCheck } = await supabaseAdmin.from('profiles').select('id').eq('id', userId);
    const { data: swCheck } = await supabaseAdmin.from('social_workers').select('id').eq('id', userId);
    
    console.log('Final verification - Profile exists:', profileCheck?.length || 0);
    console.log('Final verification - Social worker exists:', swCheck?.length || 0);
    
    if ((profileCheck && profileCheck.length > 0) || (swCheck && swCheck.length > 0)) {
      console.error('CRITICAL: Records still exist after deletion!');
      return NextResponse.json({ error: 'Deletion verification failed' }, { status: 500 });
    }

    console.log('=== DELETE SUCCESSFUL AND VERIFIED ===');
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully',
      verified: true,
      deletedUser: {
        name: existingProfile.full_name,
        email: existingProfile.email
      }
    });

  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Export both DELETE and POST methods for compatibility
export async function DELETE(request: NextRequest) {
  return deleteUserHandler(request);
}

export async function POST(request: NextRequest) {
  return deleteUserHandler(request);
}
