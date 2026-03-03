import React from 'react';
import MuiButtonGroup, { ButtonGroupProps as MuiButtonGroupProps } from '@mui/material/ButtonGroup';
import { BaseComponentProps } from '../../../types';

export interface ButtonGroupProps extends MuiButtonGroupProps, BaseComponentProps {
  /**
   * The content of the button group
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
   * If true, the button group is disabled
   */
  disabled?: boolean;
  /**
   * If true, the button group will be displayed vertically
   */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * ButtonGroup component for grouping buttons together
 * Extends MUI ButtonGroup with custom styling
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiButtonGroup className={className} data-testid={testId} {...props}>
      {props.children}
    </MuiButtonGroup>
  );
};

