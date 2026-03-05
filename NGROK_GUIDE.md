# Using ngrok with BTMTravel COBT

This guide explains how to expose your local backend via ngrok for remote access.

---

## Why Use ngrok?

ngrok creates a secure tunnel to your localhost, allowing you to:
- Access your local backend from anywhere
- Test on mobile devices
- Share your development environment
- Test webhooks (like Paystack callbacks)

---

## Quick Setup

### 1. Install ngrok

**Mac (Homebrew):**
```bash
brew install ngrok
```

**Windows/Linux:**
Download from: https://ngrok.com/download

### 2. Create ngrok Account (Free)

1. Sign up at: https://dashboard.ngrok.com/signup
2. Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Configure ngrok:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

### 3. Start Backend Locally

```bash
cd backend
docker-compose up -d
```

Wait 30 seconds for services to start.

### 4. Start ngrok Tunnel

In a new terminal:
```bash
ngrok http 3000
```

You'll see output like:
```
Session Status    online
Account           Your Name (Plan: Free)
Version           3.x.x
Region            United States (us)
Forwarding        https://abc123.ngrok-free.app -> http://localhost:3000
```

**Copy the `https://` URL** (e.g., `https://abc123.ngrok-free.app`)

### 5. Update Frontend Configuration

Edit `.env` in the project root:

```env
# Comment out local URLs
# VITE_API_URL=http://localhost:3000/api/v1
# VITE_WS_URL=http://localhost:3000

# Add your ngrok URL (replace with your actual URL)
VITE_API_URL=https://abc123.ngrok-free.app/api/v1
VITE_WS_URL=https://abc123.ngrok-free.app
```

### 6. Restart Frontend

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

### 7. Update Backend CORS

Edit `backend/src/main.ts` to allow ngrok origin:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://abc123.ngrok-free.app', // Add your ngrok URL
  ],
  credentials: true,
});
```

Restart backend:
```bash
cd backend
docker-compose restart app
```

---

## Testing the Setup

### 1. Check Backend Health

```bash
curl https://abc123.ngrok-free.app/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "info": {
    "database": {"status": "up"},
    "kafka": {"status": "up"}
  }
}
```

### 2. Open Frontend

Visit: http://localhost:5173

The frontend should now connect to the backend via ngrok!

### 3. Check System Status

Visit: http://localhost:5173/system-status

Should show:
- ✅ Backend API: ok
- ✅ Database: up
- ✅ Kafka: up
- Connection URL: `https://abc123.ngrok-free.app/api/v1`

---

## Important Notes

### ⚠️ ngrok Free Tier Limitations

1. **URL Changes:** Free ngrok URLs change every time you restart ngrok
2. **Session Time:** Tunnels expire after 2 hours (need to restart)
3. **Bandwidth:** Limited bandwidth (but usually enough for development)
4. **Warning Page:** First-time visitors see an ngrok warning page (can skip)

### 🔄 When ngrok URL Changes

Every time you restart ngrok, you get a new URL. You need to:

1. Copy the new URL from ngrok output
2. Update `.env`:
   ```env
   VITE_API_URL=https://NEW_URL.ngrok-free.app/api/v1
   VITE_WS_URL=https://NEW_URL.ngrok-free.app
   ```
3. Update `backend/src/main.ts` CORS settings
4. Restart both frontend and backend

### 🎯 Avoiding ngrok Warning Page

Add to your ngrok configuration:

```bash
ngrok http 3000 --request-header-add='ngrok-skip-browser-warning:true'
```

Or visitors can just click "Visit Site" button.

---

## ngrok Configuration File (Optional)

Create `~/.ngrok2/ngrok.yml` for persistent settings:

```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN

tunnels:
  cobt-backend:
    proto: http
    addr: 3000
    inspect: true
    bind_tls: true
```

Then start with:
```bash
ngrok start cobt-backend
```

---

## Using with Paystack Webhooks

When testing Paystack payments, you need a public URL for webhooks:

1. **Start ngrok** pointing to port 3000
2. **Copy ngrok URL**
3. **Configure Paystack webhook:**
   - Dashboard: https://dashboard.paystack.com/#/settings/developer
   - Webhook URL: `https://your-url.ngrok-free.app/api/v1/payments/webhook`
4. **Test payment flow** - Paystack can now reach your local backend!

---

## Troubleshooting

### ngrok Tunnel Not Working

**Check if ngrok is running:**
```bash
# You should see ngrok in the process list
ps aux | grep ngrok
```

**Check ngrok status:**
Visit: http://127.0.0.1:4040

This opens the ngrok web interface showing:
- Active tunnels
- Request history
- Response details

### Backend Not Reachable via ngrok

1. **Verify backend is running locally:**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```

2. **Check ngrok tunnel:**
   ```bash
   curl https://your-url.ngrok-free.app/api/v1/health
   ```

3. **Check CORS settings** in backend
4. **Check firewall** - ensure port 3000 is not blocked

### Frontend Still Shows "Backend Not Reachable"

1. **Check .env file:**
   ```bash
   cat .env
   ```
   Should show ngrok URL, not localhost

2. **Restart Vite dev server:**
   ```bash
   # Ctrl+C to stop, then:
   npm run dev
   ```

3. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

4. **Check browser console** for actual error

### WebSocket Connection Fails

WebSockets work through ngrok, but ensure:

1. **WS_URL doesn't include `/api/v1`:**
   ```env
   VITE_WS_URL=https://your-url.ngrok-free.app
   ```

2. **ngrok supports WebSockets** (it does by default)

3. **Backend WebSocket is enabled** (it is by default)

---

## Local Development vs ngrok

### Use Local (localhost) When:
- ✅ Developing on your machine only
- ✅ Backend and frontend on same network
- ✅ Faster connection needed
- ✅ Don't need external access

### Use ngrok When:
- ✅ Testing on mobile devices
- ✅ Sharing with team members remotely
- ✅ Testing Paystack webhooks
- ✅ Need public URL for APIs
- ✅ Testing from different networks

---

## Quick Reference

### Start Everything with ngrok

```bash
# Terminal 1: Start backend
cd backend && docker-compose up -d

# Terminal 2: Start ngrok
ngrok http 3000

# Copy ngrok URL and update .env
# Then restart frontend

# Terminal 3: Start frontend
npm run dev
```

### Switch Back to Local

Edit `.env`:
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

Restart frontend:
```bash
npm run dev
```

---

## ngrok Alternatives

If ngrok doesn't work for you, try:

- **LocalTunnel:** `npm install -g localtunnel`
- **Cloudflare Tunnel:** Free, no account needed
- **Tailscale:** For private networks
- **serveo.net:** SSH-based tunneling

---

## Security Note

⚠️ **Never expose production databases or sensitive data via ngrok free tier.**

ngrok free URLs are:
- Public (anyone with URL can access)
- Not permanent (URLs change)
- Logged by ngrok (they can see traffic)

For production use:
- Use ngrok paid plans with custom domains
- Or use proper cloud hosting (AWS, DigitalOcean, etc.)
- Implement proper authentication and rate limiting

---

## Summary

✅ **Install ngrok**  
✅ **Start backend locally**  
✅ **Start ngrok tunnel:** `ngrok http 3000`  
✅ **Copy ngrok URL**  
✅ **Update `.env` with ngrok URL**  
✅ **Update backend CORS**  
✅ **Restart frontend**  
✅ **Test connection**  

---

**Need Help?**
- ngrok docs: https://ngrok.com/docs
- ngrok dashboard: https://dashboard.ngrok.com
- Check: http://127.0.0.1:4040 for tunnel status
