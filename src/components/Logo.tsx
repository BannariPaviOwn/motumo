import { assets } from '../lib/assets'

type LogoProps = {
  className?: string
  /** Soft script line beside the mark — header only, avoids clutter in footer */
  showTagline?: boolean
  /** Light variant for dark backgrounds (footer card) */
  variant?: 'default' | 'onDark'
}

export function Logo({
  className = '',
  showTagline = false,
  variant = 'default',
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <img
        src={assets.logo}
        alt="Motumo"
        className="h-10 w-auto max-w-[9.5rem] object-contain object-left sm:h-11 sm:max-w-[11rem]"
        width={277}
        height={104}
        decoding="async"
        draggable={false}
      />

      {showTagline && (
        <span
          className={`hidden border-l pl-3 font-script text-[1.4rem] leading-none sm:inline ${
            variant === 'onDark'
              ? 'border-white/20 text-lavender-100'
              : 'border-plum/15 text-plum-soft'
          }`}
        >
          Nourish Naturally
        </span>
      )}
    </span>
  )
}
