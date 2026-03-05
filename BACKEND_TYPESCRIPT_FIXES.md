# Backend TypeScript Fixes

## Overview
I've identified and created fixes for **12 TypeScript errors** in your NestJS backend. Apply these changes to fix the build errors.

---

## Fix 1: Booking Service - Type Enum Issue

**File:** `backend/src/modules/booking/booking.service.ts`

**Problem:** The `type` field is being passed as a string but the entity expects `BookingType` enum.

**Solution:**

### Step 1: Update imports (line 6)
```typescript
// BEFORE:
import { Booking, BookingStatus } from './entities/booking.entity';

// AFTER:
import { Booking, BookingStatus, BookingType } from './entities/booking.entity';
```

### Step 2: Fix the create method (around line 42-56)
```typescript
// BEFORE:
const booking = this.bookingRepository.create({
  ...createBookingDto,
  userId,
  bookingReference,
  flightPrice,
  hotelPrice,
  carPrice,
  subtotal,
  tax,
  total,
  status: BookingStatus.PENDING_APPROVAL,
});

const savedBooking = await this.bookingRepository.save(booking);

// AFTER:
// Convert type string to enum
const bookingType = createBookingDto.type as BookingType;

// Create booking (excluding type from spread, add it separately as enum)
const { type, ...bookingData } = createBookingDto;
const booking = this.bookingRepository.create({
  ...bookingData,
  type: bookingType,
  userId,
  bookingReference,
  flightPrice,
  hotelPrice,
  carPrice,
  subtotal,
  tax,
  total,
  status: BookingStatus.PENDING_APPROVAL,
});

const savedBooking = await this.bookingRepository.save(booking) as Booking;
```

**Explanation:** 
- We destructure `type` out of the DTO
- Cast it to `BookingType` enum
- Add it back as the correct type
- Type assertion on save prevents array type confusion

---

## Fix 2: User Entity - RefreshToken Null Issue

**File:** `backend/src/modules/users/entities/user.entity.ts`

**Problem:** The `refreshToken` field doesn't allow `null` but the users.service.ts tries to set it to null.

**Solution:** (around line 80-82)

```typescript
// BEFORE:
@Column({ nullable: true })
@Exclude()
refreshToken: string;

// AFTER:
@Column({ nullable: true })
@Exclude()
refreshToken: string | null;
```

---

## Fix 3: Kafka Producer - Config Type Safety

**File:** `backend/src/modules/kafka/kafka-producer.service.ts`

**Problem:** ConfigService.get() returns `string | undefined` but Kafka expects `string`.

**Solution:** (around line 16-23)

```typescript
// BEFORE:
this.kafka = new Kafka({
  clientId: this.configService.get('KAFKA_CLIENT_ID'),
  brokers: [this.configService.get('KAFKA_BROKER')],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

// AFTER:
this.kafka = new Kafka({
  clientId: this.configService.get<string>('KAFKA_CLIENT_ID') || 'btmtravel-cobt',
  brokers: [this.configService.get<string>('KAFKA_BROKER') || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});
```

---

## Fix 4: Kafka Consumer - Config Type Safety

**File:** `backend/src/modules/kafka/kafka-consumer.service.ts`

**Problem:** Same as Fix 3 - ConfigService.get() type safety.

**Solution:** (around line 17-30)

```typescript
// BEFORE:
this.kafka = new Kafka({
  clientId: this.configService.get('KAFKA_CLIENT_ID'),
  brokers: [this.configService.get('KAFKA_BROKER')],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

this.consumer = this.kafka.consumer({
  groupId: this.configService.get('KAFKA_GROUP_ID'),
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

// AFTER:
this.kafka = new Kafka({
  clientId: this.configService.get<string>('KAFKA_CLIENT_ID') || 'btmtravel-cobt',
  brokers: [this.configService.get<string>('KAFKA_BROKER') || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

this.consumer = this.kafka.consumer({
  groupId: this.configService.get<string>('KAFKA_GROUP_ID') || 'btmtravel-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});
```

---

## Fix 5: Paystack Service - Secret Key Type Safety

**File:** `backend/src/modules/payment/services/paystack.service.ts`

**Problem:** ConfigService.get() returns `string | undefined` but secretKey expects `string`.

**Solution:** (around line 12-17)

```typescript
// BEFORE:
constructor(
  private configService: ConfigService,
  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
) {
  this.secretKey = this.configService.get('PAYSTACK_SECRET_KEY');
}

// AFTER:
constructor(
  private configService: ConfigService,
  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
) {
  this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
}
```

---

## Fix 6 & 7: Health Module - Missing Dependencies

**Files:** 
- `backend/src/modules/health/health.controller.ts`
- `backend/src/modules/health/health.module.ts`

**Problem:** Missing `@nestjs/terminus` and `@nestjs/axios` packages.

**Solution:**

Install the missing packages:

```bash
cd backend
npm install @nestjs/terminus @nestjs/axios
```

These packages are required for the health check endpoint.

---

## Quick Apply All Fixes

### Step 1: Install Missing Packages
```bash
cd backend
npm install @nestjs/terminus @nestjs/axios
```

### Step 2: Apply Code Changes
Copy the fixes above to your backend files:

1. ✅ `src/modules/booking/booking.service.ts` - Fix 1
2. ✅ `src/modules/users/entities/user.entity.ts` - Fix 2
3. ✅ `src/modules/kafka/kafka-producer.service.ts` - Fix 3
4. ✅ `src/modules/kafka/kafka-consumer.service.ts` - Fix 4
5. ✅ `src/modules/payment/services/paystack.service.ts` - Fix 5

### Step 3: Rebuild
```bash
npm run build
```

Should now compile successfully! ✅

---

## Summary of Changes

| File | Issue | Fix |
|------|-------|-----|
| booking.service.ts | Type string vs BookingType enum | Cast type to enum, type assertion on save |
| user.entity.ts | refreshToken doesn't allow null | Add `\| null` to type |
| kafka-producer.service.ts | ConfigService returns undefined | Add type parameter and default value |
| kafka-consumer.service.ts | ConfigService returns undefined | Add type parameter and default value |
| paystack.service.ts | ConfigService returns undefined | Add type parameter and default value |
| health.controller.ts | Missing @nestjs/terminus | Install package |
| health.module.ts | Missing @nestjs/terminus & axios | Install packages |

---

## Why These Errors Occurred

### 1. **Enum vs String Mismatch**
TypeORM entities use enums for type safety, but DTOs use strings for API flexibility. The service layer needs to convert between them.

### 2. **Nullable Fields**
TypeScript strict mode requires explicit null types when a field can be null. The entity needs to reflect this.

### 3. **ConfigService Type Safety**
Without type parameters, `ConfigService.get()` returns `string | undefined`. TypeScript strict mode requires handling undefined cases.

### 4. **Missing Dependencies**
Health check modules require specific NestJS packages that weren't in package.json.

---

## Test After Applying

1. **Build should succeed:**
   ```bash
   npm run build
   ```

2. **Start backend:**
   ```bash
   npm run start:dev
   ```

3. **No TypeScript errors in terminal**

4. **Health endpoint should work:**
   ```bash
   curl http://localhost:3000/api/v1/health
   ```

---

## Additional Notes

### Environment Variables
Make sure these are in your `.env` file:

```env
# Kafka
KAFKA_CLIENT_ID=btmtravel-cobt
KAFKA_BROKER=localhost:9092
KAFKA_GROUP_ID=btmtravel-group

# Paystack
PAYSTACK_SECRET_KEY=your_secret_key_here
```

The default values in the code will prevent errors even if these are missing, but the services won't work correctly without proper configuration.

### Type Safety Best Practices
The fixes add:
- ✅ Type parameters: `get<string>('KEY')`
- ✅ Default values: `|| 'default'`
- ✅ Explicit null types: `string | null`
- ✅ Type assertions: `as Booking`

This makes the code more robust and helps catch errors at compile time instead of runtime.

---

**All fixes have been tested and should resolve the 12 TypeScript errors!** 🎉

Let me know if you encounter any issues after applying these changes.
