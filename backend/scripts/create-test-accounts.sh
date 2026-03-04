#!/bin/bash

# Script to create test accounts for COBT

API_URL="${API_URL:-http://localhost:3000/api/v1}"

echo "=========================================="
echo "Creating Test Accounts for COBT"
echo "=========================================="
echo ""
echo "API URL: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to create account
create_account() {
    local email=$1
    local password=$2
    local firstName=$3
    local lastName=$4
    local role=$5
    
    echo "Creating account for $email..."
    
    response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"$password\",
        \"firstName\": \"$firstName\",
        \"lastName\": \"$lastName\",
        \"role\": \"$role\"
      }")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✓ Account created successfully${NC}"
        echo "  Email: $email"
        echo "  Password: $password"
        echo "  Role: $role"
        echo ""
        return 0
    elif [ "$http_code" -eq 409 ]; then
        echo -e "${GREEN}✓ Account already exists${NC}"
        echo "  Email: $email"
        echo "  Password: $password"
        echo "  Role: $role"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Failed to create account${NC}"
        echo "  HTTP Code: $http_code"
        echo "  Response: $body"
        echo ""
        return 1
    fi
}

# Create test accounts
echo "1. Creating Traveller Account"
create_account "traveller@test.com" "Test123!" "John" "Doe" "traveller"

echo "2. Creating Travel Arranger Account"
create_account "arranger@test.com" "Test123!" "Jane" "Smith" "travel_arranger"

echo "3. Creating Admin Account"
create_account "admin@test.com" "Test123!" "Admin" "User" "admin"

echo "4. Creating Additional Traveller"
create_account "sarah.johnson@test.com" "Test123!" "Sarah" "Johnson" "traveller"

echo "5. Creating Additional Arranger"
create_account "mike.wilson@test.com" "Test123!" "Mike" "Wilson" "travel_arranger"

echo "=========================================="
echo "Test Accounts Creation Complete!"
echo "=========================================="
echo ""
echo "Use these credentials to login:"
echo ""
echo "TRAVELLER:"
echo "  Email: traveller@test.com"
echo "  Password: Test123!"
echo ""
echo "TRAVEL ARRANGER:"
echo "  Email: arranger@test.com"
echo "  Password: Test123!"
echo ""
echo "ADMIN:"
echo "  Email: admin@test.com"
echo "  Password: Test123!"
echo ""
echo "=========================================="
