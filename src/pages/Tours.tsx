import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Plane, Search, Clock } from 'lucide-react';
import { supabase, type Tour } from '@/lib/supabase';

function Tours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const destinationFilter = searchParams.get('destination') || '';
  const tourTypeFilter = searchParams.get('tour_type') || '';

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      let query = supabase.from('tours').select('*').order('created_at', { ascending: false });

      if (destinationFilter) {
        query = query.eq('destination', destinationFilter);
      }
      if (tourTypeFilter) {
        query = query.eq('tour_type', tourTypeFilter);
      }

      const { data } = await query;
      if (data) setTours(data as Tour[]);
      setLoading(false);
    };
    fetchTours();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [destinationFilter, tourTypeFilter]);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative isolate overflow-hidden bg-ink-950 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-50" style={{ backgroundImage: `linear-gradient(110deg, rgba(2,6,23,.92), rgba(30,58,138,.5)), url(https://images.pexels.com/photos/17983843/pexels-photo-17983843.jpeg?auto=compress&cs=tinysrgb&w=1800)` }} />
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-60" />
        <div className="container-x max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Search: Tour</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Search: Tour</h1>
          <p className="lede mt-4 max-w-xl text-white/70">
            {destinationFilter && <span>Destination: <strong>{destinationFilter}</strong> &nbsp;</span>}
            {tourTypeFilter && <span>Type: <strong>{tourTypeFilter}</strong></span>}
            {!destinationFilter && !tourTypeFilter && 'Discover our curated collection of tour packages designed for unforgettable experiences.'}
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="container-x max-w-7xl py-10 sm:py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : tours.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={48} className="text-ink-300" />
            <p className="mt-4 text-lg font-bold text-ink-500">No tours found</p>
            <p className="text-sm text-ink-400">Try adjusting your filters or check back later for exciting tour packages.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <div key={tour.id} className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="relative h-48 overflow-hidden">
                  <img src={tour.image_url || 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=900'} alt={tour.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    {tour.duration}
                  </span>
                  <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-900 backdrop-blur-sm">
                    <MapPin size={12} className="text-brand-500" /> {tour.destination}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-extrabold leading-tight text-ink-900 line-clamp-2">{tour.title}</h3>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-500">
                    <Clock size={14} className="text-brand-500" /> {tour.duration}
                    <span className="text-ink-300">|</span>
                    <MapPin size={14} className="text-brand-500" /> {tour.destination}
                  </div>
                  <div className="mt-auto flex items-end justify-between border-t border-ink-100 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Price per person</p>
                      <p className="font-display text-xl font-extrabold text-brand-600">৳{tour.price.toLocaleString()}</p>
                    </div>
                    <Link to={`/tours/${tour.id}`} className="btn-primary">
                      View Details <Plane size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Tours;
