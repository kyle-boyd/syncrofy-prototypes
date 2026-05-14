import { Box, Typography, LinearProgress, Tooltip } from '@mui/material';

export interface ConfidenceIndicatorProps {
  /** 0–1 or 0–100 */
  value: number;
  label?: string;
  showValue?: boolean;
  size?: 'small' | 'medium';
  tooltip?: string;
}

const bandColor = (pct: number): 'error' | 'warning' | 'success' => {
  if (pct < 50) return 'error';
  if (pct < 80) return 'warning';
  return 'success';
};

export function ConfidenceIndicator({
  value,
  label = 'Confidence',
  showValue = true,
  size = 'medium',
  tooltip,
}: ConfidenceIndicatorProps) {
  const pct = Math.max(0, Math.min(100, value <= 1 ? value * 100 : value));
  const color = bandColor(pct);
  const height = size === 'small' ? 4 : 8;

  const content = (
    <Box sx={{ minWidth: 120 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {showValue && (
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {Math.round(pct)}%
          </Typography>
        )}
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={color}
        sx={{ height, borderRadius: height / 2 }}
      />
    </Box>
  );

  return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
}

export default ConfidenceIndicator;
