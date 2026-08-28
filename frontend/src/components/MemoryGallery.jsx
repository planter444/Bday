import React, { useState, useEffect, useRef } from 'react';
import './MemoryGallery.css';

const MemoryGallery = ({ onComplete }) => {
  const [memories, setMemories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/memories`);
      const data = await response.json();
      setMemories(data.filter(memory => memory.enabled !== false));
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < memories.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setIsFlipped(false);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        x: (x - 0.5) * 20,
        y: (y - 0.5) * -20
      });
    }
  };

  const handleTouchMove = (e) => {
    if (cardRef.current && e.touches[0]) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.touches[0].clientX - rect.left) / rect.width;
      const y = (e.touches[0].clientY - rect.top) / rect.height;
      setTilt({
        x: (x - 0.5) * 20,
        y: (y - 0.5) * -20
      });
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
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

        <div 
          className="card-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        >
          <div
            ref={cardRef}
            className={`memory-card ${isFlipped ? 'flipped' : ''}`}
            onClick={handleCardClick}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
            }}
          >
            <div className="card-front">
              <img 
                src={currentMemory.photo_url} 
                alt={`Memory ${currentIndex + 1}`}
                loading="lazy"
              />
              {currentMemory.title && (
                <div className="photo-caption">{currentMemory.title}</div>
              )}
            </div>
            
            <div className="card-back">
              <div className="message-content">
                <p className="message-text">{currentMemory.message || ''}</p>
              </div>
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
          
          <button
            className="nav-button interactive-element"
            onClick={handleNext}
          >
            {currentIndex === memories.length - 1 ? 'Finish →' : '→'}
          </button>
        </div>

        <p className="hint-text">
          {isFlipped ? "Tap to flip back" : "Tap to flip • Swipe to navigate"}
        </p>
      </div>
    </div>
  );
};

export default MemoryGallery;
