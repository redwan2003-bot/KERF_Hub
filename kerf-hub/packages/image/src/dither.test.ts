import { describe, it, expect } from 'vitest';
import { ditherImage } from './dither';
import { pack1BitBitmap, unpack1BitBitmap, DISPLAY_WIDTH, DISPLAY_HEIGHT, FRAME_BUFFER_BYTES } from './bitmap';

describe('1-Bit Image Processing & Dithering', () => {
  it('dithers a 160x68 gradient cleanly into binary pixels', () => {
    const totalPixels = DISPLAY_WIDTH * DISPLAY_HEIGHT;
    const gray = new Float32Array(totalPixels);
    for (let i = 0; i < totalPixels; i++) {
      gray[i] = (i / totalPixels) * 255;
    }

    const dithered = ditherImage(gray, DISPLAY_WIDTH, DISPLAY_HEIGHT, 'atkinson');
    expect(dithered.length).toBe(totalPixels);

    // Ensure all values are strictly 0 or 1
    for (let i = 0; i < dithered.length; i++) {
      expect(dithered[i] === 0 || dithered[i] === 1).toBe(true);
    }
  });

  it('packs 160x68 binary pixels into exactly 1,360 bytes', () => {
    const totalPixels = DISPLAY_WIDTH * DISPLAY_HEIGHT;
    const pixels = new Uint8Array(totalPixels);
    // Fill alternating pixels
    for (let i = 0; i < totalPixels; i++) {
      pixels[i] = i % 2;
    }

    const packed = pack1BitBitmap(pixels, DISPLAY_WIDTH, DISPLAY_HEIGHT);
    expect(packed.length).toBe(FRAME_BUFFER_BYTES); // 1360 bytes

    const unpacked = unpack1BitBitmap(packed, DISPLAY_WIDTH, DISPLAY_HEIGHT);
    expect(Array.from(unpacked)).toEqual(Array.from(pixels));
  });
});
