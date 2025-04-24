# Operations Manual - Browser-based Video Player

This document provides instructions for installing, configuring, deploying, and using the Browser-based Video Player built with Next.js 15.

## Installation

### Prerequisites

- Node.js (v18.17.0 or higher)
- npm (v9.6.0 or higher) or yarn (v1.22.0 or higher)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/shahedfardous/browser-based-video-player.git
```

2. Navigate to the project directory:

```bash
cd browser-video-player
```

3. Install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

## Development

### Starting the Development Server

Run the development server with:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

This will start the Next.js development server on http://localhost:3000

### Development Environment

- **Hot Reloading**: Changes are reflected immediately
- **Error Reporting**: Detailed error messages in console
- **React DevTools**: Compatible with React DevTools extension

## Building for Production

### Create Production Build

```bash
# Using npm
npm run build

# Using yarn
yarn build
```

### Running Production Build Locally

```bash
# Using npm
npm run start

# Using yarn
yarn start
```

## Deployment Options

### Vercel (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket
2. Import the project in Vercel dashboard
3. Configure build settings if needed
4. Deploy

Vercel will automatically detect Next.js and configure the optimal build settings.

### Static Export

For static hosting platforms:

1. Add the following to next.config.mjs:
```javascript
const nextConfig = {
  output: 'export',
};

export default nextConfig;
```

2. Build the project:
```bash
npm run build
```

3. The static site will be in the `out` directory, ready for deployment on any static hosting service

### Docker Deployment

1. Use the provided Dockerfile or create one:
```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

2. Build and run the Docker container:
```bash
docker build -t browser-video-player .
docker run -p 3000:3000 browser-video-player
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with any required environment variables:

```
# Example environment variables
NEXT_PUBLIC_APP_NAME=Browser Video Player
NEXT_PUBLIC_MAX_RECENT_VIDEOS=10
```

### Customizing the Application

- **Tailwind Configuration**: Edit `tailwind.config.js` for styling changes
- **Next.js Configuration**: Modify `next.config.mjs` for Next.js settings
- **Browser Support**: Adjust browserslist in `package.json` if needed

## Usage Instructions

### Adding Videos

1. Open the application in your browser
2. Click the "Add Files" button in the center of the player (when empty) or in the playlist modal
3. Select one or more video files from your device
4. Videos will be added to the playlist and the first one will begin playing

### Playlist Management

1. Click the playlist icon in the control bar to open the playlist modal
2. To add videos: Click "Add Files" button
3. To remove a video: Click the remove (x) button next to the video
4. To play a specific video: Click on the video in the playlist

### Video Controls

- **Play/Pause**: Click the play/pause button or click directly on the video
- **Volume**: Adjust using the volume slider or keyboard up/down arrows
- **Seeking**: Click anywhere on the progress bar or use left/right arrows
- **Fullscreen**: Click the fullscreen button or press F key
- **Picture-in-Picture**: Click the PiP button or press P key

### Window Size Options

1. Click the size selector button (four squares icon)
2. Choose from available size options:
   - Small
   - Medium
   - Large
   - XL
   - Default (responsive)

### Using Keyboard Shortcuts

See the full list of keyboard shortcuts in the main README or press the ? key (if implemented) to display the shortcuts overlay.

## Troubleshooting

### Common Issues

#### Videos Won't Play

- Ensure the video format is supported by your browser
- Check that you have the necessary codecs installed
- Try converting the video to a widely supported format like MP4 (H.264)

#### Missing Features in Some Browsers

- Picture-in-Picture and some other features depend on browser support
- Check browser compatibility and use a modern, updated browser
- Feature detection is implemented to gracefully handle unsupported features

#### Performance Issues

- Large video files may cause performance issues
- Consider using lower resolution videos for smoother playback
- Close other browser tabs and applications to free up resources

### Debug Mode

To enable debug logging:

1. Open browser console (F12 or Ctrl+Shift+J / Cmd+Option+J)
2. Set localStorage debug flag:
```javascript
localStorage.setItem('debug-video-player', 'true');
```
3. Reload the application

## Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome  | 90+ | Full feature support |
| Firefox | 88+ | Full feature support |
| Safari  | 14+ | Some PiP limitations |
| Edge    | 90+ | Full feature support |
| Opera   | 76+ | Full feature support |

## Performance Optimization

- **Video Size**: Lower resolution videos perform better
- **Browser Resources**: Close unnecessary tabs and applications
- **Hardware Acceleration**: Enable in browser settings for better performance
- **File Format**: Use optimized formats like MP4 with H.264 encoding

## Security Considerations

- The application works with local files only
- No data is sent to any server
- All processing happens client-side within the browser sandbox
- Video files are accessed via secure object URLs

## Support and Feedback

For issues or feature requests, please:
1. Check the GitHub issues page for existing reports
2. Create a new issue with detailed reproduction steps
3. Include browser and system information

## Updates and Maintenance

- Check the GitHub repository for updates
- Update using standard git pull and npm install
- Follow the project changelog for feature additions and breaking changes