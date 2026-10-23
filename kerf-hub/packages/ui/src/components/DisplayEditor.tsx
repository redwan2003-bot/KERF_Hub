import React, { useState, useRef, useEffect } from 'react';
import { WidgetConfig, DISPLAY_WIDTH, DISPLAY_HEIGHT } from '@kerf/protocol';
import { ditherImage, pack1BitBitmap, DitherAlgorithm } from '@kerf/image';
import { Monitor, Upload, Play, Square, RotateCw, Contrast, Check, Sparkles, Battery, Layers, Cpu } from 'lucide-react';

export interface DisplayEditorProps {
  config: WidgetConfig;
  onChangeConfig: (cfg: Partial<WidgetConfig>) => void;
  onUploadFrame: (frameIdx: number, frameBytes: Uint8Array, onProgress?: (pct: number) => void) => Promise<void>;
  disabled?: boolean;
}

export const DisplayEditor: React.FC<DisplayEditorProps> = ({
  config,
  onChangeConfig,
  onUploadFrame,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ditherAlgorithm, setDitherAlgorithm] = useState<DitherAlgorithm>('atkinson');
  const [currentBitmap, setCurrentBitmap] = useState<Uint8Array | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(3); // 3x zoom default for 160x68
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Draw on canvas whenever config or bitmap changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = config.invertColors ? '#ffffff' : '#0c0d0e';
    ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

    // If custom bitmap loaded, draw pixels (1 = white, 0 = black)
    if (currentBitmap) {
      const imgData = ctx.createImageData(DISPLAY_WIDTH, DISPLAY_HEIGHT);
      for (let i = 0; i < currentBitmap.length; i++) {
        const pixelOn = currentBitmap[i] === 1;
        const color = (pixelOn !== config.invertColors) ? 255 : 0;
        const idx = i * 4;
        imgData.data[idx] = color;
        imgData.data[idx + 1] = color;
        imgData.data[idx + 2] = color;
        imgData.data[idx + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Render widget overlays
    ctx.font = '8px monospace';
    ctx.fillStyle = config.invertColors ? '#000000' : '#ffffff';

    if (config.showBattery) {
      ctx.fillText('BAT: 88% [===]', 4, 10);
    }
    if (config.showLayer) {
      ctx.fillText('LAYER: 0 [DEF]', 4, 22);
    }
    if (config.showBtProfile) {
      ctx.fillText('OUT: USB', 105, 10);
    }
    if (config.showCapsLock) {
      ctx.fillText('CAPS: OFF', 105, 22);
    }
    if (config.showWpm) {
      ctx.fillText('WPM: 74', 4, 62);
    }
    if (config.showClock) {
      ctx.fillText('12:45', 125, 62);
    }
  }, [config, currentBitmap]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      // Create offscreen canvas to scale/crop to 160x68
      const offscreen = document.createElement('canvas');
      offscreen.width = DISPLAY_WIDTH;
      offscreen.height = DISPLAY_HEIGHT;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
      const imgData = offCtx.getImageData(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

      // Convert to grayscale Float32Array
      const gray = new Float32Array(DISPLAY_WIDTH * DISPLAY_HEIGHT);
      for (let i = 0; i < gray.length; i++) {
        const r = imgData.data[i * 4];
        const g = imgData.data[i * 4 + 1];
        const b = imgData.data[i * 4 + 2];
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      }

      // Apply selected dither algorithm
      const dithered = ditherImage(gray, DISPLAY_WIDTH, DISPLAY_HEIGHT, ditherAlgorithm);

      setCurrentBitmap(dithered);
      setStatusMessage(`Loaded image: ${file.name} (Cropped to 160x68 1-bit)`);
    };
  };

  const handleUploadToKeyboard = async () => {
    if (!currentBitmap) {
      alert('Please upload or generate an image first.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setStatusMessage('Packaging 1,360-byte frame buffer...');

      const packed = pack1BitBitmap(currentBitmap, DISPLAY_WIDTH, DISPLAY_HEIGHT);

      await onUploadFrame(0, packed, (pct) => {
        setUploadProgress(pct);
        setStatusMessage(`Streaming chunks: ${pct}% complete...`);
      });

      setStatusMessage('Display frame successfully flashed to nice!view flash memory!');
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
      setStatusMessage(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Monitor className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              nice!view 160×68 Display Editor
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
                1-bit Sharp Memory LCD
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Custom status screens, Floyd–Steinberg & Atkinson dithering, and ultra-low power hold (&lt;10 µA).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium border border-zinc-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            Upload Image / GIF
          </button>
          <button
            type="button"
            disabled={disabled || !currentBitmap || isUploading}
            onClick={handleUploadToKeyboard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold transition-all disabled:opacity-50 shadow-md shadow-amber-500/10"
          >
            <Sparkles className="w-4 h-4" />
            Flash to nice!view
          </button>
        </div>
      </div>

      {/* Display Canvas Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col items-center gap-6">
        <div className="flex items-center justify-between w-full border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span>Scale:</span>
              {[2, 3, 4].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setZoomScale(scale)}
                  className={`px-2 py-0.5 rounded text-xs font-mono ${
                    zoomScale === scale
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {scale}x
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
              <span>Dither:</span>
              {(['atkinson', 'floyd-steinberg', 'threshold'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDitherAlgorithm(mode)}
                  className={`px-2 py-0.5 rounded text-xs font-mono capitalize ${
                    ditherAlgorithm === mode
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mode === 'floyd-steinberg' ? 'Floyd' : mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => onChangeConfig({ invertColors: !config.invertColors })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                config.invertColors
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              <Contrast className="w-3.5 h-3.5" />
              Invert Colors
            </button>
            <button
              type="button"
              onClick={() => onChangeConfig({ rotate180: !config.rotate180 })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                config.rotate180
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Rotate 180°
            </button>
          </div>
        </div>

        {/* Live Pixel Preview Canvas */}
        <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center shadow-inner">
          <canvas
            ref={canvasRef}
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            style={{
              width: DISPLAY_WIDTH * zoomScale,
              height: DISPLAY_HEIGHT * zoomScale,
              imageRendering: 'pixelated',
            }}
            className="border-2 border-zinc-700 rounded shadow-2xl"
          />
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="w-full max-w-md flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Streaming 1,360-byte frame...</span>
              <span className="font-bold text-amber-400">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {statusMessage && (
          <p className="text-xs font-mono text-zinc-400 text-center">{statusMessage}</p>
        )}
      </div>

      {/* Widget Overlay Controls Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          On-Screen Status Widgets
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'showBattery', label: 'Battery % Bar', icon: Battery },
            { key: 'showLayer', label: 'Active Layer', icon: Layers },
            { key: 'showBtProfile', label: 'Output / BT Profile', icon: Cpu },
            { key: 'showCapsLock', label: 'Caps Lock Indicator', icon: Sparkles },
            { key: 'showWpm', label: 'Live WPM Counter', icon: Play },
            { key: 'showClock', label: 'Clock Widget', icon: Square },
          ].map((item) => {
            const isEnabled = (config as any)[item.key];
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                disabled={disabled}
                onClick={() => onChangeConfig({ [item.key]: !isEnabled })}
                className={`p-3 rounded-lg border flex items-center justify-between text-left transition-colors ${
                  isEnabled
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isEnabled && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
