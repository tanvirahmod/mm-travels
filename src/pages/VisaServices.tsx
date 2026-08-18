import { useState } from 'react';
import {
  Search,
  Clock,
  FileText,
  Briefcase,
  GraduationCap,
  Check,
  ChevronDown,
  X,
  Plane,
} from 'lucide-react';
import { useApp } from '@/components/AppContext';
import { useNavigate } from 'react-router-dom';

type VisaType = 'Tourist' | 'Business' | 'Student';

export type VisaInfo = {
  country: string;
  flag: string;
  types: VisaType[];
  processing: string;
  fee: string;
  duration: string;
  requirements: string[];
  popular: boolean;
};

export const visaData: VisaInfo[] = [
  {
    country: 'United Arab Emirates',
    flag: 'UAE',
    types: ['Tourist', 'Business'],
    processing: '3–5 working days',
    fee: '$90–$180',
    duration: '30–90 days',
    requirements: ['Valid passport (6+ months)', 'Passport-size photograph', 'Confirmed return ticket', 'Hotel booking confirmation', 'Bank statement (3 months)', 'For business: invitation letter'],
    popular: true,
  },
  {
    country: 'Saudi Arabia',
    flag: 'KSA',
    types: ['Tourist', 'Business'],
    processing: '5–7 working days',
    fee: '$120–$300',
    duration: '30–90 days',
    requirements: ['Valid passport (6+ months)', 'Two passport photos', 'Vaccination certificate (meningococcal)', 'Accommodation proof', 'Return ticket', 'For Umrah: special visa type'],
    popular: true,
  },
  {
    country: 'United Kingdom',
    flag: 'UK',
    types: ['Tourist', 'Business', 'Student'],
    processing: '15–20 working days',
    fee: '$130–$500',
    duration: '6 months – 5 years',
    requirements: ['Valid passport (6+ months)', 'Biometric appointment required', 'Financial evidence', 'Tuberculosis test (for some countries)', 'Travel itinerary', 'For student: CAS letter & IELTS'],
    popular: true,
  },
  {
    country: 'Schengen Area',
    flag: 'EU',
    types: ['Tourist', 'Business', 'Student'],
    processing: '10–15 working days',
    fee: '$90–$150',
    duration: '90 days (180-day period)',
    requirements: ['Valid passport (6+ months)', 'Schengen visa application form', 'Biometric photo', 'Travel medical insurance (€30,000+)', 'Proof of accommodation', 'Flight reservation', 'Financial proof (€60/day)'],
    popular: true,
  },
  {
    country: 'Malaysia',
    flag: 'MY',
    types: ['Tourist', 'Business', 'Student'],
    processing: '3–7 working days',
    fee: '$20–$100',
    duration: '30–90 days',
    requirements: ['Valid passport (6+ months)', 'Passport-size photo', 'Return ticket', 'Proof of funds', 'Hotel reservation', 'For student: university offer letter'],
    popular: false,
  },
  {
    country: 'Singapore',
    flag: 'SG',
    types: ['Tourist', 'Business'],
    processing: '3–5 working days',
    fee: '$30–$90',
    duration: '30–90 days',
    requirements: ['Valid passport (6+ months)', 'Digital photo', 'e-Visa application', 'Return ticket', 'Accommodation proof', 'Sponsor letter (if applicable)'],
    popular: false,
  },
  {
    country: 'United States',
    flag: 'US',
    types: ['Tourist', 'Business', 'Student'],
    processing: '7–30 working days',
    fee: '$160–$350',
    duration: 'Up to 10 years (B1/B2)',
    requirements: ['Valid passport (6+ months)', 'DS-160 form confirmation', 'Visa interview appointment', 'Photograph (per specifications)', 'Financial documentation', 'For student: I-20 form & SEVIS fee'],
    popular: true,
  },
  {
    country: 'Australia',
    flag: 'AU',
    types: ['Tourist', 'Business', 'Student'],
    processing: '14–28 working days',
    fee: '$150–$650',
    duration: '3 months – 4 years',
    requirements: ['Valid passport (6+ months)', 'Online application (ImmiAccount)', 'Biometrics (if requested)', 'Financial capacity evidence', 'Health insurance (OSHC for students)', 'For student: CoE document'],
    popular: false,
  },
];

const visaTypeIcons: Record<VisaType, typeof FileText> = {
  Tourist: Plane,
  Business: Briefcase,
  Student: GraduationCap,
};

const allVisaTypes: VisaType[] = ['Tourist', 'Business', 'Student'];

function VisaServices() {
  const { openEnquiry } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<VisaType | 'All'>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = visaData.filter((v) => {
    const matchesSearch = v.country.toLowerCase().includes(search.toLowerCase()) || v.flag.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || v.types.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <>
      {/* Page header */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-50" style={{ backgroundImage: `linear-gradient(110deg, rgba(2,6,23,.92), rgba(30,58,138,.5)), url(https://images.pexels.com/photos/2098953/pexels-photo-2098953.jpeg?auto=compress&cs=tinysrgb&w=1800)` }} />
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-60" />
        <div className="container-x max-w-7xl">
          <span className="eyebrow">Visa Services</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Visa requirements, simplified</h1>
          <p className="lede mt-4 max-w-xl text-white/70">Search by country to find detailed visa requirements for Tourist, Business, and Student visas. Our team handles the paperwork so you don&apos;t have to.</p>
        </div>
      </section>

      {/* Search & filter bar */}
      <section className="sticky top-[72px] z-20 border-b border-ink-100 bg-white/95 backdrop-blur-xl">
        <div className="container-x flex max-w-7xl flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 rounded-2xl border border-ink-200 bg-white px-4 py-2.5 transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/20 sm:min-w-[320px]">
            <Search size={18} className="shrink-0 text-brand-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries..."
              className="w-full border-0 bg-transparent p-0 text-sm font-medium text-ink-900 outline-none placeholder:text-ink-300"
            />
            {search && <button onClick={() => setSearch('')} className="text-ink-500 hover:text-ink-900"><X size={16} /></button>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTypeFilter('All')}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold transition ${typeFilter === 'All' ? 'bg-brand-gradient text-white shadow-glow-sm' : 'bg-ink-50 text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-white'}`}
            >
              All Types
            </button>
            {allVisaTypes.map((type) => {
              const Icon = visaTypeIcons[type];
              return (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ${typeFilter === type ? 'bg-brand-gradient text-white shadow-glow-sm' : 'bg-ink-50 text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-white'}`}
                >
                  <Icon size={13} /> {type}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container-x max-w-7xl py-10">
        <p className="mb-6 text-sm text-ink-500">
          {filtered.length} {filtered.length === 1 ? 'country' : 'countries'} found
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink-200 bg-white py-20 text-center">
            <Search size={32} className="mx-auto text-ink-300" />
            <p className="mt-4 font-bold text-ink-900">No countries found</p>
            <p className="mt-1 text-sm text-ink-500">Try a different search term or visa type.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((visa) => {
              const isOpen = expanded === visa.country;
              return (
                <div key={visa.country} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:shadow-soft">
                  <button
                    onClick={() => setExpanded(isOpen ? null : visa.country)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-sm font-bold text-brand-600">{visa.flag}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-extrabold text-ink-900">{visa.country}</h3>
                          {visa.popular && <span className="rounded-full bg-pop-red/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pop-red">Popular</span>}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {visa.types.map((type) => {
                            const Icon = visaTypeIcons[type];
                            return <span key={type} className="flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-bold text-brand-600"><Icon size={11} /> {type}</span>;
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden text-right sm:block">
                        <p className="text-xs text-ink-500">Processing</p>
                        <p className="text-sm font-bold text-ink-900">{visa.processing}</p>
                      </div>
                      <ChevronDown size={22} className={`shrink-0 text-ink-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-ink-100 bg-ink-50/50 px-5 py-6 sm:px-7 animate-fade-up">
                      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
                        <div className="space-y-4">
                          <div className="rounded-2xl bg-white p-4 shadow-soft border border-ink-100">
                            <div className="flex items-center gap-2 text-ink-500"><Clock size={15} /> <span className="text-xs font-bold uppercase tracking-wider">Processing Time</span></div>
                            <p className="mt-1 text-sm font-bold text-ink-900">{visa.processing}</p>
                          </div>
                          <div className="rounded-2xl bg-white p-4 shadow-soft border border-ink-100">
                            <div className="flex items-center gap-2 text-ink-500"><FileText size={15} /> <span className="text-xs font-bold uppercase tracking-wider">Visa Fee</span></div>
                            <p className="mt-1 text-sm font-bold text-ink-900">{visa.fee}</p>
                          </div>
                          <div className="rounded-2xl bg-white p-4 shadow-soft border border-ink-100">
                            <div className="flex items-center gap-2 text-ink-500"><Plane size={15} /> <span className="text-xs font-bold uppercase tracking-wider">Duration of Stay</span></div>
                            <p className="mt-1 text-sm font-bold text-ink-900">{visa.duration}</p>
                          </div>
                        </div>
                        <div>
                          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Required Documents</p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {visa.requirements.map((req) => (
                              <div key={req} className="flex items-start gap-2.5 rounded-xl bg-white p-3 text-sm text-ink-700 shadow-soft border border-ink-100">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600"><Check size={12} strokeWidth={3} /></span>
                                {req}
                              </div>
                            ))}
                          </div>
                            <button onClick={() => navigate(`/visa/${encodeURIComponent(visa.country)}`)} className="btn-primary mt-5">
                              Apply Now
                            </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default VisaServices;
