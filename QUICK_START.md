# 🚀 Quick Start Guide

## Running the Project

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
# Backend runs on http://localhost:8000
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:8081
```

---

## Access Points

| Component    | URL                                           | Status     |
| ------------ | --------------------------------------------- | ---------- |
| Backend API  | `http://localhost:8000`                       | ✅ Running |
| Frontend App | `http://localhost:8081`                       | ✅ Running |
| SDK Status   | `http://localhost:8000/api/devpay/sdk-status` | ✅ Working |

---

## Test SDK Integration

```bash
# Run integration tests
node test-sdk-integration.js
```

Expected output:

```
✅ Health Check: 200 OK
✅ SDK Status: Retrieved
✅ Payment Status: Retrieved
✅ Feature Check: Retrieved
```

---

## Using the SDK

### Backend - Check Payment Status

```typescript
import { isDevPayPaid } from "./utils/devpay-guard";

if (isDevPayPaid()) {
  // User has active license
}
```

### Frontend - Display Premium Features

```tsx
import { useDevPayGuard } from "@/hooks/use-devpay";

function MyComponent() {
  const status = useDevPayGuard();

  if (status?.isPaid) {
    return <PremiumContent />;
  }
  return <UpgradePrompt />;
}
```

---

## SDK Credentials

**Project ID**: `69e9eef2c86ae9decfc0daac`  
**Public Key**: `pk_live_tx60incg9z0gvjwteqo52`  
**Private Key**: `sk_live_go52roo3f99ec1uqmqzu3` (in .env)

---

## Documentation

- 📖 Full Integration Guide: `SDK_INTEGRATION.md`
- 📖 Completion Report: `INTEGRATION_COMPLETE.md`
- 🧪 Test Script: `test-sdk-integration.js`

---

## Available SDK Methods

### Backend

| Method                   | Purpose              |
| ------------------------ | -------------------- |
| `getDevPayGuard()`       | Get SDK instance     |
| `isDevPayPaid()`         | Check if paid        |
| `hasDevPayFeature(code)` | Check feature access |
| `getDevPayStatus()`      | Get full status      |
| `getSDKStatus()`         | Get SDK info         |

### Frontend

| Method             | Purpose            |
| ------------------ | ------------------ |
| `useDevPayGuard()` | React hook for SDK |
| `DevPayGuardTest`  | Test component     |

---

## API Endpoints

### Check SDK Status

```
GET /api/devpay/sdk-status
```

### Check Payment Status

```
GET /api/devpay/payment-status
```

### Check Feature Access

```
POST /api/devpay/check-feature
Body: { "featureCode": "feature_name" }
```

---

## Troubleshooting

**Issue**: SDK not initializing  
**Solution**: This is normal in local dev. SDK will work with production DevPay backend.

**Issue**: Ports already in use  
**Solution**: Frontend automatically uses next available port (8081, 8082, etc.)

**Issue**: Dependencies not installing  
**Solution**: Use `npm install --legacy-peer-deps` or clear cache

---

## Next Steps

1. ✅ SDKs installed and running
2. ✅ Both servers started
3. ⬜ Connect to production DevPay backend
4. ⬜ Add feature-based access controls
5. ⬜ Test end-to-end payment flow
