import { NavLink } from 'react-router-dom'

const templates = [
  { to: '/', label: 'T1', name: 'Playful shop' },
  { to: '/template2', label: 'T2', name: 'Premium atelier' },
  { to: '/template3', label: 'T3', name: 'Premium maison' },
] as const

export function TemplateSwitcher() {
  return (
    <div className="fixed bottom-5 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-1 rounded-full bg-plum-deep/95 p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-md">
      <span className="hidden px-3 font-display text-[10px] font-semibold tracking-[0.18em] text-motumo-yellow uppercase sm:inline">
        Templates
      </span>
      {templates.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          title={t.name}
          className={({ isActive }) =>
            `rounded-full px-3.5 py-2 font-display text-xs font-semibold transition sm:px-4 ${
              isActive
                ? 'bg-motumo-yellow text-plum-deep'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <span className="sm:hidden">{t.label}</span>
          <span className="hidden sm:inline">{t.name}</span>
        </NavLink>
      ))}
    </div>
  )
}
