-- =====================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add missing columns to memories table if they don't exist
DO $$
BEGIN
    -- Check and add title column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'memories' AND column_name = 'title'
    ) THEN
        ALTER TABLE memories ADD COLUMN title TEXT;
    END IF;

    -- Check and add background_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'memories' AND column_name = 'background_url'
    ) THEN
        ALTER TABLE memories ADD COLUMN background_url TEXT;
    END IF;

    -- Check and add music_url column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'memories' AND column_name = 'music_url'
    ) THEN
        ALTER TABLE memories ADD COLUMN music_url TEXT;
    END IF;

    -- Check and add music_volume column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'memories' AND column_name = 'music_volume'
    ) THEN
        ALTER TABLE memories ADD COLUMN music_volume NUMERIC(3,2) DEFAULT 0.7;
    END IF;

    -- Check and add music_loop column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'memories' AND column_name = 'music_loop'
    ) THEN
        ALTER TABLE memories ADD COLUMN music_loop BOOLEAN DEFAULT true;
    END IF;

    -- Check and add display_order column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'memories' AND column_name = 'display_order'
    ) THEN
        ALTER TABLE memories ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;

    -- Check and add is_active column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'memories' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE memories ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;

    -- Check and add updated_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'memories' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE memories ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_memories_display_order ON memories(display_order);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at);
CREATE INDEX IF NOT EXISTS idx_memories_is_active ON memories(is_active);

-- =====================================================
-- CREATE MISSING TABLES IF THEY DON'T EXIST
-- =====================================================

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_accent VARCHAR(50) DEFAULT '#ff6b9d',
  secondary_accent VARCHAR(50) DEFAULT '#c44569',
  background VARCHAR(50) DEFAULT '#0a0a0f',
  text_color VARCHAR(50) DEFAULT '#ffffff',
  glow_color VARCHAR(50) DEFAULT '#ff6b9d',
  intro_duration INTEGER DEFAULT 4000,
  initializing_music_url TEXT,
  initializing_music_volume NUMERIC(3,2) DEFAULT 0.7,
  initializing_music_loop BOOLEAN DEFAULT true,
  initializing_music_enabled BOOLEAN DEFAULT true,
  birthday_music_url TEXT,
  birthday_music_volume NUMERIC(3,2) DEFAULT 0.7,
  birthday_music_loop BOOLEAN DEFAULT true,
  birthday_music_enabled BOOLEAN DEFAULT true,
  puzzle_music_url TEXT,
  puzzle_music_volume NUMERIC(3,2) DEFAULT 0.7,
  puzzle_music_loop BOOLEAN DEFAULT true,
  puzzle_music_enabled BOOLEAN DEFAULT true,
  memories_music_url TEXT,
  memories_music_volume NUMERIC(3,2) DEFAULT 0.7,
  memories_music_loop BOOLEAN DEFAULT true,
  memories_music_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default config if table is empty
INSERT INTO site_config (id, primary_accent, secondary_accent, background, text_color, glow_color, intro_duration)
SELECT gen_random_uuid(), '#ff6b9d', '#c44569', '#0a0a0f', '#ffffff', '#ff6b9d', 4000
WHERE NOT EXISTS (SELECT 1 FROM site_config);

-- Create music table if it doesn't exist
CREATE TABLE IF NOT EXISTS music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title VARCHAR(255) DEFAULT 'Belinda''s Song',
  artist VARCHAR(255) DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create videos table if it doesn't exist
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_order_index ON videos(order_index);

-- Create puzzle_config table if it doesn't exist
CREATE TABLE IF NOT EXISTS puzzle_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled BOOLEAN DEFAULT true,
  hint TEXT DEFAULT 'Look for the hidden clue...',
  matching_instruction TEXT DEFAULT 'Match the emojis to proceed to the next page.',
  success_message TEXT DEFAULT 'Well done!',
  completion_message TEXT DEFAULT 'You found the way in. ❤️',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default puzzle config if table is empty
INSERT INTO puzzle_config (id, enabled, hint, matching_instruction, success_message, completion_message)
SELECT gen_random_uuid(), true, 'Look for the hidden clue...', 'Match the emojis to proceed to the next page.', 'Well done!', 'You found the way in. ❤️'
WHERE NOT EXISTS (SELECT 1 FROM puzzle_config);

-- Create easter_egg table if it doesn't exist
CREATE TABLE IF NOT EXISTS easter_egg (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enabled BOOLEAN DEFAULT false,
  trigger_method VARCHAR(50) DEFAULT 'triple_click',
  secret_message TEXT DEFAULT 'You found the secret! 🎉',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default easter egg config if table is empty
INSERT INTO easter_egg (id, enabled, trigger_method, secret_message)
SELECT gen_random_uuid(), false, 'triple_click', 'You found the secret! 🎉'
WHERE NOT EXISTS (SELECT 1 FROM easter_egg);

-- Create scenes table if it doesn't exist
CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_name VARCHAR(50) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default scenes if table is empty
INSERT INTO scenes (scene_name, enabled)
VALUES 
  ('loading', true),
  ('initializing', true),
  ('birthday', true),
  ('puzzle', true),
  ('memories', true),
  ('music', true),
  ('videos', true),
  ('letter', true),
  ('heartbeat', true),
  ('final', true)
ON CONFLICT (scene_name) DO NOTHING;

-- Create terminal_lines table if it doesn't exist
CREATE TABLE IF NOT EXISTS terminal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  delay INTEGER DEFAULT 1000,
  typing_speed INTEGER DEFAULT 50,
  emoji VARCHAR(50) DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_terminal_lines_order_index ON terminal_lines(order_index);

-- Insert default terminal lines if table is empty
INSERT INTO terminal_lines (text, delay, typing_speed, enabled, order_index)
VALUES 
  ('> initializing birthday.exe...', 800, 50, true, 0),
  ('> identifying user...', 800, 50, true, 1),
  ('> BELINDA', 800, 50, true, 2),
  ('> today is your birthday 🎂', 800, 50, true, 3),
  ('> loading... but the magic...', 500, 50, true, 4)
ON CONFLICT DO NOTHING;

-- =====================================================
-- ENABLE RLS AND CREATE POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE music ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzle_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE easter_egg ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminal_lines ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Service role full access on admin_users" ON admin_users;
DROP POLICY IF EXISTS "Public read site_config" ON site_config;
DROP POLICY IF EXISTS "Service role full access on site_config" ON site_config;
DROP POLICY IF EXISTS "Public read enabled memories" ON memories;
DROP POLICY IF EXISTS "Service role full access on memories" ON memories;
DROP POLICY IF EXISTS "Public read enabled music" ON music;
DROP POLICY IF EXISTS "Service role full access on music" ON music;
DROP POLICY IF EXISTS "Public read enabled videos" ON videos;
DROP POLICY IF EXISTS "Service role full access on videos" ON videos;
DROP POLICY IF EXISTS "Public read puzzle_config" ON puzzle_config;
DROP POLICY IF EXISTS "Service role full access on puzzle_config" ON puzzle_config;
DROP POLICY IF EXISTS "Public read easter_egg" ON easter_egg;
DROP POLICY IF EXISTS "Service role full access on easter_egg" ON easter_egg;
DROP POLICY IF EXISTS "Public read scenes" ON scenes;
DROP POLICY IF EXISTS "Service role full access on scenes" ON scenes;
DROP POLICY IF EXISTS "Public read enabled terminal_lines" ON terminal_lines;
DROP POLICY IF EXISTS "Service role full access on terminal_lines" ON terminal_lines;

-- Create policies
CREATE POLICY "Service role full access on admin_users" 
ON admin_users FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read site_config" 
ON site_config FOR SELECT 
TO public, anon 
USING (true);

CREATE POLICY "Service role full access on site_config" 
ON site_config FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read enabled memories" 
ON memories FOR SELECT 
TO public, anon 
USING (enabled = true OR is_active = true);

CREATE POLICY "Service role full access on memories" 
ON memories FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read enabled music" 
ON music FOR SELECT 
TO public, anon 
USING (enabled = true);

CREATE POLICY "Service role full access on music" 
ON music FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read enabled videos" 
ON videos FOR SELECT 
TO public, anon 
USING (enabled = true);

CREATE POLICY "Service role full access on videos" 
ON videos FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read puzzle_config" 
ON puzzle_config FOR SELECT 
TO public, anon 
USING (true);

CREATE POLICY "Service role full access on puzzle_config" 
ON puzzle_config FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read easter_egg" 
ON easter_egg FOR SELECT 
TO public, anon 
USING (true);

CREATE POLICY "Service role full access on easter_egg" 
ON easter_egg FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read scenes" 
ON scenes FOR SELECT 
TO public, anon 
USING (true);

CREATE POLICY "Service role full access on scenes" 
ON scenes FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Public read enabled terminal_lines" 
ON terminal_lines FOR SELECT 
TO public, anon 
USING (enabled = true);

CREATE POLICY "Service role full access on terminal_lines" 
ON terminal_lines FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- =====================================================
-- CREATE UPDATED_AT TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables with updated_at
DROP TRIGGER IF EXISTS update_site_config_updated_at ON site_config;
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_memories_updated_at ON memories;
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_puzzle_config_updated_at ON puzzle_config;
CREATE TRIGGER update_puzzle_config_updated_at BEFORE UPDATE ON puzzle_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_easter_egg_updated_at ON easter_egg;
CREATE TRIGGER update_easter_egg_updated_at BEFORE UPDATE ON easter_egg
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scenes_updated_at ON scenes;
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_terminal_lines_updated_at ON terminal_lines;
CREATE TRIGGER update_terminal_lines_updated_at BEFORE UPDATE ON terminal_lines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMPLETED
-- =====================================================
