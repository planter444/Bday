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
        api.get('/memories'),
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
      console.error('Save error:', error);
      alert('Failed to save configuration: ' + (error.response?.data?.error || error.message));
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
      .then(() => {
        // Success
      })
      .catch(error => {
        console.error('Failed to update scene:', error);
        alert('Failed to update scene: ' + (error.response?.data?.error || error.message));
        // Revert on error
        setSceneSettings(prev => ({
          ...prev,
          [sceneName]: prev[sceneName]
        }));
      });
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
            className={`tab-button ${activeTab === 'pages' ? 'active' : ''}`}
            onClick={() => setActiveTab('pages')}
          >
            Pages
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
            Matching Game
          </button>
          <button
            className={`tab-button ${activeTab === 'heartbeat' ? 'active' : ''}`}
            onClick={() => setActiveTab('heartbeat')}
          >
            Heartbeat
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
          <button
            className={`tab-button ${activeTab === 'scene-music' ? 'active' : ''}`}
            onClick={() => setActiveTab('scene-music')}
          >
            Scene Music
          </button>
        </div>

        <div className="main-content">
          {activeTab === 'general' && (
            <div className="tab-content">
              <h2>General Content</h2>
              <div className="form-section">
                <div className="form-group">
                  <label>Intro Duration (seconds)</label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={(config?.intro_duration || 4000) / 1000}
                    onChange={(e) => handleConfigChange('intro_duration', parseInt(e.target.value) * 1000)}
                  />
                  <small>Minimum 2 seconds, default 4 seconds</small>
                </div>
                <div className="form-group">
                  <label>Intro Text</label>
                  <input
                    type="text"
                    value={config?.intro_text || 'Loading birthday magic...'}
                    onChange={(e) => handleConfigChange('intro_text', e.target.value)}
                  />
                  <small>Text shown on the first loading screen</small>
                </div>
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
                  <label>Continue Button Text</label>
                  <input
                    type="text"
                    value={config?.continue_button_text || 'CONTINUE'}
                    onChange={(e) => handleConfigChange('continue_button_text', e.target.value)}
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

          {activeTab === 'pages' && (
            <div className="tab-content">
              <h2>Page Configuration</h2>
              <div className="pages-config">
                <div className="page-config-item">
                  <h3>Page 1: Loading Screen</h3>
                  <div className="form-group">
                    <label>Intro Text</label>
                    <input
                      type="text"
                      value={config?.intro_text || 'Loading birthday magic...'}
                      onChange={(e) => handleConfigChange('intro_text', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (seconds)</label>
                    <input
                      type="number"
                      min="2"
                      max="30"
                      value={(config?.intro_duration || 4000) / 1000}
                      onChange={(e) => handleConfigChange('intro_duration', parseInt(e.target.value) * 1000)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Music</label>
                    <select
                      value={config?.initializing_music_enabled ? 'custom' : 'none'}
                      onChange={(e) => handleConfigChange('initializing_music_enabled', e.target.value === 'custom')}
                    >
                      <option value="none">No Music</option>
                      <option value="custom">Custom Music</option>
                    </select>
                  </div>
                  {config?.initializing_music_enabled && (
                    <div className="form-group">
                      <label>Music URL</label>
                      <input
                        type="text"
                        value={config?.initializing_music_url || ''}
                        onChange={(e) => handleConfigChange('initializing_music_url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>

                <div className="page-config-item">
                  <h3>Page 2: Terminal / Initializing</h3>
                  <div className="form-group">
                    <label>Music</label>
                    <select
                      value={config?.initializing_music_enabled ? 'custom' : 'none'}
                      onChange={(e) => handleConfigChange('initializing_music_enabled', e.target.value === 'custom')}
                    >
                      <option value="none">No Music</option>
                      <option value="custom">Custom Music</option>
                    </select>
                  </div>
                  {config?.initializing_music_enabled && (
                    <>
                      <div className="form-group">
                        <label>Music URL</label>
                        <input
                          type="text"
                          value={config?.initializing_music_url || ''}
                          onChange={(e) => handleConfigChange('initializing_music_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={config?.initializing_music_volume || 0.7}
                          onChange={(e) => handleConfigChange('initializing_music_volume', parseFloat(e.target.value))}
                        />
                        <span>{Math.round((config?.initializing_music_volume || 0.7) * 100)}%</span>
                      </div>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={config?.initializing_music_loop !== false}
                          onChange={(e) => handleConfigChange('initializing_music_loop', e.target.checked)}
                        />
                        Loop Music
                      </label>
                    </>
                  )}
                </div>

                <div className="page-config-item">
                  <h3>Page 3: Birthday Room</h3>
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
                    <label>Continue Button Text</label>
                    <input
                      type="text"
                      value={config?.continue_button_text || 'CONTINUE'}
                      onChange={(e) => handleConfigChange('continue_button_text', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Music</label>
                    <select
                      value={config?.birthday_music_enabled ? 'custom' : 'none'}
                      onChange={(e) => handleConfigChange('birthday_music_enabled', e.target.value === 'custom')}
                    >
                      <option value="none">No Music</option>
                      <option value="custom">Custom Music</option>
                    </select>
                  </div>
                  {config?.birthday_music_enabled && (
                    <>
                      <div className="form-group">
                        <label>Music URL</label>
                        <input
                          type="text"
                          value={config?.birthday_music_url || ''}
                          onChange={(e) => handleConfigChange('birthday_music_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={config?.birthday_music_volume || 0.7}
                          onChange={(e) => handleConfigChange('birthday_music_volume', parseFloat(e.target.value))}
                        />
                        <span>{Math.round((config?.birthday_music_volume || 0.7) * 100)}%</span>
                      </div>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={config?.birthday_music_loop !== false}
                          onChange={(e) => handleConfigChange('birthday_music_loop', e.target.checked)}
                        />
                        Loop Music
                      </label>
                    </>
                  )}
                </div>

                <div className="page-config-item">
                  <h3>Page 4: Matching Game</h3>
                  <div className="form-group">
                    <label>Music</label>
                    <select
                      value={config?.puzzle_music_enabled ? 'custom' : 'none'}
                      onChange={(e) => handleConfigChange('puzzle_music_enabled', e.target.value === 'custom')}
                    >
                      <option value="none">No Music</option>
                      <option value="custom">Custom Music</option>
                    </select>
                  </div>
                  {config?.puzzle_music_enabled && (
                    <>
                      <div className="form-group">
                        <label>Music URL</label>
                        <input
                          type="text"
                          value={config?.puzzle_music_url || ''}
                          onChange={(e) => handleConfigChange('puzzle_music_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={config?.puzzle_music_volume || 0.7}
                          onChange={(e) => handleConfigChange('puzzle_music_volume', parseFloat(e.target.value))}
                        />
                        <span>{Math.round((config?.puzzle_music_volume || 0.7) * 100)}%</span>
                      </div>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={config?.puzzle_music_loop !== false}
                          onChange={(e) => handleConfigChange('puzzle_music_loop', e.target.checked)}
                        />
                        Loop Music
                      </label>
                    </>
                  )}
                </div>

                <div className="page-config-item">
                  <h3>Page 5: Memories Gallery</h3>
                  <div className="form-group">
                    <label>Music (Default for all memories)</label>
                    <select
                      value={config?.memories_music_enabled ? 'custom' : 'none'}
                      onChange={(e) => handleConfigChange('memories_music_enabled', e.target.value === 'custom')}
                    >
                      <option value="none">No Music</option>
                      <option value="custom">Custom Music</option>
                    </select>
                  </div>
                  {config?.memories_music_enabled && (
                    <>
                      <div className="form-group">
                        <label>Music URL</label>
                        <input
                          type="text"
                          value={config?.memories_music_url || ''}
                          onChange={(e) => handleConfigChange('memories_music_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={config?.memories_music_volume || 0.7}
                          onChange={(e) => handleConfigChange('memories_music_volume', parseFloat(e.target.value))}
                        />
                        <span>{Math.round((config?.memories_music_volume || 0.7) * 100)}%</span>
                      </div>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={config?.memories_music_loop !== false}
                          onChange={(e) => handleConfigChange('memories_music_loop', e.target.checked)}
                        />
                        Loop Music
                      </label>
                    </>
                  )}
                  <p className="info-text">Individual memory pages can override this music in the Photos section.</p>
                </div>

                <div className="page-config-item">
                  <h3>Page 6: Music Player</h3>
                  <p className="info-text">This page uses the main music configuration. Configure in General or Scene Music tabs.</p>
                </div>

                <div className="page-config-item">
                  <h3>Page 7: Video Memories</h3>
                  <p className="info-text">This page uses the main music configuration. Configure in General or Scene Music tabs.</p>
                </div>

                <div className="page-config-item">
                  <h3>Page 8: Love Letter</h3>
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
                </div>

                <div className="page-config-item">
                  <h3>Page 9: Heartbeat Analysis</h3>
                  <div className="form-group">
                    <label>Terminal Messages (one per line)</label>
                    <textarea
                      value={config?.heartbeat_messages || '> analyzing memories...\n> 10 photos found.\n> 1 beautiful girl found.\n> calculating how much she means to you...\n> ERROR\n> value exceeds measurable limits.\n> trying another method...\n> conclusion:\n> she\'s one of a kind.'}
                      onChange={(e) => handleConfigChange('heartbeat_messages', e.target.value)}
                      rows={10}
                    />
                  </div>
                </div>

                <div className="page-config-item">
                  <h3>Page 10: Final Message</h3>
                  <div className="form-group">
                    <label>Final Message</label>
                    <textarea
                      value={config?.final_message || ''}
                      onChange={(e) => handleConfigChange('final_message', e.target.value)}
                      rows={6}
                    />
                  </div>
                </div>

                <button className="save-button" onClick={handleSaveConfig} disabled={saving}>
                  {saving ? 'Saving...' : 'Save All Page Settings'}
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
              <button className="save-button" onClick={async () => {
                // Save terminal lines
                const savePromises = terminalLines.map(line => {
                  return api.put(`/terminal/lines/${line.id}`, line)
                    .catch(error => {
                      console.error('Failed to save terminal line:', error);
                      return { error, line };
                    });
                });
                
                const results = await Promise.all(savePromises);
                const errors = results.filter(r => r.error);
                
                if (errors.length > 0) {
                  alert(`Failed to save ${errors.length} terminal line(s). Check console for details.`);
                } else {
                  alert('Terminal lines saved successfully!');
                }
              }}>
                Save Terminal Lines
              </button>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="tab-content">
              <h2>Memory Pages</h2>
              <div className="memories-list">
                {memories.map((memory) => (
                  <div key={memory.id} className="memory-item">
                    <div className="memory-thumbnail">
                      {memory.photo_url && <img src={memory.photo_url} alt="" />}
                    </div>
                    <div className="memory-details">
                      <div className="form-group">
                        <label>Page Title</label>
                        <input
                          type="text"
                          value={memory.caption || ''}
                          onChange={(e) => {
                            const updated = memories.map(m => 
                              m.id === memory.id ? { ...m, caption: e.target.value } : m
                            );
                            setMemories(updated);
                          }}
                          placeholder="Memory page title"
                        />
                      </div>
                      <div className="form-group">
                        <label>Birthday Card Message</label>
                        <textarea
                          value={memory.message || ''}
                          onChange={(e) => {
                            const updated = memories.map(m => 
                              m.id === memory.id ? { ...m, message: e.target.value } : m
                            );
                            setMemories(updated);
                          }}
                          placeholder="Personal message for this memory"
                          rows={3}
                        />
                      </div>
                      <div className="form-group">
                        <label>Music URL</label>
                        <input
                          type="text"
                          value={memory.music_url || ''}
                          onChange={(e) => {
                            const updated = memories.map(m => 
                              m.id === memory.id ? { ...m, music_url: e.target.value } : m
                            );
                            setMemories(updated);
                          }}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Mobile Frame Orientation</label>
                        <select
                          value={memory.orientation || 'portrait'}
                          onChange={(e) => {
                            const updated = memories.map(m => 
                              m.id === memory.id ? { ...m, orientation: e.target.value } : m
                            );
                            setMemories(updated);
                          }}
                        >
                          <option value="portrait">Portrait (vertical)</option>
                          <option value="landscape">Landscape (horizontal)</option>
                        </select>
                        <small>Only affects mobile display. Desktop unchanged.</small>
                      </div>
                      <div className="form-group">
                        <label>Frame Color</label>
                        <input
                          type="color"
                          value={memory.frame_color || '#8B4513'}
                          onChange={(e) => {
                            const updated = memories.map(m => 
                              m.id === memory.id ? { ...m, frame_color: e.target.value } : m
                            );
                            setMemories(updated);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Card Background Color</label>
                        <input
                          type="color"
                          value={memory.card_color || '#fff5e6'}
                          onChange={(e) => {
                            const updated = memories.map(m => 
                              m.id === memory.id ? { ...m, card_color: e.target.value } : m
                            );
                            setMemories(updated);
                          }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Card Font</label>
                        <select
                          value={memory.card_font || 'Arial'}
                          onChange={(e) => {
                            const updated = memories.map(m => 
                              m.id === memory.id ? { ...m, card_font: e.target.value } : m
                            );
                            setMemories(updated);
                          }}
                        >
                          <option value="Arial">Arial</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Comic Sans MS">Comic Sans MS</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Card Text Color</label>
                        <input
                          type="color"
                          value={memory.card_text_color || '#333'}
                          onChange={(e) => {
                            const updated = memories.map(m =>
                              m.id === memory.id ? { ...m, card_text_color: e.target.value } : m
                            );
                            setMemories(updated);
                          }}
                        />
                      </div>
                      <button className="save-button" onClick={() => {
                        api.put(`/memories/${memory.id}`, memory)
                          .then(() => alert('Memory saved successfully!'))
                          .catch(error => {
                            console.error('Failed to save memory:', error);
                            alert('Failed to save memory');
                          });
                      }}>
                        Save This Memory
                      </button>
                      <button className="delete-button" onClick={() => {
                        if (confirm('Delete this memory page?')) {
                          api.delete(`/memories/${memory.id}`)
                            .then(() => {
                              setMemories(memories.filter(m => m.id !== memory.id));
                            })
                            .catch(error => console.error('Failed to delete memory:', error));
                        }
                      }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="save-button" onClick={() => {
                // Save all memories
                const savePromises = memories.map(memory => {
                  return api.put(`/memories/${memory.id}`, memory)
                    .catch(error => {
                      console.error('Failed to save memory:', error);
                      return { error, memory };
                    });
                });
                
                Promise.all(savePromises).then(results => {
                  const errors = results.filter(r => r.error);
                  if (errors.length > 0) {
                    alert(`Some memories failed to save. Check console for details.`);
                  } else {
                    alert('Memory pages saved successfully!');
                  }
                });
              }}>
                Save All Memory Pages
              </button>
              <div className="upload-section">
                <h3>Create New Memory Page</h3>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    id="new-memory-title"
                    placeholder="Memory page title"
                  />
                </div>
                <div className="form-group">
                  <label>Photo</label>
                  <input
                    type="file"
                    id="new-memory-photo"
                    accept="image/*"
                  />
                </div>
                <div className="form-group">
                  <label>Card Message</label>
                  <textarea
                    id="new-memory-message"
                    placeholder="Personal message"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Music (optional)</label>
                  <input
                    type="file"
                    id="new-memory-music"
                    accept="audio/*"
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Frame Orientation</label>
                  <select
                    id="new-memory-orientation"
                  >
                    <option value="portrait">Portrait (vertical)</option>
                    <option value="landscape">Landscape (horizontal)</option>
                  </select>
                  <small>Only affects mobile display. Desktop unchanged.</small>
                </div>
                <div className="form-group">
                  <label>Frame Color</label>
                  <input
                    type="color"
                    id="new-memory-frame-color"
                    value="#8B4513"
                  />
                </div>
                <div className="form-group">
                  <label>Card Background Color</label>
                  <input
                    type="color"
                    id="new-memory-card-color"
                    value="#fff5e6"
                  />
                </div>
                <div className="form-group">
                  <label>Card Font</label>
                  <select
                    id="new-memory-card-font"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Card Text Color</label>
                  <input
                    type="color"
                    id="new-memory-card-text-color"
                    value="#333"
                  />
                </div>
                <div className="form-buttons">
                  <button className="add-button" onClick={() => {
                    const title = document.getElementById('new-memory-title').value;
                    const photoFile = document.getElementById('new-memory-photo').files[0];
                    const message = document.getElementById('new-memory-message').value;
                    const musicFile = document.getElementById('new-memory-music').files[0];
                    const orientation = document.getElementById('new-memory-orientation').value;
                    const frameColor = document.getElementById('new-memory-frame-color').value;
                    const cardColor = document.getElementById('new-memory-card-color').value;
                    const cardFont = document.getElementById('new-memory-card-font').value;
                    const cardTextColor = document.getElementById('new-memory-card-text-color').value;

                    if (!title) {
                      alert('Please enter a title');
                      return;
                    }

                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('message', message);
                    formData.append('orientation', orientation);
                    formData.append('frame_color', frameColor);
                    formData.append('card_color', cardColor);
                    formData.append('card_font', cardFont);
                    formData.append('card_text_color', cardTextColor);
                    if (photoFile) formData.append('photo', photoFile);
                    if (musicFile) formData.append('music', musicFile);

                    api.post('/memories/with-files', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    })
                      .then(response => {
                        setMemories([...memories, response.data]);
                        document.getElementById('new-memory-title').value = '';
                        document.getElementById('new-memory-photo').value = '';
                        document.getElementById('new-memory-message').value = '';
                        document.getElementById('new-memory-music').value = '';
                        document.getElementById('new-memory-orientation').value = 'portrait';
                        document.getElementById('new-memory-frame-color').value = '#8B4513';
                        document.getElementById('new-memory-card-color').value = '#fff5e6';
                        document.getElementById('new-memory-card-font').value = 'Arial';
                        document.getElementById('new-memory-card-text-color').value = '#333';
                        alert('Memory page created successfully!');
                      })
                      .catch(error => {
                        console.error('Failed to create memory:', error);
                        alert('Failed to create memory: ' + (error.response?.data?.error || error.message));
                      });
                  }}>
                    Create Memory Page
                  </button>
                  <button className="secondary-button" onClick={() => {
                    const title = document.getElementById('new-memory-title').value;
                    const photoFile = document.getElementById('new-memory-photo').files[0];
                    const message = document.getElementById('new-memory-message').value;
                    const musicFile = document.getElementById('new-memory-music').files[0];
                    const orientation = document.getElementById('new-memory-orientation').value;
                    const frameColor = document.getElementById('new-memory-frame-color').value;
                    const cardColor = document.getElementById('new-memory-card-color').value;
                    const cardFont = document.getElementById('new-memory-card-font').value;
                    const cardTextColor = document.getElementById('new-memory-card-text-color').value;

                    if (!title) {
                      alert('Please enter a title');
                      return;
                    }

                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('message', message);
                    formData.append('orientation', orientation);
                    formData.append('frame_color', frameColor);
                    formData.append('card_color', cardColor);
                    formData.append('card_font', cardFont);
                    formData.append('card_text_color', cardTextColor);
                    if (photoFile) formData.append('photo', photoFile);
                    if (musicFile) formData.append('music', musicFile);

                    api.post('/memories/with-files', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    })
                      .then(response => {
                        setMemories([...memories, response.data]);
                        document.getElementById('new-memory-title').value = '';
                        document.getElementById('new-memory-photo').value = '';
                        document.getElementById('new-memory-message').value = '';
                        document.getElementById('new-memory-music').value = '';
                        document.getElementById('new-memory-orientation').value = 'portrait';
                        document.getElementById('new-memory-frame-color').value = '#8B4513';
                        document.getElementById('new-memory-card-color').value = '#fff5e6';
                        document.getElementById('new-memory-card-font').value = 'Arial';
                        document.getElementById('new-memory-card-text-color').value = '#333';
                        alert('Memory page created successfully! Ready for next one.');
                      })
                      .catch(error => {
                        console.error('Failed to create memory:', error);
                        alert('Failed to create memory: ' + (error.response?.data?.error || error.message));
                      });
                  }}>
                    Create & Add Another
                  </button>
                </div>
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
                    api.put('/media/music', {
                      title: music.title,
                      artist: music.artist,
                      enabled: music.enabled
                    })
                      .then(response => {
                        setMusic(response.data.music);
                        alert('Music configuration saved!');
                      })
                      .catch(error => {
                        console.error('Failed to save music:', error);
                        alert('Failed to save music');
                      });
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
                  <div className="upload-section">
                    <h3>Upload New Music</h3>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('title', music?.title || 'Belinda\'s Song');
                          api.post('/media/music', formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          })
                            .then(response => {
                              setMusic(response.data.music);
                              e.target.value = '';
                              alert('Music uploaded successfully!');
                            })
                            .catch(error => {
                              console.error('Failed to upload music:', error);
                              alert('Failed to upload music');
                            });
                        }
                      }}
                    />
                  </div>
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
              <button className="save-button" onClick={() => {
                // Save all videos
                videos.forEach(video => {
                  api.put(`/media/videos/${video.id}`, video)
                    .catch(error => console.error('Failed to save video:', error));
                });
                alert('Video memories saved!');
              }}>
                Save All Videos
              </button>
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
              <h2>Matching Game Configuration</h2>
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
                    <label>Hint</label>
                    <input
                      type="text"
                      value={puzzleConfig.hint}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, hint: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Matching Instruction</label>
                    <textarea
                      value={puzzleConfig.matching_instruction || 'Match the emojis to proceed to the next page.'}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, matching_instruction: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="form-group">
                    <label>Success Message</label>
                    <textarea
                      value={puzzleConfig.success_message}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, success_message: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="form-group">
                    <label>Completion Message</label>
                    <textarea
                      value={puzzleConfig.completion_message || 'You found the way in. ❤️'}
                      onChange={(e) => setPuzzleConfig({ ...puzzleConfig, completion_message: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <button className="save-button" onClick={() => {
                    api.put('/puzzle', puzzleConfig)
                      .then(() => alert('Puzzle configuration saved!'))
                      .catch(error => {
                        console.error('Failed to save puzzle:', error);
                        alert('Failed to save puzzle: ' + (error.response?.data?.error || error.message));
                      });
                  }}>
                    Save Puzzle Config
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'heartbeat' && (
            <div className="tab-content">
              <h2>Heartbeat Analysis Configuration</h2>
              <div className="form-section">
                <div className="form-group">
                  <label>Terminal Messages (one per line)</label>
                  <textarea
                    value={config?.heartbeat_messages || '> analyzing memories...\n> 10 photos found.\n> 1 beautiful girl found.\n> calculating how much she means to you...\n> ERROR\n> value exceeds measurable limits.\n> trying another method...\n> conclusion:\n> she\'s one of a kind.'}
                    onChange={(e) => handleConfigChange('heartbeat_messages', e.target.value)}
                    rows={10}
                  />
                  <small>Each line will be typed sequentially during the heartbeat analysis scene</small>
                </div>
                <button className="save-button" onClick={handleSaveConfig} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
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
                      .catch(error => {
                        console.error('Failed to save easter egg:', error);
                        alert('Failed to save Easter egg: ' + (error.response?.data?.error || error.message));
                      });
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

          {activeTab === 'scene-music' && (
            <div className="tab-content">
              <h2>Scene Music Configuration</h2>
              {config && (
                <div className="scene-music-config">
                  <div className="scene-music-section">
                    <h3>Initializing Scene</h3>
                    <div className="form-group">
                      <label>Music URL</label>
                      <input
                        type="text"
                        value={config.initializing_music_url || ''}
                        onChange={(e) => handleConfigChange('initializing_music_url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Volume</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.initializing_music_volume || 0.7}
                        onChange={(e) => handleConfigChange('initializing_music_volume', parseFloat(e.target.value))}
                      />
                      <span>{Math.round((config.initializing_music_volume || 0.7) * 100)}%</span>
                    </div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.initializing_music_loop !== false}
                        onChange={(e) => handleConfigChange('initializing_music_loop', e.target.checked)}
                      />
                      Loop
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.initializing_music_enabled || false}
                        onChange={(e) => handleConfigChange('initializing_music_enabled', e.target.checked)}
                      />
                      Enabled
                    </label>
                    <div className="upload-section">
                      <label>Upload Music</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            api.post('/config/initializing/music', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            })
                              .then(response => {
                                handleConfigChange('initializing_music_url', response.data.music_url);
                                e.target.value = '';
                                alert('Music uploaded successfully!');
                              })
                              .catch(error => {
                                console.error('Failed to upload music:', error);
                                alert('Failed to upload music: ' + (error.response?.data?.error || error.message));
                              });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="scene-music-section">
                    <h3>Birthday Scene</h3>
                    <div className="form-group">
                      <label>Music URL</label>
                      <input
                        type="text"
                        value={config.birthday_music_url || ''}
                        onChange={(e) => handleConfigChange('birthday_music_url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Volume</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.birthday_music_volume || 0.7}
                        onChange={(e) => handleConfigChange('birthday_music_volume', parseFloat(e.target.value))}
                      />
                      <span>{Math.round((config.birthday_music_volume || 0.7) * 100)}%</span>
                    </div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.birthday_music_loop !== false}
                        onChange={(e) => handleConfigChange('birthday_music_loop', e.target.checked)}
                      />
                      Loop
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.birthday_music_enabled || false}
                        onChange={(e) => handleConfigChange('birthday_music_enabled', e.target.checked)}
                      />
                      Enabled
                    </label>
                    <div className="upload-section">
                      <label>Upload Music</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            api.post('/config/birthday/music', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            })
                              .then(response => {
                                handleConfigChange('birthday_music_url', response.data.music_url);
                                e.target.value = '';
                                alert('Music uploaded successfully!');
                              })
                              .catch(error => {
                                console.error('Failed to upload music:', error);
                                alert('Failed to upload music: ' + (error.response?.data?.error || error.message));
                              });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="scene-music-section">
                    <h3>Puzzle Scene</h3>
                    <div className="form-group">
                      <label>Music URL</label>
                      <input
                        type="text"
                        value={config.puzzle_music_url || ''}
                        onChange={(e) => handleConfigChange('puzzle_music_url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Volume</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.puzzle_music_volume || 0.7}
                        onChange={(e) => handleConfigChange('puzzle_music_volume', parseFloat(e.target.value))}
                      />
                      <span>{Math.round((config.puzzle_music_volume || 0.7) * 100)}%</span>
                    </div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.puzzle_music_loop !== false}
                        onChange={(e) => handleConfigChange('puzzle_music_loop', e.target.checked)}
                      />
                      Loop
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.puzzle_music_enabled || false}
                        onChange={(e) => handleConfigChange('puzzle_music_enabled', e.target.checked)}
                      />
                      Enabled
                    </label>
                    <div className="upload-section">
                      <label>Upload Music</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            api.post('/config/puzzle/music', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            })
                              .then(response => {
                                handleConfigChange('puzzle_music_url', response.data.music_url);
                                e.target.value = '';
                                alert('Music uploaded successfully!');
                              })
                              .catch(error => {
                                console.error('Failed to upload music:', error);
                                alert('Failed to upload music: ' + (error.response?.data?.error || error.message));
                              });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="scene-music-section">
                    <h3>Memories Scene (Default)</h3>
                    <div className="form-group">
                      <label>Music URL</label>
                      <input
                        type="text"
                        value={config.memories_music_url || ''}
                        onChange={(e) => handleConfigChange('memories_music_url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Volume</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={config.memories_music_volume || 0.7}
                        onChange={(e) => handleConfigChange('memories_music_volume', parseFloat(e.target.value))}
                      />
                      <span>{Math.round((config.memories_music_volume || 0.7) * 100)}%</span>
                    </div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.memories_music_loop !== false}
                        onChange={(e) => handleConfigChange('memories_music_loop', e.target.checked)}
                      />
                      Loop
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={config.memories_music_enabled || false}
                        onChange={(e) => handleConfigChange('memories_music_enabled', e.target.checked)}
                      />
                      Enabled
                    </label>
                    <div className="upload-section">
                      <label>Upload Music</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            api.post('/config/memories/music', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            })
                              .then(response => {
                                handleConfigChange('memories_music_url', response.data.music_url);
                                e.target.value = '';
                                alert('Music uploaded successfully!');
                              })
                              .catch(error => {
                                console.error('Failed to upload music:', error);
                                alert('Failed to upload music: ' + (error.response?.data?.error || error.message));
                              });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <button className="save-button" onClick={handleSaveConfig} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Scene Music Configuration'}
                  </button>
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
