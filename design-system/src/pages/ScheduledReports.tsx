import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PageLayout } from './PageLayout';
import { navItems } from './navItems';

/**
 * Scheduled Reports page template
 */
export const ScheduledReports: React.FC = () => {
  return (
    <PageLayout
      navItems={navItems}
      selectedNavItemId="scheduled-reports"
      initialExpanded={true}
    >
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Scheduled Reports
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your scheduled reports here. This is a template page that uses the Header and SideNav components.
        </Typography>
        {/* Add your scheduled reports content here */}
      </Box>
    </PageLayout>
  );
};



