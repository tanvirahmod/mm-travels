/*
# Add `region` column to tours

1. New Column
- `tours.region` (text, nullable) — tour classification.
  - 'Domestic' or 'International'.
  - NULL/empty → the tour shows under the "All" filter on the Tours page.

2. Notes
- Nullable so existing tours keep working and appear under "All".
- No RLS change needed; existing anon/authenticated policies cover the tours table.
*/

ALTER TABLE tours ADD COLUMN IF NOT EXISTS region text;

COMMENT ON COLUMN tours.region IS 'Tour classification: Domestic or International. Empty/NULL shows under "All".';
