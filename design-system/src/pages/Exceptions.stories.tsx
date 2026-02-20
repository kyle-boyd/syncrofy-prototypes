import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Exceptions } from './Exceptions';

const meta = {
  title: 'Pages/Exceptions',
  component: Exceptions,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Exceptions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};



