# 🎯 FINAL SIMPLE FIX - Just Follow These Steps

Your PostgreSQL username is: **`cobt_user`** (not postgres or root!)

---

## ✅ Step 1: Create the Script File

In your backend directory, create a file named `create-demo-users.js`:

**Location:** `C:\Users\DELL\OneDrive\Desktop\cobt\Corporatebookingtool\backend\create-demo-users.js`

**Content:** Copy EVERYTHING from the file `/COPY-THIS-TO-BACKEND.js` in your frontend directory.

### To do this in Git Bash:

```bash
cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend

# Copy the file (if it exists in parent directory)
cp ../COPY-THIS-TO-BACKEND.js ./create-demo-users.js

# OR manually create it
nano create-demo-users.js
# Then paste the content and save (Ctrl+X, Y, Enter)
```

### OR use VSCode/Notepad:

1. Open `C:\Users\DELL\OneDrive\Desktop\cobt\Corporatebookingtool\COPY-THIS-TO-BACKEND.js`
2. Copy all content
3. Create new file: `C:\Users\DELL\OneDrive\Desktop\cobt\Corporatebookingtool\backend\create-demo-users.js`
4. Paste content
5. Save

---

## ✅ Step 2: Run the Script

```bash
cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend

# bcrypt is already installed, so just run:
node create-demo-users.js
```

You should see:
```
✅ Hash generated: $2b$10$...
✅ Hash verification: PASSED ✅
📄 SQL file generated: working-demo-users.sql
```

---

## ✅ Step 3: Copy SQL to Container

```bash
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql
```

**If you get "file not found", verify the file exists:**
```bash
ls -la working-demo-users.sql
```

It should show the file. If not, go back to Step 2.

---

## ✅ Step 4: Run SQL Script

**IMPORTANT:** Use `cobt_user` as the username (NOT postgres, NOT root!)

```bash
docker exec -it cobt-postgres psql -U cobt_user -f /tmp/working-demo-users.sql
```

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

## ✅ Step 5: Verify It Worked

```bash
docker exec -it cobt-postgres psql -U cobt_user -d cobt_user -c "SELECT email, role FROM users WHERE email LIKE '%@test.com';"
```

Expected output:
```
         email          |      role       
------------------------+-----------------
 traveller@test.com     | traveller
 arranger@test.com      | travel_arranger
 admin@test.com         | admin
(3 rows)
```

---

## 🎉 Done! Now Test Login

1. Open your frontend app
2. Backend should show "Online" (green)
3. Click **"Demo Login as Traveller"**
4. Should redirect to traveller dashboard ✅

---

## 🐛 If Something Goes Wrong

### "Cannot find module 'create-demo-users.js'"
- The file doesn't exist in your backend directory
- Go back to Step 1 and create it

### "Cannot find module 'bcrypt'"
```bash
cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend
npm install bcrypt
```

### "working-demo-users.sql not found"
- The script didn't run successfully
- Check for errors when running `node create-demo-users.js`
- Make sure you're in the backend directory

### "role 'cobt_user' does not exist"
Check your docker-compose.yml:
```bash
cat docker-compose.yml | grep POSTGRES
```

Look for lines like:
```yaml
POSTGRES_USER: your_actual_username
POSTGRES_PASSWORD: your_password
POSTGRES_DB: cobt_user
```

Use whatever `POSTGRES_USER` shows.

---

## 📋 Complete Command Sequence (Copy & Paste)

Run these commands one by one in Git Bash:

```bash
# 1. Go to backend directory
cd ~/OneDrive/Desktop/cobt/Corporatebookingtool/backend

# 2. Check if bcrypt is installed (should say "up to date")
npm list bcrypt

# 3. List files to confirm
ls -la create-demo-users.js

# 4. Run the generator
node create-demo-users.js

# 5. Verify SQL file was created
ls -la working-demo-users.sql

# 6. Copy to container
docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql

# 7. Run SQL script (use cobt_user!)
docker exec -it cobt-postgres psql -U cobt_user -f /tmp/working-demo-users.sql

# 8. Verify users exist
docker exec -it cobt-postgres psql -U cobt_user -d cobt_user -c "SELECT email, role FROM users;"
```

---

## 🎯 Key Points

1. ✅ **PostgreSQL username:** `cobt_user` (line 113 in your error log showed this)
2. ✅ **bcrypt:** Already installed (line 72 showed "up to date")
3. ✅ **File location:** Must be in `backend/` directory, not frontend root
4. ✅ **Login credentials:** `traveller@test.com` / `Test123!`

---

## 💡 Still Not Working?

Show me the output of:

```bash
# 1. Where are you?
pwd

# 2. What files exist?
ls -la *.js *.sql

# 3. What's your postgres config?
cat docker-compose.yml | grep POSTGRES

# 4. Are containers running?
docker ps
```

---

**You're almost there! Just need to create the file in the right place.** 🚀
