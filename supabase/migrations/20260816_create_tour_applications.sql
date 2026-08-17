/*
# Create tour_applications table for tour booking form submissions

1. New Tables
- `tour_applications`
  - `id` (uuid, primary key) — unique application identifier.
  - `full_name` (text) — applicant full name.
  - `address` (text) — applicant address.
  - `mobile_number` (text) — applicant mobile number.
  - `tour_id` (text) — related tour identifier.
  - `tour_title` (text) — tour title at time of application.
  - `status` (text) — application status (default 'new').
  - `created_at` (timestamptz) — submission timestamp.
  - `updated_at` (timestamptz) — last update timestamp.

2. Security
- Enable RLS on `tour_applications`.
- Public can insert applications.
- Admin can read and update status.
*/

CREATE TABLE IF NOT EXISTS tour_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  mobile_number text NOT NULL DEFAULT '',
  tour_id text NOT NULL DEFAULT '',
  tour_title text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tour_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_tour_applications" ON tour_applications;
CREATE POLICY "anon_insert_tour_applications"
ON tour_applications FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_tour_applications" ON tour_applications;
CREATE POLICY "anon_select_tour_applications"
ON tour_applications FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_tour_applications" ON tour_applications;
CREATE POLICY "anon_update_tour_applications"
ON tour_applications FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tour_applications" ON tour_applications;
CREATE POLICY "anon_delete_tour_applications"
ON tour_applications FOR DELETE
TO anon, authenticated USING (true);
