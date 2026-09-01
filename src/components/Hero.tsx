import { ShoppingBag, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { assets } from '../lib/assets'
import { Logo } from './Logo'
import { TigerMascot } from './TigerMascot'

const links = [
  { href: '#shop', label: 'Shop' },
  { href: '#benefits', label: 'Benefits' },
  { href: '#enjoy', label: 'Ways to enjoy' },
  { href: '#about', label: 'About' },
]

const heroSlides = [
  {
    src: assets.promo.productShowcase,
    alt: 'Motumo Choco Millet Delight — product showcase with tiger mascot',
    caption: 'Choco Millet Delight',
  },
  {
    src: assets.promo.wholesome,
    alt: 'Wholesome choco magic — Motumo millet promise in your kitchen',
    caption: 'Wholesome choco magic',
  },
  {
    src: assets.promo.heritage,
    alt: 'From traditional millet wisdom to modern chocolate delight',
    caption: 'Heritage meets delight',
  },
  {
    src: assets.promo.lifestyleToast,
    alt: 'Spread Motumo on morning toast — perfect for every snack',
    caption: 'Perfect for every bite',
  },
] as const

const SLIDE_MS = 6000

export function Hero() {
  const { itemCount, openCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [slide, setSlide] = useState(0)

  const nextSlide = useCallback(
    () => setSlide((i) => (i + 1) % heroSlides.length),
    [],
  )
  const prevSlide = useCallback(
    () => setSlide((i) => (i - 1 + heroSlides.length) % heroSlides.length),
    [],
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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

  useEffect(() => {
    const t = window.setInterval(nextSlide, SLIDE_MS)
    return () => window.clearInterval(t)
  }, [nextSlide])

  return (
    <section id="top" className="relative" aria-labelledby="hero-heading">
      {/* ── Floating nav (replaces separate header) ── */}
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled || mobileOpen
            ? 'bg-plum-deep/88 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] backdrop-blur-xl'
            : 'bg-gradient-to-b from-plum-deep/55 to-transparent backdrop-blur-[2px]'
        }`}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <a
            href="#top"
            className="group shrink-0 rounded-2xl outline-offset-4 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50"
            aria-label="Motumo home"
          >
            <Logo
              showTagline
              variant="onDark"
              className="transition duration-300 group-hover:brightness-110"
            />
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative px-3.5 py-2 font-display text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-3.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-motumo-green transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/15 px-3.5 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/25 sm:px-4"
              aria-label={`Open cart, ${itemCount} items`}
            >
              <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={2.1} />
              <span className="hidden font-display text-sm font-medium sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-motumo-red px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-plum-deep">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/25 md:hidden"
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
              className="overflow-hidden border-t border-white/10 bg-plum-deep/95 backdrop-blur-xl md:hidden"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-3 font-display text-base font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
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

      {/* ── Full-bleed image hero carousel ── */}
      <div className="relative min-h-svh overflow-hidden bg-plum-deep">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={heroSlides[slide].src}
              alt={heroSlides[slide].alt}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-plum-deep/90 via-plum-deep/55 to-plum/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/70 via-transparent to-plum-deep/30" />
          </motion.div>
        </AnimatePresence>

        {/* Peeking tiger */}
        <TigerMascot
          variant="peek"
          size="md"
          animate
          className="absolute bottom-28 left-2 z-20 hidden sm:bottom-32 sm:left-6 sm:block lg:bottom-36"
          alt=""
        />

        {/* Hero content overlay */}
        <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-end gap-8 px-4 pb-10 pt-28 sm:px-6 sm:pb-14 lg:flex-row lg:items-end lg:justify-between lg:pb-16 lg:pt-32">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 font-display text-xs font-semibold tracking-[0.22em] text-motumo-green uppercase sm:text-sm">
              — Nourish Naturally —
            </p>

            <h1
              id="hero-heading"
              className="font-script text-[clamp(2rem,5.5vw,3.25rem)] leading-tight text-white"
            >
              Taste the goodness of{' '}
              <span className="font-display font-semibold text-motumo-green">millets</span>{' '}
              with{' '}
              <span className="font-display font-semibold text-motumo-gold">chocolate</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-lavender-100/90 sm:text-lg">
              Wholesome millet chocolate spreads for curious kids and mindful families.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#shop"
                className="inline-flex items-center justify-center rounded-2xl bg-motumo-red px-7 py-3.5 font-display text-base font-semibold text-white shadow-[0_12px_30px_-10px_rgba(227,28,35,0.8)] transition hover:translate-y-[-1px] hover:bg-[#c9181e]"
              >
                Shop now
              </a>
              <a
                href="#benefits"
                className="font-display text-sm font-semibold text-white/90 underline decoration-white/30 underline-offset-4 transition hover:decoration-motumo-green"
              >
                Why millets?
              </a>
            </div>

            <p className="mt-5 font-display text-sm font-medium text-white/60">
              {heroSlides[slide].caption}
            </p>
          </motion.div>

          {/* Floating product cutouts */}
          <motion.div
            className="relative hidden shrink-0 lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -inset-8 rounded-full bg-motumo-green/15 blur-3xl" />
            <motion.img
              src={assets.products.chocoMilletDelight}
              alt="Motumo Choco Millet Delight jar"
              className="relative z-10 max-h-[min(52vh,480px)] w-auto drop-shadow-[0_32px_60px_rgba(0,0,0,0.45)]"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img
              src={assets.products.chocoMilletFillsBag}
              alt="Motumo Choco Millet Fills"
              className="absolute -right-6 -bottom-4 z-20 h-44 w-auto rotate-6 drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)] sm:h-52"
            />
          </motion.div>
        </div>

        {/* Carousel controls */}
        <div className="absolute right-4 bottom-24 z-20 flex items-center gap-2 sm:right-8 sm:bottom-28">
          <button
            type="button"
            onClick={prevSlide}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-28">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === slide ? 'w-8 bg-motumo-green' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === slide ? 'true' : undefined}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 bg-plum">
        <p className="py-3 text-center font-display text-sm font-medium tracking-[0.2em] text-white uppercase sm:text-base">
          Delicious · Nutritious · Wholesome
        </p>
      </div>
    </section>
  )
}
