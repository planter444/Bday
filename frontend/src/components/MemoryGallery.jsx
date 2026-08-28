import React, { useState, useEffect, useRef } from 'react';
import './MemoryGallery.css';

const MemoryGallery = ({ onComplete }) => {
  const [memories, setMemories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [music, setMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchMemories();
    fetchMusic();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/media/memories`);
      const data = await response.json();
      setMemories(data.filter(memory => memory.enabled !== false));
    } catch (error) {
      console.error('Failed to fetch memories:', error);
      // Fallback test data
      setMemories([
        { id: 1, caption: 'Beautiful Memory 1', photo_url: 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Memory+1', enabled: true, message: 'This memory brings a smile to my face.' },
        { id: 2, caption: 'Wonderful Moment 2', photo_url: 'https://via.placeholder.com/400x300/7b2cbf/ffffff?text=Memory+2', enabled: true, message: 'Every moment with you is precious.' },
        { id: 3, caption: 'Precious Time 3', photo_url: 'https://via.placeholder.com/400x300/c44569/ffffff?text=Memory+3', enabled: true, message: 'You make every day special.' },
      ]);
    }
  };

  const fetchMusic = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/media/music`);
      const data = await response.json();
      if (data && data.enabled && data.audio_url) {
        setMusic(data);
      }
    } catch (error) {
      console.error('Failed to fetch music:', error);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (memories.length === 0) {
    return (
      <div className="memory-gallery">
        <div className="no-memories">
          <p>No memories yet...</p>
          <button onClick={onComplete} className="continue-button">Continue</button>
        </div>
      </div>
    );
  }

  const currentMemory = memories[currentIndex];

  return (
    <div className="memory-gallery">
      <div className="gallery-container">
        <h2 className="gallery-title">Memories</h2>
        
        <div className="memory-counter">
          {String(currentIndex + 1).padStart(2, '0')} / {String(memories.length).padStart(2, '0')}
        </div>

        {/* Music player */}
        {music && (
          <div className="music-player-mini">
            <button 
              className="music-toggle interactive-element"
              onClick={toggleMusic}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <audio 
              ref={audioRef}
              src={music.audio_url}
              loop
            />
          </div>
        )}

        <div className="table-setting">
          {/* Photo frame on table */}
          <div className="photo-frame">
            <img 
              src={currentMemory.photo_url} 
              alt={`Memory ${currentIndex + 1}`}
              loading="lazy"
              className="table-photo"
            />
            {currentMemory.caption && (
              <div className="photo-caption">{currentMemory.caption}</div>
            )}
          </div>

          {/* Birthday card beside photo */}
          <div className="birthday-card">
            <div className="card-front-text">
              <h3>Happy Birthday!</h3>
              <p className="card-message">{currentMemory.message || 'You are amazing!'}</p>
              {currentMemory.date && (
                <div className="memory-date">{currentMemory.date}</div>
              )}
            </div>
          </div>
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-button interactive-element"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ←
          </button>
          
          {currentIndex === memories.length - 1 ? (
            <button
              className="continue-cute-button interactive-element"
              onClick={onComplete}
            >
              🎬 Play Videos 🎬
            </button>
          ) : (
            <button
              className="nav-button interactive-element"
              onClick={handleNext}
            >
              →
            </button>
          )}
        </div>

        <p className="hint-text">
          Navigate through memories
        </p>
      </div>
    </div>
  );
};

export default MemoryGallery;
