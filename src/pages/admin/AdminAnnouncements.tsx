import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  Pencil,
  X,
  Megaphone,
} from 'lucide-react';
import { supabase, type Announcement, type Tour, type VisaRequirement } from '@/lib/supabase';

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [visas, setVisas] = useState<VisaRequirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const navigate = useNavigate();

  const emptyAnnouncement = (): Omit<Announcement, 'id' | 'created_at' | 'updated_at'> => ({
    custom_title: '',
    badge: 'SPECIAL OFFER',
    link_type: 'tour',
    link_id: null,
    custom_url: null,
    is_active: true,
    display_order: 0,
  });

  const [form, setForm] = useState(emptyAnnouncement());

  const loadData = async () => {
    setLoading(true);
    const [announcementsRes, toursRes, visasRes] = await Promise.all([
      supabase.from('announcements').select('*').order('display_order', { ascending: true }),
      supabase.from('tours').select('*').order('created_at', { ascending: false }),
      supabase.from('visa_requirements').select('*').order('created_at', { ascending: false }),
    ]);
    if (announcementsRes.data) setAnnouncements(announcementsRes.data as Announcement[]);
    if (toursRes.data) setTours(toursRes.data as Tour[]);
    if (visasRes.data) setVisas(visasRes.data as VisaRequirement[]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdd = () => {
    setEditingAnnouncement(null);
    setForm(emptyAnnouncement());
    setModalOpen(true);
  };

  const openEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setForm({
      custom_title: announcement.custom_title,
      badge: announcement.badge,
      link_type: announcement.link_type,
      link_id: announcement.link_id,
      custom_url: announcement.custom_url || '',
      is_active: announcement.is_active,
      display_order: announcement.display_order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.custom_title.trim()) return;
    setSaving(true);
    const payload = {
      custom_title: form.custom_title.trim(),
      badge: form.badge.trim(),
      link_type: form.link_type,
      link_id: form.link_id,
      custom_url: form.custom_url?.trim() || null,
      is_active: form.is_active,
      display_order: form.display_order,
      updated_at: new Date().toISOString(),
    };
    if (editingAnnouncement) {
      await supabase.from('announcements').update(payload).eq('id', editingAnnouncement.id);
    } else {
      await supabase.from('announcements').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    loadData();
  };

  const handleLinkChange = (linkType: string, linkId: string | null) => {
    updateField('link_type', linkType);
    updateField('link_id', linkId);
    if (!form.custom_title.trim() && linkId) {
      if (linkType === 'tour') {
        const tour = tours.find((t) => t.id === linkId);
        if (tour) updateField('custom_title', tour.title);
      } else if (linkType === 'visa') {
        const visa = visas.find((v) => v.id === linkId);
        if (visa) updateField('custom_title', `${visa.country} - ${visa.visa_type}`);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    await supabase.from('announcements').delete().eq('id', id);
    loadData();
  };

  const toggleActive = async (announcement: Announcement) => {
    await supabase.from('announcements').update({ is_active: !announcement.is_active }).eq('id', announcement.id);
    loadData();
  };

  const updateField = (field: keyof typeof form, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getDisplayTitle = (announcement: Announcement) => {
    if (announcement.custom_title.trim()) return announcement.custom_title;
    if (announcement.link_type === 'tour' && announcement.link_id) {
      const tour = tours.find((t) => t.id === announcement.link_id);
      return tour?.title || announcement.custom_title;
    }
    if (announcement.link_type === 'visa' && announcement.link_id) {
      const visa = visas.find((v) => v.id === announcement.link_id);
      return visa ? `${visa.country} - ${visa.visa_type}` : announcement.custom_title;
    }
    return announcement.custom_title;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Announcement Bar</h1>
          <p className="mt-1 text-sm text-ink-500">Manage the scrolling announcement ticker displayed above the hero section.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Announcement
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
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Order</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Title</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Badge</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Link</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Active</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-500">Loading...</td></tr>
              ) : announcements.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-500">No announcements found. Add one above.</td></tr>
              ) : announcements.map((announcement) => (
                <tr key={announcement.id} className="transition hover:bg-ink-50/50">
                  <td className="px-6 py-4 text-ink-600">{announcement.display_order}</td>
                  <td className="px-6 py-4 font-semibold text-ink-900">{getDisplayTitle(announcement)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      {announcement.badge}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-600">
                    {announcement.link_type === 'custom' ? announcement.custom_url : `${announcement.link_type}/${announcement.link_id}`}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(announcement)} className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${announcement.is_active ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-600'}`}>
                      {announcement.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(announcement)} className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-50 hover:text-brand-600">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(announcement.id)} className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-500/10 hover:text-brand-600">
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
              <h2 className="font-display text-lg font-extrabold text-ink-900">{editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Custom Title</label>
                  <input value={form.custom_title} onChange={(e) => updateField('custom_title', e.target.value)} placeholder="e.g. Thailand Tour Package – Special Price" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Badge Text</label>
                  <input value={form.badge} onChange={(e) => updateField('badge', e.target.value)} placeholder="e.g. HOT, NEW, LIMITED OFFER" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Link Type</label>
                  <select value={form.link_type} onChange={(e) => handleLinkChange(e.target.value, form.link_id)} className="field-style w-full cursor-pointer">
                    <option value="tour">Tour</option>
                    <option value="visa">Visa</option>
                    <option value="custom">Custom URL</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Linked Item</label>
                  <select
                    value={form.link_id || ''}
                    onChange={(e) => handleLinkChange(form.link_type, e.target.value || null)}
                    className="field-style w-full cursor-pointer"
                    disabled={form.link_type === 'custom'}
                  >
                    <option value="">Select item...</option>
                    {form.link_type === 'tour' && tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>{tour.title}</option>
                    ))}
                    {form.link_type === 'visa' && visas.map((visa) => (
                      <option key={visa.id} value={visa.id}>{visa.country} - {visa.visa_type}</option>
                    ))}
                  </select>
                </div>
                {form.link_type === 'custom' && (
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Custom URL</label>
                     <input value={form.custom_url ?? ''} onChange={(e) => updateField('custom_url', e.target.value)} placeholder="https://..." className="field-style w-full" />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Display Order</label>
                  <input type="number" value={form.display_order} onChange={(e) => updateField('display_order', parseInt(e.target.value) || 0)} className="field-style w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => updateField('is_active', e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400" />
                  <label htmlFor="is_active" className="text-sm font-semibold text-ink-700">Active</label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
                <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn-primary" disabled={saving}>
                  {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Announcement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAnnouncements;
