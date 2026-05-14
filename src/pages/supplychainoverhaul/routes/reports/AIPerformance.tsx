import { useMemo } from 'react';
import { Box, Stack, Tooltip as MuiTooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Info } from 'lucide-react';
import { Tag } from '@design-system';
import { StatTile } from '../../components/StatTile';
import { BarChart, ChartCard, LineChart } from '../../components/charts';
import { useDashboardTimeRange } from './useReportsTimeRange';
import {
  CONFIDENCE_LEVELS,
  aiAcceptanceByType,
  aiAcceptanceDaily,
  type ConfidenceLevel,
} from '../../fixtures/timeseries';
import { timeRangeToDays } from '../../components/TimeRangeControl';

const EXPECTED_RANGE: Record<ConfidenceLevel, [number, number]> = {
  high: [85, 95],
  moderate: [55, 75],
  exploratory: [15, 35],
};

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  high: 'High confidence',
  moderate: 'Moderate confidence',
  exploratory: 'Exploratory',
};

interface TopAccepted {
  headline: string;
  acceptanceRate: number;
  occurrences: number;
}

const MOST_ACCEPTED: TopAccepted[] = [
  { headline: 'Resubmit with corrected GLN', acceptanceRate: 0.94, occurrences: 38 },
  { headline: 'Apply mapping from prior similar exception', acceptanceRate: 0.92, occurrences: 31 },
  { headline: 'Mute repeat warning for 30 days', acceptanceRate: 0.89, occurrences: 27 },
  { headline: 'Merge duplicate transaction', acceptanceRate: 0.88, occurrences: 24 },
  { headline: 'Email primary EDI contact', acceptanceRate: 0.86, occurrences: 22 },
  { headline: 'Auto-retry transient error', acceptanceRate: 0.85, occurrences: 19 },
  { headline: 'Apply suggested catalog mapping', acceptanceRate: 0.83, occurrences: 17 },
  { headline: 'Route to senior queue', acceptanceRate: 0.81, occurrences: 14 },
  { headline: 'Suppress noise pattern', acceptanceRate: 0.79, occurrences: 12 },
  { headline: 'Notify account manager', acceptanceRate: 0.77, occurrences: 11 },
];

const MOST_OVERRIDDEN: TopAccepted[] = [
  { headline: 'Raise variance threshold to 3%', acceptanceRate: 0.34, occurrences: 28 },
  { headline: 'Auto-close low-severity exceptions', acceptanceRate: 0.31, occurrences: 22 },
  { headline: 'Skip ASN re-validation on map deploy', acceptanceRate: 0.29, occurrences: 19 },
  { headline: 'Bulk-resolve historical duplicates', acceptanceRate: 0.27, occurrences: 16 },
  { headline: 'Escalate to account manager', acceptanceRate: 0.25, occurrences: 15 },
  { headline: 'Apply provisional mapping (no review)', acceptanceRate: 0.22, occurrences: 13 },
  { headline: 'Suppress invoice price mismatches', acceptanceRate: 0.21, occurrences: 12 },
  { headline: 'Auto-promote draft rule', acceptanceRate: 0.18, occurrences: 11 },
  { headline: 'Disable ASN late notifications', acceptanceRate: 0.16, occurrences: 9 },
  { headline: 'Override partner-specific threshold', acceptanceRate: 0.14, occurrences: 8 },
];

export default function AIPerformance() {
  const theme = useTheme();
  const range = useDashboardTimeRange('last30');
  const days = timeRangeToDays(range);

  const slice = aiAcceptanceDaily.slice(-days * CONFIDENCE_LEVELS.length);

  const overall = useMemo(() => {
    let shown = 0;
    let accepted = 0;
    for (const r of slice) {
      shown += r.shown;
      accepted += r.accepted;
    }
    return shown ? (accepted / shown) * 100 : 0;
  }, [slice]);

  const byConfidence = useMemo(() => {
    return CONFIDENCE_LEVELS.map((level) => {
      const subset = slice.filter((r) => r.confidence === level);
      const shown = subset.reduce((a, b) => a + b.shown, 0);
      const accepted = subset.reduce((a, b) => a + b.accepted, 0);
      const pct = shown ? (accepted / shown) * 100 : 0;
      const [lo, hi] = EXPECTED_RANGE[level];
      const calibrated = pct >= lo && pct <= hi;
      return { level, shown, accepted, pct, calibrated };
    });
  }, [slice]);

  const dailyAcceptance = useMemo(() => {
    const dates = Array.from(new Set(slice.map((r) => r.date))).sort();
    return dates.map((date) => {
      const dayRows = slice.filter((r) => r.date === date);
      const shown = dayRows.reduce((a, b) => a + b.shown, 0);
      const accepted = dayRows.reduce((a, b) => a + b.accepted, 0);
      const pct = shown ? Math.round((accepted / shown) * 100) : 0;
      return { date: date.slice(5), Acceptance: pct };
    });
  }, [slice]);

  const byType = useMemo(() => {
    return aiAcceptanceByType
      .map((t) => ({
        type: t.type,
        count: t.occurrences,
        acceptance: Math.round((t.accepted / t.occurrences) * 100),
      }))
      .sort((a, b) => b.acceptance - a.acceptance);
  }, []);

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          p: 3,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Acceptance rate — last {days} days
          </Typography>
          <MuiTooltip
            title="Acceptance rate is shown for context. High acceptance doesn't necessarily mean high quality — see override patterns below for the fuller picture."
            arrow
          >
            <Box sx={{ display: 'inline-flex', cursor: 'help' }}>
              <Info size={14} color={theme.palette.text.secondary} />
            </Box>
          </MuiTooltip>
        </Stack>
        <Typography variant="h2" sx={{ fontWeight: 600, color: theme.palette.primary.main, lineHeight: 1.1 }}>
          {overall.toFixed(0)}%
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Operators accepted {overall.toFixed(0)}% of system recommendations in the last {days} days.
        </Typography>
      </Box>

      <ChartCard
        title="Acceptance by confidence — does the system know what it knows?"
      >
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
          {byConfidence.map((c) => {
            const [lo, hi] = EXPECTED_RANGE[c.level];
            return (
              <Box
                key={c.level}
                sx={{
                  flex: 1,
                  minWidth: 220,
                  p: 2,
                  border: '1px solid',
                  borderColor: c.calibrated ? theme.palette.success.light : theme.palette.warning.light,
                  borderRadius: 1.5,
                  bgcolor: c.calibrated
                    ? `${theme.palette.success.main}10`
                    : `${theme.palette.warning.main}10`,
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {CONFIDENCE_LABEL[c.level]}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {c.pct.toFixed(0)}%
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Tag
                    variant={c.calibrated ? 'success' : 'warning'}
                    label={c.calibrated ? 'Calibrated' : 'Off range'}
                  />
                  <Typography variant="caption" color="text.secondary">
                    expected {lo}–{hi}%
                  </Typography>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </ChartCard>

      <ChartCard title="Acceptance over time" subtitle={`Daily acceptance rate, last ${days} days`}>
        <LineChart
          data={dailyAcceptance}
          xKey="date"
          series={[{ key: 'Acceptance', label: 'Acceptance %', color: theme.palette.primary.main }]}
          yDomain={[0, 100]}
          tooltipValueFormatter={(v) => `${v}%`}
          height={240}
        />
      </ChartCard>

      <ChartCard title="Acceptance by recommendation type">
        <BarChart
          data={byType.map((t) => ({ type: t.type, Acceptance: t.acceptance }))}
          xKey="type"
          yKey="Acceptance"
          layout="vertical"
          height={Math.max(220, byType.length * 36)}
          tooltipValueFormatter={(v) => `${v}%`}
        />
      </ChartCard>

      <ChartCard
        title="When operators chose differently — what did they choose?"
        subtitle="Most valuable section for tuning"
      >
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}
          >
            <thead>
              <Box component="tr" sx={{ textAlign: 'left' }}>
                {['Recommendation type', 'Suggested action', 'Most common actual action', 'Override count'].map(
                  (h) => (
                    <Box
                      key={h}
                      component="th"
                      sx={{
                        py: 1,
                        px: 1.5,
                        fontWeight: 600,
                        fontSize: 11,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {h}
                    </Box>
                  ),
                )}
              </Box>
            </thead>
            <tbody>
              {aiAcceptanceByType
                .slice()
                .sort((a, b) => b.overridden - a.overridden)
                .map((row) => {
                  const matches = row.suggestedAction === row.mostCommonActualAction;
                  return (
                    <Box
                      key={row.type}
                      component="tr"
                      sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                    >
                      <Box component="td" sx={{ py: 1.25, px: 1.5, fontWeight: 500 }}>
                        {row.type}
                      </Box>
                      <Box component="td" sx={{ py: 1.25, px: 1.5, color: 'text.secondary' }}>
                        {row.suggestedAction}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          py: 1.25,
                          px: 1.5,
                          color: matches ? theme.palette.text.secondary : theme.palette.warning.dark,
                          fontWeight: matches ? 400 : 500,
                        }}
                      >
                        {row.mostCommonActualAction}
                      </Box>
                      <Box component="td" sx={{ py: 1.25, px: 1.5, fontWeight: 600 }}>
                        {row.overridden}
                      </Box>
                    </Box>
                  );
                })}
            </tbody>
          </Box>
        </Box>
      </ChartCard>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <ChartCard title="Most accepted recommendations this month">
          <CompactList items={MOST_ACCEPTED} accent="success" />
        </ChartCard>
        <ChartCard title="Most overridden recommendations this month">
          <CompactList items={MOST_OVERRIDDEN} accent="warning" />
        </ChartCard>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          p: 2,
          bgcolor: theme.palette.action.hover,
          borderRadius: 1,
          alignItems: 'flex-start',
        }}
      >
        <StatTile
          label="Recommendations shown"
          value={slice.reduce((a, b) => a + b.shown, 0)}
          tone="neutral"
        />
        <StatTile
          label="Recommendations accepted"
          value={slice.reduce((a, b) => a + b.accepted, 0)}
          tone="success"
        />
      </Stack>
    </Stack>
  );
}

function CompactList({
  items,
  accent,
}: {
  items: TopAccepted[];
  accent: 'success' | 'warning';
}) {
  const theme = useTheme();
  const color = accent === 'success' ? theme.palette.success.dark : theme.palette.warning.dark;
  return (
    <Stack spacing={0.5}>
      {items.map((item, i) => (
        <Stack
          key={i}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ py: 0.75, px: 1, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {item.headline}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="baseline">
            <Typography variant="caption" sx={{ color, fontWeight: 600 }}>
              {Math.round(item.acceptanceRate * 100)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.occurrences}×
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
