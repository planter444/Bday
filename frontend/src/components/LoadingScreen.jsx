import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete, config }) => {
  const introText = config?.intro_text || 'Loading birthday magic...';
  
  // Auto-advance after intro duration
  React.useEffect(() => {
    const duration = config?.intro_duration || 4000;
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onComplete, config?.intro_duration]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-heart">❤️</div>
        <div className="loading-text">{introText}</div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
