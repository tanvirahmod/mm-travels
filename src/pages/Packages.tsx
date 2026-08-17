import { useEffect, useState } from 'react';
import {
  Clock,
  Check,
  MessageCircle,
  Star,
  CalendarDays,
  Users,
  MapPin,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '@/components/AppContext';
import { supabase, type Tour, type VisaRequirement } from '@/lib/supabase';
import { useSearchParams } from 'react-router-dom';

const fallbackImage = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';

type StaticPkg = {
  id: string;
  title: string;
  category: string;
  duration: string;
  price: string;
  image: string;
  tag: string;
  inclusions: string[];
  description: string;
};

const staticPackages: StaticPkg[] = [
  {
    id: 'umrah-standard',
    title: 'Umrah Standard Package',
    category: 'Umrah',
    duration: '10 Days / 9 Nights',
    price: 'From $1,450',
    image: 'https://images.unsplash.com/photo-1591557303964-b5bc05cb9b51?auto=format&fit=crop&w=600&q=80',
    tag: 'Most Popular',
    inclusions: ['Return flights', '4-star hotel near Haram', 'Daily breakfast & dinner', 'Visa & insurance', 'Ground transfers', 'Guided Ziyarat tours'],
    description: 'A complete Umrah experience with comfortable accommodation steps from the Haram.',
  },
  {
    id: 'umrah-premium',
    title: 'Umrah Premium Package',
    category: 'Umrah',
    duration: '14 Days / 13 Nights',
    price: 'From $2,200',
    image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=600&q=80',
    tag: 'Premium',
    inclusions: ['Premium airline tickets', '5-star hotel overlooking Kaaba', 'Full board meals', 'Express visa processing', 'Private transfers', 'Personal guide'],
    description: 'Our finest Umrah journey with luxury accommodation and personalised service.',
  },
  {
    id: 'europe-classic',
    title: 'Europe Classic Tour',
    category: 'Europe',
    duration: '12 Days / 11 Nights',
    price: 'From $2,800',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    tag: 'Best Value',
    inclusions: ['Flights from Doha/Dhaka', '3-star hotels with breakfast', 'Schengen visa support', 'Paris, Rome & Barcelona', 'Hop-on hop-off passes', 'Daily guided excursions'],
    description: 'Explore the icons of Europe across three enchanting cities.',
  },
  {
    id: 'europe-deluxe',
    title: 'Europe Deluxe Escapade',
    category: 'Europe',
    duration: '15 Days / 14 Nights',
    price: 'From $3,900',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    tag: 'Extended',
    inclusions: ['Business class flights', '4-star boutique hotels', 'Fast-track Schengen visa', '6 cities across 4 countries', 'Private city tours', 'Wine tasting experiences'],
    description: 'An extended European adventure across six unforgettable cities.',
  },
  {
    id: 'asia-escape',
    title: 'Southeast Asia Escape',
    category: 'Asia',
    duration: '8 Days / 7 Nights',
    price: 'From $1,200',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80',
    tag: 'Quick Getaway',
    inclusions: ['Return flights', '4-star resort stays', 'Bangkok & Phuket', 'Visa on arrival support', 'Island hopping tour', 'Airport transfers'],
    description: 'Sun, temples, and street food across Thailand\'s most loved destinations.',
  },
  {
    id: 'asia-bali',
    title: 'Bali Bliss Package',
    category: 'Asia',
    duration: '7 Days / 6 Nights',
    price: 'From $980',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    tag: 'Tropical',
    inclusions: ['Return flights', 'Private pool villa', 'Ubud & Seminyak stays', 'Daily breakfast', 'Temple & rice terrace tours', 'Spa treatment included'],
    description: 'Rejuvenate in Bali with luxury villas, temples, and serene rice terraces.',
  },
];

type PackageItem = {
  id: string;
  title: string;
  category: string;
  duration: string;
  price: string;
  image: string;
  tag: string;
  inclusions: string[];
  description: string;
  link: string;
  isExternal: boolean;
  destination: string;
  note: string;
};

function Packages() {
  const { openEnquiry } = useApp();
  const [filter, setFilter] = useState<string>('All');
  const [items, setItems] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const destinationFilter = searchParams.get('destination') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [toursRes, visasRes] = await Promise.all([
        supabase.from('tours').select('*').order('created_at', { ascending: false }),
        supabase.from('visa_requirements').select('*').order('created_at', { ascending: false }),
      ]);

      const dynamicItems: PackageItem[] = [];

      if (toursRes.data) {
        (toursRes.data as Tour[]).forEach((tour) => {
          dynamicItems.push({
            id: `tour-${tour.id}`,
            title: tour.title,
            category: tour.tour_type || 'Tours',
            duration: tour.duration,
            price: `৳${tour.price.toLocaleString()}`,
            image: tour.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
            tag: 'Tour Package',
            inclusions: tour.includes.slice(0, 4),
            description: `${tour.destination} · ${tour.start_location || ''}`.trim(),
            link: `/tours/${tour.id}`,
            isExternal: false,
            destination: tour.destination,
          });
        });
      }

      if (visasRes.data) {
        (visasRes.data as VisaRequirement[]).forEach((req) => {
          dynamicItems.push({
            id: `visa-${req.id}`,
            title: `${req.country} Visa Application & Requirements For Bangladeshi`,
            category: req.visa_type || 'Visa',
            duration: 'Visa Service',
            price: `৳${req.fee.toLocaleString()}`,
            image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
            tag: 'Visa Service',
            inclusions: req.requirements.slice(0, 4).map((r) => r.title),
            description: `${req.country} · ${req.visa_type}`,
            link: `/visa/${req.id}`,
            isExternal: false,
            destination: req.country,
            note: req.note || '',
          });
        });
      }

      const merged = [...staticPackages, ...dynamicItems];
      setItems(merged);
      setLoading(false);
    };

    fetchData();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = items.filter((pkg) => {
    const matchCategory = filter === 'All' || pkg.category === filter;
    const matchDestination = !destinationFilter || pkg.destination === destinationFilter;
    return matchCategory && matchDestination;
  });

  return (
    <>
      {/* Page header */}
      <section className="relative isolate overflow-hidden bg-ink-950 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-50" style={{ backgroundImage: `linear-gradient(110deg, rgba(2,6,23,.92), rgba(30,58,138,.5)), url(https://images.pexels.com/photos/17983843/pexels-photo-17983843.jpeg?auto=compress&cs=tinysrgb&w=1800)` }} />
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-60" />
      <div className="container-x max-w-7xl">
        <span className="eyebrow">Travel Packages</span>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {destinationFilter ? `Packages in ${destinationFilter}` : 'Find your perfect journey'}
        </h1>
        <p className="lede mt-4 max-w-xl text-white/70">
          {destinationFilter ? `Showing all tours and visas available in ${destinationFilter}` : 'Explore our curated packages, tours, and visa services — all managed directly from our admin panel.'}
        </p>
        {destinationFilter && (
          <button
            onClick={() => window.history.back()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
          >
            ← Clear destination filter
          </button>
        )}
      </div>
      </section>

      {/* Filter + grid */}
      <section className="container-x max-w-7xl py-10 sm:py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                    filter === cat
                      ? 'bg-brand-gradient text-white shadow-glow-sm'
                      : 'bg-white text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pkg) => (
                <div key={pkg.id} className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-pop-red px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">{pkg.tag}</span>
                    {pkg.category && (
                      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-900 backdrop-blur-sm">
                        {pkg.category === 'Tours' || pkg.category === 'Visa' ? (
                          pkg.category === 'Tours' ? <MapPin size={12} className="text-brand-500" /> : <FileCheck2 size={12} className="text-brand-500" />
                        ) : null}
                        {pkg.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-extrabold text-ink-900 line-clamp-2">{pkg.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink-500 line-clamp-2">{pkg.description}</p>
                    {pkg.note && (
                      <p className="mt-1.5 text-xs font-semibold text-brand-600 line-clamp-1">Note: {pkg.note}</p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-ink-500">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-500" /> {pkg.duration}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Inclusions</p>
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {pkg.inclusions.slice(0, 4).map((inc) => (
                          <div key={inc} className="flex items-center gap-2 text-xs text-ink-600">
                            <Check size={13} className="shrink-0 text-brand-500" strokeWidth={3} /> {inc}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5 flex items-end justify-between border-t border-ink-100 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Starting from</p>
                        <p className="font-display text-xl font-extrabold text-brand-600">{pkg.price}</p>
                      </div>
                      {pkg.isExternal ? (
                        <button onClick={openEnquiry} className="btn-primary">
                          <MessageCircle size={15} /> Inquire
                        </button>
                      ) : (
                        <a href={pkg.link} className="btn-primary">
                          View Details <Clock size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Feature strip */}
      <section className="bg-brand-gradient-soft py-12">
        <div className="container-x grid max-w-7xl gap-5 sm:grid-cols-3">
          {[
            { icon: CalendarDays, title: 'Flexible Dates', text: 'Travel when it suits you' },
            { icon: Star, title: 'Curated Itineraries', text: 'Hand-picked experiences' },
            { icon: Users, title: 'Group Discounts', text: 'Save more together' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-ink-100 transition hover:shadow-card">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600"><Icon size={22} /></div>
              <div><p className="font-bold text-ink-900">{title}</p><p className="text-sm text-ink-500">{text}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Packages;
