import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tabs component for displaying tabbed content. Extends MUI Tabs with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'scrollable', 'fullWidth'],
      description: 'The variant to use',
    },
    scrollButtons: {
      control: 'select',
      options: ['auto', true, false],
      description: 'The position of the tabs',
    },
    showPanels: {
      control: 'boolean',
      description: 'If true, shows tab panels',
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicTabs = [
  { label: 'Tab 1', value: 'tab1' },
  { label: 'Tab 2', value: 'tab2' },
  { label: 'Tab 3', value: 'tab3' },
];

export const Default: Story = {
  args: {
    tabs: basicTabs,
    value: 'tab1',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number>('tab1');
    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Tabs
          {...args}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </Box>
    );
  },
};

export const WithIcons: Story = {
  args: {
    tabs: [
      { label: 'Home', value: 'tab1', icon: <HomeIcon /> },
      { label: 'Favorites', value: 'tab2', icon: <FavoriteIcon /> },
      { label: 'Profile', value: 'tab3', icon: <PersonIcon /> },
      { label: 'Settings', value: 'tab4', icon: <SettingsIcon /> },
    ],
    value: 'tab1',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number>('tab1');
    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Tabs
          {...args}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </Box>
    );
  },
};

export const WithPanels: Story = {
  args: {
    tabs: [
      {
        label: 'Tab 1',
        value: 'tab1',
        content: <Typography sx={{ p: 3 }}>Content for Tab 1</Typography>,
      },
      {
        label: 'Tab 2',
        value: 'tab2',
        content: <Typography sx={{ p: 3 }}>Content for Tab 2</Typography>,
      },
      {
        label: 'Tab 3',
        value: 'tab3',
        content: <Typography sx={{ p: 3 }}>Content for Tab 3</Typography>,
      },
    ],
    value: 'tab1',
    showPanels: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string | number>('tab1');
    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Tabs
          {...args}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </Box>
    );
  },
};

export const Scrollable: Story = {
  args: {
    tabs: Array.from({ length: 10 }, (_, i) => ({
      label: `Tab ${i + 1}`,
      value: `tab${i + 1}`,
    })),
    value: 'tab1',
    variant: 'scrollable',
    scrollButtons: 'auto',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number>('tab1');
    return (
      <Box sx={{ width: 400 }}>
        <Tabs
          {...args}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </Box>
    );
  },
};

export const FullWidth: Story = {
  args: {
    tabs: basicTabs,
    value: 'tab1',
    variant: 'fullWidth',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number>('tab1');
    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Tabs
          {...args}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </Box>
    );
  },
};

export const WithDisabled: Story = {
  args: {
    tabs: [
      { label: 'Enabled Tab', value: 'tab1' },
      { label: 'Disabled Tab', value: 'tab2', disabled: true },
      { label: 'Another Enabled', value: 'tab3' },
    ],
    value: 'tab1',
  },
  render: (args) => {
    const [value, setValue] = useState<string | number>('tab1');
    return (
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Tabs
          {...args}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </Box>
    );
  },
};

