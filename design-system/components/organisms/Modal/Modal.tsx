import React from 'react';
import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { BaseComponentProps } from '../../../types';

export interface ModalProps extends Omit<MuiDialogProps, 'children' | 'title'>, BaseComponentProps {
  /**
   * If true, the modal is open
   */
  open: boolean;
  /**
   * Callback fired when the modal should close
   */
  onClose?: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  /**
   * The title of the modal
   */
  title?: React.ReactNode;
  /**
   * The content of the modal
   */
  children: React.ReactNode;
  /**
   * Actions to display at the bottom of the modal
   */
  actions?: React.ReactNode;
  /**
   * If true, displays a close button in the title
   */
  showCloseButton?: boolean;
  /**
   * The maximum width of the modal
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  /**
   * If true, clicking the backdrop will close the modal
   */
  closeOnBackdropClick?: boolean;
}

/**
 * Modal component for displaying dialog content
 * Extends MUI Dialog with custom styling
 */
export const Modal: React.FC<ModalProps> = ({
  className,
  'data-testid': testId,
  open,
  onClose,
  title,
  children,
  actions,
  showCloseButton = true,
  maxWidth = 'sm',
  closeOnBackdropClick = true,
  ...props
}) => {
  return (
    <MuiDialog
      className={className}
      data-testid={testId}
      open={open}
      onClose={closeOnBackdropClick ? onClose : undefined}
      maxWidth={maxWidth}
      fullWidth
      {...props}
    >
      {title && (
        <MuiDialogTitle>
          {title}
          {showCloseButton && onClose && (
            <IconButton
              aria-label="close"
              onClick={() => onClose()}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </MuiDialogTitle>
      )}
      <MuiDialogContent dividers>{children}</MuiDialogContent>
      {actions && <MuiDialogActions>{actions}</MuiDialogActions>}
    </MuiDialog>
  );
};

