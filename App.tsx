import React, { useReducer, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptBar } from './components/PromptBar';
import { Editor } from './components/Editor';
import { editImageWithGemini } from './services/geminiService';
import { EditorState, ImageActionType, ImageAction } from './types';
import { ICONS } from './constants';

const initialState: EditorState = {
  originalImage: null,
  originalFile: null,
  generatedImage: null,
  isGenerating: false,
  error: null,
  prompt: '',
};

function reducer(state: EditorState, action: ImageAction): EditorState {
  switch (action.type) {
    case ImageActionType.SET_ORIGINAL:
      return {
        ...initialState, // Reset everything else when new image loads
        originalImage: action.payload.url,
        originalFile: action.payload.file,
      };
    case ImageActionType.START_GENERATING:
      return {
        ...state,
        isGenerating: true,
        error: null,
      };
    case ImageActionType.SET_GENERATED:
      return {
        ...state,
        isGenerating: false,
        generatedImage: action.payload,
      };
    case ImageActionType.ERROR:
      return {
        ...state,
        isGenerating: false,
        error: action.payload,
      };
    case ImageActionType.SET_PROMPT:
      return {
        ...state,
        prompt: action.payload,
      };
    case ImageActionType.RESET:
      return initialState;
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleImageUpload = useCallback((file: File) => {
    // Create local preview URL
    const url = URL.createObjectURL(file);
    dispatch({ 
      type: ImageActionType.SET_ORIGINAL, 
      payload: { url, file } 
    });
  }, []);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!state.originalFile) return;

    dispatch({ type: ImageActionType.START_GENERATING });
    dispatch({ type: ImageActionType.SET_PROMPT, payload: prompt });

    try {
      const resultDataUrl = await editImageWithGemini(state.originalFile, prompt);
      dispatch({ type: ImageActionType.SET_GENERATED, payload: resultDataUrl });
    } catch (err: any) {
      dispatch({ 
        type: ImageActionType.ERROR, 
        payload: err.message || "Failed to edit image. Please try again." 
      });
    }
  }, [state.originalFile]);

  const handleDownload = () => {
    if (state.generatedImage) {
      const link = document.createElement('a');
      link.href = state.generatedImage;
      link.download = `gemini-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        {state.error && (
           <div className="bg-red-900/50 border-b border-red-800/50 p-4 text-center text-red-200 animate-fade-in">
             <span className="font-semibold">Error:</span> {state.error}
           </div>
        )}

        {!state.originalImage ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 animate-fade-in-up">
             <div className="max-w-2xl text-center mb-8">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                   Reimagine your photos <br/> with <span className="text-yellow-500">Nano Banana</span>
                </h2>
                <p className="text-lg text-zinc-400">
                   Use Gemini 2.5 Flash to edit, clean up, or completely transform your images with simple text commands.
                </p>
             </div>
             <ImageUploader onImageUpload={handleImageUpload} />
             
             <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full px-4">
                {[
                  { icon: ICONS.MAGIC, title: "Smart Edits", desc: "Add filters or change lighting instantly." },
                  { icon: ICONS.TRASH, title: "Clean Up", desc: "Remove unwanted objects or backgrounds." },
                  { icon: ICONS.INFO, title: "Fast & Fluid", desc: "Powered by the lightweight Flash model." },
                ].map((feature, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <div className="text-yellow-500 mb-3">{feature.icon}</div>
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-zinc-500 text-sm">{feature.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-fade-in">
             <Editor 
                originalImage={state.originalImage}
                generatedImage={state.generatedImage}
                isGenerating={state.isGenerating}
                prompt={state.prompt}
                onReset={() => dispatch({ type: ImageActionType.RESET })}
                onDownload={handleDownload}
             />
             
             <div className="sticky bottom-0 z-40 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pt-12">
                <PromptBar 
                   onGenerate={handleGenerate} 
                   isGenerating={state.isGenerating}
                   initialPrompt={state.prompt}
                />
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
