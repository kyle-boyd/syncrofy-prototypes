import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  Pencil,
  Plus,
  PhoneCall,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RcTooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { DocumentInspector } from '../components/DocumentInspector';
import { LifecycleStrip } from '../components/LifecycleStrip';
import { RecommendationCard } from '../ai/RecommendationCard';
import {
  partnersById,
  type Partner,
  type PartnerHealthLabel,
  type PartnerHealthTrend,
} from '../fixtures/partners';
import { exceptions } from '../fixtures/exceptions';
import { transactions } from '../fixtures/transactions';
import { documents } from '../fixtures/documents';
import { formatTimestamp } from '../lib/time';

const NOW = new Date('2026-05-06T13:30:00Z');

const HEALTH_TONE: Record<PartnerHealthLabel, { dot: string; fg: string; banner: string }> = {
  Healthy:    { dot: '#16a34a', fg: 'success.dark', banner: '#16a34a' },
  Watch:      { dot: '#f59e0b', fg: 'warning.dark', banner: '#f59e0b' },
  'At Risk':  { dot: '#f97316', fg: 'warning.dark', banner: '#f97316' },
  Declining:  { dot: '#dc2626', fg: 'error.dark',   banner: '#dc2626' },
};

function HealthDot({ label }: { label: PartnerHealthLabel }) {
  const tone = HEALTH_TONE[label];
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: tone.dot }} />
      <Typography variant="subtitle1" sx={{ color: tone.fg, fontWeight: 600 }}>
        {label}
      </Typography>
    </Stack>
  );
}

function TrendArrow({ trend }: { trend: PartnerHealthTrend }) {
  if (trend === 'up') return <ArrowUp size={16} color="#16a34a" />;
  if (trend === 'down') return <ArrowDown size={16} color="#dc2626" />;
  return <ArrowRight size={16} color="#6b7280" />;
}

function TierPill({ tier }: { tier: number }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        height: 22,
        borderRadius: 1,
        bgcolor: 'grey.100',
        color: 'text.secondary',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      Tier {tier}
    </Box>
  );
}

function SectionHeader({
  title,
  count,
  action,
}: {
  title: string;
  count?: number;
  action?: React.ReactNode;
}) {
  return (
    <Stack
      direction="row"
      alignItems="baseline"
      justifyContent="space-between"
      sx={{ mb: 1.25 }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
        {count !== undefined && (
          <Typography component="span" variant="h6" color="text.secondary" sx={{ fontWeight: 400, ml: 0.75 }}>
            ({count})
          </Typography>
        )}
      </Typography>
      {action}
    </Stack>
  );
}

function Section({ children, sx }: { children: React.ReactNode; sx?: object }) {
  return <Box sx={{ mb: 4, ...sx }}>{children}</Box>;
}

function buildAsnSeries(partner: Partner) {
  const target = partner.currentSLA.asnTimelinessPercent;
  const data: { day: number; value: number }[] = [];
  // Deterministic pseudo-random series ending at current value.
  let seed = partner.id.charCodeAt(0) + partner.id.length * 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const trendDelta = partner.healthTrend === 'down' ? 0.18 : partner.healthTrend === 'up' ? -0.12 : 0;
  let v = target + (partner.healthTrend === 'down' ? 3 : partner.healthTrend === 'up' ? -2 : rand() * 2 - 1);
  for (let i = 0; i < 30; i += 1) {
    v = v - trendDelta + (rand() - 0.5) * 1.4;
    if (i === 29) v = target;
    data.push({ day: i + 1, value: Math.max(80, Math.min(100, v)) });
  }
  return data;
}

function buildExceptionVolume(partnerId: string) {
  const data: { day: number; value: number; isToday: boolean }[] = [];
  let seed = partnerId.charCodeAt(0) + partnerId.length * 11;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < 30; i += 1) {
    const base = Math.floor(rand() * 4);
    const spike = i === 24 || i === 27 ? Math.floor(rand() * 3) : 0;
    data.push({ day: i + 1, value: base + spike, isToday: i === 29 });
  }
  return data;
}

function buildMttrSeries(partnerId: string) {
  const data: { day: number; value: number }[] = [];
  let seed = partnerId.length * 19;
  const rand = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  let v = 90 + rand() * 40;
  for (let i = 0; i < 30; i += 1) {
    v = v + (rand() - 0.5) * 12;
    data.push({ day: i + 1, value: Math.max(40, Math.min(180, v)) });
  }
  return data;
}

function StatusDot({ status }: { status: 'on-track' | 'at-risk' | 'breached' | 'complete' }) {
  const color =
    status === 'breached'
      ? 'error.main'
      : status === 'at-risk'
      ? 'warning.main'
      : status === 'on-track'
      ? 'success.main'
      : 'grey.400';
  return <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flex: '0 0 auto' }} />;
}

function isWithinLast24h(iso: string) {
  return NOW.getTime() - new Date(iso).getTime() < 24 * 60 * 60 * 1000;
}

const INCIDENT_STATUS_TONE: Record<'Resolved' | 'Open' | 'Monitoring', { fg: string; bg: string }> = {
  Resolved:   { fg: 'success.dark', bg: '#dcfce7' },
  Open:       { fg: 'error.dark',   bg: '#fee2e2' },
  Monitoring: { fg: 'warning.dark', bg: '#fef3c7' },
};

export default function PartnerDetail() {
  const { partnerId = '' } = useParams();
  const navigate = useNavigate();
  const partner = partnersById[partnerId];
  const [openDocId, setOpenDocId] = React.useState<string | null>(null);
  const [recDismissed, setRecDismissed] = React.useState(false);
  const [recCommitted, setRecCommitted] = React.useState(false);

  if (!partner) {
    return (
      <SupplyChainPageLayout>
        <Typography variant="h5">Partner not found</Typography>
        <Button onClick={() => navigate('/supplychainoverhaul/partners')} sx={{ mt: 2 }}>
          Back to partners
        </Button>
      </SupplyChainPageLayout>
    );
  }

  const partnerExceptions = exceptions.filter((e) => e.partnerId === partner.id);
  const partnerActiveTransactions = transactions.filter(
    (t) => t.partnerId === partner.id && t.status !== 'complete',
  );
  const partnerDocs24h = documents
    .filter((d) => d.partnerId === partner.id && isWithinLast24h(d.receivedAt))
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, 10);

  const showHealthCard = partner.healthLabel !== 'Healthy' && partner.healthChangeNote;
  const recConfidence =
    partner.healthLabel === 'Declining'
      ? 'high'
      : partner.healthLabel === 'At Risk'
      ? 'high'
      : 'moderate';
  const recHeadline =
    partner.healthLabel === 'Declining'
      ? `${partner.name} relationship is declining — escalation warranted`
      : partner.healthLabel === 'At Risk'
      ? `${partner.name} health is at risk — investigate now`
      : `${partner.name} needs a closer look this week`;

  const provenance = [
    { label: '14 days of ASN data' },
    { label: 'DC analysis' },
    { label: 'partner contact log' },
  ];

  const asnData = React.useMemo(() => buildAsnSeries(partner), [partner]);
  const excData = React.useMemo(() => buildExceptionVolume(partner.id), [partner.id]);
  const mttrData = React.useMemo(() => buildMttrSeries(partner.id), [partner.id]);

  const recState = recDismissed ? 'dismissed' : recCommitted ? 'committed' : 'idle';

  return (
    <SupplyChainPageLayout>
      {/* Breadcrumb */}
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          onClick={() => navigate('/supplychainoverhaul/partners')}
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          Partners
        </Typography>
        <ChevronRight size={12} color="#9ca3af" />
        <Typography variant="caption" color="text.primary" sx={{ fontWeight: 500 }}>
          {partner.name}
        </Typography>
      </Stack>

      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 0.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {partner.name}
          </Typography>
          <TierPill tier={partner.tier} />
          <HealthDot label={partner.healthLabel} />
          <TrendArrow trend={partner.healthTrend} />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" startIcon={<Pencil size={14} />}>
            Edit configuration
          </Button>
          <Button variant="outlined" size="small" startIcon={<PhoneCall size={14} />}>
            Contact partner
          </Button>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        GLN <Box component="span" sx={{ fontFamily: 'monospace' }}>{partner.gln}</Box>
        {partner.additionalGLNs.length > 0 && (
          <>
            {' '}+ {partner.additionalGLNs.length} additional
          </>
        )}
        {' · '}
        Account manager {partner.accountManager.name}
        {' · '}
        Doc types {partner.exchangedDocTypes.join(', ')}
      </Typography>

      {/* AI moment: Health card */}
      {showHealthCard && (
        <Section>
          <RecommendationCard
            confidence={recConfidence}
            headline={recHeadline}
            reasoning={partner.healthChangeNote ?? ''}
            provenance={provenance}
            primaryAction={{
              label:
                partner.healthLabel === 'Declining'
                  ? 'Escalate to TPM'
                  : partner.healthLabel === 'At Risk'
                  ? 'Schedule partner review'
                  : 'Open investigation',
              onClick: () => setRecCommitted(true),
            }}
            alternatives={[
              { label: 'Add note', onClick: () => {} },
              { label: 'Open exceptions', onClick: () => navigate(`/supplychainoverhaul/inbox?partner=${partner.id}`) },
            ]}
            onDismiss={() => setRecDismissed(true)}
            state={recState}
            committedLabel="Action recorded for this partner"
            onUndo={() => setRecCommitted(false)}
            onCommittedExpire={() => setRecCommitted(false)}
          />
        </Section>
      )}

      {/* Health detail */}
      <Section>
        <SectionHeader title="Health detail" />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 2,
          }}
        >
          <ChartCard title="ASN timeliness" subtitle="last 30 days">
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={asnData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} width={28} />
                <RcTooltip
                  formatter={(v) => `${Number(v).toFixed(1)}%`}
                  labelFormatter={(d) => `Day ${d}`}
                />
                <ReferenceLine
                  y={partner.slaThresholds.asnTimelinessPercent}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: `SLA ${partner.slaThresholds.asnTimelinessPercent}%`,
                    position: 'insideTopRight',
                    fontSize: 10,
                    fill: '#64748b',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={
                    partner.currentSLA.asnTimelinessPercent >= partner.slaThresholds.asnTimelinessPercent
                      ? '#16a34a'
                      : '#dc2626'
                  }
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Exception volume" subtitle="last 30 days">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={excData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={20} />
                <RcTooltip labelFormatter={(d) => `Day ${d}`} />
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {excData.map((d) => (
                    <Cell key={d.day} fill={d.isToday ? '#dc2626' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Resolution time" subtitle="MTTR, last 30 days">
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={mttrData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis tick={{ fontSize: 10 }} width={28} unit="m" />
                <RcTooltip
                  formatter={(v) => `${Math.round(Number(v))}m`}
                  labelFormatter={(d) => `Day ${d}`}
                />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>
      </Section>

      {/* Active exceptions */}
      <Section>
        <SectionHeader title="Open exceptions" count={partnerExceptions.length} />
        {partnerExceptions.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={20} color="#16a34a" />}
            text="No open exceptions."
          />
        ) : (
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
            {partnerExceptions.map((ex) => (
              <Box
                key={ex.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/supplychainoverhaul/exception/${ex.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/supplychainoverhaul/exception/${ex.id}`);
                  }
                }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '90px minmax(0, 2fr) 80px 90px minmax(0, 1fr)',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'grey.50' },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                  {ex.id}
                </Typography>
                <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                  {ex.title}
                </Typography>
                <Chip
                  label={ex.ediDocType}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, height: 22, justifySelf: 'start' }}
                />
                <Typography variant="caption" color="text.secondary">
                  age {ex.age}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {ex.assignee ?? 'Unassigned'}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Section>

      {/* In-flight transactions */}
      <Section>
        <SectionHeader title="Active transactions" count={partnerActiveTransactions.length} />
        {partnerActiveTransactions.length === 0 ? (
          <EmptyState text="No active transactions." />
        ) : (
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
            {partnerActiveTransactions.map((t) => (
              <Box
                key={t.poId}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/supplychainoverhaul/transactions/${t.poId}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/supplychainoverhaul/transactions/${t.poId}`);
                  }
                }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '140px 16px minmax(0, 2fr) 110px 130px',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'grey.50' },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }} noWrap>
                  {t.poId}
                </Typography>
                <StatusDot status={t.status} />
                <LifecycleStrip timeline={t.timeline} compact />
                <Typography variant="caption" color="text.secondary">
                  {t.lineItemCount} lines
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(t.lastEventAt)}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Section>

      {/* Recent documents */}
      <Section>
        <SectionHeader title="Recent documents" count={partnerDocs24h.length} action={
          <Typography variant="caption" color="text.secondary">last 24h</Typography>
        } />
        {partnerDocs24h.length === 0 ? (
          <EmptyState text="No documents in the last 24 hours." />
        ) : (
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
            {partnerDocs24h.map((d) => (
              <Box
                key={d.id}
                role="button"
                tabIndex={0}
                onClick={() => setOpenDocId(d.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenDocId(d.id);
                  }
                }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '120px 56px 80px minmax(0, 1fr) 110px',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'grey.50' },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                  {formatTimestamp(d.receivedAt)}
                </Typography>
                <Chip
                  label={d.docType}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, height: 20, justifySelf: 'start' }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {d.direction}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }} noWrap>
                  {d.reference ?? '—'}
                </Typography>
                <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                  {d.status}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Section>

      {/* Configuration */}
      <Section>
        <SectionHeader
          title="Configuration"
          action={
            <Button variant="text" size="small" startIcon={<Pencil size={12} />}>
              Edit configuration
            </Button>
          }
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 2,
          }}
        >
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
              Document types exchanged
            </Typography>
            <Stack divider={<Divider flexItem />} spacing={1}>
              {partner.mapVersions.map((m) => (
                <Stack
                  key={m.docType}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      label={m.docType}
                      size="small"
                      variant="outlined"
                      sx={{ fontFamily: 'monospace', fontWeight: 600, height: 22 }}
                    />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {m.version}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    deployed {formatTimestamp(m.deployedAt)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
              SLA thresholds
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.5fr) 80px 80px 80px',
                rowGap: 0.75,
                columnGap: 1,
                fontSize: 13,
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary">Metric</Typography>
              <Typography variant="caption" color="text.secondary">Threshold</Typography>
              <Typography variant="caption" color="text.secondary">Current</Typography>
              <Typography variant="caption" color="text.secondary">Status</Typography>

              <SlaRow
                metric="ASN timeliness"
                threshold={partner.slaThresholds.asnTimelinessPercent}
                current={partner.currentSLA.asnTimelinessPercent}
              />
              <SlaRow
                metric="Ack timeliness"
                threshold={partner.slaThresholds.ackTimelinessPercent}
                current={partner.currentSLA.ackTimelinessPercent}
              />
              <SlaRow
                metric="Invoice match"
                threshold={partner.slaThresholds.invoiceMatchPercent}
                current={partner.currentSLA.invoiceMatchPercent}
              />
            </Box>
          </Box>
        </Box>
      </Section>

      {/* Contacts */}
      <Section>
        <SectionHeader title="Contacts" />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 2,
          }}
        >
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
              Internal — Account manager
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {partner.accountManager.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {partner.accountManager.email}
            </Typography>
          </Box>

          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
              Partner contacts
            </Typography>
            <Stack divider={<Divider flexItem />} spacing={1.25}>
              {partner.partnerContacts.map((c) => (
                <Box key={c.email}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {c.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {c.role}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {c.email} · {c.phone}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Section>

      {/* Notes & incidents */}
      <Section>
        <SectionHeader title="Notes & recent incidents" />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 2,
          }}
        >
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Notes
              </Typography>
              <Button variant="text" size="small" startIcon={<Plus size={12} />}>
                Add note
              </Button>
            </Stack>
            <Stack divider={<Divider flexItem />} spacing={1.25}>
              {partner.notes.slice(0, 5).map((n, i) => (
                <Box key={i}>
                  <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {n.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(n.ts)}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {n.body}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1 }}>
              Recent incidents
            </Typography>
            {partner.recentIncidents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No recent incidents.
              </Typography>
            ) : (
              <Stack divider={<Divider flexItem />} spacing={1.25}>
                {partner.recentIncidents.map((inc, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {inc.date}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.25 }}>
                        {inc.summary}
                      </Typography>
                    </Box>
                    <IncidentStatusPill status={inc.status} />
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Section>

      <DocumentInspector
        open={openDocId !== null}
        documentId={openDocId}
        onClose={() => setOpenDocId(null)}
        onOpenDocument={(id) => setOpenDocId(id)}
      />
    </SupplyChainPageLayout>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      {children}
    </Box>
  );
}

function EmptyState({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 1.5,
        p: 3,
        textAlign: 'center',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
        {icon}
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </Stack>
    </Box>
  );
}

function SlaRow({
  metric,
  threshold,
  current,
}: {
  metric: string;
  threshold: number;
  current: number;
}) {
  const meets = current >= threshold;
  return (
    <>
      <Typography variant="body2">{metric}</Typography>
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        {threshold}%
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontFamily: 'monospace', color: meets ? 'success.dark' : 'error.dark', fontWeight: 600 }}
      >
        {current.toFixed(1)}%
      </Typography>
      <Box>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 0.75,
            height: 20,
            borderRadius: 1,
            bgcolor: meets ? '#dcfce7' : '#fee2e2',
            color: meets ? 'success.dark' : 'error.dark',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {meets ? 'Meets' : 'Below'}
        </Box>
      </Box>
    </>
  );
}

function IncidentStatusPill({ status }: { status: 'Resolved' | 'Open' | 'Monitoring' }) {
  const tone = INCIDENT_STATUS_TONE[status];
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 0.75,
        height: 20,
        borderRadius: 1,
        bgcolor: tone.bg,
        color: tone.fg,
        fontSize: 11,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {status}
    </Box>
  );
}
