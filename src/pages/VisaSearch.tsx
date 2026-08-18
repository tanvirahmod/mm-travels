import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plane, Search } from 'lucide-react';
import { supabase, type VisaRequirement } from '@/lib/supabase';
import { PageHeroDecor } from '@/components/TravelDecor';

const fallbackImage = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';

const countryCodeMap: Record<string, string> = {
  'United Arab Emirates': 'AE',
  'Saudi Arabia': 'SA',
  'United Kingdom': 'GB',
  'Schengen Area': 'EU',
  'Malaysia': 'MY',
  'Singapore': 'SG',
  'United States': 'US',
  'Australia': 'AU',
  'India': 'IN',
  'Bangladesh': 'BD',
  'Qatar': 'QA',
  'Thailand': 'TH',
  'Turkey': 'TR',
  'Indonesia': 'ID',
  'Canada': 'CA',
};

function getFlagEmoji(countryName: string): string {
  const code = countryCodeMap[countryName];
  if (!code) return '🌍';
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getFlagImageUrl(countryName: string): string {
  const code = countryCodeMap[countryName];
  if (!code) return fallbackImage;
  return `https://flagcdn.com/w640/${code.toLowerCase()}.png`;
}

function VisaSearch() {
  const [requirements, setRequirements] = useState<VisaRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const countryFilter = searchParams.get('country') || '';
  const visaTypeFilter = searchParams.get('visa_type') || '';

  useEffect(() => {
    const fetchRequirements = async () => {
      setLoading(true);
      let query = supabase
        .from('visa_requirements')
        .select('*')
        .order('created_at', { ascending: false });

      if (countryFilter) {
        query = query.eq('country', countryFilter);
      }
      if (visaTypeFilter) {
        query = query.eq('visa_type', visaTypeFilter);
      }

      const { data } = await query;
      if (data) setRequirements(data as VisaRequirement[]);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    fetchRequirements();
  }, [countryFilter, visaTypeFilter]);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-50" style={{ backgroundImage: `linear-gradient(110deg, rgba(2,6,23,.92), rgba(30,58,138,.5)), url(https://images.pexels.com/photos/2098953/pexels-photo-2098953.jpeg?auto=compress&cs=tinysrgb&w=1800)` }} />
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-60" />
        <PageHeroDecor />
        <div className="container-x max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Search: Visa</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Search: Visa</h1>
          <p className="lede mt-4 max-w-xl text-white/70">
            {countryFilter && <span>Country: <strong>{countryFilter}</strong> &nbsp;</span>}
            {visaTypeFilter && <span>Type: <strong>{visaTypeFilter}</strong></span>}
            {!countryFilter && !visaTypeFilter && 'Find visa requirements, fees, and application details for countries worldwide.'}
          </p>
        </div>
      </section>

      {/* Visa Cards Grid */}
      <section className="container-x max-w-7xl py-10 sm:py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          </div>
        ) : requirements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search size={48} className="text-ink-300" />
            <p className="mt-4 text-lg font-bold text-ink-500">No visa requirements found</p>
            <p className="text-sm text-ink-500">Check back later or contact us for custom visa inquiries.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requirements.map((req) => (
              <div key={req.id} className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                <div className="relative h-48 overflow-hidden bg-brand-50">
                  <img 
                    src={getFlagImageUrl(req.country)} 
                    alt={req.country}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-xl">
                      {getFlagEmoji(req.country)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-extrabold leading-tight text-ink-900 line-clamp-2">{req.country} Visa</h3>
                      <p className="text-xs text-ink-500">{req.visa_type}</p>
                    </div>
                  </div>
                  {req.note && (
                    <p className="mt-3 text-xs text-ink-600 line-clamp-2">{req.note}</p>
                  )}
                  <div className="mt-auto flex items-end justify-between border-t border-ink-100 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Starting From</p>
                      <p className="font-display text-xl font-extrabold text-brand-600">৳{req.fee.toLocaleString()} <span className="text-xs font-normal text-ink-500">Per Person</span></p>
                    </div>
                    <button onClick={() => navigate(`/visa/${req.id}`)} className="btn-primary">
                      Apply Now <Plane size={15} />
                    </button>
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

export default VisaSearch;
