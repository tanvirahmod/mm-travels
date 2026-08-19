/*
# Add `link` and `mobile_background_image_url` columns to hero_slides

Consolidates the previously-unrun `link` migration with the new mobile background
column so the schema can be brought up to date with a single file.

1. New Columns
- `hero_slides.link` (text, nullable) — optional URL for the whole slide.
  - Internal path, e.g. `/tours` → navigates in-app via react-router.
  - External URL, e.g. `https://...` → opens in a new tab.
  - When NULL/empty the slide is NOT clickable.
- `hero_slides.mobile_background_image_url` (text, nullable) — optional background
  image used on small/mobile screens. When NULL/empty the slide falls back to
  `background_image_url` (the large/desktop image).

2. Notes
- Both columns are nullable so existing slides keep working unchanged.
- No RLS change needed; existing anon/authenticated policies cover SELECT and the
  admin panel uses the anon key for INSERT/UPDATE/DELETE.
*/

ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS link text;
COMMENT ON COLUMN hero_slides.link IS 'Optional internal (/path) or external (https://...) URL. When set, the homepage hero slide becomes clickable and navigates to this link.';

ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS mobile_background_image_url text;
COMMENT ON COLUMN hero_slides.mobile_background_image_url IS 'Optional mobile/small-screen background image. When empty the slide falls back to background_image_url.';
