import React, { useState } from 'react';
import { downloadImage } from '../utils/imageProcessing';

interface ResultDisplayProps {
  originalImageUrl: string;
  generatedImageUrl: string;
  onTryAgain: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  originalImageUrl,
  generatedImageUrl,
  onTryAgain,
}) => {
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleDownload = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    downloadImage(generatedImageUrl, `painted-room-${timestamp}.png`);
  };

  const handleSliderMouseDown = () => {
    setIsDragging(true);
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return;
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Painted Room</h2>
        
        {/* Mode Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setComparisonMode('side-by-side')}
            className={`
              px-3 py-1 rounded text-sm font-medium transition-colors
              ${comparisonMode === 'side-by-side' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            Side by Side
          </button>
          <button
            onClick={() => setComparisonMode('slider')}
            className={`
              px-3 py-1 rounded text-sm font-medium transition-colors
              ${comparisonMode === 'slider' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            Slider
          </button>
        </div>
      </div>

      {/* Comparison Display */}
      {comparisonMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 text-center">
              Original
            </h3>
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg">
              <img
                src={originalImageUrl}
                alt="Original room"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Generated */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 text-center">
              With New Paint
            </h3>
            <div className="relative rounded-lg overflow-hidden border-2 border-blue-500 shadow-lg">
              <img
                src={generatedImageUrl}
                alt="Painted room"
                className="w-full h-auto"
              />
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                NEW
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative w-full rounded-lg overflow-hidden border-2 border-gray-300 shadow-lg cursor-col-resize select-none"
          onMouseDown={handleSliderMouseDown}
          onMouseUp={handleSliderMouseUp}
          onMouseMove={handleSliderMove}
          onMouseLeave={handleSliderMouseUp}
          onClick={handleSliderMove}
        >
          {/* Generated Image (Background) */}
          <img
            src={generatedImageUrl}
            alt="Painted room"
            className="w-full h-auto block"
            draggable="false"
          />

          {/* Original Image (Clipped) */}
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={originalImageUrl}
              alt="Original room"
              className="w-full h-auto block"
              draggable="false"
            />
          </div>

          {/* Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Slider Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-blue-500 flex items-center justify-center pointer-events-auto cursor-col-resize">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-semibold pointer-events-none">
            Original
          </div>
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-semibold pointer-events-none">
            New Paint
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Image
        </button>
        
        <button
          onClick={onTryAgain}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors border-2 border-gray-300 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Another Color
        </button>
      </div>
    </div>
  );
};
