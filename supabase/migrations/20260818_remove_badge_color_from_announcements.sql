-- Migration: 20260818_remove_badge_color_from_announcements.sql
-- Description: Remove badge_color column from announcements table.

ALTER TABLE public.announcements DROP COLUMN IF EXISTS badge_color;
