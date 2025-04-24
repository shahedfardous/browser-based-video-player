import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Media Player</h1>
      <VideoPlayer />
    </div>
  );
}

export default App;