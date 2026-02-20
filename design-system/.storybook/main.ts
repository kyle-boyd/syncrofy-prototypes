import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Disable hostname security check for development
process.env.CONFIG_TYPE = 'PRODUCTION';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  previewHead: (head) => `
    <script>
      // Disable the Vite app loading error handler
      window.__onViteAppLoadingError = function(event) {
        // Do nothing - disable hostname security check
      };
      // Also override any script onerror handlers
      window.addEventListener('error', function(e) {
        if (e.target && e.target.tagName === 'SCRIPT' && e.target.src && e.target.src.includes('vite-app.js')) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    </script>
    ${head}
  `,
  addons: [
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@': path.resolve(__dirname, '../src'),
        },
      },
      server: {
        ...config.server,
        host: 'localhost',
        allowedHosts: ['localhost', '127.0.0.1'],
      },
    };
  },
  typescript: {
    check: false,
    skipCompiler: true,
  },
  docs: {
    autodocs: true,
  },
};

export default config;