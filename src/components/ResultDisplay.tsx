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
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Result</h2>
        
        {/* Mode Toggle */}
        <div className="flex gap-1 bg-gray-200 p-1 rounded-xl">
          <button
            onClick={() => setComparisonMode('side-by-side')}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${comparisonMode === 'side-by-side' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            Side by Side
          </button>
          <button
            onClick={() => setComparisonMode('slider')}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${comparisonMode === 'slider' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            Slider
          </button>
        </div>
      </div>

      {/* Comparison Display */}
      {comparisonMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Original */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 text-center tracking-tight">
              ORIGINAL
            </h3>
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={originalImageUrl}
                alt="Original room"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Generated */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 text-center tracking-tight">
              NEW PAINT
            </h3>
            <div className="relative rounded-2xl overflow-hidden border-2 border-gray-900 shadow-md">
              <img
                src={generatedImageUrl}
                alt="Painted room"
                className="w-full h-auto"
              />
              <div className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                NEW
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-md cursor-col-resize select-none"
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
            className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-xl pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Slider Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl border border-gray-200 flex items-center justify-center pointer-events-auto cursor-col-resize">
              <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-xl text-white px-3 py-1.5 rounded-lg text-xs font-semibold pointer-events-none">
            Original
          </div>
          <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-xl text-white px-3 py-1.5 rounded-lg text-xs font-semibold pointer-events-none">
            New Paint
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleDownload}
          className="flex-1 px-6 py-4 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Image
        </button>
        
        <button
          onClick={onTryAgain}
          className="flex-1 px-6 py-4 bg-gray-100 text-gray-900 font-semibold rounded-2xl hover:bg-gray-200 transition-all border border-gray-200 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Another Color
        </button>
      </div>
    </div>
  );
};
