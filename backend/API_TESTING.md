# API Testing Guide

Complete collection of API endpoints for testing COBT backend.

## Base URL

```
http://localhost:3000/api/v1
```

For production:
```
https://api.yourdomain.com/api/v1
```

---

## Authentication Flow

### 1. Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+2348012345678",
    "role": "traveller",
    "department": "Engineering",
    "costCenter": "ENG-001"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john.doe@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "traveller"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@company.com",
    "password": "SecurePass123!"
  }'
```

**Save the accessToken for subsequent requests**

### 3. Refresh Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 4. Logout

```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## User Management

### Get Current User

```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get All Users (Admin/Arranger only)

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get User by ID

```bash
curl -X GET http://localhost:3000/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update User

```bash
curl -X PATCH http://localhost:3000/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+2348098765432",
    "department": "Marketing"
  }'
```

---

## Flight Search

### Search Flights

```bash
curl -X GET "http://localhost:3000/api/v1/search/flights?origin=LOS&destination=LHR&departureDate=2026-04-15&adults=1&travelClass=ECONOMY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Parameters:**
- `origin` - IATA code (e.g., LOS for Lagos)
- `destination` - IATA code (e.g., LHR for London)
- `departureDate` - YYYY-MM-DD format
- `returnDate` - Optional, YYYY-MM-DD format
- `adults` - Number of passengers (default: 1)
- `travelClass` - ECONOMY, BUSINESS, FIRST (default: ECONOMY)

**Response:**
```json
[
  {
    "id": "flight-offer-id",
    "airline": "BA",
    "flightNumber": "BA75",
    "departure": {
      "airport": "LOS",
      "city": "Lagos",
      "time": "10:30",
      "date": "2026-04-15"
    },
    "arrival": {
      "airport": "LHR",
      "city": "London",
      "time": "17:45",
      "date": "2026-04-15"
    },
    "duration": "PT7H15M",
    "stops": 0,
    "price": 125000,
    "currency": "NGN",
    "class": "ECONOMY"
  }
]
```

---

## Hotel Search

### Search Hotels

```bash
curl -X GET "http://localhost:3000/api/v1/search/hotels?cityCode=LON&checkInDate=2026-04-15&checkOutDate=2026-04-22&adults=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Parameters:**
- `cityCode` - City IATA code (e.g., LON for London)
- `checkInDate` - YYYY-MM-DD format
- `checkOutDate` - YYYY-MM-DD format
- `adults` - Number of guests (default: 1)

**Response:**
```json
[
  {
    "id": "hotel-id",
    "name": "London Marriott Hotel",
    "location": "LON, GB",
    "rating": 4,
    "price": 85000,
    "currency": "NGN",
    "roomType": "STANDARD",
    "checkIn": "2026-04-15",
    "checkOut": "2026-04-22"
  }
]
```

---

## Booking Management

### Create Booking

```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "combined",
    "flightDetails": {
      "airline": "BA",
      "flightNumber": "BA75",
      "departure": {
        "airport": "LOS",
        "city": "Lagos",
        "time": "10:30",
        "date": "2026-04-15"
      },
      "arrival": {
        "airport": "LHR",
        "city": "London",
        "time": "17:45",
        "date": "2026-04-15"
      },
      "duration": "7h 15m",
      "class": "Economy"
    },
    "hotelDetails": {
      "name": "London Marriott Hotel",
      "location": "London, UK",
      "checkIn": "2026-04-15",
      "checkOut": "2026-04-22",
      "nights": 7,
      "roomType": "Standard Room"
    },
    "carDetails": {
      "name": "Toyota Camry",
      "category": "Standard",
      "transmission": "Automatic",
      "pickupDate": "2026-04-15",
      "dropoffDate": "2026-04-22",
      "days": 7
    },
    "flightPrice": 125000,
    "hotelPrice": 85000,
    "carPrice": 35000,
    "justification": "Client meeting and product presentation in London office",
    "costCenter": "ENG-001",
    "projectCode": "PROJ-2026-042"
  }'
```

**Response:**
```json
{
  "id": "booking-uuid",
  "bookingReference": "BTM1XYZ456ABC",
  "userId": "user-uuid",
  "type": "combined",
  "status": "pending_approval",
  "flightPrice": 125000,
  "hotelPrice": 85000,
  "carPrice": 35000,
  "subtotal": 245000,
  "tax": 18375,
  "total": 263375,
  "currency": "NGN",
  "createdAt": "2026-03-03T10:00:00Z"
}
```

### Get All Bookings

```bash
curl -X GET http://localhost:3000/api/v1/bookings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Booking by ID

```bash
curl -X GET http://localhost:3000/api/v1/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Pending Approvals (Travel Arranger/Admin only)

```bash
curl -X GET http://localhost:3000/api/v1/bookings/pending \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Approve Booking (Travel Arranger/Admin only)

```bash
curl -X PATCH http://localhost:3000/api/v1/bookings/BOOKING_ID/approve \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approverName": "Jane Smith"
  }'
```

### Reject Booking (Travel Arranger/Admin only)

```bash
curl -X PATCH http://localhost:3000/api/v1/bookings/BOOKING_ID/reject \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approverName": "Jane Smith",
    "reason": "Budget exceeded for this quarter"
  }'
```

### Confirm Booking (After payment)

```bash
curl -X PATCH http://localhost:3000/api/v1/bookings/BOOKING_ID/confirm \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Payment Processing

### Initialize Payment

```bash
curl -X POST http://localhost:3000/api/v1/payments/initialize \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "BOOKING_ID",
    "email": "john.doe@company.com"
  }'
```

**Response:**
```json
{
  "paymentId": "payment-uuid",
  "reference": "PAY-1XYZ456ABC",
  "authorizationUrl": "https://checkout.paystack.com/xyz123",
  "accessCode": "xyz123abc"
}
```

**Note:** Redirect user to `authorizationUrl` to complete payment

### Verify Payment

```bash
curl -X GET http://localhost:3000/api/v1/payments/verify/PAY-1XYZ456ABC \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "payment-uuid",
    "reference": "PAY-1XYZ456ABC",
    "status": "success",
    "amount": 263375,
    "currency": "NGN",
    "paidAt": "2026-03-03T10:30:00Z"
  }
}
```

### Get All Payments

```bash
curl -X GET http://localhost:3000/api/v1/payments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Payment by ID

```bash
curl -X GET http://localhost:3000/api/v1/payments/PAYMENT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Paystack Webhook (Called by Paystack)

```bash
curl -X POST http://localhost:3000/api/v1/payments/webhook \
  -H "x-paystack-signature: WEBHOOK_SIGNATURE" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "PAY-1XYZ456ABC",
      "amount": 26337500,
      "status": "success",
      "gateway_response": "Successful"
    }
  }'
```

---

## Health Check

### Check API Health

```bash
curl -X GET http://localhost:3000/api/v1/health
```

**Response:**
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "memory_heap": {
      "status": "up"
    },
    "memory_rss": {
      "status": "up"
    },
    "disk": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

### Readiness Probe

```bash
curl -X GET http://localhost:3000/api/v1/health/ready
```

### Liveness Probe

```bash
curl -X GET http://localhost:3000/api/v1/health/live
```

---

## Testing Workflow

### Complete Booking Flow

1. **Register/Login**
   ```bash
   # Login as traveller
   TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"traveller@test.com","password":"Test123!"}' \
     | jq -r '.accessToken')
   ```

2. **Search Flights**
   ```bash
   curl -X GET "http://localhost:3000/api/v1/search/flights?origin=LOS&destination=LHR&departureDate=2026-04-15&adults=1" \
     -H "Authorization: Bearer $TOKEN"
   ```

3. **Create Booking**
   ```bash
   BOOKING_ID=$(curl -s -X POST http://localhost:3000/api/v1/bookings \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{ ... booking data ... }' \
     | jq -r '.id')
   ```

4. **Login as Arranger**
   ```bash
   ARRANGER_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"arranger@test.com","password":"Test123!"}' \
     | jq -r '.accessToken')
   ```

5. **Approve Booking**
   ```bash
   curl -X PATCH http://localhost:3000/api/v1/bookings/$BOOKING_ID/approve \
     -H "Authorization: Bearer $ARRANGER_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"approverName":"Jane Smith"}'
   ```

6. **Initialize Payment**
   ```bash
   curl -X POST http://localhost:3000/api/v1/payments/initialize \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"bookingId\":\"$BOOKING_ID\",\"email\":\"traveller@test.com\"}"
   ```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "COBT API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{accessToken}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Booking not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 95
  - `X-RateLimit-Reset`: 1646304000

When rate limit is exceeded:
```json
{
  "statusCode": 429,
  "message": "Too Many Requests"
}
```

---

## WebSocket Events

Connect to WebSocket for real-time updates:

```javascript
const socket = io('http://localhost:3000');

// Authenticate
socket.emit('authenticate', { userId: 'USER_ID' });

// Listen for events
socket.on('booking:updated', (data) => {
  console.log('Booking updated:', data);
});

socket.on('payment:updated', (data) => {
  console.log('Payment updated:', data);
});

socket.on('notification', (data) => {
  console.log('Notification:', data);
});
```

---

## Tips for Testing

1. **Use jq for JSON parsing**
   ```bash
   curl ... | jq '.'
   ```

2. **Save tokens to variables**
   ```bash
   TOKEN=$(curl ... | jq -r '.accessToken')
   ```

3. **Use environment variables**
   ```bash
   export API_URL=http://localhost:3000/api/v1
   curl $API_URL/health
   ```

4. **Test with different roles**
   - Create users with different roles
   - Test authorization boundaries

5. **Monitor logs while testing**
   ```bash
   docker-compose logs -f api
   ```

---

For interactive API testing, visit the Swagger documentation at:
**http://localhost:3000/api/docs**
