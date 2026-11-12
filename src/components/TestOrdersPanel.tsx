import { AnimatePresence, motion } from 'framer-motion'
import { Download, FlaskConical, Trash2, X } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'
import { formatINR } from '../lib/orders'

export function TestOrdersPanel() {
  const {
    orders,
    isOrdersPanelOpen,
    closeOrdersPanel,
    clearOrders,
    exportOrders,
  } = useOrders()

  return (
    <AnimatePresence>
      {isOrdersPanelOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close test orders overlay"
            className="fixed inset-0 z-[100] bg-plum-deep/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOrdersPanel}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[110] flex h-full w-full max-w-lg flex-col bg-cream shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            aria-label="Test orders"
          >
            <div className="flex items-start justify-between gap-3 border-b border-plum/10 px-5 py-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-motumo-yellow/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-plum-deep uppercase">
                  <FlaskConical className="h-3.5 w-3.5" />
                  Dev panel
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold text-plum">Test orders</h2>
                <p className="mt-0.5 text-xs text-plum-soft">
                  {orders.length} captured · stored in localStorage
                </p>
              </div>
              <button
                type="button"
                onClick={closeOrdersPanel}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-plum ring-1 ring-plum/10"
                aria-label="Close test orders"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-2 border-b border-plum/10 bg-white px-5 py-3">
              <button
                type="button"
                onClick={exportOrders}
                disabled={orders.length === 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-plum px-3 py-2.5 font-display text-xs font-semibold text-white disabled:opacity-40"
              >
                <Download className="h-3.5 w-3.5" />
                Download JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  if (orders.length === 0) return
                  if (window.confirm('Clear all test orders from this browser?')) clearOrders()
                }}
                disabled={orders.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-3 py-2.5 font-display text-xs font-semibold text-motumo-red ring-1 ring-motumo-red/20 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {orders.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-lg font-semibold text-plum">No test orders yet</p>
                  <p className="mt-2 max-w-xs text-sm text-plum-soft">
                    Place a test order from the cart checkout to capture customer and item details
                    here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="rounded-2xl bg-white p-4 ring-1 ring-plum/8"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-sm font-semibold text-plum">{order.id}</p>
                          <p className="mt-0.5 text-xs text-plum-soft">
                            {new Date(order.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <span className="rounded-full bg-lavender-100 px-2.5 py-1 text-[11px] font-semibold text-plum">
                            {order.paymentProvider === 'razorpay' ? 'razorpay' : 'simulated'}
                          </span>
                          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-plum ring-1 ring-plum/10">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {order.paymentProvider === 'razorpay' && order.razorpayPaymentId && (
                        <div className="mt-3 rounded-xl bg-white px-3 py-2 text-[11px] text-plum-soft ring-1 ring-plum/8">
                          <p>
                            Payment:{' '}
                            <span className="font-mono text-plum">{order.razorpayPaymentId}</span>
                          </p>
                          {order.razorpayOrderId && (
                            <p className="mt-0.5">
                              RZ order:{' '}
                              <span className="font-mono text-plum">{order.razorpayOrderId}</span>
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-3 rounded-xl bg-lavender-50/80 px-3 py-2.5 text-sm">
                        <p className="font-semibold text-plum">{order.customer.name}</p>
                        <p className="mt-1 text-xs text-plum-soft">
                          {order.customer.phone} · {order.customer.email}
                        </p>
                        <p className="mt-1 text-xs text-plum-soft">
                          {order.customer.addressLine1}
                          {order.customer.addressLine2 ? `, ${order.customer.addressLine2}` : ''}
                          <br />
                          {order.customer.city}, {order.customer.state} {order.customer.pincode}
                        </p>
                      </div>

                      <ul className="mt-3 space-y-1.5 border-t border-plum/8 pt-3">
                        {order.items.map((item) => (
                          <li
                            key={`${order.id}-${item.productId}`}
                            className="flex items-center justify-between gap-2 text-sm"
                          >
                            <span className="min-w-0 truncate text-plum">
                              {item.name}{' '}
                              <span className="text-plum-soft">
                                × {item.quantity} · {item.weight}
                              </span>
                            </span>
                            <span className="shrink-0 font-display text-sm font-semibold text-plum">
                              {formatINR(item.lineTotal)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-3 flex items-center justify-between border-t border-plum/8 pt-3">
                        <span className="text-xs text-plum-soft">{order.note}</span>
                        <span className="font-display text-base font-semibold text-plum">
                          {formatINR(order.total)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
