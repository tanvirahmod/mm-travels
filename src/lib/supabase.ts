import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type HeroContent = {
  id: string;
  badge_text: string;
  headline: string;
  headline_highlight: string;
  subtitle: string;
  description: string;
  background_image_url: string;
  feature_tags: string[];
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
