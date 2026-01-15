import React, { useRef, useState } from 'react';
import { validateImageFile, formatFileSize } from '../utils/validation';
import { createImagePreview } from '../utils/imageProcessing';

interface ImageUploaderProps {
  onImageUpload: (file: File, previewUrl: string) => void;
  currentImage: File | null;
  previewUrl: string | null;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  previewUrl,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      const preview = await createImagePreview(file);
      onImageUpload(file, preview);
    } catch (err) {
      setError('Failed to load image preview');
      console.error(err);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(null as any, '');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl transition-all duration-300
          ${isDragging ? 'border-gray-400 bg-gray-100' : 'border-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}
          ${error ? 'border-red-300' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Room preview"
              className="w-full h-auto max-h-96 object-contain rounded-2xl"
            />
            <div className="absolute top-3 right-3">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-white/90 backdrop-blur-xl text-gray-900 rounded-xl hover:bg-white transition-all text-sm font-medium shadow-sm border border-gray-200"
                disabled={disabled}
              >
                Remove
              </button>
            </div>
            {currentImage && (
              <div className="mt-3 text-sm text-gray-500">
                <p className="font-medium text-gray-900">{currentImage.name}</p>
                <p className="text-xs mt-1">{formatFileSize(currentImage.size)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-16 text-center">
            <svg
              className="mx-auto h-14 w-14 text-gray-300"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-5">
              <p className="text-lg font-semibold text-gray-900 tracking-tight">
                Upload an image
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-400">
                JPG, PNG, or WebP • Max 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
          {error}
        </div>
      )}
    </div>
  );
};
