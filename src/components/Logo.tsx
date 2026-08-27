export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-start gap-0.5 ${className}`}>
      <span className="relative inline-flex items-center rounded-xl bg-motumo-red px-3 py-1.5 shadow-sm">
        <span className="font-display text-[1.15rem] font-semibold lowercase tracking-wide text-white sm:text-xl">
          motumo
        </span>
        <svg
          className="absolute -right-0.5 -top-2 h-4 w-5"
          viewBox="0 0 20 14"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 10C6 4 11 1.5 17 2.5"
            stroke="#6FBF4A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M12 1.5C14.5 1.8 16.5 3.2 17.5 5"
            stroke="#6FBF4A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </span>
  )
}
