export interface EditorState {
  originalImage: string | null; // Data URL
  originalFile: File | null;
  generatedImage: string | null; // Data URL
  isGenerating: boolean;
  error: string | null;
  prompt: string;
}

export enum ImageActionType {
  SET_ORIGINAL = 'SET_ORIGINAL',
  SET_GENERATED = 'SET_GENERATED',
  START_GENERATING = 'START_GENERATING',
  ERROR = 'ERROR',
  SET_PROMPT = 'SET_PROMPT',
  RESET = 'RESET'
}

export type ImageAction =
  | { type: ImageActionType.SET_ORIGINAL; payload: { url: string; file: File } }
  | { type: ImageActionType.SET_GENERATED; payload: string }
  | { type: ImageActionType.START_GENERATING }
  | { type: ImageActionType.ERROR; payload: string }
  | { type: ImageActionType.SET_PROMPT; payload: string }
  | { type: ImageActionType.RESET };
