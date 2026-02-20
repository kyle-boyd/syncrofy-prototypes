import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CollapsibleSideNav, Header, type CollapsibleSideNavItem } from '@kyleboyd/design-system';

interface PageLayoutProps {
  children: ReactNode;
  selectedNavItem?: 'dashboard' | 'transfers' | 'partners' | 'exceptions' | 'reports' | 'settings';
  showRefresh?: boolean;
  refreshTime?: string;
  backgroundColor?: string;
  hideHeaderBorder?: boolean;
}

export function PageLayout({
  children,
  selectedNavItem = 'dashboard',
  showRefresh = false,
  refreshTime,
  backgroundColor = '#FAFCFC',
  hideHeaderBorder = true,
}: PageLayoutProps) {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const navItems: CollapsibleSideNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardRoundedIcon />,
      onClick: () => navigate('/'),
    },
    {
      id: 'transfers',
      label: 'Transfers',
      icon: <InsertDriveFileRoundedIcon />,
      onClick: () => navigate('/transfers'),
    },
    {
      id: 'partners',
      label: 'Partners',
      icon: <GroupRoundedIcon />,
      onClick: () => navigate('/partners'),
    },
    {
      id: 'exceptions',
      label: 'Exceptions',
      icon: <ErrorRoundedIcon />,
      onClick: () => navigate('/exceptions'),
    },
    {
      id: 'reports',
      label: 'Scheduled Reports',
      icon: <AssignmentIcon />,
      onClick: () => navigate('/reports'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsRoundedIcon />,
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: backgroundColor }}>
      {/* Sidebar - no wrapper; CollapsibleSideNav handles width and layout */}
      <CollapsibleSideNav
        items={navItems}
        selectedItemId={selectedNavItem}
        onItemSelect={(id) => {
          const item = navItems.find(i => i.id === id);
          item?.onClick?.();
        }}
        expanded={sidebarExpanded}
        onExpandedChange={setSidebarExpanded}
        sx={{
          width: sidebarExpanded ? 240 : 48,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          height: '100%',
          overflowY: 'auto',
        }}
      />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ borderBottom: hideHeaderBorder ? 'none' : '1px solid', borderColor: 'divider' }}>
          <Header
            searchPlaceholder="Search for files"
            environmentLabel="CoEnterprise - Production"
            userInitials="KB"
            userName="Kyle Boyd"
            userOrganization="CoEnterprise"
          />
        </Box>
        {showRefresh && (
          <Box sx={{ px: 3, py: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">
              {refreshTime || 'Last refreshed: 4 hours ago'}
            </Typography>
            <IconButton size="small" color="secondary">
              <RefreshIcon />
            </IconButton>
          </Box>
        )}

        {/* Page Content */}
        <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

