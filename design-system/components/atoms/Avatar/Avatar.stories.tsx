import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import PersonIcon from '@mui/icons-material/Person';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Avatar component for displaying user profile pictures or initials. Extends MUI Avatar with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the avatar image',
    },
    variant: {
      control: 'select',
      options: ['circular', 'rounded', 'square'],
      description: 'The shape of the avatar',
    },
    sizes: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the avatar',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <PersonIcon />,
  },
};

export const WithInitials: Story = {
  args: {
    children: 'JD',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/300',
    alt: 'User avatar',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    children: 'AB',
  },
};

export const Rounded: Story = {
  args: {
    variant: 'rounded',
    children: 'CD',
  },
};

export const Square: Story = {
  args: {
    variant: 'square',
    children: 'EF',
  },
};

export const Small: Story = {
  args: {
    sizes: 'small',
    children: 'SM',
  },
};

export const Medium: Story = {
  args: {
    sizes: 'medium',
    children: 'MD',
  },
};

export const Large: Story = {
  args: {
    sizes: 'large',
    children: 'LG',
  },
};

export const WithIcon: Story = {
  args: {
    children: <PersonIcon />,
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
      <Avatar sx={{ bgcolor: 'secondary.main' }}>B</Avatar>
      <Avatar sx={{ bgcolor: 'error.main' }}>C</Avatar>
      <Avatar sx={{ bgcolor: 'info.main' }}>D</Avatar>
      <Avatar sx={{ bgcolor: 'success.main' }}>E</Avatar>
      <Avatar sx={{ bgcolor: 'warning.main' }}>F</Avatar>
    </div>
  ),
};

