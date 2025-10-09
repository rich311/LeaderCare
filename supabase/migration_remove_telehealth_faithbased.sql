-- Migration: Remove telehealth_available and faith_based fields from providers table
-- Run this SQL in your Supabase SQL Editor to remove these fields

-- Remove telehealth_available column
ALTER TABLE public.providers
DROP COLUMN IF EXISTS telehealth_available;

-- Remove faith_based column
ALTER TABLE public.providers
DROP COLUMN IF EXISTS faith_based;
