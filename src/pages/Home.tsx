import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Bed,
  ChevronRight,
  Compass,
  FileText,
  FileCheck2,
  Headphones,
  ShieldCheck,
  Ticket,
  Car,
  Star,
  Quote,
  MapPin,
  Check,
  Plane,
  Images,
  Building,
  Palmtree,
  Send,
} from 'lucide-react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';
import { useApp } from '@/components/AppContext';
import Hero from '@/components/Hero';
import AirlineTicker from '@/components/AirlineTicker';
import SpotlightCard from '@/components/SpotlightCard';
import Reveal from '@/components/Reveal';
import { FlightDivider, GlobeRing, TravelStamp, FlightArc, TravelEyebrow, Cloud, PlaneMark } from '@/components/TravelDecor';
import { supabase, type ServiceCard } from '@/lib/supabase';
import { galleryImages } from '@/data/galleryData';

const defaultServiceCards: ServiceCard[] = [
  { id: '1', sort_order: 1, image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80', title: 'Air Ticket Booking', description: 'Domestic & International Flights', created_at: '', updated_at: '' },
  { id: '2', sort_order: 2, image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', title: 'Visa Processing', description: 'All Country Visa Services', created_at: '', updated_at: '' },
  { id: '3', sort_order: 3, image_url: 'https://images.unsplash.com/photo-1565552070098-0083a8410451?auto=format&fit=crop&w=600&q=80', title: 'Umrah & Hajj Packages', description: 'Best Packages with Best Service', created_at: '', updated_at: '' },
  { id: '4', sort_order: 4, image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', title: 'Holiday Packages', description: 'Amazing Tour Packages', created_at: '', updated_at: '' },
  { id: '5', sort_order: 5, image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', title: 'Hotel Booking', description: 'Worldwide Hotel Reservations', created_at: '', updated_at: '' },
  { id: '6', sort_order: 6, image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80', title: 'Travel Insurance', description: 'Safe Travel, Secure Journey', created_at: '', updated_at: '' },
  { id: '7', sort_order: 7, image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80', title: 'Airport Transfer', description: 'Comfortable & Reliable Service', created_at: '', updated_at: '' },
  { id: '8', sort_order: 8, image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80', title: 'Custom Tour Request', description: 'Tailored Itineraries for You', created_at: '', updated_at: '' },
];

const serviceIconMap: Record<string, typeof Ticket> = {
  AirTicketBooking: Plane,
  VisaProcessing: FileText,
  UmrahHajjPackages: Building,
  HolidayPackages: Palmtree,
  HotelBooking: Bed,
  TravelInsurance: ShieldCheck,
  AirportTransfer: Car,
  CustomTourRequest: Compass,
};

const fallbackImage = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';

function getServiceKey(title: string): string {
  return title.replace(/[^a-zA-Z0-9]/g, '');
}

const destinations = [
  { name: 'UK', fullName: 'United Kingdom', badge: 'VISA REQUIRED', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
  { name: 'UAE', fullName: 'United Arab Emirates', badge: 'VISA ON ARRIVAL', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Malaysia', fullName: 'Malaysia', badge: 'EVISA', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80' },
  { name: 'France', fullName: 'France', badge: 'SCHENGEN', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
  { name: 'Australia', fullName: 'Australia', badge: 'VISA REQUIRED', image: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?auto=format&fit=crop&w=600&q=80' },
  { name: 'KSA', fullName: 'Saudi Arabia', badge: 'UMRAH / EVISA', image: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=600&q=80' },
  { name: 'Singapore', fullName: 'Singapore', badge: 'VISA ON ARRIVAL', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80' },
  { name: 'Thailand', fullName: 'Thailand', badge: 'VISA ON ARRIVAL', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Turkey', fullName: 'Turkey', badge: 'EVISA', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80' },
  { name: 'Maldives', fullName: 'Maldives', badge: 'VISA ON ARRIVAL', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80' },
];

const testimonials = [
  {
    name: 'Tanvir Ahmed',
    location: 'Doha, Qatar',
    service: 'India Visa Processing',
    rating: 5,
    comment: 'Got my visa processed in record time! The MM Travels team handled all document verifications smoothly. Highly recommended for Bangladeshis living in Qatar.',
    avatar: 'https://ui-avatars.com/api/?name=Tanvir+Ahmed&background=0D8ABC&color=fff&size=128',
  },
  {
    name: 'Nusrat & Rafiq',
    location: 'Dhaka, Bangladesh',
    service: "Cox's Bazar 4D3N Package",
    rating: 5,
    comment: 'Our family trip was organized flawlessly. From hotel booking to island transport in St. Martin, everything was hassle-free and exactly as promised.',
    avatar: 'https://ui-avatars.com/api/?name=Nusrat+Rafiq&background=10B981&color=fff&size=128',
  },
  {
    name: 'Haji Md. Kamrul Islam',
    location: 'Uttara, Dhaka',
    service: 'VIP Umrah Package',
    rating: 5,
    comment: 'Exemplary service for Umrah. Excellent hotel location near the Haram in Makkah and very helpful local guides throughout our stay.',
    avatar: 'https://ui-avatars.com/api/?name=Haji+Kamrul&background=F59E0B&color=fff&size=128',
  },
  {
    name: 'Shahriar Hossain',
    location: 'Chittagong',
    service: 'Air Ticket Booking',
    rating: 5,
    comment: 'Best ticket prices for Qatar Airways flights. Customer support answered my WhatsApp messages late at night when my flight date needed changing.',
    avatar: 'https://ui-avatars.com/api/?name=Shahriar+Hossain&background=EF4444&color=fff&size=128',
  },
  {
    name: 'Dr. Farhana Chowdhury',
    location: 'Sylhet',
    service: 'Europe Tour Package',
    rating: 5,
    comment: 'Seamless visa guidance and tour itinerary for our European vacation. Everything was transparent with zero hidden costs.',
    avatar: 'https://ui-avatars.com/api/?name=Farhana+Chowdhury&background=8B5CF6&color=fff&size=128',
  },
  {
    name: 'Mahbub Alam',
    location: 'Gazipur',
    service: 'Document Attestation',
    rating: 5,
    comment: 'Fast and authentic document attestation service. They kept me updated via SMS every step of the way.',
    avatar: 'https://ui-avatars.com/api/?name=Mahbub+Alam&background=EC4899&color=fff&size=128',
  },
];

function GradientText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

function Home() {
  const { navigate, openEnquiry } = useApp();
  const routerNavigate = useRouterNavigate();
  const [services, setServices] = useState<ServiceCard[]>(defaultServiceCards);

  useEffect(() => {
    supabase
      .from('service_cards')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setServices(data as ServiceCard[]);
      });
  }, []);

  return (
    <>
      <Hero />
      <AirlineTicker />

      {/* Services grid */}
      <section className="relative container-x max-w-7xl py-16 sm:py-24">
        <Cloud className="pointer-events-none absolute -right-8 -top-6 h-24 w-52 text-brand-500/10" />
        <FlightArc className="pointer-events-none absolute right-10 top-2 h-20 w-44 text-brand-500/10" />
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <TravelEyebrow>Everything in one place</TravelEyebrow>
            <h2 className="section-title mt-4">
              Travel made <GradientText>refreshingly</GradientText> easy.
            </h2>
          </div>
          <button onClick={() => navigate('services')} className="flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5">
            View all services <ChevronRight size={17} />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = serviceIconMap[getServiceKey(service.title)] || Ticket;
            return (
              <Reveal key={service.id} delay={i * 60}>
                <SpotlightCard className="h-full rounded-3xl border border-ink-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-card-hover">
                  <button
                    onClick={() => routerNavigate('/services')}
                    className="flex h-full w-full flex-col overflow-hidden text-left"
                  >
                    <div className="relative h-36 overflow-hidden bg-brand-50">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        onError={(e) => {
                          e.currentTarget.src = fallbackImage;
                        }}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand-soft">
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <h3 className="font-display text-sm font-extrabold leading-5 text-ink-900">{service.title}</h3>
                      <p className="text-xs font-medium leading-5 text-ink-500">{service.description}</p>
                    </div>
                  </button>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <FlightDivider className="container-x max-w-7xl py-2" />

      {/* Destinations */}
      <section className="relative overflow-hidden bg-navy-50 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-70" />
        <GlobeRing className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 text-brand-500/10" />
        <TravelStamp className="pointer-events-none absolute -left-10 bottom-10 h-40 w-40 text-brand-500/10 [animation:none]" />
        <div className="container-x relative max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="text-center sm:text-left">
              <TravelEyebrow icon={<GlobeRing className="h-3.5 w-3.5" />}>Go somewhere new</TravelEyebrow>
              <h2 className="section-title mt-4">Popular <GradientText>destinations</GradientText></h2>
              <p className="lede mx-auto mt-3 max-w-xl text-ink-500 sm:mx-0">A little inspiration for your next escape, carefully chosen by our travel specialists.</p>
            </div>
            <button onClick={() => navigate('destinations')} className="flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5">
              View all destinations <ChevronRight size={17} />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {destinations.map((destination) => (
              <Reveal key={destination.name} delay={0}>
                <button
                  onClick={() => routerNavigate('/tours?destination=' + encodeURIComponent(destination.fullName))}
                  className="group relative aspect-[3/4] min-h-[240px] w-full overflow-hidden rounded-3xl text-left shadow-soft transition duration-500 hover:-translate-y-1.5 hover:shadow-card-hover"
                >
                  <img
                    src={destination.image}
                    alt={destination.fullName}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-900/30 to-transparent" />
                  <div className="absolute inset-0 bg-brand-500/0 transition duration-500 group-hover:bg-brand-500/10" />
                  <div className="absolute right-3 top-3">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                      {destination.badge}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">Explore</p>
                    <h3 className="mt-1 font-display text-base font-extrabold">{destination.name}</h3>
                    <p className="text-xs text-white/70">{destination.fullName}</p>
                  </div>
                  <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink-900 shadow-lg">View packages <ChevronRight size={13} /></span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-28">
        <div className="container-x max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <TravelEyebrow icon={<Images className="h-3.5 w-3.5" />}>Moments</TravelEyebrow>
              <h2 className="section-title mt-4">Captured journeys &amp; <GradientText>happy faces</GradientText></h2>
              <p className="lede mt-3 max-w-xl text-ink-500">A glimpse into the tours we&apos;ve led, the destinations we love, and the team behind every trip.</p>
            </div>
            <button onClick={() => routerNavigate('/gallery')} className="btn-primary shrink-0">
              View full gallery <ArrowRight size={16} />
            </button>
          </div>
          <div className="mt-10 grid auto-rows-[160px] grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
            {galleryImages.slice(0, 5).map((item, i) => (
              <Reveal key={item.id} delay={i * 50} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                <button
                  onClick={() => routerNavigate('/gallery')}
                  className="group relative h-full w-full overflow-hidden rounded-3xl border border-ink-100 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 right-3 text-left text-sm font-bold text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {item.title}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <FlightDivider className="container-x max-w-7xl py-2" />

      {/* Why MM Travels */}
      <section className="relative overflow-hidden bg-navy-50 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-70" />
        <GlobeRing className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 text-brand-500/10" />
        <div className="container-x relative max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <TravelEyebrow>Why MM Travels</TravelEyebrow>
            <h2 className="section-title mt-4">The <GradientText>thoughtful</GradientText> way to travel.</h2>
            <p className="lede mt-5 text-ink-500">Whether you&apos;re visiting family, chasing a new horizon, or making a sacred journey, our team takes care of the details so you can enjoy the moment.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Compass,
                title: 'Expert Guidance',
                subtitle: 'Advice from specialists who know the way.',
                points: ['Customized itineraries', 'Local destination insights', 'Tailored travel options'],
                tone: 'from-brand-500 to-brand-700',
              },
              {
                icon: ShieldCheck,
                title: 'Transparent Pricing',
                subtitle: 'Competitive fares with zero hidden surprises.',
                points: ['All-inclusive fare breakdowns', 'No extra processing fees', 'Best value guarantee'],
                tone: 'from-brand-400 to-brand-600',
              },
              {
                icon: FileCheck2,
                title: 'Hassle-Free Visa Services',
                subtitle: 'End-to-end document & visa assistance.',
                points: ['Document pre-verification', 'Fast application filing', 'High success rate tracking'],
                tone: 'from-brand-600 to-brand-800',
              },
              {
                icon: Headphones,
                title: '24/7 Dedicated Support',
                subtitle: 'Personal support before, during, and after travel.',
                points: ['Instant WhatsApp assistance', 'Airport arrival guidance', 'On-call emergency help'],
                tone: 'from-brand-500 to-brand-600',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <SpotlightCard className="h-full rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-card-hover">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-brand-soft`}>
                    <item.icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-extrabold text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-500">{item.subtitle}</p>
                  <ul className="mt-4 space-y-2">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-xs text-ink-600">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                          <Check size={11} strokeWidth={3} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button onClick={openEnquiry} className="btn-primary">Talk to a travel expert <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-30" />
        <Cloud className="pointer-events-none absolute -right-8 top-10 h-24 w-52 text-white/10 animate-float" />
        <PlaneMark className="pointer-events-none absolute left-12 top-1/4 h-6 w-6 -rotate-12 text-brand-300/60 animate-float [animation-delay:.8s]" />
        <FlightArc className="pointer-events-none absolute left-4 bottom-16 h-28 w-56 -rotate-6 text-brand-300/20" />
        <div className="container-x max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <TravelEyebrow>Testimonials</TravelEyebrow>
            <h2 className="section-title mt-4 text-white">What our <GradientText>happy travelers</GradientText> say</h2>
            <p className="lede mt-4 text-white/60">Trusted by thousands of travelers from Bangladesh, Qatar, and around the world.</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span>4.9 / 5 Star Rating</span>
              <span className="text-white/40">|</span>
              <span>1,200+ Verified Reviews on Google &amp; Facebook</span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={item.name} delay={(i % 3) * 80}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/10">
                  <div className="absolute right-4 top-4 text-white/10 transition duration-300 group-hover:text-white/20">
                    <Quote size={26} />
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} alt={item.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-white/20" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-white">{item.name}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-white/60"><MapPin size={12} /> {item.location}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} size={14} className={si < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'} />
                    ))}
                    <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70 sm:ml-2">{item.service}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/75">&ldquo;{item.comment}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-300">
                    <Check size={12} /> Verified Traveler
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative container-x max-w-7xl py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-4xl bg-navy-900 px-7 py-14 text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-mesh-pop opacity-40" />
          <FlightArc className="pointer-events-none absolute -right-8 bottom-6 h-40 w-80 -scale-x-100 text-brand-300/20" />
          <Cloud className="pointer-events-none absolute left-6 top-6 h-20 w-44 text-white/10 animate-float [animation-delay:1.2s]" />
          <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-300"><PlaneMark className="h-4 w-4" /> Ready when you are</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Your next story starts here.</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">Tell us where you&apos;d like to go. We&apos;ll help you find the best way to get there.</p>
            </div>
            <button onClick={openEnquiry} className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-glow-sm">Make an enquiry <Send size={16} /></button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
