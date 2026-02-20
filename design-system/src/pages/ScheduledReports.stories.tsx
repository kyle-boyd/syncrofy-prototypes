import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScheduledReports } from './ScheduledReports';

const meta = {
  title: 'Pages/ScheduledReports',
  component: ScheduledReports,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScheduledReports>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};



