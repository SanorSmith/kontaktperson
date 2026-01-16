import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { 
        autoRefreshToken: false, 
        persistSession: false 
      }
    });

    const { id } = params;

    // Get volunteer by ID
    const { data: volunteer, error } = await supabaseAdmin
      .from('volunteers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching volunteer:', error);
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    console.log(`Fetched volunteer: ${volunteer.full_name} (ID: ${id})`);

    return NextResponse.json({ 
      success: true,
      volunteer
    });

  } catch (error: any) {
    console.error('Get volunteer error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
