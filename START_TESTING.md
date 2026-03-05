# 🚀 Start Here: Test Your Backend

## ⚡ Quick Start (60 seconds)

Follow these steps to verify your BTMTravel COBT backend is working:

---

## Step 1: Start the Backend (30 seconds)

```bash
cd backend
docker-compose up -d
cd ..
```

Wait for services to initialize (about 30 seconds).

---

## Step 2: Run Automated Tests (5 seconds)

```bash
chmod +x test-backend.sh
./test-backend.sh
```

### ✅ Expected Output:

```
╔════════════════════════════════════════════╗
║         ✅ ALL TESTS PASSED! 🎉            ║
║                                            ║
║   Backend is running correctly             ║
║                                            ║
╚════════════════════════════════════════════╝

Next steps:
1. Start frontend: npm run dev
2. Open: http://localhost:5173
3. Use demo login to test
```

### ❌ If Tests Fail:

See the error message and solution provided by the script, or check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Step 3: Start the Frontend (10 seconds)

```bash
npm run dev
```

Frontend will start at: http://localhost:5173

---

## Step 4: Verify Connection (15 seconds)

### Method A: Login Page (Automatic)

1. Open: http://localhost:5173
2. Look for status indicator at bottom of login card
3. Should see: 🟢 **"Backend connected"**

### Method B: Visual Monitor (Interactive)

1. Open: http://localhost:5173/backend-test
2. Click **"Run Tests"** button
3. All badges should show **green "Success"**

---

## ✅ You're Ready!

If you see:
- ✅ Automated script shows "ALL TESTS PASSED"
- ✅ Login page shows green "Backend connected"
- ✅ Visual monitor shows all green badges

**Your backend is working correctly!** You can now:

1. Test login with demo accounts
2. Create bookings
3. Test approval workflows
4. Verify payment integration

---

## 🎯 Demo Login Credentials

### Traveller Account
```
Email: traveller@test.com
Password: Test123!
```

### Travel Arranger Account
```
Email: arranger@test.com
Password: Test123!
```

### Admin Account
```
Email: admin@test.com
Password: Test123!
```

---

## 🆘 Troubleshooting

### "Cannot connect to server"

**Cause**: Backend not running

**Fix**:
```bash
cd backend
docker-compose up -d
```

### "Database not connected"

**Cause**: PostgreSQL issue

**Fix**:
```bash
cd backend
docker-compose restart postgres
```

### "Port 3000 in use"

**Cause**: Another service using port 3000

**Fix**:
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process (replace PID)
kill -9 <PID>
```

---

## 📚 Full Documentation

For detailed information:

- **[BACKEND_STATUS_CHECK.md](./BACKEND_STATUS_CHECK.md)** - Quick reference for testing
- **[BACKEND_TESTING_GUIDE.md](./BACKEND_TESTING_GUIDE.md)** - Complete testing guide
- **[TESTING_SUMMARY.md](./TESTING_SUMMARY.md)** - Testing infrastructure overview
- **[README.md](./README.md)** - Main project documentation

---

## 🔗 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main application |
| Login | http://localhost:5173 | Login with demo accounts |
| Status Monitor | http://localhost:5173/backend-test | Visual testing interface |
| Backend API | http://localhost:3000 | REST API |
| API Docs | http://localhost:3000/api/docs | Swagger documentation |
| Health Check | http://localhost:3000/api/v1/health | Health endpoint |

---

## 💡 Pro Tips

1. **Bookmark the status monitor**: http://localhost:5173/backend-test
2. **Use the automated script** before committing code
3. **Keep backend running** while developing
4. **Check health endpoint** if issues arise: `curl http://localhost:3000/api/v1/health`
5. **View logs** if needed: `cd backend && docker-compose logs -f api`

---

**Ready to test!** Run `./test-backend.sh` to get started. 🚀
