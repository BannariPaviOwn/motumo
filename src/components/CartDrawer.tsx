import { Minus, Plus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, setQuantity, subtotal } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart overlay"
            className="fixed inset-0 z-[60] bg-plum-deep/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-plum/10 px-5 py-4">
              <h2 className="font-display text-xl font-semibold text-plum">Your cart</h2>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-plum ring-1 ring-plum/10"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-lg font-semibold text-plum">Cart is empty</p>
                  <p className="mt-2 max-w-xs text-sm text-plum-soft">
                    Add Choco Millet Delight and bring millet chocolate joy home.
                  </p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-motumo-red px-5 py-2.5 font-display text-sm font-semibold text-white"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-plum/8"
                    >
                      <img
                        src={product.image}
                        alt=""
                        className="h-20 w-20 rounded-xl bg-lavender-100 object-contain p-1"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-sm font-semibold text-plum">
                              {product.name}
                            </p>
                            <p className="text-xs text-plum-soft">{product.weight}</p>
                          </div>
                          <button
                            type="button"
                            className="text-xs font-semibold text-motumo-red"
                            onClick={() => removeItem(product.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center gap-2 rounded-full bg-lavender-100 px-2 py-1">
                            <button
                              type="button"
                              className="rounded-full p-1 text-plum"
                              aria-label="Decrease quantity"
                              onClick={() => setQuantity(product.id, quantity - 1)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-5 text-center font-display text-sm font-semibold">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              className="rounded-full p-1 text-plum"
                              aria-label="Increase quantity"
                              onClick={() => setQuantity(product.id, quantity + 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="font-display text-sm font-semibold text-plum">
                            {formatINR(product.price * quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-plum/10 bg-white px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-plum-soft">Subtotal</span>
                  <span className="font-display text-xl font-semibold text-plum">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-full bg-motumo-red py-3.5 font-display text-sm font-semibold text-white"
                >
                  Checkout (demo)
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
