export type RazorpayStatusResponse = {
  configured: boolean
  keyIdPrefix: string | null
  mode: 'test' | 'live' | 'unknown' | null
  message: string
}

export type CreateRazorpayOrderResponse = {
  id: string
  amount: number
  currency: string
  receipt: string
  keyId: string
}

export type VerifyRazorpayPaymentPayload = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export type RazorpaySuccessResponse = VerifyRazorpayPaymentPayload

type RazorpayCheckoutOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: { color?: string }
  modal?: {
    ondismiss?: () => void
  }
  handler: (response: RazorpaySuccessResponse) => void
}

type RazorpayInstance = {
  open: () => void
  on: (event: string, handler: (response: unknown) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance
  }
}

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

let scriptPromise: Promise<boolean> | null = null

export function getPublicRazorpayKeyId() {
  return (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined)?.trim() || ''
}

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_URL}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)))
      existing.addEventListener('error', () => resolve(false))
      if (window.Razorpay) resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => resolve(Boolean(window.Razorpay))
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  return scriptPromise
}

export async function fetchRazorpayStatus(): Promise<RazorpayStatusResponse> {
  const res = await fetch('/api/razorpay/status')
  if (!res.ok) {
    throw new Error('Payment API is not reachable. Start it with npm run dev:api (or npm run dev:all).')
  }
  return (await res.json()) as RazorpayStatusResponse
}

export async function createRazorpayOrder(input: {
  amount: number
  receipt: string
  notes?: Record<string, string>
}): Promise<CreateRazorpayOrderResponse> {
  const res = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = (await res.json()) as CreateRazorpayOrderResponse & {
    error?: string
    message?: string
  }
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Could not create Razorpay order')
  }
  return data
}

export async function verifyRazorpayPayment(
  payload: VerifyRazorpayPaymentPayload,
): Promise<{ valid: boolean }> {
  const res = await fetch('/api/razorpay/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as {
    valid?: boolean
    error?: string
    message?: string
  }
  if (!res.ok || !data.valid) {
    throw new Error(data.message || data.error || 'Payment verification failed')
  }
  return { valid: true }
}

export function openRazorpayCheckout(options: RazorpayCheckoutOptions) {
  if (!window.Razorpay) {
    throw new Error('Razorpay Checkout script failed to load')
  }
  const rzp = new window.Razorpay(options)
  rzp.open()
  return rzp
}
