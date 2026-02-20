import { beforeAll } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '../../src/theme';

// Set up global test environment
beforeAll(() => {
  // Create a container for tests
  const testContainer = document.createElement('div');
  testContainer.id = 'test-root';
  document.body.appendChild(testContainer);

  // Wrap with theme provider
  const root = document.createElement('div');
  root.innerHTML = `
    <div id="theme-wrapper">
      <div id="test-content"></div>
    </div>
  `;

  testContainer.appendChild(root);
});




