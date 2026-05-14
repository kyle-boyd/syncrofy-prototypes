import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Button,
} from '@mui/material';
import { ArrowDown, ArrowUp, Link2 } from 'lucide-react';
import { Search } from '@design-system';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { DocumentInspector } from '../components/DocumentInspector';
import {
  documents,
  type EdiDocument,
  type DocStatus,
  type DocDirection,
} from '../fixtures/documents';
import { partners, partnersById } from '../fixtures/partners';
import type { EdiDocType } from '../fixtures/exceptions';

const NOW = new Date('2026-05-06T13:30:00Z');

type DirectionFilter = 'all' | DocDirection;
type DocTypeFilter = 'all' | EdiDocType;
type StatusFilter = 'all' | DocStatus;
type TimeRangeFilter = 'all' | '1h' | '24h' | '7d' | 'custom';

const DOC_TYPES: EdiDocType[] = ['850', '855', '856', '810', '940', '997'];

const STATUS_TONE: Record<DocStatus, { label: string; dot: string; fg: string }> = {
  translated: { label: 'Translated', dot: 'success.main', fg: 'success.dark' },
  failed:     { label: 'Failed',     dot: 'error.main',   fg: 'error.dark' },
  pending:    { label: 'Pending',    dot: 'warning.main', fg: 'warning.dark' },
  duplicate:  { label: 'Duplicate',  dot: 'warning.main', fg: 'warning.dark' },
};

const COLS = '76px 28px 56px minmax(0, 1.4fr) minmax(0, 1fr) 130px minmax(0, 0.9fr)';

function formatRelativeTime(iso: string): string {
  const ts = new Date(iso);
  const diffMs = NOW.getTime() - ts.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 0) return ts.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 6) return `${diffH}h ago`;
  // Same calendar day → wall-clock time
  if (
    ts.getFullYear() === NOW.getFullYear() &&
    ts.getMonth() === NOW.getMonth() &&
    ts.getDate() === NOW.getDate()
  ) {
    return ts.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  // Older: short absolute
  return ts.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function StatusPill({ status }: { status: DocStatus }) {
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

function matchesQuery(doc: EdiDocument, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  const partner = doc.partnerId ? partnersById[doc.partnerId] : undefined;
  const haystack = [
    doc.id,
    doc.controlNumbers.isa13,
    doc.controlNumbers.gs06,
    doc.controlNumbers.st02,
    doc.reference ?? '',
    partner?.name ?? '',
    doc.docType,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

function timeCutoff(range: TimeRangeFilter): Date | null {
  const now = NOW.getTime();
  if (range === '1h') return new Date(now - 60 * 60 * 1000);
  if (range === '24h') return new Date(now - 24 * 60 * 60 * 1000);
  if (range === '7d') return new Date(now - 7 * 24 * 60 * 60 * 1000);
  return null;
}

export default function Documents() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') ?? '';

  const [query, setQuery] = React.useState(queryFromUrl);
  const [direction, setDirection] = React.useState<DirectionFilter>('all');
  const [docType, setDocType] = React.useState<DocTypeFilter>('all');
  const [partnerId, setPartnerId] = React.useState<string>('all');
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [timeRange, setTimeRange] = React.useState<TimeRangeFilter>('all');
  const [openDocId, setOpenDocId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  const commitQuery = (next: string) => {
    setQuery(next);
    const params = new URLSearchParams(searchParams);
    if (next) params.set('q', next);
    else params.delete('q');
    setSearchParams(params, { replace: true });
  };

  const filtered = React.useMemo(() => {
    const cutoff = timeCutoff(timeRange);
    return documents
      .filter((d) => {
        // Held documents (uncategorized senders) are excluded from the main
        // Documents list — they aren't processed until the sender is
        // categorized via the Partners → Uncategorized flow.
        if (d.uncategorizedSenderId) return false;
        if (direction !== 'all' && d.direction !== direction) return false;
        if (docType !== 'all' && d.docType !== docType) return false;
        if (partnerId !== 'all' && d.partnerId !== partnerId) return false;
        if (status !== 'all' && d.status !== status) return false;
        if (cutoff && new Date(d.receivedAt) < cutoff) return false;
        if (!matchesQuery(d, query)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }, [direction, docType, partnerId, status, timeRange, query]);

  const resetFilters = () => {
    setDirection('all');
    setDocType('all');
    setPartnerId('all');
    setStatus('all');
    setTimeRange('all');
    commitQuery('');
  };

  const hasQuery = query.trim().length > 0;

  return (
    <SupplyChainPageLayout>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h4">Documents</Typography>
        <Typography variant="body2" color="text.secondary">
          All EDI traffic, searchable. The complete record across partners and document types.
        </Typography>
      </Stack>

      <Box sx={{ mb: 2 }}>
        <Search
          fullWidth
          size="medium"
          placeholder="Search by control number, PO, partner, or doc type…"
          value={query}
          onChange={(e) => commitQuery(e.target.value)}
        />
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="dir-label">Direction</InputLabel>
          <Select
            labelId="dir-label"
            label="Direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value as DirectionFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="inbound">Inbound</MenuItem>
            <MenuItem value="outbound">Outbound</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="dtype-label">Doc type</InputLabel>
          <Select
            labelId="dtype-label"
            label="Doc type"
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocTypeFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            {DOC_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="partner-label">Partner</InputLabel>
          <Select
            labelId="partner-label"
            label="Partner"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
          >
            <MenuItem value="all">All partners</MenuItem>
            {partners.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="translated">Translated</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="duplicate">Duplicate</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="time-label">Time range</InputLabel>
          <Select
            labelId="time-label"
            label="Time range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRangeFilter)}
          >
            <MenuItem value="all">All time</MenuItem>
            <MenuItem value="1h">Last hour</MenuItem>
            <MenuItem value="24h">Last 24h</MenuItem>
            <MenuItem value="7d">Last 7d</MenuItem>
            <MenuItem value="custom">Custom…</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack spacing={0.5} sx={{ mb: 1.5 }}>
        {hasQuery ? (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {`Results for "${query}"`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {filtered.length} document{filtered.length === 1 ? '' : 's'} match
            </Typography>
          </>
        ) : (
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Recent activity
          </Typography>
        )}
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
          <Box>Time</Box>
          <Box />
          <Box>Doc</Box>
          <Box>Partner</Box>
          <Box>Reference</Box>
          <Box>Status</Box>
          <Box>Linked alert</Box>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Stack spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                No documents match these filters.
              </Typography>
              {hasQuery && (
                <Typography variant="caption" color="text.secondary">
                  Try a partial control number or PO id, e.g., &ldquo;8847291&rdquo; or &ldquo;ISA00004&rdquo;.
                </Typography>
              )}
              <Box sx={{ pt: 1 }}>
                <Button size="small" variant="outlined" onClick={resetFilters}>
                  Reset filters
                </Button>
              </Box>
            </Stack>
          </Box>
        ) : (
          filtered.map((d) => {
            const partner = d.partnerId ? partnersById[d.partnerId] : undefined;
            const DirIcon = d.direction === 'inbound' ? ArrowDown : ArrowUp;
            const dirColor = d.direction === 'inbound' ? 'text.secondary' : 'text.primary';
            const dirTip =
              d.direction === 'inbound'
                ? `Inbound from ${partner?.name ?? ''}`
                : `Outbound to ${partner?.name ?? ''}`;
            return (
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
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                  noWrap
                >
                  {formatRelativeTime(d.receivedAt)}
                </Typography>

                <Tooltip title={dirTip} arrow>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', color: dirColor }}>
                    <DirIcon size={14} />
                  </Box>
                </Tooltip>

                <Chip
                  label={d.docType}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', fontWeight: 600, height: 22 }}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {partner?.name ?? '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    Tier {partner?.tier ?? '—'}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                  noWrap
                >
                  {d.reference ?? '—'}
                </Typography>

                <StatusPill status={d.status} />

                {d.exceptionId ? (
                  <Box
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/supplychainoverhaul/exception/${d.exceptionId}`);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/supplychainoverhaul/exception/${d.exceptionId}`);
                      }
                    }}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: 1,
                      cursor: 'pointer',
                      color: 'primary.main',
                      width: 'fit-content',
                      '&:hover': { bgcolor: 'action.hover' },
                      '&:focus-visible': { outline: (th) => `2px solid ${th.palette.primary.main}`, outlineOffset: 1 },
                    }}
                  >
                    <Link2 size={12} />
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {d.exceptionId}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="caption" color="text.disabled">
                    —
                  </Typography>
                )}
              </Box>
            );
          })
        )}
      </Box>

      <DocumentInspector
        open={openDocId !== null}
        documentId={openDocId}
        onClose={() => setOpenDocId(null)}
        onOpenDocument={(id) => setOpenDocId(id)}
      />
    </SupplyChainPageLayout>
  );
}
