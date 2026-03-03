import React from 'react';
import MuiRadio, { RadioProps as MuiRadioProps } from '@mui/material/Radio';
import { BaseComponentProps } from '../../../types';

export interface RadioProps extends Omit<MuiRadioProps, 'size'>, BaseComponentProps {
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
   * The value of the component
   */
  value?: string;
  /**
   * Callback fired when the state is changed
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

/**
 * Radio component for single selection from a group
 * Extends MUI Radio with custom styling
 */
export const Radio: React.FC<RadioProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiRadio className={className} data-testid={testId} {...props} />
  );
};

