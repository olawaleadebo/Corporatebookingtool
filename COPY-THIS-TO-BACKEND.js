/**
 * BTMTravel COBT - Create Demo Users
 * COPY THIS ENTIRE FILE to your backend directory
 * Save as: create-demo-users.js
 * 
 * Then run: node create-demo-users.js
 */

const bcrypt = require('bcrypt');
const fs = require('fs');

const password = 'Test123!';
const saltRounds = 10;

const demoUsers = [
  {
    email: 'traveller@test.com',
    firstName: 'John',
    lastName: 'Traveller',
    phoneNumber: '+234 801 234 5678',
    role: 'traveller',
    department: 'Sales',
    costCenter: 'CC-001'
  },
  {
    email: 'arranger@test.com',
    firstName: 'Sarah',
    lastName: 'Arranger',
    phoneNumber: '+234 802 345 6789',
    role: 'travel_arranger',
    department: 'Operations',
    costCenter: 'CC-002'
  },
  {
    email: 'admin@test.com',
    firstName: 'Michael',
    lastName: 'Admin',
    phoneNumber: '+234 803 456 7890',
    role: 'admin',
    department: 'IT',
    costCenter: 'CC-003'
  }
];

async function createDemoUsers() {
  console.log('\n🔐 Generating bcrypt hash for password:', password);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    // Generate hash
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('✅ Hash generated:', hash);
    
    // Verify hash works
    const isValid = await bcrypt.compare(password, hash);
    console.log('✅ Hash verification:', isValid ? 'PASSED ✅' : 'FAILED ❌');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (!isValid) {
      console.error('❌ Hash verification failed!');
      return;
    }
    
    // Generate SQL
    let sql = `-- BTMTravel COBT - Demo Users Insert Script
-- Generated on: ${new Date().toISOString()}
-- Password for all accounts: ${password}
-- Bcrypt hash: ${hash}

-- Connect to database
\\c cobt_user;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Delete existing demo users (if any)
DELETE FROM users WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com');

-- Insert demo users
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
) VALUES\n`;

    // Add each user
    demoUsers.forEach((user, index) => {
      const isLast = index === demoUsers.length - 1;
      sql += `    -- ${user.role.replace('_', ' ').toUpperCase()}
    (
        uuid_generate_v4(),
        '${user.email}',
        '${hash}',
        '${user.firstName}',
        '${user.lastName}',
        '${user.phoneNumber}',
        '${user.role}',
        'active',
        '${user.department}',
        '${user.costCenter}',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )${isLast ? ';' : ','}\n\n`;
    });

    // Add verification queries
    sql += `
-- Verify users were created
SELECT 
    email, 
    "firstName", 
    "lastName", 
    role, 
    status,
    LEFT(password, 20) || '...' as password_preview,
    "createdAt"
FROM users 
WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com')
ORDER BY role;

-- Show count
SELECT COUNT(*) as total_demo_users 
FROM users 
WHERE email LIKE '%@test.com';

-- Success message
\\echo '✅ Demo users created successfully!'
\\echo ''
\\echo '📋 LOGIN CREDENTIALS:'
\\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
\\echo '👤 Traveller: traveller@test.com / ${password}'
\\echo '👤 Arranger:  arranger@test.com  / ${password}'
\\echo '👤 Admin:     admin@test.com     / ${password}'
\\echo '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
`;

    // Save to file
    const filename = 'working-demo-users.sql';
    fs.writeFileSync(filename, sql);
    
    console.log('📄 SQL file generated:', filename);
    console.log('\n📋 DEMO CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    demoUsers.forEach(user => {
      console.log(`   ${user.role.padEnd(20)} ${user.email.padEnd(25)} ${password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🚀 NEXT STEPS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('1. Copy SQL file to Docker container:');
    console.log('   docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql');
    console.log('');
    console.log('2. Run the SQL script (YOUR POSTGRES_USER is: cobt_user):');
    console.log('   docker exec -it cobt-postgres psql -U cobt_user -f /tmp/working-demo-users.sql');
    console.log('');
    console.log('3. Verify users were created:');
    console.log('   docker exec -it cobt-postgres psql -U cobt_user -d cobt_user -c "SELECT email, role FROM users;"');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Done! Login with: traveller@test.com / Test123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
createDemoUsers();
