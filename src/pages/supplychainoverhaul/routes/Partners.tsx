import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle } from 'lucide-react';
import { Tabs } from '@design-system';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { StatTile } from '../components/StatTile';
import {
  partners,
  type PartnerHealthLabel,
  type PartnerHealthTrend,
  type PartnerTier,
} from '../fixtures/partners';
import { exceptions } from '../fixtures/exceptions';
import { formatTimestamp } from '../lib/time';
import { useUncategorizedSenders } from '../lib/uncategorizedStore';
import type { ConfidenceLabel, UncategorizedSender } from '../types/uncategorized';
import { CategorizationDrawer } from '../ai/CategorizationDrawer';

type TierFilter = 'all' | PartnerTier;
type HealthFilter = 'all' | PartnerHealthLabel;
type DocFilter = 'all' | string;
type SortKey = 'health' | 'tier' | 'name' | 'exceptions';

const HEALTH_TONE: Record<PartnerHealthLabel, { dot: string; fg: string }> = {
  Healthy:    { dot: '#16a34a', fg: 'success.dark' },
  Watch:      { dot: '#f59e0b', fg: 'warning.dark' },
  'At Risk':  { dot: '#f97316', fg: 'warning.dark' },
  Declining:  { dot: '#dc2626', fg: 'error.dark' },
};

const HEALTH_RANK: Record<PartnerHealthLabel, number> = {
  Declining: 0,
  'At Risk': 1,
  Watch: 2,
  Healthy: 3,
};

const DOC_OPTIONS = ['850', '855', '856', '810', '940'];

function HealthDot({ label }: { label: PartnerHealthLabel }) {
  const tone = HEALTH_TONE[label];
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tone.dot, flex: '0 0 auto' }} />
      <Typography variant="body2" sx={{ color: tone.fg, fontWeight: 500 }}>
        {label}
      </Typography>
    </Stack>
  );
}

function TrendArrow({ trend }: { trend: PartnerHealthTrend }) {
  if (trend === 'up') {
    return (
      <Tooltip title="Improving week over week" arrow>
        <Box sx={{ display: 'inline-flex', color: 'success.main' }}>
          <ArrowUp size={14} />
        </Box>
      </Tooltip>
    );
  }
  if (trend === 'down') {
    return (
      <Tooltip title="Declining week over week" arrow>
        <Box sx={{ display: 'inline-flex', color: 'error.main' }}>
          <ArrowDown size={14} />
        </Box>
      </Tooltip>
    );
  }
  return (
    <Tooltip title="Flat week over week" arrow>
      <Box sx={{ display: 'inline-flex', color: 'text.secondary' }}>
        <ArrowRight size={14} />
      </Box>
    </Tooltip>
  );
}

function ComplianceBar({ current, threshold }: { current: number; threshold: number }) {
  const pct = Math.max(0, Math.min(100, current));
  const gap = current - threshold;
  let barColor: string;
  if (gap >= 0) barColor = '#16a34a';
  else if (gap > -2) barColor = '#f59e0b';
  else if (gap > -4) barColor = '#f97316';
  else barColor = '#dc2626';

  // threshold marker position (assume range 80–100 visually for clarity)
  const minScale = 80;
  const maxScale = 100;
  const clamp = (v: number) => Math.max(minScale, Math.min(maxScale, v));
  const toPct = (v: number) => ((clamp(v) - minScale) / (maxScale - minScale)) * 100;

  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Stack direction="row" alignItems="baseline" spacing={0.5}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: barColor }}>
          {pct.toFixed(1)}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          / {threshold}%
        </Typography>
      </Stack>
      <Box
        sx={{
          position: 'relative',
          height: 6,
          bgcolor: 'grey.100',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${toPct(current)}%`,
            bgcolor: barColor,
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: `${toPct(threshold)}%`,
            top: -1,
            bottom: -1,
            width: '2px',
            bgcolor: 'text.primary',
            opacity: 0.55,
          }}
        />
      </Box>
    </Stack>
  );
}

function TierPill({ tier }: { tier: PartnerTier }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 0.75,
        height: 18,
        borderRadius: 1,
        bgcolor: 'grey.100',
        color: 'text.secondary',
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      Tier {tier}
    </Box>
  );
}

const COLS = 'minmax(0, 1.5fr) 140px 32px minmax(180px, 1.2fr) 90px 160px 130px';

// ── Uncategorized tab ───────────────────────────────────────────────────────
const CONF_COLOR: Record<ConfidenceLabel, string> = {
  high: 'success.main',
  moderate: 'warning.main',
  exploratory: 'grey.400',
  none: 'transparent',
};
const CONF_LABEL: Record<ConfidenceLabel, string> = {
  high: 'high',
  moderate: 'moderate',
  exploratory: 'exploratory',
  none: 'no recommendation',
};

type ConfFilter = 'all' | ConfidenceLabel;
type UncSortKey = 'docs-desc' | 'first-seen-asc' | 'first-seen-desc' | 'confidence';

const CONF_RANK: Record<ConfidenceLabel, number> = {
  high: 0,
  moderate: 1,
  exploratory: 2,
  none: 3,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(diff / 60000));
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function envelopeId(s: UncategorizedSender): string {
  return `${s.envelope.qualifier} / ${s.envelope.value}${
    s.envelope.subValue ? ' / ' + s.envelope.subValue : ''
  }`;
}

function UncategorizedSenderCard({
  sender,
  onOpen,
}: {
  sender: UncategorizedSender;
  onOpen: () => void;
}) {
  const conf = sender.recommendation.overallConfidence;
  const name = sender.recommendation.fields.name.value;
  const summary = sender.recommendation.signalSummary;

  let summaryLine: string;
  if (conf === 'high' || conf === 'moderate') {
    summaryLine = `Likely ${name ?? 'unknown'} — ${summary.agreeing} of ${summary.totalSignals} signals agree`;
  } else if (conf === 'exploratory') {
    summaryLine = "Signals don't agree — review carefully";
  } else {
    summaryLine = 'Not enough signal to recommend — manual categorization required';
  }

  // Collect signal descriptions from the name field (the most representative).
  const nameSignals = sender.recommendation.fields.name.signals
    .map((s) => s.description.split(' ').slice(0, 4).join(' '))
    .slice(0, 4);

  const docTypes = sender.observedSignals.docTypePattern.map((p) => p.docType).join(', ');

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        px: 2.5,
        py: 2,
        cursor: 'pointer',
        outline: 'none',
        '&:hover': { bgcolor: 'grey.50' },
        '&:focus-visible': { boxShadow: (t) => `inset 0 0 0 2px ${t.palette.primary.main}` },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {envelopeId(sender)}
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          {conf !== 'none' && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: CONF_COLOR[conf],
              }}
            />
          )}
          <Typography variant="caption" color="text.secondary">
            {CONF_LABEL[conf]}
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        {sender.heldDocumentIds.length} document
        {sender.heldDocumentIds.length === 1 ? '' : 's'} held · first seen{' '}
        {timeAgo(sender.firstSeenAt)} · last seen {timeAgo(sender.lastSeenAt)}
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {summaryLine}
      </Typography>
      {nameSignals.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          based on: {nameSignals.join(' · ')}
        </Typography>
      )}

      {docTypes && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          Document types: {docTypes}
        </Typography>
      )}

      <Stack direction="row" justifyContent="flex-end">
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'primary.main',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Categorize
          <ArrowRight size={14} />
        </Box>
      </Stack>
    </Box>
  );
}

function UncategorizedTab({
  senders,
  onOpen,
}: {
  senders: UncategorizedSender[];
  onOpen: (id: string) => void;
}) {
  const [confFilter, setConfFilter] = React.useState<ConfFilter>('all');
  const [sortKey, setSortKey] = React.useState<UncSortKey>('docs-desc');

  const filtered = React.useMemo(() => {
    const list = senders.filter(
      (s) => confFilter === 'all' || s.recommendation.overallConfidence === confFilter,
    );
    return [...list].sort((a, b) => {
      switch (sortKey) {
        case 'first-seen-asc':
          return new Date(a.firstSeenAt).getTime() - new Date(b.firstSeenAt).getTime();
        case 'first-seen-desc':
          return new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime();
        case 'confidence':
          return (
            CONF_RANK[a.recommendation.overallConfidence] -
            CONF_RANK[b.recommendation.overallConfidence]
          );
        case 'docs-desc':
        default:
          return b.heldDocumentIds.length - a.heldDocumentIds.length;
      }
    });
  }, [senders, confFilter, sortKey]);

  if (senders.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box sx={{ color: 'success.main', display: 'inline-flex', mb: 1.5 }}>
          <CheckCircle size={40} />
        </Box>
        <Typography variant="h6">No uncategorized senders right now.</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Senders with no matching partner record will appear here when they send documents.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Documents from these senders are held in quarantine until categorized. They will not be
        processed by routing rules, partner validations, or SLA tracking until you assign them to a
        partner record.
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="conf-label">Confidence</InputLabel>
          <Select
            labelId="conf-label"
            label="Confidence"
            value={confFilter}
            onChange={(e) => setConfFilter(e.target.value as ConfFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="exploratory">Exploratory</MenuItem>
            <MenuItem value="none">No recommendation</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flex: 1 }} />
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="unc-sort-label">Sort by</InputLabel>
          <Select
            labelId="unc-sort-label"
            label="Sort by"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as UncSortKey)}
          >
            <MenuItem value="docs-desc">Documents held (most first)</MenuItem>
            <MenuItem value="first-seen-asc">First seen (oldest first)</MenuItem>
            <MenuItem value="first-seen-desc">First seen (newest first)</MenuItem>
            <MenuItem value="confidence">Confidence</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack spacing={1.5}>
        {filtered.map((s) => (
          <UncategorizedSenderCard key={s.id} sender={s} onOpen={() => onOpen(s.id)} />
        ))}
        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No senders match the current filters.
          </Typography>
        )}
      </Stack>
    </>
  );
}

export default function Partners() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const uncategorizedSenders = useUncategorizedSenders();

  const tabParam = searchParams.get('tab');
  const activeTab: 'active' | 'uncategorized' =
    tabParam === 'uncategorized' ? 'uncategorized' : 'active';
  const openSenderId = searchParams.get('open');

  const setTab = (next: 'active' | 'uncategorized') => {
    const params = new URLSearchParams(searchParams);
    if (next === 'active') params.delete('tab');
    else params.set('tab', 'uncategorized');
    params.delete('open');
    setSearchParams(params, { replace: true });
  };

  const openSender = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', 'uncategorized');
    params.set('open', id);
    setSearchParams(params, { replace: true });
  };

  const closeDrawer = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('open');
    setSearchParams(params, { replace: true });
  };

  const [tier, setTier] = React.useState<TierFilter>('all');
  const [health, setHealth] = React.useState<HealthFilter>('all');
  const [docFilter, setDocFilter] = React.useState<DocFilter>('all');
  const [sortKey, setSortKey] = React.useState<SortKey>('health');

  const exceptionCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of exceptions) {
      counts[e.partnerId] = (counts[e.partnerId] ?? 0) + 1;
    }
    return counts;
  }, []);

  const filtered = React.useMemo(() => {
    return partners
      .filter((p) => {
        if (tier !== 'all' && p.tier !== tier) return false;
        if (health !== 'all' && p.healthLabel !== health) return false;
        if (docFilter !== 'all' && !p.exchangedDocTypes.includes(docFilter)) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortKey) {
          case 'tier':
            return a.tier - b.tier || a.name.localeCompare(b.name);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'exceptions':
            return (exceptionCounts[b.id] ?? 0) - (exceptionCounts[a.id] ?? 0);
          case 'health':
          default: {
            const hr = HEALTH_RANK[a.healthLabel] - HEALTH_RANK[b.healthLabel];
            if (hr !== 0) return hr;
            return (exceptionCounts[b.id] ?? 0) - (exceptionCounts[a.id] ?? 0);
          }
        }
      });
  }, [tier, health, docFilter, sortKey, exceptionCounts]);

  const totals = React.useMemo(() => {
    const t = { total: partners.length, healthy: 0, watch: 0, atRiskOrDeclining: 0 };
    for (const p of partners) {
      if (p.healthLabel === 'Healthy') t.healthy += 1;
      else if (p.healthLabel === 'Watch') t.watch += 1;
      else t.atRiskOrDeclining += 1;
    }
    return t;
  }, []);

  return (
    <SupplyChainPageLayout>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h4">Partners</Typography>
        <Typography variant="body2" color="text.secondary">
          Trading partners and the health of each relationship.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap', rowGap: 1 }}>
        <StatTile label="Total partners" value={totals.total} />
        <StatTile label="Healthy" value={totals.healthy} tone="success" />
        <StatTile label="Watch" value={totals.watch} tone="warn" />
        <StatTile
          label="At Risk + Declining"
          value={totals.atRiskOrDeclining}
          tone={totals.atRiskOrDeclining > 0 ? 'critical' : 'neutral'}
        />
      </Stack>

      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setTab(v as 'active' | 'uncategorized')}
          tabs={[
            { label: `Active (${partners.length})`, value: 'active' },
            {
              label:
                uncategorizedSenders.length > 0
                  ? `Uncategorized (${uncategorizedSenders.length}) •`
                  : 'Uncategorized (0)',
              value: 'uncategorized',
            },
          ]}
        />
      </Box>

      {activeTab === 'uncategorized' ? (
        <>
          <UncategorizedTab senders={uncategorizedSenders} onOpen={openSender} />
          <CategorizationDrawer senderId={openSenderId} onClose={closeDrawer} />
        </>
      ) : (
        <ActivePartnersList
          navigate={navigate}
          tier={tier}
          setTier={setTier}
          health={health}
          setHealth={setHealth}
          docFilter={docFilter}
          setDocFilter={setDocFilter}
          sortKey={sortKey}
          setSortKey={setSortKey}
          filtered={filtered}
          exceptionCounts={exceptionCounts}
        />
      )}
    </SupplyChainPageLayout>
  );
}

// Active partners list extracted so the file's main component can switch on tabs.
interface ActiveListProps {
  navigate: ReturnType<typeof useNavigate>;
  tier: TierFilter;
  setTier: (v: TierFilter) => void;
  health: HealthFilter;
  setHealth: (v: HealthFilter) => void;
  docFilter: DocFilter;
  setDocFilter: (v: DocFilter) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  filtered: typeof partners;
  exceptionCounts: Record<string, number>;
}

function ActivePartnersList({
  navigate,
  tier,
  setTier,
  health,
  setHealth,
  docFilter,
  setDocFilter,
  sortKey,
  setSortKey,
  filtered,
  exceptionCounts,
}: ActiveListProps) {
  return (
    <>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="tier-label">Tier</InputLabel>
          <Select
            labelId="tier-label"
            label="Tier"
            value={String(tier)}
            onChange={(e) => setTier(e.target.value === 'all' ? 'all' : (Number(e.target.value) as PartnerTier))}
          >
            <MenuItem value="all">All tiers</MenuItem>
            <MenuItem value="1">Tier 1</MenuItem>
            <MenuItem value="2">Tier 2</MenuItem>
            <MenuItem value="3">Tier 3</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="health-label">Health</InputLabel>
          <Select
            labelId="health-label"
            label="Health"
            value={health}
            onChange={(e) => setHealth(e.target.value as HealthFilter)}
          >
            <MenuItem value="all">All health</MenuItem>
            <MenuItem value="Healthy">Healthy</MenuItem>
            <MenuItem value="Watch">Watch</MenuItem>
            <MenuItem value="At Risk">At Risk</MenuItem>
            <MenuItem value="Declining">Declining</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="doc-label">Doc type</InputLabel>
          <Select
            labelId="doc-label"
            label="Doc type"
            value={docFilter}
            onChange={(e) => setDocFilter(e.target.value)}
          >
            <MenuItem value="all">All doc types</MenuItem>
            {DOC_OPTIONS.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }} />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            label="Sort by"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <MenuItem value="health">Health (worst first)</MenuItem>
            <MenuItem value="tier">Tier</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="exceptions">Exception count</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: COLS,
            gap: 1.5,
            px: 2,
            py: 1,
            bgcolor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <Box>Partner</Box>
          <Box>Health</Box>
          <Box>Trend</Box>
          <Box>ASN compliance</Box>
          <Box>Open exc.</Box>
          <Box>Account manager</Box>
          <Box>Last activity</Box>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No partners match the current filters.
            </Typography>
          </Box>
        ) : (
          filtered.map((p) => {
            const open = () => navigate(`/supplychainoverhaul/partners/${p.id}`);
            const exCount = exceptionCounts[p.id] ?? 0;
            return (
              <Box
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={open}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open();
                  }
                }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: COLS,
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  outline: 'none',
                  '&:hover': { bgcolor: 'grey.50' },
                  '&:focus-visible': {
                    bgcolor: 'grey.50',
                    boxShadow: (th) => `inset 0 0 0 2px ${th.palette.primary.main}`,
                  },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                    {p.name}
                  </Typography>
                  <TierPill tier={p.tier} />
                </Stack>

                <HealthDot label={p.healthLabel} />

                <TrendArrow trend={p.healthTrend} />

                <ComplianceBar
                  current={p.currentSLA.asnTimelinessPercent}
                  threshold={p.slaThresholds.asnTimelinessPercent}
                />

                {exCount === 0 ? (
                  <Typography variant="body2" color="text.disabled">
                    —
                  </Typography>
                ) : (
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/supplychainoverhaul/inbox?partner=${encodeURIComponent(p.id)}`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/supplychainoverhaul/inbox?partner=${encodeURIComponent(p.id)}`);
                      }
                    }}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 28,
                      height: 22,
                      px: 0.75,
                      borderRadius: 1,
                      bgcolor: 'primary.main',
                      color: 'common.white',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                      width: 'fit-content',
                      '&:hover': { filter: 'brightness(1.08)' },
                    }}
                  >
                    {exCount}
                  </Box>
                )}

                <Typography variant="body2" noWrap>
                  {p.accountManager.name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(p.lastActivityAt)}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {filtered.length} of {partners.length} partners
      </Typography>
    </>
  );
}
