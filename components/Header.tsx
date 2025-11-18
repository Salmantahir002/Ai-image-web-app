import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-black font-bold text-lg leading-none">N</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Nano Banana Studio
          </h1>
        </div>
        <div className="flex items-center space-x-4 text-sm font-medium text-zinc-400">
           <span className="hidden sm:block flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Powered by Gemini 2.5 Flash Image
           </span>
        </div>
      </div>
    </header>
  );
};
