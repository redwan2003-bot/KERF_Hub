export interface HIDTransportEvents {
  onReport: (reportId: number, data: Uint8Array) => void;
  onDisconnect: () => void;
  onError: (err: Error) => void;
}

export class WebHIDTransport {
  private device: any = null;
  private isConnected = false;

  constructor(private events: HIDTransportEvents) {}

  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'hid' in navigator;
  }

  public async connect(): Promise<void> {
    if (!WebHIDTransport.isSupported()) {
      throw new Error('WebHID is not supported in this browser. Please use Chrome, Edge, or Opera.');
    }

    // Filter for Kerf Vendor Usage Page (0xFF60)
    const devices = await (navigator as any).hid.requestDevice({
      filters: [{ usagePage: 0xff60, usage: 0x61 }],
    });

    if (!devices || devices.length === 0) {
      throw new Error('No compatible Kerf device selected');
    }

    this.device = devices[0];
    await this.device.open();
    this.isConnected = true;

    this.device.addEventListener('inputreport', (event: any) => {
      const { reportId, data } = event;
      const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      this.events.onReport(reportId, bytes);
    });

    (navigator as any).hid.addEventListener('disconnect', (event: any) => {
      if (event.device === this.device) {
        this.close();
        this.events.onDisconnect();
      }
    });
  }

  public async sendReport(reportId: number, data: Uint8Array): Promise<void> {
    if (!this.isConnected || !this.device) {
      throw new Error('HID device is not connected');
    }
    await this.device.sendReport(reportId, data);
  }

  public async close(): Promise<void> {
    if (this.device) {
      try {
        await this.device.close();
      } catch {
        // ignore
      }
      this.device = null;
    }
    this.isConnected = false;
  }

  public get connected(): boolean {
    return this.isConnected;
  }
}
