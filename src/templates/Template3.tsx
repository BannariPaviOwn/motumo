import { ShoppingBag, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
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

const lookbook = products.filter((p) =>
  [
    'almond-spread-delight',
    'peanut-spread-delight',
    'hazelnut-spread-delight',
    'choco-millet-delight',
  ].includes(p.id),
)

/** Template 3 — premium light maison / boutique lookbook */
export function Template3() {
  const { itemCount, openCart, addItem } = useCart()

  return (
    <div className="min-h-svh bg-[#fffaf2] text-plum-deep">
      {/* Floating boutique header */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <div className="flex items-center justify-between rounded-full border border-plum/10 bg-white/85 px-4 py-2.5 shadow-[0_12px_40px_-24px_rgba(61,26,92,0.35)] backdrop-blur-xl sm:px-5">
            <a href="#maison-top" aria-label="Motumo home">
              <Logo />
            </a>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Maison">
              {[
                { href: '#lookbook', label: 'Lookbook' },
                { href: '#story', label: 'Story' },
                { href: '#gifting', label: 'Gifting' },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-display text-sm font-medium text-plum/70 transition hover:text-motumo-red"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <button
              type="button"
              onClick={openCart}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-plum px-4 text-white transition hover:bg-motumo-red"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="font-display text-xs font-semibold">{itemCount || 'Cart'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Maison hero — asymmetric premium */}
      <section id="maison-top" className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-20 left-[10%] h-56 w-56 rounded-full bg-motumo-yellow/35 blur-3xl" />
          <div className="absolute right-[5%] bottom-10 h-64 w-64 rounded-full bg-plum/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-motumo-red/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.p
            className="text-center font-display text-[11px] font-semibold tracking-[0.4em] text-motumo-red uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Motumo Maison · Premium
          </motion.p>

          <motion.h1
            className="mx-auto mt-6 max-w-4xl text-center font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.94] font-semibold tracking-tight text-plum"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            A quieter kind of{' '}
            <span className="relative inline-block">
              <span className="relative z-10">indulgence</span>
              <span className="absolute inset-x-0 bottom-2 z-0 h-3 bg-motumo-yellow/80 sm:bottom-3 sm:h-4" />
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-plum-soft sm:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Boutique spreads for brunch tables and school bags — almonds, peanuts, hazelnuts, and
            millet chocolate, finished with Motumo care.
          </motion.p>

          <div className="mt-10 flex justify-center gap-3">
            <a
              href="#lookbook"
              className="inline-flex items-center gap-2 rounded-full bg-motumo-red px-7 py-3.5 font-display text-sm font-semibold text-white transition hover:bg-motumo-red-deep"
            >
              Browse lookbook <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              to="/template2"
              className="inline-flex rounded-full border border-plum/20 bg-white px-7 py-3.5 font-display text-sm font-semibold text-plum transition hover:border-plum/40"
            >
              View Atelier
            </Link>
          </div>

          {/* Floating product trio */}
          <div className="relative mx-auto mt-14 grid max-w-4xl grid-cols-3 items-end gap-2 sm:gap-6">
            {[
              { src: assets.products.almondSpread, delay: 0.05, y: 24 },
              { src: assets.products.peanutSpread, delay: 0.15, y: 0 },
              { src: assets.products.hazelnutSpread, delay: 0.25, y: 24 },
            ].map((item) => (
              <motion.img
                key={item.src}
                src={item.src}
                alt=""
                className="w-full object-contain drop-shadow-[0_24px_50px_rgba(61,26,92,0.22)]"
                style={{ marginBottom: item.y }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay, duration: 0.7 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook grid — premium product tiles */}
      <section id="lookbook" className="border-t border-plum/8 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-script text-2xl text-motumo-red">The lookbook</p>
              <h2 className="font-display text-3xl font-semibold text-plum sm:text-4xl">
                Curated jars
              </h2>
            </div>
            <p className="max-w-xs text-sm text-plum-soft">
              Red, violet &amp; yellow — Motumo&apos;s signature palette, dressed for gifting.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {lookbook.map((product, index) => (
              <motion.article
                key={product.id}
                className={`group relative overflow-hidden rounded-[1.75rem] ${
                  index === 0 ? 'sm:col-span-2 sm:grid sm:grid-cols-2' : ''
                }`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.06 }}
              >
                <div
                  className={`flex items-center justify-center px-6 py-10 ${
                    index === 0 ? 'min-h-[320px] sm:min-h-[400px]' : 'min-h-[280px]'
                  }`}
                  style={{
                    background: `linear-gradient(165deg, ${product.accent}55 0%, #fffaf2 70%)`,
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-auto object-contain transition duration-500 group-hover:scale-[1.04] ${
                      index === 0 ? 'h-64 sm:h-80' : 'h-52'
                    }`}
                  />
                </div>
                <div className="flex flex-col justify-between border border-t-0 border-plum/8 bg-[#fffaf2] p-6 sm:border-t sm:border-l-0">
                  <div>
                    {product.badge && (
                      <span className="font-display text-[11px] font-bold tracking-[0.2em] text-motumo-red uppercase">
                        {product.badge}
                      </span>
                    )}
                    <h3 className="mt-2 font-display text-2xl font-semibold text-plum">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-plum-soft">
                      {product.tagline} · {product.weight}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-plum-soft/90">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-xl font-semibold text-plum">
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
                      className="rounded-full bg-plum px-5 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-motumo-red"
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

      {/* Story band */}
      <section id="story" className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src={assets.promo.wholesome}
              alt="Wholesome Motumo millet promise"
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
          <div>
            <p className="font-display text-[11px] font-semibold tracking-[0.28em] text-plum-soft uppercase">
              Maison story
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-plum sm:text-4xl">
              Nourish, beautifully
            </h2>
            <p className="mt-5 text-base leading-relaxed text-plum-soft">
              Motumo Maison is for the moments between rush and ritual — toast at sunrise, fruit at
              recess, pancakes on Sunday. Every jar carries red energy, violet warmth, and a yellow
              wink of joy.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                'Roasted nuts & millets',
                'Unrefined sugar · no preservatives',
                'Designed for gifting & everyday tables',
              ].map((line) => (
                <li key={line} className="flex items-center gap-3 font-display text-sm text-plum">
                  <span className="h-2 w-2 rounded-full bg-motumo-red" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gifting CTA */}
      <section id="gifting" className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-plum px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -top-16 -left-10 h-48 w-48 rounded-full bg-motumo-yellow/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-16 h-56 w-56 rounded-full bg-motumo-red/30 blur-3xl" />
          <img
            src={assets.tiger.peeking}
            alt=""
            className="absolute bottom-0 left-4 hidden h-28 mix-blend-screen sm:block"
          />
          <p className="relative font-display text-[11px] font-semibold tracking-[0.3em] text-motumo-yellow uppercase">
            Gifting
          </p>
          <h2 className="relative mx-auto mt-3 max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            Bundle delight for someone you love
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm text-lavender-200">
            Pair almond &amp; hazelnut, or build a millet + nut duo — wrapped in Motumo violet and
            sealed with a yellow smile.
          </p>
          <button
            type="button"
            onClick={() => addItem('family-delight-duo')}
            className="relative mt-8 inline-flex rounded-full bg-motumo-yellow px-8 py-3.5 font-display text-sm font-bold text-plum-deep transition hover:bg-white"
          >
            Add Family Duo · {formatINR(549)}
          </button>
        </div>
      </section>

      <footer className="border-t border-plum/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <p className="text-xs text-plum-soft">
            Template 3 · Premium Maison ·{' '}
            <Link to="/" className="font-semibold text-motumo-red hover:underline">
              Back to Template 1
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
