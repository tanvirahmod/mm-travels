import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { supabase, type TourDestination, type VisaCountry } from '@/lib/supabase';
import { PageHeroDecor } from '@/components/TravelDecor';

type DestinationItem = {
  id: string;
  name: string;
  type: 'tour' | 'visa';
};

function Destinations() {
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      const [toursRes, visasRes] = await Promise.all([
        supabase.from('tour_destinations').select('*').order('name', { ascending: true }),
        supabase.from('visa_countries').select('*').order('name', { ascending: true }),
      ]);

      const destinations: DestinationItem[] = [];

      if (toursRes.data) {
        (toursRes.data as TourDestination[]).forEach((d) => {
          destinations.push({ id: d.id, name: d.name, type: 'tour' });
        });
      }

      if (visasRes.data) {
        (visasRes.data as VisaCountry[]).forEach((d) => {
          destinations.push({ id: d.id, name: d.name, type: 'visa' });
        });
      }

      setItems(destinations);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    fetchDestinations();
  }, []);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-50" style={{ backgroundImage: `linear-gradient(110deg, rgba(2,6,23,.92), rgba(30,58,138,.5)), url(https://images.pexels.com/photos/17983843/pexels-photo-17983843.jpeg?auto=compress&cs=tinysrgb&w=1800)` }} />
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-60" />
        <PageHeroDecor />
        <div className="container-x max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Destinations</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Destinations</h1>
          <p className="lede mt-4 max-w-xl text-white/70">
            Explore tour destinations and visa services available worldwide — all managed directly from our admin panel.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="container-x max-w-7xl py-10 sm:py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={48} className="text-ink-300" />
            <p className="mt-4 text-lg font-bold text-ink-500">No destinations found</p>
            <p className="text-sm text-ink-500">Check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/packages?destination=${encodeURIComponent(item.name)}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={`https://loremflickr.com/900/600/${encodeURIComponent(item.name)}`} alt={item.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    {item.type === 'tour' ? 'Tour Destination' : 'Visa Country'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    {item.type === 'tour' ? (
                      <MapPin size={16} className="text-brand-600" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    )}
                    <h3 className="font-display text-base font-extrabold leading-tight text-ink-900">{item.name}</h3>
                  </div>
                  <p className="mt-2 text-xs text-ink-500">
                    {item.type === 'tour' ? 'Tour packages available for this destination' : 'Visa services available for this country'}
                  </p>
                  <div className="mt-auto flex items-center gap-1 pt-4 text-sm font-bold text-brand-600">
                    View Packages <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Destinations;
