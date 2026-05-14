import { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StatTile } from '../../components/StatTile';
import { BarChart, ChartCard, LineChart } from '../../components/charts';
import { useDashboardTimeRange } from './useReportsTimeRange';
import {
  REPORT_PARTNERS,
  TODAY,
  exceptionVolumeDaily,
  exceptionVolumeHourlyToday,
  exceptionsByPartnerDaily,
  exceptionsByErrorTypeDaily,
  errorTypeTotalsForDay,
  mttrBySeverityDaily,
  partnerAvgOverDays,
  partnerTotalsForDay,
  SEVERITIES,
} from '../../fixtures/timeseries';

function formatDay(iso: string) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export default function OperationsToday() {
  const theme = useTheme();
  useDashboardTimeRange('today', true);

  const todayPoint = exceptionVolumeDaily[exceptionVolumeDaily.length - 1];
  const last7 = exceptionVolumeDaily.slice(-8, -1);
  const trailing7Avg = last7.reduce((a, b) => a + b.value, 0) / Math.max(1, last7.length);
  const todayDelta = todayPoint.value - trailing7Avg;
  const todayPct = trailing7Avg ? (todayDelta / trailing7Avg) * 100 : 0;

  const lineData = useMemo(
    () =>
      [...last7, todayPoint].map((p) => ({
        date: formatDay(p.date),
        Exceptions: p.value,
        rawDate: p.date,
      })),
    [last7, todayPoint],
  );

  const hourlyData = useMemo(
    () =>
      exceptionVolumeHourlyToday.map((p) => ({
        hour: `${p.hour.toString().padStart(2, '0')}h`,
        rawHour: p.hour,
        Exceptions: p.value,
      })),
    [],
  );

  const partnerTotals = useMemo(() => {
    const todayTotals = partnerTotalsForDay(TODAY);
    return REPORT_PARTNERS.map((p) => {
      const todayCount = todayTotals.get(p.id) ?? 0;
      const avg = partnerAvgOverDays(p.id, 7);
      return {
        id: p.id,
        name: p.name,
        today: todayCount,
        avg,
        delta: todayCount - avg,
      };
    })
      .sort((a, b) => b.today - a.today)
      .slice(0, 5);
  }, []);

  const errorTypeTotals = useMemo(() => {
    const totals = errorTypeTotalsForDay(TODAY);
    return Array.from(totals.entries())
      .map(([errorType, value]) => {
        // 7-day avg
        const subset = exceptionsByErrorTypeDaily
          .filter((r) => r.errorType === errorType)
          .slice(-8, -1);
        const avg = subset.reduce((a, b) => a + b.value, 0) / Math.max(1, subset.length);
        return { errorType, today: value, avg, delta: value - avg };
      })
      .sort((a, b) => b.today - a.today)
      .slice(0, 5);
  }, []);

  const todayMttr = useMemo(() => {
    return SEVERITIES.map((sev) => {
      const subset = mttrBySeverityDaily.filter((r) => r.severity === sev);
      const today = subset[subset.length - 1].mttrMinutes;
      const trailing = subset.slice(-8, -1);
      const avg = Math.round(
        trailing.reduce((a, b) => a + b.mttrMinutes, 0) / Math.max(1, trailing.length),
      );
      return { severity: sev, today, avg };
    });
  }, []);

  const openExceptions = todayPoint.value;
  const breachRisk = Math.round(openExceptions * 0.18);
  const otif = 96.4;
  const resolvedToday = Math.round(openExceptions * 0.55);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
        <StatTile
          label="Open exceptions"
          value={openExceptions}
          trend={`${todayPct >= 0 ? '+' : ''}${todayPct.toFixed(0)}% vs 7d avg`}
          tone={todayPct > 15 ? 'critical' : 'neutral'}
        />
        <StatTile label="Breach risk" value={breachRisk} trend="next 30 minutes" tone="critical" />
        <StatTile label="OTIF today" value={`${otif}%`} trend="target 98%" tone="warn" />
        <StatTile
          label="Resolved today"
          value={resolvedToday}
          trend="median 18m to resolve"
          tone="success"
        />
      </Stack>

      <ChartCard
        title="Exception volume — today vs trailing 7-day avg"
        subtitle={
          Math.abs(todayPct) > 15
            ? `${todayPct > 0 ? '+' : ''}${todayPct.toFixed(0)}% ${
                todayPct > 0 ? 'above' : 'below'
              } 7d avg`
            : `Within ±15% of 7d avg (${trailing7Avg.toFixed(0)})`
        }
      >
        <LineChart
          data={lineData}
          xKey="date"
          series={[{ key: 'Exceptions', label: 'Exceptions', color: theme.palette.primary.main }]}
          highlightX={formatDay(todayPoint.date)}
          referenceY={{ value: Math.round(trailing7Avg), label: '7d avg' }}
          height={220}
        />
      </ChartCard>

      <ChartCard title="Exception volume by hour — today" subtitle="Business hours emphasized">
        <BarChart
          data={hourlyData}
          xKey="hour"
          yKey="Exceptions"
          height={200}
          emphasizeRange={{ from: 8, to: 18 }}
          xTickFormatter={(v) => String(v)}
        />
      </ChartCard>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
        }}
      >
        <ChartCard title="Top 5 partners by exception count today">
          <Stack spacing={1}>
            {partnerTotals.map((p) => (
              <RankRow
                key={p.id}
                label={p.name}
                value={p.today}
                deltaLabel={`${p.delta >= 0 ? '+' : ''}${p.delta.toFixed(0)} vs avg`}
                deltaPositive={p.delta > 0}
                max={partnerTotals[0]?.today ?? 1}
              />
            ))}
          </Stack>
        </ChartCard>

        <ChartCard title="Top 5 error types today">
          <Stack spacing={1}>
            {errorTypeTotals.map((e) => (
              <RankRow
                key={e.errorType}
                label={e.errorType}
                value={e.today}
                deltaLabel={`${e.delta >= 0 ? '+' : ''}${e.delta.toFixed(0)} vs avg`}
                deltaPositive={e.delta > 0}
                max={errorTypeTotals[0]?.today ?? 1}
              />
            ))}
          </Stack>
        </ChartCard>
      </Box>

      <ChartCard title="Resolution velocity today" subtitle="Mean time to resolve, by severity">
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
          {todayMttr.map((m) => (
            <StatTile
              key={m.severity}
              label={m.severity}
              value={`${m.today}m`}
              trend={`vs ${m.avg}m avg`}
              tone={m.today < m.avg ? 'success' : m.today > m.avg * 1.15 ? 'warn' : 'neutral'}
            />
          ))}
        </Stack>
      </ChartCard>
    </Stack>
  );
}

function RankRow({
  label,
  value,
  deltaLabel,
  deltaPositive,
  max,
}: {
  label: string;
  value: number;
  deltaLabel: string;
  deltaPositive: boolean;
  max: number;
}) {
  const theme = useTheme();
  const pct = max ? (value / max) * 100 : 0;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="baseline">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: deltaPositive ? theme.palette.warning.dark : theme.palette.success.dark }}
          >
            {deltaLabel}
          </Typography>
        </Stack>
      </Stack>
      <Box
        sx={{
          height: 6,
          bgcolor: theme.palette.action.hover,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            width: `${pct}%`,
            height: '100%',
            bgcolor: theme.palette.primary.main,
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
    </Box>
  );
}
