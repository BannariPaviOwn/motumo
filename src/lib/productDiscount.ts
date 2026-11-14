export const PRODUCT_DISCOUNT_STORAGE_KEY = 'motumo-product-discount'

export type DiscountOverride = {
  enabled: boolean
  percent: number
}

export type DiscountOverrides = Record<string, DiscountOverride>

export function loadDiscountOverrides(): DiscountOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(PRODUCT_DISCOUNT_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const out: DiscountOverrides = {}
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue
      const row = value as Record<string, unknown>
      if (typeof row.enabled !== 'boolean') continue
      const percent = typeof row.percent === 'number' ? row.percent : 0
      out[id] = { enabled: row.enabled, percent }
    }
    return out
  } catch {
    return {}
  }
}

export function saveDiscountOverrides(overrides: DiscountOverrides) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PRODUCT_DISCOUNT_STORAGE_KEY, JSON.stringify(overrides))
}
