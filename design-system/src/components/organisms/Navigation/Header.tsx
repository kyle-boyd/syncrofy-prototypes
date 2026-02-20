import React, { useState } from 'react';
import MuiToolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import MuiList from '@mui/material/List';
import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MuiListItemText from '@mui/material/ListItemText';
import { Search } from '@/components/atoms/Search';
import { Chips } from '@/components/atoms/Chips';
import { IconButton } from '@/components/atoms/IconButton';
import { Badge } from '@/components/atoms/Badge';
import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/atoms/Divider';
import { ListItem } from '@/components/molecules/ListItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { BaseComponentProps } from '@/types';

export interface EnvironmentOption {
  value: string;
  label: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  time: string;
  read: boolean;
  icon?: React.ReactElement;
}

export interface HeaderProps extends BaseComponentProps {
  /**
   * Search input placeholder text
   */
  searchPlaceholder?: string;
  /**
   * Search input value
   */
  searchValue?: string;
  /**
   * Callback fired when the search value changes
   */
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Callback fired when the search is performed
   */
  onSearch?: (value: string) => void;
  /**
   * Environment label to display in the chip (e.g., "CoEnterprise - Production")
   */
  environmentLabel?: string;
  /**
   * Available environments for the dropdown
   */
  environments?: EnvironmentOption[];
  /**
   * Currently selected environment value
   */
  selectedEnvironment?: string;
  /**
   * Callback fired when environment is changed
   */
  onEnvironmentChange?: (value: string) => void;
  /**
   * User initials to display in the avatar
   */
  userInitials?: string;
  /**
   * User full name to display in the menu
   */
  userName?: string;
  /**
   * User organization to display in the menu
   */
  userOrganization?: string;
  /**
   * User avatar image URL
   */
  userAvatar?: string;
  /**
   * Callback fired when the notification button is clicked
   */
  onNotificationsClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Callback fired when the avatar button is clicked
   */
  onAvatarClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Callback fired when Appearance & Timezone button is clicked
   */
  onAppearanceClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Callback fired when Account Settings button is clicked
   */
  onAccountSettingsClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Callback fired when Logout button is clicked
   */
  onLogoutClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * If true, shows a notification badge dot
   */
  showNotificationBadge?: boolean;
  /**
   * List of notifications to display
   */
  notifications?: Notification[];
  /**
   * Callback fired when a notification is clicked
   */
  onNotificationClick?: (notification: Notification) => void;
  /**
   * Callback fired when "Mark all as read" is clicked
   */
  onMarkAllAsRead?: () => void;
  /**
   * Callback fired when notification settings icon is clicked
   */
  onNotificationSettingsClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Header component for top navigation bar with search, environment indicator, and user actions
 * Built using MUI components following the design system patterns
 */
export const Header: React.FC<HeaderProps> = ({
  className,
  'data-testid': testId,
  searchPlaceholder = 'Search for files',
  searchValue,
  onSearchChange,
  onSearch,
  environmentLabel = 'CoEnterprise - Production',
  environments = [],
  selectedEnvironment,
  onEnvironmentChange,
  userInitials = 'KB',
  userName = 'Kyle Boyd',
  userOrganization = 'CoEnterprise',
  userAvatar,
  onNotificationsClick,
  onAvatarClick,
  onAppearanceClick,
  onAccountSettingsClick,
  onLogoutClick,
  showNotificationBadge = true,
  notifications = [],
  onNotificationClick,
  onMarkAllAsRead,
  onNotificationSettingsClick,
}) => {
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState<HTMLElement | null>(null);
  const [environmentMenuAnchor, setEnvironmentMenuAnchor] = useState<HTMLElement | null>(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<HTMLElement | null>(null);
  const [notificationTab, setNotificationTab] = useState<'unread' | 'all'>('unread');

  const isAvatarMenuOpen = Boolean(avatarMenuAnchor);
  const isEnvironmentMenuOpen = Boolean(environmentMenuAnchor);
  const isNotificationMenuOpen = Boolean(notificationMenuAnchor);

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAvatarMenuAnchor(event.currentTarget);
    onAvatarClick?.(event);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
    // Also close environment menu if open
    setEnvironmentMenuAnchor(null);
  };

  const handleEnvironmentButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setEnvironmentMenuAnchor(event.currentTarget);
  };

  const handleEnvironmentMenuClose = () => {
    setEnvironmentMenuAnchor(null);
  };

  const handleEnvironmentSelect = (value: string | number) => {
    onEnvironmentChange?.(String(value));
    handleEnvironmentMenuClose();
  };

  const handleMenuAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    callback?: (event: React.MouseEvent<HTMLButtonElement>) => void
  ) => {
    if (callback) {
      callback(event);
    }
    handleAvatarMenuClose();
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationMenuAnchor(event.currentTarget);
    onNotificationsClick?.(event);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null);
  };

  const handleNotificationItemClick = (notification: Notification) => {
    onNotificationClick?.(notification);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead?.();
  };

  const handleNotificationTabChange = (_event: React.SyntheticEvent, newValue: 'unread' | 'all') => {
    setNotificationTab(newValue);
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const displayedNotifications = notificationTab === 'unread' ? unreadNotifications : notifications;
  const unreadCount = unreadNotifications.length;
  const totalCount = notifications.length;

  const currentEnvironment = selectedEnvironment 
    ? environments.find(env => env.value === selectedEnvironment)?.label || environmentLabel
    : environmentLabel;

  return (
    <MuiToolbar
      className={className}
      data-testid={testId}
      sx={{
        minHeight: '64px !important',
        paddingX: 2,
        backgroundColor: 'transparent',
      }}
    >
      {/* Center section with search */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: '100%',
            maxWidth: '500px',
            position: 'relative',
          }}
        >
          <Search
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            onSearch={onSearch}
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
              },
            }}
          />
        </Box>
      </Box>

      {/* Right section with environment chip, notifications and avatar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {environmentLabel && (
          <Chips
            label={environmentLabel}
            variant="outlined"
            size="medium"
            color="default"
          />
        )}
        <IconButton
          onClick={handleNotificationClick}
          size="medium"
          data-testid={testId ? `${testId}-notifications` : undefined}
        >
          <Badge
            variant="dot"
            color="error"
            invisible={!showNotificationBadge}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <IconButton
          onClick={handleAvatarClick}
          size="medium"
          data-testid={testId ? `${testId}-avatar` : undefined}
        >
          <Avatar
            src={userAvatar}
            size="40px"
          >
            {userInitials}
          </Avatar>
        </IconButton>
      </Box>

      {/* Avatar Menu Popover */}
      <Popover
        open={isAvatarMenuOpen}
        anchorEl={avatarMenuAnchor}
        onClose={handleAvatarMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            maxWidth: 320,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* User Info Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Avatar
              src={userAvatar}
              size="40px"
              sx={{ mr: 2 }}
            >
              {userInitials}
            </Avatar>
            <Box sx={{ display: 'grid' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userOrganization}
              </Typography>
            </Box>
          </Box>

          {/* Environment and Actions Section */}
          <Box sx={{ display: 'grid', gap: 1 }}>
            {/* Environment Badge with Dropdown */}
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              endIcon={<ExpandMoreIcon />}
              onClick={handleEnvironmentButtonClick}
              disabled={environments.length === 0}
              sx={{ justifyContent: 'space-between' }}
            >
              {currentEnvironment}
            </Button>
            
            {/* Environment Menu */}
            {environments.length > 0 && (
              <Menu
                anchorEl={environmentMenuAnchor}
                open={isEnvironmentMenuOpen}
                onClose={handleEnvironmentMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                MenuListProps={{
                  'aria-labelledby': 'environment-button',
                }}
              >
                {environments.map((env) => (
                  <MenuItem
                    key={env.value}
                    selected={env.value === selectedEnvironment}
                    onClick={() => handleEnvironmentSelect(env.value)}
                  >
                    {env.label}
                  </MenuItem>
                ))}
              </Menu>
            )}

            {/* Appearance & Timezone Button */}
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              fullWidth
              startIcon={<LanguageIcon />}
              onClick={(e) => handleMenuAction(e, onAppearanceClick)}
            >
              Appearance & Timezone
            </Button>

            {/* Account Settings Button */}
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              fullWidth
              startIcon={<AccountCircleOutlinedIcon />}
              onClick={(e) => handleMenuAction(e, onAccountSettingsClick)}
            >
              Account Settings
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 2 }} />

          {/* Logout Button */}
          <Box sx={{ display: 'grid' }}>
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={(e) => handleMenuAction(e, onLogoutClick)}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Notification Menu Popover */}
      <Popover
        open={isNotificationMenuOpen}
        anchorEl={notificationMenuAnchor}
        onClose={handleNotificationMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 480,
            maxHeight: 600,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: 2,
            px: 2,
            pt: 2,
            pb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              textAlign: 'left',
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '160%',
              letterSpacing: '-0.4px',
              color: 'black',
            }}
          >
            Notifications
          </Typography>
          <IconButton
            size="small"
            onClick={onNotificationSettingsClick}
            sx={{
              height: 32,
              padding: '6px 8px',
            }}
          >
            <SettingsOutlinedIcon sx={{ width: 16, height: 16, color: '#424242' }} />
          </IconButton>
        </Box>

        <Divider />

        {/* Tabs and Mark All as Read */}
        <Box
          sx={{
            width: '100%',
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box>
            <MuiTabs
              value={notificationTab}
              onChange={handleNotificationTabChange}
              sx={{
                minHeight: 'auto',
                '& .MuiTab-root': {
                  minHeight: 24,
                  padding: '4px 8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: '10px',
                  '&.Mui-selected': {
                    backgroundColor: 'white',
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <MuiTab
                label={`Unread (${unreadCount})`}
                value="unread"
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'white',
                  },
                }}
              />
              <MuiTab
                label={`All (${totalCount})`}
                value="all"
              />
            </MuiTabs>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{
                ml: 2,
                height: 32,
                px: 1.5,
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              Mark all as read
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Notification List */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            height: 540,
          }}
        >
          {displayedNotifications.length > 0 ? (
            <MuiList sx={{ py: 0 }}>
              {displayedNotifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationItemClick(notification)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : '#FFF',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <MuiListItemAvatar sx={{ minWidth: 'fit-content', mr: 1 }}>
                    <Avatar
                      size="24px"
                      sx={{
                        mt: 0.5,
                        width: 20,
                        height: 20,
                        padding: 1.5,
                        borderRadius: '6px',
                      }}
                    >
                      {notification.icon || <DashboardOutlinedIcon sx={{ fontSize: 'small' }} />}
                    </Avatar>
                  </MuiListItemAvatar>
                  <MuiListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: 'flex',
                          pl: '3px',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-start',
                          gap: 0.5,
                        }}
                      >
                        <Typography variant="caption">
                          {notification.message}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '12px',
                              fontWeight: 400,
                              lineHeight: '16px',
                            }}
                          >
                            {notification.timestamp}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '12px',
                              fontWeight: 400,
                              lineHeight: '16px',
                              color: 'text.secondary',
                            }}
                          >
                            {notification.time}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </MuiList>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                You're all caught up!
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </MuiToolbar>
  );
};

