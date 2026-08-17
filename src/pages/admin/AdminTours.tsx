import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  Pencil,
  X,
} from 'lucide-react';
import { supabase, type Tour, type TourDestination, type TourType } from '@/lib/supabase';

function AdminTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<TourDestination[]>([]);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const navigate = useNavigate();

  const emptyTour = (): Omit<Tour, 'id' | 'created_at' | 'updated_at'> => ({
    title: '',
    destination: '',
    tour_type: '',
    duration: '',
    price: 0,
    original_price: null,
    sub_destinations: [],
    itinerary: [],
    includes: [],
    excludes: [],
    image_url: '',
    start_location: '',
  });

  const [form, setForm] = useState(emptyTour());

  const loadData = async () => {
    setLoading(true);
    const [toursRes, destRes, typesRes] = await Promise.all([
      supabase.from('tours').select('*').order('created_at', { ascending: false }),
      supabase.from('tour_destinations').select('*').order('name'),
      supabase.from('tour_types').select('*').order('name'),
    ]);
    if (toursRes.data) setTours(toursRes.data as Tour[]);
    if (destRes.data) setDestinations(destRes.data as TourDestination[]);
    if (typesRes.data) setTourTypes(typesRes.data as TourType[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditingTour(null);
    setForm(emptyTour());
    setModalOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditingTour(tour);
    setForm({
      title: tour.title,
      destination: tour.destination,
      tour_type: tour.tour_type,
      duration: tour.duration,
      price: tour.price,
      original_price: tour.original_price,
      sub_destinations: [...tour.sub_destinations],
      itinerary: [...tour.itinerary],
      includes: [...tour.includes],
      excludes: [...tour.excludes],
      image_url: tour.image_url,
      start_location: (tour as unknown as Record<string, string>).start_location || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.destination || !form.tour_type || !form.duration || !form.price) return;
    setSaving(true);
    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    };
    if (editingTour) {
      await supabase.from('tours').update(payload).eq('id', editingTour.id);
    } else {
      await supabase.from('tours').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour package?')) return;
    await supabase.from('tours').delete().eq('id', id);
    loadData();
  };

  const updateField = (field: keyof typeof form, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addItineraryDay = () => {
    const nextDay = form.itinerary.length + 1;
    setForm((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: nextDay, title: '', description: '' }],
    }));
  };

  const updateItineraryDay = (index: number, field: 'title' | 'description', value: string) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const removeItineraryDay = (index: number) => {
    setForm((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, day: i + 1 })),
    }));
  };

  const addListItem = (field: 'sub_destinations' | 'includes' | 'excludes') => {
    const value = prompt(`Add new item to ${field.replace('_', ' ')}:`);
    if (value && value.trim()) {
      setForm((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    }
  };

  const removeListItem = (field: 'sub_destinations' | 'includes' | 'excludes', index: number) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Tour Packages</h1>
          <p className="mt-1 text-sm text-ink-500">Create and manage tour packages with itineraries.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Tour
          </button>
          <button onClick={() => navigate('/admin')} className="btn-ghost">
            <X size={16} /> Back
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Title</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Destination</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Type</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Duration</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Price</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-400">Loading...</td></tr>
              ) : tours.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-400">No tours found. Add one above.</td></tr>
              ) : tours.map((tour) => (
                <tr key={tour.id} className="transition hover:bg-ink-50/50">
                  <td className="px-6 py-4 font-semibold text-ink-900">{tour.title}</td>
                  <td className="px-6 py-4 text-ink-600">{tour.destination}</td>
                  <td className="px-6 py-4 text-ink-600">{tour.tour_type}</td>
                  <td className="px-6 py-4 text-ink-600">{tour.duration}</td>
                  <td className="px-6 py-4 font-semibold text-brand-600">৳{tour.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(tour)} className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-600">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(tour.id)} className="rounded-lg p-2 text-ink-400 transition hover:bg-pop-red/10 hover:text-pop-red">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="absolute inset-4 overflow-y-auto rounded-2xl bg-white shadow-2xl sm:inset-10">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white/95 px-6 py-4 backdrop-blur-xl">
              <h2 className="font-display text-lg font-extrabold text-ink-900">{editingTour ? 'Edit Tour' : 'Add New Tour'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Title</label>
                  <input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Tour title" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Destination</label>
                  <select value={form.destination} onChange={(e) => updateField('destination', e.target.value)} className="field-style w-full cursor-pointer">
                    <option value="">Select destination</option>
                    {destinations.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Tour Type</label>
                  <select value={form.tour_type} onChange={(e) => updateField('tour_type', e.target.value)} className="field-style w-full cursor-pointer">
                    <option value="">Select type</option>
                    {tourTypes.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Duration</label>
                  <input value={form.duration} onChange={(e) => updateField('duration', e.target.value)} placeholder="e.g. 5 Days / 4 Nights" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Price (৳)</label>
                  <input type="number" value={form.price} onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)} placeholder="Price" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Original Price (৳)</label>
                  <input type="number" value={form.original_price ?? ''} onChange={(e) => updateField('original_price', e.target.value ? parseFloat(e.target.value) : null)} placeholder="Original price (optional)" className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Image URL</label>
                  <input value={form.image_url} onChange={(e) => updateField('image_url', e.target.value)} placeholder="https://..." className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Start Location</label>
                  <input value={(form as unknown as Record<string, string>).start_location || ''} onChange={(e) => updateField('start_location' as keyof typeof form, e.target.value)} placeholder="e.g. Brisbane" className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Sub Destinations</label>
                    <button type="button" onClick={() => addListItem('sub_destinations')} className="flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-700">
                      <Plus size={13} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.sub_destinations.map((sub, i) => (
                      <span key={i} className="flex items-center gap-1 rounded-full bg-ink-100 px-3 py-1.5 text-xs font-bold text-ink-700">
                        {sub}
                        <button type="button" onClick={() => removeListItem('sub_destinations', i)} className="text-ink-400 transition hover:text-pop-red">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Day-by-Day Itinerary</label>
                    <button type="button" onClick={addItineraryDay} className="flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-700">
                      <Plus size={13} /> Add Day
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.itinerary.map((item, index) => (
                      <div key={item.day} className="rounded-xl border border-ink-200 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Day {item.day}</span>
                          <button type="button" onClick={() => removeItineraryDay(index)} className="text-ink-400 transition hover:text-pop-red">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <input value={item.title} onChange={(e) => updateItineraryDay(index, 'title', e.target.value)} placeholder="Day title (e.g. Departure)" className="field-style w-full" />
                          <input value={item.description} onChange={(e) => updateItineraryDay(index, 'description', e.target.value)} placeholder="Activity details" className="field-style w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Includes</label>
                    <button type="button" onClick={() => addListItem('includes')} className="flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-700">
                      <Plus size={13} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.includes.map((inc, i) => (
                      <span key={i} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
                        {inc}
                        <button type="button" onClick={() => removeListItem('includes', i)} className="text-brand-600/60 transition hover:text-pop-red">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Excludes</label>
                    <button type="button" onClick={() => addListItem('excludes')} className="flex items-center gap-1 text-xs font-bold text-brand-600 transition hover:text-brand-700">
                      <Plus size={13} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.excludes.map((exc, i) => (
                      <span key={i} className="flex items-center gap-1 rounded-full bg-pop-red/10 px-3 py-1.5 text-xs font-bold text-pop-red">
                        {exc}
                        <button type="button" onClick={() => removeListItem('excludes', i)} className="text-pop-red/60 transition hover:text-pop-red">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
                <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn-primary" disabled={saving}>
                  {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Tour'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTours;
