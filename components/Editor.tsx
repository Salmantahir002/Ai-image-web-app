import React, { useState } from 'react';
import { ICONS } from '../constants';
import { LoadingSpinner } from './LoadingSpinner';

interface EditorProps {
  originalImage: string;
  generatedImage: string | null;
  isGenerating: boolean;
  prompt: string;
  onReset: () => void;
  onDownload: () => void;
}

export const Editor: React.FC<EditorProps> = ({
  originalImage,
  generatedImage,
  isGenerating,
  onReset,
  onDownload
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'generated'>('split');

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto px-4 py-6 gap-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-xl border border-zinc-800">
        <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg">
          {(['original', 'split', 'generated'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              disabled={!generatedImage && mode !== 'original'}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                viewMode === mode
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
           <button
            onClick={onReset}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-red-900/30 hover:text-red-400 text-zinc-300 rounded-lg transition-colors text-sm border border-transparent hover:border-red-900/50"
          >
            {ICONS.TRASH}
            <span className="hidden sm:inline">Reset</span>
          </button>
          {generatedImage && (
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-black rounded-lg transition-colors text-sm font-semibold shadow-lg shadow-white/10"
            >
              {ICONS.DOWNLOAD}
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 min-h-[500px] relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
            
           {/* Generation Loading State Overlay */}
           {isGenerating && (
              <div className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <LoadingSpinner message="Processing with Gemini Nano..." />
              </div>
           )}

           {/* Image Display Logic */}
           <div className="w-full h-full flex items-center justify-center">
              
              {/* ORIGINAL ONLY */}
              {viewMode === 'original' && (
                 <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
              )}

              {/* SPLIT VIEW (Default) */}
              {viewMode === 'split' && (
                 <div className="flex flex-col md:flex-row w-full h-full gap-4">
                    <div className="flex-1 relative flex flex-col min-h-0">
                       <span className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-white z-10">Original</span>
                       <div className="flex-1 flex items-center justify-center bg-zinc-950/30 rounded-xl border border-zinc-800/50 overflow-hidden">
                          <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain" />
                       </div>
                    </div>
                    <div className="flex-1 relative flex flex-col min-h-0">
                       <span className="absolute top-4 left-4 bg-yellow-500/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-black z-10">Gemini Edited</span>
                       <div className="flex-1 flex items-center justify-center bg-zinc-950/30 rounded-xl border border-zinc-800/50 overflow-hidden">
                         {generatedImage ? (
                           <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain" />
                         ) : (
                           <div className="text-zinc-600 flex flex-col items-center">
                              <div className="mb-2 opacity-20">{ICONS.MAGIC}</div>
                              <p className="text-sm">Edited image will appear here</p>
                           </div>
                         )}
                       </div>
                    </div>
                 </div>
              )}

              {/* GENERATED ONLY */}
              {viewMode === 'generated' && (
                 generatedImage ? (
                    <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
                 ) : (
                    <div className="text-center text-zinc-500">
                        <p>No edited image yet.</p>
                        <button onClick={() => setViewMode('split')} className="text-yellow-500 hover:underline mt-2">Go back</button>
                    </div>
                 )
              )}
           </div>

        </div>
      </div>
    </div>
  );
};
