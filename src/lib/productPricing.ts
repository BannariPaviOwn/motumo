import type { Product } from '../data/products'

export const MIN_DISCOUNT_PERCENT = 1
export const MAX_DISCOUNT_PERCENT = 90

export function clampDiscountPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(MAX_DISCOUNT_PERCENT, Math.max(0, Math.round(value)))
}

/** Selling price after optional percent discount. */
export function getEffectivePrice(product: Pick<Product, 'price' | 'discountEnabled' | 'discountPercent'>): number {
  if (!product.discountEnabled) return product.price
  const percent = clampDiscountPercent(product.discountPercent)
  if (percent <= 0) return product.price
  return Math.max(1, Math.round(product.price * (1 - percent / 100)))
}

/** True when a percent discount is active and changes the price. */
export function hasActiveDiscount(
  product: Pick<Product, 'price' | 'discountEnabled' | 'discountPercent'>,
): boolean {
  return (
    product.discountEnabled &&
    clampDiscountPercent(product.discountPercent) > 0 &&
    getEffectivePrice(product) < product.price
  )
}

export function getDiscountBadgePercent(
  product: Pick<Product, 'discountEnabled' | 'discountPercent'>,
): number | null {
  if (!product.discountEnabled) return null
  const percent = clampDiscountPercent(product.discountPercent)
  return percent > 0 ? percent : null
}
