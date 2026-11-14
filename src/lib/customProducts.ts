import { assets } from './assets'
import {
  PRODUCT_CATEGORIES,
  type Product,
  type ProductCategoryId,
} from '../data/products'

export const CUSTOM_PRODUCTS_STORAGE_KEY = 'motumo-custom-products'

export const DEFAULT_CUSTOM_PRODUCT_IMAGE = assets.products.almondSpread
export const DEFAULT_CUSTOM_PRODUCT_ACCENT = '#c8e86a'

/** Soft cap after compression — localStorage has limited space. */
export const MAX_PRODUCT_IMAGE_BYTES = 900_000
export const MAX_IMAGE_DIMENSION = 900
export const IMAGE_JPEG_QUALITY = 0.78

export type NewProductInput = {
  name: string
  price: number
  description?: string
  image?: string
  weight?: string
  category: ProductCategoryId
  categoryLabel?: string
  discountEnabled?: boolean
  discountPercent?: number
}

const CATEGORY_IDS = new Set<string>(PRODUCT_CATEGORIES.map((c) => c.id))

function normalizeCategory(value: unknown): ProductCategoryId {
  if (typeof value === 'string' && CATEGORY_IDS.has(value)) {
    return value as ProductCategoryId
  }
  return 'other'
}

function isProductLike(value: unknown): value is Product {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const p = value as Record<string, unknown>
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.tagline === 'string' &&
    typeof p.weight === 'string' &&
    typeof p.price === 'number' &&
    typeof p.description === 'string' &&
    typeof p.image === 'string' &&
    typeof p.accent === 'string' &&
    Array.isArray(p.highlights) &&
    typeof p.active === 'boolean'
  )
}

function normalizeStoredProduct(raw: Product): Product {
  const category = normalizeCategory(raw.category)
  const categoryLabel =
    typeof raw.categoryLabel === 'string' && raw.categoryLabel.trim()
      ? raw.categoryLabel.trim()
      : undefined
  const discountEnabled = Boolean(raw.discountEnabled)
  const discountPercent =
    typeof raw.discountPercent === 'number' && Number.isFinite(raw.discountPercent)
      ? Math.max(0, Math.min(100, Math.round(raw.discountPercent)))
      : 0
  return {
    ...raw,
    category,
    discountEnabled,
    discountPercent,
    ...(category === 'other' && categoryLabel ? { categoryLabel } : {}),
  }
}

export function isCustomProductId(id: string): boolean {
  return id.startsWith('custom-')
}

export function loadCustomProducts(): Product[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CUSTOM_PRODUCTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(
        (item): item is Product => isProductLike(item) && isCustomProductId(item.id),
      )
      .map(normalizeStoredProduct)
  } catch {
    return []
  }
}

export function saveCustomProducts(products: Product[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CUSTOM_PRODUCTS_STORAGE_KEY, JSON.stringify(products))
}

function approximateDataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',')
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
  return Math.ceil((base64.length * 3) / 4)
}

/**
 * Read an image file, resize/compress to a JPEG data URL suitable for localStorage.
 */
export async function fileToProductImageDataUrl(
  file: File,
): Promise<{ dataUrl: string } | { error: string }> {
  if (!file.type.startsWith('image/')) {
    return { error: 'Please choose an image file (JPG, PNG, WebP, etc.).' }
  }

  // Hard reject enormous source files before decoding
  if (file.size > 12 * 1024 * 1024) {
    return { error: 'Image is too large (max 12 MB before compress). Try a smaller photo.' }
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Could not read image'))
      el.src = objectUrl
    })

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height))
    const width = Math.max(1, Math.round(img.width * scale))
    const height = Math.max(1, Math.round(img.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return { error: 'Could not process image in this browser.' }
    ctx.drawImage(img, 0, 0, width, height)

    let quality = IMAGE_JPEG_QUALITY
    let dataUrl = canvas.toDataURL('image/jpeg', quality)
    while (approximateDataUrlBytes(dataUrl) > MAX_PRODUCT_IMAGE_BYTES && quality > 0.45) {
      quality -= 0.08
      dataUrl = canvas.toDataURL('image/jpeg', quality)
    }

    if (approximateDataUrlBytes(dataUrl) > MAX_PRODUCT_IMAGE_BYTES) {
      return {
        error:
          'Photo is still too large after compress (~900 KB limit for localStorage). Try a simpler image.',
      }
    }

    return { dataUrl }
  } catch {
    return { error: 'Could not process that image. Try another file.' }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function createCustomProduct(input: NewProductInput): Product {
  const name = input.name.trim()
  const short = (input.description ?? '').trim()
  const weight = (input.weight ?? '').trim() || '200g'
  const image = (input.image ?? '').trim() || DEFAULT_CUSTOM_PRODUCT_IMAGE
  const category = normalizeCategory(input.category)
  const categoryLabel =
    category === 'other' && input.categoryLabel?.trim()
      ? input.categoryLabel.trim()
      : undefined
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `custom-${crypto.randomUUID()}`
      : `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  const discountEnabled = Boolean(input.discountEnabled)
  const discountPercent =
    discountEnabled && typeof input.discountPercent === 'number'
      ? Math.max(0, Math.min(90, Math.round(input.discountPercent)))
      : 0

  return {
    id,
    name,
    tagline: short || 'New Motumo delight',
    weight,
    price: input.price,
    description: short || `${name} — crafted for everyday Motumo moments.`,
    image,
    accent: DEFAULT_CUSTOM_PRODUCT_ACCENT,
    highlights: ['Motumo delight', 'Shop favourite'],
    badge: 'New',
    category,
    ...(categoryLabel ? { categoryLabel } : {}),
    discountEnabled,
    discountPercent,
    active: true,
  }
}
