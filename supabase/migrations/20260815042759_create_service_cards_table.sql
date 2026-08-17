/*
# Create editable service cards for the homepage

1. New Tables
- `service_cards`
  - `id` (uuid, primary key) — unique card identifier.
  - `sort_order` (integer) — display order from left to right, top to bottom.
  - `image_url` (text) — card image URL managed from the admin panel.
  - `title` (text) — service card heading.
  - `description` (text) — short service card description.
  - `created_at` (timestamptz) — creation timestamp.
  - `updated_at` (timestamptz) — last update timestamp.

2. Security
- Enable RLS on `service_cards`.
- This is a single-tenant site using the existing hardcoded admin panel rather than Supabase Auth.
- Allow anon + authenticated CRUD because the public homepage reads the cards and the admin panel writes them through the anon key.
- The cards are intentionally shared homepage content.

3. Seed Data
- Inserts eight starter cards matching the supplied Our Services reference design.
- Seed runs only when the table is empty.
*/

CREATE TABLE IF NOT EXISTS service_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order integer NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE service_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_service_cards" ON service_cards;
CREATE POLICY "anon_select_service_cards"
ON service_cards FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_service_cards" ON service_cards;
CREATE POLICY "anon_insert_service_cards"
ON service_cards FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_service_cards" ON service_cards;
CREATE POLICY "anon_update_service_cards"
ON service_cards FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_service_cards" ON service_cards;
CREATE POLICY "anon_delete_service_cards"
ON service_cards FOR DELETE
TO anon, authenticated USING (true);

INSERT INTO service_cards (sort_order, image_url, title, description)
SELECT * FROM (VALUES
  (1, 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=900', 'Air Ticket Booking', 'Domestic & International Flights'),
  (2, 'https://images.pexels.com/photos/1058959/pexels-photo-1058959.jpeg?auto=compress&cs=tinysrgb&w=900', 'Visa Processing', 'All Country Visa Services'),
  (3, 'https://images.pexels.com/photos/3156647/pexels-photo-3156647.jpeg?auto=compress&cs=tinysrgb&w=900', 'Umrah & Hajj Packages', 'Best Packages with Best Service'),
  (4, 'https://images.pexels.com/photos/3601426/pexels-photo-3601426.jpeg?auto=compress&cs=tinysrgb&w=900', 'Holiday Packages', 'Amazing Tour Packages'),
  (5, 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=900', 'Hotel Booking', 'Worldwide Hotel Reservations'),
  (6, 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=900', 'Travel Insurance', 'Safe Travel, Secure Journey'),
  (7, 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=900', 'Airport Transfer', 'Comfortable & Reliable Service'),
  (8, 'https://images.pexels.com/photos/6863259/pexels-photo-6863259.jpeg?auto=compress&cs=tinysrgb&w=900', 'Document Attestation', 'Quick & Reliable Attestation')
) AS seed(sort_order, image_url, title, description)
WHERE NOT EXISTS (SELECT 1 FROM service_cards);