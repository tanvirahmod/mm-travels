import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { supabase, type Agent } from '@/lib/supabase';

function AdminAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const loadAgents = async () => {
    setLoading(true);
    const { data } = await supabase.from('agents').select('*').order('created_at', { ascending: true });
    if (data) setAgents(data as Agent[]);
    setLoading(false);
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const openAdd = () => {
    setEditingAgent(null);
    setName('');
    setPhone('');
    setModalOpen(true);
  };

  const openEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setName(agent.name);
    setPhone(agent.phone);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    if (editingAgent) {
      await supabase.from('agents').update({ name: name.trim(), phone: phone.trim() }).eq('id', editingAgent.id);
    } else {
      await supabase.from('agents').insert({ name: name.trim(), phone: phone.trim() });
    }
    setSaving(false);
    setModalOpen(false);
    loadAgents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    await supabase.from('agents').delete().eq('id', id);
    loadAgents();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Agent Contacts</h1>
          <p className="mt-1 text-sm text-ink-500">Manage agent names and phone numbers shown on tour & visa detail pages.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAdd} className="btn-primary">
            <Plus size={16} /> Add Agent
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
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Name</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Phone</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {loading ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-ink-400">Loading...</td></tr>
              ) : agents.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-ink-400">No agents found. Add one above.</td></tr>
              ) : agents.map((agent) => (
                <tr key={agent.id} className="transition hover:bg-ink-50/50">
                  <td className="px-6 py-4 font-semibold text-ink-900">{agent.name}</td>
                  <td className="px-6 py-4 text-ink-600">{agent.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(agent)} className="rounded-lg p-2 text-ink-400 transition hover:bg-brand-50 hover:text-brand-600">
                        <Save size={14} />
                      </button>
                      <button onClick={() => handleDelete(agent.id)} className="rounded-lg p-2 text-ink-400 transition hover:bg-pop-red/10 hover:text-pop-red">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
              <h2 className="font-display text-lg font-extrabold text-ink-900">{editingAgent ? 'Edit Agent' : 'Add New Agent'}</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Agent Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahman Bhai" className="field-style w-full" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-400">Phone Number</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +974 6648 6076" className="field-style w-full" />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-4">
                <button onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
                <button onClick={handleSave} className="btn-primary" disabled={saving}>
                  {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Agent'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAgents;
