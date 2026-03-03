import React from 'react';
import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import { BaseComponentProps } from '../../../types';

export interface IconButtonProps extends MuiIconButtonProps, BaseComponentProps {
  /**
   * The icon to display
   */
  children: React.ReactNode;
  /**
   * The color of the component
   */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  /**
   * The size of the component
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If true, the button is disabled
   */
  disabled?: boolean;
  /**
   * Callback fired when the button is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * If true, the button will use edge padding
   */
  edge?: 'start' | 'end' | false;
}

/**
 * IconButton component for icon-only buttons
 * Extends MUI IconButton with custom styling
 */
export const IconButton: React.FC<IconButtonProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiIconButton className={className} data-testid={testId} {...props}>
      {props.children}
    </MuiIconButton>
  );
};

