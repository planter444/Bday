-- Add music configuration for individual scenes
ALTER TABLE site_config 
ADD COLUMN IF NOT EXISTS initializing_music_url TEXT,
ADD COLUMN IF NOT EXISTS initializing_music_volume DECIMAL(3,2) DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS initializing_music_loop BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS initializing_music_enabled BOOLEAN DEFAULT false,

ADD COLUMN IF NOT EXISTS birthday_music_url TEXT,
ADD COLUMN IF NOT EXISTS birthday_music_volume DECIMAL(3,2) DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS birthday_music_loop BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS birthday_music_enabled BOOLEAN DEFAULT false,

ADD COLUMN IF NOT EXISTS puzzle_music_url TEXT,
ADD COLUMN IF NOT EXISTS puzzle_music_volume DECIMAL(3,2) DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS puzzle_music_loop BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS puzzle_music_enabled BOOLEAN DEFAULT false,

ADD COLUMN IF NOT EXISTS memories_music_url TEXT,
ADD COLUMN IF NOT EXISTS memories_music_volume DECIMAL(3,2) DEFAULT 0.7,
ADD COLUMN IF NOT EXISTS memories_music_loop BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS memories_music_enabled BOOLEAN DEFAULT false;
