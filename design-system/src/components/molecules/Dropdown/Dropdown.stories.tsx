import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown, DropdownOption } from './Dropdown';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const meta = {
  title: 'Molecules/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dropdown component for displaying a list of options. Uses MUI Menu with List + ListItem pattern, supporting simple text items as well as complex items with icons, secondary text, and action buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    trigger: {
      control: false,
      description: 'The element that triggers the dropdown',
    },
    options: {
      control: false,
      description: 'Options to display in the dropdown',
    },
    onSelect: {
      action: 'selected',
      description: 'Callback fired when an option is selected',
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
    },
    open: {
      control: 'boolean',
      description: 'If true, the dropdown is open',
    },
    hugContents: {
      control: 'boolean',
      description: 'If true, the menu width will hug its contents instead of matching the trigger width',
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple text items (backward compatibility)
export const Simple: Story = {
  args: {
    trigger: <Button variant="outlined">Select Option</Button>,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={selected}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
    );
  },
};

// With icons
export const WithIcons: Story = {
  args: {
    trigger: <Button variant="outlined">Select Action</Button>,
    options: [
      { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { value: 'settings', label: 'Settings', icon: <SettingsIcon /> },
      { value: 'profile', label: 'Profile', icon: <PersonIcon /> },
      { value: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    ],
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={selected}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
    );
  },
};

// With secondary text
export const WithSecondaryText: Story = {
  args: {
    trigger: <Button variant="outlined">Select User</Button>,
    options: [
      {
        value: 'user1',
        label: 'John Doe',
        secondary: 'john.doe@example.com',
      },
      {
        value: 'user2',
        label: 'Jane Smith',
        secondary: 'jane.smith@example.com',
      },
      {
        value: 'user3',
        label: 'Bob Johnson',
        secondary: 'bob.johnson@example.com',
      },
    ],
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={selected}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
    );
  },
};

// With icons and secondary text
export const WithIconsAndSecondary: Story = {
  args: {
    trigger: <Button variant="outlined">View Options</Button>,
    options: [
      {
        value: 'view1',
        label: 'My Custom View',
        icon: <DashboardIcon />,
        secondary: 'Last updated 2 hours ago',
      },
      {
        value: 'view2',
        label: 'Default View',
        icon: <DashboardIcon />,
        secondary: 'Last updated 1 day ago',
      },
      {
        value: 'view3',
        label: 'Recent Transfers',
        icon: <DashboardIcon />,
        secondary: 'Last updated 3 days ago',
      },
    ],
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={selected}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
    );
  },
};

// With action buttons
export const WithActions: Story = {
  args: {
    trigger: <Button variant="outlined">More Options</Button>,
    options: [
      {
        value: 'edit',
        label: 'Edit View',
        icon: <EditIcon />,
        action: (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit action clicked');
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ),
      },
      {
        value: 'duplicate',
        label: 'Duplicate View',
        icon: <EditIcon />,
        action: (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Duplicate action clicked');
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        ),
      },
      {
        value: 'delete',
        label: 'Delete View',
        icon: <DeleteIcon />,
        action: (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete action clicked');
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={selected}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
    );
  },
};

// Complex example with all features
export const Complex: Story = {
  args: {
    trigger: <Button variant="outlined" endIcon={<MoreVertIcon />}>Account Menu</Button>,
    options: [
      {
        value: 'profile',
        label: 'Profile Settings',
        icon: <PersonIcon />,
        secondary: 'Manage your account information',
      },
      {
        value: 'notifications',
        label: 'Notification Preferences',
        icon: <NotificationsIcon />,
        secondary: 'Configure notification settings',
      },
      {
        value: 'settings',
        label: 'General Settings',
        icon: <SettingsIcon />,
        secondary: 'App preferences and configuration',
      },
      {
        value: 'logout',
        label: 'Logout',
        icon: <LogoutIcon />,
        secondary: 'Sign out of your account',
      },
    ],
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={selected}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
    );
  },
};

// With disabled items
export const WithDisabledItems: Story = {
  args: {
    trigger: <Button variant="outlined">Select Option</Button>,
    options: [
      { value: 'option1', label: 'Available Option 1' },
      { value: 'option2', label: 'Disabled Option', disabled: true },
      { value: 'option3', label: 'Available Option 2' },
      { value: 'option4', label: 'Another Disabled Option', disabled: true },
      { value: 'option5', label: 'Available Option 3' },
    ],
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={selected}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
    );
  },
};

// With selected value
export const WithSelectedValue: Story = {
  args: {
    trigger: <Button variant="outlined">Select Option</Button>,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    value: 'option2',
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Dropdown
        {...args}
        value={selected}
        onSelect={(value) => {
          setSelected(value);
          args.onSelect?.(value);
        }}
      />
    );
  },
};

// Controlled open state
export const Controlled: Story = {
  args: {
    trigger: <Button variant="outlined">Controlled Dropdown</Button>,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Dropdown
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          value={selected}
          onSelect={(value) => {
            setSelected(value);
            setOpen(false);
            args.onSelect?.(value);
          }}
          trigger={
            <Button variant="outlined" onClick={() => setOpen(!open)}>
              {open ? 'Close' : 'Open'} Dropdown
            </Button>
          }
        />
        <Typography variant="body2" color="text.secondary">
          Selected: {selected || 'None'}
        </Typography>
      </Box>
    );
  },
};

// Menu width matches trigger (default)
export const MenuWidthMatchesTrigger: Story = {
  args: {
    trigger: <Button variant="outlined" sx={{ minWidth: 200 }}>Wide Button</Button>,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
        <Typography variant="body2" color="text.secondary">
          Menu width matches trigger button width (default behavior)
        </Typography>
        <Dropdown
          {...args}
          value={selected}
          onSelect={(value) => {
            setSelected(value);
            args.onSelect?.(value);
          }}
        />
      </Box>
    );
  },
};

// Menu hugs contents
export const MenuHugsContents: Story = {
  args: {
    trigger: <Button variant="outlined" sx={{ minWidth: 200 }}>Wide Button</Button>,
    options: [
      { value: 'option1', label: 'Short' },
      { value: 'option2', label: 'Medium Length Option' },
      { value: 'option3', label: 'Very Long Option Text That Extends' },
    ],
    hugContents: true,
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | number | undefined>(args.value);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
        <Typography variant="body2" color="text.secondary">
          Menu width hugs contents (hugContents=true)
        </Typography>
        <Dropdown
          {...args}
          value={selected}
          onSelect={(value) => {
            setSelected(value);
            args.onSelect?.(value);
          }}
        />
      </Box>
    );
  },
};

