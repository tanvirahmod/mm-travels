import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  X,
} from 'lucide-react';
import { supabase, type TourApplication } from '@/lib/supabase';

function AdminTourApplications() {
  const [applications, setApplications] = useState<TourApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadApplications = async () => {
    setLoading(true);
    const { data } = await supabase.from('tour_applications').select('*').order('created_at', { ascending: false });
    if (data) setApplications(data as TourApplication[]);
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    await supabase.from('tour_applications').delete().eq('id', id);
    loadApplications();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink-900">Tour Applications</h1>
          <p className="mt-1 text-sm text-ink-500">Manage tour booking form submissions.</p>
        </div>
        <div className="flex items-center gap-3">
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
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Tour</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Mobile</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Status</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Date</th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-400">Loading...</td></tr>
              ) : applications.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-400">No tour applications found.</td></tr>
              ) : applications.map((app) => (
                <tr key={app.id} className="transition hover:bg-ink-50/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-ink-900">{app.full_name}</p>
                      <p className="text-xs text-ink-500">{app.address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink-600">{app.tour_title}</td>
                  <td className="px-6 py-4 text-ink-600">{app.mobile_number}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${app.status === 'new' ? 'bg-brand-100 text-brand-700' : 'bg-ink-100 text-ink-600'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-ink-500 whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(app.id)} className="rounded-lg p-2 text-ink-400 transition hover:bg-pop-red/10 hover:text-pop-red">
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

export default AdminTourApplications;
