-- Migration: 20260818_create_announcements_table.sql
-- Description: Create announcements table for the scrolling announcement/news ticker bar.

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  custom_title VARCHAR(255) NOT NULL,
  badge VARCHAR(50) DEFAULT 'SPECIAL OFFER',
  badge_color VARCHAR(50) DEFAULT 'bg-red-500',
  link_type VARCHAR(50) DEFAULT 'tour',
  link_id UUID NULL,
  custom_url VARCHAR(500) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active announcements"
  ON public.announcements FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow admin full access to announcements"
  ON public.announcements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO public.announcements (custom_title, badge, link_type, display_order)
VALUES
  ('🇹🇭 Thailand Tour Package – Special Price', 'HOT', 'tour', 1),
  ('🇲🇾 Malaysia Tour Package – Limited Offer', 'LIMITED OFFER', 'tour', 2),
  ('🇦🇪 Dubai Tour Package – Book Now', 'NEW', 'tour', 3),
  ('🇧🇩 Cox''s Bazar Package – Special Offer', 'SPECIAL OFFER', 'tour', 4);
