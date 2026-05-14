import { Box, Typography, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import type { TimelineEntry, TimelineState } from '../fixtures/exceptions';

export type LifecycleStage = '850' | '855' | '856' | 'Receipt' | 'Invoice';

const STAGES: LifecycleStage[] = ['850', '855', '856', 'Receipt', 'Invoice'];

const STAGE_LABEL: Record<LifecycleStage, string> = {
  '850': 'PO',
  '855': 'PO ack',
  '856': 'ASN',
  Receipt: 'Receipt',
  Invoice: 'Invoice',
};

const STATE_BG: Record<TimelineState, string> = {
  ok: 'success.main',
  pending: 'info.main',
  warn: 'warning.main',
  breach: 'error.main',
  info: 'info.light',
  future: 'grey.300',
};

const STATE_FG: Record<TimelineState, string> = {
  ok: 'common.white',
  pending: 'common.white',
  warn: 'common.white',
  breach: 'common.white',
  info: 'common.white',
  future: 'text.disabled',
};

function matchStage(stage: LifecycleStage, ev: TimelineEntry): boolean {
  const e = ev.event.toLowerCase();
  switch (stage) {
    case '850':
      return e.includes('850') || /\bpo\b.*receiv/.test(e);
    case '855':
      return e.includes('855') || (e.includes('ack') && !e.includes('997'));
    case '856':
      return e.includes('856') || e.includes('asn');
    case 'Receipt':
      return (
        e.includes('receipt') ||
        e.includes('goods received') ||
        e.includes('dock') ||
        e.includes('wms') ||
        e.includes('pick complete')
      );
    case 'Invoice':
      return e.includes('810') || e.includes('invoice');
  }
}

function deriveStageState(stage: LifecycleStage, timeline: TimelineEntry[]): TimelineState {
  const matches = timeline.filter((t) => matchStage(stage, t));
  if (matches.length === 0) return 'future';
  const severity: Record<TimelineState, number> = {
    breach: 5,
    warn: 4,
    pending: 3,
    info: 2,
    ok: 1,
    future: 0,
  };
  const sorted = [...matches].sort((a, b) => severity[b.state] - severity[a.state]);
  return sorted[0].state;
}

function StageIcon({ state, size = 14 }: { state: TimelineState; size?: number }) {
  const sx = { fontSize: size, color: STATE_FG[state] };
  switch (state) {
    case 'ok':
      return <CheckIcon sx={sx} />;
    case 'breach':
      return <ErrorOutlineIcon sx={sx} />;
    case 'warn':
      return <WarningAmberIcon sx={sx} />;
    case 'pending':
      return <HourglassBottomIcon sx={sx} />;
    case 'info':
      return <CheckIcon sx={sx} />;
    case 'future':
      return <RadioButtonUncheckedIcon sx={{ ...sx, color: 'grey.400' }} />;
  }
}

export interface LifecycleStripProps {
  timeline: TimelineEntry[];
  compact?: boolean;
  onStageClick?: (stage: LifecycleStage) => void;
  clickableStages?: Set<LifecycleStage>;
}

export function LifecycleStrip({ timeline, compact = false, onStageClick, clickableStages }: LifecycleStripProps) {
  const states = STAGES.map((s) => ({ stage: s, state: deriveStageState(s, timeline) }));

  if (compact) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
        {states.map((s, i) => {
          const isLast = i === states.length - 1;
          const next = states[i + 1];
          return (
            <Box key={s.stage} sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title={`${STAGE_LABEL[s.stage]} (${s.stage}) · ${s.state}`} arrow>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: STATE_BG[s.state],
                    border: s.state === 'future' ? '1px dashed' : 'none',
                    borderColor: 'grey.400',
                    flex: '0 0 auto',
                  }}
                />
              </Tooltip>
              {!isLast && (
                <Box
                  sx={{
                    width: 18,
                    height: '2px',
                    mx: 0.5,
                    bgcolor:
                      next && next.state !== 'future' && s.state !== 'future'
                        ? 'primary.main'
                        : 'divider',
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        px: 1,
        py: 1.5,
      }}
    >
      {states.map((s, i) => {
        const isLast = i === states.length - 1;
        const next = states[i + 1];
        const isClickable = !!onStageClick && (clickableStages ? clickableStages.has(s.stage) : s.state !== 'future');
        return (
          <Box key={s.stage} sx={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, minWidth: 0 }}>
              <Tooltip title={isClickable ? `Open ${STAGE_LABEL[s.stage]} (${s.stage}) document` : `${STAGE_LABEL[s.stage]} (${s.stage}) · ${s.state}`} arrow>
                <Box
                  onClick={isClickable ? () => onStageClick!(s.stage) : undefined}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: STATE_BG[s.state],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: s.state === 'future' ? '1px dashed' : 'none',
                    borderColor: 'grey.300',
                    cursor: isClickable ? 'pointer' : 'default',
                    transition: 'transform 120ms',
                    '&:hover': isClickable ? { transform: 'scale(1.08)', boxShadow: 1 } : undefined,
                  }}
                >
                  <StageIcon state={s.state} />
                </Box>
              </Tooltip>
              <Box sx={{ textAlign: 'center', lineHeight: 1.1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                  {s.stage}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                  {STAGE_LABEL[s.stage]}
                </Typography>
              </Box>
            </Box>
            {!isLast && (
              <Box
                sx={{
                  flex: 1,
                  height: '2px',
                  mx: 1,
                  mb: 2.5,
                  bgcolor:
                    next && next.state !== 'future' && s.state !== 'future'
                      ? 'primary.main'
                      : 'divider',
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default LifecycleStrip;
