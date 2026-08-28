import React, { useState, useEffect } from 'react';
import './VideoMemories.css';

const VideoMemories = ({ onComplete }) => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/media/videos`);
      const data = await response.json();
      setVideos(data.filter(video => video.enabled));
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      // Fallback test data
      setVideos([
        { id: 1, title: 'Video Memory 1', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', enabled: true },
        { id: 2, title: 'Video Memory 2', video_url: 'https://www.w3schools.com/html/movie.mp4', enabled: true },
      ]);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
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

  if (videos.length === 0) {
    return (
      <div className="video-memories">
        <div className="no-videos">
          <p>No video memories...</p>
          <button onClick={onComplete} className="continue-button">Continue</button>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div className="video-memories">
      <div className="video-container">
        <h2 className="video-title">Video Memories</h2>
        
        <div className="video-counter">
          {String(currentIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
        </div>

        <div className="video-wrapper">
          <video
            key={currentVideo.id}
            src={currentVideo.video_url}
            controls
            playsInline
            className="video-player"
            poster=""
          />
          {currentVideo.caption && (
            <div className="video-caption">{currentVideo.caption}</div>
          )}
        </div>

        <div className="navigation-buttons">
          <button
            className="nav-button interactive-element"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ←
          </button>
          
          <button
            className="nav-button interactive-element"
            onClick={handleNext}
          >
            {currentIndex === videos.length - 1 ? 'Finish →' : '→'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoMemories;
