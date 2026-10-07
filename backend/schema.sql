-- ==============================================================================
-- BHARAT HERITAGE EXPLORER (SIH 26197) - LOCAL SQLITE DATABASE SCHEMA
-- ==============================================================================
-- Location: backend/bharat_darshan.db
-- Used by: server.ts (Express) and backend/database.py (Python REST API)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    login_time TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS active_visitors (
    passId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Visitor',
    platform TEXT,
    loginTime TEXT DEFAULT CURRENT_TIMESTAMP,
    lastActive TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_items (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    user_session_id TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS community_heritage (
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
    unesco_flag INTEGER DEFAULT 0,
    is_community INTEGER DEFAULT 1,
    lat REAL,
    lng REAL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS monument_photos (
    id TEXT PRIMARY KEY,
    monument_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    contributor_name TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_community_heritage_state ON community_heritage(state_id);
CREATE INDEX IF NOT EXISTS idx_monument_photos_monument ON monument_photos(monument_id);
