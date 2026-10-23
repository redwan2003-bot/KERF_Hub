import { WebHIDTransport } from '../transport/web-hid';
import { UnderglowConfig, BatledConfig, PowerConfig, DeviceInfo, DeviceRole, LinkType, Capability, ErrorCode } from '@kerf/protocol';

export class KerfClient {
  private transport: WebHIDTransport;
  private pendingRequests = new Map<number, (res: any) => void>();

  constructor() {
    this.transport = new WebHIDTransport({
      onReport: (_id, data) => this.handleReport(data),
      onDisconnect: () => this.handleDisconnect(),
      onError: (err) => console.error('HID Error:', err),
    });
  }

  public async connect(): Promise<void> {
    await this.transport.connect();
  }

  public async disconnect(): Promise<void> {
    await this.transport.close();
  }

  private handleDisconnect(): void {
    this.pendingRequests.clear();
  }

  private handleReport(data: Uint8Array): void {
    if (data.length < 2) return;
    const subsystem = data[0];
    const status = data[1] as ErrorCode;

    const resolver = this.pendingRequests.get(subsystem);
    if (resolver) {
      this.pendingRequests.delete(subsystem);
      resolver({ status, data: data.slice(2) });
    }
  }

  public async getDeviceInfo(): Promise<DeviceInfo> {
    return {
      modelId: 'kerf-lp63',
      usbVid: 0x1d50,
      usbPid: 0x615e,
      fwVersion: '1.0.0',
      protocolVersion: 1,
      capabilities:
        Capability.KEYMAP |
        Capability.LIGHTING_UNDERGLOW |
        Capability.BATLED |
        Capability.MACROS |
        Capability.PROFILES |
        Capability.DISPLAY_NICEVIEW |
        Capability.ENCODER,
      role: DeviceRole.STANDALONE,
      batteryPercent: 88,
      charging: false,
      link: LinkType.USB,
      locked: false,
    };
  }

  public async setUnderglow(cfg: UnderglowConfig): Promise<void> {
    if (!this.transport.connected) return;
    const payload = new Uint8Array(64);
    payload[0] = 11; // KERF_SUBSYSTEM_LIGHTING
    payload[1] = 2;  // SetUnderglowConfig
    payload[2] = cfg.on ? 1 : 0;
    payload[3] = cfg.hue & 0xff;
    payload[4] = (cfg.hue >> 8) & 0xff;
    payload[5] = cfg.saturation;
    payload[6] = cfg.brightness;
    payload[7] = cfg.effect;
    payload[8] = cfg.speed;
    await this.transport.sendReport(0, payload);
  }

  public async setBatled(cfg: BatledConfig): Promise<void> {
    if (!this.transport.connected) return;
    const payload = new Uint8Array(64);
    payload[0] = 11; // KERF_SUBSYSTEM_LIGHTING
    payload[1] = 3;  // SetBatledConfig
    payload[2] = cfg.brightness;
    payload[3] = cfg.lowBrightness;
    payload[4] = cfg.tapMs & 0xff;
    payload[5] = (cfg.tapMs >> 8) & 0xff;
    payload[6] = cfg.lowPercent;
    payload[7] = cfg.repeatMin;
    await this.transport.sendReport(0, payload);
  }

  public async setPowerConfig(cfg: PowerConfig): Promise<void> {
    if (!this.transport.connected) return;
    const payload = new Uint8Array(64);
    payload[0] = 15; // KERF_SUBSYSTEM_POWER
    payload[1] = 2;  // SetPowerConfig
    payload[2] = cfg.debouncePressMs;
    payload[3] = cfg.debounceReleaseMs;
    await this.transport.sendReport(0, payload);
  }

  public get isConnected(): boolean {
    return this.transport.connected;
  }
}
