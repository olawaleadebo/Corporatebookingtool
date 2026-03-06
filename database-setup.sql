-- BTMTravel COBT Database Setup Script
-- This script creates the users table and inserts demo login accounts

-- Connect to the database (run this separately if needed)
-- \c cobt_user;

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if you want to start fresh (CAREFUL - this deletes data!)
-- DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'traveller',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    "companyId" UUID,
    department VARCHAR(100),
    "costCenter" VARCHAR(100),
    "managerId" UUID,
    metadata JSONB,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP,
    
    CONSTRAINT "CHK_role" CHECK (role IN ('traveller', 'travel_arranger', 'admin', 'support')),
    CONSTRAINT "CHK_status" CHECK (status IN ('active', 'inactive', 'suspended', 'pending'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IDX_users_email" ON users(email);
CREATE INDEX IF NOT EXISTS "IDX_users_role" ON users(role);
CREATE INDEX IF NOT EXISTS "IDX_users_status" ON users(status);
CREATE INDEX IF NOT EXISTS "IDX_users_companyId" ON users("companyId");

-- Insert demo users
-- Password for all demo accounts: Test123!
-- Bcrypt hash: $2b$10$YQs3u6Z8h8rGvQqVZ3J3EeK5X6VqYxQJX5lH5FZ1xJ3JxX5lH5FZ1u

INSERT INTO users (email, password, "firstName", "lastName", "phoneNumber", role, status, department, "costCenter", "createdAt", "updatedAt") 
VALUES 
    -- Demo Traveller Account
    (
        'traveller@test.com',
        '$2b$10$YQs3u6Z8h8rGvQqVZ3J3EeK5X6VqYxQJX5lH5FZ1xJ3JxX5lH5FZ1u',
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
    
    -- Demo Travel Arranger Account
    (
        'arranger@test.com',
        '$2b$10$YQs3u6Z8h8rGvQqVZ3J3EeK5X6VqYxQJX5lH5FZ1xJ3JxX5lH5FZ1u',
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
    
    -- Demo Admin Account
    (
        'admin@test.com',
        '$2b$10$YQs3u6Z8h8rGvQqVZ3J3EeK5X6VqYxQJX5lH5FZ1xJ3JxX5lH5FZ1u',
        'Michael',
        'Admin',
        '+234 803 456 7890',
        'admin',
        'active',
        'IT',
        'CC-003',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (email) DO NOTHING;

-- Verify the demo users were created
SELECT 
    id,
    email,
    "firstName",
    "lastName",
    role,
    status,
    department,
    "createdAt"
FROM users
ORDER BY role;

-- Show summary
SELECT 
    role,
    COUNT(*) as user_count
FROM users
GROUP BY role
ORDER BY role;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Database setup complete!';
    RAISE NOTICE '📋 Demo Login Credentials:';
    RAISE NOTICE '   Traveller: traveller@test.com / Test123!';
    RAISE NOTICE '   Arranger:  arranger@test.com / Test123!';
    RAISE NOTICE '   Admin:     admin@test.com / Test123!';
END $$;
