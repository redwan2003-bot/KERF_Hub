/**
 * Bridge for Tauri 2 native desktop IPC transports (hidapi & serialport)
 */

export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
}

export async function invokeTauri<T>(cmd: string, args?: Record<string, any>): Promise<T> {
  const win = window as any;
  if (win.__TAURI_INTERNALS__?.invoke) {
    return win.__TAURI_INTERNALS__.invoke(cmd, args);
  }
  if (win.__TAURI__?.core?.invoke) {
    return win.__TAURI__.core.invoke(cmd, args);
  }
  throw new Error('Not running inside Tauri desktop runtime');
}

export class TauriHidTransport {
  private connected = false;

  public async connect(): Promise<void> {
    if (!isTauriEnvironment()) return;
    const devices: any[] = await invokeTauri('kerf_list_hid_devices');
    if (!devices || devices.length === 0) {
      throw new Error('No ByranTK LP63 keyboard found over USB HID');
    }
    await invokeTauri('kerf_open_hid_device', { path: devices[0].path });
    this.connected = true;
  }

  public async sendReport(data: Uint8Array): Promise<void> {
    if (!this.connected) return;
    await invokeTauri('kerf_write_hid_report', { data: Array.from(data) });
  }

  public async readReport(timeoutMs: number = 100): Promise<Uint8Array> {
    if (!this.connected) return new Uint8Array(0);
    const bytes: number[] = await invokeTauri('kerf_read_hid_report', { timeoutMs });
    return new Uint8Array(bytes);
  }

  public async disconnect(): Promise<void> {
    if (this.connected) {
      await invokeTauri('kerf_close_hid_device');
      this.connected = false;
    }
  }

  public get isConnected(): boolean {
    return this.connected;
  }
}
