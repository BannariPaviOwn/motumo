import { motion } from 'framer-motion'
import { reviews } from '../data/products'
import { TigerMascot } from './TigerMascot'

export function Reviews() {
  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-motumo-yellow py-16 sm:py-20"
      aria-labelledby="reviews-heading"
    >
      <TigerMascot
        variant="cheer"
        size="sm"
        className="absolute top-4 right-4 hidden opacity-90 sm:block"
        alt=""
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs font-bold tracking-[0.2em] text-plum-deep/70 uppercase">
            Verified, honest reviews
          </p>
          <h2
            id="reviews-heading"
            className="mt-2 font-display text-3xl font-semibold text-plum-deep sm:text-4xl"
          >
            Families love Motumo
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.blockquote
              key={review.name}
              className="rounded-[1.5rem] bg-white/90 p-6 shadow-[0_14px_40px_-24px_rgba(61,26,92,0.4)] ring-1 ring-plum/10"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
            >
              <p className="font-script text-2xl leading-snug text-motumo-red">It was amazing</p>
              <p className="mt-3 text-sm leading-relaxed text-plum-soft">&ldquo;{review.quote}&rdquo;</p>
              <footer className="mt-5">
                <p className="font-display text-sm font-semibold text-plum">{review.name}</p>
                <p className="text-xs text-plum-soft">{review.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
