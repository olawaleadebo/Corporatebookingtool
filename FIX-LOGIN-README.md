# 🚀 BTMTravel COBT - Fix Login Issues

Your backend is connected, but demo login isn't working. This guide will fix it.

## 🎯 The Problem

The PostgreSQL database exists, but either:
1. The `users` table doesn't have demo accounts, OR
2. The password hash is incorrect

## ✅ The Solution (3 Simple Steps)

### Step 1: Generate Working SQL File

```bash
# Make sure you're in the project root directory (where these files are)
# Install bcrypt if needed
cd /path/to/cobt-backend
npm install bcrypt
cd -

# Run the generator
node create-demo-users.js
```

This creates `working-demo-users.sql` with a **valid bcrypt hash** for password `Test123!`

### Step 2: Copy SQL to Docker Container

```bash
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql
```

### Step 3: Run the SQL Script

```bash
docker exec -it cobt-postgres psql -U postgres -f /tmp/working-demo-users.sql
```

### ✅ Done! 

You should see:
```
✅ Demo users created successfully!

📋 LOGIN CREDENTIALS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Traveller: traveller@test.com / Test123!
👤 Arranger:  arranger@test.com  / Test123!
👤 Admin:     admin@test.com     / Test123!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🧪 Verify It's Working

### Test 1: Check Database
```bash
docker exec -it cobt-postgres psql -U postgres -d cobt_user -c "SELECT email, role FROM users WHERE email LIKE '%@test.com';"
```

Expected output:
```
         email          |      role       
------------------------+-----------------
 traveller@test.com     | traveller
 arranger@test.com      | travel_arranger
 admin@test.com         | admin
```

### Test 2: Test API Login
```bash
# Replace YOUR_NGROK_URL with your actual ngrok URL
curl -X POST https://YOUR_NGROK_URL/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"email":"traveller@test.com","password":"Test123!"}'
```

Should return:
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "email": "traveller@test.com",
    "firstName": "John",
    "role": "traveller"
  }
}
```

### Test 3: Try Frontend Login

1. Open your app
2. Backend status should be **GREEN** ("Backend Online")
3. Click **"Demo Login as Traveller"**
4. Should redirect to traveller dashboard ✅

---

## 🔍 Still Not Working?

### If users table doesn't exist:

You need to create it first. Run migrations in your backend:

```bash
cd /path/to/cobt-backend

# Try these commands (one should work):
npm run migration:run
# OR
npm run typeorm migration:run
# OR
npx typeorm migration:run -d src/config/typeorm.config.ts
```

**OR** enable auto-sync (development only):

In your TypeORM config file, add:
```typescript
{
  // ... other config
  synchronize: true,  // Add this line
  // ... other config
}
```

Then restart backend:
```bash
docker-compose restart cobt-api
```

### If login returns 401 Unauthorized:

Password hash is wrong. Make sure you:
1. Used `create-demo-users.js` to generate the hash
2. The hash starts with `$2b$10$` or `$2a$10$`
3. Password in script matches what you're entering: `Test123!`

### If backend shows offline:

Check backend is running:
```bash
docker ps | grep cobt-api
docker logs --tail 50 cobt-api
```

---

## 📁 Files Reference

- **`create-demo-users.js`** - Generates SQL with correct bcrypt hash (USE THIS!)
- **`working-demo-users.sql`** - Generated SQL file (created by above script)
- **`check-database.sql`** - Check current database status
- **`TROUBLESHOOTING.md`** - Comprehensive troubleshooting guide
- **`quick-fix-login.sh`** - Interactive bash script to help diagnose issues

---

## 💡 Quick Commands

```bash
# Generate SQL file
node create-demo-users.js

# Copy and run SQL
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql
docker exec -it cobt-postgres psql -U postgres -f /tmp/working-demo-users.sql

# Check users
docker exec -it cobt-postgres psql -U postgres -d cobt_user -c "SELECT email, role FROM users;"

# Check backend logs
docker logs --tail 50 cobt-api

# Restart backend
docker-compose restart cobt-api
```

---

## 🎯 Demo Credentials

After setup, use these to login:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Traveller** | traveller@test.com | Test123! | Book flights, hotels, cars |
| **Travel Arranger** | arranger@test.com | Test123! | Approve/reject bookings |
| **Admin** | admin@test.com | Test123! | Manage users, settings |

---

## ✅ Success Checklist

- [ ] Ran `create-demo-users.js` successfully
- [ ] Copied SQL file to container
- [ ] Executed SQL script
- [ ] Verified 3 users exist in database
- [ ] API login test returns access token
- [ ] Frontend shows "Backend Online" (green)
- [ ] Demo login buttons are enabled
- [ ] Clicking "Demo Login" redirects to dashboard

---

## 🚨 Emergency Reset (Last Resort)

If nothing works, start completely fresh:

```bash
# ⚠️ WARNING: This deletes ALL data!

# Stop containers
docker-compose down

# Remove volume
docker volume rm cobt_postgres_data

# Start fresh
docker-compose up -d

# Wait for startup
sleep 30

# Create database
docker exec -it cobt-postgres psql -U postgres -c "CREATE DATABASE cobt_user;"

# Enable UUID extension
docker exec -it cobt-postgres psql -U postgres -d cobt_user -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Enable synchronize in backend TypeORM config, then:
docker-compose restart cobt-api

# Wait for tables to be created
sleep 10

# Insert demo users
node create-demo-users.js
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql
docker exec -it cobt-postgres psql -U postgres -f /tmp/working-demo-users.sql
```

---

## 🎉 You're Done!

Once you see the success message, your demo login should work perfectly!

**Happy coding! 🚀**

---

## 📞 Need More Help?

Check **TROUBLESHOOTING.md** for detailed debugging steps and common error solutions.
