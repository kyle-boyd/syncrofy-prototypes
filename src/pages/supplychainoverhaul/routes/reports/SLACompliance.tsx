import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Tag } from '@design-system';
import { ChartCard, LineChart, Sparkline } from '../../components/charts';
import { useDashboardTimeRange } from './useReportsTimeRange';
import {
  REPORT_PARTNERS,
  SLA_METRICS,
  slaCompliancePartnerDaily,
  type SLAMetric,
} from '../../fixtures/timeseries';
import { timeRangeToDays } from '../../components/TimeRangeControl';

const SLA_THRESHOLD: Record<SLAMetric, number> = {
  asnTimeliness: 95,
  ackTimeliness: 95,
  invoiceMatch: 97,
};

const METRIC_LABEL: Record<SLAMetric, string> = {
  asnTimeliness: 'ASN timeliness',
  ackTimeliness: 'Ack timeliness',
  invoiceMatch: 'Invoice match',
};

type SortKey = 'name' | SLAMetric | 'penalty' | 'status';

export default function SLACompliance() {
  const theme = useTheme();
  const navigate = useNavigate();
  const range = useDashboardTimeRange('thisMonth');
  const days = timeRangeToDays(range);
  const [sortBy, setSortBy] = useState<SortKey>('penalty');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const partnerRows = useMemo(() => {
    return REPORT_PARTNERS.map((p) => {
      const metricValues: Record<SLAMetric, number[]> = {
        asnTimeliness: [],
        ackTimeliness: [],
        invoiceMatch: [],
      };
      for (const row of slaCompliancePartnerDaily) {
        if (row.partnerId !== p.id) continue;
        metricValues[row.metric].push(row.value);
      }
      const recent = (m: SLAMetric) => {
        const arr = metricValues[m].slice(-days);
        if (!arr.length) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
      };
      const asn = recent('asnTimeliness');
      const ack = recent('ackTimeliness');
      const inv = recent('invoiceMatch');
      const worstGap = Math.max(
        SLA_THRESHOLD.asnTimeliness - asn,
        SLA_THRESHOLD.ackTimeliness - ack,
        SLA_THRESHOLD.invoiceMatch - inv,
      );
      const status: 'On track' | 'At risk' | 'Below' =
        worstGap > 1.5 ? 'Below' : worstGap > 0 ? 'At risk' : 'On track';
      const penalty = Math.max(0, Math.round(worstGap * 1850 + (status === 'Below' ? 4200 : 0)));
      const trend = metricValues.asnTimeliness.slice(-days);
      return {
        id: p.id,
        name: p.name,
        tier: p.tier,
        asnTimeliness: asn,
        ackTimeliness: ack,
        invoiceMatch: inv,
        status,
        penalty,
        trend,
      };
    });
  }, [days]);

  const sortedRows = useMemo(() => {
    const rows = [...partnerRows];
    rows.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      switch (sortBy) {
        case 'name':
          av = a.name;
          bv = b.name;
          break;
        case 'penalty':
          av = a.penalty;
          bv = b.penalty;
          break;
        case 'status':
          av = a.status;
          bv = b.status;
          break;
        default:
          av = a[sortBy];
          bv = b[sortBy];
      }
      const dir = sortDir === 'asc' ? 1 : -1;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return rows;
  }, [partnerRows, sortBy, sortDir]);

  const overallCompliance = useMemo(() => {
    const allValues = sortedRows.flatMap((r) => [r.asnTimeliness, r.ackTimeliness, r.invoiceMatch]);
    return allValues.reduce((a, b) => a + b, 0) / Math.max(1, allValues.length);
  }, [sortedRows]);

  const lastMonthCompliance = overallCompliance - 0.4;
  const trendDelta = overallCompliance - lastMonthCompliance;

  // ASN Timeliness deep-dive: 30-day overall trend
  const asnDeepDive = useMemo(() => {
    const byDate = new Map<string, number[]>();
    for (const row of slaCompliancePartnerDaily) {
      if (row.metric !== 'asnTimeliness') continue;
      if (!byDate.has(row.date)) byDate.set(row.date, []);
      byDate.get(row.date)!.push(row.value);
    }
    return Array.from(byDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, vals]) => ({
        date: date.slice(5),
        ASN: Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)),
      }));
  }, []);

  const asnLatePartners = useMemo(() => {
    return REPORT_PARTNERS.map((p) => {
      const lateEvents = slaCompliancePartnerDaily
        .filter((r) => r.partnerId === p.id && r.metric === 'asnTimeliness')
        .slice(-days)
        .filter((r) => r.value < SLA_THRESHOLD.asnTimeliness).length;
      return { id: p.id, name: p.name, lateEvents };
    })
      .sort((a, b) => b.lateEvents - a.lateEvents)
      .slice(0, 5);
  }, [days]);

  const tier12 = sortedRows.filter((r) => r.tier <= 2);
  const atRisk = sortedRows.filter((r) => {
    const minPct = Math.min(r.asnTimeliness, r.ackTimeliness, r.invoiceMatch);
    const minThreshold = Math.min(...Object.values(SLA_THRESHOLD));
    const gap = minPct - minThreshold;
    return gap >= -0 && gap <= 2;
  });

  const onSort = (key: SortKey) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(key);
      setSortDir('desc');
    }
  };

  return (
    <Stack spacing={3}>
      {/* Headline */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          p: 3,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Overall SLA Compliance — this month
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
          <Typography variant="h2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {overallCompliance.toFixed(1)}%
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {trendDelta >= 0 ? (
              <ArrowUp size={16} color={theme.palette.success.main} />
            ) : (
              <ArrowDown size={16} color={theme.palette.error.main} />
            )}
            <Typography variant="body2" color="text.secondary">
              {trendDelta >= 0 ? '+' : ''}
              {trendDelta.toFixed(1)}% vs last month
            </Typography>
          </Stack>
          <Tag
            variant={overallCompliance >= 96 ? 'success' : overallCompliance >= 94 ? 'warning' : 'error'}
            label={overallCompliance >= 96 ? 'On track' : overallCompliance >= 94 ? 'At risk' : 'Below'}
          />
        </Stack>
      </Box>

      {/* Per-partner SLA table */}
      <ChartCard title="Per-partner SLA">
        <Box sx={{ overflowX: 'auto' }}>
          <Box
            component="table"
            sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}
          >
            <thead>
              <tr>
                <Th onClick={() => onSort('name')} active={sortBy === 'name'} dir={sortDir}>
                  Partner
                </Th>
                {SLA_METRICS.map((m) => (
                  <Th
                    key={m}
                    onClick={() => onSort(m)}
                    active={sortBy === m}
                    dir={sortDir}
                    align="right"
                  >
                    {METRIC_LABEL[m]}
                  </Th>
                ))}
                <Th onClick={() => onSort('status')} active={sortBy === 'status'} dir={sortDir}>
                  Status
                </Th>
                <Th onClick={() => onSort('penalty')} active={sortBy === 'penalty'} dir={sortDir} align="right">
                  Penalty exposure
                </Th>
                <Th>Trend</Th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <Box
                  key={row.id}
                  component="tr"
                  sx={{ borderTop: '1px solid', borderColor: 'divider', cursor: 'pointer' }}
                  onClick={() => navigate(`/supplychainoverhaul/partners/${row.id}`)}
                >
                  <Td>{row.name}</Td>
                  {SLA_METRICS.map((m) => {
                    const v = row[m];
                    const threshold = SLA_THRESHOLD[m];
                    const gap = v - threshold;
                    const color =
                      gap >= 0
                        ? theme.palette.success.dark
                        : gap >= -1
                        ? theme.palette.warning.dark
                        : theme.palette.error.dark;
                    return (
                      <Td key={m} align="right">
                        <Box sx={{ color, fontWeight: 500 }}>{v.toFixed(1)}%</Box>
                        <Typography variant="caption" color="text.secondary">
                          target {threshold}%
                        </Typography>
                      </Td>
                    );
                  })}
                  <Td>
                    <Tag
                      variant={
                        row.status === 'On track'
                          ? 'success'
                          : row.status === 'At risk'
                          ? 'warning'
                          : 'error'
                      }
                      label={row.status}
                    />
                  </Td>
                  <Td align="right">${row.penalty.toLocaleString()}</Td>
                  <Td>
                    <Sparkline
                      data={row.trend}
                      width={80}
                      height={24}
                      color={
                        row.trend[row.trend.length - 1] >= row.trend[0]
                          ? theme.palette.success.main
                          : theme.palette.error.main
                      }
                    />
                  </Td>
                </Box>
              ))}
            </tbody>
          </Box>
        </Box>
      </ChartCard>

      {/* ASN deep-dive */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 2,
        }}
      >
        <ChartCard
          title="ASN Timeliness — the metric most often penalized"
          subtitle="Overall, last 30 days"
        >
          <LineChart
            data={asnDeepDive}
            xKey="date"
            series={[{ key: 'ASN', label: 'ASN timeliness' }]}
            yDomain={[88, 100]}
            referenceY={{ value: SLA_THRESHOLD.asnTimeliness, label: 'threshold' }}
            tooltipValueFormatter={(v) => `${v.toFixed(1)}%`}
            height={240}
          />
        </ChartCard>
        <ChartCard title="Top 5 partners contributing to ASN late events">
          <Stack spacing={1}>
            {asnLatePartners.map((p) => (
              <Stack
                key={p.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 0.5 }}
              >
                <Typography variant="body2">{p.name}</Typography>
                <Chip label={`${p.lateEvents} late`} size="small" />
              </Stack>
            ))}
            {!asnLatePartners.length && (
              <Typography variant="caption" color="text.secondary">
                No partners have ASN late events.
              </Typography>
            )}
          </Stack>
        </ChartCard>
      </Box>

      {/* Sparkline grid: top-tier partners */}
      <ChartCard title="30-day SLA trend, top-tier partners">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {tier12.map((row) => (
            <Box
              key={row.id}
              sx={{
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { borderColor: theme.palette.primary.main },
              }}
              onClick={() => navigate(`/supplychainoverhaul/partners/${row.id}`)}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {row.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  T{row.tier}
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                {row.asnTimeliness.toFixed(1)}%
              </Typography>
              <Sparkline
                data={row.trend}
                height={28}
                color={
                  row.trend[row.trend.length - 1] >= row.trend[0]
                    ? theme.palette.success.main
                    : theme.palette.error.main
                }
              />
            </Box>
          ))}
        </Box>
      </ChartCard>

      {/* At risk callout */}
      <ChartCard title="Partners within 2% of SLA threshold">
        {atRisk.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No partners currently at risk.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {atRisk.map((row) => {
              const minMetric = SLA_METRICS.reduce(
                (lo, m) => (row[m] < row[lo] ? m : lo),
                SLA_METRICS[0],
              );
              const v = row[minMetric];
              const threshold = SLA_THRESHOLD[minMetric];
              return (
                <Stack
                  key={row.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    py: 1,
                    px: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { borderColor: theme.palette.primary.main },
                  }}
                  onClick={() => navigate(`/supplychainoverhaul/partners/${row.id}`)}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {METRIC_LABEL[minMetric]} · {v.toFixed(1)}% (gap {(v - threshold).toFixed(1)}%)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color={theme.palette.primary.main}>
                    View partner →
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        )}
      </ChartCard>
    </Stack>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  align,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  dir?: 'asc' | 'desc';
  align?: 'left' | 'right';
}) {
  return (
    <Box
      component="th"
      onClick={onClick}
      sx={{
        textAlign: align ?? 'left',
        py: 1,
        px: 1.5,
        fontWeight: 600,
        fontSize: 11,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {children}
      {active && <span style={{ marginLeft: 4 }}>{dir === 'asc' ? '↑' : '↓'}</span>}
    </Box>
  );
}

function Td({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <Box
      component="td"
      sx={{ textAlign: align ?? 'left', py: 1.25, px: 1.5, verticalAlign: 'middle' }}
    >
      {children}
    </Box>
  );
}
