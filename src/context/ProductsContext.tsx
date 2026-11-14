import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../data/products'
import {
  createCustomProduct,
  isCustomProductId,
  loadCustomProducts,
  saveCustomProducts,
  type NewProductInput,
} from '../lib/customProducts'
import {
  loadDiscountOverrides,
  saveDiscountOverrides,
  type DiscountOverrides,
} from '../lib/productDiscount'
import {
  loadActiveFlags,
  mergeProductsWithFlags,
  saveActiveFlags,
  type ActiveFlags,
} from '../lib/productActive'
import { clampDiscountPercent } from '../lib/productPricing'

type ProductsContextValue = {
  /** All catalog products with active flags merged from localStorage */
  products: Product[]
  /** Products currently shown on the public shop */
  activeProducts: Product[]
  setProductActive: (id: string, active: boolean) => void
  setProductDiscount: (id: string, enabled: boolean, percent: number) => void
  isProductActive: (id: string) => boolean
  getProduct: (id: string) => Product | undefined
  addProduct: (input: NewProductInput) => Product | null
  deleteCustomProduct: (id: string) => boolean
  isCustomProduct: (id: string) => boolean
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<ActiveFlags>(() => loadActiveFlags())
  const [customProducts, setCustomProducts] = useState<Product[]>(() => loadCustomProducts())
  const [discounts, setDiscounts] = useState<DiscountOverrides>(() => loadDiscountOverrides())

  const products = useMemo(
    () => mergeProductsWithFlags(flags, customProducts, discounts),
    [flags, customProducts, discounts],
  )

  const activeProducts = useMemo(
    () => products.filter((product) => product.active),
    [products],
  )

  const setProductActive = useCallback((id: string, active: boolean) => {
    setFlags((prev) => {
      const next = { ...prev, [id]: active }
      saveActiveFlags(next)
      return next
    })
  }, [])

  const setProductDiscount = useCallback((id: string, enabled: boolean, percent: number) => {
    const nextPercent = enabled ? clampDiscountPercent(percent) : 0
    setDiscounts((prev) => {
      const next = { ...prev, [id]: { enabled, percent: nextPercent } }
      saveDiscountOverrides(next)
      return next
    })
    // Keep custom product records in sync so delete/reload stays consistent
    if (isCustomProductId(id)) {
      setCustomProducts((prev) => {
        const next = prev.map((p) =>
          p.id === id
            ? { ...p, discountEnabled: enabled, discountPercent: nextPercent }
            : p,
        )
        saveCustomProducts(next)
        return next
      })
    }
  }, [])

  const isProductActive = useCallback(
    (id: string) => products.find((p) => p.id === id)?.active ?? false,
    [products],
  )

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const addProduct = useCallback((input: NewProductInput): Product | null => {
    const name = input.name.trim()
    if (!name || !Number.isFinite(input.price) || input.price <= 0) return null
    if (!input.category) return null

    const product = createCustomProduct({
      ...input,
      name,
      price: Math.round(input.price),
    })

    setCustomProducts((prev) => {
      const next = [...prev, product]
      saveCustomProducts(next)
      return next
    })
    setFlags((prev) => {
      const next = { ...prev, [product.id]: true }
      saveActiveFlags(next)
      return next
    })
    setDiscounts((prev) => {
      const next = {
        ...prev,
        [product.id]: {
          enabled: product.discountEnabled,
          percent: product.discountPercent,
        },
      }
      saveDiscountOverrides(next)
      return next
    })
    return product
  }, [])

  const deleteCustomProduct = useCallback((id: string): boolean => {
    if (!isCustomProductId(id)) return false

    setCustomProducts((prev) => {
      if (!prev.some((p) => p.id === id)) return prev
      const next = prev.filter((p) => p.id !== id)
      saveCustomProducts(next)
      return next
    })
    setFlags((prev) => {
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      saveActiveFlags(next)
      return next
    })
    setDiscounts((prev) => {
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      saveDiscountOverrides(next)
      return next
    })
    return true
  }, [])

  const isCustomProduct = useCallback((id: string) => isCustomProductId(id), [])

  const value = useMemo(
    () => ({
      products,
      activeProducts,
      setProductActive,
      setProductDiscount,
      isProductActive,
      getProduct,
      addProduct,
      deleteCustomProduct,
      isCustomProduct,
    }),
    [
      products,
      activeProducts,
      setProductActive,
      setProductDiscount,
      isProductActive,
      getProduct,
      addProduct,
      deleteCustomProduct,
      isCustomProduct,
    ],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
