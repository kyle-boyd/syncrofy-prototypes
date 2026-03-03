import { PaletteOptions } from '@mui/material/styles';

/**
 * Custom color palette extending MUI's default palette
 * Based on design system color #89C3E1 (light blue) as reference
 */
export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#266079',
    light: '#5a85a1', // lighter shade for hover/active
    dark: '#17374a', // darker shade for active
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#424242',
    light: '#6d6d6d',
    dark: '#1b1b1b',
    contrastText: '#ffffff',
  },
  error: {
    main: '#C73A3A',
    light: '#e26b6b',
    dark: '#a22b2b',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#8F6C1A',
    light: '#b59754',
    dark: '#634b12',
    contrastText: '#ffffff',
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#ffffff',
  },
  success: {
    main: '#067A57',
    light: '#52a288',
    dark: '#045c41',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
  background: {
    default: '#FAFCFC',
    paper: '#FFFFFF',
  },
  divider: '#E5E7EB',
};

