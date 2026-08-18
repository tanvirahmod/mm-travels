import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  MapPin,
  Luggage,
  Globe,
  FileText,
  Pencil,
  X,
  Check,
} from 'lucide-react';
import { supabase, type TourDestination, type TourType, type VisaCountry, type VisaType } from '@/lib/supabase';

type LookupTable = 'tour_destinations' | 'tour_types' | 'visa_countries' | 'visa_types';
type LookupItem = TourDestination | TourType | VisaCountry | VisaType;

const tables: { id: LookupTable; label: string; icon: typeof MapPin }[] = [
  { id: 'tour_destinations', label: 'Tour Destinations', icon: MapPin },
  { id: 'tour_types', label: 'Tour Types', icon: Luggage },
  { id: 'visa_countries', label: 'Visa Countries', icon: Globe },
  { id: 'visa_types', label: 'Visa Types', icon: FileText },
];

function AdminDestinations() {
  const [activeTable, setActiveTable] = useState<LookupTable>('tour_destinations');
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  const currentTable = tables.find((t) => t.id === activeTable)!;

  const loadItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from(activeTable).select('*').order('name');
    if (data) setItems(data as LookupItem[]);
    setLoading(false);
  }, [activeTable]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    await supabase.from(activeTable).insert({ name: newName.trim() });
    setNewName('');
    setLoading(false);
    loadItems();
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    setLoading(true);
    await supabase.from(activeTable).update({ name: editName.trim() }).eq('id', id);
    setEditingId(null);
    setEditName('');
    setLoading(false);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    await supabase.from(activeTable).delete().eq('id', id);
    setLoading(false);
    loadItems();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Dropdown Manager</h1>
          <p className="mt-1 text-sm text-ink-500">Manage options for tour and visa dropdowns across the site.</p>
        </div>
        <button onClick={() => navigate('/admin')} className="btn-ghost">
          <X size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveTable(t.id); setEditingId(null); setEditName(''); setNewName(''); }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTable === t.id
                ? 'bg-brand-gradient text-white shadow-glow-sm'
                : 'bg-white text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-50'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div className="border-b border-ink-100 px-6 py-4">
          <h2 className="font-display text-lg font-extrabold text-ink-900">{currentTable.label}</h2>
        </div>
        <div className="p-6">
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`Add new ${currentTable.label.toLowerCase().slice(0, -1)}`}
              className="field-style flex-1"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            />
            <button onClick={handleAdd} className="btn-primary px-4 py-2.5" disabled={loading}>
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
              </div>
            ) : items.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-500">No items found. Add one above.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3">
                  {editingId === item.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="field-style flex-1"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(item.id); }}
                      />
                      <button onClick={() => handleEdit(item.id)} className="rounded-lg bg-brand-500 p-2 text-white transition hover:bg-brand-600">
                        <Check size={14} />
                      </button>
                      <button onClick={() => { setEditingId(null); setEditName(''); }} className="rounded-lg bg-ink-200 p-2 text-ink-600 transition hover:bg-ink-300">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                        <currentTable.icon size={16} className="text-brand-500" />
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditingId(item.id); setEditName(item.name); }} className="rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 hover:text-brand-600">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-500/10 hover:text-brand-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDestinations;
