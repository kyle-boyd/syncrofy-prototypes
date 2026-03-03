import React from 'react';
import { BaseComponentProps } from '../../../types';

export interface IconProps extends BaseComponentProps {
  /**
   * The name of the icon (maps to MUI Icons)
   */
  name?: string;
  /**
   * The size of the icon
   */
  fontSize?: 'inherit' | 'large' | 'medium' | 'small';
  /**
   * The color of the icon
   */
  color?: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /**
   * Custom SVG content
   */
  children?: React.ReactNode;
}

/**
 * Icon component for displaying icons
 * Note: In practice, you would import specific icons from @mui/icons-material
 * This is a wrapper component that accepts children for custom icons
 */
export const Icon: React.FC<IconProps> = ({
  className,
  'data-testid': testId,
  children,
  ...otherProps
}) => {
  if (!children) {
    return null;
  }

  return (
    <div className={className} data-testid={testId} {...otherProps}>
      {children}
    </div>
  );
};

