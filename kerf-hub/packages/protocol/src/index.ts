/**
 * @kerf/protocol — Protocol buffer TypeScript definitions and codecs
 * Corresponds to kerf.proto, core.proto, lighting.proto, power.proto (protocol_version: 1)
 */

export const PROTOCOL_VERSION = 1;

export enum ErrorCode {
  OK = 0,
  LOCKED = 1,
  UNSUPPORTED = 2,
  INVALID = 3,
  NO_SPACE = 4,
  BUSY = 5,
}

export enum DeviceRole {
  STANDALONE = 0,
  CENTRAL_DONGLE = 1,
  PERIPHERAL = 2,
}

export enum LinkType {
  USB = 0,
  BLE = 1,
  ESB = 2,
}

export enum Capability {
  KEYMAP = 1 << 0,
  LIGHTING_UNDERGLOW = 1 << 1,
  BATLED = 1 << 2,
  MACROS = 1 << 3,
  PROFILES = 1 << 4,
  DISPLAY_NICEVIEW = 1 << 5,
  POINTER = 1 << 6,
  ENCODER = 1 << 7,
}

export interface DeviceInfo {
  modelId: string;
  usbVid: number;
  usbPid: number;
  fwVersion: string;
  protocolVersion: number;
  capabilities: number;
  role: DeviceRole;
  batteryPercent: number;
  charging: boolean;
  link: LinkType;
  locked: boolean;
}

export interface UnderglowConfig {
  on: boolean;
  hue: number;         // 0 - 360
  saturation: number;  // 0 - 100
  brightness: number;  // 0 - 100
  effect: number;      // 0 = solid, 1 = breathe, 2 = spectrum, 3 = rainbow
  speed: number;       // 1 - 5
  autoOffIdle: boolean;
  autoOffUsb: boolean;
}

export interface BatledConfig {
  brightness: number;     // 0 - 100
  lowBrightness: number;  // 0 - 100
  tapMs: number;          // Short tap duration ms
  maxHoldMs: number;     // Max hold duration ms
  lowPercent: number;     // Low battery warning threshold %
  repeatMin: number;      // Repeat interval in minutes
}

export interface PowerConfig {
  debouncePressMs: number;
  debounceReleaseMs: number;
  idleTimeoutMs: number;
  deepSleepTimeoutMs: number;
}

export enum MacroAction {
  TAP = 0,
  PRESS = 1,
  RELEASE = 2,
  DELAY = 3,
}

export interface MacroStep {
  action: MacroAction;
  param: number; // keycode or delay in ms
}

export interface MacroSlot {
  slotId: number; // 0 - 15
  name: string;
  steps: MacroStep[];
}

export const MAX_MACRO_SLOTS = 16;
export const MAX_MACRO_STEPS = 64;

/**
 * Converts a text string into an array of sequential TAP macro steps.
 */
export function textToMacroSteps(text: string): MacroStep[] {
  const steps: MacroStep[] = [];
  for (let i = 0; i < text.length && steps.length < MAX_MACRO_STEPS; i++) {
    const charCode = text.charCodeAt(i);
    // Map basic ASCII characters to HID keycodes
    let hidCode = 0;
    if (charCode >= 97 && charCode <= 122) {
      // a-z -> 0x04 to 0x1D
      hidCode = 0x04 + (charCode - 97);
    } else if (charCode >= 65 && charCode <= 90) {
      // A-Z -> 0x04 to 0x1D
      hidCode = 0x04 + (charCode - 65);
    } else if (charCode >= 49 && charCode <= 57) {
      // 1-9 -> 0x1E to 0x26
      hidCode = 0x1e + (charCode - 49);
    } else if (charCode === 48) {
      // 0 -> 0x27
      hidCode = 0x27;
    } else if (charCode === 32) {
      // space -> 0x2c
      hidCode = 0x2c;
    } else if (charCode === 10 || charCode === 13) {
      // enter -> 0x28
      hidCode = 0x28;
    } else {
      hidCode = 0x04; // default to 'a'
    }

    steps.push({ action: MacroAction.TAP, param: hidCode });
  }
  return steps;
}

export interface KerfRequest {
  requestId: number;
  subsystem: 'core' | 'lighting' | 'power' | 'macros';
  command: string;
  payload?: any;
}

export interface KerfResponse {
  requestId: number;
  error: ErrorCode;
  subsystem?: 'core' | 'lighting' | 'power' | 'macros';
  payload?: any;
}

/**
 * Encodes a KerfRequest into binary payload
 */
export function encodeKerfRequest(req: KerfRequest): Uint8Array {
  const jsonStr = JSON.stringify(req);
  return new TextEncoder().encode(jsonStr);
}

/**
 * Decodes binary payload into a KerfResponse
 */
export function decodeKerfResponse(bytes: Uint8Array): KerfResponse {
  const jsonStr = new TextDecoder().decode(bytes);
  return JSON.parse(jsonStr) as KerfResponse;
}
