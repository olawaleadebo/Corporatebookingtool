# 🪟 BTMTravel COBT - Windows/Git Bash Fix Guide

You're running into path issues and PostgreSQL user issues. Here's the fix:

---

## 🎯 Step 1: Copy Script to Backend Directory

You're currently in: `~/OneDrive/Desktop/cobt/Corporatebookingtool/backend`

**Copy the script file:**

```bash
# From your backend directory:
cp ../backend-create-demo-users.js ./create-demo-users.js
```

**OR** manually:
1. Open `/backend-create-demo-users.js` from the frontend root
2. Copy all the content
3. Create a new file in your backend directory: `backend/create-demo-users.js`
4. Paste the content

---

## 🎯 Step 2: Run the Script

```bash
# Make sure you're in backend directory
cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend

# Check if bcrypt is installed
npm list bcrypt

# If not installed:
npm install bcrypt

# Run the script
node create-demo-users.js
```

This will create `working-demo-users.sql` in your backend directory.

---

## 🎯 Step 3: Find Your PostgreSQL Username

Your postgres container might not use "postgres" as the username. Let's find it:

```bash
# Try to connect with different common usernames:

# Option 1: Try root
docker exec -it cobt-postgres psql -U root -l

# Option 2: Try postgres
docker exec -it cobt-postgres psql -U postgres -l

# Option 3: Try admin
docker exec -it cobt-postgres psql -U admin -l

# Option 4: Try cobt
docker exec -it cobt-postgres psql -U cobt -l

# Option 5: Check environment variables
docker exec -it cobt-postgres env | grep POSTGRES
```

**One of these should work!** Note which username works.

---

## 🎯 Step 4: Copy SQL File to Container

```bash
# Make sure you're in backend directory where the SQL file was created
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql

# Verify it was copied
docker exec -it cobt-postgres ls -la /tmp/working-demo-users.sql
```

---

## 🎯 Step 5: Run SQL Script

Use the username that worked in Step 3:

```bash
# Replace USERNAME with the one that worked (root, postgres, admin, or cobt)
docker exec -it cobt-postgres psql -U USERNAME -f /tmp/working-demo-users.sql
```

**Examples:**
```bash
# If root worked:
docker exec -it cobt-postgres psql -U root -f /tmp/working-demo-users.sql

# If postgres worked:
docker exec -it cobt-postgres psql -U postgres -f /tmp/working-demo-users.sql
```

---

## 🔧 Alternative: Manual Method (If Above Fails)

If you can't figure out the username, use this method:

### Step A: Enter the Container
```bash
docker exec -it cobt-postgres bash
```

### Step B: Connect to PostgreSQL (try these in order)
```bash
# Inside the container, try these:
psql cobt_user
# OR
psql -U root cobt_user
# OR
psql -U postgres cobt_user
```

### Step C: Once Connected, Run SQL Manually

Copy and paste this SQL (replace HASH with the one from Step 2):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Delete old demo users
DELETE FROM users WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com');

-- Insert demo users (REPLACE THE HASH BELOW!)
INSERT INTO users (
    id, email, password, "firstName", "lastName", "phoneNumber", 
    role, status, department, "costCenter", "createdAt", "updatedAt"
) VALUES
(
    uuid_generate_v4(),
    'traveller@test.com',
    'PASTE_YOUR_HASH_HERE',
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
(
    uuid_generate_v4(),
    'arranger@test.com',
    'PASTE_YOUR_HASH_HERE',
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
(
    uuid_generate_v4(),
    'admin@test.com',
    'PASTE_YOUR_HASH_HERE',
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

-- Verify
SELECT email, role FROM users WHERE email LIKE '%@test.com';

-- Exit
\q
exit
```

---

## 🐛 Troubleshooting

### "Cannot find module 'bcrypt'"
```bash
cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend
npm install bcrypt
```

### "working-demo-users.sql not found"
```bash
# Make sure you're in the right directory
pwd
# Should show: /c/Users/DELL/OneDrive/Desktop/cobt/Corporatebookingtool/backend

# List files
ls -la *.sql

# If not there, run the script again
node create-demo-users.js
```

### "role 'postgres' does not exist"
This means your PostgreSQL uses a different username. Try:
```bash
# Check docker-compose.yml in your backend
cat docker-compose.yml | grep POSTGRES

# You should see something like:
# POSTGRES_USER: root
# or
# POSTGRES_USER: admin
```

Use that username instead.

### Git Bash Path Issues

If you have path issues with Git Bash on Windows:

```bash
# Use forward slashes
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql

# Or use PowerShell instead of Git Bash
# Open PowerShell and run:
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql
```

---

## ✅ Verify It Worked

After running the SQL:

```bash
# Check users exist (use your correct username)
docker exec -it cobt-postgres psql -U root -d cobt_user -c "SELECT email, role FROM users;"

# Should show:
#          email          |      role       
# ------------------------+-----------------
#  traveller@test.com     | traveller
#  arranger@test.com      | travel_arranger
#  admin@test.com         | admin
```

---

## 🎉 Success!

Now try logging in on your frontend with:
- **Email:** traveller@test.com
- **Password:** Test123!

---

## 📞 Still Not Working?

Share the output of these commands:

```bash
# 1. Check if containers are running
docker ps

# 2. Check backend environment
docker exec -it cobt-postgres env | grep POSTGRES

# 3. Check if database exists
docker exec -it cobt-postgres psql -l

# 4. Try to list databases with different users
docker exec -it cobt-postgres psql -U root -l
docker exec -it cobt-postgres psql -U postgres -l
```

Send me the output and I'll help you debug!
