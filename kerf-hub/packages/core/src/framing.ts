/**
 * ZMK Studio RPC Framing Protocol
 * SOF: 0xAB, ESC: 0xAC, EOF: 0xAD
 * Payload bytes matching SOF, ESC, or EOF are escaped using [ESC, byte ^ 0x20].
 */

export const SOF = 0xab;
export const ESC = 0xac;
export const EOF = 0xad;
export const ESC_XOR = 0x20;

export function encodeFrame(payload: Uint8Array): Uint8Array {
  const output: number[] = [SOF];
  for (let i = 0; i < payload.length; i++) {
    const b = payload[i];
    if (b === SOF || b === ESC || b === EOF) {
      output.push(ESC);
      output.push(b ^ ESC_XOR);
    } else {
      output.push(b);
    }
  }
  output.push(EOF);
  return new Uint8Array(output);
}

export function decodeFrame(frame: Uint8Array): Uint8Array {
  if (frame.length < 2) {
    throw new Error('Frame too short');
  }
  let start = 0;
  let end = frame.length;
  if (frame[0] === SOF) start = 1;
  if (frame[frame.length - 1] === EOF) end = frame.length - 1;

  const result: number[] = [];
  let isEscaped = false;

  for (let i = start; i < end; i++) {
    const b = frame[i];
    if (isEscaped) {
      result.push(b ^ ESC_XOR);
      isEscaped = false;
    } else if (b === ESC) {
      isEscaped = true;
    } else {
      result.push(b);
    }
  }

  if (isEscaped) {
    throw new Error('Incomplete escape sequence at end of frame');
  }

  return new Uint8Array(result);
}

export class FrameStreamDecoder {
  private buffer: number[] = [];
  private inFrame = false;

  public push(chunk: Uint8Array): Uint8Array[] {
    const completedFrames: Uint8Array[] = [];

    for (let i = 0; i < chunk.length; i++) {
      const b = chunk[i];
      if (b === SOF) {
        this.buffer = [SOF];
        this.inFrame = true;
      } else if (b === EOF && this.inFrame) {
        this.buffer.push(EOF);
        try {
          const decoded = decodeFrame(new Uint8Array(this.buffer));
          completedFrames.push(decoded);
        } catch {
          // ignore corrupted frame
        }
        this.buffer = [];
        this.inFrame = false;
      } else if (this.inFrame) {
        this.buffer.push(b);
        if (this.buffer.length > 4096) {
          // overflow protection
          this.buffer = [];
          this.inFrame = false;
        }
      }
    }

    return completedFrames;
  }

  public reset(): void {
    this.buffer = [];
    this.inFrame = false;
  }
}
