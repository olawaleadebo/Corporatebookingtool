#!/bin/bash

# COBT Quick Start Script
# This script helps you start the backend and frontend easily

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║                                            ║"
echo "║        BTMTravel COBT Quick Start          ║"
echo "║     Corporate Booking Tool Setup           ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"
echo ""

MISSING_DEPS=0

if command_exists docker; then
    echo -e "${GREEN}✓${NC} Docker installed"
else
    echo -e "${RED}✗${NC} Docker not installed"
    MISSING_DEPS=1
fi

if command_exists docker-compose; then
    echo -e "${GREEN}✓${NC} Docker Compose installed"
else
    echo -e "${RED}✗${NC} Docker Compose not installed"
    MISSING_DEPS=1
fi

if command_exists node; then
    echo -e "${GREEN}✓${NC} Node.js installed ($(node --version))"
else
    echo -e "${RED}✗${NC} Node.js not installed"
    MISSING_DEPS=1
fi

echo ""

if [ $MISSING_DEPS -eq 1 ]; then
    echo -e "${RED}Missing dependencies!${NC} Please install the missing tools."
    echo "See: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if backend is already running
echo -e "${BLUE}Checking backend status...${NC}"
if curl -s http://localhost:3000/api/v1/health >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend already running!"
    BACKEND_RUNNING=1
else
    echo -e "${YELLOW}○${NC} Backend not running"
    BACKEND_RUNNING=0
fi
echo ""

# Start backend if not running
if [ $BACKEND_RUNNING -eq 0 ]; then
    echo -e "${BLUE}Starting backend services...${NC}"
    echo ""
    
    # Check if .env exists
    if [ ! -f "backend/.env" ]; then
        echo -e "${YELLOW}Creating backend .env file...${NC}"
        cp backend/.env.example backend/.env
    fi
    
    cd backend
    
    # Start Docker services
    echo "Starting Docker containers..."
    docker-compose up -d
    
    echo ""
    echo -e "${YELLOW}Waiting for services to start (30 seconds)...${NC}"
    sleep 5
    
    # Show progress
    for i in {1..5}; do
        echo -n "."
        sleep 5
    done
    echo ""
    echo ""
    
    # Check if backend is now running
    if curl -s http://localhost:3000/api/v1/health >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Backend started successfully!"
    else
        echo -e "${RED}✗${NC} Backend failed to start. Check logs:"
        echo "  docker-compose logs -f api"
        exit 1
    fi
    
    # Create test accounts
    echo ""
    echo -e "${BLUE}Creating test accounts...${NC}"
    if [ -f "scripts/create-test-accounts.sh" ]; then
        chmod +x scripts/create-test-accounts.sh
        ./scripts/create-test-accounts.sh
    else
        echo -e "${YELLOW}Warning: Test account script not found${NC}"
    fi
    
    cd ..
fi

# Check if frontend .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    cp .env.example .env
fi

# Display status
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           Setup Complete! 🎉                ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Backend:${NC}  http://localhost:3000"
echo -e "${GREEN}API Docs:${NC} http://localhost:3000/api/docs"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           Demo Login Credentials           ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Traveller:${NC}"
echo "  Email: traveller@test.com"
echo "  Password: Test123!"
echo ""
echo -e "${BLUE}Travel Arranger:${NC}"
echo "  Email: arranger@test.com"
echo "  Password: Test123!"
echo ""
echo -e "${BLUE}Admin:${NC}"
echo "  Email: admin@test.com"
echo "  Password: Test123!"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║              Next Steps                    ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo -e "1. Start frontend: ${GREEN}npm run dev${NC}"
echo -e "2. Open browser: ${GREEN}http://localhost:5173${NC}"
echo -e "3. Click: ${GREEN}Demo Login as Traveller${NC}"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           Useful Commands                  ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}View backend logs:${NC}"
echo "  cd backend && docker-compose logs -f api"
echo ""
echo -e "${BLUE}Stop backend:${NC}"
echo "  cd backend && docker-compose down"
echo ""
echo -e "${BLUE}Restart backend:${NC}"
echo "  cd backend && docker-compose restart"
echo ""
echo -e "${BLUE}Check health:${NC}"
echo "  curl http://localhost:3000/api/v1/health"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║              Documentation                 ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "  📖 GETTING_STARTED.md   - Full setup guide"
echo "  📖 TROUBLESHOOTING.md   - Fix common issues"
echo "  📖 BACKEND_SETUP.md     - Backend details"
echo "  📖 backend/API_TESTING.md - API examples"
echo ""
echo -e "${GREEN}Ready to start!${NC} Run: ${BLUE}npm run dev${NC}"
echo ""
