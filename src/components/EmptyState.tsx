import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function EmptyState({ icon, title, description, action, size = 'medium' }: EmptyStateProps) {
  const py = size === 'small' ? 4 : size === 'large' ? 10 : 6;
  const iconSize = size === 'small' ? 32 : size === 'large' ? 64 : 48;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py,
        px: 2,
      }}
    >
      <Box sx={{ color: 'text.disabled', fontSize: iconSize, mb: 1.5, '& svg': { fontSize: iconSize } }}>
        {icon ?? <InboxIcon fontSize="inherit" />}
      </Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mb: action ? 2 : 0 }}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}

export default EmptyState;
