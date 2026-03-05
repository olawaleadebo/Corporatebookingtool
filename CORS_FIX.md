# CORS Fix for Ngrok Connection

## 🔧 What Was Fixed

### 1. **Helmet Security Headers** (CRITICAL FIX)
**Problem:** Helmet was blocking ngrok connections with strict CSP rules.

**Fix:** Updated `/backend/src/main.ts` to disable CSP for development:
```typescript
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
```

### 2. **Enhanced CORS Configuration**
**Problem:** CORS might not have been allowing all Figma Make proxy domains.

**Fix:** Updated CORS to explicitly allow ALL origins with logging:
```typescript
app.enableCors({
  origin: (origin, callback) => {
    console.log(`🌍 CORS request from origin: ${origin || 'no-origin'}`);
    callback(null, true); // Allow all origins
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'User-Agent', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
});
```

### 3. **Request Logging Middleware**
**Added:** Detailed logging to debug connection issues.

**Location:** `/backend/src/middleware/request-logger.middleware.ts`

**What it does:**
- Logs every incoming request
- Shows origin, method, URL, headers
- Displays response status codes
- Helps identify CORS issues

## 🚀 CRITICAL: You MUST Restart Backend!

### Stop Backend
In the terminal running your backend:
```bash
# Press Ctrl+C to stop
```

### Start Backend Again
```bash
cd backend
npm run start:dev
```

### What You Should See:
```
🚀 Application is running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api/docs
```

## 🧪 Test After Restart

### Test 1: Direct Browser Access
Open in browser:
```
https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health
```

**Expected:** JSON response (not error page)

### Test 2: Figma Make Connection Test
1. Go to login page in Figma Make
2. Look at "Connection Status" box
3. Should show: ✅ "Backend Online"

### Test 3: Check Backend Logs
When Figma Make tries to connect, you should see in backend terminal:
```
🌍 CORS request from origin: https://cdn.figma-make.com
📨 Incoming Request:
   Method: GET
   URL: /api/v1/health
   Origin: https://cdn.figma-make.com
   ✅ Response: 200
```

## 🔍 Troubleshooting

### Issue: Still Getting CORS Error

**Check Backend Terminal:**
- Do you see the "CORS request from origin" log?
- If NO: Request isn't reaching backend (check ngrok)
- If YES: Check what error appears after

**Common Fixes:**
```bash
# 1. Make sure backend restarted
ps aux | grep node  # Kill any old processes
cd backend
npm run start:dev

# 2. Clear ngrok cache
rm -rf ~/.ngrok2/ngrok2.yml
ngrok http 3000

# 3. Test locally first
curl http://localhost:3000/api/v1/health
# Should return JSON

# 4. Test ngrok
curl https://your-url.ngrok-free.dev/api/v1/health
# Should also return JSON
```

### Issue: "ngrok not found" Page

**Cause:** Ngrok URL changed or ngrok stopped

**Fix:**
```bash
# Check ngrok terminal - look for:
Forwarding    https://xxxxx.ngrok-free.dev -> http://localhost:3000

# Copy that URL and update /src/config/api.config.ts
```

### Issue: Backend Logs Show "EADDRINUSE"

**Cause:** Port 3000 already in use

**Fix:**
```bash
# Find process on port 3000
lsof -i :3000

# Kill it
kill -9 [PID]

# Or use different port
# Edit backend/.env: PORT=3001
# Edit ngrok: ngrok http 3001
```

## 📊 What Changed - File Summary

### Modified Files:
1. ✅ `/backend/src/main.ts` - Fixed Helmet CSP + Enhanced CORS
2. ✅ `/backend/src/app.module.ts` - Added request logger middleware
3. ✅ `/backend/src/middleware/request-logger.middleware.ts` - NEW FILE

### Why Each Change Matters:

**Helmet CSP Disabled:**
- Helmet sets `Content-Security-Policy` headers
- These can block cross-origin requests
- Disabled for development (safe since ngrok is for testing)

**CORS Logging:**
- Shows exactly what origin is trying to connect
- Helps debug if Figma Make proxy is different than expected
- Confirms CORS is allowing the request

**Request Logger:**
- Sees every request hitting your backend
- Identifies if requests are arriving at all
- Shows response codes to debug issues

## ✅ Verification Checklist

After restarting backend, verify:

- [ ] Backend terminal shows: "Application is running on: http://localhost:3000"
- [ ] Ngrok terminal shows: "Forwarding https://xxxxx.ngrok-free.dev"
- [ ] Local health check works: `http://localhost:3000/api/v1/health`
- [ ] Ngrok health check works: `https://xxxxx.ngrok-free.dev/api/v1/health`
- [ ] Backend logs show CORS origin when you test
- [ ] Figma Make shows "Backend Online"
- [ ] No CORS errors in browser console (F12)

## 🎯 Expected Behavior

### Backend Terminal (When Working):
```bash
🚀 Application is running on: http://localhost:3000

# When Figma Make connects:
🌍 CORS request from origin: https://cdn.figma-make.com

📨 Incoming Request:
   Method: GET
   URL: /api/v1/health
   Origin: https://cdn.figma-make.com
   User-Agent: Mozilla/5.0...
   ngrok-skip: true
   ✅ Response: 200
```

### Figma Make App:
- Connection Status: ✅ "Backend Online" (green)
- Login form: Enabled
- No red errors in console

### Browser Console (F12):
- No CORS errors
- Successful fetch responses
- API calls returning data

## 🚨 If Still Not Working

Try this complete reset:

```bash
# 1. Stop everything
# Ctrl+C in backend terminal
# Ctrl+C in ngrok terminal

# 2. Clear all caches
rm -rf backend/node_modules/.cache
rm -rf backend/dist

# 3. Rebuild backend
cd backend
npm run build

# 4. Start fresh
npm run start:dev

# 5. In new terminal, start ngrok
ngrok http 3000

# 6. Copy new ngrok URL to /src/config/api.config.ts

# 7. Test in browser first
curl https://new-ngrok-url.ngrok-free.dev/api/v1/health

# 8. Then test Figma Make
```

## 📞 Next Steps

1. **Restart your backend** (CRITICAL!)
2. **Check the connection status** on login page
3. **Look at backend terminal** for CORS logs
4. **Test health endpoint** in browser
5. **Try logging in** with demo account

If you see CORS logs in backend terminal but still get errors, share the:
- Full error message from browser console
- Backend terminal output
- Connection test results

---

**The most common issue is forgetting to restart the backend after making changes!**
