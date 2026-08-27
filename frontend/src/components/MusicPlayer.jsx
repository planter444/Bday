import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ onComplete }) => {
  const [music, setMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchMusic();
  }, []);

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

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  if (!music) {
    return (
      <div className="music-player">
        <div className="no-music">
          <p>No music uploaded...</p>
          <button onClick={onComplete} className="continue-button">Continue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="music-player">
      <div className="player-container">
        <div className="vinyl-record">
          <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
            <div className="vinyl-center">
              <div className="vinyl-label"></div>
            </div>
          </div>
        </div>

        <div className="music-info">
          <h2 className="song-title">{music.title || "Belinda's Song"}</h2>
          {music.artist && <p className="artist-name">{music.artist}</p>}
        </div>

        <div className="equalizer">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`equalizer-bar ${isPlaying ? 'active' : ''}`}
              style={{
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          className={`play-button ${isPlaying ? 'playing' : ''} interactive-element`}
          onClick={togglePlay}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          className="continue-button interactive-element"
          onClick={onComplete}
        >
          Continue →
        </button>

        <audio
          ref={audioRef}
          src={music.audio_url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
