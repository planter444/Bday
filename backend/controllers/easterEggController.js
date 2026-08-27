const supabase = require('../config/database');

// Get Easter egg configuration
const getEasterEggConfig = async (req, res) => {
  try {
    const { data: easterEgg, error } = await supabase
      .from('easter_egg')
      .select('*')
      .single();
    
    if (error) throw error;
    
    res.json(easterEgg);
  } catch (error) {
    console.error('Get Easter egg config error:', error);
    res.status(500).json({ error: 'Failed to fetch Easter egg configuration' });
  }
};

// Update Easter egg configuration
const updateEasterEggConfig = async (req, res) => {
  try {
    const updates = req.body;
    
    const { data: easterEgg, error } = await supabase
      .from('easter_egg')
      .update(updates)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Easter egg configuration updated successfully', easterEgg });
  } catch (error) {
    console.error('Update Easter egg config error:', error);
    res.status(500).json({ error: 'Failed to update Easter egg configuration' });
  }
};

module.exports = { getEasterEggConfig, updateEasterEggConfig };
