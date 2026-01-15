export interface PaintVisualizerState {
  uploadedImage: File | null;
  imagePreviewUrl: string | null;
  selectedColor: string;
  generatedImageUrl: string | null;
  isGenerating: boolean;
  error: string | null;
}

export interface ColorPreset {
  name: string;
  hex: string;
  description?: string;
}

export const PRESET_COLORS: ColorPreset[] = [
  { name: "Pure White", hex: "#FFFFFF", description: "Classic bright white" },
  { name: "Beige", hex: "#F5F5DC", description: "Warm neutral" },
  { name: "Light Gray", hex: "#D3D3D3", description: "Modern neutral" },
  { name: "Sky Blue", hex: "#87CEEB", description: "Calming blue" },
  { name: "Mint Green", hex: "#98FB98", description: "Fresh green" },
  { name: "Soft Yellow", hex: "#FFFACD", description: "Sunny yellow" },
  { name: "Lavender", hex: "#E6E6FA", description: "Soft purple" },
  { name: "Peach", hex: "#FFDAB9", description: "Warm peach" },
  { name: "Sage Green", hex: "#B2AC88", description: "Earthy green" },
  { name: "Powder Blue", hex: "#B0E0E6", description: "Light blue" },
  { name: "Warm Gray", hex: "#A9A9A9", description: "Cozy gray" },
  { name: "Cream", hex: "#FFFDD0", description: "Soft cream" },
];
