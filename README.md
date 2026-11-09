# billing-core

Subscription billing API for SafetyThird (fictional company, test data only).

Handles customers, subscription plans, and monthly invoice generation for small-business accounts.

## Run

```bash
npm install
npm test
npm run dev   # http://localhost:3000
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/plans` | List subscription plans |
| POST | `/customers` | Create a customer |
| POST | `/customers/:id/subscriptions` | Subscribe a customer to a plan |
| POST | `/invoices/run` | Generate invoices for a billing date |

All amounts are stored in cents (ZAR). VAT is 15%.

> All data in this repo is made up. Do not add real customer data, including in tests.
