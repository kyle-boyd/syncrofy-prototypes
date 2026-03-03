import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Button } from '../Button';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge component for displaying status indicators or counts. Extends MUI Badge with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    badgeContent: {
      control: 'text',
      description: 'The content rendered within the badge',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the badge',
    },
    max: {
      control: 'number',
      description: 'Maximum count to show',
    },
    showZero: {
      control: 'boolean',
      description: 'Controls whether the badge is hidden when badgeContent is zero',
    },
    variant: {
      control: 'select',
      options: ['standard', 'dot'],
      description: 'The variant to use',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badgeContent: 4,
    children: <MailIcon />,
    color: 'primary',
  },
};

export const Primary: Story = {
  args: {
    badgeContent: 4,
    children: <MailIcon />,
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    badgeContent: 100,
    children: <NotificationsIcon />,
    color: 'secondary',
  },
};

export const Error: Story = {
  args: {
    badgeContent: 3,
    children: <MailIcon />,
    color: 'error',
  },
};

export const Dot: Story = {
  args: {
    variant: 'dot',
    children: <MailIcon />,
    color: 'primary',
  },
};

export const Max: Story = {
  args: {
    badgeContent: 1000,
    max: 99,
    children: <MailIcon />,
    color: 'primary',
  },
};

export const ShowZero: Story = {
  args: {
    badgeContent: 0,
    showZero: true,
    children: <MailIcon />,
    color: 'primary',
  },
};

export const OnButton: Story = {
  args: {
    badgeContent: 4,
    children: <Button variant="contained">Notifications</Button>,
    color: 'primary',
  },
};

export const Colors: Story = {
  args: {
    badgeContent: 4,
    children: <MailIcon />,
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Badge {...args} color="default"><MailIcon /></Badge>
      <Badge {...args} color="primary"><MailIcon /></Badge>
      <Badge {...args} color="secondary"><MailIcon /></Badge>
      <Badge {...args} color="error"><MailIcon /></Badge>
      <Badge {...args} color="info"><MailIcon /></Badge>
      <Badge {...args} color="success"><MailIcon /></Badge>
      <Badge {...args} color="warning"><MailIcon /></Badge>
    </div>
  ),
};

