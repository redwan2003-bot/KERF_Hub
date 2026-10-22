import { FrameStreamDecoder, encodeFrame } from '../framing';

export interface TransportEvents {
  onFrame: (frame: Uint8Array) => void;
  onDisconnect: () => void;
  onError: (err: Error) => void;
}

export class WebSerialTransport {
  private port: any = null;
  private reader: any = null;
  private writer: any = null;
  private decoder = new FrameStreamDecoder();
  private isOpen = false;
  private readLoopActive = false;

  constructor(private events: TransportEvents) {}

  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public async connect(): Promise<void> {
    if (!WebSerialTransport.isSupported()) {
      throw new Error('WebSerial is not supported in this browser. Please use Chrome, Edge, or Opera.');
    }

    // Request USB port from user
    this.port = await (navigator as any).serial.requestPort();
    await this.port.open({ baudRate: 115200 });
    this.isOpen = true;

    this.writer = this.port.writable.getWriter();
    this.startReadLoop();
  }

  public async send(payload: Uint8Array): Promise<void> {
    if (!this.isOpen || !this.writer) {
      throw new Error('Transport is not open');
    }
    const framed = encodeFrame(payload);
    await this.writer.write(framed);
  }

  private async startReadLoop(): Promise<void> {
    this.readLoopActive = true;
    this.decoder.reset();

    try {
      while (this.port.readable && this.readLoopActive) {
        this.reader = this.port.readable.getReader();
        try {
          while (true) {
            const { value, done } = await this.reader.read();
            if (done) break;
            if (value) {
              const frames = this.decoder.push(value);
              for (const frame of frames) {
                this.events.onFrame(frame);
              }
            }
          }
        } finally {
          this.reader.releaseLock();
        }
      }
    } catch (err: any) {
      if (this.readLoopActive) {
        this.events.onError(err);
      }
    } finally {
      this.close();
      this.events.onDisconnect();
    }
  }

  public async close(): Promise<void> {
    this.readLoopActive = false;
    this.isOpen = false;

    if (this.writer) {
      try {
        await this.writer.close();
      } catch {
        // ignore
      }
      this.writer = null;
    }

    if (this.port) {
      try {
        await this.port.close();
      } catch {
        // ignore
      }
      this.port = null;
    }
  }

  public get connected(): boolean {
    return this.isOpen;
  }
}
