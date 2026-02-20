import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Settings } from './Settings';

const meta = {
  title: 'Pages/Settings',
  component: Settings,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Settings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};



