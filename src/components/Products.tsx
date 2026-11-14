import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { categories, getCategoryLabel } from '../data/products'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import {
  getDiscountBadgePercent,
  getEffectivePrice,
  hasActiveDiscount,
} from '../lib/productPricing'
import { TigerMascot } from './TigerMascot'

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function Products() {
  const { addItem } = useCart()
  const { activeProducts } = useProducts()
  const [category, setCategory] = useState<(typeof categories)[number]['id']>('all')

  const visible = useMemo(
    () =>
      activeProducts.filter((p) =>
        category === 'all' ? true : p.category === category,
      ),
    [activeProducts, category],
  )

  return (
    <>
      <section
        id="new"
        className="bg-plum py-10 text-white sm:py-12"
        aria-labelledby="new-heading"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-motumo-yellow uppercase">
              New launches
            </p>
            <h2 id="new-heading" className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
              Almond · Peanut · Hazelnut
            </h2>
            <p className="mt-2 max-w-xl text-sm text-lavender-200">
              Three new delight jars — roasted nuts, cocoa, unrefined sugar. Rich in protein &amp; fiber.
            </p>
          </div>
          <a
            href="#shop"
            className="inline-flex rounded-full bg-motumo-yellow px-5 py-2.5 font-display text-sm font-bold text-plum-deep transition hover:bg-white"
          >
            Shop spreads
          </a>
        </div>
      </section>

      <section
        id="shop"
        className="tiger-watermark relative overflow-hidden bg-cream py-16 sm:py-20"
        aria-labelledby="shop-heading"
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-script text-2xl text-motumo-red">Shop Motumo</p>
              <h2
                id="shop-heading"
                className="font-display text-3xl font-semibold text-plum sm:text-4xl"
              >
                Bestsellers &amp; new launches
              </h2>
              <p className="mt-2 max-w-xl text-plum-soft">
                Guilt-free spreads and millet treats — playful for kids, reassuring for parents.
              </p>
            </div>
            <TigerMascot
              variant="float"
              size="md"
              peekIn
              className="mx-auto hidden shrink-0 sm:mx-0 md:block"
              alt="Motumo tiger says shop the spreads"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Product categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={category === cat.id}
                onClick={() => setCategory(cat.id)}
                className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition ${
                  category === cat.id
                    ? 'bg-motumo-red text-white shadow-[0_8px_20px_-10px_rgba(227,28,35,0.7)]'
                    : 'bg-white text-plum ring-1 ring-plum/10 hover:bg-motumo-yellow/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.length === 0 && (
              <p className="col-span-full rounded-[1.25rem] bg-white/80 px-5 py-8 text-center text-sm text-plum-soft ring-1 ring-plum/8">
                No products are active in this category right now.
              </p>
            )}
            {visible.map((product, index) => {
              const discounted = hasActiveDiscount(product)
              const effective = getEffectivePrice(product)
              const badgePercent = getDiscountBadgePercent(product)
              return (
                <motion.article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_14px_40px_-24px_rgba(61,26,92,0.45)] ring-1 ring-plum/8 transition hover:-translate-y-1 hover:shadow-[0_22px_50px_-22px_rgba(61,26,92,0.5)]"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05, duration: 0.45 }}
                >
                  <div
                    className="relative overflow-hidden px-4 pt-6 pb-2"
                    style={{
                      background: `linear-gradient(180deg, ${product.accent}33 0%, #fff8e8 100%)`,
                    }}
                  >
                    {product.badge && (
                      <span className="absolute top-4 left-4 z-10 rounded-full bg-motumo-red px-3 py-1 font-display text-[11px] font-semibold tracking-wide text-white uppercase">
                        {product.badge}
                      </span>
                    )}
                    {badgePercent != null && (
                      <span className="absolute top-4 right-4 z-10 rounded-full bg-motumo-yellow px-2.5 py-1 font-display text-[11px] font-bold text-plum-deep">
                        {badgePercent}% OFF
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mx-auto h-52 w-auto object-contain transition duration-500 group-hover:scale-[1.05] sm:h-60"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-xs font-semibold tracking-[0.14em] text-plum-soft uppercase">
                        {product.weight}
                      </p>
                      <span className="rounded-full bg-lavender-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-plum uppercase">
                        {getCategoryLabel(product)}
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-lg font-semibold text-plum">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-plum-soft">{product.tagline}</p>

                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {product.highlights.slice(0, 2).map((h) => (
                        <li
                          key={h}
                          className="rounded-full bg-lavender-100 px-2.5 py-1 text-[11px] font-semibold text-plum"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="font-display text-xl font-semibold text-plum">
                          {formatINR(effective)}
                        </p>
                        {discounted && (
                          <p className="text-sm text-plum-soft line-through">
                            {formatINR(product.price)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem(product.id)}
                        className="rounded-full bg-plum px-4 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-motumo-red"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
