import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';
import Box from '@mui/material/Box';

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Spinner component for loading states. Extends MUI CircularProgress with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'number',
      description: 'The size of the spinner',
    },
    color: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the spinner',
    },
    variant: {
      control: 'select',
      options: ['determinate', 'indeterminate'],
      description: 'The variant to use',
    },
    value: {
      control: 'number',
      min: 0,
      max: 100,
      description: 'The value of the progress indicator (0-100) for determinate variant',
    },
    loading: {
      control: 'boolean',
      description: 'If true, the spinner is shown',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: true,
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    loading: true,
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    loading: true,
  },
};

export const Small: Story = {
  args: {
    size: 24,
    loading: true,
  },
};

export const Medium: Story = {
  args: {
    size: 40,
    loading: true,
  },
};

export const Large: Story = {
  args: {
    size: 60,
    loading: true,
  },
};

export const Determinate: Story = {
  args: {
    variant: 'determinate',
    value: 50,
    loading: true,
  },
};

export const Indeterminate: Story = {
  args: {
    variant: 'indeterminate',
    loading: true,
  },
};

export const Colors: Story = {
  render: () => (
    <Box display="flex" gap={4} alignItems="center">
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <Spinner color="error" />
      <Spinner color="info" />
      <Spinner color="success" />
      <Spinner color="warning" />
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" gap={4} alignItems="center">
      <Spinner size={24} />
      <Spinner size={40} />
      <Spinner size={60} />
    </Box>
  ),
};

export const Progress: Story = {
  render: () => {
    const values = [0, 25, 50, 75, 100];
    return (
      <Box display="flex" gap={4} alignItems="center">
        {values.map((value) => (
          <Box key={value} display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Spinner variant="determinate" value={value} />
            <span>{value}%</span>
          </Box>
        ))}
      </Box>
    );
  },
};

