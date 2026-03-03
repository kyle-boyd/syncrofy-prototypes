import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';

const meta = {
  title: 'Atoms/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'IconButton component for icon-only buttons. Extends MUI IconButton with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning', 'inherit'],
      description: 'The color of the component',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the button is disabled',
    },
    edge: {
      control: 'select',
      options: ['start', 'end', false],
      description: 'If true, the button will use edge padding',
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <DeleteIcon />,
  },
};

export const Primary: Story = {
  args: {
    children: <FavoriteIcon />,
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: <ShareIcon />,
    color: 'secondary',
  },
};

export const Error: Story = {
  args: {
    children: <DeleteIcon />,
    color: 'error',
  },
};

export const Small: Story = {
  args: {
    children: <SettingsIcon />,
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    children: <SettingsIcon />,
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    children: <SettingsIcon />,
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    children: <DeleteIcon />,
    disabled: true,
  },
};

export const Colors: Story = {
  args: {
    children: <DeleteIcon />,
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <IconButton {...args} color="default"><DeleteIcon /></IconButton>
      <IconButton {...args} color="primary"><FavoriteIcon /></IconButton>
      <IconButton {...args} color="secondary"><ShareIcon /></IconButton>
      <IconButton {...args} color="error"><DeleteIcon /></IconButton>
      <IconButton {...args} color="info"><SettingsIcon /></IconButton>
      <IconButton {...args} color="success"><FavoriteIcon /></IconButton>
      <IconButton {...args} color="warning"><DeleteIcon /></IconButton>
    </div>
  ),
};

export const IconGallery: Story = {
  args: {
    children: <MenuIcon />,
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <IconButton {...args}><MenuIcon /></IconButton>
      <IconButton {...args}><SettingsIcon /></IconButton>
      <IconButton {...args}><FavoriteIcon /></IconButton>
      <IconButton {...args}><ShareIcon /></IconButton>
      <IconButton {...args}><DeleteIcon /></IconButton>
    </div>
  ),
};

