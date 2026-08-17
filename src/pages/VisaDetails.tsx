import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Check,
  Phone,
  ChevronRight,
  FileText,
  Send,
  X,
} from 'lucide-react';
import { supabase, type VisaRequirement, type Agent, type VisaApplication } from '@/lib/supabase';
import { visaData, type VisaInfo } from './VisaServices';

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

function visaInfoToRequirement(info: VisaInfo): VisaRequirement {
  const feeMatch = info.fee.match(/\d+/);
  return {
    id: 'fallback-' + info.country,
    country: info.country,
    visa_type: info.types[0],
    fee: feeMatch ? parseFloat(feeMatch[0]) : 0,
    service_charge: 0,
    requirements: info.requirements.map((req) => ({ title: req, detail: '' })),
    note: '',
  };
}

function VisaDetails() {
  const { id } = useParams<{ id: string }>();
  const [visa, setVisa] = useState<VisaRequirement | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<{ country: string; visaType: string } | null>(null);
  const [form, setForm] = useState({ full_name: '', address: '', mobile_number: '' });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVisa = async () => {
      if (!id) return;
      setLoading(true);
      const decodedId = decodeURIComponent(id).trim();

      let visaDataResult: VisaRequirement | null = null;

      if (decodedId.includes('-')) {
        const { data } = await supabase.from('visa_requirements').select('*').eq('id', decodedId).maybeSingle();
        if (data) visaDataResult = data as VisaRequirement;
      }

      if (!visaDataResult) {
        const { data } = await supabase.from('visa_requirements').select('*').ilike('country', decodedId).limit(1).maybeSingle();
        if (data) visaDataResult = data as VisaRequirement;
      }

      if (!visaDataResult) {
        const fallback = visaData.find((v) => v.country.toLowerCase() === decodedId.toLowerCase());
        if (fallback) visaDataResult = visaInfoToRequirement(fallback);
      }

      setVisa(visaDataResult);
      const { data: agentsData } = await supabase.from('agents').select('*').order('created_at', { ascending: true });
      if (agentsData) setAgents(agentsData as Agent[]);
      setLoading(false);
    };
    fetchVisa();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!visa) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold text-ink-500">Visa requirements not found</p>
        <Link to="/visa" className="btn-primary"><ArrowLeft size={16} /> Back to Visa Search</Link>
      </div>
    );
  }

  const serviceCharge = visa.service_charge || 0;
  const total = visa.fee + serviceCharge;

  return (
    <>
      {/* Breadcrumbs */}
      <section className="bg-ink-50 py-4">
        <div className="container-x flex max-w-7xl items-center gap-2 text-xs font-semibold text-ink-500">
          <Link to="/" className="transition hover:text-brand-600">Home</Link>
          <ChevronRight size={13} />
          <Link to="/visa" className="transition hover:text-brand-600">Search: Visa</Link>
          <ChevronRight size={13} />
          <span className="text-ink-900">{visa.country}</span>
        </div>
      </section>

      {/* Header Summary */}
      <section className="container-x max-w-7xl py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-4xl">
              {getFlagEmoji(visa.country)}
            </div>
            <div>
              <h1 className="font-display text-2xl font-extrabold leading-tight text-ink-900 sm:text-3xl">{visa.country} Visa Application & Requirements For Bangladeshi</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700"><MapPin size={13} /> {visa.country}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-xs font-bold text-ink-700"><FileText size={13} /> {visa.visa_type}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x max-w-7xl pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content - Left 70% */}
          <div className="space-y-8">
              {/* Documents Section */}
              <div className="surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-extrabold text-ink-900">
                  {visa.country} Visa Apply for Bangladeshi Required Documents
                </h2>
                <div className="mt-6 space-y-5">
                 {(visa.requirements && visa.requirements.length > 0 ? visa.requirements : [{ title: 'Passport', detail: 'Must be valid for at least 6 months from the date of travel.' }]).map((req, idx) => (
                   <div key={idx} className="flex items-start gap-3">
                     <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                       <Check size={14} strokeWidth={3} />
                     </span>
                     <div>
                       <p className="text-sm font-bold text-ink-900">{req.title}</p>
                       <p className="mt-0.5 text-sm leading-6 text-ink-600">{req.detail}</p>
                     </div>
                   </div>
                 ))}
               </div>
               {visa.note && (
                 <div className="mt-6 rounded-xl bg-brand-50 p-4 text-sm font-semibold text-brand-700">
                   <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-500">Note</span>
                   {visa.note}
                 </div>
               )}
             </div>
          </div>

          {/* Sidebar - Right 30% */}
          <div className="space-y-6">
            {/* Cost Summary Card */}
            <div className="surface p-6">
              <h3 className="font-display text-base font-extrabold text-ink-900">Cost Summary</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
                  <span className="text-sm font-semibold text-ink-600">Visa Fee</span>
                  <span className="text-sm font-bold text-ink-900">৳{visa.fee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3">
                  <span className="text-sm font-semibold text-ink-600">Service Charge</span>
                  <span className="text-sm font-bold text-ink-900">৳{serviceCharge.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                  <span className="text-sm font-bold text-brand-700">Total</span>
                  <span className="text-base font-extrabold text-brand-600">৳{total.toLocaleString()}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-ink-400">*Fees are subject to change by the embassy.</p>
            </div>

            {/* Call For Visa Information */}
            <div className="surface p-6">
              <h3 className="font-display text-base font-extrabold text-ink-900">Call For Visa Information</h3>
              <p className="mt-1 text-xs text-ink-500">Our visa experts are here to help you with the application process.</p>
              <div className="mt-4 space-y-3">
                {agents.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between rounded-xl border border-ink-100 bg-ink-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-ink-900">{agent.name}</p>
                      <p className="text-xs text-ink-500">{agent.phone}</p>
                    </div>
                    <a href={`tel:${agent.phone}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white transition hover:bg-brand-600">
                      <Phone size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Now Banner */}
            <div className="overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white">
              <h3 className="font-display text-base font-extrabold">{visa.country} Visa</h3>
              <p className="mt-1 text-xs text-white/70">Submit your details and we will process your visa application.</p>
              {visa && (
                <button onClick={() => { setSelectedVisa({ country: visa.country, visaType: visa.visa_type }); setApplyOpen(true); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-600 transition hover:bg-brand-50">
                  Start Application
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {applyOpen && selectedVisa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 px-5 py-8 backdrop-blur-sm" onClick={() => { setApplyOpen(false); setSubmitted(false); setForm({ full_name: '', address: '', mobile_number: '' }); }}>
          <div className="w-full max-w-lg animate-fade-up rounded-3xl bg-white p-6 shadow-glass sm:p-8 border border-ink-100" onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="my-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600"><Check size={28} /></div>
                <h3 className="mt-4 text-lg font-extrabold text-ink-900">Thank You for Applying</h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">We Will Call You Soon</p>
                <button onClick={() => { setApplyOpen(false); setSubmitted(false); setForm({ full_name: '', address: '', mobile_number: '' }); }} className="mt-6 rounded-xl bg-ink-900 px-5 py-3 text-sm font-bold text-white">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Visa Application</p>
                    <h2 className="font-display mt-1 text-2xl font-extrabold text-ink-900">{selectedVisa.country}</h2>
                    <p className="mt-1 text-sm text-ink-500">{selectedVisa.visaType} Visa</p>
                  </div>
                  <button onClick={() => { setApplyOpen(false); setSubmitted(false); setForm({ full_name: '', address: '', mobile_number: '' }); }} className="rounded-xl p-2 text-ink-400 transition hover:bg-ink-100"><X size={20} /></button>
                </div>
                <form className="mt-6 space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setSaving(true);
                  const payload: VisaApplication = {
                    id: crypto.randomUUID(),
                    full_name: form.full_name,
                    address: form.address,
                    mobile_number: form.mobile_number,
                    country: selectedVisa.country,
                    visa_type: selectedVisa.visaType,
                    status: 'new',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  };
                  await supabase.from('visa_applications').insert(payload);
                  setSaving(false);
                  setSubmitted(true);
                }}>
                  <label className="block text-xs font-bold text-ink-600">Full Name
                    <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="field-style mt-1.5 w-full" placeholder="Enter your full name" />
                  </label>
                  <label className="block text-xs font-bold text-ink-600">Address
                    <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="field-style mt-1.5 w-full resize-none" rows={3} placeholder="Enter your address" />
                  </label>
                  <label className="block text-xs font-bold text-ink-600">Mobile Number
                    <input required value={form.mobile_number} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} className="field-style mt-1.5 w-full" placeholder="Enter your mobile number" />
                  </label>
                  <button type="submit" className="btn-primary w-full" disabled={saving}>
                    {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><Send size={16} /> Submit Application</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default VisaDetails;
