# Backend Connection Guide

## ✅ Good News: Configuration is Working!

You're seeing this message in the console:
```
🔗 API CONFIGURATION LOADED
   API URL: https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1
```

This means the frontend is configured correctly! Now let's make sure the backend is running.

## 🎯 Current Status

Your Figma Make app is trying to connect to:
```
https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1
```

## 🚀 What You Need Running

You need **TWO things running simultaneously**:

### 1. Backend Server (NestJS)
```bash
# Terminal 1
cd backend
npm run start:dev
```

**Expected Output:**
```
[Nest] INFO [NestApplication] Nest application successfully started
🚀 Application is running on: http://localhost:3000
```

### 2. Ngrok Tunnel
```bash
# Terminal 2
ngrok http 3000
```

**Expected Output:**
```
Session Status    online
Forwarding        https://chromoplasmic-ungaping-danielle.ngrok-free.dev -> http://localhost:3000
```

## 🧪 Test Your Connection

### Built-in Test (Easiest)
The login page now has a **"Connection Status"** box that:
- ✅ Auto-tests on page load
- 🔄 Shows real-time status
- 🔧 Provides troubleshooting hints
- 🔗 Links to test in browser

### Manual Browser Test
Open this URL:
```
https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health
```

**Success looks like:**
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

### Command Line Test
```bash
curl -H "ngrok-skip-browser-warning: true" \
  https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health
```

## 🔍 Troubleshooting

### ❌ "Cannot Connect" / "Failed to fetch"

**Check #1: Is backend running?**
```bash
# Open http://localhost:3000/api/v1/health in browser
# Should show JSON, not error
```

**Check #2: Is ngrok running?**
```bash
# Run: ngrok http 3000
# Look for "Forwarding" line
```

**Check #3: Did backend restart after CORS changes?**
```bash
# In backend terminal:
# Ctrl+C to stop
# npm run start:dev to restart
```

**Check #4: Does ngrok URL match config?**
```bash
# Compare ngrok terminal URL with /src/config/api.config.ts line 16
# They must match exactly
```

### ⚠️ "CORS Policy" Error

This means backend needs CORS update:

1. Check `/backend/src/main.ts` line 24 has: `origin: true`
2. **Restart backend** (critical!)
3. Test again

### 🔄 Ngrok URL Changed

Ngrok free tier gives you a new URL each time. When it changes:

1. Copy new URL from ngrok terminal
2. Edit `/src/config/api.config.ts`
3. Update line 16:
   ```typescript
   const NGROK_URL = 'https://your-new-url.ngrok-free.dev';
   ```
4. Refresh Figma Make app

**Pro Tip:** Get a free ngrok account for a persistent URL:
```bash
ngrok config add-authtoken YOUR_TOKEN
ngrok http 3000 --domain=your-name.ngrok-free.app
```

## 📊 Status Indicators

### ✅ Everything Working:
- Backend terminal: Shows "Application is running"
- Ngrok terminal: Shows "Forwarding" with your URL
- Browser health endpoint: Returns JSON
- Figma Make: Green "Backend Online" badge
- Login form: Enabled and ready

### ❌ Something Wrong:
- Figma Make: Red "Backend Offline" badge
- Login form: Disabled
- Setup guide appears with instructions
- Connection diagnostic tools available

## 🎮 Quick Start Commands

```bash
# Terminal 1: Start backend
cd backend && npm run start:dev

# Terminal 2: Start ngrok
ngrok http 3000

# Terminal 3: Test connection (optional)
curl -H "ngrok-skip-browser-warning: true" https://your-url.ngrok-free.dev/api/v1/health
```

## 📁 Important Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `/src/config/api.config.ts` | Frontend config | When ngrok URL changes |
| `/backend/src/main.ts` | Backend CORS | Already configured ✅ |
| `/CURRENT_STATUS.md` | Detailed troubleshooting | When stuck |
| `/BACKEND_SETUP.md` | Complete setup guide | First time setup |

## 🎉 Success Checklist

Once everything works, you should have:

- [x] Configuration loaded (console shows API URL)
- [ ] Backend running on port 3000
- [ ] Ngrok tunnel active
- [ ] Health endpoint returns JSON
- [ ] Connection test shows "Backend Online"
- [ ] Can log in with demo accounts

## 🔐 Demo Login Credentials

Once connected:

| Role | Email | Password |
|------|-------|----------|
| Traveller | `traveller@test.com` | `Test123!` |
| Travel Arranger | `arranger@test.com` | `Test123!` |
| Admin | `admin@test.com` | `Test123!` |

---

**Still having issues?** 
- Check `/CURRENT_STATUS.md` for detailed diagnostics
- Look at browser console (F12) for error details
- Verify both terminals are running
