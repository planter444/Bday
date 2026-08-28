import React, { useState, useEffect } from 'react';
import TerminalIntro from '../components/TerminalIntro';
import BirthdayRoom from '../components/BirthdayRoom';
import CakePuzzle from '../components/CakePuzzle';
import MatchingGame from '../components/MatchingGame';
import MemoryGallery from '../components/MemoryGallery';
import MusicPlayer from '../components/MusicPlayer';
import VideoMemories from '../components/VideoMemories';
import LoveLetter from '../components/LoveLetter';
import HeartbeatAnalysis from '../components/HeartbeatAnalysis';
import FinalMessage from '../components/FinalMessage';
import LoadingScreen from '../components/LoadingScreen';
import '../components/BirthdayExperience.css';

const BirthdayExperience = () => {
  const [currentScene, setCurrentScene] = useState('terminal');
  const [config, setConfig] = useState(null);
  const [sceneSettings, setSceneSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
    fetchSceneSettings();
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      const sceneOrder = [
        'terminal',
        'birthdayRoom',
        'matchingGame',
        'memoryGallery',
        'musicPlayer',
        'videoMemories',
        'loveLetter',
        'heartbeatAnalysis',
        'finalMessage'
      ];
      
      const currentIndex = sceneOrder.indexOf(currentScene);
      if (currentIndex > 0) {
        setCurrentScene(sceneOrder[currentIndex - 1]);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentScene]);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/config`);
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch config:', error);
      setConfig({}); // Set empty config to allow page to load
    }
  };

  const fetchSceneSettings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/scenes`);
      const data = await response.json();
      setSceneSettings(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch scene settings:', error);
      setSceneSettings({
        terminal: true,
        birthdayRoom: true,
        cake: true,
        photoMemories: true,
        music: true,
        videoMemories: true,
        loveLetter: true,
        heartbeatAnalysis: true,
        finalScene: true
      }); // Default to all enabled
      setLoading(false);
    }
  };

  const advanceScene = () => {
    const sceneOrder = [
      'terminal',
      'birthdayRoom',
      'matchingGame',
      'memoryGallery',
      'musicPlayer',
      'videoMemories',
      'loveLetter',
      'heartbeatAnalysis',
      'finalMessage'
    ];

    const currentIndex = sceneOrder.indexOf(currentScene);
    if (currentIndex < sceneOrder.length - 1) {
      const nextScene = sceneOrder[currentIndex + 1];
      
      // Skip disabled scenes
      if (sceneSettings && !sceneSettings[nextScene]) {
        setCurrentScene(nextScene);
        setTimeout(() => advanceScene(), 100);
      } else {
        setCurrentScene(nextScene);
      }
    }
  };

  const goToScene = (sceneName) => {
    setCurrentScene(sceneName);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="birthday-experience">
      {currentScene === 'terminal' && sceneSettings?.terminal && (
        <TerminalIntro onComplete={advanceScene} config={config} />
      )}
      
      {currentScene === 'birthdayRoom' && sceneSettings?.birthdayRoom && (
        <BirthdayRoom 
          config={config}
          onComplete={advanceScene}
          onSceneChange={goToScene}
        />
      )}
      
      {currentScene === 'cakePuzzle' && sceneSettings?.cake && (
        <CakePuzzle onComplete={advanceScene} />
      )}
      
      {currentScene === 'matchingGame' && sceneSettings?.matchingGame && (
        <MatchingGame onComplete={advanceScene} />
      )}
      
      {currentScene === 'memoryGallery' && sceneSettings?.photoMemories && (
        <MemoryGallery onComplete={advanceScene} />
      )}
      
      {currentScene === 'musicPlayer' && sceneSettings?.music && (
        <MusicPlayer onComplete={advanceScene} />
      )}
      
      {currentScene === 'videoMemories' && sceneSettings?.videoMemories && (
        <VideoMemories onComplete={advanceScene} />
      )}
      
      {currentScene === 'loveLetter' && sceneSettings?.loveLetter && (
        <LoveLetter onComplete={advanceScene} />
      )}
      
      {currentScene === 'heartbeatAnalysis' && sceneSettings?.heartbeatAnalysis && (
        <HeartbeatAnalysis onComplete={advanceScene} />
      )}
      
      {currentScene === 'finalMessage' && sceneSettings?.finalScene && (
        <FinalMessage config={config} />
      )}
    </div>
  );
};

export default BirthdayExperience;
