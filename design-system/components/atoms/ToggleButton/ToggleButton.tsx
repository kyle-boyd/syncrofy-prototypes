import React from 'react';
import MuiToggleButton, { ToggleButtonProps as MuiToggleButtonProps } from '@mui/material/ToggleButton';
import { BaseComponentProps } from '../../../types';

export interface ToggleButtonProps extends Omit<MuiToggleButtonProps, 'value'>, BaseComponentProps {
  /**
   * The content of the button
   */
  children: React.ReactNode;
  /**
   * If true, the button is selected
   */
  selected?: boolean;
  /**
   * The color of the component
   */
  color?: 'standard' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /**
   * The size of the component
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If true, the button is disabled
   */
  disabled?: boolean;
  /**
   * If true, the button will take up the full width of its container
   */
  fullWidth?: boolean;
  /**
   * Callback fired when the state is changed
   */
  onChange?: (event: React.MouseEvent<HTMLElement>, value: any) => void;
  /**
   * The value to associate with the button when selected
   */
  value: any;
}

/**
 * ToggleButton component for selectable buttons
 * Extends MUI ToggleButton with custom styling
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiToggleButton className={className} data-testid={testId} {...props}>
      {props.children}
    </MuiToggleButton>
  );
};
