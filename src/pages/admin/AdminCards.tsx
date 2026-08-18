import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  LayoutGrid,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { supabase, type ServiceCard } from '@/lib/supabase';

function AdminCards() {
  const [cards, setCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    supabase
      .from('service_cards')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err) {
          setError(err.message);
          return;
        }
        if (data) setCards(data as ServiceCard[]);
      });
  }, []);

  const updateCardField = (id: string, field: keyof ServiceCard, value: string | number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
    setSaved(false);
  };

  const addCard = async () => {
    const maxOrder = cards.reduce((max, c) => Math.max(max, c.sort_order), 0);
    const { data, error: err } = await supabase
      .from('service_cards')
      .insert({ sort_order: maxOrder + 1, image_url: '', title: 'New Service', description: 'Service description' })
      .select('*')
      .single();
    if (err) {
      setError(err.message);
      return;
    }
    if (data) setCards((prev) => [...prev, data as ServiceCard]);
  };

  const removeCard = async (id: string) => {
    const { error: err } = await supabase.from('service_cards').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const saveAllCards = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    const updates = cards.map((c) =>
      supabase
        .from('service_cards')
        .update({
          image_url: c.image_url,
          title: c.title,
          description: c.description,
          sort_order: c.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', c.id),
    );
    const results = await Promise.all(updates);
    setSaving(false);
    const firstErr = results.find((r) => r.error);
    if (firstErr?.error) {
      setError(firstErr.error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Service Cards</h1>
          <p className="mt-1 text-sm text-ink-500">Manage cards shown in the &ldquo;Travel made refreshingly easy&rdquo; section.</p>
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
          <p className="mt-4 text-sm text-ink-500">Loading cards...</p>
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-ink-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-brand-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Service Cards Editor</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={addCard}
                className="flex items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-ink-800"
              >
                <Plus size={14} /> Add Card
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-pop-red/10 border border-pop-red/20 px-4 py-3 text-sm font-semibold text-pop-red">{error}</p>
          )}

          <div className="space-y-4">
            {cards.map((card, index) => (
              <div key={card.id} className="rounded-2xl border border-ink-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-500">Card {index + 1}</span>
                  <button
                    onClick={() => removeCard(card.id)}
                    className="flex items-center gap-1 text-xs font-bold text-pop-red/70 transition hover:text-pop-red"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
                <div className="flex gap-4">
                  <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                    {card.image_url && <img src={card.image_url} alt={card.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Title</span>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateCardField(card.id, 'title', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Description</span>
                      <input
                        type="text"
                        value={card.description}
                        onChange={(e) => updateCardField(card.id, 'description', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Image URL</span>
                      <input
                        type="url"
                        value={card.image_url}
                        onChange={(e) => updateCardField(card.id, 'image_url', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
                        placeholder="https://..."
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-ink-100 pt-4">
            <button
              onClick={saveAllCards}
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Service Cards'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCards;
