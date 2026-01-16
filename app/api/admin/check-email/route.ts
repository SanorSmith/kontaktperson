import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, excludeUserId } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Check if email exists in profiles table
    let query = supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .eq('email', email);

    // Exclude current user when editing
    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data: existingUsers, error } = await query;

    if (error) {
      console.error('Error checking email:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const exists = existingUsers && existingUsers.length > 0;

    return NextResponse.json({
      exists,
      user: exists ? existingUsers[0] : null
    });

  } catch (error: any) {
    console.error('Check email error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
