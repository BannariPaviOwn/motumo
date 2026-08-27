import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section
      id="top"
      className="leaf-pattern relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.span
          className="absolute left-[8%] top-[18%] h-3 w-3 rounded-full bg-motumo-green/50"
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute right-[12%] top-[28%] h-2.5 w-2.5 rounded-full bg-plum/30"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute bottom-[22%] left-[18%] h-2 w-2 rounded-full bg-motumo-red/35"
          animate={{ scale: [1, 1.35, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6 lg:py-0">
        <motion.div
          className="relative z-10 max-w-xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 font-display text-sm font-semibold tracking-[0.18em] text-plum-soft uppercase">
            — Nourish Naturally —
          </p>

          <h1
            id="hero-heading"
            className="font-display text-[clamp(2.75rem,8vw,4.75rem)] leading-[0.92] font-semibold tracking-tight text-plum"
          >
            motumo
          </h1>

          <p className="mt-4 font-script text-[clamp(1.75rem,4.5vw,2.65rem)] leading-tight text-choco">
            Taste the Goodness of{' '}
            <span className="font-display text-[0.92em] font-semibold text-plum">
              Millets
            </span>{' '}
            with{' '}
            <span className="font-display text-[0.92em] font-semibold text-plum">
              Chocolate
            </span>
            .
          </p>

          <p className="mt-4 max-w-md text-base leading-relaxed text-plum-soft sm:text-lg">
            Wholesome millet chocolate spreads for curious kids and mindful
            families — delicious, nutritious, and made for every bite.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="inline-flex items-center justify-center rounded-2xl bg-motumo-red px-7 py-3.5 font-display text-base font-semibold text-white shadow-[0_12px_30px_-12px_rgba(227,28,35,0.7)] transition hover:translate-y-[-1px] hover:bg-[#c9181e]"
            >
              Shop now
            </a>
            <a
              href="#benefits"
              className="font-display text-sm font-semibold text-plum underline decoration-plum/25 underline-offset-4 transition hover:decoration-motumo-red"
            >
              Why millets?
            </a>
          </div>
        </motion.div>

        <motion.div
          className="relative flex min-h-[340px] items-end justify-center sm:min-h-[420px] lg:min-h-[560px]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-x-6 bottom-8 top-10 rounded-[40%] bg-gradient-to-b from-lavender-200/80 via-plum/10 to-transparent blur-2xl sm:inset-x-10" />

          <motion.img
            src="/assets/choco-millet-delight.png"
            alt="Motumo Choco Millet Delight jar with tiger cub mascot"
            className="relative z-10 max-h-[min(72vh,620px)] w-auto max-w-full object-contain drop-shadow-[0_28px_50px_rgba(74,44,106,0.28)]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute top-6 right-2 z-20 hidden rotate-6 sm:right-6 sm:block lg:right-2"
            initial={{ opacity: 0, rotate: 12, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 6, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-plum text-center text-white shadow-lg ring-4 ring-lavender-50 sm:h-28 sm:w-28">
              <span className="font-display text-[10px] font-semibold tracking-wider uppercase opacity-90">
                Made with
              </span>
              <span className="font-display text-2xl font-bold leading-none">9</span>
              <span className="font-display text-[10px] font-semibold tracking-wider uppercase">
                Grains
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative bg-plum">
        <p className="mx-auto max-w-6xl px-4 py-3 text-center font-display text-sm font-medium tracking-[0.2em] text-white uppercase sm:text-base">
          Delicious · Nutritious · Wholesome
        </p>
      </div>
    </section>
  )
}
