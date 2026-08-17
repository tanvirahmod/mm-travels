-- Migration: 20260815_03_disable_rls.sql
-- Description: Disable RLS for admin-managed tables.
-- Use this if you prefer disabling RLS entirely instead of managing write policies.
-- The app already has client-side admin password protection.

ALTER TABLE tour_destinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE visa_countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE visa_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE tours DISABLE ROW LEVEL SECURITY;
ALTER TABLE visa_requirements DISABLE ROW LEVEL SECURITY;
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
