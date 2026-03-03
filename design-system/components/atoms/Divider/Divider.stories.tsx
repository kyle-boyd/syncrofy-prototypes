import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';
import Box from '@mui/material/Box';

const meta = {
  title: 'Atoms/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Divider component for separating content sections. Extends MUI Divider with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['fullWidth', 'inset', 'middle'],
      description: 'The variant to use',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the divider',
    },
    textAlign: {
      control: 'select',
      options: ['center', 'left', 'right'],
      description: 'The text alignment of the divider\'s children',
    },
    light: {
      control: 'boolean',
      description: 'If true, applies light styling',
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Box width="400px">
      <Box p={2}>Content above</Box>
      <Divider />
      <Box p={2}>Content below</Box>
    </Box>
  ),
};

export const WithText: Story = {
  args: {
    children: 'OR',
  },
  render: (args) => (
    <Box width="400px">
      <Box p={2}>Content above</Box>
      <Divider {...args} />
      <Box p={2}>Content below</Box>
    </Box>
  ),
};

export const FullWidth: Story = {
  args: {
    variant: 'fullWidth',
  },
  render: (args) => (
    <Box width="400px">
      <Box p={2}>Content</Box>
      <Divider {...args} />
      <Box p={2}>Content</Box>
    </Box>
  ),
};

export const Inset: Story = {
  args: {
    variant: 'inset',
  },
  render: (args) => (
    <Box width="400px">
      <Box p={2}>Content</Box>
      <Divider {...args} />
      <Box p={2}>Content</Box>
    </Box>
  ),
};

export const Middle: Story = {
  args: {
    variant: 'middle',
  },
  render: (args) => (
    <Box width="400px">
      <Box p={2}>Content</Box>
      <Divider {...args} />
      <Box p={2}>Content</Box>
    </Box>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <Box display="flex" height={100} alignItems="center">
      <Box>Content</Box>
      <Divider {...args} flexItem />
      <Box>Content</Box>
    </Box>
  ),
};

export const TextAlignments: Story = {
  render: () => (
    <Box width="400px" display="flex" flexDirection="column" gap={2}>
      <Divider textAlign="left">Left</Divider>
      <Divider textAlign="center">Center</Divider>
      <Divider textAlign="right">Right</Divider>
    </Box>
  ),
};

