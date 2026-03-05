# Fix: User Entity RefreshToken Type Error

## Error
```
DataTypeNotSupportedError: Data type "Object" in "User.refreshToken" is not supported by "postgres" database.
```

## Problem
TypeORM is misinterpreting `string | null` as an Object type instead of a nullable string.

---

## Solution

**File:** `backend/src/modules/users/entities/user.entity.ts`

### ❌ Wrong (causes Object type error):
```typescript
@Column({ nullable: true })
@Exclude()
refreshToken: string | null;
```

### ✅ Fix Option 1 (Recommended - Use optional property):
```typescript
@Column({ nullable: true })
@Exclude()
refreshToken?: string;
```

### ✅ Fix Option 2 (Explicit type):
```typescript
@Column({ type: 'varchar', nullable: true })
@Exclude()
refreshToken: string | null;
```

---

## Why Option 1 is Better

**TypeScript Optional (`?`):**
- ✅ TypeORM understands it natively
- ✅ TypeScript allows undefined and string
- ✅ Cleaner syntax
- ✅ Common pattern in NestJS

**Union Type (`| null`):**
- ❌ Requires explicit column type
- ⚠️ Can confuse TypeORM type detection
- More verbose

---

## Complete User Entity Context

Around line 80-82 of `backend/src/modules/users/entities/user.entity.ts`:

```typescript
@Column({ type: 'jsonb', nullable: true })
metadata: Record<string, any>;

@Column({ nullable: true })
@Exclude()
refreshToken?: string;  // ✅ Changed from: refreshToken: string | null;

@CreateDateColumn()
createdAt: Date;
```

---

## Users Service Compatibility

This fix also works with your users.service.ts which sets refreshToken to null:

**File:** `backend/src/modules/users/users.service.ts` (around line 41)

```typescript
// Both work correctly now:

// Setting to null:
await this.userRepository.update(id, { refreshToken: null });

// Setting to undefined:
await this.userRepository.update(id, { refreshToken: undefined });

// Setting to a string:
await this.userRepository.update(id, { refreshToken: 'abc123...' });
```

**Why it works:**
- `refreshToken?: string` accepts: `string`, `undefined`, or omitted
- TypeORM treats `null` and `undefined` the same for nullable columns
- Database stores both as `NULL`

---

## Apply the Fix

1. **Edit** `backend/src/modules/users/entities/user.entity.ts`
2. **Find** line ~82: `refreshToken: string | null;`
3. **Replace** with: `refreshToken?: string;`
4. **Rebuild** and restart:

```bash
# Rebuild
npm run build

# Or restart Docker
docker-compose down
docker-compose up --build
```

---

## Verify Fix

After restarting, you should see:

```
✅ TypeOrmModule dependencies initialized
✅ Database connected successfully
✅ Application is running on: http://0.0.0.0:3000
```

No more DataTypeNotSupportedError! 🎉

---

## All User Entity Fixes Combined

If you haven't applied the previous fixes, here's the complete refreshToken section:

```typescript
// Around line 77-88 in user.entity.ts

@Column({ type: 'jsonb', nullable: true })
metadata: Record<string, any>;

@Column({ nullable: true })
@Exclude()
refreshToken?: string;  // ✅ FIXED: Optional property instead of | null

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;

@Column({ nullable: true })
lastLoginAt: Date;
```

---

## TypeORM Type Mapping Reference

| TypeScript Type | TypeORM Column | PostgreSQL Type |
|----------------|----------------|-----------------|
| `string` | `@Column()` | `varchar` |
| `string \| null` | ⚠️ Needs `type: 'varchar'` | `varchar` |
| `string?` | `@Column({ nullable: true })` | `varchar NULL` ✅ |
| `number` | `@Column()` | `integer` |
| `boolean` | `@Column()` | `boolean` |
| `Date` | `@Column()` | `timestamp` |

**Best Practice:** Use optional properties (`?`) for nullable columns in TypeORM.

---

## Quick Test

After applying the fix, test the auth endpoints:

```bash
# 1. Register a user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@btmtravel.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "traveller"
  }'

# 2. Should work without errors! ✅
```

The refreshToken field will be properly stored as NULL in the database until login creates one.

---

**This fix resolves the DataTypeNotSupportedError and allows the backend to start successfully!** 🚀
