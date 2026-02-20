import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  snapshotDir: './tests/visual-regression/__screenshots__',

  use: {
    baseURL: 'http://localhost:6006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true, // Use headless mode
  },

  projects: [
    {
      name: 'visual-regression',
      testDir: './tests/visual-regression',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  expect: {
    toHaveScreenshot: {
      // An acceptable amount of pixels that could be different pixels.
      maxDiffPixels: 100,
    },
  },
});
