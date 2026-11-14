import { products as staticProducts, type Product } from '../data/products'
import { loadCustomProducts } from './customProducts'
import {
  loadDiscountOverrides,
  type DiscountOverrides,
} from './productDiscount'
import { clampDiscountPercent } from './productPricing'

export const PRODUCT_ACTIVE_STORAGE_KEY = 'motumo-product-active'
export const ADMIN_UNLOCK_STORAGE_KEY = 'motumo-admin-unlocked'
export const ADMIN_PASSWORD = 'motumo-admin'

export type ActiveFlags = Record<string, boolean>

export function loadActiveFlags(): ActiveFlags {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(PRODUCT_ACTIVE_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const flags: ActiveFlags = {}
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === 'boolean') flags[id] = value
    }
    return flags
  } catch {
    return {}
  }
}

export function saveActiveFlags(flags: ActiveFlags) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PRODUCT_ACTIVE_STORAGE_KEY, JSON.stringify(flags))
}

/** Static seed catalog + admin-created products, with active + discount overrides applied. */
export function mergeProductsWithFlags(
  flags: ActiveFlags,
  customProducts: Product[] = loadCustomProducts(),
  discounts: DiscountOverrides = loadDiscountOverrides(),
): Product[] {
  const catalog = [...staticProducts, ...customProducts]
  return catalog.map((product) => {
    const override = discounts[product.id]
    return {
      ...product,
      active: flags[product.id] ?? product.active,
      discountEnabled: override?.enabled ?? product.discountEnabled ?? false,
      discountPercent: clampDiscountPercent(
        override?.percent ?? product.discountPercent ?? 0,
      ),
    }
  })
}

export function isAdminUnlocked(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(ADMIN_UNLOCK_STORAGE_KEY) === '1'
}

export function setAdminUnlocked(unlocked: boolean) {
  if (typeof window === 'undefined') return
  if (unlocked) {
    window.localStorage.setItem(ADMIN_UNLOCK_STORAGE_KEY, '1')
  } else {
    window.localStorage.removeItem(ADMIN_UNLOCK_STORAGE_KEY)
  }
}
