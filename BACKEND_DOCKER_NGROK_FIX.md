# Backend Docker + Ngrok Network Binding Fix

## Problem
When running NestJS in Docker with ngrok, the app must bind to `0.0.0.0` instead of `localhost` to be accessible from outside the container.

**Current Issue:**
```typescript
await app.listen(port);  // ❌ Only binds to localhost
```

This means:
- ✅ Works: `localhost:3000` inside the container
- ❌ Fails: External access via ngrok
- ❌ Fails: Docker host machine access

---

## Solution

**File:** `backend/src/main.ts`

Replace line 72-76:

```typescript
// BEFORE:
const port = configService.get('PORT') || 3000;
await app.listen(port);


console.log(`🚀 Application is running on: http://localhost:${port}`);
console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);

// AFTER:
const port = configService.get<number>('PORT') || 3000;
const host = configService.get<string>('HOST') || '0.0.0.0';

await app.listen(port, host);

console.log(`🚀 Application is running on: http://${host}:${port}`);
console.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
console.log(`🌐 If using ngrok, backend is accessible via ngrok tunnel`);
console.log(`🐳 Docker: Bound to ${host}:${port} (accessible from host machine)`);
```

---

## Why This Fix Works

### Before (localhost binding):
```
Container Internal: localhost:3000 ✅
Docker Host: localhost:3000 ❌
Ngrok: ngrok.io → Docker ❌
```

### After (0.0.0.0 binding):
```
Container Internal: localhost:3000 ✅
Docker Host: localhost:3000 ✅
Ngrok: ngrok.io → Docker ✅
```

**`0.0.0.0` means:** "Listen on ALL network interfaces"
- Container's internal interface
- Docker bridge network
- Host machine network
- External ngrok tunnel

---

## Environment Variable (Optional)

Add to your `.env`:

```env
PORT=3000
HOST=0.0.0.0
```

**Flexibility:**
- **Docker/Ngrok:** `HOST=0.0.0.0` (bind to all interfaces)
- **Local dev only:** `HOST=localhost` (more secure for local testing)
- **Default:** If not set, uses `0.0.0.0` (Docker-friendly)

---

## Complete Fixed Code

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Use Winston logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  // Security - Helmet with relaxed CSP for development
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development (ngrok compatibility)
    crossOriginEmbedderPolicy: false,
  }));

  // CORS - Allow all origins including Figma Make domains
  app.enableCors({
    origin: (origin, callback) => {
      // Log all incoming origins for debugging
      console.log(`🌍 CORS request from origin: ${origin || 'no-origin'}`);
      // Allow all origins (including ngrok and Figma Make proxies)
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'User-Agent', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('COBT API')
    .setDescription('Corporate Booking Tool API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('search', 'Search flights and hotels')
    .addTag('bookings', 'Booking management')
    .addTag('payments', 'Payment processing')
    .addTag('users', 'User management')
    .addTag('policies', 'Policy management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 🔥 FIXED: Bind to 0.0.0.0 for Docker + ngrok compatibility
  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST') || '0.0.0.0';

  await app.listen(port, host);

  console.log(`🚀 Application is running on: http://${host}:${port}`);
  console.log(`📚 API Documentation: http://${host}:${port}/api/docs`);
  console.log(`🌐 If using ngrok, backend is accessible via ngrok tunnel`);
  console.log(`🐳 Docker: Bound to ${host}:${port} (accessible from host machine)`);
}

bootstrap();
```

---

## Testing After Fix

### 1. Inside Docker Container
```bash
docker exec -it <container-name> curl http://localhost:3000/api/v1/health
```
**Expected:** ✅ 200 OK

### 2. From Docker Host Machine
```bash
curl http://localhost:3000/api/v1/health
```
**Expected:** ✅ 200 OK

### 3. From Ngrok Tunnel
```bash
curl https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health \
  -H "ngrok-skip-browser-warning: true"
```
**Expected:** ✅ 200 OK

### 4. From Frontend (Browser Console)
```javascript
fetch('https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1/health', {
  headers: { 'ngrok-skip-browser-warning': 'true' }
})
.then(r => r.json())
.then(d => console.log('✅', d))
.catch(e => console.error('❌', e));
```
**Expected:** ✅ Success with data

---

## Docker Compose Example

If using `docker-compose.yml`:

```yaml
services:
  backend:
    build: .
    ports:
      - "3000:3000"  # Host:Container
    environment:
      - PORT=3000
      - HOST=0.0.0.0  # ⚡ Critical for external access
      - DATABASE_URL=postgresql://...
    networks:
      - cobt-network
```

---

## Ngrok Configuration

**Current ngrok command:**
```bash
ngrok http 3000
```

**After fix, this should work because:**
1. ✅ NestJS binds to `0.0.0.0:3000`
2. ✅ Docker exposes port 3000 to host
3. ✅ Ngrok tunnels host's `localhost:3000`
4. ✅ External requests flow through the tunnel

**Network flow:**
```
Frontend (Browser)
    ↓
Ngrok Tunnel (https://....ngrok-free.dev)
    ↓
Docker Host (localhost:3000)
    ↓
Docker Container (0.0.0.0:3000)
    ↓
NestJS App ✅
```

---

## Common Mistakes to Avoid

### ❌ Don't do this:
```typescript
await app.listen(port, 'localhost');  // Only local access
await app.listen(port, '127.0.0.1');  // Only local access
```

### ✅ Do this:
```typescript
await app.listen(port, '0.0.0.0');    // All network interfaces
```

---

## Security Note

**Production:** Consider using more restrictive binding:
- Development: `0.0.0.0` (maximum accessibility)
- Production: Specific IP or behind reverse proxy (nginx, AWS ALB)

**For now:** `0.0.0.0` is correct for Docker + ngrok development setup.

---

## Quick Apply

1. **Edit:** `backend/src/main.ts` - lines 72-76
2. **Rebuild:** `npm run build` or restart Docker
3. **Test:** All three methods above should work
4. **Verify:** Backend terminal shows `0.0.0.0:3000` in logs

**After this fix, your frontend should successfully connect to the backend via ngrok!** 🎉

---

## Troubleshooting

### Still can't connect?

**Check 1 - Docker ports exposed:**
```bash
docker ps
# Should show: 0.0.0.0:3000->3000/tcp
```

**Check 2 - Ngrok pointing to correct port:**
```bash
ngrok http 3000  # Match the PORT in .env
```

**Check 3 - Backend logs show correct binding:**
```
🚀 Application is running on: http://0.0.0.0:3000
```

**Check 4 - Firewall not blocking:**
```bash
# On host machine
curl http://localhost:3000/api/v1/health
```

If all checks pass, the connection should work! 🚀
