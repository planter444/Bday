import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import TerminalIntro from './components/TerminalIntro';
import BirthdayRoom from './components/BirthdayRoom';
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
  const [config, setConfig] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      console.log('Fetching config...');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/config`);
      const data = await response.json();
      console.log('Config fetched:', data);
      setConfig(data);
      setConfigLoaded(true);
    } catch (error) {
      console.error('Failed to fetch config:', error);
      setConfig({});
      setConfigLoaded(true);
    }
  };

  const advanceScene = (nextPath) => {
    console.log('Advancing to:', nextPath);
    navigate(nextPath);
  };

  // If on root path, show loading screen
  if (location.pathname === '/' || location.pathname === '/birthday' || location.pathname === '/birthday/') {
    console.log('Showing loading screen for path:', location.pathname);
    return <LoadingScreen 
      onComplete={() => {
        console.log('LoadingScreen complete, navigating to /birthday/initializing');
        navigate('/birthday/initializing');
      }} 
      config={config} 
    />;
  }

  return (
    <>
      <Routes>
        <Route path="/birthday/initializing" element={<TerminalIntro onComplete={() => navigate('/birthday/birthday')} config={config} />} />
        <Route path="/birthday/birthday" element={<BirthdayRoom onComplete={() => navigate('/birthday/puzzle')} onSceneChange={advanceScene} config={config} />} />
        <Route path="/birthday/puzzle" element={<MatchingGame onComplete={() => navigate('/birthday/memories')} />} />
        <Route path="/birthday/memories" element={<MemoryGallery onComplete={() => navigate('/birthday/music')} />} />
        <Route path="/birthday/music" element={<MusicPlayer onComplete={() => navigate('/birthday/videos')} />} />
        <Route path="/birthday/videos" element={<VideoMemories onComplete={() => navigate('/birthday/letter')} />} />
        <Route path="/birthday/letter" element={<LoveLetter onComplete={() => navigate('/birthday/heartbeat')} />} />
        <Route path="/birthday/heartbeat" element={<HeartbeatAnalysis onComplete={() => navigate('/birthday/final')} config={config} />} />
        <Route path="/birthday/final" element={<FinalMessage config={config} />} />
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
          <Route path="/" element={<Navigate to="/birthday/" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Catch all - redirect to birthday experience */}
          <Route path="*" element={<Navigate to="/birthday/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
