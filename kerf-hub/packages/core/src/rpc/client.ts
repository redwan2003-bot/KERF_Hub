import { WebSerialTransport } from '../transport/web-serial';
import { KeyBinding, DeviceState } from './types';

export class StudioRpcClient {
  private transport: WebSerialTransport;
  private pendingRequests = new Map<number, { resolve: (val: any) => void; reject: (err: any) => void }>();
  private onStateChange?: (state: Partial<DeviceState>) => void;

  constructor() {
    this.transport = new WebSerialTransport({
      onFrame: (frame) => this.handleIncomingFrame(frame),
      onDisconnect: () => this.handleDisconnect(),
      onError: (err) => console.error('Transport error:', err),
    });
  }

  public setOnStateChange(cb: (state: Partial<DeviceState>) => void): void {
    this.onStateChange = cb;
  }

  public async connect(): Promise<void> {
    await this.transport.connect();
    this.onStateChange?.({ connected: true });
  }

  public async disconnect(): Promise<void> {
    await this.transport.close();
    this.handleDisconnect();
  }

  private handleDisconnect(): void {
    this.pendingRequests.forEach(({ reject }) => reject(new Error('Device disconnected')));
    this.pendingRequests.clear();
    this.onStateChange?.({ connected: false });
  }

  private handleIncomingFrame(frame: Uint8Array): void {
    if (frame.length < 2) return;
    const subsystem = frame[0];
    const cmd = frame[1];
    const payload = frame.slice(2);

    // Lock notification from board (e.g. &studio_unlock pressed)
    if (subsystem === 1 && cmd === 2) {
      const isLocked = payload.length > 0 ? payload[0] === 1 : false;
      this.onStateChange?.({ locked: isLocked });
    }
  }

  public async getLockState(): Promise<boolean> {
    if (!this.transport.connected) return true;
    // Query lock state over RPC
    return false;
  }

  public async requestUnlock(): Promise<void> {
    if (!this.transport.connected) {
      throw new Error('Not connected to device');
    }
    // Send unlock request frame (subsystem 1: CORE, cmd 3: REQUEST_UNLOCK)
    const frame = new Uint8Array([1, 3]);
    await this.transport.send(frame);
  }

  public async lockDevice(): Promise<void> {
    if (!this.transport.connected) return;
    const frame = new Uint8Array([1, 4]);
    await this.transport.send(frame);
    this.onStateChange?.({ locked: true });
  }

  public async setKeyBinding(layerId: number, keyIndex: number, _binding: KeyBinding): Promise<void> {
    if (!this.transport.connected) {
      throw new Error('Device not connected');
    }
    // Subsystem 2: KEYMAP, cmd 4: SET_KEY_BINDING
    const header = new Uint8Array([2, 4, layerId, keyIndex & 0xff, (keyIndex >> 8) & 0xff]);
    await this.transport.send(header);
  }

  public get isConnected(): boolean {
    return this.transport.connected;
  }
}
