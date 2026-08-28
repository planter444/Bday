import React, { useState, useEffect } from 'react';
import './LoveLetter.css';

const LoveLetter = ({ onComplete }) => {
  const [config, setConfig] = useState(null);
  const [stage, setStage] = useState('intro'); // intro, envelope, letter
  const [letterVisible, setLetterVisible] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/config`);
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch config:', error);
      // Fallback config
      setConfig({
        love_letter_title: 'My Dearest Belinda',
        love_letter_message: 'You are the most beautiful person I know. Every moment with you is a treasure. Happy Birthday!'
      });
    }
  };

  const handleEnvelopeClick = () => {
    setStage('letter');
    setTimeout(() => {
      setLetterVisible(true);
    }, 500);
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="love-letter">
      <div className="letter-container">
        {stage === 'intro' && (
          <div className="intro-stage">
            <p className="intro-text fade-in">Okay… enough showing off your beauty.</p>
            <p className="intro-text fade-in" style={{ animationDelay: '1.5s' }}>
              There's something I actually wanted to tell you.
            </p>
            <button
              className="continue-button interactive-element fade-in"
              style={{ animationDelay: '3s' }}
              onClick={() => setStage('envelope')}
            >
              Continue →
            </button>
          </div>
        )}

        {stage === 'envelope' && (
          <div className="envelope-stage">
            <div className="envelope-container">
              <div 
                className={`envelope ${letterVisible ? 'open' : ''}`}
                onClick={handleEnvelopeClick}
              >
                <div className="envelope-flap"></div>
                <div className="envelope-body">
                  <div className="envelope-pocket"></div>
                </div>
                <div className="envelope-seal">❤️</div>
              </div>
            </div>
            <p className="hint-text">Tap to open</p>
          </div>
        )}

        {stage === 'letter' && (
          <div className="letter-stage">
            <div className={`letter-paper ${letterVisible ? 'visible' : ''}`}>
              <div className="letter-content">
                <h2 className="letter-title">
                  {config?.letter_title || 'My Dearest Belinda,'}
                </h2>
                <div className="letter-body">
                  {config?.letter ? (
                    config.letter.split('\n').map((paragraph, index) => (
                      <p key={index} className="letter-paragraph">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <>
                      <p className="letter-paragraph">
                        On this special day, I wanted to create something that captures just a fraction of how much you mean to me.
                      </p>
                      <p className="letter-paragraph">
                        Every memory we've shared, every moment we've spent together—they're all treasures I hold close to my heart.
                      </p>
                      <p className="letter-paragraph">
                        You bring light into my life in ways I never thought possible. Your smile, your laugh, your kindness—they make every day brighter.
                      </p>
                      <p className="letter-paragraph">
                        I wanted this birthday to be as special as you are to me.
                      </p>
                      <p className="letter-paragraph">
                        Happy Birthday, my love. ❤️
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              className="continue-button interactive-element"
              onClick={handleContinue}
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoveLetter;
