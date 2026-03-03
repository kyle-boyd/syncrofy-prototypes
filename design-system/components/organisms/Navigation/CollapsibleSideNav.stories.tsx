import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CollapsibleSideNav } from './CollapsibleSideNav';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';

const meta = {
  title: 'Organisms/Navigation/CollapsibleSideNav',
  component: CollapsibleSideNav,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
          <h2>Main Content Area</h2>
          <p>This area represents the main content of your application.</p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof CollapsibleSideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleItems = [
  {
    id: 'home',
    label: 'Home',
    icon: <HomeIcon />,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <PersonIcon />,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <NotificationsIcon />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
  },
  {
    id: 'help',
    label: 'Help',
    icon: <HelpIcon />,
  },
];

export const Expanded: Story = {
  args: {
    items: sampleItems,
    selectedItemId: 'dashboard',
    expanded: true,
  },
  render: (args) => {
    const [selectedItemId, setSelectedItemId] = useState(args.selectedItemId);
    const [expanded, setExpanded] = useState(args.expanded);

    return (
      <CollapsibleSideNav
        {...args}
        selectedItemId={selectedItemId}
        onItemSelect={setSelectedItemId}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
    );
  },
};

export const Collapsed: Story = {
  args: {
    items: sampleItems,
    selectedItemId: 'dashboard',
    expanded: false,
  },
  render: (args) => {
    const [selectedItemId, setSelectedItemId] = useState(args.selectedItemId);
    const [expanded, setExpanded] = useState(args.expanded);

    return (
      <CollapsibleSideNav
        {...args}
        selectedItemId={selectedItemId}
        onItemSelect={setSelectedItemId}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
    );
  },
};

export const Interactive: Story = {
  args: {
    items: sampleItems,
    selectedItemId: 'home',
    expanded: true,
  },
  render: (args) => {
    const [selectedItemId, setSelectedItemId] = useState(args.selectedItemId);
    const [expanded, setExpanded] = useState(args.expanded);

    return (
      <CollapsibleSideNav
        {...args}
        selectedItemId={selectedItemId}
        onItemSelect={setSelectedItemId}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
    );
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      ...sampleItems.slice(0, 3),
      {
        id: 'notifications',
        label: 'Notifications',
        icon: <NotificationsIcon />,
        disabled: true,
      },
      ...sampleItems.slice(4),
    ],
    selectedItemId: 'dashboard',
    expanded: true,
  },
  render: (args) => {
    const [selectedItemId, setSelectedItemId] = useState(args.selectedItemId);
    const [expanded, setExpanded] = useState(args.expanded);

    return (
      <CollapsibleSideNav
        {...args}
        selectedItemId={selectedItemId}
        onItemSelect={setSelectedItemId}
        expanded={expanded}
        onExpandedChange={setExpanded}
      />
    );
  },
};
