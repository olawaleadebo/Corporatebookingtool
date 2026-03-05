# Manual Edit Fix - Summary

## What Happened

You manually edited these files:
- `/src/lib/api.ts` - Changed to use ngrok URL
- `/src/lib/websocket.ts` - Changed to use ngrok URL

The ngrok URL was: `https://chromoplasmic-ungaping-danielle.ngrok-free.dev`

## The Problem

**Network Error** occurred because:
1. The ngrok tunnel at that URL is not running
2. Or the backend server behind it is not running
3. Or the ngrok URL has expired (free URLs change frequently)

## What I Did

### ✅ Fixed Files

**`/src/lib/api.ts`:**
- Reverted to use environment variables: `import.meta.env.VITE_API_URL`
- Falls back to localhost if not set: `|| 'http://localhost:3000/api/v1'`

**`/src/lib/websocket.ts`:**
- Reverted to use environment variables: `import.meta.env.VITE_WS_URL`
- Falls back to localhost if not set: `|| 'http://localhost:3000'`
- Fixed WebSocket URL (removed `/api/v1` path)

**`/.env`:**
- Set to use localhost by default:
  ```env
  VITE_API_URL=http://localhost:3000/api/v1
  VITE_WS_URL=http://localhost:3000
  ```
- Added comments for ngrok usage

### ✅ Created Documentation

**`NGROK_GUIDE.md`** - Complete guide for using ngrok:
- How to install ngrok
- How to start ngrok tunnel
- How to configure frontend for ngrok
- How to update backend CORS
- Troubleshooting ngrok issues

**`MANUAL_EDIT_FIX.md`** - Specific fix for this error:
- Explanation of the problem
- Two solutions: local or ngrok
- Step-by-step instructions
- Troubleshooting tips

**`FIX_NOW.txt`** - Quick reference:
- Simple 3-step fix
- Terminal commands to run
- Expected outputs
- Status indicators

## How to Use Now

### Option 1: Local Development (Recommended)

**The files are already configured for this!**

Just run:
```bash
# Terminal 1
cd backend && docker-compose up -d

# Terminal 2
npm run dev
```

Open: http://localhost:5173

### Option 2: Remote Access with ngrok

If you need ngrok:

1. **Start backend locally first:**
   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Start ngrok:**
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL** from ngrok output

4. **Update `.env`:**
   ```env
   VITE_API_URL=https://YOUR_URL.ngrok-free.app/api/v1
   VITE_WS_URL=https://YOUR_URL.ngrok-free.app
   ```

5. **Update backend CORS** in `backend/src/main.ts`:
   ```typescript
   app.enableCors({
     origin: [
       'http://localhost:5173',
       'https://YOUR_URL.ngrok-free.app',
     ],
     credentials: true,
   });
   ```

6. **Restart everything:**
   ```bash
   cd backend && docker-compose restart
   npm run dev
   ```

Full details: [NGROK_GUIDE.md](./NGROK_GUIDE.md)

## Why This is Better

### Before (Hardcoded):
```typescript
const API_BASE_URL = "https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1";
```

❌ Can't change without editing code  
❌ Breaks when ngrok URL changes  
❌ Hard to switch between local and remote  
❌ Need to commit sensitive URLs to git  

### After (Environment Variables):
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
```

✅ Change URL by editing `.env` file  
✅ Works with any ngrok URL  
✅ Easy to switch between local and remote  
✅ `.env` is gitignored (not committed)  
✅ Falls back to localhost automatically  

## Configuration Flexibility

Now you can easily switch between setups by just editing `.env`:

### Local Development
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

### ngrok Tunnel
```env
VITE_API_URL=https://abc123.ngrok-free.app/api/v1
VITE_WS_URL=https://abc123.ngrok-free.app
```

### Remote Server
```env
VITE_API_URL=https://api.yourcompany.com/api/v1
VITE_WS_URL=https://api.yourcompany.com
```

### Staging Environment
```env
VITE_API_URL=https://staging-api.yourcompany.com/api/v1
VITE_WS_URL=https://staging-api.yourcompany.com
```

## Important Notes

### ngrok Free Tier
- ⚠️ URLs change every restart
- ⚠️ 2-hour session limit
- ⚠️ Visitors see warning page (can skip)
- ⚠️ Traffic is logged by ngrok

### When to Use ngrok
- ✅ Testing on mobile devices
- ✅ Sharing with remote team
- ✅ Testing webhooks (Paystack)
- ✅ Demo to clients
- ✅ Quick external access

### When to Use localhost
- ✅ Daily development
- ✅ Faster performance
- ✅ More stable connection
- ✅ Better security
- ✅ Easier debugging

## Verification Steps

After starting backend and frontend:

### 1. Check Backend Health
```bash
curl http://localhost:3000/api/v1/health
```
Expected: `{"status":"ok",...}`

### 2. Check System Status Page
Visit: http://localhost:5173/system-status

Should show:
- ✅ Backend API: ok
- ✅ Database: up
- ✅ Kafka: up
- Connection URL: `http://localhost:3000/api/v1`

### 3. Check Login Page
Visit: http://localhost:5173

Should show:
- ✅ "Backend connected" (green indicator)
- ✅ Demo login buttons enabled
- ✅ No error messages

### 4. Test Login
Click "Demo Login as Traveller"

Should:
- ✅ Navigate to dashboard
- ✅ Show user info
- ✅ No errors in console

## Troubleshooting

### Still Seeing Network Error?

**Check these in order:**

1. **Is backend running?**
   ```bash
   cd backend
   docker-compose ps
   ```
   All should show "Up"

2. **Is backend healthy?**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```
   Should return JSON

3. **Is .env correct?**
   ```bash
   cat .env
   ```
   Should show localhost URL

4. **Did you restart frontend?**
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

5. **Clear browser cache**
   Press: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

### Need More Help?

Read these documents in order:

1. **[FIX_NOW.txt](./FIX_NOW.txt)** - Quick terminal commands
2. **[MANUAL_EDIT_FIX.md](./MANUAL_EDIT_FIX.md)** - Detailed explanation
3. **[START_APPLICATION.md](./START_APPLICATION.md)** - Complete startup guide
4. **[BACKEND_CONNECTION_FIX.md](./BACKEND_CONNECTION_FIX.md)** - Connection troubleshooting
5. **[NGROK_GUIDE.md](./NGROK_GUIDE.md)** - ngrok setup (if needed)

Or visit:
- **System Status:** http://localhost:5173/system-status
- **Backend Test:** http://localhost:5173/backend-test

## Files Changed

| File | Status | Purpose |
|------|--------|---------|
| `/src/lib/api.ts` | ✅ Fixed | Uses env vars, defaults to localhost |
| `/src/lib/websocket.ts` | ✅ Fixed | Uses env vars, defaults to localhost |
| `/.env` | ✅ Updated | Set to localhost configuration |
| `/NGROK_GUIDE.md` | ✅ Created | Complete ngrok setup guide |
| `/MANUAL_EDIT_FIX.md` | ✅ Created | Fix documentation |
| `/FIX_NOW.txt` | ✅ Created | Quick reference |

## Summary

✅ **Files are fixed** - Using environment variables  
✅ **Default is localhost** - Works immediately  
✅ **Easy to configure** - Just edit `.env`  
✅ **ngrok support** - Full documentation provided  
✅ **Best practices** - Proper configuration management  

**Next Step:** Start the backend and you're good to go!

```bash
cd backend && docker-compose up -d
npm run dev
```

---

**Date Fixed:** March 5, 2026  
**Status:** ✅ Complete - Ready to use
