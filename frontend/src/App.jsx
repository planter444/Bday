import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  
  const advanceScene = (nextPath) => {
    navigate(nextPath);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LoadingScreen onComplete={() => navigate('/initializing')} />} />
        <Route path="/initializing" element={<TerminalIntro onComplete={() => navigate('/birthday')} />} />
        <Route path="/birthday" element={<BirthdayRoom onComplete={() => navigate('/puzzle')} onSceneChange={advanceScene} />} />
        <Route path="/puzzle" element={<MatchingGame onComplete={() => navigate('/memories')} />} />
        <Route path="/memories" element={<MemoryGallery onComplete={() => navigate('/music')} />} />
        <Route path="/music" element={<MusicPlayer onComplete={() => navigate('/videos')} />} />
        <Route path="/videos" element={<VideoMemories onComplete={() => navigate('/letter')} />} />
        <Route path="/letter" element={<LoveLetter onComplete={() => navigate('/heartbeat')} />} />
        <Route path="/heartbeat" element={<HeartbeatAnalysis onComplete={() => navigate('/final')} />} />
        <Route path="/final" element={<FinalMessage />} />
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
