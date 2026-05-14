import { Box, Typography } from '@mui/material';

export type StatTone = 'neutral' | 'success' | 'warn' | 'critical';

const TONE_FG: Record<StatTone, string> = {
  neutral: 'text.primary',
  success: 'success.dark',
  warn: 'warning.dark',
  critical: 'error.dark',
};

export interface StatTileProps {
  label: string;
  value: React.ReactNode;
  trend?: string;
  tone?: StatTone;
}

export function StatTile({ label, value, trend, tone = 'neutral' }: StatTileProps) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 160,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 2,
        py: 1.5,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.5 }}
      >
        {label}
      </Typography>
      <Typography variant="h4" sx={{ color: TONE_FG[tone], lineHeight: 1.1, fontWeight: 500 }}>
        {value}
      </Typography>
      {trend && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          {trend}
        </Typography>
      )}
    </Box>
  );
}

export default StatTile;
