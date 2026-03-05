# Fix: Network Error After Manual Edits

## 🔴 Current Problem

You're seeing these errors:
```
Backend not reachable
❌ Login failed: AxiosError: Network Error
❌ Error response: 
❌ Error status: 
❌ Error message: Network Error
```

## 🔍 Root Cause

The files were manually edited to use an ngrok URL:
- `https://chromoplasmic-ungaping-danielle.ngrok-free.app`

**But this URL is not responding** because:
1. ❌ The ngrok tunnel is not running, OR
2. ❌ The backend server is not running, OR
3. ❌ The ngrok URL has expired/changed

---

## ✅ Solution: Choose Your Setup

### Option 1: Use Local Backend (Recommended for Development)

**Current Status:** Files have been reverted to use `localhost`

#### Steps:

1. **Start Backend:**
   ```bash
   cd backend
   docker-compose up -d
   ```
   *Wait 30 seconds*

2. **Verify Backend:**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```
   Should return: `{"status":"ok",...}`

3. **Start Frontend:**
   ```bash
   npm run dev
   ```

4. **Open Browser:**
   http://localhost:5173

**✅ This should work immediately!**

---

### Option 2: Use ngrok (For Remote Access)

If you need to use ngrok for remote access, follow these steps:

#### Step 1: Start Backend Locally First

```bash
cd backend
docker-compose up -d
```

#### Step 2: Verify Local Backend Works

```bash
curl http://localhost:3000/api/v1/health
```

Must return: `{"status":"ok",...}`

#### Step 3: Install and Start ngrok

**Install ngrok:**
- Mac: `brew install ngrok`
- Windows/Linux: https://ngrok.com/download

**Start ngrok tunnel:**
```bash
ngrok http 3000
```

**Copy the HTTPS URL** from the output (e.g., `https://abc123.ngrok-free.app`)

#### Step 4: Update Frontend Configuration

Edit `.env` file:
```env
# Use your actual ngrok URL
VITE_API_URL=https://YOUR_NEW_URL.ngrok-free.app/api/v1
VITE_WS_URL=https://YOUR_NEW_URL.ngrok-free.app
```

#### Step 5: Update Backend CORS

Edit `backend/src/main.ts` around line 20:
```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://YOUR_NEW_URL.ngrok-free.app', // Add your ngrok URL
  ],
  credentials: true,
});
```

#### Step 6: Restart Backend

```bash
cd backend
docker-compose restart app
```

#### Step 7: Restart Frontend

```bash
# Stop with Ctrl+C, then:
npm run dev
```

#### Step 8: Test ngrok Connection

```bash
curl https://YOUR_NEW_URL.ngrok-free.app/api/v1/health
```

Should return: `{"status":"ok",...}`

---

## 🎯 Quick Fix (Start Working Now)

**I've already reverted the files to use localhost.** 

Just run:

```bash
# Terminal 1: Start backend
cd backend
docker-compose up -d

# Wait 30 seconds...

# Terminal 2: Start frontend
npm run dev
```

**Then open:** http://localhost:5173

**It will work immediately!** ✅

---

## 📝 What I Fixed

### Before (Your Manual Edits):
```typescript
// api.ts
const API_BASE_URL = "https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1";

// websocket.ts
const WS_URL = "https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1";
```

### After (My Fix):
```typescript
// api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// websocket.ts
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
```

### Benefits:
- ✅ Reads from `.env` file (easy to change)
- ✅ Falls back to localhost if `.env` is missing
- ✅ Works with both local and ngrok setups
- ✅ No code changes needed to switch between them

---

## 🔧 Troubleshooting

### "curl: (6) Could not resolve host"
**Cause:** Backend is not running  
**Fix:** `cd backend && docker-compose up -d`

### "curl: (7) Failed to connect to localhost port 3000"
**Cause:** Backend hasn't started yet  
**Fix:** Wait 30 more seconds and try again

### Frontend Shows "Backend not reachable"
**Check:**
1. Backend running: `docker-compose ps` (all should be "Up")
2. Health check passes: `curl http://localhost:3000/api/v1/health`
3. `.env` file has correct URL
4. Frontend restarted after `.env` change

### ngrok URL Not Working
**Check:**
1. Is ngrok running? Check terminal for ngrok output
2. Copy the correct HTTPS URL from ngrok terminal
3. Update `.env` with the new URL (ngrok URLs change each restart)
4. Update backend CORS settings
5. Restart both backend and frontend

---

## 📚 More Information

- **Local Setup:** [START_APPLICATION.md](./START_APPLICATION.md)
- **ngrok Guide:** [NGROK_GUIDE.md](./NGROK_GUIDE.md)
- **Troubleshooting:** [BACKEND_CONNECTION_FIX.md](./BACKEND_CONNECTION_FIX.md)

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Backend is running: `cd backend && docker-compose ps`
- [ ] All containers show "Up" status
- [ ] Health check passes: `curl http://localhost:3000/api/v1/health`
- [ ] `.env` file exists and has correct URL
- [ ] Frontend restarted after any `.env` changes
- [ ] Browser cache cleared (Ctrl+Shift+R)

---

## 🎉 Success Path (Quickest)

```bash
# 1. Start backend
cd backend
docker-compose up -d

# 2. Wait and verify
sleep 30
curl http://localhost:3000/api/v1/health

# 3. Start frontend (in project root)
cd ..
npm run dev

# 4. Open browser
# http://localhost:5173
```

**Should work in under 2 minutes!** ✅

---

## 💡 Pro Tip

**For development, always use localhost.** It's:
- ✅ Faster (no internet latency)
- ✅ More stable (doesn't expire)
- ✅ Easier to debug
- ✅ More secure

**Only use ngrok when you need:**
- Remote access
- Mobile device testing
- Webhook testing (Paystack)
- Sharing with others

---

**Status:** ✅ Files fixed, backend configuration restored  
**Next:** Start the backend and you're good to go!
