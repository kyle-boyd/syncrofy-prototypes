import { test, expect } from '@playwright/test';
import { composeStories } from '@storybook/react';
import * as stories from '../../src/components/atoms/SegmentedControlItem/SegmentedControlItem.stories';

const {
  Default,
  Selected,
  Unselected,
  Small,
  Medium,
  TextOnly,
  IconOnly,
  IconText,
  UnselectedDefault,
  UnselectedDisabled,
  SelectedDefault,
  SelectedDisabled,
  SmallIconText,
  MediumIconOnly,
} = composeStories(stories);

test.describe('SegmentedControlItem Component Visual Regression', () => {
  test('Default matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--default`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-default.png', {
      threshold: 0.1,
    });
  });

  test('Selected matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--selected`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-selected.png', {
      threshold: 0.1,
    });
  });

  test('Unselected matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--unselected`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-unselected.png', {
      threshold: 0.1,
    });
  });

  test('Small size matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--small`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-small.png', {
      threshold: 0.1,
    });
  });

  test('Medium size matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--medium`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-medium.png', {
      threshold: 0.1,
    });
  });

  test('Text Only content matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--text-only`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-text-only.png', {
      threshold: 0.1,
    });
  });

  test('Icon Only content matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--icon-only`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-icon-only.png', {
      threshold: 0.1,
    });
  });

  test('Icon Text content matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--icon-text`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-icon-text.png', {
      threshold: 0.1,
    });
  });

  test('Unselected Default state matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--unselected-default`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-unselected-default.png', {
      threshold: 0.1,
    });
  });

  test('Unselected Disabled state matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--unselected-disabled`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-unselected-disabled.png', {
      threshold: 0.1,
    });
  });

  test('Selected Default state matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--selected-default`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-selected-default.png', {
      threshold: 0.1,
    });
  });

  test('Selected Disabled state matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--selected-disabled`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-selected-disabled.png', {
      threshold: 0.1,
    });
  });

  test('Small Icon Text combination matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--small-icon-text`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-small-icon-text.png', {
      threshold: 0.1,
    });
  });

  test('Medium Icon Only combination matches baseline', async ({ page }) => {
    await page.goto(`http://localhost:6006/?path=/story/atoms-segmentedcontrolitem--medium-icon-only`);

    await page.waitForSelector('[data-testid="storybook-preview-wrapper"]');

    const itemElement = page.locator('[data-testid="storybook-preview-wrapper"] > div');
    await expect(itemElement).toHaveScreenshot('segmented-control-item-medium-icon-only.png', {
      threshold: 0.1,
    });
  });
});


