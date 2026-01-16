import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        municipality: profile.municipality,
        role: profile.role,
        created_at: profile.created_at
      },
      socialWorker: socialWorker ? {
        id: socialWorker.id,
        department: socialWorker.department,
        phone_work: socialWorker.phone_work,
        employee_id: socialWorker.employee_id,
        access_level: socialWorker.access_level,
        status: socialWorker.status,
        position: socialWorker.position,
        internal_notes: socialWorker.internal_notes
      } : null
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
