import React, { useState, useEffect, useRef } from 'react';
import './BirthdayRoom.css';

const BirthdayRoom = ({ config, onComplete, onSceneChange }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggConfig, setEasterEggConfig] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchEasterEggConfig();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    const handleTouchMove = (e) => {
      if (containerRef.current && e.touches[0]) {
        const rect = containerRef.current.getBoundingClientRect();
        setTouchPosition({
          x: (e.touches[0].clientX - rect.left) / rect.width,
          y: (e.touches[0].clientY - rect.top) / rect.height
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  const fetchEasterEggConfig = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/easter-egg`);
      const data = await response.json();
      setEasterEggConfig(data);
    } catch (error) {
      console.error('Failed to fetch easter egg config:', error);
    }
  };

  const handleEasterEggStarClick = () => {
    if (!easterEggConfig?.enabled) return;
    setShowEasterEgg(true);
  };

  const position = { ...mousePosition, ...touchPosition };

  return (
    <div className="birthday-room" ref={containerRef}>
      <div className="room-background">
        <div className="stars">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `translate(${position.x * 20 - 10}px, ${position.y * 20 - 10}px)`
              }}
            />
          ))}
        </div>
        
        <div className="gradient-overlay"></div>
      </div>

      <div className="room-content">
        <div className="floating-hearts">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="floating-heart"
              style={{
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        <div className="birthday-title">
          <h1 
            className="main-title"
            style={{
              transform: `perspective(1000px) rotateY(${position.x * 5 - 2.5}deg) rotateX(${position.y * -5 + 2.5}deg)`
            }}
          >
            HAPPY BIRTHDAY
          </h1>
          <h2 
            className="name-title"
            style={{
              transform: `perspective(1000px) rotateY(${position.x * 3 - 1.5}deg) rotateX(${position.y * -3 + 1.5}deg)`
            }}
          >
            {config?.belinda_name || 'BELINDA'}
          </h2>
        </div>

        <div className="cake-container">
          <div className="cake">
            <div className="cake-base">
              <div className="cake-layer"></div>
              <div className="cake-layer middle"></div>
              <div className="cake-layer top"></div>
            </div>
            <div className="candles">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="candle">
                  <div className="flame"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hint-container">
          <p className="cake-hint">👀 There might be something hidden here.</p>
        </div>

        <div className="balloons">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="balloon"
              style={{
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
                transform: `translateY(${Math.sin(Date.now() / 1000 + i) * 10}px) translateX(${position.x * 15 - 7.5}px)`
              }}
            >
              <div className="balloon-string"></div>
            </div>
          ))}
          
          {/* Secret Easter Egg Star */}
          {easterEggConfig?.enabled && (
            <div
              className="easter-egg-star interactive-element"
              onClick={handleEasterEggStarClick}
              style={{
                position: 'absolute',
                left: '5%',
                top: '20%',
                transform: `translate(${position.x * 10 - 5}px, ${position.y * 10 - 5}px)`
              }}
            >
              ⭐
            </div>
          )}
        </div>

        <button 
          className="continue-button interactive-element"
          onClick={() => onSceneChange('matchingGame')}
        >
          {config?.continue_button_text || 'CONTINUE'}
        </button>
      </div>

      {showEasterEgg && (
        <div className="easter-egg-popup">
          <div className="easter-egg-content">
            <div className="easter-egg-icon">❤️</div>
            <h3>Secret Found!</h3>
            <p>{easterEggConfig?.secret_message || 'You found the secret! I love you more than words can say. ❤️'}</p>
            <button 
              className="close-easter-egg interactive-element"
              onClick={() => setShowEasterEgg(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayRoom;
