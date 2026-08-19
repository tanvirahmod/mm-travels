import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { TravelStamp, PlaneMark } from '@/components/TravelDecor';

function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-900">
      <div className="pointer-events-none absolute inset-0 bg-mesh-pop opacity-30" />
      <TravelStamp className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 text-brand-300/10 [animation:none]" />
      <PlaneMark className="pointer-events-none absolute left-10 bottom-10 h-8 w-8 -rotate-12 text-brand-300/40" />
      <div className="container-x relative mx-auto max-w-7xl text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
          <Compass size={16} /> Lost in transit
        </p>
        <h1 className="mt-4 font-display text-7xl font-extrabold tracking-tight text-white sm:text-8xl">404</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60">
          We couldn&apos;t find the page you were looking for. It may have moved, or the link might be incorrect.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          <Home size={16} /> Back to homepage
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
