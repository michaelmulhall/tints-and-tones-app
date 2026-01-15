import React, { useState, useEffect } from 'react';
import { PRESET_COLORS } from '../types';
import { validateHexColor } from '../utils/validation';

interface ColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorChange,
  disabled = false,
}) => {
  const [hexInput, setHexInput] = useState(selectedColor);
  const [hexError, setHexError] = useState<string | null>(null);

  useEffect(() => {
    setHexInput(selectedColor);
  }, [selectedColor]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setHexInput(value);

    // Add # if missing
    const hexValue = value.startsWith('#') ? value : `#${value}`;

    if (validateHexColor(hexValue)) {
      setHexError(null);
      onColorChange(hexValue);
    } else if (value.length > 0) {
      setHexError('Invalid HEX color (format: #RRGGBB)');
    } else {
      setHexError(null);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value.toUpperCase();
    setHexInput(color);
    setHexError(null);
    onColorChange(color);
  };

  const handlePresetClick = (hex: string) => {
    if (!disabled) {
      setHexInput(hex);
      setHexError(null);
      onColorChange(hex);
    }
  };

  const getColorName = () => {
    const preset = PRESET_COLORS.find(
      (c) => c.hex.toUpperCase() === selectedColor.toUpperCase()
    );
    return preset?.name || 'Custom Color';
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Paint Color
        </label>
        
        {/* Color Picker and HEX Input Row */}
        <div className="flex gap-3 items-start">
          {/* Color Picker */}
          <div className="flex-shrink-0">
            <input
              type="color"
              value={selectedColor}
              onChange={handleColorPickerChange}
              disabled={disabled}
              className="h-12 w-12 rounded border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              title="Pick a color"
            />
          </div>

          {/* HEX Input */}
          <div className="flex-1">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              placeholder="#FFFFFF"
              disabled={disabled}
              className={`
                w-full px-3 py-2 border rounded-md font-mono text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:bg-gray-100 disabled:cursor-not-allowed
                ${hexError ? 'border-red-500' : 'border-gray-300'}
              `}
              maxLength={7}
            />
            {hexError && (
              <p className="mt-1 text-xs text-red-600">{hexError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Selected: {getColorName()}
            </p>
          </div>

          {/* Current Color Display */}
          <div className="flex-shrink-0">
            <div
              className="h-12 w-12 rounded border-2 border-gray-300 shadow-inner"
              style={{ backgroundColor: selectedColor }}
              title={selectedColor}
            />
          </div>
        </div>
      </div>

      {/* Preset Colors */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Popular Paint Colors
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => handlePresetClick(color.hex)}
              disabled={disabled}
              className={`
                group relative h-12 rounded-md border-2 transition-all
                hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50
                ${
                  selectedColor.toUpperCase() === color.hex.toUpperCase()
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={`${color.name} - ${color.hex}`}
              aria-label={`Select ${color.name}`}
            >
              {selectedColor.toUpperCase() === color.hex.toUpperCase() && (
                <svg
                  className="absolute inset-0 m-auto h-6 w-6 text-gray-800 drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              
              {/* Tooltip */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {color.name}
                <span className="block text-gray-400">{color.hex}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
