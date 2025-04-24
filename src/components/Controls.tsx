import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Maximize, Minimize, PictureInPicture2 } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';

interface ControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  showControls: boolean;
  isPiP: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  playNextVideo: () => void;
  playPreviousVideo: () => void;
  toggleFullscreen: () => void;
  togglePiP: () => void;
  isFullscreen: boolean;
  playlistLength: number;
  currentVideoIndex: number;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  muted,
  showControls,
  isPiP,
  togglePlay,
  toggleMute,
  handleVolumeChange,
  handleProgressClick,
  playNextVideo,
  playPreviousVideo,
  toggleFullscreen,
  togglePiP,
  isFullscreen,
  playlistLength,
  currentVideoIndex
}) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasNext = currentVideoIndex < playlistLength - 1;
  const hasPrevious = currentVideoIndex > 0;
  const VolumeIcon = muted ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <div 
      className={`controls-container absolute bottom-0 left-0 right-0 p-4 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className="progress-container mb-4"
        onClick={handleProgressClick}
      >
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
        <div 
          className="progress-handle" 
          style={{ left: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlay}
            className="text-white p-2 rounded-full hover:bg-white/20 control-button"
            title={isPlaying ? "Pause (Space/K)" : "Play (Space/K)"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button 
            onClick={playPreviousVideo}
            className={`text-white p-2 rounded-full control-button ${
              hasPrevious ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!hasPrevious}
            title="Previous (B)"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={playNextVideo}
            className={`text-white p-2 rounded-full control-button ${
              hasNext ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!hasNext}
            title="Next (N)"
          >
            <SkipForward size={20} />
          </button>
          
          <div className="text-white text-sm">
            <span>{formatTime(currentTime)}</span>
            <span> / </span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMute}
              className="text-white p-2 rounded-full hover:bg-white/20 control-button"
              title="Toggle Mute (M)"
            >
              <VolumeIcon size={20} />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              title="Volume (Up/Down Arrow)"
            />
          </div>
          
          <button 
            onClick={togglePiP}
            className="text-white p-2 rounded-full hover:bg-white/20 control-button"
            title="Picture in Picture (P)"
          >
            <PictureInPicture2 size={20} />
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="text-white p-2 rounded-full hover:bg-white/20 control-button"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;