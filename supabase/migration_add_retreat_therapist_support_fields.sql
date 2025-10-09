-- Migration: Add retreat, therapist, relational support, and benevolence fields to providers table
-- Run this SQL in your Supabase SQL Editor to add new fields to existing providers table

-- Add retreat facilitated field
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS retreat_facilitated boolean DEFAULT false;

-- Add actual therapists field
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS actual_therapists boolean DEFAULT false;

-- Add general relational support field (dropdown options)
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS general_relational_support text[] DEFAULT '{}';

-- Add benevolence request field
ALTER TABLE public.providers
ADD COLUMN IF NOT EXISTS benevolence_request boolean DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN public.providers.retreat_facilitated IS 'Whether provider facilitates retreats';
COMMENT ON COLUMN public.providers.actual_therapists IS 'Whether provider includes actual licensed therapists';
COMMENT ON COLUMN public.providers.general_relational_support IS 'Types of relational support offered (Spiritual directors, Exec/Leadership Coaches, Financial guides, Nutrition/Health Coaches, Mentors)';
COMMENT ON COLUMN public.providers.benevolence_request IS 'Whether benevolence requests are available';
