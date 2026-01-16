/**
 * Admin User Creation Script
 * 
 * This script creates the initial admin user for the Kontaktperson Platform.
 * Run with: npm run create-admin
 * 
 * Prerequisites:
 * - Supabase project configured with environment variables
 * - SUPABASE_SERVICE_ROLE_KEY set in .env.local
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease set these in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin123!Change';
const ADMIN_NAME = 'System Administrator';

async function createAdminUser() {
  console.log('\n🚀 Creating Admin User for Kontaktperson Platform\n');
  console.log('━'.repeat(50));

  try {
    // Step 1: Check if admin already exists
    console.log('\n📋 Step 1: Checking for existing admin...');
    
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL);
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log('\n   To reset the password, use the Supabase dashboard or');
      console.log('   delete the user and run this script again.');
      return;
    }

    // Step 2: Create auth user
    console.log('\n📋 Step 2: Creating auth user...');
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: ADMIN_NAME,
        role: 'admin'
      }
    });

    if (authError) {
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    console.log('✅ Auth user created successfully');
    console.log(`   User ID: ${authUser.user.id}`);

    // Step 3: Create profile with admin role
    console.log('\n📋 Step 3: Creating admin profile...');
    
    const profileData: any = {
      id: authUser.user.id,
      email: ADMIN_EMAIL,
      full_name: ADMIN_NAME,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add must_change_password if column exists (optional)
    try {
      await supabase
        .from('profiles')
        .insert({
          ...profileData,
          must_change_password: true
        });
    } catch (error: any) {
      // If must_change_password column doesn't exist, try without it
      console.log('⚠️  must_change_password column not found, trying without it...');
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (profileError) {
        // If profile creation fails, clean up the auth user
        await supabase.auth.admin.deleteUser(authUser.user.id);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
    }

    console.log('✅ Admin profile created successfully');

    // Step 4: Log the creation in audit log
    console.log('\n📋 Step 4: Logging creation in audit log...');
    
    const { error: auditError } = await supabase
      .from('social_worker_audit_log')
      .insert({
        action: 'admin_created',
        performed_by: authUser.user.id,
        details: {
          email: ADMIN_EMAIL,
          name: ADMIN_NAME,
          created_by: 'system_script'
        },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      console.log('⚠️  Could not log to audit (table may not exist yet)');
    } else {
      console.log('✅ Audit log entry created');
    }

    // Success output
    console.log('\n' + '━'.repeat(50));
    console.log('\n✅ ADMIN USER CREATED SUCCESSFULLY!\n');
    console.log('━'.repeat(50));
    console.log('\n📧 Login Credentials:');
    console.log('━'.repeat(50));
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('━'.repeat(50));
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   1. Change the password immediately after first login');
    console.log('   2. The user will be prompted to change password on first login');
    console.log('   3. Store these credentials securely');
    console.log('   4. Do not share these credentials via insecure channels');
    console.log('\n🔗 Login URL: http://localhost:3000/login');
    console.log('   Admin Panel: http://localhost:3000/admin');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
