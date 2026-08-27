import { motion } from 'framer-motion'
import { waysToEnjoy } from '../data/products'

function SceneIcon({ kind }: { kind: (typeof waysToEnjoy)[number]['icon'] }) {
  switch (kind) {
    case 'bread':
      return (
        <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
          <ellipse cx="32" cy="40" rx="22" ry="10" fill="#f5e6c8" />
          <path d="M12 38c2-14 12-22 20-22s18 8 20 22" fill="#e8c48a" />
          <path d="M18 36c4-2 8-1 12 1 4-3 9-4 14-1" stroke="#5c3a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="26" cy="28" r="2.5" fill="#f7c948" />
          <circle cx="36" cy="26" r="2.5" fill="#f7c948" />
        </svg>
      )
    case 'pancake':
      return (
        <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
          <ellipse cx="32" cy="42" rx="20" ry="8" fill="#d4782a" opacity="0.35" />
          <ellipse cx="32" cy="36" rx="18" ry="7" fill="#f0a04b" />
          <ellipse cx="32" cy="30" rx="18" ry="7" fill="#ffc56e" />
          <circle cx="26" cy="28" r="2.2" fill="#5c3a2e" />
          <circle cx="38" cy="28" r="2.2" fill="#5c3a2e" />
          <path d="M27 34c2 2 8 2 10 0" stroke="#5c3a2e" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'milk':
      return (
        <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
          <path d="M24 14h16l3 8v28a6 6 0 0 1-6 6H27a6 6 0 0 1-6-6V22l3-8z" fill="#fff" opacity="0.9" />
          <path d="M22 28h20v22a5 5 0 0 1-5 5H27a5 5 0 0 1-5-5V28z" fill="#6b4588" />
          <ellipse cx="32" cy="28" rx="10" ry="3" fill="#8d6aad" />
        </svg>
      )
    case 'fruit':
      return (
        <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
          <circle cx="24" cy="34" r="10" fill="#e86b9a" />
          <circle cx="40" cy="30" r="9" fill="#f2b33d" />
          <circle cx="34" cy="42" r="8" fill="#6fbf4a" />
          <path d="M40 18c2 3 1 6-1 8" stroke="#4a9a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'oats':
      return (
        <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>
          <ellipse cx="32" cy="44" rx="18" ry="8" fill="#fff" opacity="0.35" />
          <path d="M16 40c0-12 8-20 16-20s16 8 16 20" fill="#fff" opacity="0.85" />
          <ellipse cx="32" cy="38" rx="12" ry="4" fill="#5c3a2e" />
          <circle cx="26" cy="34" r="1.8" fill="#d4a017" />
          <circle cx="36" cy="33" r="1.8" fill="#d4a017" />
          <circle cx="31" cy="31" r="1.5" fill="#6fbf4a" />
        </svg>
      )
  }
}

export function WaysToEnjoy() {
  return (
    <section id="enjoy" className="bg-lavender-50 py-16 sm:py-20" aria-labelledby="enjoy-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="enjoy-heading"
            className="font-display text-3xl font-semibold text-plum sm:text-4xl"
          >
            Perfect for every bite
          </h2>
          <p className="mt-3 text-plum-soft">
            From toast to oats — Motumo turns everyday moments into millet
            chocolate joy.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {waysToEnjoy.map((way, index) => (
            <motion.figure
              key={way.title}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${way.tone} shadow-[0_14px_30px_-16px_rgba(74,44,106,0.55)] ring-4 ring-white sm:h-32 sm:w-32`}
              >
                <SceneIcon kind={way.icon} />
              </div>
              <figcaption className="mt-4">
                <p className="font-display text-base font-semibold text-plum">
                  {way.title}
                </p>
                <p className="mt-1 text-xs text-plum-soft sm:text-sm">{way.subtitle}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
