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
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={assets.logo}
        alt="Motumo"
        className="h-9 w-auto sm:h-10"
        width={200}
        height={56}
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
