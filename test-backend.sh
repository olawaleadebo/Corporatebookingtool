#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NGROK_URL="https://chromoplasmic-ungaping-danielle.ngrok-free.dev"
HEALTH_URL="${NGROK_URL}/api/v1/health"

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Backend Connection Test${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "Testing: ${YELLOW}${HEALTH_URL}${NC}"
echo ""

# Test 1: Check if URL is reachable
echo -e "${BLUE}[1/3]${NC} Testing basic connectivity..."
if curl -s --head --request GET "${HEALTH_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} URL is reachable"
else
    echo -e "${RED}✗${NC} URL is NOT reachable"
    echo ""
    echo -e "${YELLOW}Possible issues:${NC}"
    echo "  1. Backend is not running (run: cd backend && npm run start:dev)"
    echo "  2. Ngrok is not running (run: ngrok http 3000)"
    echo "  3. Ngrok URL has changed (update /src/config/api.config.ts)"
    exit 1
fi

# Test 2: Get health check response
echo -e "${BLUE}[2/3]${NC} Fetching health check..."
RESPONSE=$(curl -s -H "ngrok-skip-browser-warning: true" "${HEALTH_URL}")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Response received"
    echo ""
    echo -e "${BLUE}Response:${NC}"
    echo "${RESPONSE}" | jq '.' 2>/dev/null || echo "${RESPONSE}"
else
    echo -e "${RED}✗${NC} Failed to get response"
    exit 1
fi

# Test 3: Check response status
echo ""
echo -e "${BLUE}[3/3]${NC} Checking response status..."
STATUS=$(echo "${RESPONSE}" | jq -r '.status' 2>/dev/null)

if [ "${STATUS}" = "ok" ]; then
    echo -e "${GREEN}✓${NC} Backend is healthy!"
    echo ""
    echo -e "${GREEN}=====================================${NC}"
    echo -e "${GREEN}✓ ALL TESTS PASSED${NC}"
    echo -e "${GREEN}=====================================${NC}"
    echo ""
    echo -e "Your backend is properly configured and reachable."
    echo -e "The Figma Make app should now connect successfully."
else
    echo -e "${YELLOW}⚠${NC} Backend responded but status is not 'ok'"
    echo ""
    echo -e "${YELLOW}Response status:${NC} ${STATUS}"
fi
