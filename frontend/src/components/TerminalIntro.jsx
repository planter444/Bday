import React, { useState, useEffect, useCallback } from 'react';
import './TerminalIntro.css';

const TerminalIntro = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const typeLine = useCallback(() => {
    const line = lines[currentLineIndex];
    setIsTyping(true);
    setCurrentText('');
    
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < line.text.length) {
        setCurrentText(prev => prev + line.text[charIndex]);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Update loading progress if this is a loading line
        if (line.text.includes('█')) {
          setLoadingProgress(100);
        }
        
        // Move to next line after delay
        setTimeout(() => {
          setLines(prev => [...prev, { ...line, completed: true }]);
          setCurrentLineIndex(prev => prev + 1);
          setCurrentText('');
        }, line.delay);
      }
    }, line.typing_speed);
  }, [currentLineIndex, lines]);

  useEffect(() => {
    fetchTerminalLines();
  }, []);

  useEffect(() => {
    if (lines.length > 0 && currentLineIndex < lines.length) {
      typeLine();
    }
  }, [currentLineIndex, lines, typeLine]);

  const fetchTerminalLines = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/terminal/lines`);
      const data = await response.json();
      setLines(data.filter(line => line.enabled));
    } catch (error) {
      console.error('Failed to fetch terminal lines:', error);
      // Simplified fallback lines - fewer, cooler
      setLines([
        { text: '> initializing birthday.exe...', delay: 500, typing_speed: 40, emoji: '' },
        { text: '> loading birthday magic...', delay: 500, typing_speed: 40, emoji: '' },
        { text: '> ████████████████████ 100%', delay: 500, typing_speed: 15, emoji: '' },
        { text: '> happy birthday, BELINDA ❤️', delay: 500, typing_speed: 40, emoji: '❤️' },
      ]);
    }
  };

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Trigger completion when all lines are done - wait 5 seconds for the loading screen
  useEffect(() => {
    if (currentLineIndex >= lines.length && lines.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 5000);
    }
  }, [currentLineIndex, lines.length, onComplete]);

  return (
    <div className="terminal-intro">
      <div className="terminal-screen">
        <div className="scanlines"></div>
        <div className="terminal-content">
          {lines.map((line, index) => (
            <div key={index} className={`terminal-line ${line.completed ? 'completed' : ''}`}>
              <span className="terminal-prompt">{line.text.startsWith('>') ? '> ' : ''}</span>
              <span className="terminal-text">{line.text.replace('> ', '')}</span>
              {line.emoji && <span className="terminal-emoji">{line.emoji}</span>}
            </div>
          ))}
          
          {isTyping && (
            <div className="terminal-line current">
              <span className="terminal-prompt">> </span>
              <span className="terminal-text">{currentText}</span>
              <span className={`cursor ${showCursor ? 'visible' : ''}`}>█</span>
            </div>
          )}
          
          {loadingProgress > 0 && loadingProgress < 100 && (
            <div className="loading-bar">
              <div 
                className="loading-progress" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalIntro;
