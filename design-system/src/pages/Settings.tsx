import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PageLayout } from './PageLayout';
import { navItems } from './navItems';

/**
 * Settings page template
 */
export const Settings: React.FC = () => {
  return (
    <PageLayout
      navItems={navItems}
      selectedNavItemId="settings"
      initialExpanded={true}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Configure your settings here. This is a template page that uses the Header and SideNav components.
        </Typography>
        {/* Add your settings content here */}
      </Box>
    </PageLayout>
  );
};



