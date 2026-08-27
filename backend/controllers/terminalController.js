const supabase = require('../config/database');

// Get all terminal lines
const getTerminalLines = async (req, res) => {
  try {
    const { data: lines, error } = await supabase
      .from('terminal_lines')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    res.json(lines);
  } catch (error) {
    console.error('Get terminal lines error:', error);
    res.status(500).json({ error: 'Failed to fetch terminal lines' });
  }
};

// Update terminal line
const updateTerminalLine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data: line, error } = await supabase
      .from('terminal_lines')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Terminal line updated successfully', line });
  } catch (error) {
    console.error('Update terminal line error:', error);
    res.status(500).json({ error: 'Failed to update terminal line' });
  }
};

// Create terminal line
const createTerminalLine = async (req, res) => {
  try {
    const { text, delay, typing_speed, emoji, enabled, order_index } = req.body;
    
    const { data: line, error } = await supabase
      .from('terminal_lines')
      .insert([{
        text,
        delay: delay || 1000,
        typing_speed: typing_speed || 50,
        emoji: emoji || '',
        enabled: enabled !== false,
        order_index: order_index || 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Terminal line created successfully', line });
  } catch (error) {
    console.error('Create terminal line error:', error);
    res.status(500).json({ error: 'Failed to create terminal line' });
  }
};

// Delete terminal line
const deleteTerminalLine = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('terminal_lines')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ message: 'Terminal line deleted successfully' });
  } catch (error) {
    console.error('Delete terminal line error:', error);
    res.status(500).json({ error: 'Failed to delete terminal line' });
  }
};

// Reorder terminal lines
const reorderTerminalLines = async (req, res) => {
  try {
    const { lines } = req.body; // Array of {id, order_index}
    
    for (const line of lines) {
      const { error } = await supabase
        .from('terminal_lines')
        .update({ order_index: line.order_index })
        .eq('id', line.id);
      
      if (error) throw error;
    }
    
    res.json({ message: 'Terminal lines reordered successfully' });
  } catch (error) {
    console.error('Reorder terminal lines error:', error);
    res.status(500).json({ error: 'Failed to reorder terminal lines' });
  }
};

module.exports = {
  getTerminalLines,
  updateTerminalLine,
  createTerminalLine,
  deleteTerminalLine,
  reorderTerminalLines
};
