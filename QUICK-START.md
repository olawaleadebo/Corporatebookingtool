# 🚀 QUICK START - Fix Login (Windows Users)

You're getting errors because:
1. ❌ Files are in wrong directory (frontend root, not backend)
2. ❌ PostgreSQL username is not "postgres" (it's likely "root")

## ✅ Easy Fix - Follow These Exact Steps:

---

### **Option 1: PowerShell (EASIEST for Windows)** ⭐

1. **Open PowerShell** (not Git Bash)

2. **Navigate to backend:**
   ```powershell
   cd C:\Users\DELL\OneDrive\Desktop\cobt\Corporatebookingtool\backend
   ```

3. **Copy the fix script:**
   ```powershell
   # Copy from parent directory
   Copy-Item ..\fix-login.ps1 -Destination .\fix-login.ps1
   Copy-Item ..\backend-create-demo-users.js -Destination .\create-demo-users.js
   ```

4. **Run the automated fix:**
   ```powershell
   .\fix-login.ps1
   ```

5. **Done!** ✅

---

### **Option 2: Git Bash (Manual Steps)**

1. **Copy files to backend directory:**
   ```bash
   cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend
   
   # Copy the script
   cp ../backend-create-demo-users.js ./create-demo-users.js
   ```

2. **Install bcrypt:**
   ```bash
   npm install bcrypt
   ```

3. **Generate SQL file:**
   ```bash
   node create-demo-users.js
   ```
   
   This creates `working-demo-users.sql` with the correct password hash.

4. **Check your PostgreSQL username:**
   ```bash
   # Check docker-compose.yml to see the POSTGRES_USER
   cat docker-compose.yml | grep POSTGRES_USER
   ```
   
   You'll see something like: `POSTGRES_USER: root` or `POSTGRES_USER: postgres`

5. **Copy SQL to container:**
   ```bash
   docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql
   ```

6. **Run the SQL (use the username from step 4):**
   ```bash
   # If username is "root":
   docker exec -it cobt-postgres psql -U root -f /tmp/working-demo-users.sql
   
   # If username is "postgres":
   docker exec -it cobt-postgres psql -U postgres -f /tmp/working-demo-users.sql
   ```

7. **Verify it worked:**
   ```bash
   docker exec -it cobt-postgres psql -U root -d cobt_user -c "SELECT email, role FROM users;"
   ```

---

### **Option 3: Super Quick Manual Entry**

If scripts aren't working, do it manually:

1. **Generate hash in Git Bash:**
   ```bash
   cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend
   npm install bcrypt
   node -e "require('bcrypt').hash('Test123!', 10).then(h => console.log(h))"
   ```
   
   **Copy the hash** (looks like `$2b$10$abc123...`)

2. **Enter PostgreSQL:**
   ```bash
   docker exec -it cobt-postgres bash
   
   # Inside container, try these:
   psql cobt_user
   # OR
   psql -U root cobt_user
   ```

3. **Paste this SQL** (replace `YOUR_HASH` with the hash from step 1):
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   
   DELETE FROM users WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com');
   
   INSERT INTO users (id, email, password, "firstName", "lastName", "phoneNumber", role, status, department, "costCenter", "createdAt", "updatedAt") VALUES
   (uuid_generate_v4(), 'traveller@test.com', 'YOUR_HASH', 'John', 'Traveller', '+234 801 234 5678', 'traveller', 'active', 'Sales', 'CC-001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   (uuid_generate_v4(), 'arranger@test.com', 'YOUR_HASH', 'Sarah', 'Arranger', '+234 802 345 6789', 'travel_arranger', 'active', 'Operations', 'CC-002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   (uuid_generate_v4(), 'admin@test.com', 'YOUR_HASH', 'Michael', 'Admin', '+234 803 456 7890', 'admin', 'active', 'IT', 'CC-003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
   SELECT email, role FROM users;
   
   \q
   exit
   ```

---

## 🎯 Login Credentials (After Setup)

| Email | Password | Role |
|-------|----------|------|
| traveller@test.com | Test123! | Traveller |
| arranger@test.com | Test123! | Travel Arranger |
| admin@test.com | Test123! | Admin |

---

## 🔍 Common Errors & Fixes

### Error: "Cannot find module"
**Fix:** You're not in the right directory
```bash
cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend
```

### Error: "role 'postgres' does not exist"
**Fix:** Your postgres user is different (likely "root")
```bash
# Check docker-compose.yml
cat docker-compose.yml | grep POSTGRES_USER

# Use that username instead
docker exec -it cobt-postgres psql -U root -f /tmp/working-demo-users.sql
```

### Error: "The system cannot find the file specified"
**Fix:** File wasn't created in current directory
```bash
# Check where you are
pwd

# List SQL files
ls *.sql

# If not there, run generator again
node create-demo-users.js
```

---

## ✅ How to Know It Worked

After completing the steps, test it:

1. **Check database:**
   ```bash
   docker exec -it cobt-postgres psql -U root -d cobt_user -c "SELECT email, role FROM users;"
   ```
   
   Should show 3 users ✅

2. **Test login on frontend:**
   - Open your app
   - Click "Demo Login as Traveller"
   - Should redirect to dashboard ✅

---

## 📁 File Locations

- **Frontend root:** `C:\Users\DELL\OneDrive\Desktop\cobt\Corporatebookingtool\`
  - Contains: `backend-create-demo-users.js`, `fix-login.ps1`

- **Backend:** `C:\Users\DELL\OneDrive\Desktop\cobt\Corporatebookingtool\backend\`
  - This is where you should run the commands
  - Copy files here before running

---

## 🎉 Success!

Once you see the 3 demo users in the database, you're done! 

Go to your frontend and login with `traveller@test.com` / `Test123!`

**Happy coding! 🚀**
