import React, { useState, useEffect } from 'react';
import './TerminalIntro.css';

const TerminalIntro = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const terminalLines = [
      { text: '> initializing birthday.exe...', delay: 800, typing_speed: 50 },
      { text: '> loading birthday magic...', delay: 800, typing_speed: 50 },
      { text: '> ████████████████████ 100%', delay: 1000, typing_speed: 20 },
      { text: '> happy birthday, BELINDA ❤️', delay: 1000, typing_speed: 50 },
    ];

    let lineIndex = 0;
    let charIndex = 0;
    const typedLines = [];

    const typeNextChar = () => {
      if (lineIndex < terminalLines.length) {
        const currentLine = terminalLines[lineIndex];
        
        if (charIndex === 0) {
          typedLines.push({ text: '', emoji: currentLine.text.includes('❤️') ? '❤️' : '' });
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
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 5000);
      }
    };

    typeNextChar();
  }, [onComplete]);

  return (
    <div className="terminal-intro">
      <div className="terminal-screen">
        <div className="scanlines"></div>
        <div className="terminal-content">
          {lines.map((line, index) => (
            <div key={index} className="terminal-line">
              <span className="terminal-text">{line.text}</span>
              {line.emoji && <span className="terminal-emoji">{line.emoji}</span>}
            </div>
          ))}
          {!isComplete && (
            <div className="terminal-line current">
              <span className="cursor">█</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TerminalIntro;
