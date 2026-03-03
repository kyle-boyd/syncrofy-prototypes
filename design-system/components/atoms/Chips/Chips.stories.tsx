import type { Meta, StoryObj } from '@storybook/react';
import { Chips } from './Chips';
import FaceIcon from '@mui/icons-material/Face';

const meta = {
  title: 'Atoms/Chips',
  component: Chips,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chip component for compact elements that can be entered, deleted, or selected. Extends MUI Chip with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The content of the chip',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'rounded'],
      description: 'The variant to use',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the component',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'The size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the chip is disabled',
    },
  },
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Chip',
  },
};

export const Filled: Story = {
  args: {
    label: 'Filled Chip',
    variant: 'filled',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined Chip',
    variant: 'outlined',
  },
};

export const Rounded: Story = {
  args: {
    label: 'Rounded Chip',
    variant: 'rounded',
  },
};

export const Deletable: Story = {
  args: {
    label: 'Deletable Chip',
    onDelete: () => {},
  },
};

export const WithIcon: Story = {
  args: {
    label: 'With Icon',
    icon: <FaceIcon />,
  },
};

export const Small: Story = {
  args: {
    label: 'Small Chip',
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Chip',
    disabled: true,
  },
};

export const Colors: Story = {
  args: {
    label: 'Chip',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chips {...args} color="default" />
      <Chips {...args} color="primary" />
      <Chips {...args} color="secondary" />
      <Chips {...args} color="error" />
      <Chips {...args} color="info" />
      <Chips {...args} color="success" />
      <Chips {...args} color="warning" />
    </div>
  ),
};

export const DeletableColors: Story = {
  args: {
    label: 'Chip',
    onDelete: () => {},
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Chips {...args} color="default" />
      <Chips {...args} color="primary" />
      <Chips {...args} color="secondary" />
      <Chips {...args} color="error" />
    </div>
  ),
};

