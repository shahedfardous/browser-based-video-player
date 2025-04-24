# Technical Documentation - Browser-based Video Player

## Architecture Overview

This Next.js 15 video player application leverages the App Router architecture to deliver a feature-rich, responsive, and performant video playback experience directly in the browser. The application combines server and client components strategically to optimize both performance and interactivity.

## Project Structure

```
videoplayer/
├── src/
│   ├── app/
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout (Server Component)
│   │   ├── page.tsx          # Main page (Server Component)
│   │   └── components/
│   │       ├── Controls.tsx          # Player controls
│   │       ├── Credits.tsx           # App credits display
│   │       ├── PlaylistModal.tsx     # Playlist management modal
│   │       ├── RecentModal.tsx       # Recent videos modal
│   │       ├── VideoPlayer.tsx       # Main player component
│   │       └── VideoSizeSelector.tsx # Window size selection
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── fileUtils.ts      # File handling utilities
│   │   ├── storageUtils.ts   # Local storage utilities
│   │   └── timeUtils.ts      # Time formatting utilities
│   ├── App.css              # App-specific styles
│   └── App.tsx              # Main application component
├── next-env.d.ts           # Next.js TypeScript declarations
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies
├── package-lock.json       # Dependency lock file
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project documentation
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Core Technology Stack

- **Next.js 15**: Application framework with App Router architecture
- **React 18**: UI component library
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library

## Component Architecture

### Key Components

1. **VideoPlayer.tsx**
   - Core component that handles video playback
   - Manages state for current video, playback status, and controls visibility
   - Coordinates other components and features

2. **Controls.tsx**
   - Handles user interaction with playback controls
   - Implements progress bar, volume controls, and playback buttons
   - Responds to user interaction and keyboard shortcuts

3. **PlaylistModal.tsx**
   - Manages playlist of videos
   - Handles adding, removing, and selecting videos
   - Displays video information and current playing status

4. **RecentModal.tsx**
   - Displays recently played videos
   - Enables quick access to previously played content
   - Shows timestamp information for last played time

5. **VideoSizeSelector.tsx**
   - Provides options for different player window sizes
   - Manages responsive behavior across device sizes

### Data Flow

The application uses a unidirectional data flow pattern:
1. User interactions trigger state changes in parent components
2. State updates flow down to child components as props
3. Child components emit events back to parent components for handling

## Core Functionality Implementation

### File Handling

The application uses browser File APIs to handle video files:

```typescript
// From fileUtils.ts (simplified)
export const handleFileSelect = (
  files: FileList | null,
  setPlaylist: (videos: VideoFile[]) => void,
  currentPlaylist: VideoFile[]
) => {
  if (!files || files.length === 0) return;
  
  const newVideos: VideoFile[] = [];
  
  Array.from(files).forEach(file => {
    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      
      newVideos.push({
        name: file.name,
        type: file.type,
        size: file.size,
        url: url,
        lastPlayed: new Date().toISOString()
      });
    }
  });
  
  setPlaylist([...currentPlaylist, ...newVideos]);
};
```

### Local Storage

The application uses localStorage to maintain state between sessions:

```typescript
// From storageUtils.ts (simplified)
export const getRecentVideos = (): VideoFile[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedVideos = localStorage.getItem('recent-videos');
    return storedVideos ? JSON.parse(storedVideos) : [];
  } catch (error) {
    console.error('Error retrieving recent videos:', error);
    return [];
  }
};

export const addToRecentVideos = (video: VideoFile): void => {
  if (typeof window === 'undefined') return;
  
  try {
    let recentVideos = getRecentVideos();
    recentVideos = recentVideos.filter(v => v.url !== video.url);
    recentVideos.unshift({...video, lastPlayed: new Date().toISOString()});
    
    if (recentVideos.length > 10) {
      recentVideos = recentVideos.slice(0, 10);
    }
    
    localStorage.setItem('recent-videos', JSON.stringify(recentVideos));
  } catch (error) {
    console.error('Error adding to recent videos:', error);
  }
};
```

### Video Playback

The application uses HTML5 video APIs enhanced with React state management:

```typescript
// From VideoPlayer.tsx (simplified structure)
const VideoPlayer = () => {
  const [playlist, setPlaylist] = useState<VideoFile[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Additional control functions...
  
  return (
    <div className="video-player">
      <video 
        ref={videoRef}
        src={currentVideo?.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        // Additional event handlers...
      />
      <Controls 
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        // Additional props...
      />
      {/* Additional UI elements... */}
    </div>
  );
};
```

### Keyboard Shortcuts

The application implements keyboard shortcuts using event listeners:

```typescript
// From VideoPlayer.tsx (simplified example)
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!videoRef.current) return;
    
    switch (e.key.toLowerCase()) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        break;
      case 'arrowleft':
        e.preventDefault();
        videoRef.current.currentTime -= e.shiftKey ? 10 : 5;
        break;
      // Additional shortcuts...
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [togglePlay]);
```

## Next.js Integration

### Server vs Client Components

The application strategically separates server and client components:

- **Server Components** (default in App Router):
  - Layout components
  - Initial page structure
  - Static UI elements

- **Client Components** (marked with `'use client'`):
  - Interactive elements
  - Video player and controls
  - Components using browser APIs
  
### App Router Features

- **Metadata**: Defined in layout.tsx for SEO optimization
- **Layout**: Consistent UI structure with shared components
- **Client/Server Boundary**: Clear separation with proper hydration

## Optimizations

1. **Object URL Management**: Creating and revoking object URLs to prevent memory leaks
2. **Event Throttling**: Throttling frequent events like time updates
3. **Conditional Rendering**: Showing controls only when needed
4. **Browser API Detection**: Feature detection for compatibility

## Browser Compatibility

The application implements feature detection for:
- Picture-in-Picture API
- Fullscreen API
- Directory picker API
- Various video format support

## Deployment Considerations

1. **Static Export**: Can be exported statically
2. **Vercel Deployment**: Optimized for Vercel
3. **Environment Variables**: Configurable via env vars

## Security Considerations

1. **Local Files Only**: Works with local files only, avoiding remote URL security issues
2. **Sandboxed Execution**: Runs within browser security sandbox
3. **Next.js Security**: Leverages Next.js security best practices