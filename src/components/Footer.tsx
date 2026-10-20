import { Logo } from './Logo'
import { TigerMascot } from './TigerMascot'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-plum-deep text-lavender-100">
      <TigerMascot
        variant="corner"
        size="sm"
        monochrome
        className="absolute right-3 bottom-16 opacity-80 sm:right-8 sm:bottom-20"
        alt=""
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-lavender-200/90">
            Nourish Naturally — nut &amp; millet chocolate spreads for families who want joy and
            goodness in every spoon.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-[0.16em] text-motumo-yellow uppercase">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#shop" className="hover:text-white">
                Shop
              </a>
            </li>
            <li>
              <a href="#new" className="hover:text-white">
                New launches
              </a>
            </li>
            <li>
              <a href="#benefits" className="hover:text-white">
                Why Motumo
              </a>
            </li>
            <li>
              <a href="#reviews" className="hover:text-white">
                Reviews
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-white">
                About
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold tracking-[0.16em] text-motumo-yellow uppercase">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="mailto:hello@motumo.in" className="hover:text-white">
                hello@motumo.in
              </a>
            </li>
            <li className="text-lavender-200/80">Made for curious kids &amp; mindful families</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-lavender-200/70 sm:px-6 sm:text-left">
          © {new Date().getFullYear()} Motumo. All rights reserved. Demo storefront for brand
          reference.
        </p>
      </div>
    </footer>
  )
}
