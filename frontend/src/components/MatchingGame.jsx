import React, { useState } from 'react';
import './MatchingGame.css';

const MatchingGame = ({ onComplete }) => {
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const topEmojis = [
    { id: 1, emoji: '🐵', name: 'monkey' },
    { id: 2, emoji: '🐱', name: 'cat' },
    { id: 3, emoji: '👧', name: 'girl' },
  ];

  const bottomEmojis = [
    { id: 1, emoji: '🍌', name: 'banana' },
    { id: 2, emoji: '🥛', name: 'milk' },
    { id: 3, emoji: '💍', name: 'ring' },
  ];

  const correctMatches = {
    'monkey': 'banana',
    'cat': 'milk',
    'girl': 'ring'
  };

  const handleTopClick = (emoji) => {
    setSelectedTop(emoji);
    setSelectedBottom(null);
  };

  const handleBottomClick = (emoji) => {
    if (!selectedTop) return;
    
    setSelectedBottom(emoji);
    
    if (correctMatches[selectedTop.name] === emoji.name) {
      setMatches([...matches, selectedTop.name]);
      setSelectedTop(null);
      setSelectedBottom(null);
      
      if (matches.length + 1 === 3) {
        setShowSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    } else {
      setTimeout(() => {
        setSelectedTop(null);
        setSelectedBottom(null);
      }, 1000);
    }
  };

  return (
    <div className="matching-game">
      <div className="game-container">
        <h2 className="game-title">Match me to unveil the next face</h2>
        
        <div className="emojis-row top-row">
          {topEmojis.map((emoji) => (
            <div
              key={emoji.id}
              className={`emoji-item ${selectedTop?.id === emoji.id ? 'selected' : ''} ${matches.includes(emoji.name) ? 'matched' : ''}`}
              onClick={() => !matches.includes(emoji.name) && handleTopClick(emoji)}
            >
              {emoji.emoji}
            </div>
          ))}
        </div>

        <div className="emojis-row bottom-row">
          {bottomEmojis.map((emoji) => (
            <div
              key={emoji.id}
              className={`emoji-item ${selectedBottom?.id === emoji.id ? 'selected' : ''} ${matches.includes(correctMatches[Object.keys(correctMatches).find(key => correctMatches[key] === emoji.name)]) ? 'matched' : ''}`}
              onClick={() => !matches.includes(correctMatches[Object.keys(correctMatches).find(key => correctMatches[key] === emoji.name)]) && handleBottomClick(emoji)}
            >
              {emoji.emoji}
            </div>
          ))}
        </div>

        {showSuccess && (
          <div className="success-screen">
            <h3>🎉 Perfect Match! 🎉</h3>
            <p>Happy Birthday, Belinda!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingGame;
