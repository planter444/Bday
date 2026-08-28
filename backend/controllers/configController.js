const supabase = require('../config/database');

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

module.exports = { getConfig, updateConfig, getTheme, updateTheme };
