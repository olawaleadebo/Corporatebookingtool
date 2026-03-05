# 👀 Visual Testing Guide

This guide shows you exactly what to expect when testing your backend.

---

## 🎨 What You'll See

### 1. Login Page Status Indicators

#### ✅ Backend Online (Good)
```
┌─────────────────────────────────────────┐
│  Backend Status Indicator               │
├─────────────────────────────────────────┤
│                                         │
│  ✓ Backend connected                    │
│  (Green checkmark icon)                 │
│                                         │
│  [View Backend Status Monitor]          │
│                                         │
└─────────────────────────────────────────┘
```
**What it means**: Backend is running and ready. You can login!

---

#### ⚠️ Checking Connection (Wait)
```
┌─────────────────────────────────────────┐
│  Backend Status Indicator               │
├─────────────────────────────────────────┤
│                                         │
│  ⦿ Checking backend...                  │
│  (Yellow pulsing dot)                   │
│                                         │
└─────────────────────────────────────────┘
```
**What it means**: Testing connection. Wait a few seconds.

---

#### ❌ Backend Offline (Problem)
```
┌─────────────────────────────────────────┐
│  Backend Status Indicator               │
├─────────────────────────────────────────┤
│                                         │
│  ⚠ Backend offline - Start backend      │
│  (Red warning icon)    [Retry]          │
│                                         │
│  [View Backend Status Monitor]          │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ⚠ Backend Server Offline               │
├─────────────────────────────────────────┤
│                                         │
│  The backend server is not running.     │
│  Please start it to use the app.        │
│                                         │
│  Quick Start:                           │
│  ┌───────────────────────────────────┐  │
│  │ cd backend                        │  │
│  │ docker-compose up -d              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [Check Connection Again]               │
│  [View Setup Guide]                     │
│                                         │
└─────────────────────────────────────────┘
```
**What it means**: Backend not running. Follow the instructions to start it.

---

### 2. Visual Status Monitor (`/backend-test`)

#### Overall Status Card

```
┌─────────────────────────────────────────────────┐
│  Overall Status                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  🖥️ Server                      ✅ ONLINE      │
│  Backend server health summary                  │
│                                                 │
│  Last checked: 10:30:45 AM                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

#### Detailed Health Checks (All Passing)

```
┌─────────────────────────────────────────────────┐
│  Detailed Health Checks                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✓ Server Reachability           ✅ Success    │
│    Server is reachable                          │
│    10:30:45 AM                                  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ✓ Health Endpoint               ✅ Success    │
│    Health check passed                          │
│    ▼ View details                               │
│    10:30:45 AM                                  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ✓ Database Connection           ✅ Success    │
│    Database connected                           │
│    10:30:45 AM                                  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ✓ API Version                   ✅ Success    │
│    API is ready                                 │
│    ▼ View details                               │
│    10:30:45 AM                                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

#### Detailed Health Checks (With Failure)

```
┌─────────────────────────────────────────────────┐
│  Detailed Health Checks                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ✗ Server Reachability           ❌ Failed     │
│    Cannot connect to server                     │
│    10:30:45 AM                                  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ○ Health Endpoint               ⚠️ Checking   │
│    (animated pulse)                             │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ✗ Database Connection           ❌ Failed     │
│    Could not verify database                    │
│    10:30:45 AM                                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

#### Error Alert (When Offline)

```
┌─────────────────────────────────────────────────┐
│  ⚠ Backend Server Not Running                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  The backend server is not reachable. Please    │
│  start the backend using one of these methods:  │
│                                                 │
│  Quick Start (Recommended):                     │
│  ┌───────────────────────────────────────────┐  │
│  │ chmod +x start.sh && ./start.sh          │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Manual Start:                                  │
│  ┌───────────────────────────────────────────┐  │
│  │ cd backend                                │  │
│  │ docker-compose up -d                      │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [🔄 Retry Connection]                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 3. Automated Test Script Output

#### All Tests Passing

```bash
$ ./test-backend.sh

╔════════════════════════════════════════════╗
║                                            ║
║   BTMTravel COBT Backend Health Check      ║
║          Automated Testing Suite           ║
║                                            ║
╚════════════════════════════════════════════╝

Checking prerequisites...

✓ curl installed
✓ jq installed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test 1/6: Server Reachability (Liveness Probe)
✓ PASSED - Server is alive and responding

Test 2/6: Readiness Probe
✓ PASSED - Service is ready to accept requests
{
  "status": "ready",
  "timestamp": "2026-03-04T10:30:45.123Z"
}

Test 3/6: Full Health Check
✓ PASSED - Overall health status: OK

Test 4/6: Database Connection
✓ PASSED - Database is connected and healthy

Test 5/6: Memory Status
✓ PASSED - Memory usage is healthy

Test 6/6: Disk Status
✓ PASSED - Disk space is healthy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╔════════════════════════════════════════════╗
║              Test Summary                  ║
╚════════════════════════════════════════════╝

✓ Passed: 6 tests
✗ Failed: 0 tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Docker Container Status:

NAME                   STATUS          PORTS
cobt-api              Up 2 minutes    0.0.0.0:3000->3000/tcp
cobt-postgres         Up 2 minutes    0.0.0.0:5432->5432/tcp
cobt-redis            Up 2 minutes    0.0.0.0:6379->6379/tcp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╔════════════════════════════════════════════╗
║                                            ║
║          ✅ ALL TESTS PASSED! 🎉           ║
║                                            ║
║   Backend is running correctly             ║
║                                            ║
╚════════════════════════════════════════════╝

Next steps:
  1. Start frontend: npm run dev
  2. Open: http://localhost:5173
  3. Use demo login to test

Useful URLs:
  • Frontend: http://localhost:5173
  • Backend: http://localhost:3000
  • API Docs: http://localhost:3000/api/docs
  • Health Check: http://localhost:3000/api/v1/health
  • Status Monitor: http://localhost:5173/backend-test
```

---

#### Some Tests Failing

```bash
$ ./test-backend.sh

╔════════════════════════════════════════════╗
║                                            ║
║   BTMTravel COBT Backend Health Check      ║
║          Automated Testing Suite           ║
║                                            ║
╚════════════════════════════════════════════╝

Checking prerequisites...

✓ curl installed
✓ jq installed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test 1/6: Server Reachability (Liveness Probe)
✗ FAILED - Server is not reachable
  → Solution: Start backend with: cd backend && docker-compose up -d

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╔════════════════════════════════════════════╗
║              Test Summary                  ║
╚════════════════════════════════════════════╝

✓ Passed: 0 tests
✗ Failed: 1 tests

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

╔════════════════════════════════════════════╗
║                                            ║
║         ❌ SOME TESTS FAILED               ║
║                                            ║
║   Please fix issues before continuing     ║
║                                            ║
╚════════════════════════════════════════════╝

Common solutions:

1. Start the backend:
   cd backend && docker-compose up -d

2. Check logs:
   cd backend && docker-compose logs -f api

3. Restart services:
   cd backend && docker-compose restart

4. Full reset:
   cd backend && docker-compose down && docker-compose up -d

More help:
  • TROUBLESHOOTING.md
  • BACKEND_TESTING_GUIDE.md
  • backend/README.md
```

---

## 🎨 Color Coding

### Status Indicators

| Color | Meaning | Example |
|-------|---------|---------|
| 🟢 **Green** | Success / Healthy | Backend connected |
| 🟡 **Yellow** | Checking / Warning | Testing connection... |
| 🔴 **Red** | Error / Offline | Backend not reachable |

### Badges

| Badge | Status | Action |
|-------|--------|--------|
| **Success** (Green) | ✅ Test passed | Continue |
| **Checking** (Yellow) | ⏳ In progress | Wait |
| **Failed** (Red) | ❌ Test failed | Fix issue |

---

## 📱 Interactive Elements

### Buttons

- **"Run Tests"** - Executes all health checks
- **"Retry"** - Attempts to reconnect
- **"Check Connection Again"** - Re-checks backend status
- **"View Setup Guide"** - Opens documentation

### Expandable Sections

- **"View details"** - Shows JSON response from API
- Expands to show:
  ```json
  {
    "status": "ready",
    "timestamp": "2026-03-04T10:30:45.123Z"
  }
  ```

---

## 🔍 What to Look For

### ✅ Everything Working

Look for:
- All green checkmarks (✓)
- All badges say "Success"
- Overall status shows "Online"
- No red warnings or errors
- Timestamps are recent

### ⚠️ Issues Detected

Look for:
- Red X marks (✗)
- Red "Failed" badges
- Overall status shows "Offline"
- Red alert boxes
- Error messages

### Action Required

When you see problems:
1. Read the error message
2. Follow the suggested solution
3. Click "Retry" after fixing
4. Verify all badges turn green

---

## 💡 Quick Tips

1. **Green = Good** - You're ready to go!
2. **Yellow = Wait** - Tests in progress
3. **Red = Fix** - Backend needs attention
4. **Click details** - See full API responses
5. **Use Retry** - After fixing issues

---

## 📊 Complete Testing Workflow

### Step-by-Step Visual Flow

```
1. Open Login Page
   ↓
   Check status indicator
   ↓
┌─────────────────────┐
│ Is it GREEN? ✅     │
│ ├─ YES → Login!     │
│ └─ NO → Go to step 2│
└─────────────────────┘
   ↓
2. Click "View Backend Status Monitor"
   ↓
   Review detailed checks
   ↓
┌─────────────────────┐
│ All badges GREEN?   │
│ ├─ YES → All good!  │
│ └─ NO → Fix issues  │
└─────────────────────┘
   ↓
3. Follow instructions in red alert box
   ↓
   Start backend
   ↓
4. Click "Retry Connection"
   ↓
   Wait for tests
   ↓
5. ✅ All GREEN → Ready to use!
```

---

## 🎯 Success Criteria

You're ready when you see:

- ✅ Login page: Green "Backend connected"
- ✅ Status monitor: All green "Success" badges
- ✅ Overall status: Green "Online" badge
- ✅ No red alerts or warnings
- ✅ All test timestamps recent
- ✅ Demo login works

---

**Visual guide complete!** Now you know exactly what to expect when testing your backend. 🎨
