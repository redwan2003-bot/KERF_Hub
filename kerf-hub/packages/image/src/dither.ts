export type DitherAlgorithm = 'floyd-steinberg' | 'atkinson' | 'threshold';

export function ditherImage(
  grayscale: Float32Array,
  width: number,
  height: number,
  algorithm: DitherAlgorithm = 'atkinson'
): Uint8Array {
  const output = new Uint8Array(width * height);
  const buffer = new Float32Array(grayscale);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldVal = buffer[idx];
      const newVal = oldVal < 128 ? 0 : 255;
      output[idx] = newVal === 255 ? 1 : 0; // 1 = white, 0 = black

      if (algorithm === 'threshold') continue;

      const err = oldVal - newVal;

      if (algorithm === 'floyd-steinberg') {
        if (x + 1 < width) buffer[y * width + (x + 1)] += (err * 7) / 16;
        if (x - 1 >= 0 && y + 1 < height) buffer[(y + 1) * width + (x - 1)] += (err * 3) / 16;
        if (y + 1 < height) buffer[(y + 1) * width + x] += (err * 5) / 16;
        if (x + 1 < width && y + 1 < height) buffer[(y + 1) * width + (x + 1)] += (err * 1) / 16;
      } else if (algorithm === 'atkinson') {
        const factor = err / 8;
        if (x + 1 < width) buffer[y * width + (x + 1)] += factor;
        if (x + 2 < width) buffer[y * width + (x + 2)] += factor;
        if (x - 1 >= 0 && y + 1 < height) buffer[(y + 1) * width + (x - 1)] += factor;
        if (y + 1 < height) buffer[(y + 1) * width + x] += factor;
        if (x + 1 < width && y + 1 < height) buffer[(y + 1) * width + (x + 1)] += factor;
        if (y + 2 < height) buffer[(y + 2) * width + x] += factor;
      }
    }
  }

  return output;
}
