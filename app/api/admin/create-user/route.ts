import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, role, municipality, department, accessLevel, employeeId, phone } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create user without sending email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email (no email sent)
      user_metadata: {
        full_name: fullName,
        role: role || 'social_worker'
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: role || 'social_worker',
        municipality: municipality || null,
        must_change_password: true
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Don't fail - profile might exist from trigger
    }

    // Create social_worker record if role is social_worker
    if (role === 'social_worker') {
      const { error: swError } = await supabaseAdmin
        .from('social_workers')
        .insert({
          id: authData.user.id,
          employee_id: employeeId || null,
          department: department || 'Socialtjänsten',
          phone_work: phone || null,
          access_level: accessLevel || 'viewer',
          status: 'active'
        });

      if (swError) {
        console.error('Social worker error:', swError);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });

  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
