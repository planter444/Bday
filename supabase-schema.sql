-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_config table
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  belinda_name VARCHAR(255) DEFAULT 'Belinda',
  main_title VARCHAR(255) DEFAULT 'Happy Birthday',
  subtitle VARCHAR(255) DEFAULT '',
  intro_text TEXT DEFAULT '',
  birthday_message TEXT DEFAULT '',
  letter_title VARCHAR(255) DEFAULT 'My Dearest Belinda',
  letter TEXT DEFAULT '',
  final_message TEXT DEFAULT '',
  music_title VARCHAR(255) DEFAULT "Belinda's Song",
  easter_egg_message TEXT DEFAULT '',
  primary_accent VARCHAR(7) DEFAULT '#ff6b9d',
  secondary_accent VARCHAR(7) DEFAULT '#c44569',
  background VARCHAR(7) DEFAULT '#0a0a0f',
  text_color VARCHAR(7) DEFAULT '#ffffff',
  glow_color VARCHAR(7) DEFAULT 'rgba(255, 107, 157, 0.5)',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default config
INSERT INTO site_config (belinda_name, main_title, subtitle, intro_text, birthday_message, letter_title, letter, final_message, music_title, easter_egg_message)
VALUES (
  'Belinda',
  'Happy Birthday',
  'A special day for a special person',
  'Welcome to your birthday experience!',
  'Wishing you the happiest birthday!',
  'My Dearest Belinda',
  'On this special day, I wanted to create something that captures just a fraction of how much you mean to me.',
  'I hope this little digital universe made your day a little more special. You deserve all the happiness in the world.',
  "Belinda's Song",
  'You found the secret! ❤️'
) ON CONFLICT DO NOTHING;

-- Create terminal_lines table
CREATE TABLE IF NOT EXISTS terminal_lines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  delay INTEGER DEFAULT 1000,
  typing_speed INTEGER DEFAULT 50,
  emoji VARCHAR(50) DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default terminal lines
INSERT INTO terminal_lines (text, delay, typing_speed, emoji, enabled, order_index) VALUES
  ('> initializing birthday.exe...', 500, 30, '', true, 0),
  ('> establishing secure connection...', 300, 30, '', true, 1),
  ('> scanning...', 300, 20, '', true, 2),
  ('> identifying user...', 500, 30, '', true, 3),
  ('> user identified:', 300, 30, '', true, 4),
  ('> BELINDA', 500, 50, '', true, 5),
  ('> today is your birthday. 🎂', 300, 30, '🎂', true, 6),
  ('> so I made you a little computer program...', 500, 30, '', true, 7),
  ('> preparing something special...', 300, 30, '', true, 8),
  ('> loading memories...', 300, 30, '', true, 9),
  ('> loading music...', 300, 30, '', true, 10),
  ('> loading surprises...', 300, 30, '', true, 11),
  ('> ████████████████████ 100%', 500, 10, '', true, 12),
  ('> welcome, birthday girl. ❤️', 300, 30, '❤️', true, 13)
ON CONFLICT DO NOTHING;

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  scene_name VARCHAR(100) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default scenes
INSERT INTO scenes (scene_name, enabled) VALUES
  ('terminal', true),
  ('birthdayRoom', true),
  ('cake', true),
  ('photoMemories', true),
  ('music', true),
  ('videoMemories', true),
  ('loveLetter', true),
  ('heartbeatAnalysis', true),
  ('finalScene', true)
ON CONFLICT DO NOTHING;

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  audio_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title VARCHAR(255) DEFAULT "Belinda's Song",
  artist VARCHAR(255) DEFAULT '',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  num_candles INTEGER DEFAULT 7,
  puzzle_letters VARCHAR(50) DEFAULT 'BELINDA',
  hint TEXT DEFAULT 'There might be something hidden here… 👀',
  success_message TEXT DEFAULT 'Happy Birthday, Belinda!',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default puzzle config
INSERT INTO puzzle_config (enabled, num_candles, puzzle_letters, hint, success_message)
VALUES (true, 7, 'BELINDA', 'There might be something hidden here… 👀', 'Happy Birthday, Belinda!')
ON CONFLICT DO NOTHING;

-- Create easter_egg table
CREATE TABLE IF NOT EXISTS easter_egg (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  trigger_method VARCHAR(255) DEFAULT 'triple_tap',
  secret_message TEXT DEFAULT 'You found the secret! I love you more than words can say. ❤️',
  secret_animation VARCHAR(255) DEFAULT 'heart_explosion',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default easter egg config
INSERT INTO easter_egg (enabled, trigger_method, secret_message, secret_animation)
VALUES (true, 'triple_tap', 'You found the secret! I love you more than words can say. ❤️', 'heart_explosion')
ON CONFLICT DO NOTHING;

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
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terminal_lines_updated_at BEFORE UPDATE ON terminal_lines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON memories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_music_updated_at BEFORE UPDATE ON music
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_puzzle_config_updated_at BEFORE UPDATE ON puzzle_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
CREATE POLICY "Public read access for site_config" ON site_config
  FOR SELECT USING (true);

CREATE POLICY "Public read access for terminal_lines" ON terminal_lines
  FOR SELECT USING (true);

CREATE POLICY "Public read access for scenes" ON scenes
  FOR SELECT USING (true);

CREATE POLICY "Public read access for memories" ON memories
  FOR SELECT USING (true);

CREATE POLICY "Public read access for music" ON music
  FOR SELECT USING (true);

CREATE POLICY "Public read access for videos" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Public read access for puzzle_config" ON puzzle_config
  FOR SELECT USING (true);

CREATE POLICY "Public read access for easter_egg" ON easter_egg
  FOR SELECT USING (true);

-- Service role (admin) has full access
CREATE POLICY "Service role full access on admin_users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on site_config" ON site_config
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on terminal_lines" ON terminal_lines
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on scenes" ON scenes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on memories" ON memories
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on music" ON music
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on videos" ON videos
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on puzzle_config" ON puzzle_config
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on easter_egg" ON easter_egg
  FOR ALL USING (auth.role() = 'service_role');
