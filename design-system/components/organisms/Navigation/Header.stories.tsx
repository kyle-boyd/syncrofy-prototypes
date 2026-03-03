import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Header } from './Header';

const meta = {
  title: 'Organisms/Navigation/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    environmentLabel: {
      control: 'text',
      description: 'Label to display in the environment chip',
    },
    userInitials: {
      control: 'text',
      description: 'User initials to display in the avatar',
    },
    showNotificationBadge: {
      control: 'boolean',
      description: 'Whether to show the notification badge dot',
    },
    onSearchChange: { action: 'search changed' },
    onSearch: { action: 'search performed' },
    onNotificationsClick: { action: 'notifications clicked' },
    onAvatarClick: { action: 'avatar clicked' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchPlaceholder: 'Search for files',
    environmentLabel: 'CoEnterprise - Production',
    userInitials: 'KB',
    showNotificationBadge: true,
  },
};

export const WithSearchValue: Story = {
  args: {
    searchPlaceholder: 'Search for files',
    environmentLabel: 'CoEnterprise - Production',
    userInitials: 'KB',
    showNotificationBadge: true,
    searchValue: 'example search',
  },
  render: (args) => {
    const [searchValue, setSearchValue] = useState(args.searchValue || '');

    return (
      <Header
        {...args}
        searchValue={searchValue}
        onSearchChange={(e) => {
          setSearchValue(e.target.value);
          args.onSearchChange?.(e);
        }}
        onSearch={(value) => {
          console.log('Search performed:', value);
          args.onSearch?.(value);
        }}
      />
    );
  },
};

export const WithoutNotificationBadge: Story = {
  args: {
    searchPlaceholder: 'Search for files',
    environmentLabel: 'CoEnterprise - Production',
    userInitials: 'KB',
    showNotificationBadge: false,
  },
};

export const CustomEnvironment: Story = {
  args: {
    searchPlaceholder: 'Search for files',
    environmentLabel: 'Development - Local',
    userInitials: 'JD',
    showNotificationBadge: true,
  },
};

export const WithUserAvatar: Story = {
  args: {
    searchPlaceholder: 'Search for files',
    environmentLabel: 'CoEnterprise - Production',
    userInitials: 'KB',
    userAvatar: 'https://i.pravatar.cc/150?img=12',
    showNotificationBadge: true,
  },
};

export const Interactive: Story = {
  args: {
    searchPlaceholder: 'Search for files',
    environmentLabel: 'CoEnterprise - Production',
    userInitials: 'KB',
    showNotificationBadge: true,
  },
  render: (args) => {
    const [searchValue, setSearchValue] = useState('');

    return (
      <Header
        {...args}
        searchValue={searchValue}
        onSearchChange={(e) => {
          setSearchValue(e.target.value);
          args.onSearchChange?.(e);
        }}
        onSearch={(value) => {
          alert(`Searching for: ${value}`);
          args.onSearch?.(value);
        }}
        onNotificationsClick={(e) => {
          alert('Notifications clicked!');
          args.onNotificationsClick?.(e);
        }}
        onAvatarClick={(e) => {
          alert('Avatar clicked!');
          args.onAvatarClick?.(e);
        }}
      />
    );
  },
};

