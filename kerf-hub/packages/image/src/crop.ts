import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './bitmap';

export function cropToNiceView(
  sourceCanvas: HTMLCanvasElement,
  cropX: number,
  cropY: number,
  cropWidth: number,
  cropHeight: number
): ImageData {
  const targetCanvas = document.createElement('canvas');
  targetCanvas.width = DISPLAY_WIDTH;
  targetCanvas.height = DISPLAY_HEIGHT;
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  ctx.drawImage(
    sourceCanvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    DISPLAY_WIDTH,
    DISPLAY_HEIGHT
  );

  return ctx.getImageData(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
}

export function rgbaToGrayscale(imageData: ImageData): Float32Array {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);

  for (let i = 0; i < gray.length; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    // Standard perceptual luminance formula
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  return gray;
}
