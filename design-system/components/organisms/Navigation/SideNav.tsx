import React from 'react';
import MuiDrawer, { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import MuiList from '@mui/material/List';
import { ListItem } from '../../molecules/ListItem';
import { BaseComponentProps } from '../../../../types';

export interface SideNavItem {
  id: string;
  label: string;
  icon?: React.ReactElement;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export interface SideNavProps extends Omit<MuiDrawerProps, 'children'>, BaseComponentProps {
  /**
   * Navigation items to display
   */
  items: SideNavItem[];
  /**
   * If true, the drawer is open
   */
  open: boolean;
  /**
   * Callback fired when the drawer should close
   */
  onClose?: () => void;
  /**
   * The width of the drawer
   */
  width?: number | string;
  /**
   * The variant of the drawer
   */
  variant?: 'permanent' | 'persistent' | 'temporary';
}

/**
 * SideNav component for side navigation drawer
 * Extends MUI Drawer with custom styling
 */
export const SideNav: React.FC<SideNavProps> = ({
  className,
  'data-testid': testId,
  items,
  open,
  onClose,
  width = 280,
  variant = 'temporary',
  ...props
}) => {
  return (
    <MuiDrawer
      className={className}
      data-testid={testId}
      open={open}
      onClose={onClose}
      variant={variant}
      sx={{
        width: variant === 'permanent' ? width : undefined,
        '& .MuiDrawer-paper': {
          width: width,
        },
      }}
      {...props}
    >
      <MuiList sx={{ pt: 2 }}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            primary={item.label}
            icon={item.icon}
            button
            selected={item.selected}
            disabled={item.disabled}
            onClick={item.onClick}
          />
        ))}
      </MuiList>
    </MuiDrawer>
  );
};

