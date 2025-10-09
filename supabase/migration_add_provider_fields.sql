-- Migration: Add new fields to providers table
-- Run this SQL in your Supabase SQL Editor to add new fields to existing providers table

-- Add location type field (location-based or virtual)
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS location_type text CHECK (location_type IN ('in-person', 'virtual', 'both')) DEFAULT 'both';

-- Add specific location details (for in-person services)
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS location_details text;

-- Add Gloo Impact scholarship availability
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS gloo_scholarship_available boolean DEFAULT false;

-- Add service duration options
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS service_durations text[] DEFAULT '{}';

-- Add content resources availability
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS content_resources boolean DEFAULT false;

-- Add content resources details
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS content_resources_list text[] DEFAULT '{}';

-- Add denomination/theology preferences
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS denominations text[] DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN public.providers.location_type IS 'Type of service delivery: in-person, virtual, or both';
COMMENT ON COLUMN public.providers.location_details IS 'Specific location information for in-person services';
COMMENT ON COLUMN public.providers.gloo_scholarship_available IS 'Whether provider offers scholarships via Gloo Impact';
COMMENT ON COLUMN public.providers.service_durations IS 'Available service durations (e.g., weekend, week, day, year-long)';
COMMENT ON COLUMN public.providers.content_resources IS 'Whether provider offers content resources';
COMMENT ON COLUMN public.providers.content_resources_list IS 'List of available content resources (books, courses, etc.)';
COMMENT ON COLUMN public.providers.denominations IS 'Denominations/theological traditions served';
