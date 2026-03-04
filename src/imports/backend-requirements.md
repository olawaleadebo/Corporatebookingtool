You are building a production‑grade backend for a travel/booking platform.
The backend must be built using:

Node.js with TypeScript (preferably NestJS, or Express with modular architecture)

PostgreSQL as the primary database

Kafka for event streaming and asynchronous workflows

WebSockets for real‑time updates

Docker for containerization and deployment on a VPS

Amadeus API for flight/hotel search, pricing, and booking

Paystack SDK for payments (card, bank transfer, USSD, etc.)

Functional Requirements
1. Authentication & Authorization
Implement registration, login, logout, password reset.

Use JWT for session management.

Support roles (user, admin, support).

Store users, roles, and permissions in PostgreSQL.

2. Search & Amadeus Integration
Provide endpoints for flight/hotel search using Amadeus.

Implement a service layer that:

Wraps Amadeus SDK/REST API.

Handles retries, rate limits, and error normalization.

Caches frequent searches in PostgreSQL.

Revalidate availability and pricing during booking.

3. Booking Workflow
Endpoints for:

Creating a booking request.

Validating availability with Amadeus.

Confirming booking and storing PNR/ticket details.

Entities:

User, Passenger, Booking, Segment, Ticket, Payment, Invoice.

Emit Kafka events:

booking-created

booking-confirmed

booking-failed

4. Payments (Paystack SDK)
Integrate Paystack SDK for:

Payment initialization

Payment verification

Webhook handling

Store payment records in PostgreSQL.

Link payments to bookings.

Emit Kafka events:

payment-initiated

payment-success

payment-failed

Implement a ledger-like transaction history for audit.

5. Notifications & Real-time Updates
Use WebSockets for:

Booking status updates

Payment status updates

Price change alerts

Kafka consumers push updates to WebSocket gateway.

6. Architecture & Modules
Organize backend into modules:

auth

search

booking

payment (Paystack)

notification

common (config, logging, utils)

Each module must include:

Controller (REST endpoints)

Service (business logic)

Repository (DB access)

DTOs (validation)

Entities (PostgreSQL models)

7. Database Design
Use TypeORM or Prisma.

Create migrations for all schema changes.

Add indexes for:

userId

bookingId

paymentId

status

createdAt

8. Kafka Integration
Configure producers and consumers.

Topics:

booking-events

payment-events

notification-events

Ensure idempotent consumers.

9. Docker & VPS Deployment
Provide Dockerfiles for:

API service

Worker services

Provide docker-compose with:

PostgreSQL

Kafka + Zookeeper

API

Workers

WebSocket gateway

Reverse proxy (NGINX/Traefik)

Use environment variables for secrets.

10. Observability & Security
Centralized error handling.

Structured logging (JSON logs).

Rate limiting on public endpoints.

Health checks and metrics endpoints.

Secure secret management.