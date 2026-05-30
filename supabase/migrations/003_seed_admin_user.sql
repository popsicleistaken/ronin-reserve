-- ============================================================
-- Ronin Reserve — Seed Admin User in Supabase Auth
-- Run in: Supabase Dashboard > Authentication > Users
-- OR use the SQL below if using service role
-- ============================================================

-- Step 1: Create the auth user via Supabase Dashboard
--   Go to: Authentication > Users > Add user
--   Email: admin@roninpizza.com
--   Password: password123
--   (check "Auto confirm user")

-- Step 2: After creating the auth user, get their UUID from the Users table
--   Then run this SQL to link to admin_users table:

-- insert into admin_users (id, email, name, role)
-- values (
--   '<paste-auth-user-uuid-here>',
--   'admin@roninpizza.com',
--   'Admin',
--   'owner'
-- );

-- NOTE: Replace <paste-auth-user-uuid-here> with the actual UUID
-- from Supabase Dashboard > Authentication > Users
