import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../data/products'
import { getEffectivePrice } from '../lib/productPricing'
import { playTigerCheer } from '../lib/tigerCheer'
import { useProducts } from './ProductsContext'

export type CartItem = {
  product: Product
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  /** Increments on each add — drives tiger cheer UI */
  cheerId: number
  openCart: () => void
  closeCart: () => void
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { getProduct, isProductActive } = useProducts()
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [cheerId, setCheerId] = useState(0)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  // Drop inactive/deleted SKUs and refresh product snapshots (price/discount)
  useEffect(() => {
    setItems((prev) => {
      let changed = false
      const next: CartItem[] = []
      for (const item of prev) {
        const product = getProduct(item.product.id)
        if (!product || !isProductActive(item.product.id)) {
          changed = true
          continue
        }
        if (product !== item.product) {
          changed = true
          next.push({ ...item, product })
        } else {
          next.push(item)
        }
      }
      return changed ? next : prev
    })
  }, [getProduct, isProductActive])

  const addItem = useCallback(
    (productId: string) => {
      const product = getProduct(productId)
      if (!product || !product.active) return

      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === productId)
        if (existing) {
          return prev.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        }
        return [...prev, { product, quantity: 1 }]
      })
      setIsOpen(true)
      setCheerId((n) => n + 1)
      // Click handler = user gesture — audio play() is allowed
      playTigerCheer()
    },
    [getProduct],
  )

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId)
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      )
    })
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
        0,
      ),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      cheerId,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
      cheerId,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
