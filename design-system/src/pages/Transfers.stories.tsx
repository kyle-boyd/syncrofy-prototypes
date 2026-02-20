import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Transfers } from './Transfers';

const meta = {
  title: 'Pages/Transfers',
  component: Transfers,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Transfers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};



