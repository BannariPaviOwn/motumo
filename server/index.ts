import cors from 'cors'
import crypto from 'node:crypto'
import 'dotenv/config'
import express from 'express'
import Razorpay from 'razorpay'

const PORT = Number(process.env.RAZORPAY_API_PORT || 8787)
const KEY_ID = process.env.RAZORPAY_KEY_ID?.trim() || ''
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim() || ''

const keysConfigured = Boolean(KEY_ID && KEY_SECRET)

const razorpay = keysConfigured
  ? new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET,
    })
  : null

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'motumo-razorpay-api' })
})

app.get('/api/razorpay/status', (_req, res) => {
  res.json({
    configured: keysConfigured,
    keyIdPrefix: KEY_ID ? `${KEY_ID.slice(0, 8)}…` : null,
    mode: KEY_ID.startsWith('rzp_test_')
      ? 'test'
      : KEY_ID.startsWith('rzp_live_')
        ? 'live'
        : keysConfigured
          ? 'unknown'
          : null,
    message: keysConfigured
      ? 'Razorpay keys loaded. Use Test Mode keys for local checkout.'
      : 'Missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET. Add Test Mode keys from Razorpay Dashboard > Settings > API Keys to .env',
  })
})

app.post('/api/razorpay/create-order', async (req, res) => {
  if (!razorpay || !keysConfigured) {
    res.status(503).json({
      error: 'razorpay_keys_missing',
      message:
        'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (Test Mode) to .env, then restart the API server.',
    })
    return
  }

  const amountRupees = Number(req.body?.amount)
  if (!Number.isFinite(amountRupees) || amountRupees <= 0) {
    res.status(400).json({
      error: 'invalid_amount',
      message: 'amount must be a positive number in INR rupees.',
    })
    return
  }

  // Razorpay expects amount in the smallest currency unit (paisa for INR).
  const amountPaisa = Math.round(amountRupees * 100)
  if (amountPaisa < 100) {
    res.status(400).json({
      error: 'amount_too_small',
      message: 'Minimum chargeable amount is ₹1.00.',
    })
    return
  }

  const receiptRaw =
    typeof req.body?.receipt === 'string' && req.body.receipt.trim()
      ? req.body.receipt.trim()
      : `mtm_${Date.now()}`
  const receipt = receiptRaw.slice(0, 40)

  try {
    const order = await razorpay.orders.create({
      amount: amountPaisa,
      currency: 'INR',
      receipt,
      notes: {
        source: 'motumo-storefront-test',
        ...(typeof req.body?.notes === 'object' && req.body.notes
          ? Object.fromEntries(
              Object.entries(req.body.notes).map(([k, v]) => [k, String(v)]),
            )
          : {}),
      },
    })

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: KEY_ID,
    })
  } catch (err) {
    console.error('[razorpay] create-order failed', err)
    const message =
      err && typeof err === 'object' && 'error' in err
        ? String((err as { error?: { description?: string } }).error?.description || err)
        : err instanceof Error
          ? err.message
          : 'Failed to create Razorpay order'
    res.status(502).json({ error: 'create_order_failed', message })
  }
})

app.post('/api/razorpay/verify', (req, res) => {
  if (!keysConfigured) {
    res.status(503).json({
      error: 'razorpay_keys_missing',
      message:
        'Razorpay is not configured. Add Test Mode keys to .env and restart the API server.',
    })
    return
  }

  const orderId = String(req.body?.razorpay_order_id || '')
  const paymentId = String(req.body?.razorpay_payment_id || '')
  const signature = String(req.body?.razorpay_signature || '')

  if (!orderId || !paymentId || !signature) {
    res.status(400).json({
      error: 'missing_fields',
      message: 'razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.',
    })
    return
  }

  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  const valid = expected === signature
  if (!valid) {
    res.status(400).json({
      error: 'invalid_signature',
      message: 'Payment signature verification failed.',
      valid: false,
    })
    return
  }

  res.json({
    valid: true,
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
  })
})

app.listen(PORT, () => {
  console.log(`[motumo-api] Razorpay payment API on http://localhost:${PORT}`)
  if (!keysConfigured) {
    console.warn(
      '[motumo-api] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing — create-order/verify will return 503 until .env is set.',
    )
  } else if (!KEY_ID.startsWith('rzp_test_')) {
    console.warn(
      '[motumo-api] Key does not look like a Test Mode key (rzp_test_…). Prefer Test Mode keys for local development.',
    )
  }
})
