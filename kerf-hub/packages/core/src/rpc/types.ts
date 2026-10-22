export interface KeyBinding {
  behaviorId: string;
  param1?: number;
  param2?: number;
}

export interface KeymapLayer {
  id: number;
  name: string;
  bindings: (KeyBinding | null)[];
}

export interface PhysicalKey {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  label?: string;
  matrixRow: number;
  matrixCol: number;
}

export interface DeviceState {
  connected: boolean;
  modelId: string;
  name: string;
  locked: boolean;
  activeLayer: number;
  layers: KeymapLayer[];
  keys: PhysicalKey[];
}

export enum StudioSubsystem {
  CORE = 1,
  KEYMAP = 2,
  BEHAVIORS = 3,
}

export enum CoreCommand {
  GET_VERSION = 1,
  GET_LOCK_STATE = 2,
  REQUEST_UNLOCK = 3,
  LOCK = 4,
  RESET = 5,
}

export enum KeymapCommand {
  GET_PHYSICAL_LAYOUT = 1,
  GET_LAYER_COUNT = 2,
  GET_LAYER_DETAILS = 3,
  SET_KEY_BINDING = 4,
  ADD_LAYER = 5,
  REMOVE_LAYER = 6,
}
