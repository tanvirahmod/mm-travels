/*
# Remove feature_tags column from hero_content

The hero section no longer uses feature tags, so we drop the
`feature_tags` (text[]) column to keep the schema in sync with the app.

This is a forward-only migration. If the previous migration
(20260815034642_create_hero_content_table.sql) has already been applied
to a database, run this to drop the column.
*/

ALTER TABLE hero_content DROP COLUMN IF EXISTS feature_tags;
