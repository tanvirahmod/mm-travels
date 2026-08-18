import { useEffect, useState } from 'react';
import {
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
import AnnouncementBar from '@/components/AnnouncementBar';
import { TravelTexture } from '@/components/TravelDecor';

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
      {/* Global travel texture backdrop */}
      <TravelTexture />

      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Branding header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-soft backdrop-blur-xl border-b border-ink-100' : 'bg-white'}`}>
        <div className="container-x relative flex max-w-7xl items-center justify-center gap-5 py-3.5">
          <button onClick={() => handleNav('home')} className="flex items-center gap-3">
            <img
              src="https://ik.imagekit.io/oy2vruqkz/Gemini_Generated_Image_koh4ckoh4ckoh4ck-modified.png"
              alt="MM Travels & Tourism Services"
              className="h-14 w-14 rounded-2xl object-cover shadow-glow-sm sm:h-16 sm:w-16"
            />
            <span className="bg-[linear-gradient(90deg,#0F172A_0%,#1E63FF_55%,#0F172A_100%)] bg-[length:200%_auto] bg-clip-text font-display text-xl font-extrabold tracking-tight text-transparent animate-gradient-pan sm:text-2xl">
              MM Travels &amp; Tourism Services
            </span>
          </button>

          <button onClick={() => setMenuOpen(!menuOpen)} className="absolute right-4 rounded-xl p-2 text-ink-900 transition hover:bg-ink-100 lg:hidden" aria-label="Toggle navigation">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
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
            <button onClick={openEnquiry} className="my-2 flex items-center justify-center gap-2 rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-600 transition hover:bg-brand-50 lg:my-0"><MessageCircle size={16} /> Plan your trip</button>
          </div>
        </nav>
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-navy-900 text-white">
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
              <a href="#" className="rounded-xl bg-white/10 p-2.5 text-white/70 transition hover:bg-brand-200 hover:text-white"><Instagram size={16} /></a>
              <a href="#" className="rounded-xl bg-white/10 p-2.5 text-white/70 transition hover:bg-brand-200 hover:text-white"><Youtube size={16} /></a>
              <a href="#" className="rounded-xl bg-white/10 p-2.5 text-white/70 transition hover:bg-brand-200 hover:text-white"><MessageCircle size={16} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.17em] text-brand-400">Explore</h3>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <button className="block transition hover:text-white" onClick={() => handleNav('about-us')}>About us</button>
              <button className="block transition hover:text-white" onClick={() => handleNav('services')}>Our services</button>
              <button className="block transition hover:text-white" onClick={() => handleNav('destinations')}>Destinations</button>
              <button className="block transition hover:text-white" onClick={() => handleNav('contact-us')}>Contact us</button>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.17em] text-brand-400">Services</h3>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              <p>Flight booking</p><p>Visa processing</p><p>Hotel reservations</p><p>Umrah &amp; Hajj packages</p><p>Travel insurance</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.17em] text-brand-400">Find us</h3>
            <div className="mt-5 space-y-4 text-sm text-white/60">
              <p className="flex gap-3"><MapPin size={17} className="shrink-0 text-brand-400" /> Al Sadd, Doha, Qatar<br />Uttara, Dhaka, Bangladesh</p>
              <p className="flex items-center gap-3"><Phone size={16} className="text-brand-400" /> +974 6648 6076</p>
              <p className="flex items-center gap-3"><Mail size={16} className="text-brand-400" /> info@mmtravels.qa</p>
            </div>
            <button onClick={() => handleNav('branches')} className="mt-4 flex w-full items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-3 text-xs text-white/60 transition hover:bg-white/10 hover:text-white">
              <Navigation size={17} className="text-brand-400" /> View office locations <ChevronRight size={14} className="ml-auto" />
            </button>
            <button onClick={() => handleNav('admin')} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-brand-600">
              Admin Panel
            </button>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x flex max-w-7xl flex-col gap-3 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2024 MM Travels &amp; Tourism Services. <button onClick={() => handleNav('admin')} className="text-white/30 transition hover:text-brand-400">Admin</button></p>
            <p className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-brand-400" /> Safe journeys, always.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/97466486076"
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow transition hover:scale-105"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/50" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-[26px] w-[26px]"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.01 3.2C8.96 3.2 3.2 8.96 3.2 16.01c0 2.42.66 4.74 1.92 6.78L3.2 28.8l6.16-1.6a12.74 12.74 0 0 0 6.65 1.86h.01c7.05 0 12.81-5.76 12.81-12.81 0-3.43-1.34-6.65-3.76-9.07A12.7 12.7 0 0 0 16.01 3.2zm0 23.21h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.66.95.98-3.57-.25-.39a10.56 10.56 0 0 1-1.62-5.62c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.1 7.52 3.11a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.77 10.63-10.63 10.63zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.64 0 1.56 1.14 3.06 1.3 3.27.16.21 2.25 3.43 5.45 4.81.76.33 1.36.53 1.82.68.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.15-1.52.26-.74.26-1.38.18-1.52-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </a>
    </div>
  );
}

export default Layout;
