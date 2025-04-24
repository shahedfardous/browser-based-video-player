import React from 'react';
import { WindowSize } from '../types';
import { Smartphone, Tablet, Monitor, Tv } from 'lucide-react';

interface VideoSizeSelectorProps {
  windowSize: WindowSize;
  setWindowSize: (size: WindowSize) => void;
}

const VideoSizeSelector: React.FC<VideoSizeSelectorProps> = ({
  windowSize,
  setWindowSize
}) => {
  const sizes: { size: WindowSize; label: string; icon: React.ReactNode }[] = [
    { size: 'small', label: 'Small (480p)', icon: <Smartphone size={16} /> },
    { size: 'medium', label: 'Medium (640p)', icon: <Tablet size={16} /> },
    { size: 'large', label: 'Large (854p)', icon: <Monitor size={16} /> },
    { size: 'xl', label: 'Extra Large (1280p)', icon: <Tv size={16} /> }
  ];

  return (
    <div className="mt-4 flex justify-center">
      <div className="bg-gray-800 rounded-lg p-2 flex space-x-2">
        {sizes.map(({ size, label, icon }) => (
          <button
            key={size}
            onClick={() => setWindowSize(size)}
            className={`flex items-center px-3 py-2 rounded text-sm ${
              windowSize === size
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            } window-size-button`}
            title={label}
          >
            {icon}
            <span className="ml-2 hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoSizeSelector;