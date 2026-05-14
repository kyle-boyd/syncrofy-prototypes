import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { LifecycleStrip } from '../components/LifecycleStrip';
import {
  transactions,
  type Transaction,
  type TransactionStage,
  type TransactionStatus,
} from '../fixtures/transactions';
import { partners, partnersById } from '../fixtures/partners';
import { exceptionsById } from '../fixtures/exceptions';
import { computePriority } from '../lib/priority';
import { bandFor } from '../components/PriorityChip';
import { formatTimestamp } from '../lib/time';

type StatusFilter = 'all' | TransactionStatus;
type StageFilter = 'all' | TransactionStage;
type SortKey = 'newest' | 'oldest' | 'value' | 'open-exceptions';

const STATUS_TONE: Record<TransactionStatus, { label: string; dot: string; fg: string }> = {
  'on-track': { label: 'On track', dot: 'success.main', fg: 'success.dark' },
  'at-risk': { label: 'At risk', dot: 'warning.main', fg: 'warning.dark' },
  breached: { label: 'Breached', dot: 'error.main', fg: 'error.dark' },
  complete: { label: 'Complete', dot: 'grey.400', fg: 'text.secondary' },
};

const STAGE_OPTIONS: { value: StageFilter; label: string }[] = [
  { value: 'all', label: 'All stages' },
  { value: '850', label: '850' },
  { value: '855', label: '855' },
  { value: '856', label: '856' },
  { value: 'receipt', label: 'Receipt' },
  { value: '810', label: '810' },
  { value: 'complete', label: 'Complete' },
];

const BAND_BG: Record<ReturnType<typeof bandFor>, string> = {
  critical: 'error.main',
  high: 'warning.main',
  medium: 'info.main',
  low: 'grey.400',
};

function topExceptionPriority(t: Transaction): number {
  let max = 0;
  for (const id of t.openExceptionIds) {
    const ex = exceptionsById[id];
    if (!ex) continue;
    const score = computePriority(ex);
    if (score > max) max = score;
  }
  return max;
}

function StatusPill({ status }: { status: TransactionStatus }) {
  const tone = STATUS_TONE[status];
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tone.dot, flex: '0 0 auto' }} />
      <Typography variant="caption" sx={{ color: tone.fg, fontWeight: 500 }}>
        {tone.label}
      </Typography>
    </Stack>
  );
}

function ExceptionsBadge({ t, onClick }: { t: Transaction; onClick: () => void }) {
  const count = t.openExceptionIds.length;
  if (count === 0) {
    return (
      <Typography variant="body2" color="text.disabled">
        —
      </Typography>
    );
  }
  const top = topExceptionPriority(t);
  const band = bandFor(top);
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onClick();
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
        bgcolor: BAND_BG[band],
        color: band === 'low' ? 'text.primary' : 'common.white',
        fontFamily: 'monospace',
        fontWeight: 600,
        fontSize: 12,
        cursor: 'pointer',
        '&:hover': { filter: 'brightness(1.08)' },
        '&:focus-visible': { outline: (t) => `2px solid ${t.palette.primary.main}`, outlineOffset: 2 },
      }}
    >
      {count}
    </Box>
  );
}

const formatUSD = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function Transactions() {
  const navigate = useNavigate();
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [partnerId, setPartnerId] = React.useState<string>('all');
  const [stage, setStage] = React.useState<StageFilter>('all');
  const [sortKey, setSortKey] = React.useState<SortKey>('newest');

  const filtered = React.useMemo(() => {
    return transactions
      .filter((t) => {
        if (status !== 'all' && t.status !== status) return false;
        if (partnerId !== 'all' && t.partnerId !== partnerId) return false;
        if (stage !== 'all' && t.currentStage !== stage) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortKey) {
          case 'oldest':
            return new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime();
          case 'value':
            return b.totalValueUSD - a.totalValueUSD;
          case 'open-exceptions':
            return b.openExceptionIds.length - a.openExceptionIds.length;
          case 'newest':
          default:
            return new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime();
        }
      });
  }, [status, partnerId, stage, sortKey]);

  const COLS = '160px minmax(0, 1.4fr) 200px 110px 80px 110px 90px 130px';

  return (
    <SupplyChainPageLayout>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="h4">Transactions</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Active purchase order lifecycles, in flight or recently completed.
      </Typography>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={status}
          onChange={(_, v) => v && setStatus(v)}
          color="primary"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="on-track">On track</ToggleButton>
          <ToggleButton value="at-risk">At risk</ToggleButton>
          <ToggleButton value="breached">Breached</ToggleButton>
          <ToggleButton value="complete">Complete</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="t-partner-label">Partner</InputLabel>
          <Select
            labelId="t-partner-label"
            label="Partner"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
          >
            <MenuItem value="all">All partners</MenuItem>
            {partners.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="t-stage-label">Stage</InputLabel>
          <Select
            labelId="t-stage-label"
            label="Stage"
            value={stage}
            onChange={(e) => setStage(e.target.value as StageFilter)}
          >
            {STAGE_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }} />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="t-sort-label">Sort by</InputLabel>
          <Select
            labelId="t-sort-label"
            label="Sort by"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="value">Value</MenuItem>
            <MenuItem value="open-exceptions">Open exceptions</MenuItem>
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
          <Box>PO</Box>
          <Box>Partner</Box>
          <Box>Stage</Box>
          <Box>Status</Box>
          <Box>Lines</Box>
          <Box>Value</Box>
          <Box>Open exc.</Box>
          <Box>Last event</Box>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No transactions match the current filters.
            </Typography>
          </Box>
        ) : (
          filtered.map((t) => {
            const partner = partnersById[t.partnerId];
            const open = () => navigate(`/supplychainoverhaul/transactions/${t.poId}`);
            return (
              <Box
                key={t.poId}
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
                  '&:focus-visible': { bgcolor: 'grey.50', boxShadow: (th) => `inset 0 0 0 2px ${th.palette.primary.main}` },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }} noWrap>
                  {t.poId}
                </Typography>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap>{partner?.name ?? '—'}</Typography>
                  <Typography variant="caption" color="text.secondary">Tier {partner?.tier ?? '—'}</Typography>
                </Box>
                <Box>
                  <LifecycleStrip timeline={t.timeline} compact />
                </Box>
                <StatusPill status={t.status} />
                <Typography variant="body2">{t.lineItemCount}</Typography>
                <Typography variant="body2">{formatUSD(t.totalValueUSD)}</Typography>
                <ExceptionsBadge
                  t={t}
                  onClick={() => navigate(`/supplychainoverhaul/inbox?po=${encodeURIComponent(t.poId)}`)}
                />
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(t.lastEventAt)}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        {filtered.length} of {transactions.length} transactions
      </Typography>
    </SupplyChainPageLayout>
  );
}
