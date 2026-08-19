import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Phone, X, CheckCircle2 } from 'lucide-react';
import { supabase, type AttestationOrder } from '@/lib/supabase';

const STATUS_FLOW = ['new', 'contacted', 'completed'] as const;

function AdminAttestationOrders() {
  const [orders, setOrders] = useState<AttestationOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from('attestation_orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data as AttestationOrder[]);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    await supabase.from('attestation_orders').delete().eq('id', id);
    loadOrders();
  };

  const handleStatus = async (order: AttestationOrder) => {
    const currentIndex = STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]);
    const nextStatus = STATUS_FLOW[(currentIndex + 1) % STATUS_FLOW.length];
    await supabase.from('attestation_orders').update({ status: nextStatus, updated_at: new Date().toISOString() }).eq('id', order.id);
    loadOrders();
  };

  const statusStyles: Record<string, string> = {
    new: 'bg-brand-50 text-brand-600',
    contacted: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Attestation Orders</h1>
          <p className="mt-1 text-sm text-ink-500">Manage document attestation inquiry submissions.</p>
        </div>
        <button onClick={() => navigate('/admin')} className="btn-ghost">
          <X size={16} /> Back
        </button>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Name</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Phone</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Service</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Target Country</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Status</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Date</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-ink-500">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-ink-500">No attestation orders found.</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="transition hover:bg-ink-50/50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-ink-900">{order.full_name}</p>
                    {order.message && (
                      <p className="mt-1 max-w-xs text-xs text-ink-500">{order.message}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <a href={`tel:${order.phone_number}`} className="inline-flex items-center gap-1.5 text-ink-600 transition hover:text-brand-600">
                      <Phone size={13} /> {order.phone_number}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-ink-600">{order.service}</td>
                  <td className="px-6 py-4 text-ink-600">{order.target_country || '—'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatus(order)}
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${statusStyles[order.status] ?? 'bg-ink-100 text-ink-600'}`}
                      title="Click to change status"
                    >
                      {order.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-ink-500 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatus(order)}
                        className="rounded-lg p-2 text-ink-500 transition hover:bg-emerald-500/10 hover:text-emerald-600"
                        title="Mark next status"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="rounded-lg p-2 text-ink-500 transition hover:bg-brand-500/10 hover:text-brand-600"
                        title="Delete order"
                      >
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
    </div>
  );
}

export default AdminAttestationOrders;
