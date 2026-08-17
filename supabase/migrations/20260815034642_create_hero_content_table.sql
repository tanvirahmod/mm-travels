/*
# Create hero_content table for admin-editable hero section

1. New Tables
- `hero_content`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `badge_text` (text) — small badge above headline, e.g. "Govt. Approved · License No-17539"
  - `headline` (text) — main H1 text, e.g. "Explore The World With MM Travels & Tourism"
  - `headline_highlight` (text) — highlighted portion of headline, e.g. "MM Travels"
  - `subtitle` (text) — line under headline, e.g. "Your Trusted Travel Partner"
  - `description` (text) — paragraph description below subtitle
  - `background_image_url` (text) — URL of the hero background image
  - `feature_tags` (text[]) — array of feature tag labels, e.g. ["Flights","Visa","Umrah"]
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `hero_content`.
- This is a single-tenant app with a hardcoded admin panel (no Supabase Auth).
- Allow anon + authenticated CRUD because the admin panel uses the anon key.
- All data is intentionally public/shared.

3. Seed Data
- Inserts a single default row with the current hero content values.
*/

CREATE TABLE IF NOT EXISTS hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_text text NOT NULL DEFAULT 'Govt. Approved · License No-17539',
  headline text NOT NULL DEFAULT 'Explore The World With MM Travels & Tourism',
  headline_highlight text NOT NULL DEFAULT 'MM Travels',
  subtitle text NOT NULL DEFAULT 'Your Trusted Travel Partner',
  description text NOT NULL DEFAULT 'From flights and visas to holidays, hotels, and transfers — we handle every detail so you can simply enjoy the journey.',
  background_image_url text NOT NULL DEFAULT 'https://images.pexels.com/photos/31711206/pexels-photo-31711206.jpeg?auto=compress&cs=tinysrgb&w=1800',
  feature_tags text[] NOT NULL DEFAULT ARRAY['Flights','Visa','Umrah','Holidays','Hotels','Transfers'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hero" ON hero_content;
CREATE POLICY "anon_select_hero"
ON hero_content FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_hero" ON hero_content;
CREATE POLICY "anon_insert_hero"
ON hero_content FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_hero" ON hero_content;
CREATE POLICY "anon_update_hero"
ON hero_content FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_hero" ON hero_content;
CREATE POLICY "anon_delete_hero"
ON hero_content FOR DELETE
TO anon, authenticated USING (true);

-- Seed default row if table is empty
INSERT INTO hero_content (badge_text, headline, headline_highlight, subtitle, description, background_image_url, feature_tags)
SELECT 'Govt. Approved · License No-17539', 'Explore The World With MM Travels & Tourism', 'MM Travels', 'Your Trusted Travel Partner', 'From flights and visas to holidays, hotels, and transfers — we handle every detail so you can simply enjoy the journey.', 'https://images.pexels.com/photos/31711206/pexels-photo-31711206.jpeg?auto=compress&cs=tinysrgb&w=1800', ARRAY['Flights','Visa','Umrah','Holidays','Hotels','Transfers']
WHERE NOT EXISTS (SELECT 1 FROM hero_content);