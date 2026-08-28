const supabase = require('../config/database');
const { 
  ALLOWED_AUDIO_TYPES, 
  MAX_AUDIO_SIZE 
} = require('../config/constants');

// Get all site configuration
const getConfig = async (req, res) => {
  try {
    const { data: config, error } = await supabase
      .from('site_config')
      .select('*')
      .single();
    
    if (error) throw error;
    
    res.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
};

// Update site configuration
const updateConfig = async (req, res) => {
  try {
    const updates = req.body;
    
    // Validate intro_duration minimum
    if (updates.intro_duration !== undefined) {
      updates.intro_duration = Math.max(2000, parseInt(updates.intro_duration) || 4000);
    }
    
    const { data: config, error } = await supabase
      .from('site_config')
      .update(updates)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Configuration updated successfully', config });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
};

// Get theme settings
const getTheme = async (req, res) => {
  try {
    const { data: config, error } = await supabase
      .from('site_config')
      .select('primary_accent, secondary_accent, background, text_color, glow_color')
      .single();
    
    if (error) throw error;
    
    res.json(config);
  } catch (error) {
    console.error('Get theme error:', error);
    res.status(500).json({ error: 'Failed to fetch theme' });
  }
};

// Update theme settings
const updateTheme = async (req, res) => {
  try {
    const { primary_accent, secondary_accent, background, text_color, glow_color } = req.body;
    
    const { data: config, error } = await supabase
      .from('site_config')
      .update({ 
        primary_accent, 
        secondary_accent, 
        background, 
        text_color, 
        glow_color 
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Theme updated successfully', config });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
};

// Update scene-specific music configuration
const updateSceneMusic = async (req, res) => {
  try {
    const { scene, music_url, music_volume, music_loop, music_enabled } = req.body;
    
    // Map scene names to database column names
    const sceneColumnMap = {
      'initializing': {
        url: 'initializing_music_url',
        volume: 'initializing_music_volume',
        loop: 'initializing_music_loop',
        enabled: 'initializing_music_enabled'
      },
      'birthday': {
        url: 'birthday_music_url',
        volume: 'birthday_music_volume',
        loop: 'birthday_music_loop',
        enabled: 'birthday_music_enabled'
      },
      'puzzle': {
        url: 'puzzle_music_url',
        volume: 'puzzle_music_volume',
        loop: 'puzzle_music_loop',
        enabled: 'puzzle_music_enabled'
      },
      'memories': {
        url: 'memories_music_url',
        volume: 'memories_music_volume',
        loop: 'memories_music_loop',
        enabled: 'memories_music_enabled'
      }
    };

    const columns = sceneColumnMap[scene];
    if (!columns) {
      return res.status(400).json({ error: 'Invalid scene name' });
    }

    const updates = {};
    if (music_url !== undefined) updates[columns.url] = music_url;
    if (music_volume !== undefined) updates[columns.volume] = music_volume;
    if (music_loop !== undefined) updates[columns.loop] = music_loop;
    if (music_enabled !== undefined) updates[columns.enabled] = music_enabled;

    // Check if config exists
    const { data: existing } = await supabase
      .from('site_config')
      .select('id')
      .limit(1)
      .single();
    
    let result;
    if (existing) {
      result = await supabase
        .from('site_config')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('site_config')
        .insert([updates])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.json({ message: 'Scene music updated successfully', config: result.data });
  } catch (error) {
    console.error('Update scene music error:', error);
    res.status(500).json({ error: 'Failed to update scene music' });
  }
};

// Upload music for a specific scene
const uploadSceneMusic = async (req, res) => {
  try {
    const { scene } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only MP3 is allowed' });
    }
    
    if (file.size > MAX_AUDIO_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 20MB limit' });
    }
    
    // Upload to Supabase Storage
    const fileName = `music/${scene}-${Date.now()}-${file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('birthday-media')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('birthday-media')
      .getPublicUrl(fileName);
    
    // Update the scene's music URL
    const sceneColumnMap = {
      'initializing': 'initializing_music_url',
      'birthday': 'birthday_music_url',
      'puzzle': 'puzzle_music_url',
      'memories': 'memories_music_url'
    };

    const column = sceneColumnMap[scene];
    if (!column) {
      return res.status(400).json({ error: 'Invalid scene name' });
    }

    // Check if config exists
    const { data: existing } = await supabase
      .from('site_config')
      .select('id')
      .limit(1)
      .single();
    
    let result;
    if (existing) {
      result = await supabase
        .from('site_config')
        .update({ [column]: publicUrl })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('site_config')
        .insert([{ [column]: publicUrl }])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.json({ message: 'Scene music uploaded successfully', music_url: publicUrl });
  } catch (error) {
    console.error('Upload scene music error:', error);
    res.status(500).json({ error: 'Failed to upload scene music' });
  }
};

module.exports = { 
  getConfig, 
  updateConfig, 
  getTheme, 
  updateTheme,
  updateSceneMusic,
  uploadSceneMusic
};
