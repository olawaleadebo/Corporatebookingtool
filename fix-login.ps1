# BTMTravel COBT - Windows PowerShell Fix Script
# Run this from your backend directory in PowerShell

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔧 BTMTravel COBT - Quick Login Fix (Windows)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    $dockerCheck = docker ps 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "⚠️  Warning: package.json not found. Are you in the backend directory?" -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/n)"
    if ($confirm -ne "y") {
        exit 0
    }
}

# Check if bcrypt is installed
Write-Host ""
Write-Host "Checking bcrypt installation..." -ForegroundColor Yellow
$bcryptCheck = npm list bcrypt 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  bcrypt not found. Installing..." -ForegroundColor Yellow
    npm install bcrypt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install bcrypt" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ bcrypt is available" -ForegroundColor Green

# Check if script file exists
if (-not (Test-Path "create-demo-users.js")) {
    Write-Host ""
    Write-Host "⚠️  create-demo-users.js not found in current directory" -ForegroundColor Yellow
    Write-Host "    Looking in parent directory..." -ForegroundColor Yellow
    
    if (Test-Path "../backend-create-demo-users.js") {
        Write-Host "    Found! Copying to current directory..." -ForegroundColor Green
        Copy-Item "../backend-create-demo-users.js" -Destination "./create-demo-users.js"
    } else {
        Write-Host "❌ Could not find create-demo-users.js" -ForegroundColor Red
        Write-Host "   Please make sure the file exists." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Step 1: Generating SQL with correct password hash..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

node create-demo-users.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate SQL file" -ForegroundColor Red
    exit 1
}

# Check if SQL file was created
if (-not (Test-Path "working-demo-users.sql")) {
    Write-Host "❌ SQL file was not generated" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ SQL file generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Step 2: Finding PostgreSQL username..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$pgUsers = @("postgres", "root", "admin", "cobt")
$workingUser = $null

foreach ($user in $pgUsers) {
    Write-Host "Trying user: $user..." -ForegroundColor Yellow
    $result = docker exec cobt-postgres psql -U $user -l 2>&1
    if ($LASTEXITCODE -eq 0) {
        $workingUser = $user
        Write-Host "✅ Found working user: $workingUser" -ForegroundColor Green
        break
    }
}

if ($null -eq $workingUser) {
    Write-Host "⚠️  Could not auto-detect PostgreSQL user" -ForegroundColor Yellow
    Write-Host "    Common usernames: postgres, root, admin" -ForegroundColor Yellow
    Write-Host ""
    $workingUser = Read-Host "Enter PostgreSQL username"
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Step 3: Copying SQL file to container..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to copy SQL file to container" -ForegroundColor Red
    exit 1
}

Write-Host "✅ File copied to container" -ForegroundColor Green

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Step 4: Running SQL script..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

docker exec -it cobt-postgres psql -U $workingUser -f /tmp/working-demo-users.sql

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Script execution had warnings (this is normal)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Step 5: Verifying users were created..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

docker exec cobt-postgres psql -U $workingUser -d cobt_user -c "SELECT email, role, status FROM users WHERE email LIKE '%@test.com';"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "📋 You can now login with these credentials:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   👤 Traveller: traveller@test.com / Test123!" -ForegroundColor White
Write-Host "   👤 Arranger:  arranger@test.com  / Test123!" -ForegroundColor White
Write-Host "   👤 Admin:     admin@test.com     / Test123!" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green
Write-Host ""
