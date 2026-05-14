import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Badge } from '@design-system';
import {
  ArrowLeftRight,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  HelpCircle,
  Home,
  Inbox,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import { exceptions } from '../../fixtures/exceptions';
import { useUncategorizedSenders } from '../../lib/uncategorizedStore';

interface NavRoute {
  id: string;
  label: string;
  icon: React.ReactNode;
  to?: string;
  badge?: number;
  disabledLabel?: string;
}

const ICON_SIZE = 16;
const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

function NavItem({
  route,
  active,
  collapsed,
  onClick,
}: {
  route: NavRoute;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const theme = useTheme();
  const isDisabled = Boolean(route.disabledLabel);

  const content = (
    <Box
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled}
      aria-current={active ? 'page' : undefined}
      onClick={isDisabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (isDisabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: collapsed ? 0 : 1.25,
        py: 0.75,
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        backgroundColor: active ? theme.palette.primary.main : 'transparent',
        color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
        '&:hover': {
          backgroundColor: active
            ? theme.palette.primary.main
            : isDisabled
            ? 'transparent'
            : theme.palette.action.hover,
        },
        transition: 'background-color 0.15s ease',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          color: 'inherit',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {route.icon}
        {collapsed && route.badge !== undefined && route.badge > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -6,
              minWidth: 16,
              height: 16,
              px: '4px',
              borderRadius: 8,
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              fontSize: 10,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {route.badge > 99 ? '99+' : route.badge}
          </Box>
        )}
      </Box>
      {!collapsed && (
        <>
          <Typography
            variant="body2"
            sx={{ flex: 1, fontWeight: active ? 600 : 500, color: 'inherit' }}
            noWrap
          >
            {route.label}
          </Typography>
          {route.badge !== undefined && route.badge > 0 && (
            <Badge
              badgeContent={route.badge}
              color="error"
              max={99}
              sx={{
                '& .MuiBadge-badge': {
                  position: 'static',
                  transform: 'none',
                  fontSize: 11,
                  height: 18,
                  minWidth: 18,
                  padding: '0 6px',
                },
              }}
            >
              <span />
            </Badge>
          )}
          {route.disabledLabel && (
            <Typography
              component="span"
              variant="caption"
              sx={{
                color: 'text.disabled',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontSize: 10,
              }}
            >
              {route.disabledLabel}
            </Typography>
          )}
        </>
      )}
    </Box>
  );

  if (collapsed) {
    return (
      <Tooltip title={route.label} placement="right" arrow>
        {content}
      </Tooltip>
    );
  }
  return content;
}

export function SupplyChainSideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('supplychain-nav-collapsed') === '1';
  });

  React.useEffect(() => {
    window.localStorage.setItem('supplychain-nav-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  const openExceptionsCount = exceptions.length;
  // The Partners nav badge reflects uncategorized-sender count (i.e., "things
  // needing your attention"), not the total partner count — same semantic as
  // the Inbox badge.
  const uncategorizedCount = useUncategorizedSenders().length;

  const primaryRoutes: NavRoute[] = [
    { id: 'home', label: 'Home', icon: <Home size={ICON_SIZE} />, to: '/supplychainoverhaul' },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: <Inbox size={ICON_SIZE} />,
      to: '/supplychainoverhaul/inbox',
      badge: openExceptionsCount,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <ArrowLeftRight size={ICON_SIZE} />,
      to: '/supplychainoverhaul/transactions',
    },
    {
      id: 'partners',
      label: 'Partners',
      icon: <Users size={ICON_SIZE} />,
      to: '/supplychainoverhaul/partners',
      badge: uncategorizedCount > 0 ? uncategorizedCount : undefined,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FileText size={ICON_SIZE} />,
      to: '/supplychainoverhaul/documents',
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: <Sparkles size={ICON_SIZE} />,
      to: '/supplychainoverhaul/recommendations',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 size={ICON_SIZE} />,
      to: '/supplychainoverhaul/reports',
    },
  ];

  const utilityRoutes: NavRoute[] = [
    { id: 'settings', label: 'Settings', icon: <Settings size={ICON_SIZE} />, disabledLabel: 'phase 2' },
    { id: 'help', label: 'Help', icon: <HelpCircle size={ICON_SIZE} />, disabledLabel: 'phase 2' },
  ];

  const isActive = (to?: string) => {
    if (!to) return false;
    if (to === '/supplychainoverhaul') {
      return location.pathname === '/supplychainoverhaul';
    }
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const collapseButton = (
    <Box
      role="button"
      tabIndex={0}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      onClick={() => setCollapsed((c) => !c)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setCollapsed((c) => !c);
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        px: collapsed ? 0 : 1.25,
        py: 0.75,
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 1,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        '&:hover': { backgroundColor: theme.palette.action.hover },
        transition: 'background-color 0.15s ease',
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          flexShrink: 0,
        }}
      >
        {collapsed ? <ChevronsRight size={ICON_SIZE} /> : <ChevronsLeft size={ICON_SIZE} />}
      </Box>
      {!collapsed && (
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'inherit' }} noWrap>
          Collapse
        </Typography>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        width,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.background.paper, 1),
        transition: 'width 0.2s ease',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 64,
          px: collapsed ? 0 : 2,
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={collapsed ? '/logos/Syncrofy Logo Collapsed.svg' : '/logos/Syncrofy Logo.svg'}
          alt="Syncrofy"
          sx={{ height: collapsed ? 18 : 28, width: 'auto' }}
        />
      </Box>

      {/* Primary nav */}
      <Stack spacing={0.25} sx={{ px: 1.5, pt: 1, flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {primaryRoutes.map((route) => (
          <NavItem
            key={route.id}
            route={route}
            active={isActive(route.to)}
            collapsed={collapsed}
            onClick={route.to ? () => navigate(route.to!) : undefined}
          />
        ))}
      </Stack>

      {/* Footer: utility + collapse */}
      <Box sx={{ px: 1.5, pb: 1.5, flexShrink: 0 }}>
        <Divider sx={{ my: 1 }} />
        <Stack spacing={0.25}>
          {utilityRoutes.map((route) => (
            <NavItem key={route.id} route={route} active={false} collapsed={collapsed} />
          ))}
        </Stack>
        <Divider sx={{ my: 1 }} />
        {collapsed ? (
          <Tooltip title="Expand sidebar" placement="right" arrow>
            {collapseButton}
          </Tooltip>
        ) : (
          collapseButton
        )}
      </Box>
    </Box>
  );
}
