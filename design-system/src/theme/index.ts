import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

/**
 * Main theme configuration extending MUI's default theme
 * Combines custom palette, typography, and component overrides
 */

// Custom elevation/shadow values per Figma-exported CSS
const shadows = [
  'none', // Elevation 0 (none)
  '0px 2px 4px -2px rgba(0, 0, 0, 0.08), 0px 1px 2px -2px rgba(0, 0, 0, 0.04)', // 1Button
  '0px 2px 2px -2px rgba(0, 0, 0, 0.05), 0px 2px 3px -2px rgba(0, 0, 0, 0.1)', // 2
  '0px 3px 4px -2px rgba(0, 0, 0, 0.08), 0px 2px 5px -2px rgba(0, 0, 0, 0.12)', // 3
  '0px 3px 4px -2px rgba(0, 0, 0, 0.08), 0px 2px 5px -2px rgba(0, 0, 0, 0.12)', // 4Raised (repeat 3)
  '0px 3px 4px -2px rgba(0, 0, 0, 0.08), 0px 2px 5px -2px rgba(0, 0, 0, 0.12)', // 5 (repeat 3)
  '0px 3px 4px -2px rgba(0, 0, 0, 0.08), 0px 2px 5px -2px rgba(0, 0, 0, 0.12)', // 6 (repeat 3)
  '0px 3px 4px -2px rgba(0, 0, 0, 0.08), 0px 2px 5px -2px rgba(0, 0, 0, 0.12)', // 7 (repeat 3)
  '0px 3px 4px -2px rgba(0, 0, 0, 0.08), 0px 2px 5px -2px rgba(0, 0, 0, 0.12)', // 8
  '0px 3px 4px -2px rgba(0, 0, 0, 0.08), 0px 2px 5px -2px rgba(0, 0, 0, 0.12)', // 9
  '0px 20px 24px -4px rgba(0, 0, 0, 0.08), 0px 8px 8px -4px rgba(0, 0, 0, 0.04)', // 10Overlay
  '0px 6px 7px -4px rgba(0, 0, 0, 0.2), 0px 11px 15px 1px rgba(0, 0, 0, 0.14), 0px 4px 20px 3px rgba(0, 0, 0, 0.12)', // 11
  '0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)', // 12
  '0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12)', // 13
  '0px 7px 9px -4px rgba(0, 0, 0, 0.2), 0px 14px 21px 2px rgba(0, 0, 0, 0.14), 0px 5px 26px 4px rgba(0, 0, 0, 0.12)', // 14
  '0px 8px 9px -5px rgba(0, 0, 0, 0.2), 0px 15px 22px 2px rgba(0, 0, 0, 0.14), 0px 6px 28px 5px rgba(0, 0, 0, 0.12)', // 15
  '0px 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)', // 16
  '0px 8px 11px -5px rgba(0, 0, 0, 0.2), 0px 17px 26px 2px rgba(0, 0, 0, 0.14), 0px 6px 32px 5px rgba(0, 0, 0, 0.12)', // 17
  '0px 9px 11px -5px rgba(0, 0, 0, 0.2), 0px 18px 28px 2px rgba(0, 0, 0, 0.14), 0px 7px 34px 6px rgba(0, 0, 0, 0.12)', // 18
  '0px 9px 12px -6px rgba(0, 0, 0, 0.2), 0px 19px 29px 2px rgba(0, 0, 0, 0.14), 0px 7px 36px 6px rgba(0, 0, 0, 0.12)', // 19
  '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 20px 31px 3px rgba(0, 0, 0, 0.14), 0px 8px 38px 7px rgba(0, 0, 0, 0.12)', // 20
  '0px 10px 13px -6px rgba(0, 0, 0, 0.2), 0px 21px 33px 3px rgba(0, 0, 0, 0.14), 0px 8px 40px 7px rgba(0, 0, 0, 0.12)', // 21
  '0px 10px 14px -6px rgba(0, 0, 0, 0.2), 0px 22px 35px 3px rgba(0, 0, 0, 0.14), 0px 8px 42px 7px rgba(0, 0, 0, 0.12)', // 22
  '0px 11px 14px -7px rgba(0, 0, 0, 0.2), 0px 23px 36px 3px rgba(0, 0, 0, 0.14), 0px 9px 44px 8px rgba(0, 0, 0, 0.12)', // 23
  '0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)', // 24
];

export const theme = createTheme({
  palette,
  typography,
  components,
  shadows, // <-- inject custom Figma-elevation array here
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // Base spacing unit (8px)
});

// Export theme type for TypeScript support
export type Theme = typeof theme;

// Re-export palette and typography for direct access if needed
export { palette } from './palette';
export { typography } from './typography';
export { components } from './components';
