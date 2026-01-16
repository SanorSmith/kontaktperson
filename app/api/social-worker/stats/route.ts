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

    // Get user ID from query params
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Get pending applications count
    const { count: pendingApplications } = await supabaseAdmin
      .from('volunteers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get approved volunteers count
    const { count: approvedVolunteers } = await supabaseAdmin
      .from('volunteers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    // Get rejected this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const { count: rejectedThisMonth } = await supabaseAdmin
      .from('volunteers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')
      .gte('updated_at', oneMonthAgo.toISOString());

    // Get pending applications (last 3)
    const { data: pendingApps } = await supabaseAdmin
      .from('volunteers')
      .select('id, full_name, municipality, created_at, languages, status')
      .in('status', ['pending', 'under_review'])
      .order('created_at', { ascending: false })
      .limit(3);

    return NextResponse.json({ 
      success: true,
      stats: {
        pendingApplications: pendingApplications || 0,
        approvedVolunteers: approvedVolunteers || 0,
        rejectedThisMonth: rejectedThisMonth || 0,
        activeMatches: 0 // TODO: Implement when matches table is created
      },
      pendingApplications: pendingApps || [],
      recentActivity: [] // TODO: Implement activity log
    });

  } catch (error: any) {
    console.error('Get social worker stats error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
