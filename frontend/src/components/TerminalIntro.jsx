import React, { useState, useEffect, useCallback } from 'react';
import './TerminalIntro.css';

const TerminalIntro = ({ onComplete, config }) => {
  const [lines, setLines] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const transitionDelay = config?.intro_transition_delay || 4;

  const terminalLines = [
    { text: '> initializing birthday.exe...', delay: 800, typing_speed: 50 },
    { text: '> identifying user...', delay: 800, typing_speed: 50 },
    { text: '> BELINDA', delay: 800, typing_speed: 50 },
    { text: '> today is your birthday 🎂', delay: 800, typing_speed: 50 },
    { text: '> loading... but the magic...', delay: 500, typing_speed: 50, showProgress: true },
  ];

  const animateProgress = useCallback(() => {
    let currentProgress = 0;
    const duration = 3000; // 3 seconds
    const interval = 30;
    const increment = 100 / (duration / interval);

    const progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        setProgress(100);
        setShowProgress(false);
        setShowSpinner(true);
        
        // Show spinner for 4 seconds
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, transitionDelay * 1000);
        }, 4000);
      }
      setProgress(currentProgress);
    }, interval);
  }, [transitionDelay, onComplete]);

  const runTerminalSequence = useCallback((sequenceLines) => {
    let lineIndex = 0;
    let charIndex = 0;
    const typedLines = [];

    const typeNextChar = () => {
      if (lineIndex < sequenceLines.length) {
        const currentLine = sequenceLines[lineIndex];
        
        if (charIndex === 0) {
          typedLines.push({ text: '', showProgress: currentLine.showProgress });
          setLines([...typedLines]);
        }

        if (charIndex < currentLine.text.length) {
          typedLines[lineIndex].text += currentLine.text[charIndex];
          charIndex++;
          setLines([...typedLines]);
          setTimeout(typeNextChar, currentLine.typing_speed);
        } else {
          charIndex = 0;
          
          // Check if this line should show progress bar
          if (currentLine.showProgress) {
            setShowProgress(true);
            setTimeout(() => {
              animateProgress();
            }, currentLine.delay);
          } else {
            lineIndex++;
            setTimeout(typeNextChar, currentLine.delay);
          }
        }
      }
    };

    typeNextChar();
  }, [animateProgress]);

  useEffect(() => {
    const fetchTerminalLines = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/terminal/lines`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Use lines from database
          const dbLines = data.filter(line => line.enabled).map(line => ({
            text: line.text,
            delay: line.delay || 800,
            typing_speed: line.typing_speed || 50,
            showProgress: line.show_progress || false
          }));
          runTerminalSequence(dbLines);
        } else {
          // Fallback to hardcoded lines
          runTerminalSequence(terminalLines);
        }
      } catch (error) {
        console.error('Failed to fetch terminal lines:', error);
        // Fallback to hardcoded lines
        runTerminalSequence(terminalLines);
      }
    };

    fetchTerminalLines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runTerminalSequence]);

  return (
    <div className="terminal-intro">
      <div className="terminal-screen">
        <div className="scanlines"></div>
        <div className="terminal-content">
          {lines.map((line, index) => (
            <div key={index} className="terminal-line">
              <span className="terminal-text">{line.text}</span>
              {line.showProgress && showProgress && (
                <div className="progress-section">
                  <div className="progress-bar-terminal">
                    <div className="progress-fill-terminal" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="progress-text-terminal">{Math.round(progress)}%</span>
                </div>
              )}
            </div>
          ))}
          
          {!isComplete && (
            <div className="terminal-line current">
              <span className="cursor">█</span>
            </div>
          )}

          {showSpinner && (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalIntro;
