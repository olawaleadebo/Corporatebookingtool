#!/bin/bash

# BTMTravel COBT - Quick Fix Login Script
# This script automatically fixes login issues

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 BTMTravel COBT - Quick Login Fix"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Check if postgres container exists
if ! docker ps | grep -q cobt-postgres; then
    echo "❌ PostgreSQL container (cobt-postgres) is not running"
    echo "   Run: docker-compose up -d"
    exit 1
fi

echo "✅ PostgreSQL container is running"

# Check if database exists
DB_EXISTS=$(docker exec cobt-postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='cobt_user'")

if [ "$DB_EXISTS" != "1" ]; then
    echo "⚠️  Database 'cobt_user' doesn't exist. Creating it..."
    docker exec cobt-postgres psql -U postgres -c "CREATE DATABASE cobt_user;" > /dev/null 2>&1
    echo "✅ Database created"
fi

# Enable UUID extension
echo "🔧 Enabling UUID extension..."
docker exec cobt-postgres psql -U postgres -d cobt_user -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" > /dev/null 2>&1

# Check if users table exists
TABLE_EXISTS=$(docker exec cobt-postgres psql -U postgres -d cobt_user -tAc "SELECT 1 FROM information_schema.tables WHERE table_name='users'")

if [ "$TABLE_EXISTS" != "1" ]; then
    echo "❌ Users table doesn't exist!"
    echo ""
    echo "You need to run database migrations first:"
    echo "  1. Go to your backend directory"
    echo "  2. Run: npm run migration:run"
    echo "  OR"
    echo "  3. Enable 'synchronize: true' in TypeORM config and restart backend"
    echo ""
    exit 1
fi

echo "✅ Users table exists"

# Check current users
USER_COUNT=$(docker exec cobt-postgres psql -U postgres -d cobt_user -tAc "SELECT COUNT(*) FROM users WHERE email LIKE '%@test.com'")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Current Status:"
echo "   Demo users found: $USER_COUNT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ask user what to do
echo "What would you like to do?"
echo ""
echo "  1) Generate working SQL file (RECOMMENDED)"
echo "  2) Show existing users"
echo "  3) Delete and recreate demo users"
echo "  4) Test API connection"
echo "  5) Exit"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🔐 Generating SQL file with correct password hash..."
        echo ""
        
        if [ -f "create-demo-users.js" ]; then
            # Check if bcrypt is available
            if command -v node > /dev/null 2>&1; then
                node create-demo-users.js
                echo ""
                echo "✅ SQL file generated!"
                echo ""
                echo "Next steps:"
                echo "  1. docker cp working-demo-users.sql cobt-postgres:/tmp/working-demo-users.sql"
                echo "  2. docker exec -it cobt-postgres psql -U postgres -f /tmp/working-demo-users.sql"
            else
                echo "❌ Node.js not found. Please install Node.js or run the script manually."
            fi
        else
            echo "❌ create-demo-users.js not found in current directory"
        fi
        ;;
    
    2)
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📋 Existing Users:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        docker exec cobt-postgres psql -U postgres -d cobt_user -c "SELECT email, \"firstName\", \"lastName\", role, status FROM users;"
        ;;
    
    3)
        echo ""
        echo "⚠️  This will DELETE existing demo users and create new ones."
        read -p "Are you sure? (yes/no): " confirm
        
        if [ "$confirm" = "yes" ]; then
            echo ""
            echo "🗑️  Deleting old demo users..."
            docker exec cobt-postgres psql -U postgres -d cobt_user -c "DELETE FROM users WHERE email IN ('traveller@test.com', 'arranger@test.com', 'admin@test.com');" > /dev/null 2>&1
            
            echo "❌ Cannot insert users without proper bcrypt hash!"
            echo ""
            echo "Please run option 1 to generate SQL file with correct hash."
        else
            echo "Cancelled."
        fi
        ;;
    
    4)
        echo ""
        echo "🧪 Testing API connection..."
        echo ""
        read -p "Enter your ngrok URL (e.g., https://xxxx.ngrok.io): " NGROK_URL
        
        echo "Testing health endpoint..."
        RESPONSE=$(curl -s -w "\n%{http_code}" "${NGROK_URL}/api/v1/health" -H "ngrok-skip-browser-warning: true")
        HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ Backend is reachable (HTTP $HTTP_CODE)"
        else
            echo "❌ Backend returned HTTP $HTTP_CODE"
        fi
        ;;
    
    5)
        echo "Goodbye!"
        exit 0
        ;;
    
    *)
        echo "Invalid choice"
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
