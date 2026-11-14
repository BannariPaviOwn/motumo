# Motumo

E-commerce marketing + shop site for **Motumo** — millet chocolate spreads (Choco Millet Delight).

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide icons
- Express + Razorpay (Test Mode checkout API)

## Run locally

```bash
npm install
cp .env.example .env   # optional: add Razorpay Test Mode keys
npm run dev:all        # Vite + payment API together
```

Or frontend only:

```bash
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

Without Razorpay keys / API, checkout falls back to a clearly labeled **simulated** test payment. With keys configured, use real Razorpay Test Mode cards.

Full setup: [docs/RAZORPAY_TEST.md](docs/RAZORPAY_TEST.md).

## Admin (product activate / deactivate)

Open **`/admin`** (Footer → Admin, or `http://localhost:5173/admin`).

This is a **dev-only soft gate** (not real auth):

| Unlock method | How |
| ------------- | --- |
| Password | Enter `motumo-admin` on the unlock screen |
| Query param | Visit `/admin?unlock=motumo-admin` (auto-unlocks, then strips the param) |
| Persist | Unlock sets `localStorage` key `motumo-admin-unlocked=1` |

Toggles write active/inactive flags to `localStorage` (`motumo-product-active`) and merge over the static catalog in `src/data/products.ts`. Inactive products disappear from the public shop and cannot be added to cart.

## Build

```bash
npm run build
npm run preview
```

## Scripts

| Script         | What it runs                          |
| -------------- | ------------------------------------- |
| `npm run dev`  | Vite storefront                       |
| `npm run dev:api` | Express Razorpay API on `:8787`    |
| `npm run dev:all` | Both (recommended for payments)    |
