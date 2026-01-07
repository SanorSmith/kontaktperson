# Supabase Database Setup for Kontaktperson Platform

This directory contains the complete database schema and setup instructions for the Kontaktperson Platform with strict user separation between volunteers and social workers.

## 📁 Directory Structure

```
supabase/
├── migrations/
│   ├── 001_create_tables.sql      # Base tables and constraints
│   ├── 002_enable_rls.sql         # Row Level Security policies
│   ├── 003_create_functions.sql   # Helper functions
│   └── 004_seed_data.sql          # Test data
└── README.md                       # This file

lib/supabase/
├── types.ts                        # TypeScript type definitions
├── auth.ts                         # Authentication helpers
└── client.ts                       # Database query helpers
```

## 🚀 Quick Start

### 1. Prerequisites

- Supabase account (sign up at https://supabase.com)
- Supabase CLI installed: `npm install -g supabase`
- Node.js and npm installed

### 2. Initialize Supabase Project

```bash
# Login to Supabase
supabase login

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Or initialize a new local project
supabase init
```

### 3. Run Migrations

```bash
# Run all migrations in order
supabase db push

# Or run individually
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/001_create_tables.sql
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/002_enable_rls.sql
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/003_create_functions.sql
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/004_seed_data.sql
```

### 4. Set Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Install Dependencies

```bash
npm install @supabase/supabase-js
npm install --save-dev @types/node
```

## 📊 Database Schema

### User Roles

The system has three distinct user types:

1. **Volunteers** - Private individuals applying to be contact persons
2. **Social Workers** - Municipality staff who vet and assign volunteers
3. **Admins** - System administrators

### Core Tables

#### `profiles`
Base profile for ALL users. Contains:
- User ID (links to Supabase Auth)
- Full name, email, phone
- Role (volunteer, social_worker, admin)
- Municipality

#### `volunteers`
Volunteer-specific data:
- Personal info (age, gender, languages)
- Application info (motivation, interests, experience)
- Availability (days, hours per week)
- Vetting status (pending, approved, rejected)
- Background check status

#### `social_workers`
Social worker-specific data:
- Work info (department, employee ID, position)
- Verification status (requires admin approval)
- Access level (viewer, approver, admin)
- Work email (must be @kommun.se or @stad.se)

#### `municipalities`
Swedish municipalities with geographic data

#### `vetting_notes`
Internal notes by social workers about volunteers
- **NOT visible to volunteers**
- Only accessible to social workers in same municipality

#### `volunteer_assignments`
Track volunteer-client assignments

## 🔒 Security Model

### Row Level Security (RLS)

All tables have RLS enabled with strict policies:

#### Volunteers Can:
- ✅ View their own profile and data
- ✅ Update their own non-status fields
- ❌ See other volunteers
- ❌ See vetting notes
- ❌ Change their own status
- ❌ See social worker data

#### Social Workers Can:
- ✅ View volunteers in their municipality (approved only for viewers)
- ✅ Update volunteer status (approvers only)
- ✅ Add vetting notes
- ✅ Create assignments
- ✅ View colleagues in same municipality
- ❌ See volunteers in other municipalities
- ❌ Modify their own verification status

#### Admins Can:
- ✅ View all data
- ✅ Verify social workers
- ✅ Modify access levels
- ✅ Approve/reject volunteers across all municipalities

### Access Levels for Social Workers

1. **Viewer** - Can only view approved volunteers
2. **Approver** - Can approve/reject volunteers and create assignments
3. **Admin** - Full access within municipality

## 🔧 Helper Functions

### Registration Functions

```typescript
// Register a volunteer
const result = await registerVolunteer(email, password, {
  full_name: "Anna Andersson",
  email: "anna@example.com",
  municipality: "stockholm",
  age: 28,
  motivation_text: "I want to help people...",
  // ... other fields
});

// Register a social worker
const result = await registerSocialWorker(email, password, {
  full_name: "Karin Svensson",
  email: "karin@example.com",
  work_email: "karin.svensson@stockholm.se",
  municipality: "stockholm",
  department: "Socialtjänsten",
  employee_id: "EMP001",
});
```

### Approval Functions

```typescript
// Approve a volunteer (approvers/admins only)
await approveVolunteer(volunteerId, approverProfileId);

// Reject a volunteer with reason
await rejectVolunteer(volunteerId, approverProfileId, "Reason...");

// Verify a social worker (admins only)
await verifySocialWorker(socialWorkerId, adminProfileId, 'approver');
```

### Query Functions

```typescript
// Get volunteers by municipality
const { data } = await getVolunteersByMunicipality('stockholm', {
  status: 'approved',
  min_age: 25,
  languages: ['Svenska', 'Engelska']
});

// Add vetting note
await addVettingNote(socialWorkerId, {
  volunteer_id: volunteerId,
  note: "Interview completed successfully",
  note_type: 'interview'
});

// Create assignment
await createAssignment(socialWorkerId, {
  volunteer_id: volunteerId,
  client_reference: "CLIENT-2024-001",
  start_date: "2024-01-15"
});
```

## 🧪 Testing

### Test Scenarios

1. **Volunteer Registration**
   - Create auth user
   - Create volunteer profile
   - Verify volunteer can only see own data

2. **Social Worker Registration**
   - Create auth user
   - Create social worker profile
   - Verify requires admin verification
   - Verify cannot access data until verified

3. **Data Isolation**
   - Volunteer A cannot see Volunteer B
   - Social Worker in Stockholm cannot see volunteers in Göteborg
   - Volunteers cannot see vetting notes

4. **Approval Workflow**
   - Viewer cannot approve volunteers
   - Approver can approve volunteers in their municipality
   - Approver cannot approve volunteers in other municipalities

### Running Tests

```bash
# Create test users in Supabase Dashboard
# Authentication > Users > Add User

# Update seed data with actual user IDs
# Edit supabase/migrations/004_seed_data.sql

# Run seed data
supabase db push
```

## 📝 Common Operations

### Create Admin User

```sql
-- In Supabase SQL Editor
INSERT INTO profiles (user_id, full_name, email, role, municipality)
VALUES (
  'your-auth-user-id',
  'Admin User',
  'admin@kontaktperson.se',
  'admin',
  'stockholm'
);
```

### Verify Social Worker

```sql
-- In Supabase SQL Editor
SELECT verify_social_worker(
  'social-worker-id',
  'admin-profile-id',
  'approver'
);
```

### Get Municipality Statistics

```typescript
const stats = await getMunicipalityStats('stockholm');
console.log(stats);
// {
//   municipality_id: 'stockholm',
//   municipality_name: 'Stockholm',
//   total_volunteers: 24,
//   approved_volunteers: 18,
//   pending_volunteers: 6,
//   rejected_volunteers: 0,
//   active_assignments: 12
// }
```

## 🔍 Troubleshooting

### Issue: RLS policies blocking queries

**Solution:** Check that:
- User is authenticated
- User has correct role in profiles table
- Social worker is verified (if applicable)
- Query is for correct municipality

### Issue: Cannot create volunteer profile

**Solution:** Ensure:
- Municipality exists in municipalities table
- User has role='volunteer' in profiles
- All required fields are provided

### Issue: Social worker cannot see volunteers

**Solution:** Verify:
- Social worker is verified (verified=true)
- Querying correct municipality
- Has appropriate access level

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 🤝 Support

For issues or questions:
1. Check this README
2. Review migration files for schema details
3. Check Supabase logs in dashboard
4. Review RLS policies in `002_enable_rls.sql`

## ✅ Checklist

Before deploying to production:

- [ ] All migrations run successfully
- [ ] RLS policies tested and verified
- [ ] Admin user created
- [ ] Test social worker created and verified
- [ ] Test volunteer created
- [ ] Data isolation verified
- [ ] Environment variables set
- [ ] Backup strategy in place
- [ ] Monitoring configured

## 🔐 Security Best Practices

1. **Never disable RLS** - All tables must have RLS enabled
2. **Validate work emails** - Social workers must use @kommun.se or @stad.se
3. **Verify social workers** - Admins must verify before granting access
4. **Audit logs** - Monitor vetting notes and status changes
5. **Regular backups** - Use Supabase automatic backups
6. **Rotate keys** - Regularly rotate service role keys
7. **Monitor access** - Review who has admin access

---

**Last Updated:** January 2026  
**Schema Version:** 1.0.0
