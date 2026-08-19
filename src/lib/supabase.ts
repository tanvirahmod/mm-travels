import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type HeroSlide = {
  id: string;
  badge_text: string;
  headline: string;
  headline_highlight: string;
  subtitle: string;
  description: string;
  background_image_url: string;
  mobile_background_image_url: string | null;
  primary_btn_text: string | null;
  primary_btn_url: string | null;
  secondary_btn_text: string | null;
  secondary_btn_url: string | null;
  link: string | null;
  slide_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceCard = {
  id: string;
  sort_order: number;
  image_url: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type TourDestination = {
  id: string;
  name: string;
};

export type TourType = {
  id: string;
  name: string;
};

export type VisaCountry = {
  id: string;
  name: string;
};

export type VisaType = {
  id: string;
  name: string;
};

export type Tour = {
  id: string;
  title: string;
  destination: string;
  tour_type: string;
  duration: string;
  price: number;
  original_price: number | null;
  sub_destinations: string[];
  itinerary: { day: number; title: string; description: string }[];
  includes: string[];
  excludes: string[];
  image_url: string;
  start_location: string;
  region: string | null;
};

export type VisaRequirement = {
  id: string;
  country: string;
  visa_type: string;
  fee: number;
  service_charge: number;
  requirements: { title: string; detail: string }[];
  note: string;
};

export type Agent = {
  id: string;
  name: string;
  phone: string;
};

export type SiteSettings = {
  hero_bg_image: string;
  hero_title: string;
  hero_subtitle: string;
  license_number: string;
  search_enabled: boolean;
  search_slide: number;
};

export type VisaApplication = {
  id: string;
  full_name: string;
  address: string;
  mobile_number: string;
  country: string;
  visa_type: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type TourApplication = {
  id: string;
  full_name: string;
  address: string;
  mobile_number: string;
  tour_id: string;
  tour_title: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  custom_title: string;
  badge: string;
  badge_color?: string;
  link_type: string;
  link_id: string | null;
  custom_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type AttestationOrder = {
  id: string;
  full_name: string;
  phone_number: string;
  service: string;
  service_slug: string;
  target_country: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
};
