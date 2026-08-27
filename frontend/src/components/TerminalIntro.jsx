import React, { useState, useEffect } from 'react';
import './TerminalIntro.css';

const TerminalIntro = ({ onComplete, config }) => {
  const [stage, setStage] = useState('loading'); // loading, typing, birthday, fireworks, complete
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);

  const transitionDelay = config?.intro_transition_delay || 4; // Default 4 seconds, configurable

  useEffect(() => {
    // Stage 1: Loading screen with heart and dots (5 seconds)
    const loadingTimer = setTimeout(() => {
      setStage('typing');
      startTyping();
    }, 5000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const startTyping = () => {
    const terminalLines = [
      { text: '> initializing birthday.exe...', delay: 800, typing_speed: 50 },
      { text: '> loading birthday magic...', delay: 800, typing_speed: 50 },
    ];

    let lineIndex = 0;
    let charIndex = 0;
    const typedLines = [];

    const typeNextChar = () => {
      if (lineIndex < terminalLines.length) {
        const currentLine = terminalLines[lineIndex];
        
        if (charIndex === 0) {
          typedLines.push({ text: '' });
          setLines([...typedLines]);
        }

        if (charIndex < currentLine.text.length) {
          typedLines[lineIndex].text += currentLine.text[charIndex];
          charIndex++;
          setLines([...typedLines]);
          setTimeout(typeNextChar, currentLine.typing_speed);
        } else {
          charIndex = 0;
          lineIndex++;
          setTimeout(typeNextChar, currentLine.delay);
        }
      } else {
        // Start progress bar
        setStage('progress');
        animateProgress();
      }
    };

    typeNextChar();
  };

  const animateProgress = () => {
    let currentProgress = 0;
    const duration = 2000; // 2 seconds
    const interval = 20;
    const increment = 100 / (duration / interval);

    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        setStage('birthday');
        setTimeout(() => {
          setShowFireworks(true);
          setTimeout(() => {
            setStage('complete');
            setTimeout(() => {
              onComplete();
            }, transitionDelay * 1000);
          }, 2000);
        }, 500);
      }
      setProgress(currentProgress);
    }, interval);
  };

  return (
    <div className="terminal-intro">
      <div className="terminal-screen">
        <div className="scanlines"></div>
        
        {stage === 'loading' && (
          <div className="loading-screen">
            <div className="heart-emoji">❤️</div>
            <div className="loading-text">birthday magic loading</div>
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}

        {(stage === 'typing' || stage === 'progress') && (
          <div className="terminal-content">
            {lines.map((line, index) => (
              <div key={index} className="terminal-line">
                <span className="terminal-text">{line.text}</span>
              </div>
            ))}
            {stage === 'typing' && (
              <div className="terminal-line current">
                <span className="cursor">█</span>
              </div>
            )}
            {stage === 'progress' && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="progress-text">{Math.round(progress)}%</div>
              </div>
            )}
          </div>
        )}

        {stage === 'birthday' && (
          <div className="birthday-screen">
            <h1 className="birthday-message">Happy Birthday, BELINDA! 🎂</h1>
            {showFireworks && <div className="fireworks">🎆 🎇 ✨ 🎆 🎇 ✨</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalIntro;
