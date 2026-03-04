#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        🚀 BTMTravel COBT Backend Startup Script           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found!${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${RED}Error: backend directory not found!${NC}"
    echo "Please ensure the backend folder exists in the project root."
    exit 1
fi

echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"
echo ""

# Check for Docker
if command -v docker &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Docker found: $(docker --version)"
else
    echo -e "  ${RED}✗${NC} Docker not found!"
    echo ""
    echo "Please install Docker Desktop:"
    echo "  Mac: https://docs.docker.com/desktop/mac/install/"
    echo "  Windows: https://docs.docker.com/desktop/windows/install/"
    echo "  Linux: https://docs.docker.com/engine/install/"
    exit 1
fi

# Check for Docker Compose
if command -v docker-compose &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Docker Compose found: $(docker-compose --version)"
else
    echo -e "  ${RED}✗${NC} Docker Compose not found!"
    echo "Please install Docker Compose"
    exit 1
fi

# Check for Node.js
if command -v node &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Node.js found: $(node --version)"
else
    echo -e "  ${RED}✗${NC} Node.js not found!"
    echo "Please install Node.js: https://nodejs.org/"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Setting up backend environment...${NC}"
echo ""

cd backend

# Check if .env exists, create if not
if [ ! -f ".env" ]; then
    echo -e "  ${YELLOW}→${NC} Creating .env file from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "  ${GREEN}✓${NC} .env file created"
    else
        echo -e "  ${RED}✗${NC} .env.example not found!"
        exit 1
    fi
else
    echo -e "  ${GREEN}✓${NC} .env file already exists"
fi

echo ""
echo -e "${BLUE}Step 3: Starting Docker services...${NC}"
echo ""

# Check if containers are already running
if docker-compose ps | grep -q "Up"; then
    echo -e "  ${YELLOW}!${NC} Some containers are already running"
    read -p "  Do you want to restart them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "  ${YELLOW}→${NC} Stopping existing containers..."
        docker-compose down
    fi
fi

# Start Docker containers
echo -e "  ${YELLOW}→${NC} Starting Docker containers..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} Docker containers started"
else
    echo -e "  ${RED}✗${NC} Failed to start Docker containers"
    echo ""
    echo "Try running manually:"
    echo "  cd backend"
    echo "  docker-compose logs"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 4: Waiting for services to be ready...${NC}"
echo ""

# Wait for services to be healthy
echo -e "  ${YELLOW}→${NC} Waiting for database and services (30 seconds)..."

for i in {1..30}; do
    echo -n "."
    sleep 1
done
echo ""

# Check if API is responding
echo -e "  ${YELLOW}→${NC} Checking API health..."
sleep 5

for i in {1..5}; do
    if curl -s http://localhost:3000/api/v1/health > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} API is responding"
        API_READY=true
        break
    else
        echo -e "  ${YELLOW}→${NC} Waiting for API... (attempt $i/5)"
        sleep 3
    fi
done

if [ "$API_READY" != true ]; then
    echo -e "  ${YELLOW}!${NC} API not responding yet, but containers are running"
    echo "  Check logs with: docker-compose logs -f api"
fi

echo ""
echo -e "${BLUE}Step 5: Creating test accounts...${NC}"
echo ""

# Make script executable and run
if [ -f "scripts/create-test-accounts.sh" ]; then
    chmod +x scripts/create-test-accounts.sh
    echo -e "  ${YELLOW}→${NC} Running test account creation script..."
    
    if ./scripts/create-test-accounts.sh; then
        echo -e "  ${GREEN}✓${NC} Test accounts created successfully"
    else
        echo -e "  ${YELLOW}!${NC} Test account creation completed with warnings"
        echo "  Accounts may already exist (this is normal)"
    fi
else
    echo -e "  ${YELLOW}!${NC} Test account script not found"
    echo "  You can create it manually later"
fi

cd ..

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              ✅ Backend Started Successfully!              ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Display service URLs
echo -e "${CYAN}Service URLs:${NC}"
echo "  Backend API:  http://localhost:3000"
echo "  API Docs:     http://localhost:3000/api/docs"
echo "  Health Check: http://localhost:3000/api/v1/health"
echo ""

# Display test credentials
echo -e "${CYAN}Demo Login Credentials:${NC}"
echo ""
echo "  ${GREEN}Traveller:${NC}"
echo "    Email:    traveller@test.com"
echo "    Password: Test123!"
echo ""
echo "  ${GREEN}Travel Arranger:${NC}"
echo "    Email:    arranger@test.com"
echo "    Password: Test123!"
echo ""
echo "  ${GREEN}Admin:${NC}"
echo "    Email:    admin@test.com"
echo "    Password: Test123!"
echo ""

# Display next steps
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                     Next Steps                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  1. Start the frontend:"
echo -e "     ${YELLOW}npm run dev${NC}"
echo ""
echo "  2. Open your browser:"
echo -e "     ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "  3. Click 'Demo Login as Traveller'"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  Useful Commands                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  View logs:"
echo "    cd backend && docker-compose logs -f api"
echo ""
echo "  Check status:"
echo "    cd backend && docker-compose ps"
echo ""
echo "  Stop backend:"
echo "    cd backend && docker-compose down"
echo ""
echo "  Restart backend:"
echo "    cd backend && docker-compose restart"
echo ""
echo "  Reset everything:"
echo "    cd backend && docker-compose down -v && docker-compose up -d"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
