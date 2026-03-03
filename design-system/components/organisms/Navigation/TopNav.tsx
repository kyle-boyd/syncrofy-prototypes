import React from 'react';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiToolbar from '@mui/material/Toolbar';
import { BaseComponentProps } from '../../../../types';

export interface TopNavProps extends MuiAppBarProps, BaseComponentProps {
  /**
   * Content to display on the left side
   */
  leftContent?: React.ReactNode;
  /**
   * Content to display in the center
   */
  centerContent?: React.ReactNode;
  /**
   * Content to display on the right side
   */
  rightContent?: React.ReactNode;
  /**
   * The position of the app bar
   */
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  /**
   * The color of the app bar
   */
  color?: 'default' | 'inherit' | 'primary' | 'secondary' | 'transparent';
}

/**
 * TopNav component for top navigation bar
 * Extends MUI AppBar with custom styling
 */
export const TopNav: React.FC<TopNavProps> = ({
  className,
  'data-testid': testId,
  leftContent,
  centerContent,
  rightContent,
  ...props
}) => {
  return (
    <MuiAppBar className={className} data-testid={testId} {...props}>
      <MuiToolbar>
        {leftContent && (
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
            {leftContent}
          </div>
        )}
        {centerContent && (
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            {centerContent}
          </div>
        )}
        {rightContent && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            {rightContent}
          </div>
        )}
      </MuiToolbar>
    </MuiAppBar>
  );
};

