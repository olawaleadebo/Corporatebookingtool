# ✅ Connection Checklist

Use this checklist to get your backend connected to Figma Make.

## 1️⃣ Backend Setup

- [ ] **Backend is running**
  ```bash
  cd backend
  npm run start:dev
  ```
  ✅ Should see: `🚀 Application is running on: http://localhost:3000`

- [ ] **Backend responds locally**
  ```bash
  curl http://localhost:3000/api/v1/health
  ```
  ✅ Should return JSON with `"status": "ok"`

- [ ] **Database is connected**
  - Check `backend/.env` has correct credentials
  - Backend logs should NOT show database errors

## 2️⃣ Ngrok Setup

- [ ] **Ngrok is running**
  ```bash
  ngrok http 3000
  ```
  ✅ Should see: `Forwarding https://xxxxx.ngrok-free.dev -> http://localhost:3000`

- [ ] **Ngrok URL works**
  ```bash
  curl https://your-ngrok-url.ngrok-free.dev/api/v1/health
  ```
  ✅ Should return same JSON as local test

- [ ] **Ngrok URL is current**
  - Copy URL from ngrok terminal
  - Compare with `/src/config/api.config.ts` line 16
  - ✅ They should match exactly

## 3️⃣ CORS Configuration

- [ ] **Backend has CORS fixes**
  - Check `/backend/src/main.ts` line 20-30
  - ✅ Should have `contentSecurityPolicy: false`
  - ✅ Should have CORS origin callback function

- [ ] **Backend was restarted after CORS changes**
  - Stop backend (Ctrl+C)
  - Start again (`npm run start:dev`)
  - ✅ Changes only work after restart!

## 4️⃣ Figma Make Connection

- [ ] **Login page loads**
  - Open Figma Make app
  - Go to login page
  - ✅ Page displays without errors

- [ ] **Connection test runs**
  - Look for "Connection Status" box
  - ✅ Should auto-test on page load

- [ ] **Status shows online**
  - Connection Status box
  - ✅ Should show green "Backend Online"
  - ❌ If red "Backend Offline", expand debug panel

- [ ] **No CORS errors in console**
  - Open browser console (F12)
  - Look at Console tab
  - ✅ Should NOT see CORS policy errors

## 5️⃣ Backend Logging

When Figma Make connects, backend should log:

- [ ] **CORS request logged**
  ```
  🌍 CORS request from origin: https://cdn.figma-make.com
  ```

- [ ] **Request logged**
  ```
  📨 Incoming Request:
     Method: GET
     URL: /api/v1/health
  ```

- [ ] **Health check logged**
  ```
  ✅ Health check endpoint called - CORS is working!
  ```

- [ ] **Response logged**
  ```
  ✅ Response: 200
  ```

✅ **If you see ALL of these logs** = Everything is working perfectly!

## 6️⃣ Test Login

- [ ] **Demo login works**
  - Email: `traveller@test.com`
  - Password: `Test123!`
  - ✅ Should log in successfully

- [ ] **Dashboard loads**
  - After login
  - ✅ Should see traveller dashboard

## 🔴 If Any Step Fails

### Backend Not Running
```bash
cd backend
npm install
npm run start:dev
```

### Ngrok Not Running
```bash
ngrok http 3000
# Copy the https://xxxxx.ngrok-free.dev URL
# Update /src/config/api.config.ts
```

### URLs Don't Match
1. Look at ngrok terminal for URL
2. Edit `/src/config/api.config.ts` line 16
3. Update with ngrok URL
4. Refresh Figma Make app

### CORS Errors Persist
```bash
# Make absolutely sure backend was restarted!
cd backend
# Ctrl+C to stop
npm run start:dev
# Wait for "Application is running" message
```

### No Logs Showing
- Request isn't reaching backend
- Check ngrok is forwarding correctly
- Test ngrok URL in browser first

## 📊 Success State

When everything works, you should have:

### Two Terminals Running:
```
Terminal 1: Backend
🚀 Application is running on: http://localhost:3000

Terminal 2: Ngrok  
Forwarding https://xxxxx.ngrok-free.dev -> http://localhost:3000
```

### Figma Make Shows:
- ✅ Green "Backend Online" badge
- ✅ Login form enabled
- ✅ No error messages

### Browser Console Shows:
- ✅ No CORS errors
- ✅ Successful API calls
- ✅ 200 status codes

### Backend Logs Show:
- ✅ CORS request from Figma Make
- ✅ Health check called
- ✅ Response 200

## 🎉 You're Done!

If all checkboxes are ticked, you're ready to use the app!

Try:
- ✅ Logging in with different roles
- ✅ Searching for flights
- ✅ Creating bookings
- ✅ Testing the approval workflow
- ✅ Processing payments

---

**Need detailed help?** See `/START_HERE.md` or `/QUICK_FIX.md`
