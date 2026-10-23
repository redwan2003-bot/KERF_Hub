import { describe, it, expect } from 'vitest';
import {
  encodeKerfRequest,
  decodeKerfResponse,
  textToMacroSteps,
  MacroAction,
  MacroSlot,
  ErrorCode,
  PROTOCOL_VERSION,
  MAX_MACRO_STEPS,
  MAX_MACRO_SLOTS,
  MAX_PROFILES,
  DISPLAY_WIDTH,
  DISPLAY_HEIGHT,
  DISPLAY_BYTES_PER_FRAME,
  MAX_DISPLAY_FRAMES,
  DISPLAY_CHUNK_SIZE,
  validateKerfProfileFile,
  KerfProfileFile,
} from './index';

describe('Kerf Protocol Codecs & Macros', () => {
  it('correctly matches protocol version 1 and bounds', () => {
    expect(PROTOCOL_VERSION).toBe(1);
    expect(MAX_MACRO_SLOTS).toBe(16);
    expect(MAX_MACRO_STEPS).toBe(64);
  });

  it('converts text string to sequential tap macro steps', () => {
    const text = 'hello 1';
    const steps = textToMacroSteps(text);
    expect(steps.length).toBe(7);

    // Each step is a TAP
    steps.forEach((s) => expect(s.action).toBe(MacroAction.TAP));

    // Verify keycodes
    expect(steps[0].param).toBe(0x0b); // 'h'
    expect(steps[1].param).toBe(0x08); // 'e'
    expect(steps[2].param).toBe(0x0f); // 'l'
    expect(steps[3].param).toBe(0x0f); // 'l'
    expect(steps[4].param).toBe(0x12); // 'o'
    expect(steps[5].param).toBe(0x2c); // space
    expect(steps[6].param).toBe(0x1e); // '1'
  });

  it('caps text to 64 steps maximum', () => {
    const longText = 'a'.repeat(100);
    const steps = textToMacroSteps(longText);
    expect(steps.length).toBe(MAX_MACRO_STEPS);
  });

  it('serializes and deserializes macro RPC messages', () => {
    const slot: MacroSlot = {
      slotId: 0,
      name: 'Git Status',
      steps: [
        { action: MacroAction.TAP, param: 0x0a }, // 'g'
        { action: MacroAction.DELAY, param: 50 },
        { action: MacroAction.TAP, param: 0x28 }, // enter
      ],
    };

    const req = {
      requestId: 10,
      subsystem: 'macros' as const,
      command: 'setSlot',
      payload: slot,
    };

    const bytes = encodeKerfRequest(req);
    expect(bytes.length).toBeGreaterThan(0);

    const resp = {
      requestId: 10,
      error: ErrorCode.OK,
      subsystem: 'macros' as const,
      payload: { success: true },
    };

    const decoded = decodeKerfResponse(new TextEncoder().encode(JSON.stringify(resp)));
    expect(decoded.requestId).toBe(10);
    expect(decoded.error).toBe(ErrorCode.OK);
    expect(decoded.subsystem).toBe('macros');
  });

  it('validates a valid .kerfprofile JSON file schema', () => {
    const validProfile: KerfProfileFile = {
      format: 'kerfprofile',
      version: 1,
      exportedAt: new Date().toISOString(),
      modelId: 'kerf-lp63',
      profileName: 'Gaming Speed',
      data: {
        name: 'Gaming Speed',
        underglow: {
          on: true,
          hue: 0,
          saturation: 100,
          brightness: 100,
          effect: 0,
          speed: 1,
          autoOffIdle: true,
          autoOffUsb: false,
        },
        batled: {
          brightness: 100,
          lowBrightness: 20,
          tapMs: 1000,
          maxHoldMs: 10000,
          lowPercent: 10,
          repeatMin: 5,
        },
        power: {
          debouncePressMs: 1,
          debounceReleaseMs: 2,
          idleTimeoutMs: 30000,
          deepSleepTimeoutMs: 900000,
        },
        macros: [],
      },
    };

    const validated = validateKerfProfileFile(validProfile);
    expect(validated.profileName).toBe('Gaming Speed');
    expect(validated.data.power.debouncePressMs).toBe(1);
    expect(MAX_PROFILES).toBe(3);
  });

  it('rejects invalid .kerfprofile format or payload', () => {
    expect(() => validateKerfProfileFile(null)).toThrow();
    expect(() => validateKerfProfileFile({ format: 'invalid', version: 1, data: {} })).toThrow();
    expect(() => validateKerfProfileFile({ format: 'kerfprofile', version: 0, data: {} })).toThrow();
    expect(() => validateKerfProfileFile({ format: 'kerfprofile', version: 1 })).toThrow();
  });

  it('matches 160x68 1-bit nice!view display geometry and chunk bounds', () => {
    expect(DISPLAY_WIDTH).toBe(160);
    expect(DISPLAY_HEIGHT).toBe(68);
    expect(DISPLAY_BYTES_PER_FRAME).toBe((160 * 68) / 8); // 1360 bytes
    expect(MAX_DISPLAY_FRAMES).toBe(30);

    // Chunks needed for full frame transfer
    const chunksNeeded = Math.ceil(DISPLAY_BYTES_PER_FRAME / DISPLAY_CHUNK_SIZE);
    expect(chunksNeeded).toBe(25); // 24 * 56 + 16 = 1360 bytes
  });
});
