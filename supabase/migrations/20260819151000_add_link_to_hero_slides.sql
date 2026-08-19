/*
# Add optional `link` column to hero_slides

1. New Column
- `hero_slides.link` (text, nullable) — optional URL for the whole slide.
  - Internal path, e.g. `/tours` → navigates in-app via react-router.
  - External URL, e.g. `https://...` → opens in a new tab.
  - When NULL/empty the slide is NOT clickable.

2. Notes
- Nullable so existing slides keep working unchanged.
- No RLS change needed; the existing anon/authenticated policies cover SELECT
  and the admin panel uses the anon key for INSERT/UPDATE/DELETE.
*/

ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS link text;

COMMENT ON COLUMN hero_slides.link IS 'Optional internal (/path) or external (https://...) URL. When set, the homepage hero slide becomes clickable and navigates to this link.';
