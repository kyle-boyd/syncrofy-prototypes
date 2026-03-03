import React from 'react';
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';
import { BaseComponentProps } from '../../../types';

export interface ToggleProps extends MuiSwitchProps, BaseComponentProps {
  /**
   * If true, the component is checked
   */
  checked?: boolean;
  /**
   * If true, the component is disabled
   */
  disabled?: boolean;
  /**
   * The color of the component
   */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /**
   * The size of the component
   */
  size?: 'small' | 'medium';
  /**
   * Callback fired when the state is changed
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

/**
 * Toggle component (Switch) for boolean input
 * Extends MUI Switch with custom styling
 */
export const Toggle: React.FC<ToggleProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiSwitch className={className} data-testid={testId} {...props} />
  );
};

