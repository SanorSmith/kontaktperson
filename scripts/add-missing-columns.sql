-- Add missing columns to social_workers table
-- Run this in your Supabase SQL Editor

-- Add position column (if using 'position' instead of 'title')
ALTER TABLE social_workers 
ADD COLUMN IF NOT EXISTS position TEXT;

-- Add internal_notes column for admin notes about social workers
ALTER TABLE social_workers 
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Update existing records to copy title to position if needed
UPDATE social_workers 
SET position = title 
WHERE position IS NULL AND title IS NOT NULL;
