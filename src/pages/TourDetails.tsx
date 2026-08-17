import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Plane,
  Check,
  X,
  Phone,
  ChevronRight,
  Users,
  Clock,
  Send,
} from 'lucide-react';
import { supabase, type Tour, type Agent, type TourApplication } from '@/lib/supabase';

function TourDetails() {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({ full_name: '', address: '', mobile_number: '' });
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      if (!id) return;
      setLoading(true);
      const [tourRes, agentsRes] = await Promise.all([
        supabase.from('tours').select('*').eq('id', id).maybeSingle(),
        supabase.from('agents').select('*').order('created_at', { ascending: true }),
      ]);
      if (tourRes.data) setTour(tourRes.data as Tour);
      if (agentsRes.data) setAgents(agentsRes.data as Agent[]);
      setLoading(false);
    };
    fetchTour();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (loading) {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-bold text-ink-500">Tour not found</p>
        <Link to="/tours" className="btn-primary"><ArrowLeft size={16} /> Back to Tours</Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumbs */}
      <section className="bg-ink-50 py-4">
        <div className="container-x flex max-w-7xl items-center gap-2 text-xs font-semibold text-ink-500">
          <Link to="/" className="transition hover:text-brand-600">Home</Link>
          <ChevronRight size={13} />
          <Link to="/tours" className="transition hover:text-brand-600">Tours</Link>
          <ChevronRight size={13} />
          <span className="text-ink-900">{tour.title}</span>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-x max-w-7xl py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
          <div className="overflow-hidden rounded-2xl bg-ink-100">
            <img src={tour.image_url || 'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=1200'} alt={tour.title} className="h-[400px] w-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-ink-100">
                <img src={`https://images.pexels.com/photos/${208700 + i * 100}/pexels-photo-${208700 + i * 100}.jpeg?auto=compress&cs=tinysrgb&w=400`} alt="" className="h-[90px] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x max-w-7xl pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Title Banner */}
            <div className="overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white">
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{tour.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm"><Clock size={14} /> {tour.duration}</span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm"><Users size={14} /> Max 10 People</span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur-sm"><MapPin size={14} /> {tour.tour_type}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Starting from</p>
                <div className="flex items-baseline gap-3">
                  <p className="font-display text-3xl font-extrabold text-brand-600">৳{tour.price.toLocaleString()}</p>
                  {tour.original_price && (
                    <p className="text-lg font-semibold text-ink-400 line-through">৳{tour.original_price.toLocaleString()}</p>
                  )}
                </div>
                <p className="text-xs text-ink-500">per person</p>
              </div>
            </div>

            {/* Tour Planning Box */}
            <div className="surface p-6">
              <h3 className="font-display text-lg font-extrabold text-ink-900">Tour Planning</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600"><Plane size={16} /></div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Starts From</p>
                    <p className="text-sm font-bold text-ink-900">Brisbane</p>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-dashed border-ink-200 pl-6 space-y-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Destination 1</p>
                    <p className="text-sm font-bold text-ink-900">{tour.destination}</p>
                  </div>
                  {tour.sub_destinations.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Sub Destinations</p>
                      <div className="flex flex-wrap gap-2">
                        {tour.sub_destinations.map((sub) => (
                          <span key={sub} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-bold text-ink-700">{sub}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Day-by-Day Accordion */}
            <div className="surface">
              <div className="border-b border-ink-100 p-6">
                <h3 className="font-display text-lg font-extrabold text-ink-900">Day-by-Day Itinerary</h3>
              </div>
              <div className="divide-y divide-ink-100">
                {(tour.itinerary && tour.itinerary.length > 0 ? tour.itinerary : Array.from({ length: 3 }, (_, i) => ({ day: i + 1, title: `Day ${i + 1}`, description: 'Explore the beautiful destination with guided tours and local experiences.' }))).map((item) => (
                  <div key={item.day}>
                    <button onClick={() => toggleDay(item.day)} className="flex w-full items-center justify-between p-5 text-left transition hover:bg-ink-50">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Day {item.day}</p>
                        <p className="text-sm font-bold text-ink-900">{item.title}</p>
                      </div>
                      <ChevronRight size={18} className={`shrink-0 text-ink-400 transition-transform ${expandedDay === item.day ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedDay === item.day && (
                      <div className="border-t border-ink-100 bg-ink-50/50 px-5 py-4">
                        <p className="text-sm leading-6 text-ink-600">{item.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Includes & Excludes */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="surface p-6">
                <h3 className="font-display text-base font-extrabold text-ink-900">Includes</h3>
                <ul className="mt-4 space-y-3">
                  {(tour.includes && tour.includes.length > 0 ? tour.includes : ['Return flights', 'Hotel accommodation', 'Daily breakfast', 'Guided tours', 'Travel insurance']).map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-ink-700">
                      <Check size={16} className="shrink-0 text-brand-500" strokeWidth={3} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface p-6">
                <h3 className="font-display text-base font-extrabold text-ink-900">Excludes</h3>
                <ul className="mt-4 space-y-3">
                  {(tour.excludes && tour.excludes.length > 0 ? tour.excludes : ['Visa fees', 'Travel insurance', 'Personal expenses', 'Tips and gratuities']).map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-ink-700">
                      <X size={16} className="shrink-0 text-pop-red" strokeWidth={3} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Call For Package Details */}
            <div className="surface p-6">
              <h3 className="font-display text-base font-extrabold text-ink-900">Call For Package Details</h3>
              <p className="mt-1 text-xs text-ink-500">Our dedicated travel experts are ready to assist you.</p>
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

            {/* Book Now Banner */}
            <div className="overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white">
              <h3 className="font-display text-base font-extrabold">{tour.title}</h3>
              <p className="mt-1 text-xs text-white/70">Submit your details and we will help you book this tour.</p>
              <button onClick={() => setApplyOpen(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-600 transition hover:bg-brand-50">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {applyOpen && (
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
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Tour Booking</p>
                    <h2 className="font-display mt-1 text-2xl font-extrabold text-ink-900">{tour.title}</h2>
                    <p className="mt-1 text-sm text-ink-500">Book this tour package</p>
                  </div>
                  <button onClick={() => { setApplyOpen(false); setSubmitted(false); setForm({ full_name: '', address: '', mobile_number: '' }); }} className="rounded-xl p-2 text-ink-400 transition hover:bg-ink-100"><X size={20} /></button>
                </div>
                <form className="mt-6 space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setSaving(true);
                  const payload: TourApplication = {
                    id: crypto.randomUUID(),
                    full_name: form.full_name,
                    address: form.address,
                    mobile_number: form.mobile_number,
                    tour_id: tour.id,
                    tour_title: tour.title,
                    status: 'new',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  };
                  await supabase.from('tour_applications').insert(payload);
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

export default TourDetails;
