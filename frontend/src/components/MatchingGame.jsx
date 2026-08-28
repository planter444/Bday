import React, { useState, useEffect } from 'react';
import './MatchingGame.css';

const MatchingGame = ({ onComplete }) => {
  const [puzzleConfig, setPuzzleConfig] = useState(null);
  const [selectedTop, setSelectedTop] = useState(null);
  const [selectedBottom, setSelectedBottom] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongMatch, setWrongMatch] = useState(false);

  const topEmojis = [
    { id: 1, emoji: '🐒', name: 'monkey' },
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

  useEffect(() => {
    fetchPuzzleConfig();
  }, []);

  const fetchPuzzleConfig = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/puzzle`);
      const data = await response.json();
      setPuzzleConfig(data);
    } catch (error) {
      console.error('Failed to fetch puzzle config:', error);
      // Fallback
      setPuzzleConfig({
        matching_instruction: 'Match the emojis to proceed to the next page.',
        completion_message: 'You found the way in. ❤️'
      });
    }
  };

  const handleTopClick = (emoji) => {
    if (matches.includes(emoji.name)) return;
    setSelectedTop(emoji);
    setSelectedBottom(null);
    setWrongMatch(false);
  };

  const handleBottomClick = (emoji) => {
    if (!selectedTop) return;
    if (matches.includes(correctMatches[Object.keys(correctMatches).find(key => correctMatches[key] === emoji.name)])) return;
    
    setSelectedBottom(emoji);
    
    if (correctMatches[selectedTop.name] === emoji.name) {
      setMatches([...matches, selectedTop.name]);
      setSelectedTop(null);
      setSelectedBottom(null);
      
      if (matches.length + 1 === 3) {
        setShowSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } else {
      setWrongMatch(true);
      setTimeout(() => {
        setSelectedTop(null);
        setSelectedBottom(null);
        setWrongMatch(false);
      }, 500);
    }
  };

  return (
    <div className="matching-game">
      <div className="game-container">
        <h2 className="game-title">{puzzleConfig?.matching_instruction || 'Match the emojis to proceed to the next page.'}</h2>
        
        <div className="emojis-row top-row">
          {topEmojis.map((emoji) => (
            <div
              key={emoji.id}
              className={`emoji-item ${selectedTop?.id === emoji.id ? 'selected' : ''} ${matches.includes(emoji.name) ? 'matched' : ''} ${wrongMatch && selectedTop?.id === emoji.id ? 'wrong' : ''}`}
              onClick={() => handleTopClick(emoji)}
            >
              {emoji.emoji}
              {matches.includes(emoji.name) && <span className="match-check">✓</span>}
            </div>
          ))}
        </div>

        <div className="instruction-arrow">
          <div className="arrow-down">↓</div>
          <p className="instruction-text">choose their match</p>
          <div className="arrow-down">↓</div>
        </div>

        <div className="emojis-row bottom-row">
          {bottomEmojis.map((emoji) => (
            <div
              key={emoji.id}
              className={`emoji-item ${selectedBottom?.id === emoji.id ? 'selected' : ''} ${matches.includes(correctMatches[Object.keys(correctMatches).find(key => correctMatches[key] === emoji.name)]) ? 'matched' : ''} ${wrongMatch && selectedBottom?.id === emoji.id ? 'wrong' : ''}`}
              onClick={() => handleBottomClick(emoji)}
            >
              {emoji.emoji}
              {matches.includes(correctMatches[Object.keys(correctMatches).find(key => correctMatches[key] === emoji.name)]) && <span className="match-check">✓</span>}
            </div>
          ))}
        </div>

        {showSuccess && (
          <div className="success-screen">
            <h3>🎉 Congratulations! 🎉</h3>
            <p>{puzzleConfig?.completion_message || 'You found the way in. ❤️'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingGame;
