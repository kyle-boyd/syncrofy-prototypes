import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { existsSync } from 'fs';
import { designSystemAlias } from './vite-plugin-ds-alias';

// Determine design system path - prefer submodule, then local copy, then relative path for dev
const submoduleDsPath = path.resolve(__dirname, './design-system/src');
const localDsPath = path.resolve(__dirname, './design-system');
const relativeDsPath = path.resolve(__dirname, '../syncrofy-ds/src');
const designSystemPath = existsSync(submoduleDsPath) 
  ? submoduleDsPath 
  : (existsSync(localDsPath) ? localDsPath : relativeDsPath);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: /\.(tsx?|jsx?)$/,
    }),
    designSystemAlias(),
  ],
  resolve: {
    alias: {
      // Our project's src alias
      '@': path.resolve(__dirname, './src'),
      // Design system alias - use this to import from design system
      '@ds': designSystemPath,
      // Force single React instance to prevent "Invalid hook call" errors
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      // Force single emotion instance to prevent styling issues
      '@emotion/react': path.resolve(__dirname, './node_modules/@emotion/react'),
      '@emotion/styled': path.resolve(__dirname, './node_modules/@emotion/styled'),
    },
  },
  optimizeDeps: {
    // Ensure design system dependencies are optimized
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
    ],
  },
  esbuild: {
    jsx: 'automatic',
    // Ignore TypeScript errors for Grid component (MUI v7 type definitions issue)
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  build: {
    // Don't fail on TypeScript errors - Vite handles compilation
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript-related warnings during build
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        warn(warning);
      },
    },
  },
});

