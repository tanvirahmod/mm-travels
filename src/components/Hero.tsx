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
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import {
  supabase,
  type HeroSlide,
  type TourDestination,
  type TourType,
  type VisaCountry,
  type VisaType,
  type SiteSettings,
} from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { PlaneMark, Cloud, FlightArc } from '@/components/TravelDecor';

type TabId = 'tour' | 'flight' | 'hotel' | 'visa';

const tabs: { id: TabId; label: string; icon: typeof Briefcase }[] = [
  { id: 'tour', label: 'Tour', icon: Briefcase },
  { id: 'flight', label: 'Flight', icon: Plane },
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'visa', label: 'Visa', icon: FileText },
];

const AUTOPLAY_MS = 6000;

const defaultSlide: HeroSlide = {
  id: '',
  badge_text: 'Govt. Approved · License No-17539',
  headline: 'Explore The World With MM Travels & Tourism',
  headline_highlight: 'MM Travels',
  subtitle: 'Your Trusted Travel Partner',
  description: 'From flights and visas to holidays, hotels, and transfers — we handle every detail so you can simply enjoy the journey.',
  background_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  primary_btn_text: 'Explore Tour Packages',
  primary_btn_url: '/tours',
  secondary_btn_text: 'Book Your Visa',
  secondary_btn_url: '/visa',
  slide_order: 1,
  is_active: true,
  created_at: '',
  updated_at: '',
};

const fallbackBg = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80';

function Hero() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [destinations, setDestinations] = useState<TourDestination[]>([]);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);

  const [activeTab, setActiveTab] = useState<TabId>('tour');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedTourType, setSelectedTourType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedVisaType, setSelectedVisaType] = useState('');

  const total = slides.length;
  const slide = total ? slides[current] : defaultSlide;
  const bgUrl = slide.background_image_url || fallbackBg;

  useEffect(() => {
    supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('slide_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length) setSlides(data as HeroSlide[]);
      });

    supabase
      .from('site_settings')
      .select('hero_bg_image, hero_title, hero_subtitle, license_number, search_enabled, search_slide')
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as SiteSettings);
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

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, total]);

  const goTo = (i: number) => setCurrent(((i % total) + total) % total);
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const licenseText = settings?.license_number
    ? `Govt. Approved · License No-${settings.license_number}`
    : slide.badge_text;
  const headline = settings?.hero_title || slide.headline;
  const subtitle = settings?.hero_subtitle || slide.subtitle;

  const searchEnabled = settings?.search_enabled ?? true;
  const searchSlide = Math.max(1, settings?.search_slide ?? 1);

  const renderHeadline = () => {
    const h = headline;
    const highlight = slide.headline_highlight;
    if (highlight && h.includes(highlight)) {
      const idx = h.indexOf(highlight);
      return (
        <>
          {h.substring(0, idx)}
          <span className="text-brand-500">{highlight}</span>
          {h.substring(idx + highlight.length)}
        </>
      );
    }
    return h;
  };

  const renderCta = (text: string | null, url: string | null, primary: boolean) => {
    if (!text) return null;
    const className = primary
      ? 'inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-glow-sm transition hover:shadow-glow'
      : 'inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20';
    if (url && url.startsWith('/')) {
      return (
        <button onClick={() => navigate(url)} className={className}>
          {text}
          {primary && <ArrowRight size={16} />}
        </button>
      );
    }
    return (
      <a href={url || '#'} target={url ? '_blank' : undefined} rel="noreferrer" className={className}>
        {text}
        {primary && <ArrowRight size={16} />}
      </a>
    );
  };

  return (
    <section id="home" className="w-full pt-4 sm:pt-6">
      <div
        className="relative isolate mx-auto w-full max-w-[1440px] overflow-hidden rounded-3xl px-5 sm:px-6 lg:px-8 sm:min-h-[600px] lg:min-h-[720px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
      {/* Slide backgrounds (crossfade) — desktop + mobile layers */}
      {total > 0 ? (
        <>
          {/* Desktop / large screens */}
          {slides.map((s, i) => (
            <div
              key={`d-${s.id}`}
              aria-hidden
              className={`absolute inset-0 -z-20 hidden bg-cover bg-center transition-opacity duration-1000 ease-in-out sm:block ${
                i === current ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${s.background_image_url || fallbackBg})` }}
            >
              {s.headline && <div className="absolute inset-0 bg-slate-900/30" />}
            </div>
          ))}
          {/* Mobile / small screens (falls back to desktop image when no mobile url) */}
          {slides.map((s, i) => (
            <div
              key={`m-${s.id}`}
              aria-hidden
              className={`absolute inset-0 -z-20 block transition-opacity duration-1000 ease-in-out sm:hidden ${s.mobile_background_image_url ? 'bg-cover' : 'bg-contain bg-navy-900'} bg-center ${
                i === current ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${s.mobile_background_image_url || s.background_image_url || fallbackBg})` }}
            >
              {s.headline && <div className="absolute inset-0 bg-slate-900/30" />}
            </div>
          ))}
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 -z-20 hidden bg-cover bg-center sm:block"
            style={{ backgroundImage: `url(${bgUrl})` }}
          >
            {defaultSlide.headline && <div className="absolute inset-0 bg-slate-900/30" />}
          </div>
            <div
              className="absolute inset-0 -z-20 block bg-contain bg-center bg-navy-900 sm:hidden"
              style={{ backgroundImage: `url(${bgUrl})` }}
            >
            {defaultSlide.headline && <div className="absolute inset-0 bg-slate-900/30" />}
          </div>
        </>
      )}


      {/* Decorative flight & cloud accents */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Cloud className="absolute -right-8 top-8 h-28 w-56 text-white/10 animate-float" />
        <Cloud className="absolute right-40 top-36 h-16 w-32 text-white/10 animate-float [animation-delay:1.6s]" />
        <PlaneMark className="absolute left-8 top-1/3 h-6 w-6 -rotate-12 text-brand-300/70 animate-float [animation-delay:.8s]" />
        <FlightArc className="absolute -left-12 bottom-28 h-36 w-72 -rotate-6 text-brand-300/40" />
        <FlightArc className="absolute right-[14%] top-20 h-24 w-48 -scale-x-100 text-brand-300/30 [animation-delay:1.2s]" />
      </div>

      {/* Clickable slide link layer (only when the current slide has a link) */}
      {slide.link && (
        <button
          type="button"
          onClick={() => {
            const l = slide.link as string;
            if (l.startsWith('http://') || l.startsWith('https://')) {
              window.open(l, '_blank', 'noopener,noreferrer');
            } else {
              navigate(l);
            }
          }}
          aria-label={`Open ${slide.link}`}
          className="absolute inset-0 z-0 cursor-pointer"
        />
      )}

      {/* Floating glassmorphism navigation arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute bottom-5 left-5 z-30 hidden h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-glass backdrop-blur-md transition hover:bg-white/25 sm:flex"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute bottom-5 right-5 z-30 hidden h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-glass backdrop-blur-md transition hover:bg-white/25 sm:flex"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Slide navigation dots — centered at the bottom of the hero on every slide */}
      {total > 1 && (
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col py-10 pointer-events-none sm:min-h-[600px] sm:py-12 lg:min-h-[720px] lg:py-16">
        {/* Slide text content (vertically centered in the area above the search bar) */}
        <div className="flex flex-1 items-center">
          <div key={slide.id} className="max-w-3xl animate-fade-up text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
              <Sparkles size={14} className="text-brand-300" /> {licenseText}
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.75rem] lg:leading-[1.04]">
              {renderHeadline()}
            </h1>
            <p className="mt-5 text-lg font-semibold text-white/85">{subtitle}</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">{slide.description}</p>

            {(slide.primary_btn_text || slide.secondary_btn_text) && (
              <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
                {renderCta(slide.primary_btn_text, slide.primary_btn_url, true)}
                {renderCta(slide.secondary_btn_text, slide.secondary_btn_url, false)}
              </div>
            )}
          </div>
        </div>

        {/* Bottom overlay: search widget (controlled from admin — appears on the configured slide) */}
        <div className="pointer-events-auto relative z-20 mt-4">
          {searchEnabled && current === searchSlide - 1 && (
          <div className="w-full animate-fade-up">
            <div className="overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl shadow-slate-900/10 border border-slate-100/80">
              {/* Tabs */}
              <div className="flex border-b border-ink-100 bg-ink-50/60">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                      className={`relative flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold transition sm:py-3 sm:text-sm ${
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
              <div className="p-4 sm:p-6">
                {activeTab === 'tour' && (
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                    <label className="block flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Destination</span>
                      <div className="field-style mt-1">
                        <MapPin size={14} className="shrink-0 bg-brand-400" />
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Tour Type</span>
                      <div className="field-style mt-1">
                        <Luggage size={14} className="shrink-0 bg-brand-400" />
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Country</span>
                      <div className="field-style mt-1">
                        <Globe size={14} className="shrink-0 bg-brand-400" />
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Visa Type</span>
                      <div className="field-style mt-1">
                        <FileText size={14} className="shrink-0 bg-brand-400" />
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
          )}
        </div>
      </div>
      </div>
    </section>
  );
}

export default Hero;
