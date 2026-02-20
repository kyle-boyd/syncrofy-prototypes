import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';

// Set up Storybook's testing environment
beforeAll(() => {
  setProjectAnnotations([
    {
      parameters: {
        // Configure your testing parameters here
      },
    },
  ]);
});