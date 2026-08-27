import React, { useState, useEffect } from 'react';
import './FinalMessage.css';

const FinalMessage = ({ config }) => {
  const [showFloatingHearts, setShowFloatingHearts] = useState(true);

  useEffect(() => {
    // Create floating hearts
    const interval = setInterval(() => {
      // Hearts are created via CSS animation
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="final-message">
      {showFloatingHearts && (
        <div className="floating-hearts-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-heart"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 3}s`,
                fontSize: `${1 + Math.random()}rem`
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}

      <div className="final-content">
        <h1 className="final-title">
          HAPPY BIRTHDAY,<br />
          {config?.belinda_name || 'BELINDA'} ❤️
        </h1>

        <div className="final-message-content">
          {config?.final_message ? (
            config.final_message.split('\n').map((paragraph, index) => (
              <p key={index} className="message-paragraph">
                {paragraph}
              </p>
            ))
          ) : (
            <>
              <p className="message-paragraph">
                I hope this little digital universe made your day a little more special.
              </p>
              <p className="message-paragraph">
                You deserve all the happiness in the world, today and every day.
              </p>
              <p className="message-paragraph">
                Thank you for being you—for being beautiful, kind, and absolutely amazing.
              </p>
              <p className="message-paragraph">
                I love you more than words can say.
              </p>
              <p className="message-paragraph signature">
                With all my love, ❤️
              </p>
            </>
          )}
        </div>

        <div className="heart-animation">
          <div className="large-heart">❤️</div>
        </div>
      </div>
    </div>
  );
};

export default FinalMessage;
