import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../../src/components/atoms/Button/Button.stories';

const { Primary, Secondary, Outlined, Text, Small, Medium, Large, Disabled, FullWidth } = composeStories(stories);

describe('Button Component Visual Regression - Browser Mode', () => {
  it('Primary Button renders correctly', async () => {
    // Mount the component in browser
    const { container } = render(<Primary />);

    // Take screenshot
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();

    // Visual regression check
    await expect(buttonElement).toHaveScreenshot('button-primary.png');
  });

  it('Secondary Button renders correctly', async () => {
    const { container } = render(<Secondary />);
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();
    await expect(buttonElement).toHaveScreenshot('button-secondary.png');
  });

  it('Outlined Button renders correctly', async () => {
    const { container } = render(<Outlined />);
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();
    await expect(buttonElement).toHaveScreenshot('button-outlined.png');
  });

  it('Text Button renders correctly', async () => {
    const { container } = render(<Text />);
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();
    await expect(buttonElement).toHaveScreenshot('button-text.png');
  });

  it('Small Button renders correctly', async () => {
    const { container } = render(<Small />);
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();
    await expect(buttonElement).toHaveScreenshot('button-small.png');
  });

  it('Medium Button renders correctly', async () => {
    const { container } = render(<Medium />);
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();
    await expect(buttonElement).toHaveScreenshot('button-medium.png');
  });

  it('Large Button renders correctly', async () => {
    const { container } = render(<Large />);
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();
    await expect(buttonElement).toHaveScreenshot('button-large.png');
  });

  it('Disabled Button renders correctly', async () => {
    const { container } = render(<Disabled />);
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();
    await expect(buttonElement).toHaveScreenshot('button-disabled.png');
  });

  it('Full Width Button renders correctly', async () => {
    const { container } = render(<FullWidth />);
    const buttonElement = container.querySelector('.MuiButton-root');
    expect(buttonElement).toBeInTheDocument();
    await expect(buttonElement).toHaveScreenshot('button-fullwidth.png');
  });
});
