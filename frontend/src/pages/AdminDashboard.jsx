import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [config, setConfig] = useState(null);
  const [terminalLines, setTerminalLines] = useState([]);
  const [memories, setMemories] = useState([]);
  const [music, setMusic] = useState(null);
  const [videos, setVideos] = useState([]);
  const [puzzleConfig, setPuzzleConfig] = useState(null);
  const [easterEggConfig, setEasterEggConfig] = useState(null);
  const [sceneSettings, setSceneSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [configRes, terminalRes, memoriesRes, musicRes, videosRes, puzzleRes, easterEggRes, scenesRes] = await Promise.all([
        api.get('/config'),
        api.get('/terminal/lines'),
        api.get('/media/memories'),
        api.get('/media/music'),
        api.get('/media/videos'),
        api.get('/puzzle'),
        api.get('/easter-egg'),
        api.get('/scenes')
      ]);

      setConfig(configRes.data);
      setTerminalLines(terminalRes.data);
      setMemories(memoriesRes.data);
      setMusic(musicRes.data);
      setVideos(videosRes.data);
      setPuzzleConfig(puzzleRes.data);
      setEasterEggConfig(easterEggRes.data);
      setSceneSettings(scenesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await api.put('/config', config);
      alert('Configuration saved successfully!');
    } catch (error) {
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSceneToggle = (sceneName) => {
    setSceneSettings(prev => ({
      ...prev,
      [sceneName]: !prev[sceneName]
    }));
    // Save immediately
    api.put('/scenes', { scene_name: sceneName, enabled: !sceneSettings[sceneName] })
      .catch(error => console.error('Failed to update scene:', error));
  };

  if (loading) {
    return <div className="admin-dashboard loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Birthday Studio</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <button
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`tab-button ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
          >
            Terminal
          </button>
          <button
            className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
          </button>
          <button
            className={`tab-button ${activeTab === 'music' ? 'active' : ''}`}
            onClick={() => setActiveTab('music')}
          >
            Music
          </button>
          <button
            className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
          <button
            className={`tab-button ${activeTab === 'puzzle' ? 'active' : ''}`}
            onClick={() => setActiveTab('puzzle')}
          >
            Puzzle
          </button>
          <button
            className={`tab-button ${activeTab === 'easter-egg' ? 'active' : ''}`}
            onClick={() => setActiveTab('easter-egg')}
          >
            Easter Egg
          </button>
          <button
            className={`tab-button ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            Theme
          </button>
          <button
            className={`tab-button ${activeTab === 'scenes' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenes')}
          >
            Scenes
          </button>
        </div>

        <div className="main-content">
          {activeTab === 'general' && (
            <div className="tab-content">
              <h2>General Content</h2>
              <div className="form-section">
                <div className="form-group">
                  <label>Belinda's Name</label>
                  <input
                    type="text"
                    value={config?.belinda_name || ''}
                    onChange={(e) => handleConfigChange('belinda_name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Main Title</label>
                  <input
                    type="text"
                    value={config?.main_title || ''}
                    onChange={(e) => handleConfigChange('main_title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={config?.subtitle || ''}
                    onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Birthday Message</label>
                  <textarea
                    value={config?.birthday_message || ''}
                    onChange={(e) => handleConfigChange('birthday_message', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Letter Title</label>
                  <input
                    type="text"
                    value={config?.letter_title || ''}
                    onChange={(e) => handleConfigChange('letter_title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Love Letter</label>
                  <textarea
                    value={config?.letter || ''}
                    onChange={(e) => handleConfigChange('letter', e.target.value)}
                    rows={8}
                  />
                </div>
                <div className="form-group">
                  <label>Final Message</label>
                  <textarea
                    value={config?.final_message || ''}
                    onChange={(e) => handleConfigChange('final_message', e.target.value)}
                    rows={6}
                  />
                </div>
                <button className="save-button" onClick={handleSaveConfig} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="tab-content">
              <h2>Terminal Configuration</h2>
              <div className="terminal-lines">
                {terminalLines.map((line) => (
                  <div key={line.id} className="terminal-line-item">
                    <input
                      type="text"
                      value={line.text}
                      onChange={(e) => {
                        const updated = terminalLines.map(l => 
                          l.id === line.id ? { ...l, text: e.target.value } : l
                        );
                        setTerminalLines(updated);
                      }}
                    />
                    <input
                      type="number"
                      value={line.delay}
                      onChange={(e) => {
                        const updated = terminalLines.map(l => 
                          l.id === line.id ? { ...l, delay: parseInt(e.target.value) } : l
                        );
                        setTerminalLines(updated);
                      }}
                      placeholder="Delay (ms)"
                    />
                    <input
                      type="number"
                      value={line.typing_speed}
                      onChange={(e) => {
                        const updated = terminalLines.map(l => 
                          l.id === line.id ? { ...l, typing_speed: parseInt(e.target.value) } : l
                        );
                        setTerminalLines(updated);
                      }}
                      placeholder="Typing Speed (ms)"
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={line.enabled}
                        onChange={(e) => {
                          const updated = terminalLines.map(l => 
                            l.id === line.id ? { ...l, enabled: e.target.checked } : l
                          );
                          setTerminalLines(updated);
                        }}
                      />
                      Enabled
                    </label>
                  </div>
                ))}
              </div>
              <button className="save-button" onClick={() => {
                // Save terminal lines
                terminalLines.forEach(line => {
                  api.put(`/terminal/lines/${line.id}`, line)
                    .catch(error => console.error('Failed to save terminal line:', error));
                });
                alert('Terminal lines saved!');
              }}>
                Save Terminal Lines
              </button>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="tab-content">
              <h2>Photo Memories</h2>
              <div className="memories-list">
                {memories.map((memory) => (
                  <div key={memory.id} className="memory-item">
                    <img src={memory.photo_url} alt="" />
                    <div className="memory-details">
                      <input
                        type="text"
                        value={memory.caption}
                        onChange={(e) => {
                          const updated = memories.map(m => 
                            m.id === memory.id ? { ...m, caption: e.target.value } : m
                          );
                          setMemories(updated);
                        }}
                        placeholder="Caption"
                      />
                      <textarea
                        value={memory.message}
                        onChange={(e) => {
                          const updated = memories.map(m => 
                            m.id === memory.id ? { ...m, message: e.target.value } : m
                          );
                          setMemories(updated);
                        }}
                        placeholder="Personal message"
                        rows={3}
                      />
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={memory.enabled}
                          onChange={(e) => {
                            const updated = memories.map(m => 
                              m.id === memory.id ? { ...m, enabled: e.target.checked } : m
                            );
                            setMemories(updated);
                          }}
                        />
                        Enabled
                      </label>
                      <button className="delete-button" onClick={() => {
                        if (confirm('Delete this photo?')) {
                          api.delete(`/media/photos/${memory.id}`)
                            .then(() => {
                              setMemories(memories.filter(m => m.id !== memory.id));
                            })
                            .catch(error => console.error('Failed to delete photo:', error));
                        }
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="upload-section">
                <h3>Upload New Photo</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('file', file);
                      api.post('/media/photos', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      })
                        .then(response => {
                          setMemories([...memories, response.data.memory]);
                          e.target.value = '';
                        })
                        .catch(error => console.error('Failed to upload photo:', error));
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'music' && (
            <div className="tab-content">
              <h2>Music Configuration</h2>
              {music && (
                <div className="music-config">
                  <div className="form-group">
                    <label>Song Title</label>
                    <input
                      type="text"
                      value={music.title}
                      onChange={(e) => setMusic({ ...music, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Artist</label>
                    <input
                      type="text"
                      value={music.artist}
                      onChange={(e) => setMusic({ ...music, artist: e.target.value })}
                    />
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={music.enabled}
                      onChange={(e) => setMusic({ ...music, enabled: e.target.checked })}
                    />
                    Enabled
                  </label>
                  <button className="save-button" onClick={() => {
                    api.put('/media/music', music)
                      .then(() => alert('Music configuration saved!'))
                      .catch(error => console.error('Failed to save music:', error));
                  }}>
                    Save Music Config
                  </button>
                  <button className="delete-button" onClick={() => {
                    if (confirm('Delete this music?')) {
                      api.delete('/media/music')
                        .then(() => setMusic(null))
                        .catch(error => console.error('Failed to delete music:', error));
                    }
                  }}>
                    Delete Music
                  </button>
                </div>
              )}
              {!music && (
                <div className="upload-section">
                  <h3>Upload Music</h3>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('title', 'Belinda\'s Song');
                        api.post('/media/music', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        })
                          .then(response => {
                            setMusic(response.data.music);
                            e.target.value = '';
                          })
                          .catch(error => console.error('Failed to upload music:', error));
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="tab-content">
              <h2>Video Memories</h2>
              <div className="videos-list">
                {videos.map((video) => (
                  <div key={video.id} className="video-item">
                    <video src={video.video_url} controls width="200" />
                    <div className="video-details">
                      <input
                        type="text"
                        value={video.caption}
                        onChange={(e) => {
                          const updated = videos.map(v => 
                            v.id === video.id ? { ...v, caption: e.target.value } : v
                          );
                          setVideos(updated);
                        }}
                        placeholder="Caption"
                      />
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={video.enabled}
                          onChange={(e) => {
                            const updated = videos.map(v => 
                              v.id === video.id ? { ...v, enabled: e.target.checked } : v
                            );
                            setVideos(updated);
                          }}
                        />
                        Enabled
                      </label>
                      <button className="delete-button" onClick={() => {
                        if (confirm('Delete this video?')) {
                          api.delete(`/media/videos/${video.id}`)
                            .then(() => {
                              setVideos(videos.filter(v => v.id !== video.id));
                            })
                            .catch(error => console.error('Failed to delete video:', error));
                        }
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="upload-section">
                <h3>Upload New Video</h3>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('file', file);
                      api.post('/media/videos', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      })
                        .then(response => {
                          setVideos([...videos, response.data.video]);
                          e.target.value = '';
                        })
                        .catch(error => console.error('Failed to upload video:', error));
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'puzzle' && (
            <div className="tab-content">
              <h2>Puzzle Configuration</h2>
              {puzzleConfig && (
                <div className="puzzle-config">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={puzzleConfig.enabled}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, enabled: e.target.checked })}
                    />
                    Puzzle Enabled
                  </label>
                  <div className="form-group">
                    <label>Number of Candles</label>
                    <input
                      type="number"
                      value={puzzleConfig.num_candles}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, num_candles: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Puzzle Letters</label>
                    <input
                      type="text"
                      value={puzzleConfig.puzzle_letters}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, puzzle_letters: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hint</label>
                    <input
                      type="text"
                      value={puzzleConfig.hint}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, hint: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Success Message</label>
                    <textarea
                      value={puzzleConfig.success_message}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, success_message: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <button className="save-button" onClick={() => {
                    api.put('/puzzle', puzzleConfig)
                      .then(() => alert('Puzzle configuration saved!'))
                      .catch(error => console.error('Failed to save puzzle:', error));
                  }}>
                    Save Puzzle Config
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'easter-egg' && (
            <div className="tab-content">
              <h2>Easter Egg Configuration</h2>
              {easterEggConfig && (
                <div className="easter-egg-config">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={easterEggConfig.enabled}
                      onChange={(e) => setEasterEggConfig({ ...easterEggConfig, enabled: e.target.checked })}
                    />
                    Easter Egg Enabled
                  </label>
                  <div className="form-group">
                    <label>Trigger Method</label>
                    <input
                      type="text"
                      value={easterEggConfig.trigger_method}
                      onChange={(e) => setEasterEggConfig({ ...easterEggConfig, trigger_method: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Secret Message</label>
                    <textarea
                      value={easterEggConfig.secret_message}
                      onChange={(e) => setEasterEggConfig({ ...easterEggConfig, secret_message: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <button className="save-button" onClick={() => {
                    api.put('/easter-egg', easterEggConfig)
                      .then(() => alert('Easter egg configuration saved!'))
                      .catch(error => console.error('Failed to save easter egg:', error));
                  }}>
                    Save Easter Egg Config
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="tab-content">
              <h2>Theme Configuration</h2>
              {config && (
                <div className="theme-config">
                  <div className="form-group">
                    <label>Primary Accent</label>
                    <input
                      type="color"
                      value={config.primary_accent}
                      onChange={(e) => handleConfigChange('primary_accent', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Secondary Accent</label>
                    <input
                      type="color"
                      value={config.secondary_accent}
                      onChange={(e) => handleConfigChange('secondary_accent', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Background</label>
                    <input
                      type="color"
                      value={config.background}
                      onChange={(e) => handleConfigChange('background', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Text Color</label>
                    <input
                      type="color"
                      value={config.text_color}
                      onChange={(e) => handleConfigChange('text_color', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Glow Color</label>
                    <input
                      type="color"
                      value={config.glow_color}
                      onChange={(e) => handleConfigChange('glow_color', e.target.value)}
                    />
                  </div>
                  <button className="save-button" onClick={handleSaveConfig} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Theme'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'scenes' && (
            <div className="tab-content">
              <h2>Scene Control</h2>
              {sceneSettings && (
                <div className="scenes-config">
                  {Object.entries(sceneSettings).map(([sceneName, enabled]) => (
                    <label key={sceneName} className="checkbox-label scene-toggle">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => handleSceneToggle(sceneName)}
                      />
                      {sceneName.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
