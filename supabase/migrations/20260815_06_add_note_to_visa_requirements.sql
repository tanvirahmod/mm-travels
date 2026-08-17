-- Migration: 20260815_06_add_note_to_visa_requirements.sql
-- Description: Add note column to visa_requirements table for admin-added visa instructions.

ALTER TABLE visa_requirements ADD COLUMN IF NOT EXISTS note TEXT DEFAULT '';
