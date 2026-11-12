import { useEffect } from 'react'
import { FlaskConical } from 'lucide-react'
import { useOrders } from '../context/OrdersContext'

/** Discrete always-on control to open the Test Orders panel (all templates). */
export function DevOrdersButton() {
  const { openOrdersPanel, orders } = useOrders()

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === '#orders') openOrdersPanel()
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [openOrdersPanel])

  return (
    <button
      type="button"
      onClick={openOrdersPanel}
      className="fixed bottom-5 left-4 z-[90] inline-flex items-center gap-2 rounded-full bg-plum-deep/95 px-3.5 py-2.5 font-display text-xs font-semibold text-motumo-yellow shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md transition hover:bg-plum-deep hover:text-white sm:left-5"
      title="View captured test orders"
    >
      <FlaskConical className="h-3.5 w-3.5" />
      <span>Dev: Orders{orders.length > 0 ? ` (${orders.length})` : ''}</span>
    </button>
  )
}
