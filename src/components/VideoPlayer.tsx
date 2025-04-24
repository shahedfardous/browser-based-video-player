'use client';

import React, { useState, useRef, useEffect } from 'react';
import Controls from './Controls';
import PlaylistModal from './PlaylistModal';
import RecentModal from './RecentModal';
import Credits from './Credits';
import VideoSizeSelector from './VideoSizeSelector';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  List, Clock, FolderOpen, Maximize, Minimize, X } from 'lucide-react';
import { VideoFile, WindowSize } from '../types';
import { addToRecentVideos, getRecentVideos } from '../utils/storageUtils';

const VideoPlayer: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [playlist, setPlaylist] = useState<VideoFile[]>([]);
  const [recentVideos, setRecentVideos] = useState<VideoFile[]>([]);
  const [windowSize, setWindowSize] = useState<WindowSize>('default');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecentVideos(getRecentVideos());
  }, []);

  useEffect(() => {
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowTitle(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, currentTime]);

  useEffect(() => {
    if (showTitle) {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }
      titleTimeoutRef.current = setTimeout(() => {
        setShowTitle(false);
      }, 3000);
    }

    return () => {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }
    };
  }, [showTitle]);

  useEffect(() => {
    const handleVideoEnd = () => {
      playNextVideo();
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [playlist, currentVideo]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      if (e.target instanceof HTMLInputElement) return;

      switch(e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
          e.preventDefault();
          videoRef.current.currentTime -= e.shiftKey ? 10 : 5;
          break;
        case 'arrowright':
          e.preventDefault();
          videoRef.current.currentTime += e.shiftKey ? 10 : 5;
          break;
        case 'arrowup':
          e.preventDefault();
          const newVolUp = Math.min(1, volume + 0.1);
          setVolume(newVolUp);
          if (videoRef.current) videoRef.current.volume = newVolUp;
          break;
        case 'arrowdown':
          e.preventDefault();
          const newVolDown = Math.max(0, volume - 0.1);
          setVolume(newVolDown);
          if (videoRef.current) videoRef.current.volume = newVolDown;
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'p':
          togglePiP();
          break;
        case 'l':
          setShowPlaylist(prev => !prev);
          break;
        case 'n':
          playNextVideo();
          break;
        case 'b':
          playPreviousVideo();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          videoRef.current.currentTime = (videoRef.current.duration * parseInt(e.key)) / 10;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [volume, isPlaying]);

  useEffect(() => {
    const handlePiPChange = () => {
      setIsPiP(document.pictureInPictureElement !== null);
    };

    document.addEventListener('enterpictureinpicture', handlePiPChange);
    document.addEventListener('leavepictureinpicture', handlePiPChange);

    return () => {
      document.removeEventListener('enterpictureinpicture', handlePiPChange);
      document.removeEventListener('leavepictureinpicture', handlePiPChange);
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPlaylist: VideoFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('video/')) {
        const videoFile: VideoFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          lastPlayed: new Date().toISOString()
        };
        newPlaylist.push(videoFile);
      }
    });

    if (newPlaylist.length > 0) {
      setPlaylist(prev => [...prev, ...newPlaylist]);
      if (!videoSrc) {
        loadVideo(newPlaylist[0]);
      }
    }
  };

  const handleFolderSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPlaylist: VideoFile[] = [];
    const videoFiles = Array.from(files).filter(file => file.type.startsWith('video/'));
    
    // Sort files by name before processing
    videoFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    
    for (const file of videoFiles) {
      const videoFile: VideoFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        lastPlayed: new Date().toISOString()
      };
      newPlaylist.push(videoFile);
    }

    if (newPlaylist.length > 0) {
      setPlaylist(prev => [...prev, ...newPlaylist]);
      if (!videoSrc) {
        loadVideo(newPlaylist[0]);
      }
    }

    // Reset the input to allow selecting the same folder again
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  const loadVideo = (video: VideoFile) => {
    setCurrentVideo(video);
    setVideoSrc(video.url);
    addToRecentVideos(video);
    setRecentVideos(getRecentVideos());
    setShowTitle(true);
    
    setCurrentTime(0);
    setIsPlaying(true);
    
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(error => {
          console.error("Error starting video playback:", error);
          setIsPlaying(false);
        });
      }
    }, 100);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error toggling video playback:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current && duration > 0) {
      const newTime = pos * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    setShowTitle(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowTitle(false);
      }, 3000);
    }
  };

  const playNextVideo = () => {
    if (!currentVideo || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(v => v.url === currentVideo.url);
    if (currentIndex === -1 || currentIndex === playlist.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    loadVideo(playlist[currentIndex + 1]);
  };

  const playPreviousVideo = () => {
    if (!currentVideo || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(v => v.url === currentVideo.url);
    if (currentIndex <= 0) return;
    
    loadVideo(playlist[currentIndex - 1]);
  };

  const removeFromPlaylist = (index: number) => {
    const newPlaylist = [...playlist];
    const removedVideo = newPlaylist.splice(index, 1)[0];
    setPlaylist(newPlaylist);
    
    if (currentVideo && removedVideo.url === currentVideo.url) {
      if (newPlaylist.length > 0 && index < newPlaylist.length) {
        loadVideo(newPlaylist[index]);
      } else if (newPlaylist.length > 0) {
        loadVideo(newPlaylist[0]);
      } else {
        setVideoSrc(null);
        setCurrentVideo(null);
        setIsPlaying(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Failed to toggle Picture-in-Picture mode:', error);
    }
  };

  const getVideoDimensionClass = () => {
    // Return default size if window is not defined (server-side rendering)
    if (typeof window === 'undefined') {
      return 'w-[854px] h-[480px]';
    }
    
    if (window.innerWidth <= 640) {
      return 'w-full h-auto aspect-video';
    }
    
    switch (windowSize) {
      case 'small': return 'w-[480px] h-[270px]';
      case 'medium': return 'w-[640px] h-[360px]';
      case 'large': return 'w-[854px] h-[480px]';
      case 'xl': return 'w-[1280px] h-[720px]';
      default: return 'w-[854px] h-[480px]';
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div 
        ref={videoContainerRef}
        className={`relative bg-black rounded-lg overflow-hidden shadow-xl ${isFullscreen ? 'w-full h-full' : getVideoDimensionClass()}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <div className="video-container">
          {videoSrc ? (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                muted={muted}
                className="w-full h-full object-contain"
              />
              {showTitle && currentVideo && (
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300">
                  <h2 className="text-white text-lg font-semibold truncate">
                    {currentVideo.name}
                  </h2>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-800">
              <p className="text-white text-xl">Select a video to play</p>
            </div>
          )}

          <Controls 
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            muted={muted}
            showControls={showControls}
            togglePlay={togglePlay}
            toggleMute={toggleMute}
            handleVolumeChange={handleVolumeChange}
            handleProgressClick={handleProgressClick}
            playNextVideo={playNextVideo}
            playPreviousVideo={playPreviousVideo}
            toggleFullscreen={toggleFullscreen}
            togglePiP={togglePiP}
            isPiP={isPiP}
            isFullscreen={isFullscreen}
            playlistLength={playlist.length}
            currentVideoIndex={currentVideo ? playlist.findIndex(v => v.url === currentVideo.url) : -1}
          />
        </div>
      </div>

      <div className="w-full mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer button-transition">
            <FolderOpen size={18} className="mr-2" />
            <span>Open Files</span>
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileSelect} 
              className="hidden"
              multiple
            />
          </label>
          <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer button-transition">
            <FolderOpen size={18} className="mr-2" />
            <span>Open Folder</span>
            <input 
              ref={folderInputRef}
              type="file" 
              accept="video/*" 
              onChange={handleFolderSelect} 
              className="hidden"
              multiple
              webkitdirectory=""
              directory=""
            />
          </label>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowPlaylist(true)}
            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md button-transition"
          >
            <List size={18} className="mr-2" />
            <span>Playlist</span>
          </button>
          <button 
            onClick={() => setShowRecent(true)}
            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md button-transition"
          >
            <Clock size={18} className="mr-2" />
            <span>Recent</span>
          </button>
        </div>
      </div>

      <VideoSizeSelector 
        windowSize={windowSize} 
        setWindowSize={setWindowSize} 
      />
      
      <Credits />

      {showPlaylist && (
        <PlaylistModal 
          playlist={playlist}
          currentVideo={currentVideo}
          onClose={() => setShowPlaylist(false)}
          onVideoSelect={loadVideo}
          onVideoRemove={removeFromPlaylist}
          onFileSelect={handleFileSelect}
        />
      )}

      {showRecent && (
        <RecentModal 
          recentVideos={recentVideos}
          onClose={() => setShowRecent(false)}
          onVideoSelect={loadVideo}
        />
      )}
    </div>
  );
};

export default VideoPlayer;