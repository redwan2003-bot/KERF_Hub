<div align="center">

# ⚡ KERF HUB — Next-Generation Hardware Configurator

**The official unified Web & Desktop hardware configurator for the ByranTK LP63 mechanical keyboard and the KERF hardware family.**

[![Deploy Web App to GitHub Pages](https://github.com/redwan2003-bot/KERF_Hub/actions/workflows/deploy-pages.yml/badge.svg)](https://redwan2003-bot.github.io/KERF_Hub/)
[![Firmware Matrix CI](https://github.com/redwan2003-bot/KERF_Hub/actions/workflows/firmware.yml/badge.svg)](https://github.com/redwan2003-bot/KERF_Hub/actions/workflows/firmware.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![ZMK Firmware](https://img.shields.io/badge/ZMK_Studio-Compatible-emerald.svg)](https://zmk.dev/)
[![Tauri 2.0](https://img.shields.io/badge/Tauri-v2.0-blue.svg)](https://tauri.app/)

👉 **[Launch Live Web Configurator (Interactive Simulator & WebHID)](https://redwan2003-bot.github.io/KERF_Hub/)** 👈

---

### 🖥️ Software Preview & Interactive Visualizer

```
╔═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║  [K] KERF HUB  v1.0.0      [ kerf_keeb LP63 (Low Profile 65%) ▼ ]    (●) WebHID Live • nice!nano v2    [LOCKED (Fn+Bksp)] ║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║  [⌨ KEYMAP & LAYERS]   [🎨 LIGHTING & BATLED]   [⚡ POWER]   [▶ MACROS]   [📚 PROFILES]   [🖥 DISPLAY]   [⚙ FIRMWARE]   ║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                                                       ║
║    LAYERS:  [ L0: Default ]  [ L1: Function ]                                                                         ║
║                                                                                                                       ║
║    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐    ║
║    │  [K] kerf_keeb LP63  [Low Profile 65%]       ┌───────────────────────────┐      [↺]   (  ◎  )   [↻]         │    ║
║    │      nice!nano v2 • 13x5 • EC12              │ 📶 BT:0 PAIRED  L0:DEFAULT │      Vol-  Dial    Vol+        │    ║
║    │                                              │ KERF-LP63       🔋88% 3.9V │      Media Rotary Dial          │    ║
║    │                                              └───────────────────────────┘                                 │    ║
║    │  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐                            │    ║
║    │  │ ESC │ 1 ! │ 2 @ │ 3 # │ 4 $ │ 5 % │ 6 ^ │ 7 & │ 8 * │ 9 ( │ 0 ) │ - _ │ = + │  Row 0                     │    ║
║    │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤                            │    ║
║    │  │ TAB │  Q  │  W  │  E  │  R  │  T  │  Y  │  U  │  I  │  O  │  P  │ [ { │ ] } │  Row 1                     │    ║
║    │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤                            │    ║
║    │  │CAPS │  A  │  S  │  D  │  F  │  G  │  H  │  J  │  K  │  L  │ ; : │ ' " │ENTER│  Row 2                     │    ║
║    │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤                            │    ║
║    │  │SHIFT│  Z  │  X  │  C  │  V  │  B  │  N  │  M  │ , < │ . > │ / ? │SHIFT│  ▲  │  Row 3                     │    ║
║    │  ├─────┼─────┼─────┼───────────┬─────┬─────┬─────┬─────┼─────┼─────┼─────┼─────┤                            │    ║
║    │  │CTRL │ WIN │ ALT │   SPACE   │ ALT │ FN  │SNIP │CTRL │  ◄  │  ▼  │  ►  │ ⌫   │DEL  Row 4                 │    ║
║    │  └─────┴─────┴─────┴───────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘                            │    ║
║    │   [●] Active Layer: Default (65 physical keys)      ■ Accent   ■ Alpha   ■ Modifier   ■ Kerf/Fn             │    ║
║    └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘    ║
║                                                                                                                       ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

</div>

---

## 📌 What is KERF Hub?

**KERF Hub** is an open-source, industrial-grade hardware management suite and companion app built for **custom wireless mechanical keyboards, macropads, and gaming mice**. 

While traditional firmware configurators (like VIA or standard ZMK Studio) only support basic key remapping, **KERF Hub bridges the gap between low-level firmware and high-level device management** by combining:

1. **Standard ZMK Studio Protocol**: Real-time wireless key remapping without reflashing firmware.
2. **Proprietary KERF Protobuf Extension (Subsystem 4)**: Real-time battery telemetry, 9-pixel RGB underglow controls, custom BatLED power monitoring, onboard macro recording, display canvas editing, and multi-profile switching.
3. **Dual Delivery**: Runs directly in any Chromium browser via **WebHID / WebSerial** (no drivers required) or as an offline, ultra-fast **Tauri 2 native desktop app** for Windows, macOS, and Linux.

---

## 🎯 What is it for?

KERF Hub solves the biggest pain points in DIY and custom mechanical keyboard ownership:

| Challenge with Existing Tools | The KERF Hub Solution |
| :--- | :--- |
| **Reflashing required for small changes** | Dynamic key remapping over WebHID/Serial — changes apply to non-volatile flash instantly in milliseconds. |
| **No display personalization** | Integrated **160×68 nice!view Display Editor** with real-time Floyd-Steinberg 1-bit dithering and wireless canvas flashing. |
| **Zero power & battery insights** | Live millivolt readouts, percentage tracking, BatLED repeat counters, and deep sleep idle tuning. |
| **Locked into a single profile** | 3 independent onboard profiles stored in non-volatile flash (`Work`, `Gaming`, `Creative`). |
| **AI-looking generic web UI** | High-craft mechanical UI with 3D sculpted PBT keycaps, tactile switch depress physics, CNC chassis casing, and realistic knurled metal rotary dial. |

---

## ⌨️ Hardware Architecture — ByranTK LP63

KERF Hub is engineered specifically around the **ByranTK LP63**, an ultra-compact 65% low-profile wireless mechanical keyboard powered by Nordic Semiconductor and ZMK.

### Hardware Specifications
- **MCU**: nice!nano v2 (Nordic Semiconductor **nRF52840**, Bluetooth Low Energy 5.0 + 2.4GHz ESB).
- **Matrix Architecture**: 13 Columns × 5 Rows (65 mechanical switches) driven by a **74HC595 High-Speed Shift Register**.
  - **Shift Register Output Order**: `0, 2, 4, 5, 7, 6, 1, 3` (routed for lowest signal trace capacitance).
- **Display**: **nice!view (160×68)** monochrome Sharp Memory LCD / e-ink ultra-low-power display.
- **Rotary Encoder**: Bourns / Alps **EC12 incremental mechanical dial** mapped to volume / media scroll.
- **Underglow**: 9-pixel individual addressable RGB strip (WS2812B) with **LED 9 dedicated as a hardware BatLED indicator**.
- **Physical Security**: Hardware locking unlocked by physical combo **`Fn + Backspace`** (`&studio_unlock`).

---

## 🔌 Communication Architecture — KERF Protocol

KERF Hub communicates through standard ZMK Studio packet framing (`0xDB` SOF delimiter) multiplexing standard ZMK and proprietary KERF packets:

```
[Browser / Desktop] ──(WebHID / Serial)──> [0xDB Framing Dispatcher]
                                                  │
                ┌─────────────────────────────────┴─────────────────────────────────┐
                ▼                                                                   ▼
       [Subsystems 1..3]                                                   [Subsystem 4: KERF]
   ZMK Core, Keymap & Behaviors                                       Protobuf Extension Service
   - Remap Keys / Layers                                              - RGB Underglow Controls
   - Hold-Tap / Mod-Tap                                               - BatLED Telemetry & Health
   - Physical Unlock Flow                                             - Onboard Macro Recorder
                                                                      - 3 Hardware Profiles
                                                                      - nice!view 160x68 Dithering
```

### Protocol Subsystems

| Subsystem ID | Identifier | Purpose |
| :---: | :--- | :--- |
| **`0x01`** | **Core** | Device handshake, firmware versioning, and physical `&studio_unlock` authorization. |
| **`0x02`** | **Keymap** | Layer manipulation, key remapping, and active layer querying. |
| **`0x03`** | **Behaviors** | Parameterized behaviors (Hold-Tap, Mod-Tap, Layer-Tap). |
| **`0x04`** | **KERF Protocol** | Lighting, BatLED, Power, Macro storage, Profile manager, and Display pipeline. |

---

## ✨ Core Features

### 1. Zero Dummy Data — Authentic Factory Keymaps
Every single key comes pre-configured with the exact factory layout from `byrantk_lp63.keymap`. Switching to **Layer 1 (Function)** reveals hardware-level bindings: `⚡ BatLED` battery health check, `F1`–`F12`, `BT_SEL 0..2`, `RGB_TOG`, `PRINTSCREEN`, `🔓 UNLOCK`, and `⚡ BOOTLOADER`.

### 2. Interactive Sandbox Simulator
Visit the web link without hardware attached to explore the full suite in **Interactive Sandbox Mode**. Remap keys, test layer overlays, preview lighting gradients, and import/export `.kerfprofile` configuration bundles. When real hardware is connected, WebHID takes over seamlessly.

### 3. nice!view 160×68 Display Editor
Upload custom logos, team badges, or typography to flash to your nice!view memory LCD. The built-in image processor supports:
- Automatic aspect ratio cropping to `160×68`.
- High-quality **Floyd-Steinberg error-diffusion dithering**.
- Direct streaming in 64-byte chunks over USB / BLE.

### 4. 16 Hardware Macro Slots
Record keystroke sequences with custom press, hold, and delay timings (`&kmacro 0..15`). Macros are stored in the nRF52840's internal flash and execute at hardware level without needing companion software running.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v20+ LTS
- **pnpm**: v9+ (`npm install -g pnpm`)
- **WebHID Browser**: Google Chrome, Microsoft Edge, Arc, Brave, or Opera (Firefox does not support WebHID).

### 1. Run the Web Remapper Locally

```bash
# Clone the repository
git clone https://github.com/redwan2003-bot/KERF_Hub.git
cd KERF_Hub/kerf-hub

# Install all workspace dependencies
pnpm install

# Run unit tests
pnpm -r test

# Start the Vite development server
pnpm --filter @kerf/web dev
```
Open **`http://localhost:5173`** in your browser.

---

### 2. Run the Native Desktop App (Tauri 2)

```bash
# Ensure Rust is installed
rustc --version

# Run Tauri in dev mode
cd kerf-hub/apps/desktop
pnpm tauri dev
```

---

### 3. Build Firmware Locally (Zephyr / West)

```bash
cd zmk-config-byrantk_lp63

# Initialize West workspace
west init -l config
west update
west zephyr-export

# Compile for nice!nano v2
west build -s zmk/app -b nice_nano_v2 -- -DSHIELD=byrantk_lp63 -DZMK_CONFIG="$(pwd)/config"

# The resulting flashable UF2 binary is located at:
# build/zephyr/zmk.uf2
```

---

## 🔒 Security & Studio Unlock

To prevent malicious websites from silently modifying your keymap over WebHID, the hardware strictly follows **ZMK Studio Security Architecture**:
1. When connected, the keyboard starts in **LOCKED** state.
2. The user must authorize remapping by pressing the physical key combination:
   $$\text{Fn} + \text{Backspace} \quad (\&studio\_unlock)$$
3. The board flashes an amber LED acknowledgement on **LED 9**, authorizing real-time EEPROM writes.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
<b>Crafted for keyboard enthusiasts, makers, and hardware engineers.</b><br/>
<sub>Powered by ZMK Firmware • Zephyr RTOS • React • Tailwind CSS • Tauri</sub>
</div>
