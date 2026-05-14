import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';

export type BannerSeverity = 'info' | 'success' | 'warning' | 'error';

export interface BannerProps {
  severity?: BannerSeverity;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const ICONS: Record<BannerSeverity, React.ReactNode> = {
  info: <InfoOutlinedIcon fontSize="small" />,
  success: <CheckCircleOutlineIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
  error: <ErrorOutlineIcon fontSize="small" />,
};

const TONE: Record<BannerSeverity, { bg: string; border: string; fg: string }> = {
  info: { bg: 'rgba(0,145,234,0.08)', border: 'info.main', fg: 'info.dark' },
  success: { bg: 'rgba(6,122,87,0.08)', border: 'success.main', fg: 'success.dark' },
  warning: { bg: 'rgba(143,108,26,0.10)', border: 'warning.main', fg: 'warning.dark' },
  error: { bg: 'rgba(199,58,58,0.08)', border: 'error.main', fg: 'error.dark' },
};

export function Banner({ severity = 'info', title, children, action, onClose, icon }: BannerProps) {
  const tone = TONE[severity];
  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 1.5,
        borderRadius: 1,
        border: '1px solid',
        borderColor: tone.border,
        bgcolor: tone.bg,
      }}
    >
      <Box sx={{ color: tone.fg, mt: '2px' }}>{icon ?? ICONS[severity]}</Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {title && (
          <Typography variant="subtitle2" sx={{ color: tone.fg }}>
            {title}
          </Typography>
        )}
        {children && (
          <Typography variant="body2" color="text.primary" sx={{ mt: title ? 0.25 : 0 }}>
            {children}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ display: 'flex', alignItems: 'center' }}>{action}</Box>}
      {onClose && (
        <IconButton size="small" onClick={onClose} aria-label="Dismiss">
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}

export default Banner;
