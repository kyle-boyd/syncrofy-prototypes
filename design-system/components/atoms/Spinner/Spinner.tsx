import React from 'react';
import MuiCircularProgress, { CircularProgressProps as MuiCircularProgressProps } from '@mui/material/CircularProgress';
import { BaseComponentProps } from '../../../types';

export interface SpinnerProps extends MuiCircularProgressProps, BaseComponentProps {
  /**
   * The size of the spinner
   */
  size?: number | string;
  /**
   * The color of the spinner
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /**
   * The variant to use
   */
  variant?: 'determinate' | 'indeterminate';
  /**
   * The value of the progress indicator (0-100) for determinate variant
   */
  value?: number;
  /**
   * If true, the spinner is shown
   */
  loading?: boolean;
}

/**
 * Spinner component for loading states
 * Extends MUI CircularProgress with custom styling
 */
export const Spinner: React.FC<SpinnerProps> = ({
  className,
  'data-testid': testId,
  loading = true,
  ...props
}) => {
  if (!loading) {
    return null;
  }

  return (
    <MuiCircularProgress className={className} data-testid={testId} {...props} />
  );
};

