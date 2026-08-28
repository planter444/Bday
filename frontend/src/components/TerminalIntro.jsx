import React, { useState, useEffect, useCallback } from 'react';
import './TerminalIntro.css';

const terminalLines = [
  { text: '> initializing birthday.exe...', delay: 500, typing_speed: 50 },
  { text: '> identifying user...', delay: 500, typing_speed: 50 },
  { text: '> BELINDA', delay: 500, typing_speed: 50 },
  { text: '> today is your birthday 🎂', delay: 500, typing_speed: 50 },
  { text: '> loading... but the magic...', delay: 300, typing_speed: 50, showProgress: true },
];

const TerminalIntro = ({ onComplete, config }) => {
  const [lines, setLines] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const animateProgress = useCallback(() => {
    let currentProgress = 0;
    const duration = 1000; // Faster: 1 second instead of 3
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
        
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 1000); // Faster: 1 second instead of 4*transitionDelay
        }, 1000); // Faster: 1 second instead of 4
      }
      setProgress(currentProgress);
    }, interval);
  }, [onComplete]);

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
          
          if (currentLine.showProgress) {
            setShowProgress(true);
            setTimeout(() => {
              animateProgress();
            }, currentLine.delay);
          } else {
            lineIndex++;
            if (lineIndex < sequenceLines.length) {
              setTimeout(typeNextChar, currentLine.delay);
            }
          }
        }
      }
    };

    typeNextChar();
  }, [animateProgress]);

  useEffect(() => {
    runTerminalSequence(terminalLines);
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
          
          {lines.length === 0 && (
            <div className="terminal-line">
              <span className="terminal-text">> initializing...</span>
            </div>
          )}
          
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
