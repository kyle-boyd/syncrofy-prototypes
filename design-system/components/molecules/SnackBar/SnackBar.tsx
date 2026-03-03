import React from 'react';
import MuiSnackbar, { SnackbarProps as MuiSnackbarProps } from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { BaseComponentProps } from '../../../types';

export interface SnackBarProps extends Omit<MuiSnackbarProps, 'children'>, BaseComponentProps {
  /**
   * The message to display
   */
  message: React.ReactNode;
  /**
   * The severity of the alert
   */
  severity?: 'success' | 'info' | 'warning' | 'error';
  /**
   * If true, the snackbar is open
   */
  open: boolean;
  /**
   * Callback fired when the snackbar should close
   */
  onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  /**
   * The duration to display the snackbar in milliseconds
   */
  autoHideDuration?: number | null;
  /**
   * The placement of the snackbar
   */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /**
   * If true, displays action button
   */
  action?: React.ReactNode;
}

/**
 * SnackBar component for displaying brief messages
 * Extends MUI Snackbar with Alert styling
 */
export const SnackBar: React.FC<SnackBarProps> = ({
  className,
  'data-testid': testId,
  message,
  severity,
  onClose,
  ...props
}) => {
  return (
    <MuiSnackbar
      className={className}
      data-testid={testId}
      onClose={onClose}
      {...props}
    >
      <MuiAlert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </MuiAlert>
    </MuiSnackbar>
  );
};

