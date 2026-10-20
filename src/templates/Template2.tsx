import { ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { products, reviews } from '../data/products'
import { assets } from '../lib/assets'
import { useCart } from '../context/CartContext'
import { Logo } from '../components/Logo'

function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

const featured = products.filter((p) =>
  ['almond-spread-delight', 'peanut-spread-delight', 'hazelnut-spread-delight'].includes(p.id),
)

/** Template 2 — premium dark atelier / editorial */
export function Template2() {
  const { itemCount, openCart, addItem } = useCart()

  return (
    <div className="min-h-svh bg-plum-deep text-cream">
      {/* Slim luxury nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-plum-deep/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a href="#atelier-top" aria-label="Motumo home">
            <Logo />
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Atelier">
            {[
              { href: '#collection', label: 'Collection' },
              { href: '#craft', label: 'Craft' },
              { href: '#voices', label: 'Voices' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-display text-xs font-medium tracking-[0.22em] text-cream/70 uppercase transition hover:text-motumo-yellow"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={openCart}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-motumo-yellow/40 px-4 text-motumo-yellow transition hover:bg-motumo-yellow hover:text-plum-deep"
            aria-label={`Open cart, ${itemCount} items`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="font-display text-xs font-semibold tracking-wider uppercase">
              Bag {itemCount > 0 ? `(${itemCount})` : ''}
            </span>
          </button>
        </div>
      </header>

      {/* Editorial hero */}
      <section id="atelier-top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-[70%] w-[55%] bg-[radial-gradient(ellipse_at_top_right,rgba(227,28,35,0.35),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 h-[50%] w-[45%] bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,213,74,0.18),transparent_55%)]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-display text-[11px] font-semibold tracking-[0.35em] text-motumo-yellow uppercase">
              Motumo Atelier · Premium
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.8rem,8vw,5.2rem)] leading-[0.92] font-semibold tracking-tight text-white">
              Crafted
              <br />
              <span className="text-motumo-yellow">delight</span>
              <br />
              for quiet mornings
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-cream/70 sm:text-lg">
              A refined collection of nut &amp; millet spreads — roasted with care, finished with
              cocoa, and presented for families who expect more from every jar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#collection"
                className="inline-flex rounded-full bg-motumo-red px-7 py-3.5 font-display text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-motumo-red-deep"
              >
                Explore collection
              </a>
              <Link
                to="/template3"
                className="inline-flex rounded-full border border-white/25 px-7 py-3.5 font-display text-sm font-semibold tracking-wide text-cream uppercase transition hover:border-motumo-yellow hover:text-motumo-yellow"
              >
                View Maison
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12 }}
          >
            <div className="absolute inset-8 rounded-full bg-motumo-yellow/10 blur-3xl" />
            <img
              src={assets.products.hazelnutSpread}
              alt="Motumo Hazelnut Spread Delight"
              className="relative z-10 max-h-[min(70vh,560px)] w-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
            />
            <img
              src={assets.tiger.sitting}
              alt=""
              className="absolute bottom-6 left-4 z-20 hidden h-28 w-auto mix-blend-screen sm:block lg:left-0"
            />
          </motion.div>
        </div>

        <div className="border-y border-white/10">
          <p className="mx-auto max-w-6xl px-4 py-3 font-display text-[11px] tracking-[0.32em] text-cream/50 uppercase sm:px-6">
            Almond · Peanut · Hazelnut · Millet · Limited edition jars
          </p>
        </div>
      </section>

      {/* Collection runway */}
      <section id="collection" className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-[11px] font-semibold tracking-[0.28em] text-motumo-yellow uppercase">
                The collection
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
                Three signatures
              </h2>
            </div>
            <p className="max-w-sm text-sm text-cream/55">
              Each jar is a quiet luxury — protein-rich, gluten free, and free from preservatives.
            </p>
          </div>

          <div className="mt-14 space-y-6">
            {featured.map((product, index) => (
              <motion.article
                key={product.id}
                className="grid items-center gap-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-[180px_1fr_auto] sm:gap-8 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08 }}
              >
                <div
                  className="flex items-center justify-center rounded-2xl px-3 py-4"
                  style={{ background: `linear-gradient(160deg, ${product.accent}44, transparent)` }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-auto object-contain sm:h-44"
                  />
                </div>
                <div>
                  <p className="font-display text-[11px] tracking-[0.22em] text-motumo-yellow/80 uppercase">
                    0{index + 1} · {product.weight}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/60">
                    {product.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {product.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-cream/75"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold text-motumo-yellow">
                      {formatINR(product.price)}
                    </p>
                    {product.compareAt && (
                      <p className="text-sm text-cream/40 line-through">
                        {formatINR(product.compareAt)}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem(product.id)}
                    className="rounded-full bg-white px-5 py-2.5 font-display text-xs font-bold tracking-wider text-plum-deep uppercase transition hover:bg-motumo-yellow"
                  >
                    Add to bag
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Craft story */}
      <section id="craft" className="border-t border-white/10 bg-black/20 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
            <img
              src={assets.promo.heritage}
              alt="Motumo heritage craft — traditional millet wisdom"
              className="aspect-[4/3] w-full object-cover opacity-90"
            />
          </div>
          <div>
            <p className="font-display text-[11px] font-semibold tracking-[0.28em] text-motumo-red uppercase">
              The craft
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
              From roasting to the jar
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cream/65">
              We roast almonds, peanuts and hazelnuts with patience, fold in cocoa, and finish with
              unrefined sugar — so every spoon feels indulgent without compromise.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { n: '100%', l: 'Gluten free' },
                { n: '0', l: 'Preservatives' },
                { n: '9', l: 'Grains in millet' },
              ].map((stat) => (
                <div key={stat.l}>
                  <p className="font-display text-3xl font-semibold text-motumo-yellow">{stat.n}</p>
                  <p className="mt-1 text-xs tracking-wide text-cream/50 uppercase">{stat.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voices */}
      <section id="voices" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Soft voices, strong loyalty
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <blockquote
                key={r.name}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="text-sm leading-relaxed text-cream/70">&ldquo;{r.quote}&rdquo;</p>
                <footer className="mt-5">
                  <p className="font-display text-sm font-semibold text-motumo-yellow">{r.name}</p>
                  <p className="text-xs text-cream/45">{r.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <p className="text-xs text-cream/40">
            Template 2 · Premium Atelier ·{' '}
            <Link to="/" className="text-motumo-yellow hover:underline">
              Back to Template 1
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
