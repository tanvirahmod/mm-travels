import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  Pencil,
  X,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { supabase, type HeroSlide, type SiteSettings } from '@/lib/supabase';

type SlideForm = {
  badge_text: string;
  headline: string;
  headline_highlight: string;
  subtitle: string;
  description: string;
  background_image_url: string;
  mobile_background_image_url: string;
  primary_btn_text: string;
  primary_btn_url: string;
  secondary_btn_text: string;
  secondary_btn_url: string;
  link: string;
  slide_order: number;
  is_active: boolean;
};

function AdminHeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setSettings] = useState<SiteSettings | null>(null);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [searchSlide, setSearchSlide] = useState(1);
  const [savingSearch, setSavingSearch] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const navigate = useNavigate();

  const emptySlide = (): SlideForm => ({
    badge_text: '',
    headline: '',
    headline_highlight: '',
    subtitle: '',
      description: '',
      background_image_url: '',
      mobile_background_image_url: '',
      primary_btn_text: '',
    primary_btn_url: '',
    secondary_btn_text: '',
    secondary_btn_url: '',
    link: '',
    slide_order: 0,
    is_active: true,
  });

  const [form, setForm] = useState<SlideForm>(emptySlide());

  const loadData = async () => {
    setLoading(true);
    const [{ data }, settingsRes] = await Promise.all([
      supabase.from('hero_slides').select('*').order('slide_order', { ascending: true }),
      supabase.from('site_settings').select('*').maybeSingle(),
    ]);
    if (data) setSlides(data as HeroSlide[]);
    if (settingsRes.data) {
      const s = settingsRes.data as SiteSettings;
      setSettings(s);
      setSearchEnabled(s.search_enabled ?? true);
      setSearchSlide(s.search_slide ?? 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedSlides = [...slides].sort((a, b) => a.slide_order - b.slide_order);

  const openAdd = () => {
    setEditingSlide(null);
    setForm({ ...emptySlide(), slide_order: slides.length + 1 });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setForm({
      badge_text: slide.badge_text,
      headline: slide.headline,
      headline_highlight: slide.headline_highlight,
      subtitle: slide.subtitle,
      description: slide.description,
      background_image_url: slide.background_image_url,
      mobile_background_image_url: slide.mobile_background_image_url || '',
      primary_btn_text: slide.primary_btn_text || '',
      primary_btn_url: slide.primary_btn_url || '',
      secondary_btn_text: slide.secondary_btn_text || '',
      secondary_btn_url: slide.secondary_btn_url || '',
      link: slide.link || '',
      slide_order: slide.slide_order,
      is_active: slide.is_active,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const titleMissing = !form.headline.trim();
    const imageMissing = !form.background_image_url.trim();
    if (titleMissing && imageMissing) {
      setError('Add a headline (title), or provide a background image.');
      return;
    }
    setError(null);
    setSaving(true);
    const payload = {
      badge_text: form.badge_text.trim(),
      headline: form.headline.trim(),
      headline_highlight: form.headline_highlight.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      background_image_url: form.background_image_url.trim(),
      mobile_background_image_url: form.mobile_background_image_url.trim() || null,
      primary_btn_text: form.primary_btn_text.trim() || null,
      primary_btn_url: form.primary_btn_url.trim() || null,
      secondary_btn_text: form.secondary_btn_text.trim() || null,
      secondary_btn_url: form.secondary_btn_url.trim() || null,
      link: form.link.trim() || null,
      slide_order: form.slide_order,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };
    if (editingSlide) {
      await supabase.from('hero_slides').update(payload).eq('id', editingSlide.id);
    } else {
      await supabase.from('hero_slides').insert(payload);
    }
    setSaving(false);
    setModalOpen(false);
    loadData();
  };

  const saveSearchSettings = async () => {
    setSavingSearch(true);
    await supabase
      .from('site_settings')
      .upsert({ id: '00000000-0000-0000-0000-000000000001', search_enabled: searchEnabled, search_slide: searchSlide });
    setSavingSearch(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    await supabase.from('hero_slides').delete().eq('id', id);
    loadData();
  };

  const toggleActive = async (slide: HeroSlide) => {
    await supabase
      .from('hero_slides')
      .update({ is_active: !slide.is_active, updated_at: new Date().toISOString() })
      .eq('id', slide.id);
    loadData();
  };

  const moveSlide = async (slide: HeroSlide, direction: 'up' | 'down') => {
    const idx = sortedSlides.findIndex((s) => s.id === slide.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sortedSlides.length) return;
    const other = sortedSlides[swapIdx];
    const currentOrder = slide.slide_order;
    const otherOrder = other.slide_order;
    await supabase
      .from('hero_slides')
      .update({ slide_order: otherOrder, updated_at: new Date().toISOString() })
      .eq('id', slide.id);
    await supabase
      .from('hero_slides')
      .update({ slide_order: currentOrder, updated_at: new Date().toISOString() })
      .eq('id', other.id);
    loadData();
  };

  const updateField = (field: keyof typeof form, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Hero Slider</h1>
          <p className="mt-1 text-sm text-ink-500">Manage the homepage hero carousel slides, ordering, and active state.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Slide
          </button>
          <button onClick={() => navigate('/admin')} className="btn-ghost">
            <X size={16} /> Back
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-extrabold text-ink-900">Hero Search Bar</h2>
            <p className="mt-1 text-sm text-ink-500">Control the tour / flight / hotel / visa search widget shown on the hero slider.</p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="search-enabled"
                checked={searchEnabled}
                onChange={(e) => setSearchEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400"
              />
              <span className="text-sm font-semibold text-ink-700">Enable search bar</span>
            </label>
            <div>
              <label htmlFor="search-slide" className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Show on slide</label>
              <select
                id="search-slide"
                value={searchSlide}
                onChange={(e) => setSearchSlide(parseInt(e.target.value) || 1)}
                className="field-style w-24"
              >
                {Array.from({ length: Math.max(slides.length, 1) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <button onClick={saveSearchSettings} disabled={savingSearch} className="btn-primary">
              {savingSearch ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Order</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Slide</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Image</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Active</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Reorder</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-500">Loading...</td></tr>
              ) : sortedSlides.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-500">No slides found. Add one above.</td></tr>
              ) : (
                sortedSlides.map((slide) => (
                  <tr key={slide.id} className="transition hover:bg-ink-50/50">
                    <td className="px-4 py-4 text-ink-600">{slide.slide_order}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-ink-900">{slide.headline}</p>
                      {slide.headline_highlight && (
                        <p className="text-xs text-brand-600">Highlight: {slide.headline_highlight}</p>
                      )}
                      {slide.subtitle && (
                        <p className="mt-0.5 max-w-xs truncate text-xs text-ink-500">{slide.subtitle}</p>
                      )}
                      {slide.link && (
                        <p className="mt-0.5 flex max-w-xs items-center gap-1 truncate text-[11px] font-semibold text-brand-600">
                          <span className="text-ink-400">Link:</span> {slide.link}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {slide.background_image_url ? (
                        <img
                          src={slide.background_image_url}
                          alt={slide.headline}
                          className="h-12 w-20 rounded-lg border border-ink-100 object-cover"
                        />
                      ) : (
                        <span className="text-xs text-ink-400">No image</span>
                      )}
                      {slide.mobile_background_image_url && (
                        <span className="mt-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600">Mobile bg set</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleActive(slide)}
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          slide.is_active ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-600'
                        }`}
                      >
                        {slide.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveSlide(slide, 'up')}
                          disabled={sortedSlides.indexOf(slide) === 0}
                          className="rounded-lg p-1.5 text-ink-500 transition hover:bg-brand-50 hover:text-brand-600 disabled:opacity-30"
                          aria-label="Move up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveSlide(slide, 'down')}
                          disabled={sortedSlides.indexOf(slide) === sortedSlides.length - 1}
                          className="rounded-lg p-1.5 text-ink-500 transition hover:bg-brand-50 hover:text-brand-600 disabled:opacity-30"
                          aria-label="Move down"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(slide)} className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-50 hover:text-brand-600" aria-label="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(slide.id)} className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-500/10 hover:text-brand-600" aria-label="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
              <h2 className="font-display text-lg font-extrabold text-ink-900">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-6">
              {error && (
                <div className="mb-5 rounded-xl border border-pop-red/30 bg-pop-red/10 px-4 py-3 text-sm font-semibold text-pop-red">
                  {error}
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Badge Text</label>
                  <input value={form.badge_text} onChange={(e) => updateField('badge_text', e.target.value)} placeholder="Govt. Approved · License No-17539" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Headline Highlight</label>
                  <input value={form.headline_highlight} onChange={(e) => updateField('headline_highlight', e.target.value)} placeholder="Word(s) highlighted in Electric Blue" className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">
                    Headline (Title) <span className="text-pop-red">*</span>
                  </label>
                  <input value={form.headline} onChange={(e) => updateField('headline', e.target.value)} placeholder="Main heading text" className="field-style w-full" />
                  {!form.headline.trim() && (
                    <p className="mt-1 text-[11px] font-semibold text-pop-red">Title is required.</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Subtitle</label>
                  <input value={form.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="Line shown below the headline" className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Paragraph text below the subtitle" className="field-style w-full resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">
                    Background Image URL {!form.headline.trim() && <span className="text-pop-red">*</span>}
                  </label>
                  <input value={form.background_image_url} onChange={(e) => updateField('background_image_url', e.target.value)} placeholder="Paste image URL — recommended 1920 × 720 px (desktop)" className="field-style w-full" />
                  {!form.headline.trim() ? (
                    <p className="mt-1 text-[11px] font-semibold text-pop-red">Required when no title is provided.</p>
                  ) : (
                    <p className="mt-1 text-[11px] text-ink-400">Recommended size: 1920 × 720 px (desktop / large screens).</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Mobile Background Image URL (optional)</label>
                  <input value={form.mobile_background_image_url} onChange={(e) => updateField('mobile_background_image_url', e.target.value)} placeholder="Paste image URL — recommended 768 × 1024 px (mobile, optional)" className="field-style w-full" />
                  <p className="mt-1 text-[11px] text-ink-400">Recommended size: 768 × 1024 px (mobile / small screens). If empty, the desktop image above is used.</p>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Primary Button Text</label>
                  <input value={form.primary_btn_text} onChange={(e) => updateField('primary_btn_text', e.target.value)} placeholder="Explore Tour Packages" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Primary Button URL</label>
                  <input value={form.primary_btn_url} onChange={(e) => updateField('primary_btn_url', e.target.value)} placeholder="/tours" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Secondary Button Text</label>
                  <input value={form.secondary_btn_text} onChange={(e) => updateField('secondary_btn_text', e.target.value)} placeholder="Book Your Visa" className="field-style w-full" />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Secondary Button URL</label>
                  <input value={form.secondary_btn_url} onChange={(e) => updateField('secondary_btn_url', e.target.value)} placeholder="/visa" className="field-style w-full" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Slide Link (optional)</label>
                  <input value={form.link} onChange={(e) => updateField('link', e.target.value)} placeholder="/tours or https://example.com" className="field-style w-full" />
                  <p className="mt-1 text-[11px] text-ink-400">When set, the entire slide becomes clickable and navigates here. Leave empty to keep the slide non-clickable.</p>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-500">Slide Order</label>
                  <input type="number" value={form.slide_order} onChange={(e) => updateField('slide_order', parseInt(e.target.value) || 0)} className="field-style w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => updateField('is_active', e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-400" />
                  <label htmlFor="is_active" className="text-sm font-semibold text-ink-700">Active</label>
                </div>
              </div>

              {form.background_image_url && (
                <div className="mt-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-500">Desktop Image Preview</p>
                  <img src={form.background_image_url} alt="Preview" className="h-32 w-full rounded-xl border border-ink-100 object-cover" />
                </div>
              )}
              {form.mobile_background_image_url && (
                <div className="mt-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-ink-500">Mobile Image Preview</p>
                  <img src={form.mobile_background_image_url} alt="Mobile preview" className="h-40 w-full rounded-xl border border-ink-100 object-cover" />
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
                <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn-primary" disabled={saving}>
                  {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHeroSlider;
