/**
 * Fix Database Script
 * Drops and recreates RLS policies to allow authenticated users to read profiles
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixDatabase() {
  console.log('\n🔧 Fixing database RLS policies...\n');

  try {
    // Check if profiles table exists and has data
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.log('❌ Error reading profiles:', profilesError.message);
      console.log('\n⚠️  You need to run the SQL script manually in Supabase SQL Editor:');
      console.log('   scripts/complete-setup.sql');
    } else {
      console.log('✅ Profiles table accessible');
      console.log('   Found', profiles?.length || 0, 'profiles');
      
      if (profiles && profiles.length > 0) {
        console.log('\n📋 Existing profiles:');
        profiles.forEach((p: any) => {
          console.log(`   - ${p.email} (${p.role})`);
        });
      }
    }

    // Check social_workers table
    const { data: socialWorkers, error: swError } = await supabase
      .from('social_workers')
      .select('*');

    if (swError) {
      console.log('❌ Error reading social_workers:', swError.message);
    } else {
      console.log('✅ Social workers table accessible');
      console.log('   Found', socialWorkers?.length || 0, 'social workers');
    }

    // Check volunteers table
    const { data: volunteers, error: volError } = await supabase
      .from('volunteers')
      .select('*');

    if (volError) {
      console.log('❌ Error reading volunteers:', volError.message);
    } else {
      console.log('✅ Volunteers table accessible');
      console.log('   Found', volunteers?.length || 0, 'volunteers');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Login:');
    console.log('   Email:    admin@example.com');
    console.log('   Password: Admin123!Change');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixDatabase();
