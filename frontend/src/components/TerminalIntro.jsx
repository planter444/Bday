import React from 'react';
import './TerminalIntro.css';

const TerminalIntro = ({ onComplete, config }) => {
  return (
    <div className="terminal-intro" style={{ color: '#0f0', fontSize: '24px', padding: '20px' }}>
      TEST - TerminalIntro is rendering
      <br />
      Path: /birthday/initializing
      <br />
      Config: {JSON.stringify(config)}
      <br />
      <button onClick={onComplete} style={{ marginTop: '20px', padding: '10px' }}>
        Continue to Birthday
      </button>
    </div>
  );
};

export default TerminalIntro;
