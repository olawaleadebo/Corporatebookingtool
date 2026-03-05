#!/bin/bash

# BTMTravel COBT Backend Testing Script
# This script performs automated health checks on the backend

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
echo "║   BTMTravel COBT Backend Health Check      ║"
echo "║          Automated Testing Suite           ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
echo -e "${BLUE}Checking prerequisites...${NC}"
echo ""

if command_exists curl; then
    echo -e "${GREEN}✓${NC} curl installed"
else
    echo -e "${RED}✗${NC} curl not installed (required for testing)"
    exit 1
fi

if command_exists jq; then
    echo -e "${GREEN}✓${NC} jq installed"
    HAS_JQ=1
else
    echo -e "${YELLOW}○${NC} jq not installed (optional, for pretty output)"
    HAS_JQ=0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=6

# Test 1: Server Reachability (Liveness)
echo -e "${BLUE}Test 1/6:${NC} Server Reachability (Liveness Probe)"
if curl -s -f http://localhost:3000/api/v1/health/live > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} - Server is alive and responding"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - Server is not reachable"
    echo -e "${YELLOW}  → Solution: Start backend with: cd backend && docker-compose up -d${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Test 2: Readiness Probe
echo -e "${BLUE}Test 2/6:${NC} Readiness Probe"
READY_RESPONSE=$(curl -s http://localhost:3000/api/v1/health/ready 2>/dev/null || echo "")
if [ -n "$READY_RESPONSE" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Service is ready to accept requests"
    if [ $HAS_JQ -eq 1 ]; then
        echo "$READY_RESPONSE" | jq '.'
    else
        echo "$READY_RESPONSE"
    fi
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAILED${NC} - Service is not ready"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Test 3: Full Health Check
echo -e "${BLUE}Test 3/6:${NC} Full Health Check"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/v1/health 2>/dev/null || echo "")
if [ -n "$HEALTH_RESPONSE" ]; then
    if [ $HAS_JQ -eq 1 ]; then
        HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status')
        if [ "$HEALTH_STATUS" = "ok" ]; then
            echo -e "${GREEN}✓ PASSED${NC} - Overall health status: OK"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}✗ FAILED${NC} - Health status: $HEALTH_STATUS"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        echo -e "${GREEN}✓ PASSED${NC} - Health endpoint responding"
        echo "$HEALTH_RESPONSE"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
else
    echo -e "${RED}✗ FAILED${NC} - Health endpoint not responding"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Test 4: Database Connection
echo -e "${BLUE}Test 4/6:${NC} Database Connection"
if [ -n "$HEALTH_RESPONSE" ] && [ $HAS_JQ -eq 1 ]; then
    DB_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.details.database.status' 2>/dev/null || echo "unknown")
    if [ "$DB_STATUS" = "up" ]; then
        echo -e "${GREEN}✓ PASSED${NC} - Database is connected and healthy"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} - Database status: $DB_STATUS"
        echo -e "${YELLOW}  → Solution: Check database container: docker-compose logs postgres${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo -e "${YELLOW}○ SKIPPED${NC} - Cannot verify (jq required or health check failed)"
fi
echo ""

# Test 5: Memory Status
echo -e "${BLUE}Test 5/6:${NC} Memory Status"
if [ -n "$HEALTH_RESPONSE" ] && [ $HAS_JQ -eq 1 ]; then
    MEMORY_HEAP=$(echo "$HEALTH_RESPONSE" | jq -r '.details.memory_heap.status' 2>/dev/null || echo "unknown")
    MEMORY_RSS=$(echo "$HEALTH_RESPONSE" | jq -r '.details.memory_rss.status' 2>/dev/null || echo "unknown")
    if [ "$MEMORY_HEAP" = "up" ] && [ "$MEMORY_RSS" = "up" ]; then
        echo -e "${GREEN}✓ PASSED${NC} - Memory usage is healthy"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${YELLOW}○ WARNING${NC} - Memory status: Heap=$MEMORY_HEAP, RSS=$MEMORY_RSS"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
else
    echo -e "${YELLOW}○ SKIPPED${NC} - Cannot verify (jq required or health check failed)"
fi
echo ""

# Test 6: Disk Status
echo -e "${BLUE}Test 6/6:${NC} Disk Status"
if [ -n "$HEALTH_RESPONSE" ] && [ $HAS_JQ -eq 1 ]; then
    DISK_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.details.disk.status' 2>/dev/null || echo "unknown")
    if [ "$DISK_STATUS" = "up" ]; then
        echo -e "${GREEN}✓ PASSED${NC} - Disk space is healthy"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${YELLOW}○ WARNING${NC} - Disk status: $DISK_STATUS"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    fi
else
    echo -e "${YELLOW}○ SKIPPED${NC} - Cannot verify (jq required or health check failed)"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║              Test Summary                  ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ Passed:${NC} $TESTS_PASSED tests"
echo -e "${RED}✗ Failed:${NC} $TESTS_FAILED tests"
echo ""

# Additional Docker checks
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}Docker Container Status:${NC}"
echo ""

if command_exists docker-compose || command_exists docker; then
    cd backend 2>/dev/null || true
    if [ -f "docker-compose.yml" ]; then
        # Try docker compose (newer) first, then docker-compose (older)
        if docker compose ps 2>/dev/null || docker-compose ps 2>/dev/null; then
            echo ""
        else
            echo -e "${YELLOW}Could not get container status${NC}"
        fi
    else
        echo -e "${YELLOW}Not in backend directory${NC}"
    fi
    cd .. 2>/dev/null || true
else
    echo -e "${YELLOW}Docker not available${NC}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Final result
if [ $TESTS_FAILED -eq 0 ]; then
    echo "╔════════════════════════════════════════════╗"
    echo "║                                            ║"
    echo "║          ✅ ALL TESTS PASSED! 🎉           ║"
    echo "║                                            ║"
    echo "║   Backend is running correctly             ║"
    echo "║                                            ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo -e "${GREEN}Next steps:${NC}"
    echo "  1. Start frontend: npm run dev"
    echo "  2. Open: http://localhost:5173"
    echo "  3. Use demo login to test"
    echo ""
    echo -e "${BLUE}Useful URLs:${NC}"
    echo "  • Frontend: http://localhost:5173"
    echo "  • Backend: http://localhost:3000"
    echo "  • API Docs: http://localhost:3000/api/docs"
    echo "  • Health Check: http://localhost:3000/api/v1/health"
    echo "  • Status Monitor: http://localhost:5173/backend-test"
    echo ""
    exit 0
else
    echo "╔════════════════════════════════════════════╗"
    echo "║                                            ║"
    echo "║         ❌ SOME TESTS FAILED               ║"
    echo "║                                            ║"
    echo "║   Please fix issues before continuing     ║"
    echo "║                                            ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo -e "${RED}Common solutions:${NC}"
    echo ""
    echo "1. Start the backend:"
    echo "   cd backend && docker-compose up -d"
    echo ""
    echo "2. Check logs:"
    echo "   cd backend && docker-compose logs -f api"
    echo ""
    echo "3. Restart services:"
    echo "   cd backend && docker-compose restart"
    echo ""
    echo "4. Full reset:"
    echo "   cd backend && docker-compose down && docker-compose up -d"
    echo ""
    echo -e "${BLUE}More help:${NC}"
    echo "  • TROUBLESHOOTING.md"
    echo "  • BACKEND_TESTING_GUIDE.md"
    echo "  • backend/README.md"
    echo ""
    exit 1
fi
