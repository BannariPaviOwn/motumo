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
  imageFilter?: string
  highlights: string[]
}

export const products: Product[] = [
  {
    id: 'choco-millet-delight',
    name: 'Choco Millet Delight',
    tagline: 'Millet chocolate spread for everyday joy',
    weight: '160g',
    price: 249,
    compareAt: 299,
    badge: 'Bestseller',
    description:
      'A smooth chocolate spread made with millets and 9 nourishing grains. Rich taste kids love — wholesome goodness parents trust.',
    image: '/assets/choco-millet-delight.png',
    highlights: ['Made with 9 grains', 'No artificial colours', 'Safe for kids'],
  },
  {
    id: 'millet-cocoa-crunch',
    name: 'Millet Cocoa Crunch',
    tagline: 'Crunchy millet bites in cocoa bliss',
    weight: '180g',
    price: 269,
    badge: 'New',
    description:
      'Crunchy millet kernels folded into a cocoa-rich spread — perfect for toast, pancakes, and after-school energy.',
    image: '/assets/choco-millet-delight.png',
    imageFilter: 'hue-rotate(-18deg) saturate(1.05)',
    highlights: ['Rich in millets', 'Source of energy', 'Natural ingredients'],
  },
  {
    id: 'family-delight-duo',
    name: 'Family Delight Duo',
    tagline: 'Two jars. Double the smiles.',
    weight: '160g × 2',
    price: 449,
    compareAt: 498,
    badge: 'Value pack',
    description:
      'A shareable duo of Choco Millet Delight — ideal for family breakfasts, gifting, and stocking the pantry with wholesome chocolate joy.',
    image: '/assets/choco-millet-delight.png',
    imageFilter: 'saturate(1.1) brightness(1.03)',
    highlights: ['No preservatives', 'Supports healthy growth', 'Nourish naturally'],
  },
]

export const benefits = [
  {
    title: 'Rich in Millets',
    description: 'Ancient grains for modern breakfasts.',
    accent: '#6fbf4a',
    icon: 'leaf' as const,
  },
  {
    title: 'Source of Energy',
    description: 'Fuel for school, play, and busy days.',
    accent: '#f0a04b',
    icon: 'zap' as const,
  },
  {
    title: 'Supports Healthy Growth',
    description: 'Wholesome nutrition in every spoon.',
    accent: '#e86b9a',
    icon: 'heart' as const,
  },
  {
    title: 'No Artificial Colours',
    description: 'Clean ingredients you can trust.',
    accent: '#5b9bd5',
    icon: 'sparkles' as const,
  },
]

export const trustPoints = [
  { label: 'Natural Ingredients', icon: 'leaf' as const },
  { label: 'Made with Millets', icon: 'wheat' as const },
  { label: 'No Preservatives', icon: 'shield' as const },
  { label: 'Safe for Kids', icon: 'heart' as const },
]

export const waysToEnjoy = [
  {
    title: 'Spread on Bread',
    subtitle: 'Toast, banana & delight',
    tone: 'from-[#8b5e4a] to-[#5c3a2e]',
    icon: 'bread' as const,
  },
  {
    title: 'With Pancake',
    subtitle: 'Smiles on every stack',
    tone: 'from-[#f0a04b] to-[#d4782a]',
    icon: 'pancake' as const,
  },
  {
    title: 'Mix with Milk',
    subtitle: 'Creamy millet cocoa sip',
    tone: 'from-[#6b4588] to-[#4a2c6a]',
    icon: 'milk' as const,
  },
  {
    title: 'With Fruits',
    subtitle: 'Berry bowls & bananas',
    tone: 'from-[#e86b9a] to-[#c44d78]',
    icon: 'fruit' as const,
  },
  {
    title: 'With Oats',
    subtitle: 'Warm bowls, big nutrition',
    tone: 'from-[#6fbf4a] to-[#4a9a2e]',
    icon: 'oats' as const,
  },
]
