import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageLayout } from './PageLayout';
import { navItems } from './navItems';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const meta = {
  title: 'Pages/PageLayout',
  component: PageLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    permanentSideNav: {
      control: 'boolean',
      description: 'If true, the side nav is permanently visible',
    },
    sideNavWidth: {
      control: 'number',
      description: 'Width of the side navigation drawer',
    },
  },
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navItems,
    selectedNavItemId: 'dashboard',
    initialExpanded: true,
    children: (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Page Content
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is the main content area of the page layout.
        </Typography>
      </Box>
    ),
  },
};

export const WithCollapsedSideNav: Story = {
  args: {
    navItems,
    selectedNavItemId: 'transfers',
    initialExpanded: false,
    children: (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Page with Collapsed Side Nav
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The side navigation can be expanded by clicking the toggle button.
        </Typography>
      </Box>
    ),
  },
};

export const WithCustomHeaderProps: Story = {
  args: {
    navItems,
    selectedNavItemId: 'partners',
    permanentSideNav: true,
    headerProps: {
      searchPlaceholder: 'Search partners...',
      environmentLabel: 'Development - Local',
      userInitials: 'JD',
      userName: 'John Doe',
      userOrganization: 'Test Organization',
    },
    children: (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Custom Header Configuration
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This page has custom header props configured.
        </Typography>
      </Box>
    ),
  },
};



