# Backend Connection Setup Guide

## 🚨 Critical: Backend Must Be Running with Ngrok

This Figma Make app **requires** your NestJS backend to be running and accessible through ngrok.

## Step-by-Step Setup

### 1. Start Your Backend Server

```bash
cd backend
npm run start:dev
```

✅ You should see: `🚀 Application is running on: http://localhost:3000`

### 2. Start Ngrok Tunnel

In a **separate terminal**, run:

```bash
ngrok http 3000
```

✅ You should see something like:
```
Forwarding   https://abc123.ngrok-free.dev -> http://localhost:3000
```

### 3. Update Frontend Configuration

**IMPORTANT:** Copy your ngrok URL and update `/src/config/api.config.ts`:

```typescript
const NGROK_URL = 'https://YOUR-NGROK-URL.ngrok-free.dev'; // 👈 CHANGE THIS
```

**Example:**
```typescript
const NGROK_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev';
```

### 4. Update Backend CORS (Already Done)

The backend `/backend/src/main.ts` has been updated to allow all origins:

```typescript
app.enableCors({
  origin: true, // Allows Figma Make proxy domains
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'User-Agent'],
});
```

**⚠️ You MUST restart your backend after this change:**
```bash
# Stop the backend (Ctrl+C)
# Then restart it
npm run start:dev
```

### 5. Test the Connection

1. Open the Figma Make app
2. You'll see a "Backend Connection Diagnostics" panel if the backend is offline
3. Click "Test Connection" to verify
4. Click "Open Health Endpoint in New Tab" to test directly in browser

## Troubleshooting

### Error: "Failed to fetch" or "Network Error"

**Cause:** Backend is not reachable

**Solutions:**
1. ✅ Verify backend is running: `http://localhost:3000/api/v1/health`
2. ✅ Verify ngrok is running and shows the tunnel
3. ✅ Test ngrok URL directly: `https://YOUR-URL.ngrok-free.dev/api/v1/health`
4. ✅ Check if you restarted backend after CORS changes

### Error: "CORS policy blocked"

**Cause:** Backend CORS not configured correctly

**Solutions:**
1. ✅ Verify `/backend/src/main.ts` has `origin: true` in CORS config
2. ✅ Restart backend server
3. ✅ Check backend console for CORS errors

### Ngrok URL Changes Every Time

This is normal with free ngrok. When it changes:

1. Copy new ngrok URL
2. Update `/src/config/api.config.ts`
3. **No need to reinstall or rebuild** - just refresh Figma Make

**Pro Tip:** Get a free ngrok account to get a persistent domain:
```bash
ngrok config add-authtoken YOUR_TOKEN
ngrok http 3000 --domain=your-domain.ngrok-free.app
```

## Testing Checklist

- [ ] Backend running on `localhost:3000`
- [ ] Ngrok tunnel active
- [ ] Updated ngrok URL in `/src/config/api.config.ts`
- [ ] Restarted backend after CORS changes
- [ ] Can access `https://YOUR-URL.ngrok-free.dev/api/v1/health` in browser
- [ ] Figma Make connection test passes

## Quick Test Command

Run this in your terminal to test the health endpoint:

```bash
curl -H "ngrok-skip-browser-warning: true" https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

## Support

If you're still having issues:

1. Check browser console (F12) for detailed error messages
2. Check backend console for incoming requests
3. Verify ngrok shows incoming requests in its dashboard
4. Make sure no firewall is blocking the connection
