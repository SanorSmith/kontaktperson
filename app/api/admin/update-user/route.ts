import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, profileData, socialWorkerData } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Update profile
    if (profileData) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ ...profileData, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        return NextResponse.json({ error: 'Failed to update profile: ' + profileError.message }, { status: 400 });
      }
    }

    if (socialWorkerData) {
      const validColumns = ['department', 'phone_work', 'employee_id', 'access_level', 'status', 'position', 'internal_notes'];
      const validSwData: Record<string, any> = {};
      for (const key of validColumns) {
        if (socialWorkerData[key] !== undefined) {
          validSwData[key] = socialWorkerData[key];
        }
      }

      const { data: existing } = await supabaseAdmin
        .from('social_workers')
        .select('id')
        .eq('id', userId)
        .single();

      if (existing) {
        const { error: swError } = await supabaseAdmin
          .from('social_workers')
          .update({ ...validSwData, updated_at: new Date().toISOString() })
          .eq('id', userId);

        if (swError) {
          console.error('Error updating social worker:', swError);
          return NextResponse.json({ error: 'Failed to update social worker: ' + swError.message }, { status: 400 });
        }
      } else {
        const { error: swError } = await supabaseAdmin
          .from('social_workers')
          .insert({
            id: userId,
            ...validSwData,
            status: validSwData.status || 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (swError) {
          console.error('Error inserting social worker:', swError);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'User updated successfully' });

  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
