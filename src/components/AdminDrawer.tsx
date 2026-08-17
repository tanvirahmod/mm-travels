import { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Settings2,
  Briefcase,
  FileText,
  Globe,
  MapPin,
  Luggage,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type {
  TourDestination,
  TourType,
  VisaCountry,
  VisaType,
  Tour,
  VisaRequirement,
} from '@/lib/supabase';

type DrawerTab = 'lookups' | 'tours' | 'visas';

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
}

function AdminDrawer({ open, onClose }: AdminDrawerProps) {
  const [tab, setTab] = useState<DrawerTab>('lookups');
  const [loading, setLoading] = useState(false);

  const [destinations, setDestinations] = useState<TourDestination[]>([]);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [newDestination, setNewDestination] = useState('');
  const [newTourType, setNewTourType] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newVisaType, setNewVisaType] = useState('');

  const [tours, setTours] = useState<Tour[]>([]);
  const [tourTitle, setTourTitle] = useState('');
  const [tourDestination, setTourDestination] = useState('');
  const [tourType, setTourType] = useState('');
  const [tourDuration, setTourDuration] = useState('');
  const [tourPrice, setTourPrice] = useState('');
  const [tourOriginalPrice, setTourOriginalPrice] = useState('');
  const [tourImageUrl, setTourImageUrl] = useState('');
  const [tourIncludes, setTourIncludes] = useState('');
  const [tourExcludes, setTourExcludes] = useState('');

  const [visaReqs, setVisaReqs] = useState<VisaRequirement[]>([]);
  const [visaCountry, setVisaCountry] = useState('');
  const [visaType, setVisaType] = useState('');
  const [visaFee, setVisaFee] = useState('');
  const [visaNote, setVisaNote] = useState('');
  const [visaReqsList, setVisaReqsList] = useState('');

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

  const loadTours = async () => {
    const { data } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
    if (data) setTours(data as Tour[]);
  };

  const loadVisas = async () => {
    const { data } = await supabase.from('visa_requirements').select('*').order('created_at', { ascending: false });
    if (data) setVisaReqs(data as VisaRequirement[]);
  };

  const handleAddLookup = async (table: string, value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    const { error } = await supabase.from(table).insert({ name: value.trim() });
    if (!error) {
      setNewDestination('');
      setNewTourType('');
      setNewCountry('');
      setNewVisaType('');
      await loadLookups();
    }
    setLoading(false);
  };

  const handleDeleteLookup = async (table: string, id: string) => {
    await supabase.from(table).delete().eq('id', id);
    await loadLookups();
  };

  const handleAddTour = async () => {
    if (!tourTitle || !tourDestination || !tourType || !tourDuration || !tourPrice) return;
    setLoading(true);
    const payload = {
      title: tourTitle,
      destination: tourDestination,
      tour_type: tourType,
      duration: tourDuration,
      price: parseFloat(tourPrice),
      original_price: tourOriginalPrice ? parseFloat(tourOriginalPrice) : null,
      image_url: tourImageUrl || '',
      includes: tourIncludes.split(',').map((s) => s.trim()).filter(Boolean),
      excludes: tourExcludes.split(',').map((s) => s.trim()).filter(Boolean),
      sub_destinations: [],
      itinerary: [],
    };
    const { error } = await supabase.from('tours').insert(payload);
    if (!error) {
      setTourTitle('');
      setTourDestination('');
      setTourType('');
      setTourDuration('');
      setTourPrice('');
      setTourOriginalPrice('');
      setTourImageUrl('');
      setTourIncludes('');
      setTourExcludes('');
      await loadTours();
    }
    setLoading(false);
  };

  const handleDeleteTour = async (id: string) => {
    await supabase.from('tours').delete().eq('id', id);
    await loadTours();
  };

  const handleAddVisa = async () => {
    if (!visaCountry || !visaType) return;
    setLoading(true);
    const reqs = visaReqsList
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, detail] = line.split('|').map((s) => s.trim());
        return { title: title || line, detail: detail || '' };
      });
    const payload = {
      country: visaCountry,
      visa_type: visaType,
      fee: parseFloat(visaFee) || 0,
      requirements: reqs,
      note: visaNote,
    };
    const { error } = await supabase.from('visa_requirements').insert(payload);
    if (!error) {
      setVisaCountry('');
      setVisaType('');
      setVisaFee('');
      setVisaNote('');
      setVisaReqsList('');
      await loadVisas();
    }
    setLoading(false);
  };

  const handleDeleteVisa = async (id: string) => {
    await supabase.from('visa_requirements').delete().eq('id', id);
    await loadVisas();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-out">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white/95 px-6 py-4 backdrop-blur-xl">
          <h2 className="font-display text-lg font-extrabold text-ink-900">Admin Panel</h2>
          <button onClick={onClose} className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-ink-100 px-6">
          {[
            { id: 'lookups', label: 'Lookups', icon: Settings2 },
            { id: 'tours', label: 'Tours', icon: Briefcase },
            { id: 'visas', label: 'Visa Requirements', icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as DrawerTab)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition ${
                tab === t.id ? 'border-brand-500 text-brand-600' : 'border-transparent text-ink-500 hover:text-ink-900'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'lookups' && (
            <div className="space-y-8">
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-500">Tour Destinations</h3>
                <div className="flex gap-2">
                  <input
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="New destination"
                    className="field-style flex-1"
                  />
                  <button onClick={() => handleAddLookup('tour_destinations', newDestination)} className="btn-primary px-3 py-2.5" disabled={loading}>
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {destinations.map((d) => (
                    <li key={d.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2"><MapPin size={14} className="text-brand-500" /> {d.name}</span>
                      <button onClick={() => handleDeleteLookup('tour_destinations', d.id)} className="text-ink-400 transition hover:text-pop-red">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-500">Tour Types</h3>
                <div className="flex gap-2">
                  <input
                    value={newTourType}
                    onChange={(e) => setNewTourType(e.target.value)}
                    placeholder="New tour type"
                    className="field-style flex-1"
                  />
                  <button onClick={() => handleAddLookup('tour_types', newTourType)} className="btn-primary px-3 py-2.5" disabled={loading}>
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {tourTypes.map((t) => (
                    <li key={t.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2"><Luggage size={14} className="text-brand-500" /> {t.name}</span>
                      <button onClick={() => handleDeleteLookup('tour_types', t.id)} className="text-ink-400 transition hover:text-pop-red">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-500">Visa Countries</h3>
                <div className="flex gap-2">
                  <input
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="New country"
                    className="field-style flex-1"
                  />
                  <button onClick={() => handleAddLookup('visa_countries', newCountry)} className="btn-primary px-3 py-2.5" disabled={loading}>
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {countries.map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2"><Globe size={14} className="text-brand-500" /> {c.name}</span>
                      <button onClick={() => handleDeleteLookup('visa_countries', c.id)} className="text-ink-400 transition hover:text-pop-red">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-500">Visa Types</h3>
                <div className="flex gap-2">
                  <input
                    value={newVisaType}
                    onChange={(e) => setNewVisaType(e.target.value)}
                    placeholder="New visa type"
                    className="field-style flex-1"
                  />
                  <button onClick={() => handleAddLookup('visa_types', newVisaType)} className="btn-primary px-3 py-2.5" disabled={loading}>
                    <Plus size={16} />
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {visaTypes.map((v) => (
                    <li key={v.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-sm">
                      <span className="flex items-center gap-2"><FileText size={14} className="text-brand-500" /> {v.name}</span>
                      <button onClick={() => handleDeleteLookup('visa_types', v.id)} className="text-ink-400 transition hover:text-pop-red">
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'tours' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Title</label>
                  <input value={tourTitle} onChange={(e) => setTourTitle(e.target.value)} placeholder="Tour title" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Destination</label>
                  <select value={tourDestination} onChange={(e) => setTourDestination(e.target.value)} className="field-style w-full cursor-pointer">
                    <option value="">Select destination</option>
                    {destinations.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Tour Type</label>
                  <select value={tourType} onChange={(e) => setTourType(e.target.value)} className="field-style w-full cursor-pointer">
                    <option value="">Select type</option>
                    {tourTypes.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Duration</label>
                  <input value={tourDuration} onChange={(e) => setTourDuration(e.target.value)} placeholder="e.g. 5 Days / 4 Nights" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Price</label>
                  <input type="number" value={tourPrice} onChange={(e) => setTourPrice(e.target.value)} placeholder="Price" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Original Price</label>
                  <input type="number" value={tourOriginalPrice} onChange={(e) => setTourOriginalPrice(e.target.value)} placeholder="Original price (optional)" className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Image URL</label>
                  <input value={tourImageUrl} onChange={(e) => setTourImageUrl(e.target.value)} placeholder="https://..." className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Includes (comma separated)</label>
                  <input value={tourIncludes} onChange={(e) => setTourIncludes(e.target.value)} placeholder="Flight, Hotel, Meals" className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Excludes (comma separated)</label>
                  <input value={tourExcludes} onChange={(e) => setTourExcludes(e.target.value)} placeholder="Visa, Travel Insurance" className="field-style w-full" />
                </div>
              </div>
              <button onClick={handleAddTour} className="btn-primary w-full" disabled={loading}>
                <Plus size={16} /> Add Tour Package
              </button>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500">Existing Tours</h3>
                {tours.map((t) => (
                  <div key={t.id} className="flex items-start justify-between rounded-xl border border-ink-100 p-3">
                    <div>
                      <p className="text-sm font-bold text-ink-900">{t.title}</p>
                      <p className="text-xs text-ink-500">{t.destination} · {t.tour_type} · {t.duration}</p>
                      <p className="text-xs font-semibold text-brand-600">${t.price} {t.original_price ? <span className="text-ink-400 line-through">${t.original_price}</span> : ''}</p>
                    </div>
                    <button onClick={() => handleDeleteTour(t.id)} className="text-ink-400 transition hover:text-pop-red">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'visas' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Country</label>
                  <select value={visaCountry} onChange={(e) => setVisaCountry(e.target.value)} className="field-style w-full cursor-pointer">
                    <option value="">Select country</option>
                    {countries.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Visa Type</label>
                  <select value={visaType} onChange={(e) => setVisaType(e.target.value)} className="field-style w-full cursor-pointer">
                    <option value="">Select type</option>
                    {visaTypes.map((v) => <option key={v.id} value={v.name}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Fee</label>
                  <input type="number" value={visaFee} onChange={(e) => setVisaFee(e.target.value)} placeholder="Fee amount" className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Requirements (one per line, format: Title | Detail)</label>
                  <textarea
                    value={visaReqsList}
                    onChange={(e) => setVisaReqsList(e.target.value)}
                    placeholder="Passport | Must be valid for 6 months&#10;Photo | 2 recent white background photos"
                    className="field-style w-full resize-none"
                    rows={4}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Note</label>
                  <textarea
                    value={visaNote}
                    onChange={(e) => setVisaNote(e.target.value)}
                    placeholder="Additional note or instructions for this visa"
                    className="field-style w-full resize-none"
                    rows={2}
                  />
                </div>
              </div>
              <button onClick={handleAddVisa} className="btn-primary w-full" disabled={loading}>
                <Plus size={16} /> Add Visa Requirement
              </button>

              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500">Existing Visa Requirements</h3>
                {visaReqs.map((v) => (
                  <div key={v.id} className="rounded-xl border border-ink-100 p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-ink-900">{v.country} - {v.visa_type}</p>
                        <p className="text-xs font-semibold text-brand-600">Fee: ${v.fee}</p>
                      </div>
                      <button onClick={() => handleDeleteVisa(v.id)} className="text-ink-400 transition hover:text-pop-red">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {v.requirements.map((r, idx) => (
                        <li key={idx} className="text-xs text-ink-600">• {r.title}: {r.detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDrawer;
