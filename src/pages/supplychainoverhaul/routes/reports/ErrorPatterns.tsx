import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ChartCard, Heatmap, LineChart, Sparkline } from '../../components/charts';
import { useDashboardTimeRange } from './useReportsTimeRange';
import {
  REPORT_PARTNERS,
  TOP_ERROR_TYPES,
  errorTypeSlope,
  errorTypeTotalsOverRange,
  exceptionsByErrorTypeDaily,
  exceptionsByPartnerDaily,
} from '../../fixtures/timeseries';
import { timeRangeToDays } from '../../components/TimeRangeControl';

interface PatternRow {
  id: string;
  statement: string;
  occurrences: number;
  suggestedAction: string;
}

const UNACTED_PATTERNS: PatternRow[] = [
  {
    id: 'pat-walmart-dc217',
    statement: 'ASN late events from Walmart DC-217 spiked over the last 14 days',
    occurrences: 9,
    suggestedAction: 'Add routing rule for DC-217 to senior queue',
  },
  {
    id: 'pat-cvs-pricevar',
    statement: 'CVS invoices repeatedly fail price-variance check at 2.4% delta',
    occurrences: 14,
    suggestedAction: 'Raise price variance threshold to 3% for CVS',
  },
  {
    id: 'pat-costco-sscc',
    statement: 'Costco SSCC label failures cluster around East Coast DCs',
    occurrences: 6,
    suggestedAction: 'Open ticket with Costco label printer firmware team',
  },
  {
    id: 'pat-dup-target',
    statement: 'Duplicate transactions from Target double-fire on map redeploys',
    occurrences: 4,
    suggestedAction: 'Suppress duplicates within 30s of map deploy',
  },
];

const RESOLVED_PATTERNS: { statement: string; action: string; impact: string }[] = [
  {
    statement: 'Home Depot pack-structure mismatches',
    action: 'Mapping override deployed 3d ago',
    impact: 'Dropped from 8/wk to 0/wk',
  },
  {
    statement: 'Kroger missing acknowledgments',
    action: 'Auto-retry rule deployed 7d ago',
    impact: 'Dropped from 12/wk to 3/wk',
  },
  {
    statement: 'McKesson catalog item unknown',
    action: 'Suggested mapping accepted 11d ago',
    impact: 'Dropped from 6/wk to 1/wk',
  },
];

export default function ErrorPatterns() {
  const theme = useTheme();
  const navigate = useNavigate();
  const range = useDashboardTimeRange('last30');
  const days = timeRangeToDays(range);

  // Top 15 error types over range (we have 10 — show all)
  const topErrors = useMemo(() => {
    const totals = errorTypeTotalsOverRange(days);
    return Array.from(totals.entries())
      .map(([errorType, count]) => {
        const trend = exceptionsByErrorTypeDaily
          .filter((r) => r.errorType === errorType)
          .slice(-days)
          .map((p) => p.value);
        return { errorType, count, trend };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [days]);

  const maxCount = topErrors[0]?.count ?? 1;

  // Heatmap: top 10 error types × 9 partners
  const heatmapCells = useMemo(() => {
    // Approximate: each (errorType × partner) cell = some fraction of partner exceptions weighted by error rank.
    // We don't have a direct fixture, so compute deterministically from existing data.
    const partnerTotals = new Map<string, number>();
    for (const row of exceptionsByPartnerDaily.slice(-days * REPORT_PARTNERS.length)) {
      partnerTotals.set(row.partnerId, (partnerTotals.get(row.partnerId) ?? 0) + row.value);
    }
    // Recompute properly:
    partnerTotals.clear();
    for (const p of REPORT_PARTNERS) {
      const total = exceptionsByPartnerDaily
        .filter((r) => r.partnerId === p.id)
        .slice(-days)
        .reduce((a, b) => a + b.value, 0);
      partnerTotals.set(p.id, total);
    }

    const cells = [] as { rowKey: string; colKey: string; value: number }[];
    TOP_ERROR_TYPES.forEach((errorType, etIdx) => {
      const errorTotal = exceptionsByErrorTypeDaily
        .filter((r) => r.errorType === errorType)
        .slice(-days)
        .reduce((a, b) => a + b.value, 0);
      REPORT_PARTNERS.forEach((p, pIdx) => {
        const partnerWeight = (partnerTotals.get(p.id) ?? 0) /
          Math.max(1, Array.from(partnerTotals.values()).reduce((a, b) => a + b, 0));
        // Skew distribution per error type so different errors hit different partners
        const skew = ((etIdx * 7 + pIdx * 11) % 13) / 13 + 0.4;
        const value = Math.round(errorTotal * partnerWeight * skew);
        if (value > 0) cells.push({ rowKey: errorType, colKey: p.id, value });
      });
    });
    return cells;
  }, [days]);

  // Error trends — top 5 with positive slope
  const growingErrors = useMemo(() => {
    return TOP_ERROR_TYPES.map((et) => ({ et, slope: errorTypeSlope(et, days) }))
      .filter((x) => x.slope > 0)
      .sort((a, b) => b.slope - a.slope)
      .slice(0, 5)
      .map((x) => x.et);
  }, [days]);

  const trendData = useMemo(() => {
    const dates = Array.from(
      new Set(exceptionsByErrorTypeDaily.slice(-days * TOP_ERROR_TYPES.length).map((r) => r.date)),
    ).sort();
    return dates.map((date) => {
      const point: Record<string, string | number> = { date: date.slice(5) };
      for (const et of growingErrors) {
        const match = exceptionsByErrorTypeDaily.find((r) => r.date === date && r.errorType === et);
        point[et] = match ? match.value : 0;
      }
      return point;
    });
  }, [days, growingErrors]);

  return (
    <Stack spacing={3}>
      <ChartCard title="Top error types" subtitle={`Last ${days} days`}>
        <Stack spacing={1}>
          {topErrors.map((row) => (
            <Stack
              key={row.errorType}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ py: 0.75 }}
            >
              <Box sx={{ width: 200, flexShrink: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {row.errorType}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, position: 'relative' }}>
                <Box
                  sx={{
                    height: 14,
                    width: `${(row.count / maxCount) * 100}%`,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: 0.75,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
              <Box sx={{ width: 60, textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {row.count}
                </Typography>
              </Box>
              <Box sx={{ width: 80, flexShrink: 0 }}>
                <Sparkline data={row.trend} width={80} height={24} />
              </Box>
            </Stack>
          ))}
        </Stack>
      </ChartCard>

      <ChartCard
        title="Where errors happen"
        subtitle="Click any cell to filter the inbox by that error type and partner"
      >
        <Heatmap
          rows={TOP_ERROR_TYPES.map((et) => ({ key: et, label: et }))}
          cols={REPORT_PARTNERS.map((p) => ({ key: p.id, label: p.name }))}
          cells={heatmapCells}
          onCellClick={(cell) => {
            navigate(
              `/supplychainoverhaul/inbox?errorType=${encodeURIComponent(
                cell.rowKey,
              )}&partner=${encodeURIComponent(cell.colKey)}`,
            );
          }}
          cellLabelFormatter={(cell) => {
            const partner = REPORT_PARTNERS.find((p) => p.id === cell.colKey);
            return `${cell.rowKey} · ${partner?.name ?? cell.colKey}: ${cell.value}`;
          }}
        />
      </ChartCard>

      <ChartCard title="Error types growing over time" subtitle={`Last ${days} days`}>
        {growingErrors.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No error types are trending up.
          </Typography>
        ) : (
          <LineChart
            data={trendData}
            xKey="date"
            series={growingErrors.map((et) => ({ key: et, label: et }))}
            height={260}
          />
        )}
      </ChartCard>

      <ChartCard title="Patterns suggested by the system">
        {UNACTED_PATTERNS.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No new patterns detected.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {UNACTED_PATTERNS.map((pat) => (
              <Stack
                key={pat.id}
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {pat.statement}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pat.occurrences} occurrences · suggested: {pat.suggestedAction}
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" color="primary">
                  Review
                </Button>
              </Stack>
            ))}
          </Stack>
        )}
      </ChartCard>

      <ChartCard title="Patterns recently resolved">
        {RESOLVED_PATTERNS.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No patterns recently resolved.
          </Typography>
        ) : (
          <Stack spacing={0.75}>
            {RESOLVED_PATTERNS.map((p, i) => (
              <Stack
                key={i}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 0.75, px: 1, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {p.statement}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.action}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: theme.palette.success.dark }}>
                  {p.impact}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </ChartCard>
    </Stack>
  );
}
