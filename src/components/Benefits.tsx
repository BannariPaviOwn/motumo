import { Heart, Leaf, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { benefits, trustPoints } from '../data/products'
import { assets } from '../lib/assets'
import { TigerMascot } from './TigerMascot'

const iconMap = {
  leaf: Leaf,
  zap: Zap,
  heart: Heart,
  sparkles: Sparkles,
  wheat: Leaf,
  shield: Sparkles,
}

export function Benefits() {
  return (
    <section
      id="benefits"
      className="tiger-watermark relative overflow-hidden bg-lavender-50 py-16 sm:py-20"
      aria-labelledby="benefits-heading"
    >
      <TigerMascot
        variant="float"
        size="sm"
        peekIn
        className="absolute top-6 right-2 z-10 hidden opacity-95 sm:right-6 sm:block md:top-10 md:right-10"
        alt=""
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-script text-2xl text-motumo-red">Small jar, big nutrition</p>
          <h2
            id="benefits-heading"
            className="mt-2 font-display text-3xl font-semibold text-plum sm:text-4xl"
          >
            Filled with goodness
          </h2>
          <p className="mt-3 text-base text-plum-soft sm:text-lg">
            Motumo spreads bring nuts, millets and chocolate together — playful for kids,
            reassuring for parents.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon]
            return (
              <motion.div
                key={benefit.title}
                className="rounded-[1.5rem] bg-white p-6 text-center shadow-[0_10px_36px_-22px_rgba(61,26,92,0.4)] ring-1 ring-plum/8"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
              >
                <span
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${benefit.accent}22`, color: benefit.accent }}
                >
                  <Icon className="h-7 w-7" strokeWidth={2.25} />
                </span>
                <h3 className="font-display text-lg font-semibold text-plum">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-plum-soft">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              src: assets.products.almondSpread,
              label: 'Almond',
              bg: 'bg-[#e8f5b8]',
            },
            {
              src: assets.products.peanutSpread,
              label: 'Peanut',
              bg: 'bg-motumo-yellow/60',
            },
            {
              src: assets.products.hazelnutSpread,
              label: 'Hazelnut',
              bg: 'bg-[#d4b5a0]/50',
            },
          ].map((item) => (
            <figure
              key={item.label}
              className={`overflow-hidden rounded-[1.5rem] ${item.bg} px-4 pt-6 pb-4 text-center ring-1 ring-plum/8`}
            >
              <img
                src={item.src}
                alt={`Motumo ${item.label} Spread Delight`}
                className="mx-auto h-44 w-auto object-contain sm:h-52"
              />
              <figcaption className="mt-3 font-display text-sm font-semibold text-plum">
                {item.label} Spread Delight
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 rounded-[1.5rem] bg-plum px-4 py-5 text-white sm:grid-cols-4 sm:gap-4 sm:px-8">
          {trustPoints.map((point) => {
            const Icon = iconMap[point.icon]
            return (
              <div
                key={point.label}
                className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-motumo-yellow/20 text-motumo-yellow">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-display text-xs font-semibold tracking-wide sm:text-sm">
                  {point.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
