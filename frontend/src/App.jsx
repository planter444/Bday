import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import TerminalIntro from './components/TerminalIntro';
import MatchingGame from './components/MatchingGame';
import MemoryGallery from './components/MemoryGallery';
import MusicPlayer from './components/MusicPlayer';
import VideoMemories from './components/VideoMemories';
import LoveLetter from './components/LoveLetter';
import HeartbeatAnalysis from './components/HeartbeatAnalysis';
import FinalMessage from './components/FinalMessage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import './App.css';

// Wrapper component to handle navigation
const BirthdayExperienceWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/config`);
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Failed to fetch config:', error);
        setConfig({});
      }
    };
    fetchConfig();
  }, []);

  // If on root path, show loading screen
  if (location.pathname === '' || location.pathname === '/') {
    return <LoadingScreen 
      onComplete={() => navigate('initializing')} 
      config={config} 
    />;
  }

  return (
    <>
      <Routes>
        <Route path="initializing" element={<div style={{color: 'white', padding: '20px'}}>TEST: Initializing route matched</div>} />
        <Route path="birthday" element={<TerminalIntro onComplete={() => navigate('puzzle')} config={config} />} />
        <Route path="puzzle" element={<MatchingGame onComplete={() => navigate('memories')} />} />
        <Route path="memories" element={<MemoryGallery onComplete={() => navigate('music')} />} />
        <Route path="music" element={<MusicPlayer onComplete={() => navigate('videos')} />} />
        <Route path="videos" element={<VideoMemories onComplete={() => navigate('letter')} />} />
        <Route path="letter" element={<LoveLetter onComplete={() => navigate('heartbeat')} />} />
        <Route path="heartbeat" element={<HeartbeatAnalysis onComplete={() => navigate('final')} config={config} />} />
        <Route path="final" element={<FinalMessage config={config} />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public birthday experience */}
          <Route path="/birthday/*" element={<BirthdayExperienceWrapper />} />
          <Route path="/" element={<Navigate to="/birthday" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Catch all - redirect to birthday experience */}
          <Route path="*" element={<Navigate to="/birthday" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
