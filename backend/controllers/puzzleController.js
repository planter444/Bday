const supabase = require('../config/database');

// Get puzzle configuration
const getPuzzleConfig = async (req, res) => {
  try {
    const { data: puzzle, error } = await supabase
      .from('puzzle_config')
      .select('*')
      .single();
    
    if (error) {
      // Return default config if table doesn't exist or is empty
      return res.json({
        enabled: true,
        hint: 'Look for the hidden clue...',
        matching_instruction: 'Match the emojis to proceed to the next page.',
        success_message: 'Well done!',
        completion_message: 'You found the way in. ❤️'
      });
    }
    
    res.json(puzzle);
  } catch (error) {
    console.error('Get puzzle config error:', error);
    // Return default config on error
    res.json({
      enabled: true,
      hint: 'Look for the hidden clue...',
      matching_instruction: 'Match the emojis to proceed to the next page.',
      success_message: 'Well done!',
      completion_message: 'You found the way in. ❤️'
    });
  }
};

// Update puzzle configuration
const updatePuzzleConfig = async (req, res) => {
  try {
    const updates = req.body;
    
    const { data: puzzle, error } = await supabase
      .from('puzzle_config')
      .update(updates)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Puzzle configuration updated successfully', puzzle });
  } catch (error) {
    console.error('Update puzzle config error:', error);
    res.status(500).json({ error: 'Failed to update puzzle configuration' });
  }
};

module.exports = { getPuzzleConfig, updatePuzzleConfig };
