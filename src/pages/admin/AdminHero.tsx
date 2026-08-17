import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Image as ImageIcon,
  Save,
  Sparkles,
  Plus,
  X,
} from 'lucide-react';
import { supabase, type HeroContent } from '@/lib/supabase';

function AdminHero() {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    supabase
      .from('hero_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) {
          setError(err.message);
          return;
        }
        if (data) setContent(data as HeroContent);
      });
  }, []);

  const updateField = (field: keyof HeroContent, value: string | string[]) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
    setSaved(false);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || !content) return;
    if (content.feature_tags.includes(tag)) {
      setTagInput('');
      return;
    }
    updateField('feature_tags', [...content.feature_tags, tag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    if (!content) return;
    updateField('feature_tags', content.feature_tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setError('');
    setSaved(false);
    const { error: err } = await supabase
      .from('hero_content')
      .update({
        badge_text: content.badge_text,
        headline: content.headline,
        headline_highlight: content.headline_highlight,
        subtitle: content.subtitle,
        description: content.description,
        background_image_url: content.background_image_url,
        feature_tags: content.feature_tags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', content.id);
    setSaving(false);
    if (err) {
      setError(err.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Hero Content</h1>
          <p className="mt-1 text-sm text-ink-500">Manage the homepage hero section text and background image.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-bold text-brand-600">
              <Check size={18} /> Saved
            </span>
          )}
          <button onClick={() => navigate('/admin')} className="btn-ghost">
            <X size={16} /> Back
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-ink-100">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-ink-200 border-t-brand-500" />
          <p className="mt-4 text-sm text-ink-500">Loading content...</p>
        </div>
      ) : content ? (
        <div className="space-y-6">
          {/* Save bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white px-5 py-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {saved ? (
                <span className="flex items-center gap-2 text-sm font-bold text-brand-600">
                  <Check size={18} /> Changes saved successfully
                </span>
              ) : (
                <span className="text-sm font-semibold text-ink-500">Unsaved changes will appear on the homepage after saving</span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {error && (
            <p className="rounded-xl bg-pop-red/10 border border-pop-red/20 px-5 py-3.5 text-sm font-semibold text-pop-red">{error}</p>
          )}

          {/* Background image preview */}
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-3">
              <ImageIcon size={16} className="text-brand-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Background Image Preview</p>
            </div>
            <div className="relative h-48 bg-ink-950">
              {content.background_image_url && (
                <img src={content.background_image_url} alt="Hero background" className="h-full w-full object-cover opacity-80" />
              )}
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-5 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-ink-100 pb-3">
              <Sparkles size={16} className="text-brand-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Hero Text Content</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-ink-900">Badge Text</span>
                <span className="mt-0.5 block text-xs text-ink-400">Small badge above the headline</span>
                <input
                  type="text"
                  value={content.badge_text}
                  onChange={(e) => updateField('badge_text', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-ink-900">Headline Highlight</span>
                <span className="mt-0.5 block text-xs text-ink-400">Word(s) to highlight in red</span>
                <input
                  type="text"
                  value={content.headline_highlight}
                  onChange={(e) => updateField('headline_highlight', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-bold text-ink-900">Headline</span>
              <span className="mt-0.5 block text-xs text-ink-400">Main large heading text</span>
              <input
                type="text"
                value={content.headline}
                onChange={(e) => updateField('headline', e.target.value)}
                className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink-900">Subtitle</span>
              <span className="mt-0.5 block text-xs text-ink-400">Line shown below the headline</span>
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink-900">Description</span>
              <span className="mt-0.5 block text-xs text-ink-400">Paragraph text below the subtitle</span>
              <textarea
                rows={3}
                value={content.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="mt-2 w-full resize-none rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink-900">Background Image URL</span>
              <span className="mt-0.5 block text-xs text-ink-400">Paste a direct image link (e.g. from Pexels or your own hosting)</span>
              <input
                type="url"
                value={content.background_image_url}
                onChange={(e) => updateField('background_image_url', e.target.value)}
                className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                placeholder="https://..."
              />
            </label>

            {/* Feature tags editor */}
            <div>
              <span className="text-sm font-bold text-ink-900">Feature Tags</span>
              <span className="mt-0.5 block text-xs text-ink-400">Tags shown as pills below the description (e.g. Flights, Visa, Umrah)</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {content.feature_tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-brand-600/60 transition hover:text-pop-red" aria-label={`Remove ${tag}`}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Add a tag (e.g. Cruises)"
                  className="flex-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                />
                <button
                  onClick={addTag}
                  className="flex items-center gap-1.5 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink-800"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-ink-100">
          <p className="text-sm text-ink-500">No hero content found.</p>
        </div>
      )}
    </div>
  );
}

export default AdminHero;
