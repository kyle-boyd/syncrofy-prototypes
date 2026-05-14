import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  padding = 2,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  padding?: number;
}) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        p: padding,
      }}
    >
      {(title || subtitle || action) && (
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 1.5 }}
        >
          <Box>
            {title && (
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
      )}
      {children}
    </Box>
  );
}
