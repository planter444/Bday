-- Create admin_users table
-- Note: Using gen_random_uuid() which is built into Supabase/PostgreSQL
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_config table
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  belinda_name VARCHAR(255) DEFAULT 'Belinda',
  main_title VARCHAR(255) DEFAULT 'Happy Birthday',
  subtitle VARCHAR(255) DEFAULT '',
  intro_text TEXT DEFAULT '',
  intro_duration INTEGER DEFAULT 4000,
  birthday_message TEXT DEFAULT '',
  letter_title VARCHAR(255) DEFAULT 'My Dearest Belinda',
  letter TEXT DEFAULT '',
  final_message TEXT DEFAULT '',
  music_title VARCHAR(255) DEFAULT 'Belinda''s Song',
  easter_egg_message TEXT DEFAULT '',
  primary_accent VARCHAR(7) DEFAULT '#ff6b9d',
  secondary_accent VARCHAR(7) DEFAULT '#c44569',
  background VARCHAR(7) DEFAULT '#0a0a0f',
  text_color VARCHAR(7) DEFAULT '#ffffff',
  glow_color VARCHAR(50) DEFAULT 'rgba(255, 107, 157, 0.5)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create terminal_lines table
CREATE TABLE IF NOT EXISTS terminal_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  delay INTEGER DEFAULT 1000,
  typing_speed INTEGER DEFAULT 50,
  emoji VARCHAR(50) DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scene_name VARCHAR(100) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT DEFAULT '',
  message TEXT DEFAULT '',
  date DATE,
  location VARCHAR(255) DEFAULT '',
  hidden_note TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create music table
CREATE TABLE IF NOT EXISTS music (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audio_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title VARCHAR(255) DEFAULT 'Belinda''s Song',
  artist VARCHAR(255) DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create puzzle_config table
CREATE TABLE IF NOT EXISTS puzzle_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  num_candles INTEGER DEFAULT 7,
  puzzle_letters VARCHAR(50) DEFAULT 'BELINDA',
  hint TEXT DEFAULT 'There might be something hidden here...',
  success_message TEXT DEFAULT 'Happy Birthday, Belinda!',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create easter_egg table
CREATE TABLE IF NOT EXISTS easter_egg (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  trigger_method VARCHAR(255) DEFAULT 'triple_tap',
  secret_message TEXT DEFAULT 'You found the secret! I love you more than words can say.',
  secret_animation VARCHAR(255) DEFAULT 'heart_explosion',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_memories_order ON memories(order_index);
CREATE INDEX IF NOT EXISTS idx_memories_enabled ON memories(enabled);
CREATE INDEX IF NOT EXISTS idx_videos_order ON videos(order_index);
CREATE INDEX IF NOT EXISTS idx_videos_enabled ON videos(enabled);
CREATE INDEX IF NOT EXISTS idx_terminal_lines_order ON terminal_lines(order_index);
CREATE INDEX IF NOT EXISTS idx_terminal_lines_enabled ON terminal_lines(enabled);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_config_updated_at ON site_config;
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_terminal_lines_updated_at ON terminal_lines;
CREATE TRIGGER update_terminal_lines_updated_at BEFORE UPDATE ON terminal_lines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scenes_updated_at ON scenes;
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_memories_updated_at ON memories;
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_music_updated_at ON music;
CREATE TRIGGER update_music_updated_at BEFORE UPDATE ON music
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_puzzle_config_updated_at ON puzzle_config;
CREATE TRIGGER update_puzzle_config_updated_at BEFORE UPDATE ON puzzle_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_easter_egg_updated_at ON easter_egg;
CREATE TRIGGER update_easter_egg_updated_at BEFORE UPDATE ON easter_egg
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE music ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzle_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE easter_egg ENABLE ROW LEVEL SECURITY;

-- Public read access for birthday experience
DROP POLICY IF EXISTS "Public read access for site_config" ON site_config;
CREATE POLICY "Public read access for site_config" ON site_config
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for terminal_lines" ON terminal_lines;
CREATE POLICY "Public read access for terminal_lines" ON terminal_lines
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for scenes" ON scenes;
CREATE POLICY "Public read access for scenes" ON scenes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for memories" ON memories;
CREATE POLICY "Public read access for memories" ON memories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for music" ON music;
CREATE POLICY "Public read access for music" ON music
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for videos" ON videos;
CREATE POLICY "Public read access for videos" ON videos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for puzzle_config" ON puzzle_config;
CREATE POLICY "Public read access for puzzle_config" ON puzzle_config
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for easter_egg" ON easter_egg;
CREATE POLICY "Public read access for easter_egg" ON easter_egg
  FOR SELECT USING (true);

-- Service role (admin) has full access
DROP POLICY IF EXISTS "Service role full access on admin_users" ON admin_users;
CREATE POLICY "Service role full access on admin_users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on site_config" ON site_config;
CREATE POLICY "Service role full access on site_config" ON site_config
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on terminal_lines" ON terminal_lines;
CREATE POLICY "Service role full access on terminal_lines" ON terminal_lines
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on scenes" ON scenes;
CREATE POLICY "Service role full access on scenes" ON scenes
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on memories" ON memories;
CREATE POLICY "Service role full access on memories" ON memories
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on music" ON music;
CREATE POLICY "Service role full access on music" ON music
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on videos" ON videos;
CREATE POLICY "Service role full access on videos" ON videos
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on puzzle_config" ON puzzle_config;
CREATE POLICY "Service role full access on puzzle_config" ON puzzle_config
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access on easter_egg" ON easter_egg;
CREATE POLICY "Service role full access on easter_egg" ON easter_egg
  FOR ALL USING (auth.role() = 'service_role');
