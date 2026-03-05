# 🔥 Hardcoded Ngrok URLs - Test Configuration

## What Was Done

I've hardcoded the ngrok URL (`https://chromoplasmic-ungaping-danielle.ngrok-free.dev`) directly into **all files that make API calls** to eliminate any configuration issues.

## Files Modified (6 files)

### 1. `/src/lib/api.ts` ✅
**Purpose:** Main axios instance for all API calls

**Changes:**
```typescript
// BEFORE: Used API_CONFIG.API_BASE_URL
baseURL: API_CONFIG.API_BASE_URL,

// AFTER: Hardcoded URL
const HARDCODED_NGROK_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1';
baseURL: HARDCODED_NGROK_URL,
```

**Also hardcoded:**
- Headers: `ngrok-skip-browser-warning: true`
- Timeout: `30000ms`
- Token refresh URL

---

### 2. `/src/lib/websocket.ts` ✅
**Purpose:** WebSocket connection for real-time updates

**Changes:**
```typescript
// BEFORE: Used API_CONFIG.WS_URL
socket = io(API_CONFIG.WS_URL, {...})

// AFTER: Hardcoded URL
const HARDCODED_WS_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev';
socket = io(HARDCODED_WS_URL, {...})
```

---

### 3. `/src/utils/connection-test.ts` ✅
**Purpose:** Auto-run connection test

**Changes:**
```typescript
// BEFORE: Used API_CONFIG.API_BASE_URL
const healthUrl = `${API_CONFIG.API_BASE_URL}/health`;

// AFTER: Hardcoded URL
const HARDCODED_API_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1';
const healthUrl = `${HARDCODED_API_URL}/health`;
```

---

### 4. `/src/app/components/QuickConnectionTest.tsx` ✅
**Purpose:** Visual connection test component on login page

**Changes:**
```typescript
// BEFORE: Used API_CONFIG.API_BASE_URL
const healthUrl = `${API_CONFIG.API_BASE_URL}/health`;

// AFTER: Hardcoded URL
const HARDCODED_API_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1';
const healthUrl = `${HARDCODED_API_URL}/health`;
```

---

### 5. `/src/config/api.config.ts` ✅
**Purpose:** Centralized API configuration (still there for reference)

**Status:** Already has the correct URL
```typescript
const NGROK_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev';
```

**Note:** This file is still used for some configs, but main API calls now bypass it

---

## What This Eliminates

By hardcoding, we eliminate these potential issues:
- ❌ Configuration not loading
- ❌ Import path issues
- ❌ Timing issues (config loading after API init)
- ❌ Build/bundling issues
- ❌ Environment variable issues

## Console Output

You'll now see these logs confirming hardcoded URLs are being used:

```
🔥 USING HARDCODED NGROK URL: https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1
🔥 USING HARDCODED WEBSOCKET URL: https://chromoplasmic-ungaping-danielle.ngrok-free.dev
🔥 CONNECTION TEST USING HARDCODED URL: https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1
🔥 QuickConnectionTest USING HARDCODED URL: https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1
```

## Testing Now

### Step 1: Backend Status
Make sure backend is running:
```bash
cd backend
npm run start:dev
```

Should show:
```
🚀 Application is running on: http://localhost:3000
```

### Step 2: Ngrok Status
Make sure ngrok is running:
```bash
ngrok http 3000
```

Should show:
```
Forwarding    https://chromoplasmic-ungaping-danielle.ngrok-free.dev -> http://localhost:3000
```

**CRITICAL:** The URL must match! If ngrok gives you a different URL, update all 4 hardcoded files.

### Step 3: Check Console
Open browser console (F12) and look for:

✅ **Good signs:**
```
🔥 USING HARDCODED NGROK URL: ...
🌐 Making request to: https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health
✅ Response received in ... ms
```

❌ **Bad signs:**
```
❌ Network Error
❌ CORS policy
Failed to fetch
```

### Step 4: Check Login Page
The "Connection Status" box should show:
- ✅ Green "Backend Online" if working
- ❌ Red "Backend Offline" if not working

### Step 5: Check Backend Logs
Backend terminal should show when requests come in:
```
🌍 CORS request from origin: https://cdn.figma-make.com
📨 Incoming Request:
   Method: GET
   URL: /api/v1/health
✅ Health check endpoint called - CORS is working!
```

## What to Look For

### If Connection Works:
1. ✅ Console shows "HARDCODED URL" logs
2. ✅ Console shows "Making request to" with hardcoded URL
3. ✅ Login page shows green "Backend Online"
4. ✅ Backend logs show incoming requests
5. ✅ No CORS errors in console

**This confirms:** The hardcoded URLs are working! Configuration was the issue.

### If Connection Still Fails:
1. ❌ Console shows CORS error → Backend CORS issue (did you restart backend?)
2. ❌ Console shows Network error → Ngrok or backend not running
3. ❌ Console shows 404 → URL mismatch or backend not on port 3000
4. ❌ No backend logs → Request not reaching backend (ngrok issue?)

## Debugging Steps

### Check #1: URLs Match Exactly
```bash
# In ngrok terminal, copy the URL shown:
Forwarding    https://xxxxx.ngrok-free.dev -> http://localhost:3000

# Compare with hardcoded URLs in files
# They MUST match exactly!
```

### Check #2: Backend Responding Locally
```bash
curl http://localhost:3000/api/v1/health
# Should return JSON
```

### Check #3: Ngrok Tunnel Working
```bash
curl https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health
# Should return same JSON
```

### Check #4: CORS Headers in Response
```bash
curl -v https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health
# Look for Access-Control-Allow-Origin header
```

## Next Steps Based on Results

### If Hardcoded URLs Work:
✅ **Configuration was the issue!**
- We can identify why config wasn't working
- Can fix the proper configuration files
- Can remove hardcoding once config is fixed

### If Hardcoded URLs Don't Work:
❌ **Not a configuration issue, it's:**
1. CORS blocking (restart backend!)
2. Ngrok not running/wrong URL
3. Backend not running
4. Network/firewall issue

## Important Notes

### ⚠️ Remember:
1. **Backend MUST be restarted** for CORS fixes to work
2. **Ngrok URL must match** what's hardcoded
3. **Hardcoding is temporary** - for testing only
4. **Check console logs** - they show what URL is being used

### 🔄 If Ngrok URL Changes:
If you restart ngrok and get a new URL, update these 4 files:
1. `/src/lib/api.ts` - Line ~6
2. `/src/lib/websocket.ts` - Line ~6
3. `/src/utils/connection-test.ts` - Line ~4
4. `/src/app/components/QuickConnectionTest.tsx` - Line ~6

### 🎯 Success Criteria:
- ✅ Console shows all "HARDCODED URL" logs
- ✅ Green "Backend Online" on login page
- ✅ Backend logs show CORS requests
- ✅ Can log in with demo account
- ✅ No CORS errors in console

---

## Current Hardcoded URL

```
https://chromoplasmic-ungaping-danielle.ngrok-free.dev
```

**Full API URL:**
```
https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1
```

**WebSocket URL:**
```
https://chromoplasmic-ungaping-danielle.ngrok-free.dev
```

---

## Test Now!

1. Refresh your Figma Make app
2. Open browser console (F12)
3. Look for the 🔥 hardcoded URL logs
4. Check the Connection Status box
5. Tell me what you see!

The URLs are now **definitely hardcoded** - no configuration can interfere! 🎯
