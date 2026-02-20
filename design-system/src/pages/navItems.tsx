import DashboardIcon from '@mui/icons-material/Dashboard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PeopleIcon from '@mui/icons-material/People';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import { CollapsibleSideNavItem } from '@/components/organisms/Navigation/CollapsibleSideNav';

/**
 * Shared navigation items for all pages
 */
export const navItems: CollapsibleSideNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'transfers', label: 'Transfers', icon: <SwapHorizIcon /> },
  { id: 'partners', label: 'Partners', icon: <PeopleIcon /> },
  { id: 'exceptions', label: 'Exceptions', icon: <ErrorOutlineIcon /> },
  { id: 'scheduled-reports', label: 'Scheduled Reports', icon: <ScheduleIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];
