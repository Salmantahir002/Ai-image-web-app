import React, { useCallback } from 'react';
import { ICONS } from '../constants';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files && files[0]) {
        onImageUpload(files[0]);
      }
    },
    [onImageUpload]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-12 p-8 border-2 border-dashed border-zinc-700 hover:border-yellow-500 rounded-3xl bg-zinc-900/50 transition-colors duration-300 flex flex-col items-center justify-center text-center cursor-pointer group min-h-[400px]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <div className="text-zinc-500 group-hover:text-yellow-500 transition-colors duration-300 mb-6">
        {ICONS.UPLOAD}
      </div>
      <h3 className="text-2xl font-semibold text-zinc-100 mb-2">
        Upload your photo
      </h3>
      <p className="text-zinc-400 mb-8 text-lg">
        Drag & drop or click to browse
      </p>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full text-sm border border-zinc-700 group-hover:border-yellow-500/50 transition-all">
        Supports JPG, PNG, WEBP
      </div>
    </div>
  );
};
