import { useEffect, useState } from 'react';
import {
  Briefcase,
  FileText,
  Globe,
  Luggage,
  MapPin,
  Plane,
  Search,
  Sparkles,
  Hotel,
} from 'lucide-react';
import { supabase, type HeroContent, type TourDestination, type TourType, type VisaCountry, type VisaType } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

type TabId = 'tour' | 'flight' | 'hotel' | 'visa';

const tabs: { id: TabId; label: string; icon: typeof Briefcase }[] = [
  { id: 'tour', label: 'Tour', icon: Briefcase },
  { id: 'flight', label: 'Flight', icon: Plane },
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'visa', label: 'Visa', icon: FileText },
];

const defaultContent: HeroContent = {
  id: '',
  badge_text: 'Govt. Approved · License No-17539',
  headline: 'Explore The World With MM Travels & Tourism',
  headline_highlight: 'MM Travels',
  subtitle: 'Your Trusted Travel Partner',
  description: 'From flights and visas to holidays, hotels, and transfers — we handle every detail so you can simply enjoy the journey.',
  background_image_url: 'https://images.pexels.com/photos/31711206/pexels-photo-31711206.jpeg?auto=compress&cs=tinysrgb&w=1800',
  feature_tags: ['Flights', 'Visa', 'Umrah', 'Holidays', 'Hotels', 'Transfers'],
  created_at: '',
  updated_at: '',
};

function Hero() {
  const [activeTab, setActiveTab] = useState<TabId>('tour');
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [destinations, setDestinations] = useState<TourDestination[]>([]);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedTourType, setSelectedTourType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisaType, setSelectedVisaType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from('hero_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setContent(data as HeroContent);
      });

    const loadLookups = async () => {
      const [destRes, typeRes, countryRes, vtypeRes] = await Promise.all([
        supabase.from('tour_destinations').select('*').order('name'),
        supabase.from('tour_types').select('*').order('name'),
        supabase.from('visa_countries').select('*').order('name'),
        supabase.from('visa_types').select('*').order('name'),
      ]);
      if (destRes.data) setDestinations(destRes.data);
      if (typeRes.data) setTourTypes(typeRes.data);
      if (countryRes.data) setCountries(countryRes.data);
      if (vtypeRes.data) setVisaTypes(vtypeRes.data);
    };

    loadLookups();
  }, []);

  const renderHeadline = () => {
    const h = content.headline;
    const highlight = content.headline_highlight;
    if (highlight && h.includes(highlight)) {
      const idx = h.indexOf(highlight);
      return (
        <>
          {h.substring(0, idx)}
          <span className="bg-gradient-to-r from-brand-500 to-pop-red bg-clip-text text-transparent">{highlight}</span>
          {h.substring(idx + highlight.length)}
        </>
      );
    }
    return h;
  };

  return (
    <section id="home" className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(125deg, rgba(2,6,23,.92) 0%, rgba(15,23,42,.78) 45%, rgba(30,58,138,.55) 100%), url(${content.background_image_url})`,
        }}
      />
      <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-70" />
      <div className="absolute inset-x-0 -bottom-px -z-10 h-24 bg-gradient-to-t from-white to-transparent" />

      <div className="container-x max-w-7xl pt-20 pb-16 sm:pt-28 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          {/* Hero text */}
          <div className="max-w-3xl text-white">
            <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
              <Sparkles size={14} className="text-brand-300" /> {content.badge_text}
            </div>
            <h1 className="animate-fade-up font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.75rem] lg:leading-[1.04]">
              {renderHeadline()}
            </h1>
            <p className="mt-5 text-lg font-semibold text-white/85">{content.subtitle}</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">{content.description}</p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {content.feature_tags.map((label) => {
                const featureTagIcons: Record<string, typeof Plane> = {
                  Flights: Plane,
                  Visa: FileText,
                  Umrah: Briefcase,
                  Holidays: Briefcase,
                  Hotels: Hotel,
                  Transfers: Plane,
                };
                const Icon = featureTagIcons[label] ?? Plane;
                return (
                  <span
                    key={label}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:border-brand-500/50 hover:bg-white/15"
                  >
                    <Icon size={15} className="text-brand-300" />
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Stats / trust strip */}
          <div className="hidden lg:flex items-center gap-6 pb-2">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '50K+', label: 'Happy Travelers' },
              { value: '120+', label: 'Destinations' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search & booking card */}
        <div className="mt-6 w-full animate-fade-up sm:mt-8">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
            {/* Tabs */}
            <div className="flex border-b border-ink-100 bg-ink-50/60">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-xs font-bold transition sm:text-sm ${
                    activeTab === id
                      ? 'rounded-t-2xl bg-white text-brand-600 shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.05)]'
                      : 'text-ink-500 hover:bg-ink-100/60 hover:text-ink-900'
                  }`}
                >
                  <Icon size={16} strokeWidth={activeTab === id ? 2.4 : 1.8} />
                  <span className="hidden sm:inline">{label}</span>
                  {activeTab === id && (
                    <span className="absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-brand-gradient" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-3 sm:p-4">
              {activeTab === 'tour' && (
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                  <label className="block flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Destination</span>
                    <div className="field-style mt-1">
                      <MapPin size={14} className="shrink-0 text-brand-500" />
                      <select value={selectedDestination} onChange={(e) => setSelectedDestination(e.target.value)} className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-ink-900 outline-none">
                        <option value="">All destinations</option>
                        {destinations.length > 0 ? (
                          destinations.map((dest) => (
                            <option key={dest.id} value={dest.name}>{dest.name}</option>
                          ))
                        ) : (
                          <option>No destinations available</option>
                        )}
                      </select>
                    </div>
                  </label>
                  <label className="block flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Tour Type</span>
                    <div className="field-style mt-1">
                      <Luggage size={14} className="shrink-0 text-brand-500" />
                      <select value={selectedTourType} onChange={(e) => setSelectedTourType(e.target.value)} className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-ink-900 outline-none">
                        <option value="">All types</option>
                        {tourTypes.length > 0 ? (
                          tourTypes.map((type) => (
                            <option key={type.id} value={type.name}>{type.name}</option>
                          ))
                        ) : (
                          <option>No tour types available</option>
                        )}
                      </select>
                    </div>
                  </label>
                  <button onClick={() => navigate(`/tours?destination=${encodeURIComponent(selectedDestination)}&tour_type=${encodeURIComponent(selectedTourType)}`)} className="btn-primary px-6 py-2.5 text-sm shadow-md hover:shadow-lg">
                    <Search size={16} />
                    <span>Search</span>
                  </button>
                </div>
              )}

              {activeTab === 'flight' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm font-semibold text-ink-500">
                    Flight booking inquiry available via direct contact or WhatsApp.
                  </p>
                </div>
              )}

              {activeTab === 'hotel' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm font-semibold text-ink-500">
                    Hotel booking inquiry available via direct contact or WhatsApp.
                  </p>
                </div>
              )}

              {activeTab === 'visa' && (
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                  <label className="block flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Country</span>
                    <div className="field-style mt-1">
                      <Globe size={14} className="shrink-0 text-brand-500" />
                      <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-ink-900 outline-none">
                        <option value="">All countries</option>
                        {countries.length > 0 ? (
                          countries.map((country) => (
                            <option key={country.id} value={country.name}>{country.name}</option>
                          ))
                        ) : (
                          <option>No countries available</option>
                        )}
                      </select>
                    </div>
                  </label>
                  <label className="block flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Visa Type</span>
                    <div className="field-style mt-1">
                      <FileText size={14} className="shrink-0 text-brand-500" />
                      <select value={selectedVisaType} onChange={(e) => setSelectedVisaType(e.target.value)} className="w-full cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-ink-900 outline-none">
                        <option value="">All types</option>
                        {visaTypes.length > 0 ? (
                          visaTypes.map((type) => (
                            <option key={type.id} value={type.name}>{type.name}</option>
                          ))
                        ) : (
                          <option>No visa types available</option>
                        )}
                      </select>
                    </div>
                  </label>
                  <button onClick={() => navigate(`/visa?country=${encodeURIComponent(selectedCountry)}&visa_type=${encodeURIComponent(selectedVisaType)}`)} className="btn-primary px-6 py-2.5 text-sm shadow-md hover:shadow-lg">
                    <Search size={16} />
                    <span>Search</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
