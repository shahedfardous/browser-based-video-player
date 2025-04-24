import React from 'react';
import { X, PlayCircle, Trash2 } from 'lucide-react';
import { VideoFile } from '../types';
import { formatFileSize } from '../utils/fileUtils';

interface PlaylistModalProps {
  playlist: VideoFile[];
  currentVideo: VideoFile | null;
  onClose: () => void;
  onVideoSelect: (video: VideoFile) => void;
  onVideoRemove: (index: number) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  playlist,
  currentVideo,
  onClose,
  onVideoSelect,
  onVideoRemove,
  onFileSelect
}) => {
  // Sort playlist based on natural number ordering
  const sortedPlaylist = [...playlist].sort((a, b) => {
    // Extract numbers from filenames
    const aMatch = a.name.match(/\d+/);
    const bMatch = b.name.match(/\d+/);
    
    if (aMatch && bMatch) {
      const aNum = parseInt(aMatch[0]);
      const bNum = parseInt(bMatch[0]);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
    }
    
    // Fallback to string comparison if no numbers found
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 modal">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl shadow-xl overflow-hidden modal-content">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Playlist</h2>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        
        {playlist.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>Your playlist is empty</p>
            <p className="mt-2 text-sm">Add videos using the "Add Videos" button below</p>
          </div>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            <ul className="divide-y divide-gray-700">
              {sortedPlaylist.map((video, index) => (
                <li 
                  key={index}
                  className={`p-4 hover:bg-gray-700 flex items-center justify-between ${
                    currentVideo && video.url === currentVideo.url ? 'bg-blue-900' : ''
                  }`}
                >
                  <div className="flex items-center w-full">
                    <button
                      onClick={() => onVideoSelect(video)}
                      className="flex items-center flex-1 text-left pr-4"
                    >
                      <PlayCircle 
                        size={20} 
                        className={`mr-3 ${
                          currentVideo && video.url === currentVideo.url ? 'text-blue-400' : 'text-gray-400'
                        }`}
                      />
                      <div className="truncate">
                        <p className="text-white truncate">{video.name}</p>
                        <p className="text-gray-400 text-sm">{formatFileSize(video.size)}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => onVideoRemove(index)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="p-4 border-t border-gray-700 flex justify-between">
          <span className="text-gray-400">{playlist.length} videos</span>
          <label className="cursor-pointer text-blue-400 hover:text-blue-300">
            + Add Videos
            <input 
              type="file" 
              accept="video/*" 
              className="hidden"
              multiple
              onChange={onFileSelect}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;