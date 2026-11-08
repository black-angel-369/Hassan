/** Monogram: a hexagonal "shield" outline with an inner node. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25L16 2.5Z" stroke="url(#lg)" strokeWidth="1.5" />
      <path d="M16 9.5 22 13v6l-6 3.5-6-3.5v-6l6-3.5Z" stroke="currentColor" strokeOpacity=".5" strokeWidth="1" />
      <circle cx="16" cy="16" r="2.2" fill="#67e8f9" />
      <defs>
        <linearGradient id="lg" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="1" stopColor="#8b8cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
