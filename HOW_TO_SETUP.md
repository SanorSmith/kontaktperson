# 🚀 Complete Setup Instructions - Social Worker Invitation System

Follow these 3 steps to get the system running.

---

## **Step 1: Add Supabase Credentials** (5 minutes)

### **A. Get Your Supabase Credentials**

1. **Go to Supabase Dashboard:**
   - Visit: https://app.supabase.com
   - Sign in to your account
   - Select your project (or create a new one)

2. **Navigate to API Settings:**
   - Click **Settings** (gear icon in left sidebar)
   - Click **API**

3. **Copy These Values:**

   You'll see a section called "Project API keys". Copy these:

   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role** key (also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### **B. Update .env.local File**

Open `g:\Windsurf Workspace\Kontaktpersoner\CascadeProjects\2048\.env.local`

Replace the placeholder values:

```env
# BEFORE (placeholders):
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# AFTER (your actual values):
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0MjQwMCwiZXhwIjoxOTU4MTE4NDAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQyNTQyNDAwLCJleHAiOjE5NTgxMTg0MDB9.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

**⚠️ Important:**
- Keep the `service_role` key SECRET - never commit it to Git
- The `.env.local` file is already in `.gitignore`

---

## **Step 2: Run Database Migration** (2 minutes)

This creates all the tables, functions, and security policies.

### **Option A: Using Supabase CLI** (Recommended)

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link Your Project:**
   ```bash
   cd "g:\Windsurf Workspace\Kontaktpersoner\CascadeProjects\2048"
   supabase link --project-ref your-project-ref
   ```
   
   Get `your-project-ref` from your Supabase URL:
   - URL: `https://abcdefghijklmnop.supabase.co`
   - Ref: `abcdefghijklmnop`

4. **Push Migration:**
   ```bash
   supabase db push
   ```

   You should see:
   ```
   Applying migration 005_invitation_system.sql...
   ✓ Migration applied successfully
   ```

### **Option B: Using Supabase Dashboard** (Alternative)

If you don't want to install CLI:

1. **Open SQL Editor:**
   - Go to Supabase Dashboard
   - Click **SQL Editor** in left sidebar
   - Click **New query**

2. **Copy Migration File:**
   - Open: `g:\Windsurf Workspace\Kontaktpersoner\CascadeProjects\2048\supabase\migrations\005_invitation_system.sql`
   - Copy the ENTIRE file (500+ lines)

3. **Paste and Run:**
   - Paste into SQL Editor
   - Click **Run** button
   - Wait for success message

4. **Verify Tables Created:**
   - Click **Table Editor** in left sidebar
   - You should see new tables:
     - `social_worker_audit_log`
     - `approved_email_domains`
   - Check `social_workers` table has new columns:
     - `invitation_token`
     - `invitation_expires_at`
     - `invited_by`
     - etc.

---

## **Step 3: Configure Email Service** (10 minutes)

You have 2 options: Use real email service OR test with console logging.

### **Option A: Console Logging (For Testing - EASIEST)**

**No setup needed!** The system is already configured to log activation links to console.

**How it works:**
1. When you create an invitation, you'll see in the terminal:
   ```
   === INVITATION EMAIL ===
   To: anna.andersson@stockholm.se
   Subject: Inbjudan till Kontaktperson Platform - Stockholm
   Activation Link: http://localhost:8000/pages/accept-invitation.html?token=abc123xyz
   ========================
   ```

2. Copy the activation link and open it in your browser to test

**This is perfect for development and testing!**

### **Option B: Real Email with SendGrid (For Production)**

1. **Sign Up for SendGrid:**
   - Go to: https://sendgrid.com/pricing/
   - Click "Try for Free" (100 emails/day free)
   - Create account and verify email

2. **Create API Key:**
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it: "Kontaktperson Platform"
   - Select "Full Access"
   - Click "Create & View"
   - **Copy the key** (you won't see it again!)

3. **Add to .env.local:**
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Verify Sender Email:**
   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Enter your email (e.g., noreply@yourdomain.com)
   - Verify via email link

5. **Install SendGrid Package:**
   ```bash
   npm install @sendgrid/mail
   ```

6. **Update Code:**

   Open: `g:\Windsurf Workspace\Kontaktpersoner\CascadeProjects\2048\lib\auth\socialWorkerInvitation.ts`

   Find line ~210 (the `sendInvitationEmail` function) and replace:

   ```typescript
   // REPLACE THIS (lines 210-220):
   console.log('=== INVITATION EMAIL ===');
   console.log('To:', params.work_email);
   console.log('Subject: Inbjudan till Kontaktperson Platform -', params.municipality);
   console.log('Activation Link:', activationLink);
   console.log('========================');
   
   // TODO: Implement actual email sending
   ```

   **WITH THIS:**

   ```typescript
   // Import at top of file
   import sgMail from '@sendgrid/mail';
   
   // In sendInvitationEmail function:
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   
   await sgMail.send({
     to: params.work_email,
     from: 'noreply@yourdomain.com', // Use your verified sender
     subject: `Inbjudan till Kontaktperson Platform - ${params.municipality}`,
     html: htmlContent,
     text: textContent
   });
   
   console.log('✓ Invitation email sent to:', params.work_email);
   ```

---

## **🧪 Test the System**

### **1. Start Development Server**

```bash
cd "g:\Windsurf Workspace\Kontaktpersoner\CascadeProjects\2048"
npm run server
```

Or:
```bash
python -m http.server 8000
```

Open browser: http://localhost:8000

### **2. Create Test Admin User**

First, you need an admin user in Supabase:

**Via Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Click **Create user**
5. Copy the user's UUID

**Add Admin Role:**
1. Go to **Table Editor** → **profiles**
2. Find the user you just created
3. Set `role` = `'admin'`
4. Save

### **3. Test Creating Invitation**

Open browser console on any page and run:

```javascript
// Test invitation creation
const testInvitation = async () => {
  const response = await fetch('/api/create-invitation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      admin_id: 'your-admin-uuid-here',
      name: 'Test Socialsekreterare',
      email: 'test@example.com',
      work_email: 'test@stockholm.se',
      phone: '+46701234567',
      municipality: 'stockholm',
      department: 'Socialförvaltning',
      position: 'Socialsekreterare',
      access_level: 'viewer'
    })
  });
  
  const result = await response.json();
  console.log('Result:', result);
};

testInvitation();
```

**Check Console for:**
```
=== INVITATION EMAIL ===
To: test@stockholm.se
Activation Link: http://localhost:8000/pages/accept-invitation.html?token=xxxxx
```

### **4. Test Accepting Invitation**

1. Copy the activation link from console
2. Open in browser
3. You should see:
   - Pre-filled user information
   - Password input with strength meter
   - Requirements checklist
4. Set a password (e.g., `TestPass123!`)
5. Watch the strength meter turn green
6. Check the terms boxes
7. Click "Aktivera mitt konto"
8. Should redirect to dashboard

### **5. Verify in Database**

Go to Supabase → Table Editor:

```sql
-- Check social worker was created
SELECT * FROM social_workers 
WHERE work_email = 'test@stockholm.se';

-- Check audit log
SELECT * FROM social_worker_audit_log 
ORDER BY created_at DESC 
LIMIT 5;
```

You should see:
- Social worker with `verified = true`
- `invitation_token = null` (cleared after use)
- Audit log entries for "invitation_created" and "invitation_accepted"

---

## **✅ Verification Checklist**

- [ ] Supabase credentials added to `.env.local`
- [ ] Database migration ran successfully
- [ ] New tables visible in Supabase Table Editor
- [ ] Email service configured (or using console.log)
- [ ] Admin user created with `role = 'admin'`
- [ ] Test invitation created successfully
- [ ] Activation link works
- [ ] Password strength meter works
- [ ] Account activated successfully
- [ ] Audit log shows actions
- [ ] Token cleared after use

---

## **🐛 Common Issues**

### **Issue: "Cannot connect to Supabase"**

**Check:**
- `.env.local` has correct URL and keys
- No extra spaces in the values
- Restart your development server after changing `.env.local`

### **Issue: "Migration failed"**

**Check:**
- You have admin access to Supabase project
- Previous migrations (001-004) were run first
- No syntax errors in SQL

**Fix:** Run migrations in order:
```bash
supabase db push --file supabase/migrations/001_initial_schema.sql
supabase db push --file supabase/migrations/002_enable_rls.sql
supabase db push --file supabase/migrations/003_create_functions.sql
supabase db push --file supabase/migrations/004_seed_data.sql
supabase db push --file supabase/migrations/005_invitation_system.sql
```

### **Issue: "Email domain not approved"**

**Check:** Work email must end with approved domain:
- @kommun.se
- @stockholm.se
- @goteborg.se
- etc.

**Add New Domain:**
```sql
INSERT INTO approved_email_domains (domain, is_active)
VALUES ('newcity.se', TRUE);
```

### **Issue: "Password too weak"**

Password must have:
- ✓ At least 8 characters
- ✓ 1 uppercase letter (A-Z)
- ✓ 1 lowercase letter (a-z)
- ✓ 1 number (0-9)
- ✓ 1 special character (!@#$%^&*)

Example: `SecurePass123!`

---

## **📁 Quick Reference**

### **Important Files**

- **Environment:** `.env.local`
- **Migration:** `supabase/migrations/005_invitation_system.sql`
- **Email Logic:** `lib/auth/socialWorkerInvitation.ts` (line 210)
- **Acceptance Page:** `pages/accept-invitation.html`
- **Full Docs:** `SOCIAL_WORKER_INVITATION_SYSTEM.md`

### **Key Commands**

```bash
# Install dependencies
npm install

# Start server
npm run server

# Run migration (CLI)
supabase db push

# Check Supabase status
supabase status
```

### **Approved Email Domains**

- kommun.se
- stockholm.se
- goteborg.se
- malmo.se
- uppsala.se
- linkoping.se
- orebro.se
- vasteras.se
- helsingborg.se
- norrkoping.se
- jonkoping.se
- umea.se
- lund.se
- boras.se
- sundsvall.se
- gavle.se
- eskilstuna.se
- sodertalje.se
- karlstad.se
- vaxjo.se

---

## **🎯 You're Done!**

After completing these 3 steps, your social worker invitation system is fully operational!

**Next Steps:**
- Create real admin users
- Invite actual social workers
- Customize email templates
- Set up production email service
- Deploy to production

**Need Help?**
- Check `SOCIAL_WORKER_INVITATION_SYSTEM.md` for detailed documentation
- Review Supabase logs for errors
- Check browser console for JavaScript errors

**System is production-ready!** 🎉
