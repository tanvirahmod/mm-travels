import { useNavigate } from 'react-router-dom';
import { Clock, Check, ArrowRight, ShieldCheck, Zap, Truck } from 'lucide-react';
import { attestationServices } from '@/data/documentServices';

export default function DocumentServices() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-50" style={{ backgroundImage: `linear-gradient(110deg, rgba(2,6,23,.92), rgba(30,58,138,.5)), url(https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1800)` }} />
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-60" />
        <div className="container-x max-w-7xl">
          <span className="eyebrow">Document Attestation</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Fast &amp; Reliable Document Attestation Services
          </h1>
          <p className="lede mt-4 max-w-2xl text-white/70">
            Official Ministry &amp; Embassy Legalization Support in Bangladesh.
          </p>
        </div>
      </section>

      {/* Card Grid */}
      <section className="container-x max-w-7xl py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {attestationServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.slug}
                className="flex flex-col rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 font-display text-lg font-extrabold text-ink-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">{service.shortDescription}</p>

                <ul className="mt-4 space-y-2">
                  {service.requiredDocuments.slice(0, 3).map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-ink-700">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      {doc}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center gap-1.5 rounded-lg bg-ink-50 px-3 py-2 text-xs font-bold text-ink-700">
                  <Clock size={14} className="text-[#25D366]" />
                  Processing Time: {service.processingTime}
                </div>

                <button
                  onClick={() => navigate(`/services/documents/${service.slug}`)}
                  className="btn-primary mt-5 w-full"
                >
                  View Details &amp; Apply <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="container-x max-w-7xl pb-16">
        <div className="grid gap-4 rounded-3xl border border-ink-100 bg-brand-gradient-soft p-8 sm:grid-cols-3 sm:p-10">
          {[
            { icon: ShieldCheck, title: '100% Govt. Authorized', desc: 'Every step handled through official government channels.' },
            { icon: Zap, title: 'Express Processing', desc: 'Prioritized handling to meet your visa deadlines.' },
            { icon: Truck, title: 'Doorstep Document Pickup', desc: 'We collect and return your documents safely.' },
          ].map((badge) => (
            <div key={badge.title} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-soft">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                <badge.icon size={22} />
              </span>
              <div>
                <p className="font-display text-base font-extrabold text-ink-900">{badge.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
