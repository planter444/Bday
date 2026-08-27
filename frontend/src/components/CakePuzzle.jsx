import React, { useState, useEffect } from 'react';
import './CakePuzzle.css';

const CakePuzzle = ({ onComplete }) => {
  const [candles, setCandles] = useState([]);
  const [revealedLetters, setRevealedLetters] = useState([]);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchPuzzleConfig();
  }, []);

  const fetchPuzzleConfig = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/puzzle`);
      const data = await response.json();
      setConfig(data);
      
      // Initialize candles
      const candleCount = data.num_candles || 7;
      const letters = (data.puzzle_letters || 'BELINDA').split('');
      setCandles(
        Array.from({ length: candleCount }, (_, i) => ({
          id: i,
          letter: letters[i] || '',
          revealed: false,
          glowing: false
        }))
      );
    } catch (error) {
      console.error('Failed to fetch puzzle config:', error);
      // Fallback with emojis
      setConfig({
        hint: "Click the candles to reveal the secret",
        success_message: "Happy Birthday, Belinda! 🎉"
      });
      
      setCandles(
        Array.from({ length: 7 }, (_, i) => ({
          id: i,
          letter: 'BELINDA'[i] || '',
          revealed: false,
          glowing: false
        }))
      );
    }
  };

  const handleCandleClick = (index) => {
    if (puzzleComplete) return;

    setCandles(prev => {
      const newCandles = [...prev];
      newCandles[index] = {
        ...newCandles[index],
        revealed: true,
        glowing: true
      };
      return newCandles;
    });

    // Remove glow after animation
    setTimeout(() => {
      setCandles(prev => {
        const newCandles = [...prev];
        newCandles[index] = {
          ...newCandles[index],
          glowing: false
        };
        return newCandles;
      });
    }, 500);

    // Add revealed letter
    setRevealedLetters(prev => [...prev, candles[index].letter]);
  };

  useEffect(() => {
    if (revealedLetters.length === candles.length && candles.length > 0) {
      setPuzzleComplete(true);
      setCelebrating(true);
      
      // Trigger confetti after short delay
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [revealedLetters.length, candles.length, onComplete]);

  return (
    <div className="cake-puzzle">
      {celebrating && <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: ['#ff6b9d', '#c44569', '#7b2cbf', '#ff8fab', '#ffd700'][Math.floor(Math.random() * 5)]
            }}
          />
        ))}
      </div>}

      <div className="puzzle-container">
        <h2 className="puzzle-title">
          {config?.hint || "There might be something hidden here… 👀"}
        </h2>

        <div className="puzzle-cake">
          <div className="cake-base-puzzle">
            <div className="cake-layer-puzzle"></div>
            <div className="cake-layer-puzzle middle"></div>
            <div className="cake-layer-puzzle top"></div>
          </div>

          <div className="candles-puzzle">
            {candles.map((candle, index) => (
              <div
                key={candle.id}
                className={`candle-puzzle ${candle.revealed ? 'revealed' : ''} ${candle.glowing ? 'glowing' : ''}`}
                onClick={() => handleCandleClick(index)}
              >
                <div className="flame-puzzle"></div>
                {candle.revealed && (
                  <div className="revealed-letter">{candle.letter}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="revealed-letters">
          {revealedLetters.map((letter, index) => (
            <span key={index} className="letter-display">
              {letter}
            </span>
          ))}
          {revealedLetters.length < candles.length && (
            <span className="letter-placeholder">_</span>
          )}
        </div>

        {puzzleComplete && (
          <div className="success-message">
            <h3>🎉 YOU FOUND IT! 🎉</h3>
            <p>{config?.success_message || "Happy Birthday, Belinda!"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CakePuzzle;
