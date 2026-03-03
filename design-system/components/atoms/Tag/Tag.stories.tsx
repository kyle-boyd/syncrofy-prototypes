import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';
import FavoriteIcon from '@mui/icons-material/Favorite';

const meta = {
  title: 'Atoms/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'error', 'warning', 'success', 'neutral', 'primary'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
    },
    hideIcon: {
      control: { type: 'boolean' },
    },
    hideLabel: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Tag',
  },
};

export const Variants: Story = {
  args: {
    label: 'Tag',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="info" />
      <Tag {...args} variant="error" />
      <Tag {...args} variant="warning" />
      <Tag {...args} variant="success" />
      <Tag {...args} variant="neutral" />
      <Tag {...args} variant="primary" />
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    label: 'Tag',
    variant: 'primary',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Tag {...args} size="small" />
      <Tag {...args} size="medium" />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    label: 'Tag',
    variant: 'primary',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="info" />
      <Tag {...args} variant="error" />
      <Tag {...args} variant="warning" />
      <Tag {...args} variant="success" />
      <Tag {...args} variant="neutral" />
      <Tag {...args} variant="primary" />
    </div>
  ),
};

export const WithoutIcons: Story = {
  args: {
    label: 'Tag',
    hideIcon: true,
    variant: 'primary',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="info" />
      <Tag {...args} variant="error" />
      <Tag {...args} variant="warning" />
      <Tag {...args} variant="success" />
      <Tag {...args} variant="neutral" />
      <Tag {...args} variant="primary" />
    </div>
  ),
};

export const WithLabels: Story = {
  args: {
    label: 'Label Text',
    variant: 'primary',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="info" />
      <Tag {...args} variant="error" />
      <Tag {...args} variant="warning" />
      <Tag {...args} variant="success" />
      <Tag {...args} variant="neutral" />
      <Tag {...args} variant="primary" />
    </div>
  ),
};

export const WithoutLabels: Story = {
  args: {
    label: 'Tag',
    hideLabel: true,
    variant: 'primary',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="info" />
      <Tag {...args} variant="error" />
      <Tag {...args} variant="warning" />
      <Tag {...args} variant="success" />
      <Tag {...args} variant="neutral" />
      <Tag {...args} variant="primary" />
    </div>
  ),
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    hideLabel: true,
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="info" />
      <Tag {...args} variant="error" />
      <Tag {...args} variant="warning" />
      <Tag {...args} variant="success" />
      <Tag {...args} variant="neutral" />
      <Tag {...args} variant="primary" />
    </div>
  ),
};

export const CustomIcon: Story = {
  args: {
    label: 'Custom Icon',
    variant: 'primary',
    icon: <FavoriteIcon className="tag-icon" />,
  },
};

export const AllVariantsSmall: Story = {
  args: {
    label: 'Small Tag',
    size: 'small',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="info" />
      <Tag {...args} variant="error" />
      <Tag {...args} variant="warning" />
      <Tag {...args} variant="success" />
      <Tag {...args} variant="neutral" />
      <Tag {...args} variant="primary" />
    </div>
  ),
};

export const AllVariantsMedium: Story = {
  args: {
    label: 'Medium Tag',
    size: 'medium',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag {...args} variant="info" />
      <Tag {...args} variant="error" />
      <Tag {...args} variant="success" />
      <Tag {...args} variant="warning" />
      <Tag {...args} variant="neutral" />
      <Tag {...args} variant="primary" />
    </div>
  ),
};
