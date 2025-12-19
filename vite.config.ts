import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      include: /\.(tsx?|jsx?)$/,
    }),
  ],
  resolve: {
    alias: {
      // Our project's src alias
      '@': path.resolve(__dirname, './src'),
      // Force single React instance to prevent "Invalid hook call" errors
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      // Force single emotion instance to prevent styling issues
      '@emotion/react': path.resolve(__dirname, './node_modules/@emotion/react'),
      '@emotion/styled': path.resolve(__dirname, './node_modules/@emotion/styled'),
    },
    dedupe: ['react', 'react-dom'],
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

