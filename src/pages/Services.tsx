import { useNavigate } from 'react-router-dom';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Zap,
  BadgeDollarSign,
  Headphones,
  Phone,
  MessageCircle,
  Globe,
} from 'lucide-react';
import { useApp } from '@/components/AppContext';
import { allServices } from '@/data/allServicesData';

const WHATSAPP_URL = 'https://wa.me/97466486076';
const CALL_NUMBER = '+8801744421253';

const knownRoutes = ['/visa', '/tours', '/services/documents', '/umrah'];

const whyChooseUs = [
  { icon: ShieldCheck, title: 'Authorized & Verified Agency', desc: 'Govt.-recognized and fully licensed for visa, travel, and attestation services.' },
  { icon: Zap, title: 'Fast Processing Time', desc: 'Express queues and priority handling so you never miss a deadline.' },
  { icon: BadgeDollarSign, title: 'Transparent Pricing', desc: 'Clear, all-inclusive quotes with zero hidden fees or surprises.' },
  { icon: Headphones, title: 'Dedicated Support Desk', desc: 'Responsive assistance over call and WhatsApp before, during, and after travel.' },
];

export default function Services() {
  const navigate = useNavigate();
  const { openEnquiry } = useApp();

  const handleExplore = (link: string) => {
    if (knownRoutes.includes(link)) {
      navigate(link);
    } else {
      openEnquiry();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-[#0B2545] py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-50" />
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#25D366]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#25D366]/15 blur-3xl" />
        <div className="absolute inset-0 -z-10 opacity-20">
          <Globe className="absolute right-10 top-8 h-40 w-40 text-[#25D366]" />
        </div>
        <div className="container-x max-w-7xl">
          <span className="eyebrow"><Globe size={14} /> All Services</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Comprehensive Travel &amp; Legalization Services
          </h1>
          <p className="lede mt-4 max-w-2xl text-white/70">
            Your one-stop agency for flights, visa processing, tour packages, and official document attestation in Bangladesh.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-x max-w-7xl py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-[#25D366] hover:shadow-card-hover before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:bg-[#25D366] before:transition-transform before:duration-300 hover:before:scale-x-100"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
                    <Icon size={26} />
                  </span>
                  <span className="rounded-full bg-[#25D366]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#25D366]">
                    {service.badge}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-extrabold text-ink-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">{service.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {service.keyFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleExplore(service.actionLink)}
                  className="btn-primary mt-6 w-full"
                >
                  Explore Service <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-brand-gradient-soft py-14 sm:py-16">
        <div className="container-x max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Why MM Travels</span>
            <h2 className="section-title mt-4">Trusted for every journey</h2>
            <p className="lede mt-3 text-ink-500">Four reasons travelers and businesses choose us as their travel & legalization partner.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
                  <item.icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-base font-extrabold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-[#25D366] px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-mesh-pop opacity-30" />
        <div className="container-x relative flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              <MessageCircle size={16} /> We&apos;re ready to help
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Need a Custom Travel Service or Urgent Legalization?
            </h2>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${CALL_NUMBER}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0B2545] shadow-glow transition hover:bg-white/90"
            >
              <Phone size={16} /> Call Desk Now
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              <MessageCircle size={16} /> WhatsApp Inquiry
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
