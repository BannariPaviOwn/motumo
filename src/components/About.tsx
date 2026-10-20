import { Logo } from './Logo'
import { assets } from '../lib/assets'
import { TigerMascot } from './TigerMascot'

export function About() {
  return (
    <section
      id="about"
      className="tiger-watermark relative bg-lavender-50 py-16 sm:py-20"
      aria-labelledby="about-heading"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="font-script text-2xl text-motumo-red">Our story</p>
          <h2
            id="about-heading"
            className="mt-2 font-display text-3xl font-semibold text-plum sm:text-4xl"
          >
            Nourish naturally
          </h2>
          <p className="mt-4 text-base leading-relaxed text-plum-soft sm:text-lg">
            Motumo was born from a simple idea: chocolate moments should feel as good as they
            taste. We fold roasted nuts, millets and cocoa into spreads families reach for every
            day — playful for little ones, thoughtful for parents.
          </p>
          <p className="mt-4 text-base leading-relaxed text-plum-soft sm:text-lg">
            No artificial colours. No preservatives. Just wholesome ingredients and a tiger cub
            who believes snack time can be both fun and nourishing.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              assets.products.almondSpread,
              assets.products.peanutSpread,
              assets.products.hazelnutSpread,
            ].map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`rounded-2xl bg-white object-contain p-2 ring-1 ring-plum/10 ${
                  i === 1 ? 'bg-motumo-yellow/30' : i === 0 ? 'bg-[#e8f5b8]/60' : 'bg-[#d4b5a0]/40'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-plum p-8 text-white shadow-[0_24px_60px_-30px_rgba(61,26,92,0.7)] sm:p-10">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-motumo-yellow/25 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-motumo-red/25 blur-2xl" />
          <TigerMascot
            variant="float"
            size="sm"
            monochrome
            className="absolute right-4 bottom-4 opacity-85 sm:right-6 sm:bottom-6"
            alt=""
          />
          <Logo variant="onDark" />
          <p className="relative mt-6 font-display text-2xl font-semibold leading-snug sm:text-3xl">
            Delicious · Nutritious · Wholesome
          </p>
          <p className="relative mt-4 max-w-md text-sm leading-relaxed text-lavender-200 sm:text-base">
            Taste the goodness of nuts and millets with chocolate — in a small jar packed with big
            nutrition.
          </p>
          <a
            href="#shop"
            className="relative mt-8 inline-flex rounded-full bg-motumo-yellow px-5 py-3 font-display text-sm font-bold text-plum-deep transition hover:bg-white"
          >
            Explore the shop
          </a>
        </div>
      </div>
    </section>
  )
}
