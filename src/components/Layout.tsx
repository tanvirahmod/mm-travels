import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  PlaneTakeoff,
  Navigation,
  ChevronRight,
  ShieldCheck,
  X,
  Youtube,
} from 'lucide-react';
import { useApp, type PageId } from '@/components/AppContext';

const navItems: { label: string; page: PageId }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About Us', page: 'about-us' },
  { label: 'Services', page: 'services' },
  { label: 'Packages', page: 'packages' },
  { label: 'Destinations', page: 'destinations' },
  { label: 'Tour Services', page: 'tours' },
  { label: 'Visa Services', page: 'visa' },
  { label: 'Contact Us', page: 'contact-us' },
  { label: 'Branches', page: 'branches' },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, navigate, openEnquiry } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: PageId) => {
    navigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-ink-900">
      {/* Top utility bar */}
      <div className="bg-ink-900 text-white border-b border-ink-800">
        <div className="container-x flex max-w-7xl flex-wrap items-center justify-between gap-3 py-2.5 text-[11px] font-medium tracking-wide">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-brand-400" /> Doha, Qatar</span>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span className="hidden items-center gap-1.5 sm:flex"><MapPin size={13} className="text-brand-400" /> Dhaka, Bangladesh</span>
            <span className="hidden h-3 w-px bg-white/20 lg:block" />
            <span className="hidden items-center gap-1.5 lg:flex"><Mail size={13} className="text-brand-400" /> info@mmtravels.qa</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="text-white/70 transition hover:text-brand-400"><Instagram size={14} /></a>
            <a href="#" aria-label="YouTube" className="text-white/70 transition hover:text-brand-400"><Youtube size={14} /></a>
            <a href="#" aria-label="WhatsApp" className="text-white/70 transition hover:text-brand-400"><MessageCircle size={14} /></a>
            <span className="h-3 w-px bg-white/20" />
            <button className="flex items-center gap-1 text-white/60 transition hover:text-brand-400" onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')} aria-label="Switch language">
              {language} <ChevronDown size={12} />
            </button>
            <span className="h-3 w-px bg-white/20" />
             <button onClick={() => handleNav('admin')} className="flex items-center gap-1 text-white/60 transition hover:text-brand-400" aria-label="Admin login">
               Admin
             </button>
          </div>
        </div>
      </div>

      {/* Branding header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-soft backdrop-blur-xl border-b border-ink-100' : 'bg-white'}`}>
        <div className="container-x flex max-w-7xl items-center justify-between gap-5 py-3.5">
          <button onClick={() => handleNav('home')} className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
              <PlaneTakeoff size={24} strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-pop-red ring-2 ring-white" />
            </div>
            <div className="min-w-0 text-left">
              <p className="font-display truncate text-[16px] font-extrabold leading-tight tracking-tight text-ink-900 sm:text-lg">MM Travels <span className="text-brand-600">&amp; Tourism</span></p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500"><BadgeCheck size={12} className="text-brand-500" /> Govt. Approved · Lic. 17539</p>
            </div>
          </button>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="rounded-2xl border border-ink-200 bg-ink-50 px-4 py-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink-500"><Phone size={13} className="text-brand-500" /> Call us today</div>
              <p className="mt-0.5 text-sm font-bold text-ink-900">+01744 421253 <span className="font-normal text-ink-400">BD</span> <span className="mx-1 text-ink-200">·</span> +974 6648 6076 <span className="font-normal text-ink-400">Qatar</span></p>
            </div>
            <button onClick={openEnquiry} className="btn-primary group">
              Enquiry Now <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl p-2 text-ink-900 transition hover:bg-ink-100 lg:hidden" aria-label="Toggle navigation">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>

        {/* Navigation */}
        <nav className={`${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden border-t border-ink-100 bg-white transition-all duration-300 lg:max-h-none lg:opacity-100`}>
          <div className="container-x flex max-w-7xl flex-col py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col lg:flex-row lg:items-center">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`relative border-b border-ink-100 px-0 py-3 text-left text-sm font-semibold transition hover:text-brand-600 lg:border-0 lg:px-4 lg:py-4 ${
                    currentPage === item.page ? 'text-brand-600' : 'text-ink-600'
                  }`}
                >
                  {item.label}
                  {currentPage === item.page && <span className="absolute inset-x-4 -bottom-px hidden h-0.5 rounded-full bg-brand-gradient lg:block" />}
                </button>
              ))}
            </div>
            <button onClick={openEnquiry} className="my-2 flex items-center justify-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100 lg:my-0"><MessageCircle size={16} /> Plan your trip</button>
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-ink-900 text-white">
        <div className="pointer-events-none absolute inset-0 bg-mesh-pop opacity-40" />
        <div className="container-x relative grid max-w-7xl gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient"><PlaneTakeoff size={22} className="text-white" /></div>
              <div>
                <p className="font-display text-base font-extrabold">MM Travels &amp; Tourism</p>
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/50">Your trusted travel partner</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">Making global travel feel closer, easier, and more human from our offices in Doha and Dhaka.</p>
            <div className="mt-5 flex gap-2">
              <a href="#" className="rounded-xl bg-white/10 p-2.5 text-white/70 transition hover:bg-brand-500 hover:text-white"><Instagram size={16} /></a>
              <a href="#" className="rounded-xl bg-white/10 p-2.5 text-white/70 transition hover:bg-brand-500 hover:text-white"><Youtube size={16} /></a>
              <a href="#" className="rounded-xl bg-white/10 p-2.5 text-white/70 transition hover:bg-brand-500 hover:text-white"><MessageCircle size={16} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.17em] text-brand-300">Explore</h3>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <button className="block transition hover:text-white" onClick={() => handleNav('about-us')}>About us</button>
              <button className="block transition hover:text-white" onClick={() => handleNav('services')}>Our services</button>
              <button className="block transition hover:text-white" onClick={() => handleNav('destinations')}>Destinations</button>
              <button className="block transition hover:text-white" onClick={() => handleNav('contact-us')}>Contact us</button>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.17em] text-brand-300">Services</h3>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <p>Flight booking</p><p>Visa processing</p><p>Hotel reservations</p><p>Umrah &amp; Hajj packages</p><p>Travel insurance</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.17em] text-brand-300">Find us</h3>
            <div className="mt-5 space-y-4 text-sm text-white/60">
              <p className="flex gap-3"><MapPin size={17} className="shrink-0 text-brand-300" /> Al Sadd, Doha, Qatar<br />Uttara, Dhaka, Bangladesh</p>
              <p className="flex items-center gap-3"><Phone size={16} className="text-brand-300" /> +974 6648 6076</p>
              <p className="flex items-center gap-3"><Mail size={16} className="text-brand-300" /> info@mmtravels.qa</p>
            </div>
            <button onClick={() => handleNav('branches')} className="mt-4 flex w-full items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-3 text-xs text-white/60 transition hover:bg-white/10 hover:text-white">
              <Navigation size={17} className="text-brand-300" /> View office locations <ChevronRight size={14} className="ml-auto" />
            </button>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x flex max-w-7xl flex-col gap-3 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2024 MM Travels &amp; Tourism Services. <button onClick={() => handleNav('admin')} className="text-white/30 transition hover:text-brand-300">Admin</button></p>
            <p className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-300" /> Safe journeys, always.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <button
        onClick={openEnquiry}
        className="group fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow transition hover:scale-105"
        aria-label="Open enquiry form"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-400/50" />
        <MessageCircle size={25} />
      </button>
    </div>
  );
}

export default Layout;
