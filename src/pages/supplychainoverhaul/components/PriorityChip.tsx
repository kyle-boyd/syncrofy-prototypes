import { Box, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Factor } from '../lib/priority';

export type PriorityBand = 'critical' | 'high' | 'medium' | 'low';

export function bandFor(score: number): PriorityBand {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

const BAND_BG: Record<PriorityBand, string> = {
  critical: 'error.main',
  high: 'warning.main',
  medium: 'info.main',
  low: 'grey.300',
};

const BAND_FG: Record<PriorityBand, string> = {
  critical: 'common.white',
  high: 'common.white',
  medium: 'common.white',
  low: 'text.primary',
};

interface BreakdownProps {
  severity: Factor;
  ttb: Factor;
  impact: Factor;
  tier: Factor;
  score: number;
}

function Bar({ label, value }: { label: string; value: Factor }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" sx={{ width: 64, color: 'grey.300' }}>
        {label}
      </Typography>
      <Box sx={(t) => ({ flex: 1, height: 6, bgcolor: alpha(t.palette.common.white, 0.15), borderRadius: 0.5, position: 'relative' })}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            width: `${(value / 5) * 100}%`,
            bgcolor: 'common.white',
            borderRadius: 0.5,
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ width: 16, textAlign: 'right', color: 'common.white' }}>
        {value}
      </Typography>
    </Box>
  );
}

function Breakdown({ severity, ttb, impact, tier, score }: BreakdownProps) {
  return (
    <Box sx={{ width: 200, p: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'grey.300' }}>Priority</Typography>
        <Typography variant="subtitle2" sx={{ color: 'common.white', fontFamily: 'monospace' }}>
          {score}
        </Typography>
      </Box>
      <Bar label="severity" value={severity} />
      <Bar label="ttb" value={ttb} />
      <Bar label="impact" value={impact} />
      <Bar label="tier" value={tier} />
    </Box>
  );
}

export interface PriorityChipProps {
  score: number;
  severity: Factor;
  ttb: Factor;
  impact: Factor;
  tier: Factor;
}

export function PriorityChip({ score, severity, ttb, impact, tier }: PriorityChipProps) {
  const band = bandFor(score);
  return (
    <Tooltip
      arrow
      placement="right"
      title={<Breakdown severity={severity} ttb={ttb} impact={impact} tier={tier} score={score} />}
    >
      <Box
        sx={{
          width: 40,
          minWidth: 40,
          height: 28,
          borderRadius: 1,
          bgcolor: BAND_BG[band],
          color: BAND_FG[band],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'default',
        }}
      >
        {score}
      </Box>
    </Tooltip>
  );
}

export default PriorityChip;
