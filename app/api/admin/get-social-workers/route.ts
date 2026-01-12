import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log('=== FETCHING SOCIAL WORKERS ===');
    
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('role', 'social_worker')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch social workers' }, { status: 500 });
    }

    const { data: socialWorkers } = await supabaseAdmin
      .from('social_workers')
      .select('*');

    const mergedData = (profiles || []).map(profile => {
      const swData = socialWorkers?.find(sw => sw.id === profile.id);
      return {
        id: profile.id,
        name: profile.full_name || profile.email?.split('@')[0] || 'Okänt namn',
        email: profile.email || '',
        municipality: profile.municipality || 'Okänd',
        department: swData?.department || 'Socialtjänsten',
        position: swData?.position || 'Socialsekreterare',
        accessLevel: swData?.access_level || 'viewer',
        status: swData?.status || 'pending',
        createdAt: profile.created_at?.split('T')[0] || ''
      };
    });

    console.log(`Found ${mergedData.length} social workers in database`);
    console.log('Social worker IDs:', mergedData.map(sw => ({ id: sw.id, email: sw.email })));
    
    const response = NextResponse.json({ socialWorkers: mergedData });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;

  } catch (error: any) {
    console.error('Get social workers error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
