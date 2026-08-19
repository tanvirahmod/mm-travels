import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Navigation,
  Building2,
} from 'lucide-react';
import { useApp } from '@/components/AppContext';
import { PageHeroDecor, TravelEyebrow, PlaneMark } from '@/components/TravelDecor';

const WHATSAPP_URL = 'https://wa.me/97466486076';

const director = {
  name: 'Md. Mahmudul Hasan',
  designation: 'Managing Director',
  photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=700',
  message:
    'With over a decade of experience in travel, visa, and attestation services, our mission is simple: make global mobility effortless for every client. From our offices in Dhaka and Doha, we personally oversee each application so your documents, visas, and journeys are handled with care and complete transparency. Feel free to reach out to me directly on WhatsApp — I am always happy to help.',
};

const offices = [
  {
    name: 'Dhaka Head Office',
    location: 'Uttara, Dhaka, Bangladesh',
    address: 'House 25, Road 7, Sector 4, Uttara Model Town, Dhaka 1230',
    phone: '+880 1744 421253',
    phoneAlt: '+880 2 4895 1234',
    email: 'dhaka@mmtravelsbd.com',
    hours: 'Saturday – Thursday, 9:00 AM – 7:00 PM',
    hoursFriday: 'Friday: Closed',
    mapQuery: 'Uttara, Dhaka, Bangladesh',
    accent: 'green',
  },
  {
    name: 'Doha Office',
    location: 'Al Sadd, Doha, Qatar',
    address: 'Salwa Road, Al Sadd Plaza, Office 302, Doha, Qatar',
    phone: '+974 6648 6076',
    phoneAlt: '+974 4408 2210',
    email: 'info@mmtravels.qa',
    hours: 'Sunday – Thursday, 8:30 AM – 6:00 PM',
    hoursFriday: 'Saturday: 9:00 AM – 1:00 PM',
    mapQuery: 'Al Sadd, Doha, Qatar',
    accent: 'navy',
  },
];

function Contact() {
  const { openEnquiry } = useApp();

  return (
    <>
      {/* Page header */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-16 sm:py-20">
        <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-50" style={{ backgroundImage: `linear-gradient(110deg, rgba(2,6,23,.92), rgba(30,58,138,.5)), url(https://images.pexels.com/photos/31711206/pexels-photo-31711206.jpeg?auto=compress&cs=tinysrgb&w=1800)` }} />
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-60" />
        <PageHeroDecor />
        <div className="container-x max-w-7xl">
          <TravelEyebrow>Contact &amp; Branches</TravelEyebrow>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">We&apos;re here to help</h1>
          <p className="lede mt-4 max-w-xl text-white/70">Visit us at one of our offices in Dhaka or Doha, or send us a message — our travel experts are ready to assist you.</p>
        </div>
      </section>

      {/* Office cards */}
      <section className="container-x max-w-7xl py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {offices.map((office) => (
            <div key={office.name} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:shadow-soft">
              <div className="relative h-52 overflow-hidden bg-brand-50">
                <iframe
                  title={`Map of ${office.name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(office.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="h-full w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${office.accent === 'green' ? 'bg-brand-100 text-brand-600' : 'bg-brand-50 text-brand-600'}`}>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-ink-900">{office.name}</h3>
                    <p className="flex items-center gap-1.5 text-sm text-ink-500"><MapPin size={13} className="text-brand-500" /> {office.location}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <p className="flex items-start gap-3 text-ink-600">
                    <MapPin size={17} className="mt-0.5 shrink-0 text-brand-500" />
                    {office.address}
                  </p>
                  <p className="flex items-center gap-3 text-ink-600">
                    <Phone size={16} className="shrink-0 text-brand-500" />
                    <span><a href={`tel:${office.phone.replace(/\s/g, '')}`} className="font-bold text-ink-900 hover:text-brand-600">{office.phone}</a> <span className="text-ink-300">|</span> <a href={`tel:${office.phoneAlt.replace(/\s/g, '')}`} className="hover:text-brand-600">{office.phoneAlt}</a></span>
                  </p>
                  <p className="flex items-center gap-3 text-ink-600">
                    <Mail size={16} className="shrink-0 text-brand-500" />
                    <a href={`mailto:${office.email}`} className="hover:text-brand-600">{office.email}</a>
                  </p>
                  <div className="flex items-start gap-3 text-ink-600">
                    <Clock size={16} className="mt-0.5 shrink-0 text-brand-500" />
                    <div>
                      <p className="font-semibold text-ink-700">{office.hours}</p>
                      <p className="text-ink-500">{office.hoursFriday}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2.5">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(office.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    <Navigation size={15} /> Directions
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="bg-brand-gradient-soft py-12">
        <div className="container-x grid max-w-7xl gap-4 sm:grid-cols-3">
          {[
            { icon: Phone, label: 'Call Us', value: '+974 6648 6076', sub: 'Doha, Qatar' },
            { icon: Mail, label: 'Email Us', value: 'info@mmtravels.qa', sub: 'We reply within 24h' },
            { icon: MessageCircle, label: 'WhatsApp', value: '+880 1744 421253', sub: 'Dhaka, Bangladesh' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-soft border border-ink-100 transition hover:shadow-soft">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600"><Icon size={22} /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-500">{label}</p>
                <p className="text-sm font-bold text-ink-900">{value}</p>
                <p className="text-xs text-ink-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Director section */}
      <section className="container-x max-w-7xl py-12 sm:py-16">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
          <div className="grid md:grid-cols-[260px_1fr]">
            <div className="relative bg-brand-50">
              <img
                src={director.photo}
                alt={`${director.name}, ${director.designation}`}
                className="h-72 w-full object-cover md:h-full"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 to-transparent" />
            </div>
            <div className="p-7 sm:p-9">
              <TravelEyebrow>Leadership</TravelEyebrow>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-ink-900">{director.name}</h2>
              <p className="text-sm font-bold text-brand-600">{director.designation}</p>
              <p className="mt-4 text-sm leading-7 text-ink-600">{director.message}</p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6"
              >
                <MessageCircle size={16} /> Chat with the Director on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-gradient-reverse px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-mesh-pop opacity-50" />
        <div className="container-x relative flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-300"><PlaneMark className="h-4 w-4" /> Ready when you are</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Let&apos;s plan your next journey.</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">Have a question about visas, packages, or flights? Our team is standing by.</p>
          </div>
          <button onClick={openEnquiry} className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-brand-soft transition hover:bg-red-600 hover:shadow-glow">Send us a message <Send size={16} /></button>
        </div>
      </section>
    </>
  );
}

export default Contact;
