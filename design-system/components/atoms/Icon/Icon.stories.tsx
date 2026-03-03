import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from '@mui/icons-material/Mail';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Icon component for displaying icons. This wrapper accepts children for custom icons or MUI icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    fontSize: {
      control: 'select',
      options: ['inherit', 'large', 'medium', 'small'],
      description: 'The size of the icon',
    },
    color: {
      control: 'select',
      options: ['inherit', 'action', 'disabled', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the icon',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <HomeIcon />,
  },
};

export const Small: Story = {
  args: {
    children: <HomeIcon fontSize="small" />,
  },
};

export const Medium: Story = {
  args: {
    children: <HomeIcon fontSize="medium" />,
  },
};

export const Large: Story = {
  args: {
    children: <HomeIcon fontSize="large" />,
  },
};

export const Primary: Story = {
  args: {
    children: <HomeIcon color="primary" />,
  },
};

export const Secondary: Story = {
  args: {
    children: <HomeIcon color="secondary" />,
  },
};

export const Error: Story = {
  args: {
    children: <DeleteIcon color="error" />,
  },
};

export const IconGallery: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Icon><HomeIcon color="primary" /></Icon>
      <Icon><FavoriteIcon color="error" /></Icon>
      <Icon><SettingsIcon color="primary" /></Icon>
      <Icon><DeleteIcon color="error" /></Icon>
      <Icon><MailIcon color="primary" /></Icon>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="error" />
      <HomeIcon color="info" />
      <HomeIcon color="success" />
      <HomeIcon color="warning" />
      <HomeIcon color="disabled" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <HomeIcon fontSize="small" />
      <HomeIcon fontSize="medium" />
      <HomeIcon fontSize="large" />
    </div>
  ),
};

