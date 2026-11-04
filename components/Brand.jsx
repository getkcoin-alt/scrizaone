// Production vector interpretation of the approved S/1 identity.
// One geometry is shared by the wordmark, hero artwork and favicon.
export function BrandMark({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 100 84" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M98 2H36C16 2 5 15 5 32c0 15 11 25 27 25h20V45h-5l19-12v27c0 5-3 8-9 8H18L2 82h60c21 0 33-13 33-31 0-16-12-27-28-27h-1L37 42h-7c-5 0-8-4-8-9s4-9 10-9h45Z" />
    </svg>
  );
}

export default function Brand() {
  return (
    <span className="brand-lockup" aria-hidden="true">
      <BrandMark className="brand-mark" />
      <span className="brand-name">SCRIZA<span>ONE</span></span>
    </span>
  );
}
