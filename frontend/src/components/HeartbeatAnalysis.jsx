import React, { useState, useEffect } from 'react';
import './HeartbeatAnalysis.css';

const HeartbeatAnalysis = ({ onComplete, config }) => {
  const [stage, setStage] = useState('darkening'); // darkening, heartbeat, terminal, photos, heart, final
  const [terminalLines, setTerminalLines] = useState([]);
  const [memories, setMemories] = useState([]);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('heartbeat');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage === 'heartbeat') {
      const timer = setTimeout(() => {
        setStage('terminal');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'terminal') {
      // Use heartbeat_messages from config or fallback
      const messageText = config?.heartbeat_messages || 
        '> analyzing memories...\n> 10 photos found.\n> 1 beautiful girl found.\n> calculating how much she means to you...\n> ERROR\n> value exceeds measurable limits.\n> trying another method...\n> conclusion:\n> she\'s one of a kind.';
      
      const lines = messageText.split('\n').map(line => ({
        text: line,
        delay: 1000
      }));

      let currentLine = 0;
      setTerminalLines([]);

      const showNextLine = () => {
        if (currentLine < lines.length) {
          setTerminalLines(prev => [...prev, lines[currentLine]]);
          currentLine++;
          setTimeout(showNextLine, lines[currentLine - 1].delay);
        } else {
          // After terminal sequence, fetch memories and show heart
          fetchMemories();
        }
      };

      showNextLine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, config]);

  const fetchMemories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/media/memories`);
      const data = await response.json();
      setMemories(data.filter(memory => memory.enabled && memory.photo_url));
      
      setTimeout(() => {
        setStage('photos');
        setTimeout(() => {
          setShowHeart(true);
          setTimeout(() => {
            setStage('final');
            setTimeout(() => {
              onComplete();
            }, 5000);
          }, 4000);
        }, 1000);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
      // Continue without photos
      setTimeout(() => {
        setShowHeart(true);
        setTimeout(() => {
          setStage('final');
          setTimeout(() => {
            onComplete();
          }, 5000);
        }, 4000);
      }, 1000);
    }
  };

  return (
    <div className="heartbeat-analysis">
      {stage === 'darkening' && (
        <div className="darkening-screen">
          <div className="fade-to-black"></div>
        </div>
      )}

      {stage === 'heartbeat' && (
        <div className="heartbeat-screen">
          <div className="heartbeat-text">ba-dum...</div>
          <div className="heartbeat-visual">
            <div className="heart-beat"></div>
          </div>
        </div>
      )}

      {stage === 'terminal' && (
        <div className="terminal-screen">
          <div className="terminal-content">
            {terminalLines.map((line, index) => (
              <div key={index} className="terminal-line">
                {line.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === 'photos' && (
        <div className="photos-screen">
          <div className="floating-photos">
            {memories.map((memory, index) => (
              <div
                key={memory.id}
                className={`photo-star ${showHeart ? 'in-heart' : ''}`}
                style={{
                  '--delay': `${index * 0.2}s`,
                  '--angle': `${(index / memories.length) * 360}deg`,
                  '--distance': `${150 + Math.random() * 100}px`
                }}
              >
                <img src={memory.photo_url} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          
          {showHeart && (
            <div className="heart-formation">
              <div className="heart-text">
                <h2>BELINDA</h2>
                <p className="heart-message">
                  "This is the closest I could get to showing you how I see you."
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {stage === 'final' && (
        <div className="final-screen">
          <div className="final-content">
            <h1 className="final-title">HAPPY BIRTHDAY, BELINDA ❤️</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeartbeatAnalysis;
