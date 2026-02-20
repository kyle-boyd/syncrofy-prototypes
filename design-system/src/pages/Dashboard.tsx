import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PageLayout } from './PageLayout';
import { navItems } from './navItems';

/**
 * Dashboard page template
 */
export const Dashboard: React.FC = () => {
  return (
    <PageLayout
      navItems={navItems}
      selectedNavItemId="dashboard"
      initialExpanded={true}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome to your dashboard. This is a template page that uses the Header and SideNav components.
        </Typography>
        {/* Add your dashboard content here */}
      </Box>
    </PageLayout>
  );
};
