import React from 'react';
import MuiDivider, { DividerProps as MuiDividerProps } from '@mui/material/Divider';
import { BaseComponentProps } from '../../../types';

export interface DividerProps extends MuiDividerProps, BaseComponentProps {
  /**
   * The variant to use
   */
  variant?: 'fullWidth' | 'inset' | 'middle';
  /**
   * The orientation of the divider
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * If true, adds a text label to the divider
   */
  children?: React.ReactNode;
  /**
   * The text alignment of the divider's children
   */
  textAlign?: 'center' | 'left' | 'right';
  /**
   * If true, applies light styling
   */
  light?: boolean;
}

/**
 * Divider component for separating content sections
 * Extends MUI Divider with custom styling
 */
export const Divider: React.FC<DividerProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiDivider className={className} data-testid={testId} {...props}>
      {props.children}
    </MuiDivider>
  );
};

