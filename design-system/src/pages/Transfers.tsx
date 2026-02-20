import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PageLayout } from './PageLayout';
import { navItems } from './navItems';

/**
 * Transfers page template
 */
export const Transfers: React.FC = () => {
  return (
    <PageLayout
      navItems={navItems}
      selectedNavItemId="transfers"
      initialExpanded={true}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Transfers
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your transfers here. This is a template page that uses the Header and SideNav components.
        </Typography>
        {/* Add your transfers content here */}
      </Box>
    </PageLayout>
  );
};



