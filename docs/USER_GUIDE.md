# Kerf Hub User Guide & Hardware Reference

Welcome to **Kerf Hub**, the official configurator software for the **kerf_keeb (ByranTK LP63)** custom wireless mechanical keyboard and future Kerf peripherals.

---

## 1. Hardware Specifications: ByranTK LP63

| Component | Specification |
|---|---|
| **Form Factor** | 65-key ANSI + rotary clickable encoder |
| **Microcontroller** | nice!nano v2 (Nordic nRF52840 SoC) |
| **Display** | 160 × 68 Sharp Memory LCD (nice!view) on SPI0 (CS: `D15`) |
| **Key Matrix** | 8 rows × 9 columns (`row2col`), 74HC595 shift register on SPI0 (CS: `D14`) |
| **Shift Register Rows** | `0, 2, 4, 5, 7, 6, 1, 3` |
| **Matrix Columns** | `D8, D9, D2, D3, D4, D5, D6, D7, D21` (`D21` = `P0.31`) |
| **Rotary Encoder** | Pins `D0` (A), `D1` (B), Click switch mapped to matrix |
| **LED Chain** | 9 × WS2812B on SPI1 MOSI (`D19` / `P0.10`), EXT_POWER rail on `D20` (`P0.13` VCC hog) |
| **LED Allocation** | Pixels 0–7: RGB Underglow; Pixel 8 (LED 9): Dedicated Battery Indicator |
| **USB Identifiers** | Vendor ID: `0x1D50`, Product ID: `0x615E` |

---

## 2. Connecting to Kerf Hub

Kerf Hub is available both as a modern web application and a native desktop application.

### Web Application (Chrome, Edge, Opera)
1. Open Kerf Hub in any Chromium-based web browser.
2. Click **Connect** in the top navigation bar.
3. Select your keyboard in the WebSerial prompt (ZMK Studio keymap remapping) and WebHID prompt (lighting, macros, profiles, battery).

### Native Desktop Application (Windows, macOS)
1. Download and run the **Kerf Hub Desktop App**.
2. Connect your keyboard via USB-C or Bluetooth LE.
3. The desktop app connects automatically through native `hidapi` and `serialport` Rust transports with zero setup required.

---

## 3. Security & Unlock Flow

To protect against unauthorized key remapping or settings tampering:
1. When Kerf Hub connects, the keyboard enters a protected **LOCKED** state.
2. To unlock for editing:
   - Click **Unlock Device** in the app.
   - Press the physical unlock combination on the keyboard: **`Fn + Backspace`** (`&studio_unlock`).
3. The lock indicator turns green, enabling real-time key remapping, lighting changes, macro editing, and profile modifications.

---

## 4. BatLED Battery Indicator (`&batled`)

Pixel 8 (the 9th LED in the chain) serves as a dedicated, low-power battery health indicator:
- **Tap `&batled` key**: Shows battery percentage for 1.0 second and turns off.
- **Hold `&batled` key**: Holds battery color indicator continuously until release (capped at 10 seconds maximum to prevent accidental battery drain).

### Battery Color Codes
- 🟢 **Solid Green**: 70% – 100% battery
- 🟡 **Solid Yellow**: 30% – 69% battery
- 🔴 **Solid Red**: 10% – 29% battery
- 🚨 **Blinking Red**: < 10% (Critical battery level)

*Note: While connected via USB, the indicator shows cyan to reflect USB power/charging status.*

---

## 5. Keymap & Macro Configuration

### Real-Time Remapping
- Click any key position on the interactive 65-key visualizer.
- Choose from standard alphas, numeric keys, modifiers, navigation, or dedicated Kerf features (`&batled`, `&studio_unlock`, `&kmacro 0..15`).
- Changes take effect immediately without reflashing.

### Onboard Macros (`&kmacro`)
- **16 Hardware Slots** (Slots 0 to 15), each supporting up to **64 sequential keystroke steps**.
- **Interactive Recorder**: Click "Record" and type naturally to capture exact keypresses and millisecond delays.
- **Quick Text Generator**: Enter frequently typed strings (e.g., shell commands, email signatures) to generate instant tap sequences.

---

## 6. Onboard Profiles & `.kerfprofile` Files

Kerf Hub supports **3 complete onboard profiles** saved in internal flash:
- Each profile stores:
  1. Complete keymap layers
  2. RGB underglow and BatLED configuration
  3. Power settings (debounce press/release ms, idle/deep sleep timeouts)
  4. All 16 macro slots
- **Profile Switching**: Switch active profile in the app or via key shortcut. Profile state is retained across reboots.
- **Exporting & Sharing**: Export any profile to a portable `.kerfprofile` JSON file to back up your setup or share with other Kerf users.

---

## 7. Firmware Updates & Fail-Safe Recovery

### One-Click Update Flow
1. Navigate to the **FIRMWARE & UF2** tab in Kerf Hub.
2. Click **Reboot to Bootloader**. The keyboard will restart into UF2 mass storage mode.
3. Select the target `.uf2` file and choose the mounted `NICENANO` USB drive. The firmware streams directly to the controller and reboots.

### 🛡️ Hardware Recovery Guarantee
Even if an update is interrupted or the power cable is disconnected:
- **Your keyboard cannot be bricked.**
- Simply **double-tap the physical reset button** on the side of the keyboard (or short the RST pin to GND twice within 500 ms).
- The Adafruit UF2 ROM bootloader will immediately remount the `NICENANO` USB flash drive, allowing you to drag-and-drop a working `.uf2` binary anytime.
