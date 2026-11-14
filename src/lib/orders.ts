import type { CartItem } from '../context/CartContext'
import { getEffectivePrice } from './productPricing'

export const ORDERS_STORAGE_KEY = 'motumo-test-orders'

export type OrderCustomer = {
  name: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

export type OrderLineItem = {
  productId: string
  name: string
  weight: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export type PaymentProvider = 'razorpay' | 'simulated'

export type TestOrder = {
  id: string
  createdAt: string
  status: 'paid-test' | 'paid'
  paymentMethod: 'test' | 'razorpay'
  paymentProvider: PaymentProvider
  customer: OrderCustomer
  items: OrderLineItem[]
  subtotal: number
  total: number
  note: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
}

export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function createOrderId() {
  const stamp = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `MTM-TEST-${stamp}-${rand}`
}

export function cartItemsToOrderLines(items: CartItem[]): OrderLineItem[] {
  return items.map(({ product, quantity }) => {
    const unitPrice = getEffectivePrice(product)
    return {
      productId: product.id,
      name: product.name,
      weight: product.weight,
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    }
  })
}

function normalizeOrder(raw: unknown): TestOrder | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Partial<TestOrder>
  if (typeof o.id !== 'string' || !o.customer || !Array.isArray(o.items)) return null

  const paymentProvider: PaymentProvider =
    o.paymentProvider === 'razorpay' || o.paymentMethod === 'razorpay'
      ? 'razorpay'
      : 'simulated'

  return {
    id: o.id,
    createdAt: typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString(),
    status: o.status === 'paid' ? 'paid' : 'paid-test',
    paymentMethod: paymentProvider === 'razorpay' ? 'razorpay' : 'test',
    paymentProvider,
    customer: o.customer,
    items: o.items,
    subtotal: Number(o.subtotal) || 0,
    total: Number(o.total) || 0,
    note: typeof o.note === 'string' ? o.note : '',
    razorpayOrderId: o.razorpayOrderId,
    razorpayPaymentId: o.razorpayPaymentId,
    razorpaySignature: o.razorpaySignature,
  }
}

export function loadOrdersFromStorage(): TestOrder[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeOrder).filter((o): o is TestOrder => Boolean(o))
  } catch {
    return []
  }
}

export function saveOrdersToStorage(orders: TestOrder[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

export function downloadOrdersJson(orders: TestOrder[]) {
  const blob = new Blob([JSON.stringify(orders, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `motumo-test-orders-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
