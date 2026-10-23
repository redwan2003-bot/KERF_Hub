export const DEFAULT_KEY_LABELS: string[] = [
  // Row 0 (13 keys)
  'ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
  // Row 1 (13 keys)
  'TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']',
  // Row 2 (13 keys)
  'CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER',
  // Row 3 (13 keys)
  'LSHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'RSHIFT', 'UP',
  // Row 4 (13 keys)
  'LCTRL', 'WIN', 'LALT', 'SPACE', 'RALT', 'MO(1)', 'SNIP', 'RCTRL', 'LEFT', 'DOWN', 'RIGHT', 'BSPC', 'DEL'
];

export interface KeyDisplayInfo {
  label: string;
  sublabel?: string;
  category: 'alpha' | 'numeric' | 'mod' | 'nav' | 'media' | 'layer' | 'kerf' | 'macro' | 'accent' | 'transparent';
}

const SUBLEGENDS: Record<string, string> = {
  '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
  '-': '_', '=': '+', '[': '{', ']': '}', ';': ':',
  "'": '"', ',': '<', '.': '>', '/': '?'
};

export function getKeyDisplayInfo(
  index: number,
  binding?: { behaviorId?: string; param1?: number } | null
): KeyDisplayInfo {
  const rawId = binding?.behaviorId ? binding.behaviorId.trim() : DEFAULT_KEY_LABELS[index] || `K${index}`;
  const upper = rawId.toUpperCase();

  if (upper === 'TRANS' || rawId === '▽') {
    return { label: '▽', sublabel: 'Trans', category: 'transparent' };
  }

  if (SUBLEGENDS[rawId]) {
    return {
      label: rawId,
      sublabel: SUBLEGENDS[rawId],
      category: /[0-9]/.test(rawId) ? 'numeric' : 'alpha',
    };
  }

  switch (upper) {
    case 'ESC':
      return { label: 'ESC', category: 'accent' };
    case 'ENTER':
    case 'RET':
      return { label: 'ENTER ↵', category: 'accent' };
    case 'SPACE':
      return { label: 'SPACE', category: 'mod' };
    case 'TAB':
      return { label: 'TAB ⇥', category: 'mod' };
    case 'CAPS':
    case 'CLCK':
      return { label: 'CAPS', category: 'mod' };
    case 'SHIFT':
    case 'LSHIFT':
    case 'RSHIFT':
    case 'LSHFT':
    case 'RSHFT':
      return { label: 'SHIFT ⇧', category: 'mod' };
    case 'CTRL':
    case 'LCTRL':
    case 'RCTRL':
      return { label: 'CTRL', category: 'mod' };
    case 'WIN':
    case 'LGUI':
    case 'RGUI':
      return { label: 'WIN ❖', category: 'mod' };
    case 'ALT':
    case 'LALT':
    case 'RALT':
      return { label: 'ALT', category: 'mod' };
    case 'BSPC':
    case 'BACKSPACE':
      return { label: '⌫ BSPC', category: 'mod' };
    case 'DEL':
    case 'DELETE':
      return { label: 'DEL', category: 'mod' };
    case 'UP':
      return { label: '▲', category: 'nav' };
    case 'DOWN':
      return { label: '▼', category: 'nav' };
    case 'LEFT':
      return { label: '◄', category: 'nav' };
    case 'RIGHT':
      return { label: '►', category: 'nav' };
    case 'MO(1)':
      return { label: 'FN', sublabel: 'Layer 1', category: 'layer' };
    case 'SNIP':
      return { label: 'SNIP ✂', sublabel: 'Win+Shift+S', category: 'kerf' };
    case 'BATLED':
      return { label: '⚡ BatLED', sublabel: 'LED 9 Check', category: 'kerf' };
    case 'STUDIO_UNLOCK':
    case 'UNLOCK':
      return { label: '🔓 UNLOCK', sublabel: 'Fn+Bksp', category: 'kerf' };
    case 'BOOTLOADER':
    case 'BOOT':
      return { label: '⚡ BOOT', sublabel: 'DFU Mode', category: 'kerf' };
    case 'RGB TOG':
    case 'RGB_TOG':
      return { label: 'RGB TOG', sublabel: 'Underglow', category: 'kerf' };
    case 'RGB EFF':
    case 'RGB_EFF':
      return { label: 'RGB EFF', sublabel: 'Next Mode', category: 'kerf' };
    case 'RGB HUI':
    case 'RGB_HUI':
      return { label: 'HUE +', sublabel: 'Color', category: 'kerf' };
    case 'RGB SAI':
    case 'RGB_SAI':
      return { label: 'SAT +', sublabel: 'Chroma', category: 'kerf' };
    case 'RGB BRI':
    case 'RGB_BRI':
      return { label: 'BRI +', sublabel: 'Lumen', category: 'kerf' };
    case 'RGB HUD':
    case 'RGB_HUD':
      return { label: 'HUE -', sublabel: 'Color', category: 'kerf' };
    case 'RGB SAD':
    case 'RGB_SAD':
      return { label: 'SAT -', sublabel: 'Chroma', category: 'kerf' };
    case 'RGB BRD':
    case 'RGB_BRD':
      return { label: 'BRI -', sublabel: 'Lumen', category: 'kerf' };
    case 'RGB EFR':
    case 'RGB_EFR':
      return { label: 'EFF -', sublabel: 'Prev Mode', category: 'kerf' };
    case 'PRINTSCREEN':
    case 'PRINT':
      return { label: 'PRT SCN', category: 'media' };
    case 'HOME':
    case 'END':
    case 'PG UP':
    case 'PG_UP':
    case 'PG DN':
    case 'PG_DN':
      return { label: upper.replace('_', ' '), category: 'nav' };
    default:
      if (upper.startsWith('BT ')) {
        return { label: upper, sublabel: 'Bluetooth', category: 'media' };
      }
      if (upper.startsWith('KMACRO_') || upper.startsWith('M')) {
        return { label: upper.replace('KMACRO_', 'M'), sublabel: 'Macro', category: 'macro' };
      }
      return {
        label: rawId,
        category: /^[A-Z]$/.test(upper) ? 'alpha' : 'mod',
      };
  }
}

export interface AvailableKey {
  code: string;
  label: string;
  sublabel?: string;
  category: 'alpha' | 'numeric' | 'mod' | 'nav' | 'media' | 'layer' | 'kerf' | 'macro';
}

export const PALETTE_KEYS: AvailableKey[] = [
  // Alphas
  { code: 'A', label: 'A', category: 'alpha' },
  { code: 'B', label: 'B', category: 'alpha' },
  { code: 'C', label: 'C', category: 'alpha' },
  { code: 'D', label: 'D', category: 'alpha' },
  { code: 'E', label: 'E', category: 'alpha' },
  { code: 'F', label: 'F', category: 'alpha' },
  { code: 'G', label: 'G', category: 'alpha' },
  { code: 'H', label: 'H', category: 'alpha' },
  { code: 'I', label: 'I', category: 'alpha' },
  { code: 'J', label: 'J', category: 'alpha' },
  { code: 'K', label: 'K', category: 'alpha' },
  { code: 'L', label: 'L', category: 'alpha' },
  { code: 'M', label: 'M', category: 'alpha' },
  { code: 'N', label: 'N', category: 'alpha' },
  { code: 'O', label: 'O', category: 'alpha' },
  { code: 'P', label: 'P', category: 'alpha' },
  { code: 'Q', label: 'Q', category: 'alpha' },
  { code: 'R', label: 'R', category: 'alpha' },
  { code: 'S', label: 'S', category: 'alpha' },
  { code: 'T', label: 'T', category: 'alpha' },
  { code: 'U', label: 'U', category: 'alpha' },
  { code: 'V', label: 'V', category: 'alpha' },
  { code: 'W', label: 'W', category: 'alpha' },
  { code: 'X', label: 'X', category: 'alpha' },
  { code: 'Y', label: 'Y', category: 'alpha' },
  { code: 'Z', label: 'Z', category: 'alpha' },

  // Numbers & Symbols
  { code: '1', label: '1', sublabel: '!', category: 'numeric' },
  { code: '2', label: '2', sublabel: '@', category: 'numeric' },
  { code: '3', label: '3', sublabel: '#', category: 'numeric' },
  { code: '4', label: '4', sublabel: '$', category: 'numeric' },
  { code: '5', label: '5', sublabel: '%', category: 'numeric' },
  { code: '6', label: '6', sublabel: '^', category: 'numeric' },
  { code: '7', label: '7', sublabel: '&', category: 'numeric' },
  { code: '8', label: '8', sublabel: '*', category: 'numeric' },
  { code: '9', label: '9', sublabel: '(', category: 'numeric' },
  { code: '0', label: '0', sublabel: ')', category: 'numeric' },
  { code: '-', label: '-', sublabel: '_', category: 'numeric' },
  { code: '=', label: '=', sublabel: '+', category: 'numeric' },

  // Modifiers & Navigation
  { code: 'LSHIFT', label: 'Shift', category: 'mod' },
  { code: 'LCTRL', label: 'Ctrl', category: 'mod' },
  { code: 'LALT', label: 'Alt', category: 'mod' },
  { code: 'LGUI', label: 'Win/Cmd', category: 'mod' },
  { code: 'SPACE', label: 'Space', category: 'mod' },
  { code: 'ENTER', label: 'Enter', category: 'mod' },
  { code: 'BSPC', label: 'Backspace', category: 'mod' },
  { code: 'TAB', label: 'Tab', category: 'mod' },
  { code: 'ESC', label: 'Esc', category: 'mod' },
  { code: 'UP', label: '↑', category: 'nav' },
  { code: 'DOWN', label: '↓', category: 'nav' },
  { code: 'LEFT', label: '←', category: 'nav' },
  { code: 'RIGHT', label: '→', category: 'nav' },

  // Kerf Features
  { code: 'BATLED', label: 'BatLED (&batled)', sublabel: 'LED9 battery check', category: 'kerf' },
  { code: 'STUDIO_UNLOCK', label: 'Unlock (&studio_unlock)', sublabel: 'Fn+Bksp security unlock', category: 'kerf' },
  { code: 'SNIP', label: 'Snip (Win+Shift+S)', sublabel: 'Screenshot key', category: 'kerf' },
  { code: 'RGB_TOG', label: 'RGB Toggle', category: 'kerf' },
  { code: 'RGB_EFF', label: 'RGB Next Effect', category: 'kerf' },

  // Macros (&kmacro 0..15)
  ...Array.from({ length: 16 }, (_, i) => ({
    code: `KMACRO_${i}`,
    label: `M${i}`,
    sublabel: `&kmacro ${i}`,
    category: 'macro' as const,
  })),
];
