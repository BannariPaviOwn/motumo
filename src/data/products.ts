import { assets } from '../lib/assets'

/** Catalog / admin category ids stored on each product. */
export const PRODUCT_CATEGORIES = [
  { id: 'spreads', label: 'Spreads' },
  { id: 'millets', label: 'Millets' },
  { id: 'combos', label: 'Combos' },
  { id: 'gift-packs', label: 'Gift Packs' },
  { id: 'limited', label: 'Limited' },
  { id: 'other', label: 'Other' },
] as const

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]['id']

export type Product = {
  id: string
  name: string
  tagline: string
  weight: string
  price: number
  compareAt?: number
  badge?: string
  description: string
  image: string
  accent: string
  highlights: string[]
  /** Shop / admin category (seed + custom). */
  category: ProductCategoryId
  /** Free-text label when category is `other`. */
  categoryLabel?: string
  /** When true, apply discountPercent to `price` for the effective selling price. */
  discountEnabled: boolean
  /** Percent off (1–100) applied when discountEnabled. */
  discountPercent: number
  /** Whether the SKU is shown on the public shop. Overridable via admin/localStorage. */
  active: boolean
}

export function getCategoryLabel(product: Pick<Product, 'category' | 'categoryLabel'>): string {
  if (product.category === 'other' && product.categoryLabel?.trim()) {
    return product.categoryLabel.trim()
  }
  return (
    PRODUCT_CATEGORIES.find((c) => c.id === product.category)?.label ?? 'Other'
  )
}

export const products: Product[] = [
  {
    id: 'almond-spread-delight',
    name: 'Almond Spread Delight',
    tagline: 'Roasted almond + cocoa goodness',
    weight: '200g',
    price: 299,
    compareAt: 349,
    badge: 'Bestseller',
    description:
      'Creamy roasted almond spread with cocoa — rich in protein and fiber, 100% gluten free, and made with unrefined sugar. No preservatives.',
    image: assets.products.almondSpread,
    accent: '#c8e86a',
    highlights: ['Rich in protein', 'Rich in fiber', '100% gluten free'],
    category: 'spreads',
    discountEnabled: false,
    discountPercent: 0,
    active: true,
  },
  {
    id: 'peanut-spread-delight',
    name: 'Peanut Spread Delight',
    tagline: 'Golden peanut bliss in every spoon',
    weight: '200g',
    price: 279,
    compareAt: 329,
    badge: 'New',
    description:
      'Roasted peanut spread with cocoa butter and unrefined sugar — a playful, protein-packed jar for toast, fruit, and after-school energy.',
    image: assets.products.peanutSpread,
    accent: '#ffd54a',
    highlights: ['Rich in protein', 'No preservatives', 'Safe for kids'],
    category: 'spreads',
    discountEnabled: false,
    discountPercent: 0,
    active: true,
  },
  {
    id: 'hazelnut-spread-delight',
    name: 'Hazelnut Spread Delight',
    tagline: 'Smooth hazelnut chocolate delight',
    weight: '200g',
    price: 319,
    compareAt: 369,
    badge: 'Fan favourite',
    description:
      'Silky hazelnut spread with premium cocoa — gluten free, rich in plant protein and fiber, perfect for pancakes and late-night spoons.',
    image: assets.products.hazelnutSpread,
    accent: '#6b3a2e',
    highlights: ['Rich in protein', 'Rich in fiber', '100% gluten free'],
    category: 'spreads',
    discountEnabled: false,
    discountPercent: 0,
    active: true,
  },
  {
    id: 'choco-millet-delight',
    name: 'Choco Millet Delight',
    tagline: 'Millet chocolate spread for everyday joy',
    weight: '160g',
    price: 249,
    compareAt: 299,
    badge: 'Millet hero',
    description:
      'A smooth chocolate spread made with millets and 9 nourishing grains. Rich taste kids love — wholesome goodness parents trust.',
    image: assets.products.chocoMilletDelight,
    accent: '#5b2b82',
    highlights: ['Made with 9 grains', 'No artificial colours', 'Safe for kids'],
    category: 'spreads',
    discountEnabled: false,
    discountPercent: 0,
    active: true,
  },
  {
    id: 'choco-millet-fills',
    name: 'Choco Millet Fills',
    tagline: 'Crunchy millet cereal with cocoa bliss',
    weight: '250g',
    price: 279,
    badge: 'Crunchy',
    description:
      'Crunchy chocolate pillow cereal made with ragi, jowar and foxtail millets — balanced and tasty with milk or straight from the pack.',
    image: assets.products.chocoMilletFillsBag,
    accent: '#e31c23',
    highlights: ['Good source of protein', 'Ragi, jowar & foxtail', 'Crunchy fills'],
    category: 'millets',
    discountEnabled: false,
    discountPercent: 0,
    active: true,
  },
  {
    id: 'family-delight-duo',
    name: 'Family Delight Duo',
    tagline: 'Two jars. Double the smiles.',
    weight: '200g × 2',
    price: 549,
    compareAt: 598,
    badge: 'Value pack',
    description:
      'Pick any two Motumo delight jars — ideal for family breakfasts, gifting, and stocking the pantry with wholesome chocolate joy.',
    image: assets.promo.productShowcaseLavender,
    accent: '#ffd54a',
    highlights: ['No preservatives', 'Supports healthy growth', 'Nourish naturally'],
    category: 'combos',
    discountEnabled: false,
    discountPercent: 0,
    active: true,
  },
]

/** Shop filter tabs (includes All). */
export const categories = [
  { id: 'all', label: 'All' },
  ...PRODUCT_CATEGORIES.filter((c) => c.id !== 'other'),
  { id: 'other', label: 'Other' },
] as const

export const benefits = [
  {
    title: 'Rich in Protein',
    description: 'Plant protein from nuts and millets for growing energy.',
    accent: '#e31c23',
    icon: 'zap' as const,
  },
  {
    title: 'Rich in Fiber',
    description: 'Everyday fiber that keeps snack time wholesome.',
    accent: '#5b2b82',
    icon: 'heart' as const,
  },
  {
    title: '100% Gluten Free',
    description: 'Clean jars families can reach for with confidence.',
    accent: '#f5b800',
    icon: 'sparkles' as const,
  },
  {
    title: 'No Preservatives',
    description: 'Real ingredients. No artificial colours. Just delight.',
    accent: '#6fbf4a',
    icon: 'leaf' as const,
  },
]

export const trustPoints = [
  { label: 'Natural Ingredients', icon: 'leaf' as const },
  { label: 'Rich in Protein', icon: 'zap' as const },
  { label: 'No Preservatives', icon: 'shield' as const },
  { label: 'Safe for Kids', icon: 'heart' as const },
]

export const waysToEnjoy = [
  {
    title: 'Spread on Bread',
    subtitle: 'Toast, banana & delight',
    tone: 'from-motumo-red to-motumo-red-deep',
    icon: 'bread' as const,
  },
  {
    title: 'With Pancake',
    subtitle: 'Smiles on every stack',
    tone: 'from-motumo-yellow to-motumo-yellow-deep',
    icon: 'pancake' as const,
  },
  {
    title: 'With Fruits',
    subtitle: 'Berry bowls & bananas',
    tone: 'from-plum to-plum-deep',
    icon: 'fruit' as const,
  },
  {
    title: 'Mix with Milk',
    subtitle: 'Creamy cocoa sip',
    tone: 'from-plum-soft to-plum',
    icon: 'milk' as const,
  },
  {
    title: 'With Oats',
    subtitle: 'Warm bowls, big nutrition',
    tone: 'from-motumo-yellow-deep to-motumo-red',
    icon: 'oats' as const,
  },
]

export const reviews = [
  {
    quote:
      'Almond Spread Delight is our after-school ritual now — creamy, wholesome, and the kids ask for seconds.',
    name: 'Ananya R.',
    role: 'Mother of two',
  },
  {
    quote:
      'Finally a peanut spread that feels playful and clean. Motumo jars disappear faster than I can restock.',
    name: 'Karthik M.',
    role: 'Busy parent',
  },
  {
    quote:
      'Hazelnut Delight on pancakes is weekend magic. The tiger on the jar seals the deal for my daughter.',
    name: 'Priya S.',
    role: 'Food lover',
  },
]
