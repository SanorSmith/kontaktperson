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

    // Get social workers count
    const { count: totalSocialWorkers } = await supabaseAdmin
      .from('social_workers')
      .select('*', { count: 'exact', head: true });

    // Get pending social workers
    const { count: pendingVerification } = await supabaseAdmin
      .from('social_workers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get active social workers
    const { count: activeAccounts } = await supabaseAdmin
      .from('social_workers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get total volunteers
    const { count: totalVolunteers } = await supabaseAdmin
      .from('volunteers')
      .select('*', { count: 'exact', head: true });

    // Get recent social workers (last 5)
    const { data: recentSocialWorkers } = await supabaseAdmin
      .from('social_workers')
      .select(`
        id,
        status,
        created_at,
        profiles!inner(
          full_name,
          email,
          municipality
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get social workers by municipality
    const { data: socialWorkersByMunicipality } = await supabaseAdmin
      .from('profiles')
      .select('municipality')
      .eq('role', 'social_worker')
      .not('municipality', 'is', null);

    // Count by municipality
    const municipalityCounts: Record<string, number> = {};
    socialWorkersByMunicipality?.forEach((sw: any) => {
      const municipality = sw.municipality;
      municipalityCounts[municipality] = (municipalityCounts[municipality] || 0) + 1;
    });

    // Convert to array and sort
    const municipalityData = Object.entries(municipalityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return NextResponse.json({ 
      success: true,
      stats: {
        totalSocialWorkers: totalSocialWorkers || 0,
        pendingVerification: pendingVerification || 0,
        activeAccounts: activeAccounts || 0,
        totalVolunteers: totalVolunteers || 0
      },
      recentActivity: recentSocialWorkers?.map((sw: any) => ({
        id: sw.id,
        name: sw.profiles?.full_name || 'Unknown',
        email: sw.profiles?.email || '',
        municipality: sw.profiles?.municipality || 'Unknown',
        status: sw.status,
        date: sw.created_at
      })) || [],
      municipalityData
    });

  } catch (error: any) {
    console.error('Get admin stats error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
