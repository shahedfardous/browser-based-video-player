'use client';

import { VideoFile } from '@/types';

const RECENT_VIDEOS_KEY = 'mediaPlayer_recentVideos';
const MAX_RECENT_VIDEOS = 10;

export const getRecentVideos = (): VideoFile[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedVideos = localStorage.getItem(RECENT_VIDEOS_KEY);
    if (!storedVideos) return [];
    
    return JSON.parse(storedVideos);
  } catch (error) {
    console.error('Error retrieving recent videos:', error);
    return [];
  }
};

export const addToRecentVideos = (video: VideoFile): void => {
  if (typeof window === 'undefined') return;
  
  try {
    let recentVideos = getRecentVideos();
    
    // Remove if already in the list
    recentVideos = recentVideos.filter(v => v.url !== video.url);
    
    // Add to the beginning
    recentVideos.unshift(video);
    
    // Limit the number of recent videos
    if (recentVideos.length > MAX_RECENT_VIDEOS) {
      recentVideos = recentVideos.slice(0, MAX_RECENT_VIDEOS);
    }
    
    localStorage.setItem(RECENT_VIDEOS_KEY, JSON.stringify(recentVideos));
  } catch (error) {
    console.error('Error adding to recent videos:', error);
  }
};