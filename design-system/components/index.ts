/**
 * Syncrofy Design System
 * Material UI-based component library following atomic design principles
 * 
 * @example
 * ```tsx
 * import { Button, Input, Modal, theme } from '@design-system';
 * ```
 */

// Theme - Re-export from theme module
export { theme, palette, typography, components } from '../theme';
export type { Theme } from '../theme';

// Atoms - Base components
export * from './atoms';

// Molecules - Composite components
export * from './molecules';

// Organisms - Complex components
export * from './organisms';

