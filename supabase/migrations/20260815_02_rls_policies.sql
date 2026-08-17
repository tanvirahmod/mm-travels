-- Migration: 20260815_02_rls_policies.sql
-- Description: Row Level Security policies for public read access.
-- Note: These policies allow public read. For admin write access, use the disable_rls migration or add admin-aware policies.

ALTER TABLE tour_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Destinations" ON tour_destinations FOR SELECT USING (true);
CREATE POLICY "Public Read Tour Types" ON tour_types FOR SELECT USING (true);
CREATE POLICY "Public Read Countries" ON visa_countries FOR SELECT USING (true);
CREATE POLICY "Public Read Visa Types" ON visa_types FOR SELECT USING (true);
CREATE POLICY "Public Read Tours" ON tours FOR SELECT USING (true);
CREATE POLICY "Public Read Visas" ON visa_requirements FOR SELECT USING (true);
CREATE POLICY "Public Read Agents" ON agents FOR SELECT USING (true);
