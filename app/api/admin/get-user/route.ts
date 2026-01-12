import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Get profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get social worker data
    const { data: socialWorker } = await supabaseAdmin
      .from('social_workers')
      .select('*')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      user: {
        id: profile.id,
        name: profile.full_name,
        email: profile.email,
        municipality: profile.municipality,
        role: profile.role,
        department: socialWorker?.department,
        phone: socialWorker?.phone_work,
        employeeId: socialWorker?.employee_id,
        accessLevel: socialWorker?.access_level,
        status: socialWorker?.status,
        createdAt: profile.created_at
      }
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
