import { StudioRpcClient } from './rpc/client';
import { KerfClient } from './rpc/kerf-client';
import { DeviceState, PhysicalKey, KeymapLayer } from './rpc/types';
import {
  UnderglowConfig,
  BatledConfig,
  PowerConfig,
  MacroSlot,
  MAX_MACRO_SLOTS,
  ProfileData,
  MAX_PROFILES,
  KerfProfileFile,
  validateKerfProfileFile,
  WidgetConfig,
  PointerConfig,
  PollingRate,
  LiftOffDistance,
} from '@kerf/protocol';

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
  macros: MacroSlot[];
  activeProfileId: number;
  profiles: ProfileData[];
  display: WidgetConfig;
  pointer: PointerConfig;
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
    macros: new Array(MAX_MACRO_SLOTS).fill(null).map((_, i) => ({
      slotId: i,
      name: `Macro ${i}`,
      steps: [],
    })),
    activeProfileId: 0,
    profiles: new Array(MAX_PROFILES).fill(null).map((_, i) => ({
      profileId: i,
      name: `Profile ${i + 1}`,
      underglow: {
        on: true,
        hue: i === 0 ? 160 : i === 1 ? 0 : 280,
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
        debouncePressMs: i === 1 ? 1 : 5,
        debounceReleaseMs: i === 1 ? 2 : 5,
        idleTimeoutMs: 30000,
        deepSleepTimeoutMs: 900000,
      },
      macros: [],
    })),
    display: {
      showBattery: true,
      showLayer: true,
      showBtProfile: true,
      showCapsLock: true,
      showWpm: false,
      showClock: false,
      invertColors: false,
      rotate180: false,
      screenOffOnIdle: true,
    },
    pointer: {
      activeStage: 1,
      stages: [
        { stageId: 0, dpiX: 400, dpiY: 400, colorHex: 0xff0000 },
        { stageId: 1, dpiX: 800, dpiY: 800, colorHex: 0x00ff00 },
        { stageId: 2, dpiX: 1600, dpiY: 1600, colorHex: 0x0000ff },
        { stageId: 3, dpiX: 3200, dpiY: 3200, colorHex: 0xffff00 },
      ],
      pollingRate: PollingRate.RATE_1000HZ,
      lod: LiftOffDistance.LOD_1MM,
      motionSync: true,
      rippleControl: false,
      angleSnapping: false,
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

  public async updateMacroSlot(slot: MacroSlot): Promise<void> {
    this.state.macros[slot.slotId] = slot;
    this.notify();
    await this.kerfClient.setMacroSlot(slot);
  }

  public async clearMacroSlot(slotId: number): Promise<void> {
    if (this.state.macros[slotId]) {
      this.state.macros[slotId].steps = [];
      this.notify();
      await this.kerfClient.clearMacroSlot(slotId);
    }
  }

  public async activateProfile(profileId: number): Promise<void> {
    if (profileId >= 0 && profileId < MAX_PROFILES) {
      this.state.activeProfileId = profileId;
      const target = this.state.profiles[profileId];
      if (target) {
        this.state.underglow = { ...target.underglow };
        this.state.batled = { ...target.batled };
        this.state.power = { ...target.power };
        if (target.macros && target.macros.length > 0) {
          this.state.macros = [...target.macros];
        }
      }
      this.notify();
      await this.kerfClient.activateProfile(profileId);
    }
  }

  public async saveProfile(profile: ProfileData): Promise<void> {
    if (profile.profileId >= 0 && profile.profileId < MAX_PROFILES) {
      this.state.profiles[profile.profileId] = { ...profile };
      if (this.state.activeProfileId === profile.profileId) {
        this.state.underglow = { ...profile.underglow };
        this.state.batled = { ...profile.batled };
        this.state.power = { ...profile.power };
        this.state.macros = [...profile.macros];
      }
      this.notify();
      await this.kerfClient.saveProfile(profile);
    }
  }

  public exportProfile(profileId: number): string {
    const profile = this.state.profiles[profileId] || this.state.profiles[0];
    const exportFile: KerfProfileFile = {
      format: 'kerfprofile',
      version: 1,
      exportedAt: new Date().toISOString(),
      modelId: this.state.modelId,
      profileName: profile.name,
      data: {
        name: profile.name,
        underglow: profile.underglow,
        batled: profile.batled,
        power: profile.power,
        macros: profile.macros,
      },
    };
    return JSON.stringify(exportFile, null, 2);
  }

  public async importProfile(profileId: number, jsonString: string): Promise<void> {
    const parsed = JSON.parse(jsonString);
    const valid = validateKerfProfileFile(parsed);
    const updated: ProfileData = {
      profileId,
      name: valid.profileName || valid.data.name || `Imported Profile ${profileId + 1}`,
      underglow: valid.data.underglow,
      batled: valid.data.batled,
      power: valid.data.power,
      macros: valid.data.macros || [],
    };
    await this.saveProfile(updated);
  }

  public async rebootToBootloader(): Promise<void> {
    await this.kerfClient.rebootToBootloader();
  }

  public async factoryReset(): Promise<void> {
    await this.kerfClient.factoryReset();
  }

  public async updateDisplayLayout(cfg: Partial<WidgetConfig>): Promise<void> {
    this.state.display = { ...this.state.display, ...cfg };
    this.notify();
    await this.kerfClient.setDisplayLayout(this.state.display);
  }

  public async uploadDisplayFrame(
    frameIdx: number,
    frameBytes: Uint8Array,
    onProgress?: (pct: number) => void,
  ): Promise<void> {
    await this.kerfClient.uploadDisplayImage(frameIdx, frameBytes, onProgress);
  }

  public async updatePointerConfig(cfg: Partial<PointerConfig>): Promise<void> {
    this.state.pointer = { ...this.state.pointer, ...cfg };
    this.notify();
    await this.kerfClient.setPointerConfig(this.state.pointer);
  }

  public selectDeviceModel(modelId: 'kerf-lp63' | 'kerf-macropad' | 'kerf-mouse'): void {
    this.state.modelId = modelId;
    if (modelId === 'kerf-lp63') {
      this.state.name = 'kerf_keeb LP63';
    } else if (modelId === 'kerf-macropad') {
      this.state.name = 'Kerf Pad 16';
    } else if (modelId === 'kerf-mouse') {
      this.state.name = 'Kerf Precision Mouse';
    }
    this.notify();
  }

  public getState(): ExtendedDeviceState {
    return this.state;
  }
}
