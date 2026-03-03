import React from 'react';
import MuiCheckbox, { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';
import { BaseComponentProps } from '../../../types';

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'size'>, BaseComponentProps {
  /**
   * If true, the component is checked
   */
  checked?: boolean;
  /**
   * If true, the component is disabled
   */
  disabled?: boolean;
  /**
   * If true, the checkbox is indeterminate
   */
  indeterminate?: boolean;
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
 * Checkbox component for selection states
 * Extends MUI Checkbox with custom styling
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiCheckbox className={className} data-testid={testId} {...props} />
  );
};

