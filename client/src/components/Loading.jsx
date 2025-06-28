// src/components/Loading.jsx
import React from 'react';
import { PropagateLoader } from 'react-spinners';

const Loading = ({ 
  message = "Loading...", 
  showSidebar = false, 
  size = 15, 
  color = "#3b82f6" 
}) => {
  if (showSidebar) {
    // Layout with sidebar (matches your Layout component structure)
    return (
      <div className="min-h-dvh flex flex-col md:flex-row">
        {/* Sidebar placeholder */}
        <div className="md:w-64 w-full md:h-screen bg-[#2f2f2f]">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="font-semibold text-white">API Forge</span>
          </div>
        </div>
        
        {/* Main content area with loading */}
        <main className="flex-1 bg-[#1a1a1a] text-white">
          <div className="min-h-screen flex flex-col items-center justify-center">
            <PropagateLoader 
              color={color} 
              size={size} 
              speedMultiplier={0.8}
            />
            <p className="mt-4 text-gray-300 text-sm md:text-base">
              {message}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Simple full-screen loading (for pages without sidebar)
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col gap-3 items-center justify-center px-4">
      <PropagateLoader 
        color={color} 
        size={size} 
        speedMultiplier={0.8}
      />
      <p className="mt-4 text-gray-300 text-sm md:text-base text-center">
        {message}
      </p>
    </div>
  );
};

export default Loading;