import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowRight, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { Tag } from '@design-system';
import { StatTile } from '../../components/StatTile';
import { ChartCard } from '../../components/charts';
import { useDashboardTimeRange } from './useReportsTimeRange';
import {
  REPORT_PARTNERS,
  slaCompliancePartnerDaily,
} from '../../fixtures/timeseries';
import { timeRangeToDays } from '../../components/TimeRangeControl';

type HealthLabel = 'Healthy' | 'Watch' | 'At Risk' | 'Declining';

const HEALTH_TAG: Record<HealthLabel, 'success' | 'info' | 'warning' | 'error'> = {
  Healthy: 'success',
  Watch: 'info',
  'At Risk': 'warning',
  Declining: 'error',
};

const HEALTH_DOT: Record<HealthLabel, string> = {
  Healthy: '#16a34a',
  Watch: '#0ea5e9',
  'At Risk': '#d97706',
  Declining: '#dc2626',
};

interface PartnerCard {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  health: HealthLabel;
  trend: 'up' | 'flat' | 'down';
  changeNote: string;
  asnTimeliness: number;
  exceptionRate: number;
  responseTime: number;
}

function classifyHealth(score: number): HealthLabel {
  if (score >= 95) return 'Healthy';
  if (score >= 92) return 'Watch';
  if (score >= 88) return 'At Risk';
  return 'Declining';
}

const ASN_TARGET = 95;
const EXCEPTION_TARGET = 4;
const RESPONSE_TARGET = 30;

export default function PartnerHealth() {
  const theme = useTheme();
  const navigate = useNavigate();
  const range = useDashboardTimeRange('last7');
  const days = timeRangeToDays(range);

  const [tierFilter, setTierFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [sortBy, setSortBy] = useState<'health' | 'name' | 'tier'>('health');

  const partners: PartnerCard[] = useMemo(() => {
    return REPORT_PARTNERS.map((p, idx) => {
      const recent = slaCompliancePartnerDaily
        .filter((r) => r.partnerId === p.id && r.metric === 'asnTimeliness')
        .slice(-days);
      const earlier = slaCompliancePartnerDaily
        .filter((r) => r.partnerId === p.id && r.metric === 'asnTimeliness')
        .slice(-days * 2, -days);
      const recentAvg = recent.reduce((a, b) => a + b.value, 0) / Math.max(1, recent.length);
      const earlierAvg = earlier.reduce((a, b) => a + b.value, 0) / Math.max(1, earlier.length);
      const delta = recentAvg - earlierAvg;
      const trend: 'up' | 'flat' | 'down' = delta > 0.6 ? 'up' : delta < -0.6 ? 'down' : 'flat';
      const exceptionRate = Math.max(0.5, 7.5 - recentAvg * 0.06 + (idx % 3) * 0.5);
      const responseTime = 16 + (idx % 5) * 4;
      const health = classifyHealth(recentAvg + (trend === 'down' ? -1.8 : 0));
      const changeNote =
        trend === 'down'
          ? `ASN timeliness dropped ${Math.abs(delta).toFixed(1)}% week over week`
          : trend === 'up'
          ? `ASN timeliness improved ${delta.toFixed(1)}% week over week`
          : 'No material change this week';
      return {
        id: p.id,
        name: p.name,
        tier: p.tier,
        health,
        trend,
        changeNote,
        asnTimeliness: Number(recentAvg.toFixed(1)),
        exceptionRate: Number(exceptionRate.toFixed(1)),
        responseTime,
      };
    });
  }, [days]);

  const counts = useMemo(() => {
    const out: Record<HealthLabel, number> = { Healthy: 0, Watch: 0, 'At Risk': 0, Declining: 0 };
    for (const p of partners) out[p.health]++;
    return out;
  }, [partners]);

  const trendingDown = partners.filter((p) => p.trend === 'down');
  const trendingUp = partners.filter((p) => p.trend === 'up');

  const filtered = useMemo(() => {
    let rows = partners.slice();
    if (tierFilter !== 'all') rows = rows.filter((p) => String(p.tier) === tierFilter);
    if (sortBy === 'name') rows.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'tier') rows.sort((a, b) => a.tier - b.tier);
    else {
      const order: Record<HealthLabel, number> = { Declining: 0, 'At Risk': 1, Watch: 2, Healthy: 3 };
      rows.sort((a, b) => order[a.health] - order[b.health]);
    }
    return rows;
  }, [partners, tierFilter, sortBy]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
        <StatTile label="Healthy" value={counts.Healthy} tone="success" trend={`${days}-day window`} />
        <StatTile label="Watch" value={counts.Watch} tone="neutral" />
        <StatTile label="At Risk" value={counts['At Risk']} tone="warn" />
        <StatTile label="Declining" value={counts.Declining} tone="critical" />
      </Stack>

      <ChartCard
        title="Partners trending down this week"
        action={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Sparkles size={14} color={theme.palette.primary.main} />
            <Typography variant="caption" color="text.secondary">
              Pattern detected
            </Typography>
          </Stack>
        }
      >
        {trendingDown.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No partners declining this week.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {trendingDown.map((p) => (
              <PartnerRow
                key={p.id}
                partner={p}
                onClick={() => navigate(`/supplychainoverhaul/partners/${p.id}`)}
                detailed
              />
            ))}
          </Stack>
        )}
      </ChartCard>

      <ChartCard title="Partners trending up this week">
        {trendingUp.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No partners improving this week.
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {trendingUp.map((p) => (
              <Stack
                key={p.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  py: 0.75,
                  px: 1.25,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: theme.palette.action.hover },
                }}
                onClick={() => navigate(`/supplychainoverhaul/partners/${p.id}`)}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: HEALTH_DOT[p.health] }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {p.name}
                  </Typography>
                  <TrendingUp size={14} color={theme.palette.success.main} />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {p.asnTimeliness.toFixed(1)}% ASN
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </ChartCard>

      <ChartCard
        title="All partners"
        action={
          <Stack direction="row" spacing={1}>
            <Select
              size="small"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as typeof tierFilter)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All tiers</MenuItem>
              <MenuItem value="1">Tier 1</MenuItem>
              <MenuItem value="2">Tier 2</MenuItem>
              <MenuItem value="3">Tier 3</MenuItem>
            </Select>
            <Select
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="health">Sort: health</MenuItem>
              <MenuItem value="name">Sort: name</MenuItem>
              <MenuItem value="tier">Sort: tier</MenuItem>
            </Select>
          </Stack>
        }
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {filtered.map((p) => (
            <Box
              key={p.id}
              onClick={() => navigate(`/supplychainoverhaul/partners/${p.id}`)}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                cursor: 'pointer',
                '&:hover': { borderColor: theme.palette.primary.main },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {p.name}
                    </Typography>
                    <Chip label={`Tier ${p.tier}`} />
                  </Stack>
                </Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box
                    sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: HEALTH_DOT[p.health] }}
                  />
                  <Tag variant={HEALTH_TAG[p.health]} label={p.health} />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
                {p.trend === 'up' && <TrendingUp size={14} color={theme.palette.success.main} />}
                {p.trend === 'down' && <TrendingDown size={14} color={theme.palette.error.main} />}
                <Typography variant="caption" color="text.secondary">
                  {p.changeNote}
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <SubBar label="ASN timeliness" current={p.asnTimeliness} target={ASN_TARGET} max={100} />
                <SubBar
                  label="Exception rate"
                  current={p.exceptionRate}
                  target={EXCEPTION_TARGET}
                  max={12}
                  inverse
                />
                <SubBar
                  label="Response time"
                  current={p.responseTime}
                  target={RESPONSE_TARGET}
                  max={60}
                  inverse
                />
              </Stack>

              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={0.5}
                sx={{ mt: 1.5, color: theme.palette.primary.main }}
              >
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  View partner
                </Typography>
                <ArrowRight size={14} />
              </Stack>
            </Box>
          ))}
        </Box>
      </ChartCard>
    </Stack>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        px: 0.75,
        py: 0.125,
        borderRadius: 0.5,
        bgcolor: 'action.hover',
        fontSize: 10,
        fontWeight: 600,
        color: 'text.secondary',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </Box>
  );
}

function PartnerRow({
  partner,
  onClick,
  detailed,
}: {
  partner: PartnerCard;
  onClick: () => void;
  detailed?: boolean;
}) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        py: 1.25,
        px: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': { borderColor: theme.palette.primary.main },
      }}
      onClick={onClick}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: HEALTH_DOT[partner.health] }}
        />
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {partner.name}
            </Typography>
            <Tag variant={HEALTH_TAG[partner.health]} label={partner.health} />
          </Stack>
          {detailed && (
            <Typography variant="caption" color="text.secondary">
              {partner.changeNote}
            </Typography>
          )}
        </Box>
      </Stack>
      <ArrowRight size={16} color={theme.palette.text.secondary} />
    </Stack>
  );
}

function SubBar({
  label,
  current,
  target,
  max,
  inverse,
}: {
  label: string;
  current: number;
  target: number;
  max: number;
  inverse?: boolean;
}) {
  const theme = useTheme();
  const meeting = inverse ? current <= target : current >= target;
  const fillPct = Math.min(100, (current / max) * 100);
  const targetPct = Math.min(100, (target / max) * 100);
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.25 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: meeting ? theme.palette.success.dark : theme.palette.warning.dark,
            fontWeight: 500,
          }}
        >
          {current}
          {label === 'ASN timeliness' ? '%' : label === 'Response time' ? 'm' : '%'}
        </Typography>
      </Stack>
      <Box sx={{ position: 'relative', height: 6, bgcolor: theme.palette.action.hover, borderRadius: 3 }}>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${fillPct}%`,
            bgcolor: meeting ? theme.palette.success.main : theme.palette.warning.main,
            borderRadius: 3,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: `${targetPct}%`,
            top: -2,
            bottom: -2,
            width: 2,
            bgcolor: theme.palette.text.primary,
            opacity: 0.5,
          }}
        />
      </Box>
    </Box>
  );
}
