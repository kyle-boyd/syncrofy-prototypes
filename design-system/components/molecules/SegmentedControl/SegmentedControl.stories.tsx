import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';

const meta = {
  title: 'Molecules/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { id: 'option1', text: 'Option 1' },
      { id: 'option2', text: 'Option 2' },
      { id: 'option3', text: 'Option 3' },
    ],
    defaultSelectedId: 'option1',
    onChange: (selectedId) => console.log('Selected:', selectedId),
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { id: 'favorites', text: 'Favorites', icon: <FavoriteIcon fontSize="small" /> },
      { id: 'stars', text: 'Stars', icon: <StarIcon fontSize="small" /> },
      { id: 'settings', text: 'Settings', icon: <SettingsIcon fontSize="small" /> },
    ],
    defaultSelectedId: 'favorites',
    onChange: (selectedId) => console.log('Selected:', selectedId),
  },
};

export const Small: Story = {
  args: {
    items: [
      { id: 'small1', text: 'Small 1' },
      { id: 'small2', text: 'Small 2' },
      { id: 'small3', text: 'Small 3' },
    ],
    defaultSelectedId: 'small1',
    size: 'sm',
    onChange: (selectedId) => console.log('Selected:', selectedId),
  },
};

export const WithDisabled: Story = {
  args: {
    items: [
      { id: 'enabled1', text: 'Enabled 1' },
      { id: 'disabled', text: 'Disabled', disabled: true },
      { id: 'enabled2', text: 'Enabled 2' },
    ],
    defaultSelectedId: 'enabled1',
    onChange: (selectedId) => console.log('Selected:', selectedId),
  },
};

export const Disabled: Story = {
  args: {
    items: [
      { id: 'option1', text: 'Option 1' },
      { id: 'option2', text: 'Option 2' },
      { id: 'option3', text: 'Option 3' },
    ],
    defaultSelectedId: 'option1',
    disabled: true,
    onChange: (selectedId) => console.log('Selected:', selectedId),
  },
};

export const LongLabels: Story = {
  args: {
    items: [
      { id: 'long1', text: 'Very Long Option Name' },
      { id: 'long2', text: 'Another Long Option' },
      { id: 'short', text: 'Short' },
    ],
    defaultSelectedId: 'long1',
    onChange: (selectedId) => console.log('Selected:', selectedId),
  },
  parameters: {
    layout: 'padded',
  },
};