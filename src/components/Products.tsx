import { motion } from 'framer-motion'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
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

  return (
    <section
      id="shop"
      className="leaf-pattern tiger-watermark relative overflow-hidden py-16 sm:py-20"
      aria-labelledby="shop-heading"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-script text-2xl text-choco-soft">Shop Motumo</p>
            <h2
              id="shop-heading"
              className="font-display text-3xl font-semibold text-plum sm:text-4xl"
            >
              Millet chocolate spreads
            </h2>
            <p className="mt-2 max-w-xl text-plum-soft">
              Start with Choco Millet Delight — then try crunchy Choco Millet
              Fills and our family-ready duo packs.
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

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_16px_50px_-28px_rgba(74,44,106,0.5)] ring-1 ring-plum/10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <div className="relative overflow-hidden bg-gradient-to-b from-lavender-100 to-lavender-200 px-4 pt-6">
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 rounded-full bg-motumo-red px-3 py-1 font-display text-[11px] font-semibold tracking-wide text-white uppercase">
                    {product.badge}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="mx-auto h-56 w-auto object-contain transition duration-500 group-hover:scale-[1.04] sm:h-64"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="font-display text-xs font-semibold tracking-[0.14em] text-plum-soft uppercase">
                  {product.weight}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-plum">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-plum-soft">{product.tagline}</p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {product.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full bg-lavender-100 px-2.5 py-1 text-[11px] font-semibold text-plum"
                    >
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <div>
                    <p className="font-display text-2xl font-semibold text-plum">
                      {formatINR(product.price)}
                    </p>
                    {product.compareAt && (
                      <p className="text-sm text-plum-soft line-through">
                        {formatINR(product.compareAt)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem(product.id)}
                    className="rounded-2xl bg-plum px-4 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-motumo-red"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
