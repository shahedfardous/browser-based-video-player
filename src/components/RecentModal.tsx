import React from 'react';
import { X, PlayCircle, Clock } from 'lucide-react';
import { VideoFile } from '../types';
import { formatFileSize } from '../utils/fileUtils';

interface RecentModalProps {
  recentVideos: VideoFile[];
  onClose: () => void;
  onVideoSelect: (video: VideoFile) => void;
}

const RecentModal: React.FC<RecentModalProps> = ({
  recentVideos,
  onClose,
  onVideoSelect
}) => {
  const formatLastPlayed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than a day
    if (diff < 86400000) {
      return `Today at ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If less than a week
    if (diff < 604800000) {
      return `${date.toLocaleDateString(undefined, { weekday: 'long' })} at ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 modal">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl overflow-hidden modal-content">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Recent Videos</h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        
        {recentVideos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>No recent videos</p>
            <p className="mt-2 text-sm">Videos you play will appear here</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            <ul className="divide-y divide-gray-700">
              {recentVideos.map((video, index) => (
                <li 
                  key={index}
                  className="p-4 hover:bg-gray-700"
                >
                  <button
                    onClick={() => onVideoSelect(video)}
                    className="flex items-start w-full text-left"
                  >
                    <PlayCircle size={20} className="mr-3 mt-1 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-white truncate">{video.name}</p>
                      <div className="flex items-center text-gray-400 text-sm mt-1">
                        <Clock size={14} className="mr-1" />
                        <span>{formatLastPlayed(video.lastPlayed)}</span>
                        <span className="mx-2">•</span>
                        <span>{formatFileSize(video.size)}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentModal;