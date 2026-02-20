import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PageLayout } from './PageLayout';
import { navItems } from './navItems';

/**
 * Exceptions page template
 */
export const Exceptions: React.FC = () => {
  return (
    <PageLayout
      navItems={navItems}
      selectedNavItemId="exceptions"
      initialExpanded={true}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Exceptions
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          View and manage exceptions here. This is a template page that uses the Header and SideNav components.
        </Typography>
        {/* Add your exceptions content here */}
      </Box>
    </PageLayout>
  );
};



