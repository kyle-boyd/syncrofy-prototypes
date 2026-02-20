import { test, expect } from '@playwright/test';
import { composeStories } from '@storybook/react';
import * as stories from '../../src/components/atoms/Button/Button.stories';

const { Primary, Secondary, Outlined, Text, Small, Medium, Large, Disabled, FullWidth } = composeStories(stories);

test.describe('Button Component Visual Regression', () => {
  test('Primary Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--primary`);

    // Wait for the story to load
    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    // Take screenshot of the button
    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-primary.png', {
      threshold: 0.1, // Allow for small differences
    });
  });

  test('Secondary Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--secondary`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-secondary.png', {
      threshold: 0.1,
    });
  });

  test('Outlined Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--outlined`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-outlined.png', {
      threshold: 0.1,
    });
  });

  test('Text Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--text`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-text.png', {
      threshold: 0.1,
    });
  });

  test('Small Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--small`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-small.png', {
      threshold: 0.1,
    });
  });

  test('Medium Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--medium`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-medium.png', {
      threshold: 0.1,
    });
  });

  test('Large Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--large`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-large.png', {
      threshold: 0.1,
    });
  });

  test('Disabled Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--disabled`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-disabled.png', {
      threshold: 0.1,
    });
  });

  test('Full Width Button matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-button--full-width`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const buttonElement = page.locator('[data-testid="storybook-preview-wrapper"] .MuiButton-root');
    await expect(buttonElement).toHaveScreenshot('button-fullwidth.png', {
      threshold: 0.1,
    });
  });
});




