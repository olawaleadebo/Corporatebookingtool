# 🗄️ BTMTravel COBT - Database Setup Guide

This guide will help you set up the PostgreSQL database with demo login credentials.

## 📋 Demo Login Credentials

After running the setup script, you can login with:

| Role | Email | Password |
|------|-------|----------|
| **Traveller** | traveller@test.com | Test123! |
| **Travel Arranger** | arranger@test.com | Test123! |
| **Admin** | admin@test.com | Test123! |

---

## 🚀 Quick Setup (Recommended)

### Step 1: Generate Password Hash

First, we need to generate a proper bcrypt hash for the password:

```bash
# Navigate to your backend directory
cd /path/to/cobt-backend

# Install bcrypt if not already installed
npm install bcrypt

# Run the hash generator
node ../generate-password-hash.js
```

Copy the generated hash - you'll need it for the SQL script.

### Step 2: Update SQL Script

Open `database-setup.sql` and replace the password hash with the one you just generated:

```sql
-- Replace this line in all INSERT statements:
'$2b$10$YQs3u6Z8h8rGvQqVZ3J3EeK5X6VqYxQJX5lH5FZ1xJ3JxX5lH5FZ1u',

-- With your generated hash:
'$2b$10$YOUR_GENERATED_HASH_HERE',
```

### Step 3: Run the SQL Script

#### Option A: Using Docker Exec (Easiest)

```bash
# Copy SQL file into the container
docker cp database-setup.sql cobt-postgres:/tmp/setup.sql

# Run the SQL script
docker exec -it cobt-postgres psql -U postgres -d cobt_user -f /tmp/setup.sql
```

#### Option B: Using psql Command Line

```bash
# Connect to PostgreSQL
docker exec -it cobt-postgres psql -U postgres

# Inside PostgreSQL prompt:
\c cobt_user;
\i /tmp/setup.sql
\q
```

#### Option C: Copy and Paste

```bash
# Connect to PostgreSQL
docker exec -it cobt-postgres psql -U postgres -d cobt_user

# Then copy and paste the contents of database-setup.sql
```

### Step 4: Verify Setup

```bash
# Connect to database
docker exec -it cobt-postgres psql -U postgres -d cobt_user

# Check if users exist
SELECT email, "firstName", "lastName", role FROM users;

# Exit
\q
```

You should see:
```
         email          | firstName | lastName |      role       
------------------------+-----------+----------+-----------------
 traveller@test.com     | John      | Traveller| traveller
 arranger@test.com      | Sarah     | Arranger | travel_arranger
 admin@test.com         | Michael   | Admin    | admin
```

---

## 🔧 Alternative: Manual Database Setup

If the SQL script doesn't work, you can set up the database manually:

### 1. Create Database

```bash
docker exec -it cobt-postgres psql -U postgres
```

```sql
CREATE DATABASE cobt_user;
\c cobt_user;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Use TypeORM Synchronize (Development Only)

In your NestJS backend, temporarily enable synchronize:

**src/config/database.config.ts** or **app.module.ts**:
```typescript
TypeOrmModule.forRoot({
  // ... other config
  synchronize: true,  // Add this - it will auto-create tables
  // ... other config
})
```

**Restart your backend:**
```bash
docker-compose restart cobt-api
```

This will automatically create the `users` table.

### 3. Insert Demo Users via Backend Seed Script

Create a seed script in your backend:

**src/scripts/seed-users.ts**:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  const demoUsers = [
    {
      email: 'traveller@test.com',
      password: 'Test123!',
      firstName: 'John',
      lastName: 'Traveller',
      phoneNumber: '+234 801 234 5678',
      role: 'traveller',
      department: 'Sales',
      costCenter: 'CC-001',
    },
    {
      email: 'arranger@test.com',
      password: 'Test123!',
      firstName: 'Sarah',
      lastName: 'Arranger',
      phoneNumber: '+234 802 345 6789',
      role: 'travel_arranger',
      department: 'Operations',
      costCenter: 'CC-002',
    },
    {
      email: 'admin@test.com',
      password: 'Test123!',
      firstName: 'Michael',
      lastName: 'Admin',
      phoneNumber: '+234 803 456 7890',
      role: 'admin',
      department: 'IT',
      costCenter: 'CC-003',
    },
  ];

  for (const userData of demoUsers) {
    try {
      await authService.register(userData);
      console.log(`✅ Created user: ${userData.email}`);
    } catch (error) {
      console.log(`⚠️ User ${userData.email} might already exist`);
    }
  }

  await app.close();
  console.log('✅ Seeding complete!');
}

seedUsers();
```

**Run the seed script:**
```bash
npm run build
node dist/scripts/seed-users.js
```

---

## ✅ Verification Checklist

After setup, verify everything works:

1. **Check Database Connection:**
   ```bash
   docker exec -it cobt-postgres psql -U postgres -d cobt_user -c "SELECT COUNT(*) FROM users;"
   ```
   Should return: `count: 3`

2. **Test Login API:**
   ```bash
   curl -X POST https://your-ngrok-url/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -H "ngrok-skip-browser-warning: true" \
     -d '{"email":"traveller@test.com","password":"Test123!"}'
   ```
   Should return user data with access token.

3. **Test Frontend Login:**
   - Open your app
   - Backend status should show "Backend Online" 
   - Click "Demo Login as Traveller"
   - Should redirect to traveller dashboard

---

## 🐛 Troubleshooting

### "relation 'users' does not exist"
- Run the SQL script again
- Or enable `synchronize: true` in TypeORM config

### "password hash is invalid"
- Make sure you generated the bcrypt hash correctly
- Use the `generate-password-hash.js` script
- Hash must start with `$2b$` or `$2a$`

### "database 'cobt_user' does not exist"
```bash
docker exec -it cobt-postgres psql -U postgres -c "CREATE DATABASE cobt_user;"
```

### Demo login doesn't work
1. Check if users exist: `SELECT * FROM users;`
2. Verify password hash is correct
3. Check backend logs for authentication errors
4. Make sure backend is using bcrypt with same salt rounds (10)

---

## 📞 Need Help?

If you're still having issues:
1. Check backend logs: `docker logs cobt-api`
2. Check PostgreSQL logs: `docker logs cobt-postgres`
3. Verify environment variables in `.env` file
4. Make sure all Docker containers are running: `docker ps`

---

## 🎉 Success!

Once setup is complete, you should be able to:
- ✅ See "Backend Online" on login page
- ✅ Login with demo credentials
- ✅ Access role-specific dashboards
- ✅ Test the booking flow

Happy coding! 🚀
