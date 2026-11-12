import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  CreditCard,
  FlaskConical,
  Loader2,
  TriangleAlert,
  X,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'
import {
  cartItemsToOrderLines,
  createOrderId,
  formatINR,
  type OrderCustomer,
  type TestOrder,
} from '../lib/orders'
import {
  createRazorpayOrder,
  fetchRazorpayStatus,
  getPublicRazorpayKeyId,
  loadRazorpayScript,
  openRazorpayCheckout,
  verifyRazorpayPayment,
  type RazorpayStatusResponse,
} from '../lib/razorpay'

type FormErrors = Partial<Record<keyof OrderCustomer, string>>
type GatewayMode = 'checking' | 'razorpay' | 'simulated' | 'api-down'

const emptyCustomer: OrderCustomer = {
  name: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
}

function validateCustomer(customer: OrderCustomer) {
  const errors: FormErrors = {}

  if (!customer.name.trim()) errors.name = 'Name is required'
  if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Enter a valid 10-digit phone'
  }
  if (!customer.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
    errors.email = 'Enter a valid email'
  }
  if (!customer.addressLine1.trim()) errors.addressLine1 = 'Address is required'
  if (!customer.city.trim()) errors.city = 'City is required'
  if (!customer.state.trim()) errors.state = 'State is required'
  if (!customer.pincode.trim() || !/^\d{6}$/.test(customer.pincode.trim())) {
    errors.pincode = 'Enter a 6-digit PIN code'
  }

  return errors
}

function fieldClass(hasError?: string) {
  return `mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-plum outline-none transition focus:ring-2 focus:ring-plum/20 ${
    hasError ? 'border-motumo-red/50' : 'border-plum/15'
  }`
}

function trimCustomer(customer: OrderCustomer): OrderCustomer {
  return {
    ...customer,
    name: customer.name.trim(),
    phone: customer.phone.trim(),
    email: customer.email.trim(),
    addressLine1: customer.addressLine1.trim(),
    addressLine2: customer.addressLine2?.trim() || undefined,
    city: customer.city.trim(),
    state: customer.state.trim(),
    pincode: customer.pincode.trim(),
  }
}

export function CheckoutModal() {
  const { items, subtotal, closeCart, clearCart } = useCart()
  const { isCheckoutOpen, closeCheckout, placeTestOrder, openOrdersPanel } = useOrders()

  const [customer, setCustomer] = useState<OrderCustomer>(emptyCustomer)
  const [errors, setErrors] = useState<FormErrors>({})
  const [phase, setPhase] = useState<'form' | 'paying' | 'success'>('form')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [payError, setPayError] = useState<string | null>(null)
  const [gatewayMode, setGatewayMode] = useState<GatewayMode>('checking')
  const [statusInfo, setStatusInfo] = useState<RazorpayStatusResponse | null>(null)
  const [forceSimulated, setForceSimulated] = useState(false)
  const [lastProvider, setLastProvider] = useState<'razorpay' | 'simulated'>('simulated')

  useEffect(() => {
    if (!isCheckoutOpen) {
      const timer = window.setTimeout(() => {
        setPhase('form')
        setOrderId(null)
        setErrors({})
        setPayError(null)
        setForceSimulated(false)
      }, 280)
      return () => window.clearTimeout(timer)
    }

    let cancelled = false
    setGatewayMode('checking')
    setPayError(null)

    ;(async () => {
      const publicKey = getPublicRazorpayKeyId()
      try {
        const status = await fetchRazorpayStatus()
        if (cancelled) return
        setStatusInfo(status)
        if (status.configured && publicKey) {
          setGatewayMode('razorpay')
        } else {
          setGatewayMode('simulated')
        }
      } catch {
        if (cancelled) return
        setStatusInfo(null)
        setGatewayMode(publicKey ? 'api-down' : 'simulated')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isCheckoutOpen])

  const setField = <K extends keyof OrderCustomer>(key: K, value: OrderCustomer[K]) => {
    setCustomer((prev) => ({ ...prev, [key]: value }))
  }

  const handleClose = () => {
    if (phase === 'paying') return
    closeCheckout()
  }

  const useRazorpay = gatewayMode === 'razorpay' && !forceSimulated

  const completeOrder = (order: TestOrder) => {
    placeTestOrder(order)
    clearCart()
    setOrderId(order.id)
    setLastProvider(order.paymentProvider)
    setPhase('success')
    setCustomer(emptyCustomer)
  }

  const placeSimulatedOrder = (trimmed: OrderCustomer) => {
    const id = createOrderId()
    completeOrder({
      id,
      createdAt: new Date().toISOString(),
      status: 'paid-test',
      paymentMethod: 'test',
      paymentProvider: 'simulated',
      customer: trimmed,
      items: cartItemsToOrderLines(items),
      subtotal,
      total: subtotal,
      note: 'Simulated test payment — no Razorpay charge was made.',
    })
  }

  const handleSimulatedPay = (trimmed: OrderCustomer) => {
    setPhase('paying')
    setPayError(null)
    window.setTimeout(() => {
      placeSimulatedOrder(trimmed)
    }, 900)
  }

  const handleRazorpayPay = async (trimmed: OrderCustomer, localOrderId: string) => {
    setPhase('paying')
    setPayError(null)

    try {
      const scriptOk = await loadRazorpayScript()
      if (!scriptOk) {
        throw new Error('Could not load Razorpay Checkout. Check your network and try again.')
      }

      const order = await createRazorpayOrder({
        amount: subtotal,
        receipt: localOrderId,
        notes: {
          local_order_id: localOrderId,
          customer_name: trimmed.name,
        },
      })

      const key = getPublicRazorpayKeyId() || order.keyId

      openRazorpayCheckout({
        key,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Motumo',
        description: `Test order ${localOrderId}`,
        order_id: order.id,
        prefill: {
          name: trimmed.name,
          email: trimmed.email,
          contact: trimmed.phone,
        },
        notes: {
          local_order_id: localOrderId,
        },
        theme: { color: '#7B2D4E' },
        modal: {
          ondismiss: () => {
            setPhase('form')
            setPayError('Payment cancelled. Your cart is still here — you can try again.')
          },
        },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment(response)
            completeOrder({
              id: localOrderId,
              createdAt: new Date().toISOString(),
              status: 'paid',
              paymentMethod: 'razorpay',
              paymentProvider: 'razorpay',
              customer: trimmed,
              items: cartItemsToOrderLines(items),
              subtotal,
              total: subtotal,
              note: 'Razorpay Test Mode payment verified.',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
          } catch (err) {
            setPhase('form')
            setPayError(
              err instanceof Error
                ? err.message
                : 'Payment verification failed. Cart was not cleared.',
            )
          }
        },
      })
    } catch (err) {
      setPhase('form')
      setPayError(err instanceof Error ? err.message : 'Could not start Razorpay checkout.')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (items.length === 0 || phase === 'paying') return

    const nextErrors = validateCustomer(customer)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const trimmed = trimCustomer(customer)
    const id = createOrderId()

    if (useRazorpay) {
      void handleRazorpayPay(trimmed, id)
    } else {
      handleSimulatedPay(trimmed)
    }
  }

  const viewOrders = () => {
    closeCheckout()
    openOrdersPanel()
  }

  const doneShopping = () => {
    closeCheckout()
    closeCart()
  }

  const subtitle =
    phase === 'success'
      ? 'Details saved locally for review.'
      : useRazorpay
        ? 'Razorpay Test Mode — use a Razorpay test card in the checkout popup.'
        : gatewayMode === 'api-down'
          ? 'Payment API unreachable — simulated fallback available.'
          : 'Razorpay keys not set — simulated test pay (or configure keys).'

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close checkout overlay"
            className="fixed inset-0 z-[100] bg-plum-deep/50 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="fixed inset-x-0 bottom-0 z-[110] mx-auto flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:inset-y-auto sm:top-1/2 sm:bottom-auto sm:max-h-[90svh] sm:-translate-y-1/2 sm:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-plum/10 px-5 py-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-motumo-yellow/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-plum-deep uppercase">
                  <FlaskConical className="h-3.5 w-3.5" />
                  {useRazorpay ? 'Razorpay test mode' : 'Test / Dev payment'}
                </div>
                <h2 id="checkout-title" className="mt-2 font-display text-xl font-semibold text-plum">
                  {phase === 'success' ? 'Order placed' : 'Checkout'}
                </h2>
                <p className="mt-0.5 text-xs text-plum-soft">{subtitle}</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={phase === 'paying'}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-plum ring-1 ring-plum/10 disabled:opacity-40"
                aria-label="Close checkout"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {phase === 'success' && orderId ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                    className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-motumo-green/15 text-motumo-green"
                  >
                    <CheckCircle2 className="h-9 w-9" />
                  </motion.div>
                  <p className="mt-5 font-display text-lg font-semibold text-plum">
                    {lastProvider === 'razorpay' ? 'Payment confirmed' : 'Test order confirmed'}
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-plum-soft">
                    {lastProvider === 'razorpay'
                      ? 'Razorpay Test Mode payment verified. Order saved in this browser for review.'
                      : 'Simulated order captured with customer and item details. Nothing was charged.'}
                  </p>
                  <p className="mt-4 rounded-2xl bg-white px-4 py-3 font-display text-sm font-semibold text-plum ring-1 ring-plum/10">
                    Order ID: {orderId}
                  </p>
                  <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={viewOrders}
                      className="flex-1 rounded-full bg-plum py-3 font-display text-sm font-semibold text-white"
                    >
                      View test orders
                    </button>
                    <button
                      type="button"
                      onClick={doneShopping}
                      className="flex-1 rounded-full bg-white py-3 font-display text-sm font-semibold text-plum ring-1 ring-plum/15"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form id="test-checkout-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {!useRazorpay && (
                    <div className="rounded-2xl bg-lavender-50 px-3.5 py-3 text-xs text-plum ring-1 ring-plum/10">
                      <p className="inline-flex items-start gap-2 font-semibold">
                        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-motumo-red" />
                        Razorpay Test Mode not active
                      </p>
                      <p className="mt-1.5 leading-relaxed text-plum-soft">
                        {gatewayMode === 'api-down'
                          ? 'Start the payment API (`npm run dev:api` or `npm run dev:all`) and ensure `.env` has Test Mode keys.'
                          : 'Add Test Mode keys from Razorpay Dashboard → Settings → API Keys to `.env` (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `VITE_RAZORPAY_KEY_ID`), then restart both servers. See `docs/RAZORPAY_TEST.md`.'}
                      </p>
                      {statusInfo?.message && gatewayMode !== 'api-down' && (
                        <p className="mt-1.5 text-[11px] text-plum-soft/90">{statusInfo.message}</p>
                      )}
                      <p className="mt-2 font-semibold text-plum">
                        You can still place a clearly labeled simulated test order below.
                      </p>
                    </div>
                  )}

                  {useRazorpay && forceSimulated === false && (
                    <div className="rounded-2xl bg-white px-3.5 py-3 text-xs text-plum ring-1 ring-plum/10">
                      <p className="inline-flex items-center gap-2 font-semibold">
                        <CreditCard className="h-3.5 w-3.5" />
                        Pay with Razorpay test cards
                      </p>
                      <p className="mt-1.5 leading-relaxed text-plum-soft">
                        Success card:{' '}
                        <span className="font-mono text-[11px] text-plum">4100 2800 0000 1007</span>
                        {' · '}any future expiry · any CVV. Full list in{' '}
                        <span className="font-semibold">docs/RAZORPAY_TEST.md</span>.
                      </p>
                      <button
                        type="button"
                        className="mt-2 text-[11px] font-semibold text-plum underline underline-offset-2"
                        onClick={() => setForceSimulated(true)}
                        disabled={phase === 'paying'}
                      >
                        Use simulated pay instead
                      </button>
                    </div>
                  )}

                  {forceSimulated && gatewayMode === 'razorpay' && (
                    <div className="rounded-2xl bg-lavender-50 px-3.5 py-3 text-xs text-plum ring-1 ring-plum/10">
                      <p className="font-semibold">Simulated payment selected</p>
                      <p className="mt-1 text-plum-soft">
                        No Razorpay charge. Order will be tagged as simulated.
                      </p>
                      <button
                        type="button"
                        className="mt-2 text-[11px] font-semibold text-plum underline underline-offset-2"
                        onClick={() => setForceSimulated(false)}
                        disabled={phase === 'paying'}
                      >
                        Switch back to Razorpay
                      </button>
                    </div>
                  )}

                  {payError && (
                    <div
                      role="alert"
                      className="rounded-2xl bg-motumo-red/10 px-3.5 py-3 text-xs text-motumo-red ring-1 ring-motumo-red/20"
                    >
                      {payError}
                    </div>
                  )}

                  <section>
                    <h3 className="font-display text-sm font-semibold text-plum">Order summary</h3>
                    <ul className="mt-3 space-y-2">
                      {items.map(({ product, quantity }) => (
                        <li
                          key={product.id}
                          className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 text-sm ring-1 ring-plum/8"
                        >
                          <span className="min-w-0 truncate text-plum">
                            {product.name}{' '}
                            <span className="text-plum-soft">× {quantity}</span>
                          </span>
                          <span className="shrink-0 font-display font-semibold text-plum">
                            {formatINR(product.price * quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-between px-1">
                      <span className="text-sm text-plum-soft">Total</span>
                      <span className="font-display text-lg font-semibold text-plum">
                        {formatINR(subtotal)}
                      </span>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-display text-sm font-semibold text-plum">
                      Customer & shipping
                    </h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="sm:col-span-2">
                        <span className="text-xs font-semibold text-plum-soft">Full name</span>
                        <input
                          className={fieldClass(errors.name)}
                          value={customer.name}
                          onChange={(e) => setField('name', e.target.value)}
                          autoComplete="name"
                          disabled={phase === 'paying'}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-motumo-red">{errors.name}</p>
                        )}
                      </label>
                      <label>
                        <span className="text-xs font-semibold text-plum-soft">Phone</span>
                        <input
                          className={fieldClass(errors.phone)}
                          value={customer.phone}
                          onChange={(e) => setField('phone', e.target.value)}
                          autoComplete="tel"
                          inputMode="tel"
                          disabled={phase === 'paying'}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-motumo-red">{errors.phone}</p>
                        )}
                      </label>
                      <label>
                        <span className="text-xs font-semibold text-plum-soft">Email</span>
                        <input
                          type="email"
                          className={fieldClass(errors.email)}
                          value={customer.email}
                          onChange={(e) => setField('email', e.target.value)}
                          autoComplete="email"
                          disabled={phase === 'paying'}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-motumo-red">{errors.email}</p>
                        )}
                      </label>
                      <label className="sm:col-span-2">
                        <span className="text-xs font-semibold text-plum-soft">Address line 1</span>
                        <input
                          className={fieldClass(errors.addressLine1)}
                          value={customer.addressLine1}
                          onChange={(e) => setField('addressLine1', e.target.value)}
                          autoComplete="address-line1"
                          disabled={phase === 'paying'}
                        />
                        {errors.addressLine1 && (
                          <p className="mt-1 text-xs text-motumo-red">{errors.addressLine1}</p>
                        )}
                      </label>
                      <label className="sm:col-span-2">
                        <span className="text-xs font-semibold text-plum-soft">
                          Address line 2 (optional)
                        </span>
                        <input
                          className={fieldClass()}
                          value={customer.addressLine2 ?? ''}
                          onChange={(e) => setField('addressLine2', e.target.value)}
                          autoComplete="address-line2"
                          disabled={phase === 'paying'}
                        />
                      </label>
                      <label>
                        <span className="text-xs font-semibold text-plum-soft">City</span>
                        <input
                          className={fieldClass(errors.city)}
                          value={customer.city}
                          onChange={(e) => setField('city', e.target.value)}
                          autoComplete="address-level2"
                          disabled={phase === 'paying'}
                        />
                        {errors.city && (
                          <p className="mt-1 text-xs text-motumo-red">{errors.city}</p>
                        )}
                      </label>
                      <label>
                        <span className="text-xs font-semibold text-plum-soft">State</span>
                        <input
                          className={fieldClass(errors.state)}
                          value={customer.state}
                          onChange={(e) => setField('state', e.target.value)}
                          autoComplete="address-level1"
                          disabled={phase === 'paying'}
                        />
                        {errors.state && (
                          <p className="mt-1 text-xs text-motumo-red">{errors.state}</p>
                        )}
                      </label>
                      <label className="sm:col-span-2">
                        <span className="text-xs font-semibold text-plum-soft">PIN code</span>
                        <input
                          className={fieldClass(errors.pincode)}
                          value={customer.pincode}
                          onChange={(e) => setField('pincode', e.target.value)}
                          autoComplete="postal-code"
                          inputMode="numeric"
                          disabled={phase === 'paying'}
                        />
                        {errors.pincode && (
                          <p className="mt-1 text-xs text-motumo-red">{errors.pincode}</p>
                        )}
                      </label>
                    </div>
                  </section>
                </form>
              )}
            </div>

            {phase !== 'success' && (
              <div className="border-t border-plum/10 bg-white px-5 py-4">
                <button
                  type="submit"
                  form="test-checkout-form"
                  disabled={phase === 'paying' || items.length === 0 || gatewayMode === 'checking'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-motumo-red py-3.5 font-display text-sm font-semibold text-white disabled:opacity-60"
                >
                  {phase === 'paying' || gatewayMode === 'checking' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {gatewayMode === 'checking'
                        ? 'Checking payment setup…'
                        : useRazorpay
                          ? 'Opening Razorpay…'
                          : 'Processing test payment…'}
                    </>
                  ) : useRazorpay ? (
                    <>Pay with Razorpay · {formatINR(subtotal)}</>
                  ) : (
                    <>Pay (Simulated) · {formatINR(subtotal)}</>
                  )}
                </button>
                <p className="mt-2 text-center text-[11px] text-plum-soft">
                  {useRazorpay
                    ? 'Razorpay Test Mode · verified payment · order stored in this browser'
                    : 'Simulated payment · order stored in this browser only'}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
