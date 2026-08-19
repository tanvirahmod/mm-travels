import { useRef, type CSSProperties, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  color?: string;
};

export default function SpotlightCard({ children, className = '', color = 'rgba(37,211,102,0.10)' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden ${className}`}
      style={{ '--mx': '50%', '--my': '50%' } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(380px circle at var(--mx) var(--my), ${color}, transparent 45%)` }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
