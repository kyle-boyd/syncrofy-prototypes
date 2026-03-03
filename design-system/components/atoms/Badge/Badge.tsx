import React from 'react';
import MuiBadge, { BadgeProps as MuiBadgeProps } from '@mui/material/Badge';
import { BaseComponentProps } from '../../../types';

export interface BadgeProps extends Omit<MuiBadgeProps, 'children'>, BaseComponentProps {
  /**
   * The content wrapped by the badge
   */
  children: React.ReactNode;
  /**
   * The content rendered within the badge
   */
  badgeContent?: React.ReactNode;
  /**
   * The color of the badge
   */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /**
   * Maximum count to show
   */
  max?: number;
  /**
   * Controls whether the badge is hidden when badgeContent is zero
   */
  showZero?: boolean;
  /**
   * The variant to use
   */
  variant?: 'standard' | 'dot';
}

/**
 * Badge component for displaying status indicators or counts
 * Extends MUI Badge with custom styling
 */
export const Badge: React.FC<BadgeProps> = ({
  className,
  'data-testid': testId,
  children,
  ...props
}) => {
  return (
    <MuiBadge className={className} data-testid={testId} {...props}>
      {children}
    </MuiBadge>
  );
};

