import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { ColorSelector } from './ColorSelector';
import { ResultDisplay } from './ResultDisplay';
import { generatePaintedRoom } from '../services/aiService';

export const RoomPaintVisualizer: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>('');

  const handleImageUpload = (file: File | null, previewUrl: string) => {
    setUploadedImage(file);
    setImagePreviewUrl(previewUrl);
    setGeneratedImageUrl(null);
    setError(null);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedColor) {
      setError('Please upload an image and select a color');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgressMessage('Starting...');

    try {
      const resultUrl = await generatePaintedRoom(
        uploadedImage,
        selectedColor,
        (status) => setProgressMessage(status)
      );
      
      setGeneratedImageUrl(resultUrl);
      setProgressMessage('');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate painted room');
      setProgressMessage('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTryAgain = () => {
    setGeneratedImageUrl(null);
    setError(null);
  };

  const canGenerate = uploadedImage && selectedColor && !isGenerating;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-3">
            Paint Visualizer
          </h1>
          <p className="text-xl text-gray-500 font-light">
            Visualize your space with new colors
          </p>
        </div>

        {/* Main Content */}
        {!generatedImageUrl ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Upload & Controls */}
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
                  Upload Image
                </h2>
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  currentImage={uploadedImage}
                  previewUrl={imagePreviewUrl}
                  disabled={isGenerating}
                />
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
                  Choose Color
                </h2>
                <ColorSelector
                  selectedColor={selectedColor}
                  onColorChange={handleColorChange}
                  disabled={isGenerating}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`
                  w-full py-5 px-6 rounded-2xl font-semibold text-lg
                  transition-all duration-300 flex items-center justify-center gap-3
                  ${canGenerate
                    ? 'bg-black text-white hover:bg-gray-800 active:scale-[0.98] shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    Generate Painted Room
                  </>
                )}
              </button>

              {/* Progress Message */}
              {isGenerating && progressMessage && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <p className="text-gray-900 font-medium text-lg">{progressMessage}</p>
                  <p className="text-sm text-gray-500 mt-2">This may take 30-60 seconds</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-red-900 font-semibold">Error</p>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Preview/Instructions */}
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
                  Preview
                </h2>
                {imagePreviewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreviewUrl}
                      alt="Room preview"
                      className="w-full h-auto rounded-2xl border border-gray-200"
                    />
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200">
                      <span className="text-sm text-gray-500 font-medium">Selected color</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-xl border border-gray-200 shadow-sm"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span className="font-mono text-sm font-medium text-gray-900">{selectedColor}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">Upload an image to preview</p>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-5 tracking-tight">
                  Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Use clear, well-lit photos of your room</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Make sure walls are clearly visible</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Avoid images with heavy shadows or glare</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Processing typically takes 30-60 seconds</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <ResultDisplay
              originalImageUrl={imagePreviewUrl!}
              generatedImageUrl={generatedImageUrl}
              onTryAgain={handleTryAgain}
            />
          </div>
        )}
      </div>
    </div>
  );
};
