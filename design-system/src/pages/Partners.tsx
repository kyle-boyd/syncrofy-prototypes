import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PageLayout } from './PageLayout';
import { navItems } from './navItems';

/**
 * Partners page template
 */
export const Partners: React.FC = () => {
  return (
    <PageLayout
      navItems={navItems}
      selectedNavItemId="partners"
      initialExpanded={true}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Partners
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your partners here. This is a template page that uses the Header and SideNav components.
        </Typography>
        {/* Add your partners content here */}
      </Box>
    </PageLayout>
  );
};



