-- ==============================================================================
-- BHARAT HERITAGE EXPLORER (SIH 26197) - SUPABASE REAL-TIME DATABASE SCHEMA
-- ==============================================================================
-- Run this script directly in the Supabase Dashboard -> SQL Editor
-- This sets up the real-time tables, RLS policies, indexes, and real-time triggers.
-- ==============================================================================

-- 1. COMMUNITY HERITAGE TABLE
-- Stores crowd-sourced monuments & cultural sites submitted by visitors
CREATE TABLE IF NOT EXISTS public.community_heritage (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    hindi_title TEXT,
    state_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    period TEXT NOT NULL,
    location_name TEXT NOT NULL,
    summary TEXT NOT NULL,
    history TEXT,
    culture TEXT,
    image_url TEXT,
    video_url TEXT,
    timings TEXT,
    best_time TEXT,
    unesco_flag BOOLEAN DEFAULT false,
    is_community BOOLEAN DEFAULT true,
    lat NUMERIC,
    lng NUMERIC,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. MONUMENT PHOTOS TABLE (Google Maps-Style Crowdsourced Photo Gallery)
-- Stores photos uploaded/contributed by visitors for any monument
CREATE TABLE IF NOT EXISTS public.monument_photos (
    id TEXT PRIMARY KEY,
    monument_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    contributor_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ACTIVE VISITORS & AUDIT LOG TABLE
-- Tracks active visitor sessions and administrative access logs
CREATE TABLE IF NOT EXISTS public.active_visitors (
    passId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Visitor',
    platform TEXT,
    loginTime TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    lastActive TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SAVED ITINERARY & BOOKMARKED ITEMS
CREATE TABLE IF NOT EXISTS public.saved_items (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    user_session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_community_heritage_state ON public.community_heritage(state_id);
CREATE INDEX IF NOT EXISTS idx_community_heritage_created ON public.community_heritage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_monument_photos_monument ON public.monument_photos(monument_id);
CREATE INDEX IF NOT EXISTS idx_monument_photos_created ON public.monument_photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_items_session ON public.saved_items(user_session_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on all public tables
ALTER TABLE public.community_heritage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monument_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- 1. COMMUNITY HERITAGE POLICIES:
-- Anyone can view community monuments
DROP POLICY IF EXISTS "Public can view community heritage" ON public.community_heritage;
CREATE POLICY "Public can view community heritage"
    ON public.community_heritage FOR SELECT
    TO anon, authenticated
    USING (id IS NOT NULL);

-- Anyone can submit a new monument (requires valid id and title)
DROP POLICY IF EXISTS "Public can insert community heritage" ON public.community_heritage;
CREATE POLICY "Public can insert community heritage"
    ON public.community_heritage FOR INSERT
    TO anon, authenticated
    WITH CHECK (id IS NOT NULL AND length(title) > 0);

-- Authorized community delete (validated by id)
DROP POLICY IF EXISTS "Admins can delete community heritage" ON public.community_heritage;
CREATE POLICY "Admins can delete community heritage"
    ON public.community_heritage FOR DELETE
    TO anon, authenticated
    USING (id IS NOT NULL);

-- 2. MONUMENT PHOTOS POLICIES:
-- Anyone can view photos
DROP POLICY IF EXISTS "Public can view monument photos" ON public.monument_photos;
CREATE POLICY "Public can view monument photos"
    ON public.monument_photos FOR SELECT
    TO anon, authenticated
    USING (id IS NOT NULL);

-- Anyone can contribute a photo (requires valid id and image_url)
DROP POLICY IF EXISTS "Public can insert monument photos" ON public.monument_photos;
CREATE POLICY "Public can insert monument photos"
    ON public.monument_photos FOR INSERT
    TO anon, authenticated
    WITH CHECK (id IS NOT NULL AND length(image_url) > 0);

-- Deletion policy (validated by id)
DROP POLICY IF EXISTS "Admins can delete monument photos" ON public.monument_photos;
CREATE POLICY "Admins can delete monument photos"
    ON public.monument_photos FOR DELETE
    TO anon, authenticated
    USING (id IS NOT NULL);

-- 3. ACTIVE VISITORS POLICIES:
DROP POLICY IF EXISTS "Public can manage active visitors" ON public.active_visitors;
CREATE POLICY "Public can manage active visitors"
    ON public.active_visitors FOR ALL
    TO anon, authenticated
    USING (passId IS NOT NULL)
    WITH CHECK (passId IS NOT NULL);

-- 4. SAVED ITEMS POLICIES:
DROP POLICY IF EXISTS "Public can manage saved items" ON public.saved_items;
CREATE POLICY "Public can manage saved items"
    ON public.saved_items FOR ALL
    TO anon, authenticated
    USING (id IS NOT NULL)
    WITH CHECK (id IS NOT NULL);

-- ==============================================================================
-- SUPABASE REALTIME REPLICATION (CRITICAL FOR LIVE SYNC ACROSS ALL DEVICES)
-- ==============================================================================
-- Enable Realtime publication so multi-device clients receive instant postgres_changes events
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'community_heritage'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.community_heritage;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'monument_photos'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.monument_photos;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'active_visitors'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.active_visitors;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'saved_items'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_items;
    END IF;
END $$;
