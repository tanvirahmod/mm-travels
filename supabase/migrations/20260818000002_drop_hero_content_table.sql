/*
# Drop the deprecated hero_content table

The single-instance `hero_content` table has been replaced by the
`hero_slides` carousel table (see 20260818000001_create_hero_slides_table.sql).
The frontend and Admin Panel now read/write `hero_slides`, so `hero_content`
is no longer used and can be safely removed.

Dropping with CASCADE also removes the table's RLS policies.
*/

DROP TABLE IF EXISTS public.hero_content CASCADE;
