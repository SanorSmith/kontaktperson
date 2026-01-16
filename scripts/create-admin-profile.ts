/**
 * Create Admin Profile Script
 * 
 * This script creates the profile for an existing admin user in Supabase.
 * Run with: npx tsx scripts/create-admin-profile.ts
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

const ADMIN_EMAIL = 'admin@example.com';

async function createAdminProfile() {
  console.log('\n🔍 Finding admin user...\n');

  try {
    // Find the admin user
    const { data: users } = await supabase.auth.admin.listUsers();
    const adminUser = users?.users?.find(u => u.email === ADMIN_EMAIL);

    if (!adminUser) {
      console.error('❌ Admin user not found in auth.users');
      console.log('   Run: npm run create-admin first');
      process.exit(1);
    }

    console.log('✅ Found admin user:', adminUser.id);

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();

    if (existingProfile) {
      console.log('✅ Profile already exists:');
      console.log('   Role:', existingProfile.role);
      console.log('   Email:', existingProfile.email);
      
      // Update role to admin if not already
      if (existingProfile.role !== 'admin') {
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', adminUser.id);
        
        if (!error) {
          console.log('✅ Updated role to admin');
        }
      }
      return;
    }

    // Create profile
    console.log('\n📋 Creating admin profile...');
    
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: adminUser.id,
        email: ADMIN_EMAIL,
        full_name: 'System Administrator',
        role: 'admin',
        municipality: 'Stockholm',
        must_change_password: true
      });

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message);
      process.exit(1);
    }

    console.log('\n✅ Admin profile created successfully!');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Login Credentials:');
    console.log('   Email:    admin@example.com');
    console.log('   Password: Admin123!Change');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔗 Login at: http://localhost:3000/login\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdminProfile();
