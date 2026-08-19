import { Plane, FileCheck, Compass, Hotel, FileText, Moon, type LucideIcon } from 'lucide-react';

export interface ServiceCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  badge: string;
  description: string;
  keyFeatures: string[];
  actionLink: string;
}

export const allServices: ServiceCategory[] = [
  {
    id: 'air-ticketing',
    title: 'Air Ticketing & Flight Booking',
    icon: Plane,
    badge: 'Best Fare Guarantee',
    description:
      'Instant booking and seat reservation for domestic and major international airlines with custom itinerary planning.',
    keyFeatures: ['24/7 Booking Support', 'Date Change & Refund Assistance', 'Group Booking Discounts'],
    actionLink: '/flights',
  },
  {
    id: 'visa-processing',
    title: 'Tourist & Business Visa Processing',
    icon: FileCheck,
    badge: '98% Approval Rate',
    description:
      'Complete visa file preparation, appointment scheduling, and guidance for Schengen, USA, UK, Canada, Gulf, and Asian countries.',
    keyFeatures: ['Document Screening', 'Schengen File Preparation', 'Embassy Appointment Booking'],
    actionLink: '/visa',
  },
  {
    id: 'tour-packages',
    title: 'Customized Tour Packages',
    icon: Compass,
    badge: 'Family & Group Specials',
    description:
      "Tailor-made holiday packages for popular destinations like Thailand, Malaysia, Maldives, Cox's Bazar, and Sajek Valley.",
    keyFeatures: ['Guided Sightseeing', 'Resort & Transfer Included', 'Flexible Itineraries'],
    actionLink: '/tours',
  },
  {
    id: 'hotel-reservation',
    title: 'Hotel & Resort Reservation',
    icon: Hotel,
    badge: 'Exclusive Discounts',
    description:
      'Worldwide hotel room reservations ranging from luxury 5-star resorts to budget-friendly stays.',
    keyFeatures: ['Instant Confirmation', 'Pay-at-Hotel Options', 'Verified Guest Reviews'],
    actionLink: '/hotels',
  },
  {
    id: 'document-attestation',
    title: 'Document Attestation & Legalization',
    icon: FileText,
    badge: 'Ministry & Embassy Authorized',
    description:
      'Complete attestation service for Educational, Marriage, Birth Certificates, and Police Clearance from MOFA and Dhaka Embassies.',
    keyFeatures: ['Board & Ministry Verification', 'Foreign Embassy Stamping', 'Express Processing'],
    actionLink: '/services/documents',
  },
  {
    id: 'umrah-hajj',
    title: 'Umrah & Hajj Pilgrimage Packages',
    icon: Moon,
    badge: 'VIP & Economy Groups',
    description:
      'Dedicated spiritual journey planning with premium hotel stay near Haram Sharif, visa processing, and guidance.',
    keyFeatures: ['Group Tour Leader', 'Ziyarat Transport Included', 'Direct Flight Options'],
    actionLink: '/umrah',
  },
];
