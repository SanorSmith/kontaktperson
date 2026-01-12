import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, privateEmail, password, fullName, role, municipality, department, accessLevel, employeeId, phone } = body;

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Create user in auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Failed to create user: ' + authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        full_name: fullName,
        role: role,
        municipality: municipality || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: 'Failed to create profile: ' + profileError.message }, { status: 400 });
    }

    // Create social worker entry if role is social_worker
    if (role === 'social_worker') {
      const { error: swError } = await supabaseAdmin
        .from('social_workers')
        .insert({
          id: userId,
          department: department || null,
          phone_work: phone || null,
          employee_id: employeeId || null,
          access_level: accessLevel || 'viewer',
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (swError) {
        console.error('Social worker error:', swError);
      }
    }

    // Note: Email sending removed - implement if needed
    console.log(`User created: ${email}, Private email: ${privateEmail || 'N/A'}`);

    return NextResponse.json({ 
      success: true, 
      user: { id: userId, email },
      emailSent: false 
    });

  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
