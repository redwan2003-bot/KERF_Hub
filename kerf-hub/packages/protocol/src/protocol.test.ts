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
});
