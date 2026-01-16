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
      },
      db: {
        schema: 'public'
      }
    });

    // Get volunteer counts grouped by municipality - bypass RLS with service role
    const { data: volunteers, error } = await supabaseAdmin
      .from('volunteers')
      .select('id, municipality, status, full_name');

    if (error) {
      console.error('Error fetching volunteers:', error);
      return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 });
    }

    // Count volunteers by municipality (all volunteers)
    const counts: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    
    console.log('=== VOLUNTEER COUNTS DEBUG ===');
    console.log('Total volunteers in DB:', volunteers?.length || 0);
    
    if (volunteers) {
      volunteers.forEach((volunteer: any, index: number) => {
        const municipalityRaw = volunteer.municipality || 'unknown';
        const municipality = municipalityRaw.toLowerCase();
        const status = volunteer.status || 'no_status';
        
        console.log(`Volunteer ${index + 1}: municipality="${municipalityRaw}" (lowercase: "${municipality}"), status="${status}"`);
        
        // Count all volunteers regardless of status
        counts[municipality] = (counts[municipality] || 0) + 1;
        
        // Track status distribution
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
    }

    console.log('=== VOLUNTEER COUNTS SUMMARY ===');
    console.log('Status distribution:', statusCounts);
    console.log('Counts by municipality:', counts);
    console.log('Total counted:', Object.values(counts).reduce((sum, count) => sum + count, 0));

    return NextResponse.json({ 
      success: true,
      counts,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0)
    });

  } catch (error: any) {
    console.error('Get volunteer counts error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
