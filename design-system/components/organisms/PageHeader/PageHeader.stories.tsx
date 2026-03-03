import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';
import Box from '@mui/material/Box';

const meta = {
  title: 'Organisms/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'PageHeader component for displaying page titles with optional breadcrumbs and refresh controls. Provides a consistent header layout for pages.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title of the page',
    },
    showBreadcrumb: {
      control: 'boolean',
      description: 'If true, shows the breadcrumb section with back button',
    },
    breadcrumbLabel: {
      control: 'text',
      description: 'The breadcrumb label (e.g., "Transfers")',
    },
    showInfoIcon: {
      control: 'boolean',
      description: 'If true, shows an info icon button next to the title',
    },
    refreshStatus: {
      control: 'text',
      description: 'The refresh status text (e.g., "Last refreshed 1 minute ago")',
    },
    onBreadcrumbClick: {
      action: 'breadcrumb clicked',
      description: 'Callback fired when the breadcrumb button is clicked',
    },
    onInfoClick: {
      action: 'info clicked',
      description: 'Callback fired when the info icon is clicked',
    },
    onRefreshClick: {
      action: 'refresh clicked',
      description: 'Callback fired when the refresh button is clicked',
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Transfer Details',
    showBreadcrumb: true,
    breadcrumbLabel: 'Transfers',
    showInfoIcon: true,
    refreshStatus: 'Last refreshed 1 minute ago',
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: '1152px' }}>
      <PageHeader {...args} />
    </Box>
  ),
};

export const WithoutBreadcrumb: Story = {
  args: {
    title: 'Transfer Details',
    showBreadcrumb: false,
    showInfoIcon: true,
    refreshStatus: 'Last refreshed 1 minute ago',
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: '1152px' }}>
      <PageHeader {...args} />
    </Box>
  ),
};

export const WithoutInfoIcon: Story = {
  args: {
    title: 'Transfer Details',
    showBreadcrumb: true,
    breadcrumbLabel: 'Transfers',
    showInfoIcon: false,
    refreshStatus: 'Last refreshed 1 minute ago',
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: '1152px' }}>
      <PageHeader {...args} />
    </Box>
  ),
};

export const WithoutRefreshStatus: Story = {
  args: {
    title: 'Transfer Details',
    showBreadcrumb: true,
    breadcrumbLabel: 'Transfers',
    showInfoIcon: true,
    refreshStatus: '',
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: '1152px' }}>
      <PageHeader {...args} />
    </Box>
  ),
};

export const Minimal: Story = {
  args: {
    title: 'Settings',
    showBreadcrumb: false,
    showInfoIcon: false,
    refreshStatus: '',
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: '1152px' }}>
      <PageHeader {...args} />
    </Box>
  ),
};

export const LongTitle: Story = {
  args: {
    title: 'Very Long Page Title That Might Wrap to Multiple Lines',
    showBreadcrumb: true,
    breadcrumbLabel: 'Dashboard',
    showInfoIcon: true,
    refreshStatus: 'Last refreshed 5 minutes ago',
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: '1152px' }}>
      <PageHeader {...args} />
    </Box>
  ),
};
