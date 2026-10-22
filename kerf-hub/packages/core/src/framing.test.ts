import { describe, it, expect } from 'vitest';
import { encodeFrame, decodeFrame, FrameStreamDecoder, SOF, ESC, EOF } from './framing';

describe('ZMK Studio Framing', () => {
  it('correctly encodes and decodes plain payload', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const encoded = encodeFrame(data);
    expect(encoded[0]).toBe(SOF);
    expect(encoded[encoded.length - 1]).toBe(EOF);

    const decoded = decodeFrame(encoded);
    expect(Array.from(decoded)).toEqual([1, 2, 3, 4, 5]);
  });

  it('properly escapes special characters (SOF, ESC, EOF)', () => {
    const raw = new Uint8Array([SOF, ESC, EOF, 42]);
    const encoded = encodeFrame(raw);

    // Each escaped byte expands to 2 bytes, plus SOF and EOF wrapping
    expect(encoded.length).toBe(1 + 3 * 2 + 1 + 1);

    const decoded = decodeFrame(encoded);
    expect(Array.from(decoded)).toEqual([SOF, ESC, EOF, 42]);
  });

  it('streams chunks and decodes multiple frames', () => {
    const decoder = new FrameStreamDecoder();
    const frame1 = encodeFrame(new Uint8Array([10, 20]));
    const frame2 = encodeFrame(new Uint8Array([30, 40, 50]));

    const combined = new Uint8Array([...frame1, ...frame2]);
    // Split into arbitrary chunks to simulate serial stream
    const chunkA = combined.slice(0, 3);
    const chunkB = combined.slice(3, 8);
    const chunkC = combined.slice(8);

    const resA = decoder.push(chunkA);
    expect(resA.length).toBe(0);

    const resB = decoder.push(chunkB);
    expect(resB.length).toBe(1);
    expect(Array.from(resB[0])).toEqual([10, 20]);

    const resC = decoder.push(chunkC);
    expect(resC.length).toBe(1);
    expect(Array.from(resC[0])).toEqual([30, 40, 50]);
  });
});
