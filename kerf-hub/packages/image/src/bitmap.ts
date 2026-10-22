/**
 * Packs 1-bit pixel array (where 1 = white, 0 = black) into byte buffer
 * for nice!view LS011B7DH03 display (160x68 px, 1,360 bytes).
 */

export const DISPLAY_WIDTH = 160;
export const DISPLAY_HEIGHT = 68;
export const FRAME_BUFFER_BYTES = (DISPLAY_WIDTH * DISPLAY_HEIGHT) / 8; // 1,360 bytes

export function pack1BitBitmap(pixels: Uint8Array, width: number, height: number): Uint8Array {
  const bytesPerRow = Math.ceil(width / 8);
  const buffer = new Uint8Array(bytesPerRow * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const bit = pixels[y * width + x] & 1;
      const byteIndex = y * bytesPerRow + Math.floor(x / 8);
      const bitOffset = 7 - (x % 8); // MSB first
      if (bit) {
        buffer[byteIndex] |= 1 << bitOffset;
      }
    }
  }

  return buffer;
}

export function unpack1BitBitmap(buffer: Uint8Array, width: number, height: number): Uint8Array {
  const bytesPerRow = Math.ceil(width / 8);
  const pixels = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const byteIndex = y * bytesPerRow + Math.floor(x / 8);
      const bitOffset = 7 - (x % 8);
      pixels[y * width + x] = (buffer[byteIndex] >> bitOffset) & 1;
    }
  }

  return pixels;
}
