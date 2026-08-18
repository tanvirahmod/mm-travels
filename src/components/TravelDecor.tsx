import type { ReactNode } from 'react';

/* A clean airplane silhouette used across the site */
export function PlaneMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16Z" />
    </svg>
  );
}

/* Soft floating cloud */
export function Cloud({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M30 52a18 18 0 0 1-2.4-35.8A22 22 0 0 1 70 18a16 16 0 0 1 22 15 14 14 0 0 1-2 27.9H30Z" />
    </svg>
  );
}

/* Dashed curved flight path with a plane at the tip */
export function FlightArc({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 104C40 40 90 24 150 40c34 9 60 6 82-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 10"
        opacity="0.7"
      />
      <g transform="translate(150 40) rotate(20)">
        <path
          d="M8 0 0-3l-2-.6v6.2L0 8l8-3-4-1 4-2-4-1Z"
          fill="currentColor"
          transform="scale(1.6)"
        />
      </g>
    </svg>
  );
}

/* Horizontal flight-path divider used between sections */
export function FlightDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ink-200 to-transparent" />
      <span className="mx-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-500 shadow-soft ring-1 ring-brand-100">
        <PlaneMark className="h-4 w-4" />
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ink-200 to-transparent" />
    </div>
  );
}

/* Circular "travel stamp" decoration */
export function TravelStamp({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <path id="stampCircle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
      <text fill="currentColor" fontSize="9" fontWeight="700" letterSpacing="2">
        <textPath href="#stampCircle" startOffset="0%">
          · MM TRAVELS · EST. 2010 · WORLDWIDE JOURNEYS ·
        </textPath>
      </text>
      <g transform="translate(46 46)">
        <PlaneMark className="h-7 w-7" />
      </g>
    </svg>
  );
}

/* Globe with longitude/latitude rings */
export function GlobeRing({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="52" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <ellipse cx="60" cy="60" rx="22" ry="52" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <ellipse cx="60" cy="60" rx="52" ry="22" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <line x1="8" y1="60" x2="112" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1="60" y1="8" x2="60" y2="112" stroke="currentColor" strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

/* Subtle dotted world-map style background texture (fixed, behind content) */
export function TravelTexture({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotGrid" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#1E63FF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotGrid)" />
      </svg>
      <GlobeRing className="absolute -right-24 -top-24 h-96 w-96 text-brand-500 opacity-[0.06]" />
      <GlobeRing className="absolute -left-28 bottom-10 h-80 w-80 text-brand-500 opacity-[0.05]" />
      <FlightArc className="absolute left-[6%] top-[38%] h-28 w-56 text-brand-500 opacity-[0.06]" />
      <FlightArc className="absolute right-[10%] bottom-[14%] h-24 w-48 -scale-x-100 text-brand-500 opacity-[0.05]" />
    </div>
  );
}

/* A small travel-flavored icon chip to decorate section eyebrows */
export function EyebrowIcon({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/70 text-brand-600 ${className}`}>
      {children}
    </span>
  );
}

/* Section eyebrow with a built-in flight icon */
export function TravelEyebrow({
  children,
  className = '',
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span className={`eyebrow ${className}`}>
      <span className="text-brand-600">{icon ?? <PlaneMark className="h-3.5 w-3.5" />}</span>
      {children}
    </span>
  );
}

/* Decorative flight/cloud accents for the dark page-hero banners */
export function PageHeroDecor({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-[5] overflow-hidden ${className}`} aria-hidden="true">
      <Cloud className="absolute -right-6 top-8 h-24 w-52 text-white/10 animate-float" />
      <Cloud className="absolute right-44 top-28 h-14 w-28 text-white/10 animate-float [animation-delay:1.6s]" />
      <PlaneMark className="absolute left-10 top-1/4 h-6 w-6 -rotate-12 text-brand-300/70 animate-float [animation-delay:.8s]" />
      <FlightArc className="absolute -left-10 bottom-20 h-32 w-64 -rotate-6 text-brand-300/30" />
      <FlightArc className="absolute right-[12%] top-16 h-24 w-48 -scale-x-100 text-brand-300/25 [animation-delay:1.2s]" />
      <GlobeRing className="absolute -right-16 -bottom-20 h-72 w-72 text-brand-300/10" />
    </div>
  );
}
