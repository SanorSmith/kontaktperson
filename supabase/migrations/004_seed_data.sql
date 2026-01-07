-- ============================================
-- Migration 004: Seed Data for Testing
-- ============================================
-- This migration adds test data for development and testing

-- ============================================
-- SEED: Municipalities
-- ============================================
INSERT INTO municipalities (id, name, county, region, lat, lng) VALUES
('stockholm', 'Stockholm', 'Stockholm län', 'Stockholm', 59.3293, 18.0686),
('goteborg', 'Göteborg', 'Västra Götalands län', 'Västra Götaland', 57.7089, 11.9746),
('malmo', 'Malmö', 'Skåne län', 'Skåne', 55.6050, 13.0038),
('uppsala', 'Uppsala', 'Uppsala län', 'Uppsala', 59.8586, 17.6389),
('linkoping', 'Linköping', 'Östergötlands län', 'Östergötland', 58.4108, 15.6214),
('orebro', 'Örebro', 'Örebro län', 'Örebro', 59.2753, 15.2134),
('vasteras', 'Västerås', 'Västmanlands län', 'Västmanland', 59.6099, 16.5448),
('helsingborg', 'Helsingborg', 'Skåne län', 'Skåne', 56.0465, 12.6945),
('norrkoping', 'Norrköping', 'Östergötlands län', 'Östergötland', 58.5877, 16.1924),
('jonkoping', 'Jönköping', 'Jönköpings län', 'Småland', 57.7826, 14.1618),
('umea', 'Umeå', 'Västerbottens län', 'Västerbotten', 63.8258, 20.2630),
('lund', 'Lund', 'Skåne län', 'Skåne', 55.7047, 13.1910),
('boras', 'Borås', 'Västra Götalands län', 'Västra Götaland', 57.7210, 12.9401),
('sundsvall', 'Sundsvall', 'Västernorrlands län', 'Västernorrland', 62.3908, 17.3069),
('gavle', 'Gävle', 'Gävleborgs län', 'Gävleborg', 60.6749, 17.1413)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED: Test Admin User
-- ============================================
-- Note: This assumes you have a test user in Supabase Auth
-- You'll need to replace the user_id with actual auth.users id

-- Example admin profile (update user_id after creating auth user)
-- INSERT INTO profiles (user_id, full_name, email, phone, role, municipality)
-- VALUES (
--   '00000000-0000-0000-0000-000000000001'::UUID, -- Replace with actual auth user_id
--   'Admin User',
--   'admin@kontaktperson.se',
--   '+46701234567',
--   'admin',
--   'stockholm'
-- );

-- ============================================
-- SEED: Test Social Worker
-- ============================================
-- Example social worker (update user_id after creating auth user)
-- INSERT INTO profiles (user_id, full_name, email, phone, role, municipality)
-- VALUES (
--   '00000000-0000-0000-0000-000000000002'::UUID, -- Replace with actual auth user_id
--   'Karin Svensson',
--   'karin.svensson@example.com',
--   '+46701234568',
--   'social_worker',
--   'stockholm'
-- );

-- INSERT INTO social_workers (profile_id, municipality_id, department, employee_id, work_email, verified, access_level)
-- VALUES (
--   (SELECT id FROM profiles WHERE email = 'karin.svensson@example.com'),
--   'stockholm',
--   'Socialtjänsten',
--   'EMP001',
--   'karin.svensson@stockholm.se',
--   TRUE,
--   'approver'
-- );

-- ============================================
-- SEED: Test Volunteers
-- ============================================
-- Example volunteers (update user_id after creating auth users)
-- INSERT INTO profiles (user_id, full_name, email, phone, role, municipality)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000003'::UUID, 'Anna Andersson', 'anna@example.com', '+46701234569', 'volunteer', 'stockholm'),
--   ('00000000-0000-0000-0000-000000000004'::UUID, 'Erik Johansson', 'erik@example.com', '+46701234570', 'volunteer', 'stockholm'),
--   ('00000000-0000-0000-0000-000000000005'::UUID, 'Maria Svensson', 'maria@example.com', '+46701234571', 'volunteer', 'goteborg');

-- INSERT INTO volunteers (profile_id, age, gender, languages, motivation_text, interests, available_for, available_days, hours_per_week, municipality_id, status, lat, lng)
-- VALUES 
--   (
--     (SELECT id FROM profiles WHERE email = 'anna@example.com'),
--     28,
--     'Kvinna',
--     ARRAY['Svenska', 'Engelska'],
--     'Jag vill hjälpa ungdomar hitta sin väg i samhället',
--     ARRAY['Läsning', 'Promenader', 'Samtal'],
--     ARRAY['teens', 'adults'],
--     ARRAY['weekdays', 'evenings'],
--     8,
--     'stockholm',
--     'approved',
--     59.3293,
--     18.0686
--   ),
--   (
--     (SELECT id FROM profiles WHERE email = 'erik@example.com'),
--     35,
--     'Man',
--     ARRAY['Svenska', 'Engelska'],
--     'Har erfarenhet av att arbeta med människor i kris',
--     ARRAY['Sport', 'Matlagning', 'Musik'],
--     ARRAY['adults'],
--     ARRAY['weekends'],
--     5,
--     'stockholm',
--     'pending',
--     59.3293,
--     18.0686
--   ),
--   (
--     (SELECT id FROM profiles WHERE email = 'maria@example.com'),
--     42,
--     'Kvinna',
--     ARRAY['Svenska', 'Danska'],
--     'Brinner för att skapa meningsfulla relationer',
--     ARRAY['Trädgård', 'Musik', 'Konst'],
--     ARRAY['children', 'teens'],
--     ARRAY['weekdays'],
--     10,
--     'goteborg',
--     'approved',
--     57.7089,
--     11.9746
--   );

-- ============================================
-- INSTRUCTIONS FOR TESTING
-- ============================================
-- 
-- To use this seed data:
-- 
-- 1. Create test users in Supabase Auth:
--    - Go to Authentication > Users in Supabase Dashboard
--    - Create users with emails matching the profiles above
--    - Copy their user_id (UUID)
-- 
-- 2. Update the INSERT statements above:
--    - Replace the placeholder UUIDs with actual auth.users IDs
--    - Uncomment the INSERT statements
-- 
-- 3. Run this migration:
--    supabase db push
-- 
-- 4. Test the following scenarios:
--    - Volunteer can register and see only their own data
--    - Social worker can see volunteers in their municipality
--    - Social worker cannot see volunteers in other municipalities
--    - Volunteer cannot see other volunteers
--    - Social worker can add vetting notes
--    - Volunteer cannot see vetting notes
--    - Only approvers can change volunteer status
-- 
-- ============================================

COMMENT ON TABLE municipalities IS 'Seeded with 15 major Swedish municipalities for testing';
