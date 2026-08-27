const supabase = require('../config/database');
const { 
  ALLOWED_IMAGE_TYPES, 
  ALLOWED_AUDIO_TYPES, 
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_AUDIO_SIZE,
  MAX_VIDEO_SIZE
} = require('../config/constants');

// Get all memories (photos)
const getMemories = async (req, res) => {
  try {
    const { data: memories, error } = await supabase
      .from('memories')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    res.json(memories);
  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
};

// Upload photo
const uploadPhoto = async (req, res) => {
  try {
    const { caption, message, date, location, hidden_note, order_index } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed' });
    }
    
    if (file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }
    
    // Upload to Supabase Storage
    const fileName = `photos/${Date.now()}-${file.originalname}`;
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
    
    // Save to database
    const { data: memory, error } = await supabase
      .from('memories')
      .insert([{
        photo_url: publicUrl,
        storage_path: fileName,
        caption: caption || '',
        message: message || '',
        date: date || null,
        location: location || '',
        hidden_note: hidden_note || '',
        order_index: order_index || 0,
        enabled: true
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Photo uploaded successfully', memory });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};

// Delete photo
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get memory info
    const { data: memory, error: fetchError } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    // Delete from storage
    if (memory.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('birthday-media')
        .remove([memory.storage_path]);
      
      if (storageError) console.error('Storage deletion error:', storageError);
    }
    
    // Delete from database
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
};

// Update photo
const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data: memory, error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Photo updated successfully', memory });
  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({ error: 'Failed to update photo' });
  }
};

// Reorder photos
const reorderPhotos = async (req, res) => {
  try {
    const { memories } = req.body; // Array of {id, order_index}
    
    for (const memory of memories) {
      const { error } = await supabase
        .from('memories')
        .update({ order_index: memory.order_index })
        .eq('id', memory.id);
      
      if (error) throw error;
    }
    
    res.json({ message: 'Photos reordered successfully' });
  } catch (error) {
    console.error('Reorder photos error:', error);
    res.status(500).json({ error: 'Failed to reorder photos' });
  }
};

// Get music
const getMusic = async (req, res) => {
  try {
    const { data: music, error } = await supabase
      .from('music')
      .select('*')
      .single();
    
    if (error) throw error;
    
    res.json(music);
  } catch (error) {
    console.error('Get music error:', error);
    res.status(500).json({ error: 'Failed to fetch music' });
  }
};

// Upload music
const uploadMusic = async (req, res) => {
  try {
    const { title, artist } = req.body;
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
    const fileName = `music/${Date.now()}-${file.originalname}`;
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
    
    // Save to database
    const { data: music, error } = await supabase
      .from('music')
      .upsert({
        audio_url: publicUrl,
        storage_path: fileName,
        title: title || 'Belinda\'s Song',
        artist: artist || '',
        enabled: true
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Music uploaded successfully', music });
  } catch (error) {
    console.error('Upload music error:', error);
    res.status(500).json({ error: 'Failed to upload music' });
  }
};

// Delete music
const deleteMusic = async (req, res) => {
  try {
    // Get music info
    const { data: music, error: fetchError } = await supabase
      .from('music')
      .select('*')
      .single();
    
    if (fetchError || !music) {
      return res.status(404).json({ error: 'Music not found' });
    }
    
    // Delete from storage
    if (music.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('birthday-media')
        .remove([music.storage_path]);
      
      if (storageError) console.error('Storage deletion error:', storageError);
    }
    
    // Delete from database
    const { error } = await supabase
      .from('music')
      .delete()
      .neq('id', 0); // Delete all music
    
    if (error) throw error;
    
    res.json({ message: 'Music deleted successfully' });
  } catch (error) {
    console.error('Delete music error:', error);
    res.status(500).json({ error: 'Failed to delete music' });
  }
};

// Get videos
const getVideos = async (req, res) => {
  try {
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

// Upload video
const uploadVideo = async (req, res) => {
  try {
    const { caption, order_index } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only MP4 is allowed' });
    }
    
    if (file.size > MAX_VIDEO_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 100MB limit' });
    }
    
    // Upload to Supabase Storage
    const fileName = `videos/${Date.now()}-${file.originalname}`;
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
    
    // Save to database
    const { data: video, error } = await supabase
      .from('videos')
      .insert([{
        video_url: publicUrl,
        storage_path: fileName,
        caption: caption || '',
        order_index: order_index || 0,
        enabled: true
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get video info
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Delete from storage
    if (video.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('birthday-media')
        .remove([video.storage_path]);
      
      if (storageError) console.error('Storage deletion error:', storageError);
    }
    
    // Delete from database
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

module.exports = {
  getMemories,
  uploadPhoto,
  deletePhoto,
  updatePhoto,
  reorderPhotos,
  getMusic,
  uploadMusic,
  deleteMusic,
  getVideos,
  uploadVideo,
  deleteVideo
};
