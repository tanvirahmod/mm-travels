-- Migration: 20260815_05_add_start_location.sql
-- Description: Add start_location column to tours table for tour planning box.

ALTER TABLE tours ADD COLUMN IF NOT EXISTS start_location TEXT DEFAULT '';
