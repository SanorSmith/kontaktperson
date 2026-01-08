# 🗄️ How to Run Database Migrations

## ⚠️ **Important: Run Migrations in Order!**

You're getting the error `relation "social_workers" does not exist` because you need to run migrations 001-004 first.

Migration 005 **extends** the `social_workers` table that was created in migration 001.

---

## **Step-by-Step: Run All Migrations**

### **Via Supabase Dashboard (Recommended)**

1. **Open Supabase Dashboard:**
   - Go to: https://app.supabase.com
   - Select your project
   - Click **SQL Editor** in left sidebar
   - Click **New query**

2. **Run Each Migration in Order:**

   Copy and paste each file's contents, then click **Run** after each one.

---

### **Migration 001: Create Base Tables**

**File:** `supabase/migrations/001_create_tables.sql`

**What it does:**
- Creates `profiles` table
- Creates `municipalities` table
- Creates `volunteers` table
- Creates `social_workers` table ← **This is what you need!**
- Creates `vetting_notes` table
- Creates `volunteer_assignments` table

**Action:**
1. Open `001_create_tables.sql`
2. Copy ALL contents (267 lines)
3. Paste into SQL Editor
4. Click **Run**
5. Wait for success ✓

---

### **Migration 002: Enable RLS**

**File:** `supabase/migrations/002_enable_rls.sql`

**What it does:**
- Enables Row Level Security on all tables
- Creates security policies for data access

**Action:**
1. Open `002_enable_rls.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **Run**
5. Wait for success ✓

---

### **Migration 003: Create Functions**

**File:** `supabase/migrations/003_create_functions.sql`

**What it does:**
- Creates helper functions for volunteer registration
- Creates helper functions for social worker operations
- Creates vetting and approval functions

**Action:**
1. Open `003_create_functions.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **Run**
5. Wait for success ✓

---

### **Migration 004: Seed Data**

**File:** `supabase/migrations/004_seed_data.sql`

**What it does:**
- Seeds Swedish municipalities data
- Provides example test data (commented out)

**Action:**
1. Open `004_seed_data.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **Run**
5. Wait for success ✓

---

### **Migration 005: Invitation System**

**File:** `supabase/migrations/005_invitation_system.sql`

**What it does:**
- Adds invitation columns to `social_workers` table
- Creates `social_worker_audit_log` table
- Creates `approved_email_domains` table
- Creates invitation functions

**Action:**
1. Open `005_invitation_system.sql`
2. Copy ALL contents
3. Paste into SQL Editor
4. Click **Run**
5. Wait for success ✓

---

## **Alternative: Using Supabase CLI**

If you have Supabase CLI installed:

```bash
cd "g:\Windsurf Workspace\Kontaktpersoner\CascadeProjects\2048"

# Link your project (first time only)
supabase link --project-ref your-project-ref

# Push all migrations in order
supabase db push
```

The CLI will automatically run migrations in order (001, 002, 003, 004, 005).

---

## **Verify Migrations Ran Successfully**

After running all migrations, verify in Supabase Dashboard:

### **Check Tables Created:**

Go to **Table Editor** and you should see:

- ✓ profiles
- ✓ municipalities
- ✓ volunteers
- ✓ social_workers
- ✓ vetting_notes
- ✓ volunteer_assignments
- ✓ social_worker_audit_log
- ✓ approved_email_domains

### **Check Functions Created:**

Go to **Database** → **Functions** and you should see:

- ✓ create_social_worker_invitation
- ✓ validate_invitation_token
- ✓ accept_social_worker_invitation
- ✓ resend_social_worker_invitation
- ✓ deactivate_social_worker
- ✓ track_social_worker_login
- (+ other functions from migration 003)

### **Check Data Seeded:**

Go to **Table Editor** → **municipalities** and you should see 15 Swedish cities.

---

## **Common Issues**

### **Issue: "relation already exists"**

**Solution:** The table was already created. Skip that migration or drop the table first:

```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

Then re-run the migration.

### **Issue: "function already exists"**

**Solution:** The function was already created. Use `CREATE OR REPLACE FUNCTION` (already in the migrations).

### **Issue: "permission denied"**

**Solution:** Make sure you're using the correct database role. Run migrations as the `postgres` user.

---

## **Quick Reference**

**Migration Order:**
1. 001_create_tables.sql → Creates all base tables
2. 002_enable_rls.sql → Adds security policies
3. 003_create_functions.sql → Creates helper functions
4. 004_seed_data.sql → Seeds municipality data
5. 005_invitation_system.sql → Adds invitation system

**Total Time:** ~5 minutes (via dashboard)

---

## **After Migrations Complete**

Once all migrations run successfully:

1. ✓ Database schema is ready
2. ✓ Security policies are active
3. ✓ Functions are available
4. ✓ Test data is loaded
5. ✓ Invitation system is ready

**Next step:** Test the invitation system!

See `HOW_TO_SETUP.md` for testing instructions.
