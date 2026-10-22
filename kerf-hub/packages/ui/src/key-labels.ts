export const DEFAULT_KEY_LABELS: string[] = [
  // Row 0
  'ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
  // Row 1
  'TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']',
  // Row 2
  'CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'ENTER',
  // Row 3
  'LSHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'RSHIFT', 'UP',
  // Row 4
  'LCTRL', 'WIN', 'LALT', 'SPACE', 'RALT', 'MO(1)', 'SNIP', 'RCTRL', 'LEFT', 'DOWN', 'RIGHT', 'BSPC', 'DEL'
];

export interface AvailableKey {
  code: string;
  label: string;
  sublabel?: string;
  category: 'alpha' | 'numeric' | 'mod' | 'nav' | 'media' | 'layer' | 'kerf';
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
  { code: 'N1', label: '1', sublabel: '!', category: 'numeric' },
  { code: 'N2', label: '2', sublabel: '@', category: 'numeric' },
  { code: 'N3', label: '3', sublabel: '#', category: 'numeric' },
  { code: 'N4', label: '4', sublabel: '$', category: 'numeric' },
  { code: 'N5', label: '5', sublabel: '%', category: 'numeric' },
  { code: 'N6', label: '6', sublabel: '^', category: 'numeric' },
  { code: 'N7', label: '7', sublabel: '&', category: 'numeric' },
  { code: 'N8', label: '8', sublabel: '*', category: 'numeric' },
  { code: 'N9', label: '9', sublabel: '(', category: 'numeric' },
  { code: 'N0', label: '0', sublabel: ')', category: 'numeric' },
  { code: 'MINUS', label: '-', sublabel: '_', category: 'numeric' },
  { code: 'EQUAL', label: '=', sublabel: '+', category: 'numeric' },

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
];
