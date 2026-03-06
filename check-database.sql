-- Check Database Status Script
-- Run this to see what's currently in your database

-- Connect to database
\c cobt_user;

-- Check if users table exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name = 'users';

-- If table exists, show all users
\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo 'CURRENT USERS IN DATABASE:'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

SELECT 
    email, 
    "firstName", 
    "lastName", 
    role, 
    status,
    LEFT(password, 30) || '...' as password_hash_preview,
    LENGTH(password) as hash_length,
    "createdAt"
FROM users 
ORDER BY "createdAt" DESC;

-- Count users by role
\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo 'USERS BY ROLE:'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

SELECT 
    role,
    COUNT(*) as count
FROM users 
GROUP BY role
ORDER BY role;

-- Check for demo users specifically
\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\echo 'DEMO USERS (@test.com):'
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

SELECT 
    email, 
    "firstName" || ' ' || "lastName" as full_name,
    role,
    status
FROM users 
WHERE email LIKE '%@test.com'
ORDER BY email;

-- Total count
\echo ''
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
SELECT 'Total Users: ' || COUNT(*) as summary FROM users;
\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
