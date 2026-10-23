import { describe, it, expect } from 'vitest';
import { encodeKerfRequest, decodeKerfResponse, KerfRequest, KerfResponse, ErrorCode, PROTOCOL_VERSION } from './index';

describe('Kerf Protocol Codecs', () => {
  it('correctly matches protocol version 1', () => {
    expect(PROTOCOL_VERSION).toBe(1);
  });

  it('serializes and deserializes request/response messages', () => {
    const req: KerfRequest = {
      requestId: 42,
      subsystem: 'lighting',
      command: 'setUnderglow',
      payload: { hue: 160, brightness: 50 },
    };

    const bytes = encodeKerfRequest(req);
    expect(bytes.length).toBeGreaterThan(0);

    const resp: KerfResponse = {
      requestId: 42,
      error: ErrorCode.OK,
      subsystem: 'lighting',
      payload: { status: 'success' },
    };

    const encodedResp = new TextEncoder().encode(JSON.stringify(resp));
    const decodedResp = decodeKerfResponse(encodedResp);
    expect(decodedResp.requestId).toBe(42);
    expect(decodedResp.error).toBe(ErrorCode.OK);
    expect(decodedResp.subsystem).toBe('lighting');
  });
});
