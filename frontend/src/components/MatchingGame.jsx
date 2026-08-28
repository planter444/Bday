import React, { useState, useEffect, useCallback } from 'react';
import './MatchingGame.css';

const MatchingGame = ({ onComplete }) => {
  const [puzzleConfig, setPuzzleConfig] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shuffledBottom, setShuffledBottom] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [wrongMatch, setWrongMatch] = useState(null);

  const topEmojis = [
    { id: 1, emoji: '🐵', name: 'monkey', type: 'top' },
    { id: 2, emoji: '🐱', name: 'cat', type: 'top' },
    { id: 3, emoji: '👧', name: 'girl', type: 'top' },
  ];

  const correctMatches = {
    'monkey': 'banana',
    'cat': 'milk',
    'girl': 'ring'
  };

  const shuffleBottom = useCallback(() => {
    const emojis = [
      { id: 1, emoji: '🍌', name: 'banana', type: 'bottom' },
      { id: 2, emoji: '🥛', name: 'milk', type: 'bottom' },
      { id: 3, emoji: '💍', name: 'ring', type: 'bottom' },
    ];
    
    // Shuffle until no correct match is directly below its pair
    let shuffled;
    let isValid = false;
    
    while (!isValid) {
      shuffled = [...emojis].sort(() => Math.random() - 0.5);
      
      // Check if any correct match is directly below
      isValid = true;
      for (let i = 0; i < topEmojis.length; i++) {
        const topEmoji = topEmojis[i];
        const bottomEmoji = shuffled[i];
        if (correctMatches[topEmoji.name] === bottomEmoji.name) {
          isValid = false;
          break;
        }
      }
    }
    
    setShuffledBottom(shuffled);
  }, []);

  useEffect(() => {
    fetchPuzzleConfig();
    shuffleBottom();
  }, [shuffleBottom]);

  const fetchPuzzleConfig = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/puzzle`);
      const data = await response.json();
      setPuzzleConfig(data);
    } catch (error) {
      console.error('Failed to fetch puzzle config:', error);
      setPuzzleConfig({
        matching_instruction: 'Match the emojis to proceed to the next page.',
        completion_message: 'You found the way in. ❤️'
      });
    }
  };

  const handlePointerDown = (e, item) => {
    e.preventDefault();
    if (matches.includes(item.name)) return;
    if (item.type === 'bottom') {
      const matchingKey = Object.keys(correctMatches).find(key => correctMatches[key] === item.name);
      if (matches.includes(matchingKey)) return;
    }

    setDraggedItem(item);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });

    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e) => {
    if (!draggedItem) return;
    e.preventDefault();
    setDragPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handlePointerUp = (e) => {
    if (!draggedItem) return;

    const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    const targetEmoji = dropTarget?.closest('.emoji-item');

    if (targetEmoji) {
      const targetId = parseInt(targetEmoji.dataset.id);
      const targetType = targetEmoji.dataset.type;

      const allEmojis = [...topEmojis, ...shuffledBottom];
      const targetItem = allEmojis.find(emoji => emoji.id === targetId && emoji.type === targetType);

      if (targetItem && targetItem !== draggedItem) {
        checkMatch(draggedItem, targetItem);
      }
    }

    setDraggedItem(null);
    setDragPosition({ x: 0, y: 0 });
  };

  const checkMatch = (item1, item2) => {
    let source, target;

    if (item1.type === 'top' && item2.type === 'bottom') {
      source = item1;
      target = item2;
    } else if (item1.type === 'bottom' && item2.type === 'top') {
      source = item2;
      target = item1;
    } else {
      return;
    }

    if (correctMatches[source.name] === target.name) {
      setMatches([...matches, source.name]);
      if (matches.length + 1 === 3) {
        setShowSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } else {
      setWrongMatch(source.id);
      setTimeout(() => setWrongMatch(null), 500);
    }
  };

  const isMatched = (item) => {
    if (item.type === 'top') {
      return matches.includes(item.name);
    } else {
      const matchingKey = Object.keys(correctMatches).find(key => correctMatches[key] === item.name);
      return matches.includes(matchingKey);
    }
  };

  return (
    <div className="matching-game" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div className="game-container">
        <h2 className="game-title">{puzzleConfig?.matching_instruction || 'Match the emojis to proceed to the next page.'}</h2>
        
        <div className="emojis-row top-row">
          {topEmojis.map((emoji) => (
            <div
              key={emoji.id}
              data-id={emoji.id}
              data-type={emoji.type}
              className={`emoji-item ${isMatched(emoji) ? 'matched' : ''} ${wrongMatch === emoji.id ? 'wrong' : ''}`}
              onPointerDown={(e) => handlePointerDown(e, emoji)}
              style={{ cursor: isMatched(emoji) ? 'not-allowed' : 'grab' }}
            >
              {!isMatched(emoji) && emoji.emoji}
            </div>
          ))}
        </div>

        <div className="instruction-arrow">
          <div className="arrow-down">↓</div>
          <p className="instruction-text">drag to match</p>
          <div className="arrow-down">↓</div>
        </div>

        <div className="emojis-row bottom-row">
          {shuffledBottom.map((emoji) => (
            <div
              key={emoji.id}
              data-id={emoji.id}
              data-type={emoji.type}
              className={`emoji-item ${isMatched(emoji) ? 'matched' : ''} ${wrongMatch === emoji.id ? 'wrong' : ''}`}
              onPointerDown={(e) => handlePointerDown(e, emoji)}
              style={{ cursor: isMatched(emoji) ? 'not-allowed' : 'grab' }}
            >
              {!isMatched(emoji) && emoji.emoji}
            </div>
          ))}
        </div>

        {draggedItem && (
          <div
            className="dragged-emoji"
            style={{
              left: dragPosition.x,
              top: dragPosition.y,
              transform: 'translate(-50%, -50%) scale(1.3)'
            }}
          >
            {draggedItem.emoji}
          </div>
        )}

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
