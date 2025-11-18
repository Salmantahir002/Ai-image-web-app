import React, { useState, useRef, useEffect } from 'react';
import { ICONS, SUGGESTED_PROMPTS } from '../constants';

interface PromptBarProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  initialPrompt?: string;
}

export const PromptBar: React.FC<PromptBarProps> = ({ onGenerate, isGenerating, initialPrompt = "" }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
       {/* Suggestions */}
       <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar mask-fade-right">
        {SUGGESTED_PROMPTS.map((s) => (
          <button
            key={s}
            onClick={() => setPrompt(s)}
            disabled={isGenerating}
            className="whitespace-nowrap px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs text-zinc-400 hover:text-white transition-colors flex-shrink-0"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className={`relative group transition-all duration-300 ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
        <div className="relative flex items-end gap-2 bg-zinc-900 p-2 rounded-2xl border border-zinc-800 shadow-2xl">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe how to edit the image... (e.g., 'Add a retro filter')"
            className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 px-4 py-3 rounded-xl focus:outline-none resize-none min-h-[52px] max-h-[200px]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`p-3 rounded-xl font-semibold text-black flex items-center justify-center transition-all duration-300 ${
              prompt.trim()
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:scale-105 shadow-lg shadow-orange-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              ICONS.MAGIC
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
