import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { BaseComponentProps } from '../../../types';

export interface ButtonProps extends MuiButtonProps, BaseComponentProps {
  /**
   * The content of the button
   */
  children: React.ReactNode;
  /**
   * The variant to use
   */
  variant?: 'contained' | 'outlined' | 'text';
  /**
   * The color of the component
   */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  /**
   * The size of the component
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If true, the button will take up the full width of its container
   */
  fullWidth?: boolean;
  /**
   * If true, the button is disabled
   */
  disabled?: boolean;
  /**
   * Callback fired when the button is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Adds an icon before the button text.
   * See MUI `startIcon` prop documentation for usage.
   */
  startIcon?: React.ReactNode;
  /**
   * Adds an icon after the button text.
   * See MUI `endIcon` prop documentation for usage.
   */
  endIcon?: React.ReactNode;
}

/**
 * Button component for user actions
 * Extends MUI Button with custom styling from theme
 */
export const Button: React.FC<ButtonProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiButton className={className} data-testid={testId} {...props}>
      {props.children}
    </MuiButton>
  );
};

