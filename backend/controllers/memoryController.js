const supabase = require('../config/database');
const { 
  ALLOWED_IMAGE_TYPES, 
  ALLOWED_AUDIO_TYPES, 
  MAX_IMAGE_SIZE, 
  MAX_AUDIO_SIZE 
} = require('../config/constants');

// Get all memory pages
const getMemoryPages = async (req, res) => {
  try {
    const { data: memories, error } = await supabase
      .from('memories')
      .select('*');
    
    if (error) {
      // Return empty array if table doesn't exist
      return res.json([]);
    }
    
    // Filter out inactive memories if the column exists
    const activeMemories = memories.filter(m => m.is_active !== false);
    res.json(activeMemories);
  } catch (error) {
    console.error('Get memory pages error:', error);
    // Return empty array on error
    res.json([]);
  }
};

// Get single memory page
const getMemoryPage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: memory, error } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!memory) {
      return res.status(404).json({ error: 'Memory page not found' });
    }
    
    // Check if memory is active (if column exists)
    if (memory.is_active === false) {
      return res.status(404).json({ error: 'Memory page not found' });
    }
    
    res.json(memory);
  } catch (error) {
    console.error('Get memory page error:', error);
    res.status(500).json({ error: 'Failed to fetch memory page' });
  }
};

// Create new memory page
const createMemoryPage = async (req, res) => {
  try {
    const {
      title,
      photo_url,
      message,
      music_url,
      music_volume,
      music_loop
    } = req.body;
    
    const { data: memory, error } = await supabase
      .from('memories')
      .insert([{
        title: title || 'Memory',
        photo_url: photo_url || null,
        message: message || '',
        music_url: music_url || null,
        music_volume: music_volume || 0.7,
        music_loop: music_loop !== undefined ? music_loop : true
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Memory page created successfully', memory });
  } catch (error) {
    console.error('Create memory page error:', error);
    res.status(500).json({ error: 'Failed to create memory page' });
  }
};

// Update memory page
const updateMemoryPage = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Only include fields that likely exist in the schema
    const safeUpdates = {};
    if (updates.title !== undefined) safeUpdates.title = updates.title;
    if (updates.photo_url !== undefined) safeUpdates.photo_url = updates.photo_url;
    if (updates.message !== undefined) safeUpdates.message = updates.message;
    if (updates.music_url !== undefined) safeUpdates.music_url = updates.music_url;
    
    const { data: memory, error } = await supabase
      .from('memories')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!memory) {
      return res.status(404).json({ error: 'Memory page not found' });
    }
    
    res.json({ message: 'Memory page updated successfully', memory });
  } catch (error) {
    console.error('Update memory page error:', error);
    res.status(500).json({ error: 'Failed to update memory page' });
  }
};

// Delete memory page
const deleteMemoryPage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get memory info to delete storage files
    const { data: memory, error: fetchError } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError || !memory) {
      return res.status(404).json({ error: 'Memory page not found' });
    }
    
    // Delete photo from storage if exists
    if (memory.photo_url) {
      try {
        const photoPath = memory.photo_url.split('/').pop();
        await supabase.storage
          .from('birthday-media')
          .remove([`photos/${photoPath}`]);
      } catch (storageError) {
        console.error('Photo deletion error:', storageError);
      }
    }
    
    // Delete background from storage if exists
    if (memory.background_url) {
      try {
        const bgPath = memory.background_url.split('/').pop();
        await supabase.storage
          .from('birthday-media')
          .remove([`backgrounds/${bgPath}`]);
      } catch (storageError) {
        console.error('Background deletion error:', storageError);
      }
    }
    
    // Delete music from storage if exists
    if (memory.music_url) {
      try {
        const musicPath = memory.music_url.split('/').pop();
        await supabase.storage
          .from('birthday-media')
          .remove([`music/${musicPath}`]);
      } catch (storageError) {
        console.error('Music deletion error:', storageError);
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ message: 'Memory page deleted successfully' });
  } catch (error) {
    console.error('Delete memory page error:', error);
    res.status(500).json({ error: 'Failed to delete memory page' });
  }
};

// Reorder memory pages
const reorderMemoryPages = async (req, res) => {
  try {
    const { memories } = req.body; // Array of {id, display_order}
    
    for (const memory of memories) {
      const { error } = await supabase
        .from('memories')
        .update({ display_order: memory.display_order })
        .eq('id', memory.id);
      
      if (error) throw error;
    }
    
    res.json({ message: 'Memory pages reordered successfully' });
  } catch (error) {
    console.error('Reorder memory pages error:', error);
    res.status(500).json({ error: 'Failed to reorder memory pages' });
  }
};

// Upload photo for memory page
const uploadMemoryPhoto = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid file type. Only images are allowed' });
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }
    
    // Upload to Supabase Storage
    const fileName = `photos/${memoryId}-${Date.now()}-${file.originalname}`;
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
    
    // Update memory with photo URL
    const { data: memory, error } = await supabase
      .from('memories')
      .update({ photo_url: publicUrl })
      .eq('id', memoryId)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Photo uploaded successfully', photo_url: publicUrl });
  } catch (error) {
    console.error('Upload memory photo error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};

// Upload background for memory page
const uploadMemoryBackground = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid file type. Only images are allowed' });
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }
    
    // Upload to Supabase Storage
    const fileName = `backgrounds/${memoryId}-${Date.now()}-${file.originalname}`;
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
    
    // Update memory with background URL
    const { data: memory, error } = await supabase
      .from('memories')
      .update({ background_url: publicUrl })
      .eq('id', memoryId)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Background uploaded successfully', background_url: publicUrl });
  } catch (error) {
    console.error('Upload memory background error:', error);
    res.status(500).json({ error: 'Failed to upload background' });
  }
};

// Upload music for memory page
const uploadMemoryMusic = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    if (!file.mimetype.startsWith('audio/')) {
      return res.status(400).json({ error: 'Invalid file type. Only audio files are allowed' });
    }
    
    if (file.size > 20 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 20MB limit' });
    }
    
    // Upload to Supabase Storage
    const fileName = `music/${memoryId}-${Date.now()}-${file.originalname}`;
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
    
    // Update memory with music URL
    const { data: memory, error } = await supabase
      .from('memories')
      .update({ music_url: publicUrl })
      .eq('id', memoryId)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Music uploaded successfully', music_url: publicUrl });
  } catch (error) {
    console.error('Upload memory music error:', error);
    res.status(500).json({ error: 'Failed to upload music' });
  }
};

// Set music URL for memory page (from URL input)
const setMemoryMusicUrl = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const { music_url } = req.body;
    
    if (!music_url) {
      return res.status(400).json({ error: 'Music URL is required' });
    }
    
    const { data: memory, error } = await supabase
      .from('memories')
      .update({ music_url })
      .eq('id', memoryId)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ message: 'Music URL set successfully', music_url });
  } catch (error) {
    console.error('Set memory music URL error:', error);
    res.status(500).json({ error: 'Failed to set music URL' });
  }
};

// Create new memory page with file uploads
const createMemoryPageWithFiles = async (req, res) => {
  try {
    const { title, card_message, music_volume, music_loop } = req.body;
    const photoFile = req.files?.photo?.[0];
    const musicFile = req.files?.music?.[0];

    // Validate photo
    if (photoFile && !ALLOWED_IMAGE_TYPES.includes(photoFile.mimetype)) {
      return res.status(400).json({ error: 'Invalid photo file type. Only JPEG, PNG, and WebP are allowed' });
    }
    if (photoFile && photoFile.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ error: 'Photo file size exceeds 10MB limit' });
    }

    // Validate music
    if (musicFile && !ALLOWED_AUDIO_TYPES.includes(musicFile.mimetype)) {
      return res.status(400).json({ error: 'Invalid music file type. Only MP3 is allowed' });
    }
    if (musicFile && musicFile.size > MAX_AUDIO_SIZE) {
      return res.status(400).json({ error: 'Music file size exceeds 20MB limit' });
    }

    // Upload photo if provided
    let photoUrl = null;
    if (photoFile) {
      const fileName = `photos/memory-${Date.now()}-${photoFile.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('birthday-media')
        .upload(fileName, photoFile.buffer, {
          contentType: photoFile.mimetype,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('birthday-media')
        .getPublicUrl(fileName);
      photoUrl = publicUrl;
    }

    // Upload music if provided
    let musicUrl = null;
    if (musicFile) {
      const fileName = `music/memory-${Date.now()}-${musicFile.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('birthday-media')
        .upload(fileName, musicFile.buffer, {
          contentType: musicFile.mimetype,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('birthday-media')
        .getPublicUrl(fileName);
      musicUrl = publicUrl;
    }

    // Create memory page with only basic fields that definitely exist
    const memoryData = {
      title: title || 'Memory',
      photo_url: photoUrl,
      message: card_message || ''
    };

    // Only add music fields if music was uploaded
    if (musicUrl) {
      memoryData.music_url = musicUrl;
    }

    const { data: memory, error } = await supabase
      .from('memories')
      .insert([memoryData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(memory);
  } catch (error) {
    console.error('Create memory page with files error:', error);
    res.status(500).json({ error: 'Failed to create memory page' });
  }
};

module.exports = {
  getMemoryPages,
  getMemoryPage,
  createMemoryPage,
  createMemoryPageWithFiles,
  updateMemoryPage,
  deleteMemoryPage,
  reorderMemoryPages,
  uploadMemoryPhoto,
  uploadMemoryBackground,
  uploadMemoryMusic,
  setMemoryMusicUrl
};
