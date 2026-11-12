# Razorpay Test Mode (Motumo)

Local checkout can charge via **Razorpay Test Mode** (no real money). Orders still save to the in-browser **Test Orders** panel (`localStorage` key `motumo-test-orders`).

## 1. Create Razorpay keys

1. Sign up / log in at [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Ensure **Test Mode** is ON (toggle in the dashboard).
3. Go to **Settings → API Keys**.
4. Generate / copy:
   - **Key Id** (`rzp_test_…`)
   - **Key Secret**

Use **Test Mode** keys only for local development.

## 2. Configure `.env`

```bash
cp .env.example .env
```

Fill in:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
```

- `RAZORPAY_KEY_SECRET` is used **only** by the Express API (`server/`). Never put it in Vite `VITE_*` vars.
- `VITE_RAZORPAY_KEY_ID` is the public key id for Checkout.js.

`.env` / `.env.local` are gitignored.

## 3. Install & run

```bash
npm install
npm run dev:all
```

This starts:

- Vite storefront → usually `http://localhost:5173`
- Payment API → `http://localhost:8787` (proxied as `/api` from Vite)

Or separately:

```bash
npm run dev:api
npm run dev
```

## 4. Place a test payment

1. Open the storefront, add products to cart.
2. Open cart → **Checkout**.
3. Fill customer / shipping details.
4. Click **Pay with Razorpay**.
5. In the Razorpay popup, choose **Card** and use a test card (below).
6. Complete OTP on the mock bank page (any 4–10 digit OTP for success).
7. On success, the order appears under **Dev Orders** / Test Orders panel with `paymentProvider: razorpay` and payment ids.

If keys are missing or the API is down, checkout shows setup instructions and offers a clearly labeled **simulated** fallback (cart is kept on Razorpay cancel/failure).

## 5. Test cards (India / Test Mode)

From [Razorpay test card docs](https://razorpay.com/docs/payments/payments/test-card-details/):

| Card number           | Network     | Result                          |
| --------------------- | ----------- | ------------------------------- |
| `4100 2800 0000 1007` | Visa        | Success                         |
| `5555 5100 0008 1006` | Mastercard  | Success                         |
| `4100 2800 0006 0003` | Visa        | Declined (failure handling)     |
| `4100 2800 0008 0001` | Visa        | Insufficient funds              |

- CVV: any
- Expiry: any **future** date
- On the mock OTP page: 4–10 digits → success; shorter → fail

UPI (optional): `success@razorpay` / `failure@razorpay`

## 6. API endpoints

| Method | Path                       | Purpose                                      |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/api/razorpay/status`     | Whether server keys are loaded               |
| POST   | `/api/razorpay/create-order` | Create Razorpay order (amount in INR rupees) |
| POST   | `/api/razorpay/verify`     | HMAC signature verification                  |

Amounts are converted to **paisa** on the server. Currency is **INR**.

## 7. Limitations

- Both Vite and the payment API must be running for real Razorpay checkout (`npm run dev:all`).
- Orders are stored in the browser only (dev capture), not on a production order backend.
- Do not use Live Mode keys for local testing.
