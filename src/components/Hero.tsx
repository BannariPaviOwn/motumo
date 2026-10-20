import { ShoppingBag, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { assets } from '../lib/assets'
import { Logo } from './Logo'
import { TigerMascot } from './TigerMascot'

const links = [
  { href: '#shop', label: 'Shop' },
  { href: '#new', label: 'New launches' },
  { href: '#benefits', label: 'Why Motumo' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#about', label: 'About' },
]

export function Hero() {
  const { itemCount, openCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <section id="top" className="relative" aria-labelledby="hero-heading">
      {/* Announcement bar — Open Secret style */}
      <div className="bg-motumo-red px-4 py-2 text-center font-display text-xs font-semibold tracking-[0.14em] text-white uppercase sm:text-sm">
        Free shipping on orders above ₹799 · Nourish Naturally
      </div>

      {/* Sticky nav */}
      <motion.header
        className={`sticky top-0 z-50 border-b transition-[background-color,box-shadow] duration-300 ${
          scrolled || mobileOpen
            ? 'border-plum/10 bg-cream/95 shadow-[0_10px_30px_-18px_rgba(61,26,92,0.45)] backdrop-blur-xl'
            : 'border-transparent bg-cream/80 backdrop-blur-md'
        }`}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="shrink-0" aria-label="Motumo home">
            <Logo showTagline />
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative px-3 py-2 font-display text-sm font-medium text-plum/80 transition hover:text-plum"
              >
                {link.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-motumo-red transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 items-center gap-2 rounded-full bg-plum px-3.5 text-white transition hover:bg-motumo-red sm:px-4"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.1} />
              <span className="hidden font-display text-sm font-medium sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-motumo-yellow px-1 text-[11px] font-bold text-plum-deep ring-2 ring-cream">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-plum ring-1 ring-plum/15 lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              className="border-t border-plum/10 bg-cream lg:hidden"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-3 font-display text-base font-medium text-plum hover:bg-motumo-yellow/40"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Bold Open Secret-style hero */}
      <div className="brand-mesh relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-motumo-yellow/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-plum/20 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-motumo-red/15 blur-2xl" />
        </div>

        <TigerMascot
          variant="peek"
          size="md"
          animate
          className="absolute bottom-6 left-2 z-20 hidden sm:bottom-10 sm:left-4 sm:block lg:left-8"
          alt=""
        />

        <div className="relative mx-auto grid min-h-[calc(100svh-7rem)] max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-motumo-yellow px-3.5 py-1.5 font-display text-xs font-bold tracking-[0.16em] text-plum-deep uppercase">
              New launches · Nut spreads
            </p>

            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.6rem,7.5vw,4.6rem)] leading-[0.95] font-semibold tracking-tight text-plum"
            >
              Unjunked{' '}
              <span className="text-motumo-red">delight</span>
              <br />
              in every{' '}
              <span className="relative inline-block">
                <span className="relative z-10">spoon</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-motumo-yellow/90 sm:h-4" />
              </span>
            </h1>

            <p className="mt-5 max-w-md font-script text-[clamp(1.55rem,3.8vw,2.2rem)] leading-tight text-plum-soft">
              Taste the goodness of millets &amp; nuts with chocolate.
            </p>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-plum-soft sm:text-lg">
              Protein-rich almond, peanut &amp; hazelnut spreads — gluten free,
              no preservatives, and made for curious kids and mindful families.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#shop"
                className="inline-flex rounded-full bg-motumo-red px-7 py-3.5 font-display text-base font-semibold text-white shadow-[0_12px_28px_-10px_rgba(227,28,35,0.65)] transition hover:-translate-y-0.5 hover:bg-motumo-red-deep"
              >
                Shop bestsellers
              </a>
              <a
                href="#new"
                className="inline-flex rounded-full bg-plum px-7 py-3.5 font-display text-base font-semibold text-white transition hover:bg-plum-deep"
              >
                See new launches
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Rich in protein', '100% gluten free', 'No preservatives'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/80 px-3.5 py-1.5 font-display text-xs font-semibold text-plum ring-1 ring-plum/10"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative flex min-h-[320px] items-end justify-center sm:min-h-[420px]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <div className="absolute inset-x-8 bottom-8 top-12 rounded-[45%] bg-gradient-to-b from-motumo-yellow/50 via-plum/10 to-transparent blur-2xl" />

            <motion.img
              src={assets.products.peanutSpread}
              alt="Motumo Peanut Spread Delight"
              className="absolute bottom-8 left-[4%] z-10 hidden w-[38%] max-w-[220px] -rotate-8 drop-shadow-[0_24px_40px_rgba(61,26,92,0.28)] sm:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.img
              src={assets.products.almondSpread}
              alt="Motumo Almond Spread Delight"
              className="relative z-20 max-h-[min(68vh,560px)] w-auto max-w-[70%] object-contain drop-shadow-[0_28px_50px_rgba(61,26,92,0.32)]"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            />
            <motion.img
              src={assets.products.hazelnutSpread}
              alt="Motumo Hazelnut Spread Delight"
              className="absolute right-[2%] bottom-10 z-10 hidden w-[38%] max-w-[220px] rotate-8 drop-shadow-[0_24px_40px_rgba(61,26,92,0.28)] sm:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
            />

            <div className="absolute top-4 right-2 z-30 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-plum text-center text-white shadow-lg ring-4 ring-motumo-yellow sm:h-28 sm:w-28">
              <span className="font-display text-[10px] font-semibold tracking-wider uppercase opacity-90">
                Made with
              </span>
              <span className="font-display text-2xl font-bold leading-none">Love</span>
              <span className="font-display text-[10px] font-semibold tracking-wider uppercase">
                &amp; nuts
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
