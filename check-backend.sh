#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "   BTMTravel COBT - Backend Health Check"
echo "========================================="
echo ""

# Check if backend is running
echo "Checking backend status..."
BACKEND_URL="http://localhost:3000/api/v1/health"

if curl -s -f "$BACKEND_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is RUNNING${NC}"
    echo ""
    echo "Backend Health:"
    curl -s "$BACKEND_URL" | jq . 2>/dev/null || curl -s "$BACKEND_URL"
    echo ""
    echo -e "${GREEN}You can start the frontend now!${NC}"
else
    echo -e "${RED}✗ Backend is NOT RUNNING${NC}"
    echo ""
    echo -e "${YELLOW}To start the backend:${NC}"
    echo "  1. Navigate to backend directory:"
    echo "     ${YELLOW}cd backend${NC}"
    echo ""
    echo "  2. Start with Docker (recommended):"
    echo "     ${YELLOW}docker-compose up -d${NC}"
    echo ""
    echo "  3. Or start manually:"
    echo "     ${YELLOW}npm install${NC}"
    echo "     ${YELLOW}npm run start:dev${NC}"
    echo ""
    echo "  Note: Make sure PostgreSQL and Kafka are running"
    echo "  (docker-compose will handle this automatically)"
    echo ""
fi

echo "========================================="
