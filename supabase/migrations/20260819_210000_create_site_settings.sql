CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_bg_image text,
  hero_title text,
  hero_subtitle text,
  license_number text,
  search_enabled boolean NOT NULL DEFAULT true,
  search_slide integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

INSERT INTO public.site_settings (id, hero_bg_image, hero_title, hero_subtitle, license_number, search_enabled, search_slide)
VALUES ('00000000-0000-0000-0000-000000000001', NULL, NULL, NULL, NULL, true, 1)
ON CONFLICT (id) DO NOTHING;
