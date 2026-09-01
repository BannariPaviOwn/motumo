import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { TIGER_CHEER_MS } from '../lib/tigerCheer'
import { TigerMascot } from './TigerMascot'

export function TigerCheerOverlay() {
  const { cheerId } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!cheerId) return
    setVisible(true)
    const t = window.setTimeout(() => setVisible(false), TIGER_CHEER_MS)
    return () => window.clearTimeout(t)
  }, [cheerId])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={cheerId}
          className="pointer-events-none fixed right-4 bottom-4 z-[80] sm:right-8 sm:bottom-8"
          initial={{ opacity: 0, scale: 0.55, y: 28, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          aria-live="polite"
        >
          <div className="relative">
            <TigerMascot variant="cheer" size="lg" animate={false} alt="" />
            <motion.span
              className="absolute -top-2 -left-1 rounded-full bg-motumo-red px-2.5 py-1 font-display text-xs font-bold text-white shadow-md"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -6 }}
              transition={{ delay: 0.08, type: 'spring', stiffness: 420, damping: 16 }}
            >
              Yeah!
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
