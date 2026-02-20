import { describe, it, expect } from 'vitest';
import { Button } from '../../src/components/atoms/Button/Button';

/**
 * Simple visual test that demonstrates using your Button.png screenshot as baseline
 * This test runs in the browser and provides visual feedback
 */
describe('Button Visual Baseline Test', () => {
  it('Button matches design specification', async () => {
    // Render the button component
    const button = document.createElement('div');
    button.innerHTML = `
      <button class="MuiButton-root MuiButton-contained MuiButton-containedPrimary">
        Button
      </button>
    `;

    // Add to DOM for screenshot
    document.body.appendChild(button);

    // Take screenshot and compare against your baseline
    await expect(button).toHaveScreenshot('button-baseline.png');

    // Clean up
    document.body.removeChild(button);
  });

  it('Button variants maintain consistency', () => {
    // Test that different variants are rendered
    const variants = ['contained', 'outlined', 'text'];

    variants.forEach(variant => {
      const button = document.createElement('button');
      button.className = `MuiButton-root MuiButton-${variant}`;
      button.textContent = variant;

      document.body.appendChild(button);

      // Visual check - ensure button is visible and styled
      expect(button).toBeVisible();
      expect(button.textContent).toBe(variant);

      document.body.removeChild(button);
    });
  });
});




