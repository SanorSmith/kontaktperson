import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { 
        autoRefreshToken: false, 
        persistSession: false 
      }
    });

    // Get all volunteers from database
    const { data: volunteers, error } = await supabaseAdmin
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching volunteers:', error);
      return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 });
    }

    console.log(`Fetched ${volunteers?.length || 0} volunteers from database`);

    return NextResponse.json({ 
      success: true,
      volunteers: volunteers || []
    });

  } catch (error: any) {
    console.error('Get volunteers error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
