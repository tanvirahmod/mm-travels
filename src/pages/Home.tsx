import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BedDouble,
  Bed,
  ChevronRight,
  Compass,
  FileText,
  FileCheck2,
  Headphones,
  Landmark,
  Send,
  ShieldCheck,
  Ticket,
  Car,
  Star,
  Quote,
  MapPin,
  Check,
  Plane,
  Building,
  Palmtree,
} from 'lucide-react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';
import { useApp } from '@/components/AppContext';
import Hero from '@/components/Hero';
import { supabase, type ServiceCard } from '@/lib/supabase';

const destinationImages = [
  'https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/1370253/pexels-photo-1370253.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/259599/pexels-photo-259599.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/1276516/pexels-photo-1276516.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=900',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=900',
];

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

const serviceIconTones: Record<string, string> = {
  AirTicketBooking: 'bg-brand-500',
  VisaProcessing: 'bg-pop-red',
  UmrahHajjPackages: 'bg-accent-600',
  HolidayPackages: 'bg-accent-500',
  HotelBooking: 'bg-accent-700',
  TravelInsurance: 'bg-brand-600',
  AirportTransfer: 'bg-brand-500',
  CustomTourRequest: 'bg-pop-red',
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

      {/* Services grid */}
      <section className="container-x max-w-7xl py-12 sm:py-16">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Everything in one place</span>
            <h2 className="section-title mt-4">Travel made refreshingly easy.</h2>
          </div>
          <button onClick={() => navigate('services')} className="flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5">
            View all services <ChevronRight size={17} />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = serviceIconMap[getServiceKey(service.title)] || Ticket;
            const iconTone = serviceIconTones[getServiceKey(service.title)] || 'bg-brand-500';
            return (
              <button
                key={service.id}
                onClick={() => routerNavigate('/services')}
                className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative h-32 overflow-hidden bg-brand-50">
                  <img 
                    src={service.image_url} 
                    alt={service.title}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2 p-4">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${iconTone} text-white shadow-sm`}>
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  <h3 className="font-display text-sm font-extrabold leading-5 text-ink-900">{service.title}</h3>
                  <p className="text-xs font-medium leading-5 text-ink-500">{service.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="container-x max-w-7xl">
        <div className="h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent" />
      </div>

      {/* Destinations */}
      <section className="relative overflow-hidden bg-brand-gradient-soft py-16 sm:py-20">
        <div className="container-x max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="text-center sm:text-left">
              <span className="eyebrow">Go somewhere new</span>
              <h2 className="section-title mt-4">Popular destinations</h2>
              <p className="lede mx-auto mt-3 max-w-xl text-ink-500 sm:mx-0">A little inspiration for your next escape, carefully chosen by our travel specialists.</p>
            </div>
            <button onClick={() => navigate('destinations')} className="flex items-center gap-1.5 text-sm font-bold text-brand-600 transition hover:gap-2.5">
              View all destinations <ChevronRight size={17} />
            </button>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {destinations.map((destination) => (
              <button key={destination.name} onClick={() => routerNavigate('/tours?destination=' + encodeURIComponent(destination.fullName))} className="group relative min-h-[220px] overflow-hidden rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <img 
                  src={destination.image} 
                  alt={destination.fullName}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-brand-500/0 transition duration-300 group-hover:bg-brand-500/10" />
                <div className="absolute top-3 right-3">
                  <span className="bg-black/60 text-white backdrop-blur-sm px-2.5 py-1 text-xs font-semibold rounded-md">{destination.badge}</span>
                </div>
                <div className="absolute bottom-0 p-4 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">Explore</p>
                  <h3 className="mt-1 text-base font-extrabold">{destination.name}</h3>
                  <p className="text-xs text-white/70">{destination.fullName}</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink-900 shadow-lg">View packages <ChevronRight size={13} /></span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container-x max-w-7xl">
        <div className="h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent" />
      </div>

      {/* Why MM Travels */}
      <section className="relative overflow-hidden bg-brand-gradient-soft py-16 sm:py-24">
        <div className="container-x max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Why MM Travels</span>
            <h2 className="section-title mt-4">The thoughtful way to travel.</h2>
            <p className="lede mt-5 text-ink-500">Whether you&apos;re visiting family, chasing a new horizon, or making a sacred journey, our team takes care of the details so you can enjoy the moment.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Compass,
                title: 'Expert Guidance',
                subtitle: 'Advice from specialists who know the way.',
                points: ['Customized itineraries', 'Local destination insights', 'Tailored travel options'],
                tone: 'bg-brand-100 text-brand-700',
                hoverTone: 'group-hover:bg-brand-200',
              },
              {
                icon: ShieldCheck,
                title: 'Transparent Pricing',
                subtitle: 'Competitive fares with zero hidden surprises.',
                points: ['All-inclusive fare breakdowns', 'No extra processing fees', 'Best value guarantee'],
                tone: 'bg-brand-50 text-brand-600',
                hoverTone: 'group-hover:bg-brand-100',
              },
              {
                icon: FileCheck2,
                title: 'Hassle-Free Visa Services',
                subtitle: 'End-to-end document & visa assistance.',
                points: ['Document pre-verification', 'Fast application filing', 'High success rate tracking'],
                tone: 'bg-pop-red/10 text-pop-red',
                hoverTone: 'group-hover:bg-pop-red/20',
              },
              {
                icon: Headphones,
                title: '24/7 Dedicated Support',
                subtitle: 'Personal support before, during, and after travel.',
                points: ['Instant WhatsApp assistance', 'Airport arrival guidance', 'On-call emergency help'],
                tone: 'bg-accent-500/10 text-accent-600',
                hoverTone: 'group-hover:bg-accent-500/20',
              },
            ].map((item) => (
              <div key={item.title} className="group rounded-2xl border border-orange-100/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone} ${item.hoverTone} transition-colors duration-300`}>
                  <item.icon size={22} strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-display text-lg font-extrabold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">{item.subtitle}</p>
                <ul className="mt-3 space-y-1.5">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-xs text-ink-600">
                      <Check size={12} className="shrink-0 text-brand-500" strokeWidth={3} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <button onClick={openEnquiry} className="btn-primary">Talk to a travel expert <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ink-950 py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-mesh-pop opacity-30" />
        <div className="container-x max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Testimonials</span>
            <h2 className="section-title mt-4 text-white">What Our Happy Travelers Say</h2>
            <p className="lede mt-4 text-white/60">Trusted by thousands of travelers from Bangladesh, Qatar, and around the world.</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md border border-white/10">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span>4.9 / 5 Star Rating</span>
              <span className="text-white/40">|</span>
              <span>1,200+ Verified Reviews on Google & Facebook</span>
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
                <div className="absolute top-4 right-4 text-white/10 transition duration-300 group-hover:text-white/20">
                  <Quote size={32} />
                </div>
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-white">{item.name}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-white/60"><MapPin size={12} /> {item.location}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'} />
                  ))}
                  <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">{item.service}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/75">&ldquo;{item.comment}&rdquo;</p>
                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-300">
                  <Check size={12} /> Verified Traveler
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-950 px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-mesh-pop opacity-30" />
        <div className="container-x relative flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">Ready when you are</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Your next story starts here.</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/65">Tell us where you&apos;d like to go. We&apos;ll help you find the best way to get there.</p>
          </div>
          <button onClick={openEnquiry} className="flex shrink-0 items-center gap-2 rounded-xl bg-pop-red px-6 py-3.5 text-sm font-bold text-white shadow-brand-soft transition hover:bg-red-600 hover:shadow-glow">Make an enquiry <Send size={16} /></button>
        </div>
      </section>
    </>
  );
}

export default Home;
