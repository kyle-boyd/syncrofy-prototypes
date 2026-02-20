import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Partners } from './Partners';

const meta = {
  title: 'Pages/Partners',
  component: Partners,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Partners>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};



