/*
# Create attestation_orders table for document attestation inquiry form submissions

1. New Tables
- `attestation_orders`
  - `id` (uuid, primary key) — unique order identifier.
  - `full_name` (text) — applicant full name.
  - `phone_number` (text) — applicant phone number.
  - `service` (text) — selected attestation service title (pre-filled from the page).
  - `service_slug` (text) — selected attestation service slug reference.
  - `target_country` (text) — destination country for attestation.
  - `message` (text) — additional message / notes from the applicant.
  - `status` (text) — order status (default 'new').
  - `created_at` (timestamptz) — submission timestamp.
  - `updated_at` (timestamptz) — last update timestamp.

2. Security
- Enable RLS on `attestation_orders`.
- Public (anon/authenticated) can insert orders from the website form.
- Public can read/update/delete so the admin panel can manage them via the anon key.
*/

CREATE TABLE IF NOT EXISTS attestation_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  phone_number text NOT NULL DEFAULT '',
  service text NOT NULL DEFAULT '',
  service_slug text NOT NULL DEFAULT '',
  target_country text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE attestation_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_attestation_orders" ON attestation_orders;
CREATE POLICY "anon_insert_attestation_orders"
ON attestation_orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_attestation_orders" ON attestation_orders;
CREATE POLICY "anon_select_attestation_orders"
ON attestation_orders FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_attestation_orders" ON attestation_orders;
CREATE POLICY "anon_update_attestation_orders"
ON attestation_orders FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_attestation_orders" ON attestation_orders;
CREATE POLICY "anon_delete_attestation_orders"
ON attestation_orders FOR DELETE
TO anon, authenticated USING (true);
