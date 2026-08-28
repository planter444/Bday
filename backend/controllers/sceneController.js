const supabase = require('../config/database');

// Get scene settings
const getSceneSettings = async (req, res) => {
  try {
    const { data: scenes, error } = await supabase
      .from('scenes')
      .select('*');
    
    if (error) {
      // Return default scene settings if table doesn't exist
      return res.json({
        loading: true,
        initializing: true,
        birthday: true,
        puzzle: true,
        memories: true,
        music: true,
        videos: true,
        letter: true,
        heartbeat: true,
        final: true
      });
    }
    
    // Convert to object for easier frontend usage
    const sceneSettings = {};
    scenes.forEach(scene => {
      sceneSettings[scene.scene_name] = scene.enabled;
    });
    
    res.json(sceneSettings);
  } catch (error) {
    console.error('Get scene settings error:', error);
    // Return default scene settings on error
    res.json({
      loading: true,
      initializing: true,
      birthday: true,
      puzzle: true,
      memories: true,
      music: true,
      videos: true,
      letter: true,
      heartbeat: true,
      final: true
    });
  }
};

// Update scene setting
const updateSceneSetting = async (req, res) => {
  try {
    const { scene_name, enabled } = req.body;
    
    const { data: scene, error } = await supabase
      .from('scenes')
      .upsert({ scene_name, enabled: enabled !== false })
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Scene setting updated successfully', scene });
  } catch (error) {
    console.error('Update scene setting error:', error);
    res.status(500).json({ error: 'Failed to update scene setting' });
  }
};

module.exports = { getSceneSettings, updateSceneSetting };
