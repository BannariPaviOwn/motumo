import { motion, type HTMLMotionProps } from 'framer-motion'
import { assets } from '../lib/assets'

export type TigerVariant = 'peek' | 'float' | 'corner' | 'cheer'

type TigerMascotProps = {
  variant?: TigerVariant
  className?: string
  /** Soft bob — use on at most one or two placements */
  animate?: boolean
  /** One-shot peek/slide when entering view */
  peekIn?: boolean
  size?: 'sm' | 'md' | 'lg'
  alt?: string
  /** Use B&W cutout — best on dark backgrounds */
  monochrome?: boolean
} & Omit<HTMLMotionProps<'div'>, 'children' | 'animate' | 'initial'>

const sizeClass = {
  sm: 'h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]',
  md: 'h-20 w-20 sm:h-24 sm:w-24',
  lg: 'h-28 w-28 sm:h-32 sm:w-32',
} as const

const variantSrc: Record<TigerVariant, { color: string; mono: string }> = {
  peek: { color: assets.tiger.peeking, mono: assets.tiger.peekingBw },
  float: { color: assets.tiger.sitting, mono: assets.tiger.sittingBw },
  corner: { color: assets.tiger.sitting, mono: assets.tiger.sittingBw },
  cheer: { color: assets.tiger.peeking, mono: assets.tiger.peekingBw },
}

export function TigerMascot({
  variant = 'float',
  className = '',
  animate = false,
  peekIn = false,
  size = 'md',
  alt = 'Motumo tiger cub mascot',
  monochrome = false,
  ...rest
}: TigerMascotProps) {
  const src = monochrome ? variantSrc[variant].mono : variantSrc[variant].color

  return (
    <motion.div
      className={`pointer-events-none select-none ${sizeClass[size]} ${className}`}
      aria-hidden={!alt ? true : undefined}
      initial={
        peekIn
          ? {
              opacity: 0,
              y: variant === 'peek' ? 28 : 14,
              x: variant === 'peek' ? -16 : 0,
              scale: 0.88,
            }
          : undefined
      }
      whileInView={peekIn ? { opacity: 1, y: 0, x: 0, scale: 1 } : undefined}
      viewport={peekIn ? { once: true, amount: 0.35 } : undefined}
      animate={
        animate
          ? {
              y: [0, -7, 0],
              rotate: variant === 'peek' ? [-2, 2.5, -2] : [0, 2.5, 0],
            }
          : undefined
      }
      transition={
        animate
          ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }
          : peekIn
            ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
            : undefined
      }
      {...rest}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-contain ${
          monochrome ? 'opacity-90' : 'mix-blend-screen'
        } ${variant === 'peek' ? 'object-bottom' : ''}`}
        draggable={false}
      />
    </motion.div>
  )
}
