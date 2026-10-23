import { StudioRpcClient } from './rpc/client';
import { KerfClient } from './rpc/kerf-client';
import { DeviceState, PhysicalKey, KeymapLayer } from './rpc/types';
import { UnderglowConfig, BatledConfig, PowerConfig } from '@kerf/protocol';

export function getDefaultLP63Keys(): PhysicalKey[] {
  const keys: PhysicalKey[] = [];
  const colWidth = 19;
  const rowHeight = 19;
  let index = 0;

  // 13 columns x 5 rows = 65 keys
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 13; c++) {
      let w = colWidth;
      let h = rowHeight;
      let x = c * colWidth;
      let y = r * rowHeight;

      // Special key sizing for bottom row
      if (r === 4) {
        if (c === 3) {
          w = colWidth * 2; // 2U Space
        }
      }

      keys.push({
        index,
        x,
        y,
        width: w,
        height: h,
        matrixRow: Math.floor(index / 9),
        matrixCol: index % 9,
      });
      index++;
    }
  }

  return keys;
}

export function getDefaultLP63Layers(): KeymapLayer[] {
  return [
    {
      id: 0,
      name: 'Default',
      bindings: new Array(65).fill(null).map((_, i) => ({
        behaviorId: 'kp',
        param1: i,
      })),
    },
    {
      id: 1,
      name: 'Function',
      bindings: new Array(65).fill(null).map(() => ({
        behaviorId: 'trans',
        param1: 0,
      })),
    },
  ];
}

export interface ExtendedDeviceState extends DeviceState {
  underglow: UnderglowConfig;
  batled: BatledConfig;
  power: PowerConfig;
}

export class SessionManager {
  private client: StudioRpcClient;
  private kerfClient: KerfClient;
  private state: ExtendedDeviceState = {
    connected: false,
    modelId: 'kerf-lp63',
    name: 'kerf_keeb LP63',
    locked: true,
    activeLayer: 0,
    layers: getDefaultLP63Layers(),
    keys: getDefaultLP63Keys(),
    underglow: {
      on: true,
      hue: 160,
      saturation: 100,
      brightness: 50,
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
      debouncePressMs: 5,
      debounceReleaseMs: 5,
      idleTimeoutMs: 30000,
      deepSleepTimeoutMs: 900000,
    },
  };
  private listeners: Array<(state: ExtendedDeviceState) => void> = [];

  constructor() {
    this.client = new StudioRpcClient();
    this.kerfClient = new KerfClient();
    this.client.setOnStateChange((partial) => {
      this.state = { ...this.state, ...partial };
      this.notify();
    });
  }

  public subscribe(listener: (state: ExtendedDeviceState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  public async connect(): Promise<void> {
    await this.client.connect();
    this.state.connected = true;
    this.state.locked = true; // Devices start locked by default
    this.notify();
  }

  public async disconnect(): Promise<void> {
    await this.client.disconnect();
    this.state.connected = false;
    this.notify();
  }

  public async requestUnlock(): Promise<void> {
    await this.client.requestUnlock();
  }

  public async unlock(): Promise<void> {
    this.state.locked = false;
    this.notify();
  }

  public setActiveLayer(layerId: number): void {
    this.state.activeLayer = layerId;
    this.notify();
  }

  public async remapKey(layerId: number, keyIndex: number, behaviorId: string, param1?: number): Promise<void> {
    const layer = this.state.layers.find((l) => l.id === layerId);
    if (layer) {
      layer.bindings[keyIndex] = { behaviorId, param1 };
      this.notify();
      if (this.state.connected) {
        await this.client.setKeyBinding(layerId, keyIndex, { behaviorId, param1 });
      }
    }
  }

  public async updateUnderglow(cfg: Partial<UnderglowConfig>): Promise<void> {
    this.state.underglow = { ...this.state.underglow, ...cfg };
    this.notify();
    await this.kerfClient.setUnderglow(this.state.underglow);
  }

  public async updateBatled(cfg: Partial<BatledConfig>): Promise<void> {
    this.state.batled = { ...this.state.batled, ...cfg };
    this.notify();
    await this.kerfClient.setBatled(this.state.batled);
  }

  public async updatePower(cfg: Partial<PowerConfig>): Promise<void> {
    this.state.power = { ...this.state.power, ...cfg };
    this.notify();
    await this.kerfClient.setPowerConfig(this.state.power);
  }

  public getState(): ExtendedDeviceState {
    return this.state;
  }
}
