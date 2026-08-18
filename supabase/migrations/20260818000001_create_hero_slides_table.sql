/*
# Create hero_slides table for the homepage hero carousel

1. New Tables
- `hero_slides`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `badge_text` (text) — small badge above the headline
  - `headline` (text) — main H1 text
  - `headline_highlight` (text) — word(s) highlighted in brand Electric Blue
  - `subtitle` (text) — line under the headline
  - `description` (text) — paragraph below the subtitle
  - `background_image_url` (text) — slide background image URL
  - `primary_btn_text` (text, nullable) — primary CTA label
  - `primary_btn_url` (text, nullable) — primary CTA link
  - `secondary_btn_text` (text, nullable) — secondary CTA label
  - `secondary_btn_url` (text, nullable) — secondary CTA link
  - `slide_order` (int) — ordering of slides in the carousel
  - `is_active` (boolean) — whether the slide is shown
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `hero_content` is replaced by `hero_slides`.
- Single-tenant app with a hardcoded admin panel using the anon key, so
  allow anon + authenticated full access (same pattern as hero_content).

3. Seed Data
- Inserts a single default active slide.
*/

CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text text NOT NULL DEFAULT 'Govt. Approved · License No-17539',
  headline text NOT NULL DEFAULT 'Explore The World With MM Travels & Tourism',
  headline_highlight text NOT NULL DEFAULT 'MM Travels',
  subtitle text NOT NULL DEFAULT 'Your Trusted Travel Partner',
  description text NOT NULL DEFAULT 'From flights and visas to holidays, hotels, and transfers — we handle every detail so you can simply enjoy the journey.',
  background_image_url text NOT NULL DEFAULT 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  primary_btn_text text,
  primary_btn_url text,
  secondary_btn_text text,
  secondary_btn_url text,
  slide_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hero_slides" ON hero_slides;
CREATE POLICY "anon_select_hero_slides"
ON hero_slides FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hero_slides" ON hero_slides;
CREATE POLICY "anon_insert_hero_slides"
ON hero_slides FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hero_slides" ON hero_slides;
CREATE POLICY "anon_update_hero_slides"
ON hero_slides FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hero_slides" ON hero_slides;
CREATE POLICY "anon_delete_hero_slides"
ON hero_slides FOR DELETE
TO anon, authenticated USING (true);

-- Seed a single default slide if the table is empty
INSERT INTO hero_slides (badge_text, headline, headline_highlight, subtitle, description, background_image_url, primary_btn_text, primary_btn_url, secondary_btn_text, secondary_btn_url, slide_order, is_active)
SELECT 'Govt. Approved · License No-17539', 'Explore The World With MM Travels & Tourism', 'MM Travels', 'Your Trusted Travel Partner', 'From flights and visas to holidays, hotels, and transfers — we handle every detail so you can simply enjoy the journey.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80', 'Explore Tour Packages', '/tours', 'Book Your Visa', '/visa', 1, true
WHERE NOT EXISTS (SELECT 1 FROM hero_slides);
