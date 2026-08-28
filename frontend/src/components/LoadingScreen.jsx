import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete, config }) => {
  const introText = config?.intro_text || 'Loading birthday magic...';
  
  console.log('LoadingScreen rendered, config:', config, 'introText:', introText);
  
  // Auto-advance after intro duration
  React.useEffect(() => {
    const duration = config?.intro_duration || 4000;
    console.log('LoadingScreen: Duration:', duration, 'Config:', config);
    
    const timer = setTimeout(() => {
      console.log('LoadingScreen: Calling onComplete');
      if (onComplete) onComplete();
    }, duration);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onComplete, config?.intro_duration]);

  // Force the text to be "Loading birthday magic..." 
  const displayText = introText === 'Welcome to your birthday experience!' ? 'Loading birthday magic...' : introText;

  console.log('LoadingScreen: displayText:', displayText);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-heart">❤️</div>
        <div className="loading-text">{displayText}</div>
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
