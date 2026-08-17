-- Migration: 20260815_01_base_schema.sql
-- Description: Create base lookup tables, tours, visa_requirements, and agents tables.
-- Run this first in Supabase SQL Editor.

-- Base Lookup Tables
CREATE TABLE IF NOT EXISTS tour_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tour_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS visa_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS visa_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Tours Data Table
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  tour_type TEXT NOT NULL,
  duration TEXT NOT NULL,
  price DECIMAL NOT NULL,
  original_price DECIMAL,
  sub_destinations TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]'::jsonb,
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Visa Data Table
CREATE TABLE IF NOT EXISTS visa_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  fee DECIMAL DEFAULT 0,
  requirements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
