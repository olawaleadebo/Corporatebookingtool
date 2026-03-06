# 🔧 BTMTravel COBT - Login Troubleshooting Guide

## Issue: "Username is not working" / Login fails

Follow these steps in order to diagnose and fix the issue.

---

## 🔍 Step 1: Check Current Database Status

Run this command to see what's in your database:

```bash
docker exec -it cobt-postgres psql -U postgres -f /tmp/check-database.sql
```

Or manually:
```bash
docker exec -it cobt-postgres psql -U postgres -d cobt_user -c "SELECT email, role, status FROM users;"
```

### Expected Output:
```
         email          |      role       | status
------------------------+-----------------+--------
 traveller@test.com     | traveller       | active
 arranger@test.com      | travel_arranger | active
 admin@test.com         | admin           | active
```

### If you see no users:
➡️ Go to **Step 2** - Insert Demo Users

### If you see users but login fails:
➡️ Go to **Step 3** - Fix Password Hash

---

## 🔨 Step 2: Insert Demo Users (Fresh Installation)

### Option A: Using the Node.js Script (RECOMMENDED)

This generates a working SQL file with the correct bcrypt hash:

```bash
# 1. Install bcrypt in your backend directory
cd /path/to/cobt-backend
npm install bcrypt

# 2. Run the script (from your frontend/project root)
node create-demo-users.js
```

This will:
- ✅ Generate a valid bcrypt hash
- ✅ Create `working-demo-users.sql`
- ✅ Show you the exact commands to run

Then follow the commands it shows:
```bash
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql
docker exec -it cobt-postgres psql -U postgres -f /tmp/working-demo-users.sql
```

### Option B: Quick Manual Insert

If you can't run Node.js scripts, use this command:

```bash
docker exec -it cobt-postgres psql -U postgres -d cobt_user
```

Then paste this SQL:
```sql
-- First check if table exists
\dt users

-- If table doesn't exist, you need to run migrations first!
-- If table exists, insert users:

DELETE FROM users WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com');

-- You MUST replace the hash below with a real bcrypt hash
-- Get one by running: node create-demo-users.js
INSERT INTO users (id, email, password, "firstName", "lastName", "phoneNumber", role, status, department, "costCenter", "createdAt", "updatedAt") 
VALUES 
(gen_random_uuid(), 'traveller@test.com', 'PASTE_BCRYPT_HASH_HERE', 'John', 'Traveller', '+234 801 234 5678', 'traveller', 'active', 'Sales', 'CC-001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'arranger@test.com', 'PASTE_BCRYPT_HASH_HERE', 'Sarah', 'Arranger', '+234 802 345 6789', 'travel_arranger', 'active', 'Operations', 'CC-002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'admin@test.com', 'PASTE_BCRYPT_HASH_HERE', 'Michael', 'Admin', '+234 803 456 7890', 'admin', 'active', 'IT', 'CC-003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

SELECT email, role FROM users WHERE email LIKE '%@test.com';
\q
```

---

## 🔐 Step 3: Fix Password Hash Issue

If users exist but login fails, the password hash is likely wrong.

### Symptoms:
- ✅ Backend shows "Online"
- ✅ Users exist in database
- ❌ Login returns 401 Unauthorized

### Solution:

Run the hash generator and update users:

```bash
# Generate correct hash
node create-demo-users.js

# Or manually in backend:
cd /path/to/cobt-backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Test123!', 10).then(h => console.log(h));"
```

Copy the generated hash (starts with `$2b$10$...`) and update users:

```bash
docker exec -it cobt-postgres psql -U postgres -d cobt_user
```

```sql
-- Update all demo users with the new hash
UPDATE users 
SET password = 'PASTE_YOUR_GENERATED_HASH_HERE'
WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com');

-- Verify
SELECT email, LEFT(password, 20) || '...' FROM users WHERE email LIKE '%@test.com';
\q
```

---

## 🧪 Step 4: Test Login via API

Test the backend directly to isolate frontend issues:

```bash
curl -X POST https://your-ngrok-url/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{
    "email": "traveller@test.com",
    "password": "Test123!"
  }'
```

### Expected Response:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "traveller@test.com",
    "firstName": "John",
    "role": "traveller"
  }
}
```

### If you get 401 Unauthorized:
- Password hash is wrong → Go back to Step 3
- User doesn't exist → Go back to Step 2

### If you get 500 Internal Server Error:
- Check backend logs: `docker logs cobt-api`
- Database might be down: `docker ps | grep postgres`

---

## 🔍 Step 5: Check Backend Logs

See what the backend is saying:

```bash
# Follow backend logs in real-time
docker logs -f cobt-api

# Last 50 lines
docker logs --tail 50 cobt-api

# Check PostgreSQL logs
docker logs --tail 50 cobt-postgres
```

### Look for these errors:

**"relation 'users' does not exist"**
➡️ Table not created. Run migrations or enable `synchronize: true` in TypeORM config

**"password hash is invalid"**
➡️ bcrypt hash is malformed. Generate new hash with `create-demo-users.js`

**"invalid input syntax for type uuid"**
➡️ UUID extension not installed. Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

---

## 🚑 Emergency Reset

If nothing works, nuclear option:

```bash
# 1. Stop all containers
docker-compose down

# 2. Remove PostgreSQL volume (deletes all data!)
docker volume rm cobt_postgres_data

# 3. Start fresh
docker-compose up -d

# 4. Wait for services to start (30 seconds)
sleep 30

# 5. Create database
docker exec -it cobt-postgres psql -U postgres -c "CREATE DATABASE cobt_user;"
docker exec -it cobt-postgres psql -U postgres -d cobt_user -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# 6. Enable synchronize in TypeORM (in your backend code)
# Set synchronize: true in database config

# 7. Restart backend to auto-create tables
docker-compose restart cobt-api

# 8. Insert demo users
node create-demo-users.js
# Then run the generated SQL file
```

---

## ✅ Verification Checklist

After fixing, verify everything works:

- [ ] Backend status shows "Online" (green)
- [ ] `docker ps` shows all containers running
- [ ] Database check shows 3 demo users
- [ ] API curl test returns access token
- [ ] Frontend login button is enabled
- [ ] Demo login works and redirects to dashboard

---

## 🎯 Quick Reference: Common Commands

```bash
# Check database users
docker exec -it cobt-postgres psql -U postgres -d cobt_user -c "SELECT email, role FROM users;"

# Check container status
docker ps

# Check backend logs
docker logs --tail 50 cobt-api

# Test API health
curl https://your-ngrok-url/api/v1/health -H "ngrok-skip-browser-warning: true"

# Generate password hash
node -e "require('bcrypt').hash('Test123!', 10).then(console.log)"

# Restart everything
docker-compose restart
```

---

## 📞 Still Not Working?

If you've tried everything above:

1. **Share these outputs:**
   ```bash
   docker ps
   docker logs --tail 100 cobt-api
   docker exec -it cobt-postgres psql -U postgres -d cobt_user -c "SELECT email, role, status FROM users;"
   ```

2. **Check environment variables:**
   - Backend `.env` file has correct DB credentials
   - Frontend has correct ngrok URL

3. **Verify network connectivity:**
   - Can containers talk to each other?
   - Is ngrok tunnel active?

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Backend status indicator is GREEN
- ✅ Demo login buttons are ENABLED (not disabled)
- ✅ Clicking "Demo Login as Traveller" redirects to traveller dashboard
- ✅ You see user info in the top-right corner

Good luck! 🚀
