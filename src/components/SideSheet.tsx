import React from 'react';
import { Drawer, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface SideSheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  width?: number | string;
  anchor?: 'left' | 'right';
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function SideSheet({
  open,
  onClose,
  title,
  width = 480,
  anchor = 'right',
  footer,
  children,
}: SideSheetProps) {
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width, display: 'flex', flexDirection: 'column' } }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          minHeight: 56,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small" aria-label="Close side sheet">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>{children}</Box>
      {footer && (
        <>
          <Divider />
          <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {footer}
          </Box>
        </>
      )}
    </Drawer>
  );
}

export default SideSheet;
