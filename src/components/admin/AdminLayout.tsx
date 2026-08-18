import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Briefcase,
  FileText,
  Users,
  MapPin,
  X,
  Images,
  LayoutGrid,
  ChevronRight,
  UserPlus,
  ClipboardList,
  Megaphone,
} from 'lucide-react';

import { useApp } from '@/components/AppContext';

type NavItem = {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  end?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true }],
  },
  {
    label: 'Website',
    items: [
       { to: '/admin/hero-slider', icon: Images, label: 'Hero Slider' },
      { to: '/admin/cards', icon: LayoutGrid, label: 'Service Cards' },
      { to: '/admin/announcements', icon: Megaphone, label: 'Announcement Bar' },
    ],
  },
  {
    label: 'Travel Catalog',
    items: [
      { to: '/admin/tours', icon: Briefcase, label: 'Tours' },
      { to: '/admin/visas', icon: FileText, label: 'Visas' },
      { to: '/admin/visa-applications', icon: UserPlus, label: 'Visa Applications' },
      { to: '/admin/tour-applications', icon: ClipboardList, label: 'Tour Applications' },
      { to: '/admin/destinations', icon: MapPin, label: 'Destinations' },
    ],
  },
  {
    label: 'Team',
    items: [{ to: '/admin/agents', icon: Users, label: 'Agents' }],
  },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminLoggedIn, setAdminLoggedIn } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const activeGroup = navGroups.find((group) =>
    group.items.some((item) =>
      item.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.to)
    )
  );
  const activeItem = activeGroup?.items.find((item) =>
    item.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.to)
  );

  const handleLogout = () => {
    setAdminLoggedIn(false);
    navigate('/');
  };

  if (!adminLoggedIn) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-brand-gradient-soft px-5 py-16">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl bg-white shadow-card border border-ink-100">
            <div className="relative bg-navy-900 px-7 py-8 text-center text-white">
              <div className="pointer-events-none absolute inset-0 bg-mesh-pop opacity-50" />
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient">
                <LayoutDashboard size={26} className="text-white" />
              </div>
              <h1 className="relative font-display text-2xl font-extrabold">Admin Panel</h1>
              <p className="relative mt-2 text-sm text-white/60">Sign in to manage your travel agency</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-brand-gradient-soft">
      <div className="flex">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-ink-100 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-6 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient shadow-glow-sm">
                <LayoutDashboard size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate font-display text-base font-extrabold text-ink-900">Admin Panel</h2>
                <p className="truncate text-xs text-ink-500">MM Travels &amp; Tourism</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 lg:hidden">
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto p-3">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-4 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-ink-500">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                          isActive
                            ? 'bg-brand-gradient text-white shadow-glow-sm'
                            : 'text-ink-600 hover:bg-ink-50 hover:text-brand-600'
                        }`
                      }
                    >
                      <item.icon size={18} className="shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <ChevronRight
                        size={15}
                        className="shrink-0 opacity-0 transition group-hover:opacity-40"
                      />
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-1 border-t border-ink-100 p-3">
            <button
              onClick={() => navigate('/')}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-600 transition hover:bg-ink-50 hover:text-brand-600"
            >
              <LayoutGrid size={18} />
              View Website
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-600 transition hover:bg-brand-500/10 hover:text-brand-600"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-ink-600 transition hover:bg-ink-50">
              <Menu size={20} />
            </button>
            <span className="font-display text-base font-extrabold text-ink-900">Admin Panel</span>
          </div>
          <div className="sticky top-0 z-20 hidden items-center gap-2 border-b border-ink-100 bg-white/95 px-6 py-3 text-sm backdrop-blur-xl lg:flex">
            <span className="font-semibold text-ink-500">{activeGroup?.label}</span>
            {activeItem && (
              <>
                <ChevronRight size={14} className="text-ink-300" />
                <span className="font-semibold text-ink-900">{activeItem.label}</span>
              </>
            )}
          </div>
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function LoginForm() {
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const { setAdminLoggedIn } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === 'admin' && loginPass === 'mmtravels2024') {
      setAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid ID or password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5 p-7">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Admin ID</span>
        <input
          type="text"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          required
          className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
          placeholder="Enter admin ID"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-500">Password</span>
        <input
          type="password"
          value={loginPass}
          onChange={(e) => setLoginPass(e.target.value)}
          required
          className="mt-1.5 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15"
          placeholder="Enter password"
        />
      </label>
      {loginError && (
        <p className="rounded-xl bg-brand-500/10 border border-brand-500/20 px-4 py-3 text-sm font-semibold text-brand-600">{loginError}</p>
      )}
      <button type="submit" className="btn-primary w-full">
        <LayoutDashboard size={16} /> Sign In
      </button>
    </form>
  );
}

export default AdminLayout;
