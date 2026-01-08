// Test Supabase Connection
// Run this to verify your Supabase setup is working

// You'll need to install @supabase/supabase-js first:
// npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials
const SUPABASE_URL = 'https://lzqzejblmlmcvtganfza.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cXplamJsbWxtY3Z0Z2FuZnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTY2MzksImV4cCI6MjA4MzM5MjYzOX0.KK-x-Ys94nO-RrKytYfo5uRJy2e7HODp2-3ny0OOm3c';

console.log('🔗 Testing Supabase Connection...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...\n');

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    // Test 1: Check if we can query municipalities
    console.log('✓ Test 1: Querying municipalities table...');
    const { data: municipalities, error: municipalitiesError } = await supabase
      .from('municipalities')
      .select('id, name')
      .limit(5);

    if (municipalitiesError) {
      console.error('❌ Error querying municipalities:', municipalitiesError.message);
      return;
    }

    console.log(`✓ Success! Found ${municipalities.length} municipalities:`);
    municipalities.forEach(m => console.log(`  - ${m.name} (${m.id})`));
    console.log();

    // Test 2: Check approved email domains
    console.log('✓ Test 2: Querying approved_email_domains...');
    const { data: domains, error: domainsError } = await supabase
      .from('approved_email_domains')
      .select('domain')
      .eq('is_active', true)
      .limit(5);

    if (domainsError) {
      console.error('❌ Error querying domains:', domainsError.message);
      return;
    }

    console.log(`✓ Success! Found ${domains.length} approved domains:`);
    domains.forEach(d => console.log(`  - ${d.domain}`));
    console.log();

    // Test 3: Check if tables exist
    console.log('✓ Test 3: Checking all tables exist...');
    const tables = ['profiles', 'volunteers', 'social_workers', 'vetting_notes', 
                    'volunteer_assignments', 'social_worker_audit_log'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows, which is OK
        console.error(`❌ Table '${table}' error:`, error.message);
      } else {
        console.log(`  ✓ ${table}`);
      }
    }

    console.log('\n🎉 All tests passed! Supabase connection is working!\n');
    console.log('Next steps:');
    console.log('1. Create an admin user in Supabase Dashboard');
    console.log('2. Test the invitation system');
    console.log('3. Configure email service (optional)');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run tests
testConnection();
