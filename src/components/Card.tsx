import React from 'react';
import { Box, Typography, Divider, BoxProps } from '@mui/material';

export interface CardProps extends Omit<BoxProps, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  padded?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({
  title,
  subtitle,
  actions,
  footer,
  padded = true,
  interactive,
  onClick,
  children,
  sx,
  ...rest
}: CardProps) {
  const hasHeader = Boolean(title || subtitle || actions);
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
        transition: 'box-shadow 120ms ease, border-color 120ms ease',
        cursor: interactive || onClick ? 'pointer' : 'default',
        '&:hover': interactive || onClick ? { boxShadow: 2, borderColor: 'primary.light' } : undefined,
        ...sx,
      }}
      {...rest}
    >
      {hasHeader && (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, px: 2.5, py: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {title && <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
        </Box>
      )}
      {hasHeader && padded && <Divider />}
      <Box sx={{ p: padded ? 2.5 : 0 }}>{children}</Box>
      {footer && (
        <>
          <Divider />
          <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'grey.50' }}>{footer}</Box>
        </>
      )}
    </Box>
  );
}

export default Card;
