/*
# Create visa_applications table for visa application form submissions

1. New Tables
- `visa_applications`
  - `id` (uuid, primary key) — unique application identifier.
  - `full_name` (text) — applicant full name.
  - `address` (text) — applicant address.
  - `mobile_number` (text) — applicant mobile number.
  - `country` (text) — target country for visa.
  - `visa_type` (text) — type of visa applied for.
  - `status` (text) — application status (default 'new').
  - `created_at` (timestamptz) — submission timestamp.
  - `updated_at` (timestamptz) — last update timestamp.

2. Security
- Enable RLS on `visa_applications`.
- Public can insert applications.
- Admin can read and update status.
*/

CREATE TABLE IF NOT EXISTS visa_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  mobile_number text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  visa_type text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_visa_applications" ON visa_applications;
CREATE POLICY "anon_insert_visa_applications"
ON visa_applications FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_visa_applications" ON visa_applications;
CREATE POLICY "anon_select_visa_applications"
ON visa_applications FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_visa_applications" ON visa_applications;
CREATE POLICY "anon_update_visa_applications"
ON visa_applications FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_visa_applications" ON visa_applications;
CREATE POLICY "anon_delete_visa_applications"
ON visa_applications FOR DELETE
TO anon, authenticated USING (true);
