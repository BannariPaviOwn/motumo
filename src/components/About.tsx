import { Logo } from './Logo'

export function About() {
  return (
    <section id="about" className="leaf-pattern py-16 sm:py-20" aria-labelledby="about-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
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
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-plum p-8 text-white shadow-[0_24px_60px_-30px_rgba(74,44,106,0.7)] sm:p-10">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-motumo-green/20 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-motumo-red/20 blur-2xl" />
          <Logo />
          <p className="relative mt-6 font-display text-2xl font-semibold leading-snug sm:text-3xl">
            Delicious · Nutritious · Wholesome
          </p>
          <p className="relative mt-4 max-w-md text-sm leading-relaxed text-lavender-200 sm:text-base">
            Taste the goodness of millets with chocolate — in a small jar packed
            with big nutrition.
          </p>
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
