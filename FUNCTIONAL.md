# Functional Guide - Browser-based Video Player

This document provides an overview of features and use cases for the Browser-based Video Player built with Next.js 15.

## Core Features

### Video Playback

The player supports various video formats with full playback control:

- **Supported Formats**: MP4, WebM, Ogg, and other browser-supported formats
- **Playback Controls**: Play, pause, seek, volume adjustment
- **Progress Bar**: Visual playback progress with clickable seeking
- **Time Display**: Current position and total duration

### File Selection

Multiple ways to add videos to the player:

- **Individual File Selection**: Select video files via file browser
- **Folder Selection**: Add entire folders (in supported browsers)
- **Drag and Drop**: Drag files directly into the player

### Playlist Management

Comprehensive playlist functionality:

- **Add/Remove Videos**: Easily manage video collection
- **Video Information**: Display file name, size, and format
- **Current Video Highlight**: Clear indication of currently playing video
- **Natural Ordering**: Files sorted in natural number order

### Recent Videos

Track and access recently played content:

- **Automatic Tracking**: Recently played videos automatically recorded
- **Quick Access**: Easily access previously played videos
- **Last Played Time**: Display when videos were last watched
- **Persistent Storage**: History persists between sessions

### Window Size Options

Flexible viewing sizes:

- **Small**: Compact view for multitasking
- **Medium**: Balanced size for general viewing
- **Large**: Enhanced viewing experience
- **XL**: Near full-screen experience
- **Default**: Responsive size based on container

### Responsive Design

Adapts to all device sizes:

- **Mobile**: Touch-friendly controls on small screens
- **Tablet**: Optimized for medium-sized touchscreens
- **Desktop**: Full-featured experience on larger screens

### Keyboard Shortcuts

Control the player without touching the mouse:

| Key | Action |
|-----|--------|
| Space/K | Play/Pause |
| Left Arrow | Rewind 5s |
| Right Arrow | Forward 5s |
| Shift + Left/Right | Skip 10s |
| Up/Down Arrow | Volume control |
| M | Mute/Unmute |
| F | Toggle fullscreen |
| P | Picture-in-Picture |
| L | Toggle playlist |
| N | Next video |
| B | Previous video |
| 0-9 | Jump to percentage of video |

### Special Viewing Modes

Enhanced viewing options:

- **Fullscreen Mode**: Immersive viewing experience
- **Picture-in-Picture**: Floating video window for multitasking

## Interface Components

### Main Player

The central video display area with:
- High-quality video rendering
- Responsive scaling to fit container
- Click to play/pause functionality
- Custom loading and error states

### Control Bar

Complete set of playback controls:
- Play/Pause button
- Progress bar with buffering indicator
- Time display (current/total)
- Volume control with mute toggle
- Fullscreen toggle
- PiP button

### Playlist Modal

Manage your video collection:
- Scrollable list of videos
- Currently playing indicator
- Add/remove functionality
- Play on click selection

### Recent Videos Modal

Quick access to previously played content:
- Recently played videos list
- Last played timestamps
- One-click playback access

### Size Selector

Choose your preferred viewing size:
- Multiple preset sizes
- Visual size indicators
- Responsive design constraints

## Use Case Workflows

### Personal Media Library

Perfect for organizing and playing your video collection:

1. Open the application
2. Add videos using file picker or drag-and-drop
3. Create a personalized playlist of content
4. Use playlist navigation to move between videos
5. Track recently watched content for easy access

### Content Creation

For creators previewing their work:

1. Load video files being edited/created
2. Use different size options to check appearance
3. Test playback at different points using the progress bar
4. Use Picture-in-Picture to reference while working in other applications

### Presentations

Enhance presentations with video content:

1. Pre-load presentation video clips
2. Use fullscreen mode for maximum visibility
3. Navigate with keyboard shortcuts for professional control
4. Use the playlist to organize presentation sequence

### Educational Settings

Ideal for classroom environments:

1. Create playlists of instructional videos
2. Display content in appropriate window size
3. Use keyboard shortcuts for hands-free navigation
4. Track viewing history for reference

### Offline Viewing

Watch videos without internet connectivity:

1. Load videos from local storage
2. Use full playback functionality without internet
3. Maintain history and playlists between sessions

## Accessibility Features

The player includes:
- Keyboard navigation for all functions
- ARIA attributes for screen readers
- Focus indicators for keyboard users
- High-contrast controls
- Text alternatives for icons

## Limitations and Known Issues

- Some older browsers may not support all video formats
- Picture-in-Picture requires browser support
- Directory picker API not supported in all browsers
- Mobile browsers have varying feature support

## Tips for Best Experience

- Use Chrome, Firefox, Edge, or Safari for best compatibility
- For larger video libraries, organize files into folders for easier import
- Use keyboard shortcuts for efficient navigation
- Take advantage of Picture-in-Picture for multitasking