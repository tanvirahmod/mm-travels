-- Migration: 20260815_04_full_crud_policies.sql
-- Description: Full CRUD policies for all tables.
-- Use this instead of disable_rls if you want to keep RLS enabled with explicit write access.

-- Destinations & Types
CREATE POLICY "Public Insert Destinations" ON tour_destinations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Destinations" ON tour_destinations FOR UPDATE USING (true);
CREATE POLICY "Public Delete Destinations" ON tour_destinations FOR DELETE USING (true);

CREATE POLICY "Public Insert Tour Types" ON tour_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tour Types" ON tour_types FOR UPDATE USING (true);
CREATE POLICY "Public Delete Tour Types" ON tour_types FOR DELETE USING (true);

CREATE POLICY "Public Insert Countries" ON visa_countries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Countries" ON visa_countries FOR UPDATE USING (true);
CREATE POLICY "Public Delete Countries" ON visa_countries FOR DELETE USING (true);

CREATE POLICY "Public Insert Visa Types" ON visa_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Visa Types" ON visa_types FOR UPDATE USING (true);
CREATE POLICY "Public Delete Visa Types" ON visa_types FOR DELETE USING (true);

-- Tours
CREATE POLICY "Public Insert Tours" ON tours FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tours" ON tours FOR UPDATE USING (true);
CREATE POLICY "Public Delete Tours" ON tours FOR DELETE USING (true);

-- Visa Requirements
CREATE POLICY "Public Insert Visas" ON visa_requirements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Visas" ON visa_requirements FOR UPDATE USING (true);
CREATE POLICY "Public Delete Visas" ON visa_requirements FOR DELETE USING (true);

-- Agents
CREATE POLICY "Public Insert Agents" ON agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Agents" ON agents FOR UPDATE USING (true);
CREATE POLICY "Public Delete Agents" ON agents FOR DELETE USING (true);
