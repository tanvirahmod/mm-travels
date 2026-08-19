ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS search_enabled boolean NOT NULL DEFAULT true;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS search_slide integer NOT NULL DEFAULT 1;
