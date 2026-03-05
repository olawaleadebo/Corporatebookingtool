# API Configuration Guide

## Overview
This directory contains the centralized API configuration for the BTMTravel COBT application.

## Files
- `api.config.ts` - Main configuration file with ngrok URLs

## Updating the ngrok URL

When your ngrok tunnel URL changes, you need to update it in **ONE PLACE ONLY**:

### File: `/src/config/api.config.ts`

```typescript
export const API_CONFIG = {
  // Update this when ngrok URL changes
  API_BASE_URL: 'https://YOUR-NEW-NGROK-URL.ngrok-free.dev/api/v1',
  WS_URL: 'https://YOUR-NEW-NGROK-URL.ngrok-free.dev',
  // ...
}
```

## Important Notes

1. **No .env files needed** - Figma Make doesn't support .env files
2. **Single source of truth** - All API and WebSocket URLs come from this config
3. **ngrok headers included** - The config includes the required `ngrok-skip-browser-warning` header
4. **Console logging** - The config logs the URLs when loaded for debugging

## Files Using This Config

- `/src/lib/api.ts` - HTTP API requests
- `/src/lib/websocket.ts` - WebSocket connections
- `/src/app/pages/Login.tsx` - Login page
- `/src/app/pages/SystemStatus.tsx` - System status page
- `/src/app/pages/BackendTest.tsx` - Backend test page

## Troubleshooting

### "Network Error" or "Cannot connect to backend"

1. Check your ngrok tunnel is running
2. Verify the URL in `api.config.ts` matches your ngrok URL
3. Ensure your NestJS backend is running locally
4. Check browser console for the logged configuration URLs
