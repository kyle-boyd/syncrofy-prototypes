import { Box, Typography } from '@mui/material';

export function ChartEmptyState({
  height = 200,
  message = 'No data for this time range',
}: {
  height?: number | string;
  message?: string;
}) {
  return (
    <Box
      sx={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="caption">{message}</Typography>
    </Box>
  );
}
