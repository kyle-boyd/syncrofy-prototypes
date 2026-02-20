import React, { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Header, HeaderProps } from '@/components/organisms/Navigation/Header';
import { CollapsibleSideNav, CollapsibleSideNavItem } from '@/components/organisms/Navigation/CollapsibleSideNav';
import { BaseComponentProps } from '@/types';

export interface PageLayoutProps extends BaseComponentProps {
  /**
   * The content to display in the main area
   */
  children: React.ReactNode;
  /**
   * Navigation items for the side navigation
   */
  navItems: CollapsibleSideNavItem[];
  /**
   * Currently selected navigation item ID
   */
  selectedNavItemId?: string;
  /**
   * Header props to pass to the Header component
   */
  headerProps?: Omit<HeaderProps, 'className' | 'data-testid'>;
  /**
   * Initial expanded state of the side navigation
   */
  initialExpanded?: boolean;
}

/**
 * PageLayout component that provides a consistent layout with Header and CollapsibleSideNav
 * This is a template component that can be used across all pages
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  className,
  'data-testid': testId,
  children,
  navItems,
  selectedNavItemId,
  headerProps,
  initialExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Side Navigation - extends full height on the left */}
      <Box
        sx={{
          height: '100%',
          flexShrink: 0,
        }}
      >
        <CollapsibleSideNav
          items={navItems}
          selectedItemId={selectedNavItemId}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />
      </Box>

      {/* Right side: Header and Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Header - extends from side nav to right edge, no border */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Header {...headerProps} />
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.default',
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};



