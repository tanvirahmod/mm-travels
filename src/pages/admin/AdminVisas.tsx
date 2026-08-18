import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  Pencil,
  X,
} from 'lucide-react';
import { supabase, type VisaRequirement, type VisaCountry, type VisaType } from '@/lib/supabase';

function AdminVisas() {
  const [visas, setVisas] = useState<VisaRequirement[]>([]);
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<VisaRequirement | null>(null);
  const navigate = useNavigate();

  const emptyVisa = (): Omit<VisaRequirement, 'id' | 'created_at' | 'updated_at'> => ({
    country: '',
    visa_type: '',
    fee: 0,
    service_charge: 0,
    requirements: [],
    note: '',
  });

  const [form, setForm] = useState(emptyVisa());
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqDetail, setNewReqDetail] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [visasRes, countriesRes, typesRes] = await Promise.all([
      supabase.from('visa_requirements').select('*').order('created_at', { ascending: false }),
      supabase.from('visa_countries').select('*').order('name'),
      supabase.from('visa_types').select('*').order('name'),
    ]);
    if (visasRes.data) setVisas(visasRes.data as VisaRequirement[]);
    if (countriesRes.data) setCountries(countriesRes.data as VisaCountry[]);
    if (typesRes.data) setVisaTypes(typesRes.data as VisaType[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditingVisa(null);
    setForm(emptyVisa());
    setModalOpen(true);
  };

  const openEdit = (visa: VisaRequirement) => {
    setEditingVisa(visa);
    setForm({
      country: visa.country,
      visa_type: visa.visa_type,
      fee: visa.fee,
      service_charge: visa.service_charge || 0,
      requirements: [...visa.requirements],
      note: visa.note || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.country || !form.visa_type) return;
    setSaving(true);
    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    };
    if (editingVisa) {
      await supabase.from('visa_requirements').update(payload).eq('id', editingVisa.id);
    } else {
      await supabase.from('visa_requirements').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visa requirement?')) return;
    await supabase.from('visa_requirements').delete().eq('id', id);
    loadData();
  };

  const updateField = (field: keyof typeof form, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (!newReqTitle.trim()) return;
    setForm((prev) => ({
      ...prev,
      requirements: [...prev.requirements, { title: newReqTitle.trim(), detail: newReqDetail.trim() }],
    }));
    setNewReqTitle('');
    setNewReqDetail('');
  };

  const removeRequirement = (index: number) => {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Visa Requirements</h1>
          <p className="mt-1 text-sm text-ink-500">Manage country visa guidelines and document checklists.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Visa Requirement
          </button>
          <button onClick={() => navigate('/admin')} className="btn-ghost">
            <X size={16} /> Back
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Country</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Visa Type</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Fee</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Documents</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-ink-500">Loading...</td></tr>
              ) : visas.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-ink-500">No visa requirements found. Add one above.</td></tr>
              ) : visas.map((visa) => (
                <tr key={visa.id} className="transition hover:bg-ink-50/50">
                  <td className="px-6 py-4 font-semibold text-ink-900">{visa.country}</td>
                  <td className="px-6 py-4 text-ink-600">{visa.visa_type}</td>
                  <td className="px-6 py-4 font-semibold text-brand-600">৳{visa.fee.toLocaleString()}</td>
                  <td className="px-6 py-4 text-ink-600">{visa.requirements.length} items</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(visa)} className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-50 hover:text-brand-600">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(visa.id)} className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-500/10 hover:text-brand-600">
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
              <h2 className="font-display text-lg font-extrabold text-ink-900">{editingVisa ? 'Edit Visa Requirement' : 'Add New Visa Requirement'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Country</label>
                  <select value={form.country} onChange={(e) => updateField('country', e.target.value)} className="field-style w-full cursor-pointer">
                    <option value="">Select country</option>
                    {countries.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Visa Type</label>
                  <select value={form.visa_type} onChange={(e) => updateField('visa_type', e.target.value)} className="field-style w-full cursor-pointer">
                    <option value="">Select type</option>
                    {visaTypes.map((v) => <option key={v.id} value={v.name}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Visa Fee (৳)</label>
                  <input type="number" value={form.fee} onChange={(e) => updateField('fee', parseFloat(e.target.value) || 0)} placeholder="Fee amount" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Service Charge (৳)</label>
                  <input type="number" value={form.service_charge} onChange={(e) => updateField('service_charge', parseFloat(e.target.value) || 0)} placeholder="Service charge amount" className="field-style w-full" />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Note</label>
                  <textarea value={form.note} onChange={(e) => updateField('note', e.target.value)} placeholder="Additional note or instructions for this visa" className="field-style w-full resize-none" rows={3} />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Document Checklist</label>
                    <div className="flex gap-2">
                      <input
                        value={newReqTitle}
                        onChange={(e) => setNewReqTitle(e.target.value)}
                        placeholder="Document title"
                        className="field-style w-40"
                      />
                      <input
                        value={newReqDetail}
                        onChange={(e) => setNewReqDetail(e.target.value)}
                        placeholder="Requirement detail"
                        className="field-style w-48"
                      />
                      <button type="button" onClick={addRequirement} className="btn-primary px-3 py-2.5">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {form.requirements.map((req, i) => (
                      <div key={i} className="flex items-start justify-between rounded-xl border border-ink-100 bg-ink-50/50 p-3">
                        <div>
                          <p className="text-sm font-bold text-ink-900">{req.title}</p>
                          <p className="text-xs text-ink-600">{req.detail}</p>
                        </div>
                        <button type="button" onClick={() => removeRequirement(i)} className="text-ink-500 transition hover:text-pop-red">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
                <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn-primary" disabled={saving}>
                  {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Visa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVisas;
