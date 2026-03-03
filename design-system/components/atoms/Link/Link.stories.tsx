import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta = {
  title: 'Atoms/Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Link component for navigation. Extends MUI Link with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the link',
    },
    underline: {
      control: 'select',
      options: ['none', 'hover', 'always'],
      description: 'If true, the link will be displayed with underline',
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Link',
    href: '#',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary Link',
    href: '#',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Link',
    href: '#',
    color: 'secondary',
  },
};

export const UnderlineHover: Story = {
  args: {
    children: 'Hover to underline',
    href: '#',
    underline: 'hover',
  },
};

export const UnderlineAlways: Story = {
  args: {
    children: 'Always underlined',
    href: '#',
    underline: 'always',
  },
};

export const NoUnderline: Story = {
  args: {
    children: 'No underline',
    href: '#',
    underline: 'none',
  },
};

export const External: Story = {
  args: {
    children: 'External Link',
    href: 'https://example.com',
    target: '_blank',
  },
};

export const Colors: Story = {
  args: {
    children: 'Link',
    href: '#',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Link {...args} color="primary">Primary Link</Link>
      <Link {...args} color="secondary">Secondary Link</Link>
      <Link {...args} color="error">Error Link</Link>
      <Link {...args} color="info">Info Link</Link>
      <Link {...args} color="success">Success Link</Link>
      <Link {...args} color="warning">Warning Link</Link>
    </div>
  ),
};

