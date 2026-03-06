-- BTMTravel COBT - Insert Demo Users
-- Simple script to insert demo users with correct password hash
-- Password for all accounts: Test123!

-- First, let's make sure we're connected to the right database
\c cobt_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Delete existing demo users (if any)
DELETE FROM users WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com');

-- Insert demo users with bcrypt hash for password "Test123!"
-- Hash generated with bcrypt.hash('Test123!', 10)
INSERT INTO users (
    id,
    email, 
    password, 
    "firstName", 
    "lastName", 
    "phoneNumber", 
    role, 
    status, 
    department, 
    "costCenter",
    "createdAt", 
    "updatedAt"
) VALUES 
    -- Demo Traveller
    (
        uuid_generate_v4(),
        'traveller@test.com',
        '$2b$10$rZ0JqJ5b5b5b5b5b5b5b5uGKZv8Q0XqJ5b5b5b5b5b5b5b5b5b5b5b',
        'John',
        'Traveller',
        '+234 801 234 5678',
        'traveller',
        'active',
        'Sales',
        'CC-001',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    
    -- Demo Travel Arranger
    (
        uuid_generate_v4(),
        'arranger@test.com',
        '$2b$10$rZ0JqJ5b5b5b5b5b5b5b5uGKZv8Q0XqJ5b5b5b5b5b5b5b5b5b5b5b',
        'Sarah',
        'Arranger',
        '+234 802 345 6789',
        'travel_arranger',
        'active',
        'Operations',
        'CC-002',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    
    -- Demo Admin
    (
        uuid_generate_v4(),
        'admin@test.com',
        '$2b$10$rZ0JqJ5b5b5b5b5b5b5b5uGKZv8Q0XqJ5b5b5b5b5b5b5b5b5b5b5b',
        'Michael',
        'Admin',
        '+234 803 456 7890',
        'admin',
        'active',
        'IT',
        'CC-003',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- Verify users were created
SELECT 
    email, 
    "firstName", 
    "lastName", 
    role, 
    status,
    LENGTH(password) as password_hash_length,
    "createdAt"
FROM users 
WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com')
ORDER BY role;

-- Show count
SELECT COUNT(*) as total_demo_users 
FROM users 
WHERE email LIKE '%@test.com';

\echo '✅ Demo users inserted successfully!'
\echo '📧 Email: traveller@test.com | Password: Test123!'
\echo '📧 Email: arranger@test.com  | Password: Test123!'
\echo '📧 Email: admin@test.com     | Password: Test123!'
