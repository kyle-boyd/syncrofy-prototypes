import { test, expect } from '@playwright/test';
import { composeStories } from '@storybook/react';
import * as stories from '../../src/components/molecules/SegmentedControl/SegmentedControl.stories';

const { TextMedium, TextSmall, IconsMedium, IconsSmall } = composeStories(stories);

test.describe('SegmentedControl Component Visual Regression', () => {
  test('Text Medium SegmentedControl matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/molecules-segmentedcontrol--text-medium`);

    // Wait for the story to load
    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    // Take screenshot of the segmented control
    const segmentedControlElement = page.locator('[data-testid="storybook-preview-wrapper"] > div > div');
    await expect(segmentedControlElement).toHaveScreenshot('segmented-control-text-medium.png', {
      threshold: 0.1, // Allow for small differences
    });
  });

  test('Text Small SegmentedControl matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/molecules-segmentedcontrol--text-small`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const segmentedControlElement = page.locator('[data-testid="storybook-preview-wrapper"] > div > div');
    await expect(segmentedControlElement).toHaveScreenshot('segmented-control-text-small.png', {
      threshold: 0.1,
    });
  });

  test('Icons Medium SegmentedControl matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/molecules-segmentedcontrol--icons-medium`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const segmentedControlElement = page.locator('[data-testid="storybook-preview-wrapper"] > div > div');
    await expect(segmentedControlElement).toHaveScreenshot('segmented-control-icons-medium.png', {
      threshold: 0.1,
    });
  });

  test('Icons Small SegmentedControl matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/molecules-segmentedcontrol--icons-small`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const segmentedControlElement = page.locator('[data-testid="storybook-preview-wrapper"] > div > div');
    await expect(segmentedControlElement).toHaveScreenshot('segmented-control-icons-small.png', {
      threshold: 0.1,
    });
  });
});


