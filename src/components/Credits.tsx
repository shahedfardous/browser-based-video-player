import React from 'react';
import { Heart, Github, Linkedin, Globe } from 'lucide-react';

const Credits: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const copyrightYears = currentYear > 2025 ? `2025-${currentYear}` : '2025';
  return (
    <div className="w-full mt-6 mb-4 text-center text-gray-400 text-sm border-t border-gray-800 pt-4">
      <p className="flex items-center justify-center">
        Created with <Heart size={16} className="mx-1 text-red-500" /> by{" "}
        <a 
          href="https://shahedfardous.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-1 hover:text-gray-300"
        >
          Md Shahed Fardous (Samy)
        </a>
      </p>
      <p className="mt-1">© {copyrightYears} Media Player. All rights reserved. -- {" "}
        <a 
          href="https://shahedfardous.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-1 hover:text-gray-300"
        >
          Samy
        </a> </p>
        <div className="flex items-center justify-center space-x-4 mt-2">
        <a href="https://github.com/shahedfardous" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
          <Github size={20} />
        </a>
        <a href="https://linkedin.com/in/shahedfardous" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
          <Linkedin size={20} />
        </a>
        <a href="https://shahedfardous.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
          <Globe size={20} />
        </a>
      </div>
    </div>
  );
};

export default Credits;
