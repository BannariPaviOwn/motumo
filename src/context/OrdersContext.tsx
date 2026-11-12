import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  downloadOrdersJson,
  loadOrdersFromStorage,
  saveOrdersToStorage,
  type TestOrder,
} from '../lib/orders'

type OrdersContextValue = {
  orders: TestOrder[]
  isCheckoutOpen: boolean
  isOrdersPanelOpen: boolean
  lastPlacedOrderId: string | null
  openCheckout: () => void
  closeCheckout: () => void
  openOrdersPanel: () => void
  closeOrdersPanel: () => void
  placeTestOrder: (order: TestOrder) => void
  clearOrders: () => void
  exportOrders: () => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<TestOrder[]>(() => loadOrdersFromStorage())
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isOrdersPanelOpen, setIsOrdersPanelOpen] = useState(false)
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null)

  const openCheckout = useCallback(() => setIsCheckoutOpen(true), [])
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), [])
  const openOrdersPanel = useCallback(() => setIsOrdersPanelOpen(true), [])
  const closeOrdersPanel = useCallback(() => setIsOrdersPanelOpen(false), [])

  const placeTestOrder = useCallback((order: TestOrder) => {
    setOrders((prev) => {
      const next = [order, ...prev]
      saveOrdersToStorage(next)
      return next
    })
    setLastPlacedOrderId(order.id)
  }, [])

  const clearOrders = useCallback(() => {
    setOrders([])
    saveOrdersToStorage([])
    setLastPlacedOrderId(null)
  }, [])

  const exportOrders = useCallback(() => {
    downloadOrdersJson(orders)
  }, [orders])

  const value = useMemo(
    () => ({
      orders,
      isCheckoutOpen,
      isOrdersPanelOpen,
      lastPlacedOrderId,
      openCheckout,
      closeCheckout,
      openOrdersPanel,
      closeOrdersPanel,
      placeTestOrder,
      clearOrders,
      exportOrders,
    }),
    [
      orders,
      isCheckoutOpen,
      isOrdersPanelOpen,
      lastPlacedOrderId,
      openCheckout,
      closeCheckout,
      openOrdersPanel,
      closeOrdersPanel,
      placeTestOrder,
      clearOrders,
      exportOrders,
    ],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
