import { Logo } from './Logo'
import { assets } from '../lib/assets'
import { TigerMascot } from './TigerMascot'

export function About() {
  return (
    <section id="about" className="leaf-pattern tiger-watermark relative py-16 sm:py-20" aria-labelledby="about-heading">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="font-script text-2xl text-choco-soft">Our story</p>
          <h2
            id="about-heading"
            className="mt-2 font-display text-3xl font-semibold text-plum sm:text-4xl"
          >
            Nourish naturally
          </h2>
          <p className="mt-4 text-base leading-relaxed text-plum-soft sm:text-lg">
            Motumo was born from a simple idea: chocolate moments should feel as
            good as they taste. We fold millets and nine nourishing grains into
            a spread families reach for every day — playful for little ones,
            thoughtful for parents.
          </p>
          <p className="mt-4 text-base leading-relaxed text-plum-soft sm:text-lg">
            No artificial colours. No preservatives. Just wholesome ingredients
            and a tiger cub who believes breakfast can be both fun and
            nourishing.
          </p>

          <figure className="mt-8 overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_-28px_rgba(74,44,106,0.45)] ring-1 ring-plum/10">
            <img
              src={assets.products.chocoMilletDelightHeritage}
              alt="Motumo heritage meets modern — traditional millet milling illustrated alongside the Choco Millet Delight jar"
              className="w-full object-cover"
            />
            <figcaption className="bg-white px-4 py-3 text-center text-sm text-plum-soft">
              From traditional millet wisdom to modern chocolate delight
            </figcaption>
          </figure>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-plum p-8 text-white shadow-[0_24px_60px_-30px_rgba(74,44,106,0.7)] sm:p-10">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-motumo-green/20 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-motumo-red/20 blur-2xl" />
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
            Taste the goodness of millets with chocolate — in a small jar packed
            with big nutrition.
          </p>
          <img
            src={assets.promo.productShowcaseLavender}
            alt="Motumo Choco Millet Delight product showcase"
            className="relative mt-6 w-full rounded-2xl ring-2 ring-white/15"
          />
          <a
            href="#shop"
            className="relative mt-8 inline-flex rounded-2xl bg-white px-5 py-3 font-display text-sm font-semibold text-plum transition hover:bg-lavender-100"
          >
            Explore the shop
          </a>
        </div>
      </div>
    </section>
  )
}
