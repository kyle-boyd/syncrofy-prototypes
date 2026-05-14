import { useMemo, useState, useCallback, Fragment, useEffect, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Checkbox,
  IconButton,
  Collapse,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton as MuiToggleButton,
  TextField,
  Autocomplete,
  Alert,
  Link,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DangerousIcon from '@mui/icons-material/Dangerous';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LinkIcon from '@mui/icons-material/Link';
import DownloadIcon from '@mui/icons-material/Download';
import {
  PageHeader,
  FilterControls,
  Tag,
  Chips,
  Button,
  Modal,
  SnackBar,
  FilterOption,
  ActiveFilter,
} from '@design-system';
import { PageLayout } from '../components/PageLayout';
import rawMockData from '../data/mockPartnerData.json';
import rawExistingPartners from '../data/existingPartners.json';
import type {
  UncategorizedSystem,
  ExistingPartner,
  InternalExternal,
  RowState,
  Calibration,
  OutcomeBucket,
  Suggestion,
  Tier,
  FilenameToken,
  TransferGraphEdge,
} from '../categorize/types';
import { resolveTier, tierLabel } from '../categorize/types';
import { splitZones, detectConflict } from '../categorize/zones';
import {
  groupRows,
  internalExternalLean,
  graphWeightForPartner,
  type GroupingAxis,
} from '../categorize/grouping';
import { useCategorizationSession } from '../categorize/useCategorizationSession';

const allRows = rawMockData as UncategorizedSystem[];
const existingPartners = rawExistingPartners as ExistingPartner[];

const PROTOCOL_TAG_VARIANT: Record<string, 'info' | 'error' | 'warning' | 'success' | 'neutral' | 'primary'> = {
  CDI: 'primary',
  FTP: 'info',
  FTPS: 'info',
  MBX: 'success',
  AS2: 'warning',
  SFTP: 'neutral',
  HTTPS: 'primary',
};

function initialRowState(row: UncategorizedSystem): RowState {
  // Business name pre-fills from suggestion when tier allows. Internal/external is
  // NEVER pre-filled — it's a permissions-stakes decision that must be made deliberately.
  const tier = resolveTier(row.suggestion);
  const shouldPrefillName =
    tier === 'high' || tier === 'medium_corroborated' || tier === 'medium_conflicted';
  return {
    status: 'pending',
    businessName: shouldPrefillName ? row.suggestion?.businessName ?? null : null,
    internalExternal: null,
  };
}

function manualInitialRowState(): RowState {
  return { status: 'pending', businessName: null, internalExternal: null };
}

function tierTag(tier: Tier) {
  switch (tier) {
    case 'high':
      return <Tag label="High" variant="success" size="small" icon={<CheckCircleIcon fontSize="small" />} />;
    case 'medium_corroborated':
      return <Tag label="Medium" variant="warning" size="small" icon={<WarningAmberIcon fontSize="small" />} />;
    case 'medium_conflicted':
      return <Tag label="Conflict" variant="error" size="small" icon={<ErrorOutlineIcon fontSize="small" />} />;
    case 'low':
      return <Tag label="Low" variant="error" size="small" icon={<DangerousIcon fontSize="small" />} />;
    case 'none':
      return <Tag label="No signal" variant="neutral" size="small" icon={<HelpOutlineIcon fontSize="small" />} />;
  }
}

/**
 * Render a reasoning string with any quotedTokens emphasized in monospace.
 * Tokens are matched literally — the first occurrence of each token string
 * becomes a <code> span. This keeps the reasoning line readable at a glance
 * while making the actual matched text unambiguous.
 */
function RenderedReasoning({ suggestion }: { suggestion: Suggestion }) {
  const tokens = suggestion.quotedTokens ?? [];
  const text = suggestion.reasoning;
  if (tokens.length === 0) {
    return <Typography variant="caption">{text}</Typography>;
  }
  const values = Array.from(new Set(tokens.map((t) => t.value))).sort(
    (a, b) => b.length - a.length
  );
  const nodes: Array<string | ReactNode> = [text];
  for (const v of values) {
    const next: Array<string | ReactNode> = [];
    for (const chunk of nodes) {
      if (typeof chunk !== 'string') { next.push(chunk); continue; }
      const idx = chunk.indexOf(v);
      if (idx < 0) { next.push(chunk); continue; }
      if (idx > 0) next.push(chunk.slice(0, idx));
      next.push(
        <Box
          key={`tok-${v}-${next.length}`}
          component="code"
          sx={{
            fontFamily: 'monospace',
            bgcolor: 'grey.100',
            border: '1px solid',
            borderColor: 'grey.300',
            borderRadius: 0.5,
            px: 0.5,
            fontSize: 12,
          }}
        >
          {v}
        </Box>
      );
      const rest = chunk.slice(idx + v.length);
      if (rest) next.push(rest);
    }
    nodes.splice(0, nodes.length, ...next);
  }
  return (
    <Typography variant="caption" component="span" sx={{ lineHeight: 1.7 }}>
      {nodes.map((n, i) => (typeof n === 'string' ? <span key={i}>{n}</span> : n))}
    </Typography>
  );
}

function FilenameTokenList({ tokens }: { tokens: FilenameToken[] }) {
  if (tokens.length === 0) {
    return <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>No filename tokens observed.</Typography>;
  }
  return (
    <Stack spacing={0.25}>
      {tokens.map((t) => {
        const pct = t.totalTransfers > 0 ? Math.round((t.occurrences / t.totalTransfers) * 100) : 0;
        return (
          <Stack key={t.token} direction="row" spacing={1} alignItems="baseline">
            <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 12, bgcolor: 'grey.100', px: 0.5, borderRadius: 0.5 }}>
              {t.token}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {t.position} · {t.occurrences} of {t.totalTransfers} transfers ({pct}%)
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

function TransferGraphSummary({ edges }: { edges: TransferGraphEdge[] }) {
  if (edges.length === 0) {
    return <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>No transfer graph data.</Typography>;
  }
  const total = edges.reduce((s, e) => s + e.count, 0);
  const categorized = edges.filter((e) => e.counterpartyStatus !== 'uncategorized').reduce((s, e) => s + e.count, 0);
  const uncategorized = total - categorized;
  const top = [...edges].sort((a, b) => b.count - a.count).slice(0, 5);
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {total} transfers · {categorized} with categorized systems · {uncategorized} with uncategorized
      </Typography>
      <Stack spacing={0.25}>
        {top.map((e) => (
          <Stack key={e.counterpartyId} direction="row" spacing={1} alignItems="baseline">
            <Typography variant="caption" sx={{ fontFamily: 'monospace', minWidth: 180 }}>
              {e.counterpartyLabel}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {e.direction} · {e.count} transfers
              {e.counterpartyPartner ? ` · ${e.counterpartyPartner}` : ''}
              {e.counterpartyStatus === 'uncategorized' ? ' · uncategorized' : ''}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function SignalBreakdownPanel({ row }: { row: UncategorizedSystem }) {
  const tokens = row.filenameTokens ?? [];
  const edges = row.transferGraph ?? [];
  const connectionFields: Array<[string, string]> = [];
  connectionFields.push(['host', row.hostname]);
  if (row.directory) connectionFields.push(['directory', row.directory]);
  if (row.username) connectionFields.push(['username', row.username]);
  return (
    <Stack spacing={1.25} sx={{ py: 1 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Connection strings
        </Typography>
        <Stack spacing={0.25} sx={{ mt: 0.5 }}>
          {connectionFields.map(([k, v]) => (
            <Stack key={k} direction="row" spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>{k}</Typography>
              <Box component="code" sx={{ fontFamily: 'monospace', fontSize: 12, bgcolor: 'grey.100', px: 0.5, borderRadius: 0.5 }}>{v}</Box>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Filename patterns
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <FilenameTokenList tokens={tokens} />
        </Box>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Transfer graph
        </Typography>
        <Box sx={{ mt: 0.5 }}>
          <TransferGraphSummary edges={edges} />
        </Box>
      </Box>
    </Stack>
  );
}

function PermissionPreviewInline({
  permissionPreview,
  onReveal,
}: {
  permissionPreview: { visibleTo: string[]; hiddenFrom: string[] };
  onReveal?: () => void;
}) {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, fontSize: 12 }}
      onMouseEnter={onReveal}
      onFocus={onReveal}
      tabIndex={0}
      aria-label="Permission group preview"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>
          Visible to
        </Typography>
        {permissionPreview.visibleTo.map((g) => (
          <Chips key={g} label={g} size="small" variant="outlined" color="primary" />
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>
          Hidden from
        </Typography>
        {permissionPreview.hiddenFrom.map((g) => (
          <Chips key={g} label={g} size="small" variant="outlined" color="default" />
        ))}
      </Box>
    </Box>
  );
}

interface RowEditorProps {
  row?: UncategorizedSystem;
  state: RowState;
  showSuggestionFrame: boolean;
  onChange: (next: RowState) => void;
  partners: ExistingPartner[];
}

function BusinessNameEditor({ row, state, showSuggestionFrame, onChange, partners }: RowEditorProps) {
  const [input, setInput] = useState(state.businessName ?? '');
  useEffect(() => {
    setInput(state.businessName ?? '');
  }, [state.businessName]);
  const sortedPartners = useMemo(() => {
    if (!row) return partners.map((p) => p.name);
    const withWeights = partners.map((p) => ({
      name: p.name,
      weight: graphWeightForPartner(row, p.name),
    }));
    withWeights.sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      return a.name.localeCompare(b.name);
    });
    return withWeights.map((p) => p.name);
  }, [partners, row]);

  return (
    <Autocomplete
      size="small"
      freeSolo
      options={sortedPartners}
      value={state.businessName ?? ''}
      inputValue={input}
      onInputChange={(_, v) => setInput(v)}
      onChange={(_, v) => onChange({ ...state, businessName: v ?? null })}
      onBlur={() => onChange({ ...state, businessName: input.trim() ? input.trim() : null })}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={showSuggestionFrame ? 'Suggested partner' : 'Business name'}
          variant="outlined"
          size="small"
        />
      )}
      sx={{ minWidth: 220 }}
    />
  );
}

function InternalExternalControl({
  row,
  value,
  onChange,
  isManual,
}: {
  row: UncategorizedSystem;
  value: InternalExternal | null;
  onChange: (v: InternalExternal | null) => void;
  isManual: boolean;
}) {
  const lean = isManual ? null : internalExternalLean(row);
  return (
    <Stack spacing={0.25}>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={value}
        onChange={(_, v: InternalExternal | null) => onChange(v)}
      >
        <MuiToggleButton value="external" sx={{ textTransform: 'none', px: 1.5 }}>External</MuiToggleButton>
        <MuiToggleButton value="internal" sx={{ textTransform: 'none', px: 1.5 }}>Internal</MuiToggleButton>
      </ToggleButtonGroup>
      {lean && value === null && (
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Transfer patterns suggest: {lean.type === 'internal' ? 'Internal' : 'External'} ({lean.percent}% of exchanges)
        </Typography>
      )}
    </Stack>
  );
}

function CalibrationControl({
  value,
  onChange,
}: {
  value: Calibration | null;
  onChange: (v: Calibration) => void;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" color="text.secondary">How sure?</Typography>
      <ToggleButtonGroup
        size="small"
        exclusive
        value={value}
        onChange={(_, v) => v && onChange(v as Calibration)}
      >
        <MuiToggleButton value="high" sx={{ textTransform: 'none', px: 1 }}>High</MuiToggleButton>
        <MuiToggleButton value="medium" sx={{ textTransform: 'none', px: 1 }}>Med</MuiToggleButton>
        <MuiToggleButton value="low" sx={{ textTransform: 'none', px: 1 }}>Low</MuiToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default function PartnersCategorize() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode: 'prototype' | 'manual' = searchParams.get('mode') === 'manual' ? 'manual' : 'prototype';
  const isManual = mode === 'manual';

  const session = useCategorizationSession({ mode });

  const [rowStates, setRowStates] = useState<Record<string, RowState>>(() => {
    const map: Record<string, RowState> = {};
    for (const r of allRows) {
      map[r.id] = isManual ? manualInitialRowState() : initialRowState(r);
    }
    return map;
  });
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [expandedRowReasoning, setExpandedRowReasoning] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | Tier>('all');
  const [protocolFilter, setProtocolFilter] = useState<'all' | string>('all');
  const [groupingAxis, setGroupingAxis] = useState<GroupingAxis>('filename_token');
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const [bulkCalibration, setBulkCalibration] = useState<Calibration | null>(null);
  const [ineligibleMsg, setIneligibleMsg] = useState<string | null>(null);
  const [undoOpen, setUndoOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const rowById = useMemo(() => {
    const m = new Map<string, UncategorizedSystem>();
    for (const r of allRows) m.set(r.id, r);
    return m;
  }, []);

  const { zone1, zone2 } = useMemo(
    () => (isManual ? { zone1: [] as UncategorizedSystem[], zone2: allRows } : splitZones(allRows)),
    [isManual]
  );

  const filteredZone2 = useMemo(() => {
    return zone2.filter((r) => {
      if (searchValue) {
        const q = searchValue.toLowerCase();
        if (
          !r.hostname.toLowerCase().includes(q) &&
          !(r.domainRoot ?? '').toLowerCase().includes(q) &&
          !(r.suggestion?.businessName ?? '').toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (!isManual && tierFilter !== 'all') {
        if (!r.suggestion || resolveTier(r.suggestion) !== tierFilter) return false;
      }
      if (protocolFilter !== 'all' && r.protocol !== protocolFilter) return false;
      return true;
    });
  }, [zone2, searchValue, tierFilter, protocolFilter, isManual]);

  const grouped = useMemo(
    () => (isManual ? { groups: [], singletons: filteredZone2 } : groupRows(filteredZone2, groupingAxis)),
    [filteredZone2, isManual, groupingAxis]
  );

  const totalCount = allRows.length;
  const pendingCount = useMemo(
    () => Object.values(rowStates).filter((s) => s.status === 'pending').length,
    [rowStates]
  );
  const remaining = pendingCount;

  const updateRowState = useCallback((rowId: string, updater: (prev: RowState) => RowState) => {
    setRowStates((prev) => ({ ...prev, [rowId]: updater(prev[rowId]) }));
  }, []);

  const commitRow = useCallback(
    (rowId: string, outcome: OutcomeBucket, overrides?: Partial<RowState>) => {
      const row = rowById.get(rowId);
      if (!row) return;
      const prev = rowStates[rowId];
      const next: RowState = {
        ...prev,
        status: outcome === 'rejected' ? 'rejected' : outcome === 'skipped' ? 'skipped' : 'accepted',
        ...overrides,
      };
      setRowStates((cur) => ({ ...cur, [rowId]: next }));
      session.commitDecision({
        rowId,
        suggestion: row.suggestion,
        outcome,
        finalBusinessName: next.businessName,
        finalInternalExternal: next.internalExternal,
      });
    },
    [rowById, rowStates, session]
  );

  const handleAccept = useCallback(
    (rowId: string) => {
      const row = rowById.get(rowId);
      const state = rowStates[rowId];
      if (!row) return;
      const originalSuggestion = row.suggestion;
      const editedVsSuggestion =
        !!originalSuggestion &&
        (state.businessName !== originalSuggestion.businessName ||
          state.internalExternal !== originalSuggestion.internalExternal);
      const outcome: OutcomeBucket = !originalSuggestion
        ? 'manually_categorized_no_suggestion'
        : editedVsSuggestion
        ? 'edited_then_accepted'
        : 'accepted_as_is';
      commitRow(rowId, outcome);
    },
    [commitRow, rowById, rowStates]
  );

  const handleReject = useCallback(
    (rowId: string) => {
      commitRow(rowId, 'rejected', { businessName: null, internalExternal: null });
    },
    [commitRow]
  );

  const handleSkip = useCallback(
    (rowId: string) => {
      commitRow(rowId, 'skipped');
    },
    [commitRow]
  );

  const toggleReasoning = useCallback(
    (rowId: string) => {
      const row = rowById.get(rowId);
      setExpandedRowReasoning((prev) => {
        const next = new Set(prev);
        if (next.has(rowId)) next.delete(rowId);
        else {
          next.add(rowId);
          if (row) session.markReasoningOpened(rowId, row.suggestion);
        }
        return next;
      });
    },
    [rowById, session]
  );

  const toggleGroup = useCallback((key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const isBulkEligible = useCallback(
    (row: UncategorizedSystem) => resolveTier(row.suggestion) === 'high',
    []
  );

  const toggleRowSelected = useCallback(
    (rowId: string, checked: boolean) => {
      const row = rowById.get(rowId);
      if (checked && row && !isBulkEligible(row)) {
        setIneligibleMsg(
          'Only High-tier rows are eligible for bulk confirmation. Review individually — the signal model needs human judgment for Medium and below.'
        );
        return;
      }
      setSelection((prev) => {
        const next = new Set(prev);
        if (checked) next.add(rowId);
        else next.delete(rowId);
        return next;
      });
    },
    [rowById, isBulkEligible]
  );

  const toggleGroupSelected = useCallback(
    (rowIds: string[], checked: boolean) => {
      let skipped = 0;
      setSelection((prev) => {
        const next = new Set(prev);
        for (const id of rowIds) {
          const row = rowById.get(id);
          if (checked) {
            if (row && !isBulkEligible(row)) { skipped += 1; continue; }
            next.add(id);
          } else {
            next.delete(id);
          }
        }
        return next;
      });
      if (checked && skipped > 0) {
        setIneligibleMsg(
          `Excluded ${skipped} row${skipped === 1 ? '' : 's'} from bulk selection — only High-tier rows can be bulk-confirmed.`
        );
      }
    },
    [rowById, isBulkEligible]
  );

  const selectionIds = useMemo(() => Array.from(selection), [selection]);
  const hasSelection = selection.size > 0;

  const permissionDelta = useMemo(() => {
    const add = new Set<string>();
    const hide = new Set<string>();
    for (const id of selectionIds) {
      const r = rowById.get(id);
      if (!r) continue;
      r.permissionPreview.visibleTo.forEach((g) => add.add(g));
      r.permissionPreview.hiddenFrom.forEach((g) => hide.add(g));
    }
    return { add: Array.from(add), hide: Array.from(hide) };
  }, [selectionIds, rowById]);

  const bulkConfirm = useCallback(() => {
    for (const id of selectionIds) {
      const state = rowStates[id];
      if (!state) continue;
      const row = rowById.get(id);
      const originalSuggestion = row?.suggestion ?? null;
      const editedVsSuggestion =
        !!originalSuggestion &&
        (state.businessName !== originalSuggestion.businessName ||
          state.internalExternal !== originalSuggestion.internalExternal);
      const outcome: OutcomeBucket = !originalSuggestion
        ? 'manually_categorized_no_suggestion'
        : editedVsSuggestion
        ? 'edited_then_accepted'
        : 'accepted_as_is';
      commitRow(id, outcome);
    }
    session.recordBulk({
      at: Date.now(),
      count: selectionIds.length,
      selectionIds,
      calibration: bulkCalibration,
    });
    setSelection(new Set());
    setBulkModalOpen(false);
    setBulkCalibration(null);
  }, [bulkCalibration, commitRow, rowById, rowStates, selectionIds, session]);

  const handleFinishApply = useCallback(() => {
    session.finalizeSession();
    setFinishModalOpen(false);
    setUndoOpen(true);
  }, [session]);

  const tierOptions: FilterOption[] = isManual
    ? []
    : [
        {
          id: 'tier',
          label: 'Confidence',
          value: tierFilter,
          options: [
            { value: 'all', label: 'All' },
            { value: 'high', label: 'High' },
            { value: 'medium_corroborated', label: 'Medium' },
            { value: 'medium_conflicted', label: 'Conflict' },
            { value: 'low', label: 'Low' },
            { value: 'none', label: 'No signal' },
          ],
        },
      ];
  const protocolOptions: FilterOption[] = [
    {
      id: 'protocol',
      label: 'Protocol',
      value: protocolFilter,
      options: [
        { value: 'all', label: 'All' },
        ...Array.from(new Set(allRows.map((r) => r.protocol))).map((p) => ({ value: p, label: p })),
      ],
    },
  ];
  const filterOptions: FilterOption[] = [...tierOptions, ...protocolOptions];

  const activeFilters: ActiveFilter[] = [];
  if (!isManual && tierFilter !== 'all') {
    activeFilters.push({
      id: `tier-${tierFilter}`,
      filterId: 'tier',
      label: 'Confidence',
      value: tierLabel(tierFilter as Tier),
    });
  }
  if (protocolFilter !== 'all') {
    activeFilters.push({
      id: `proto-${protocolFilter}`,
      filterId: 'protocol',
      label: 'Protocol',
      value: protocolFilter,
    });
  }

  const bulkLabel = hasSelection ? `Confirm ${selection.size} selected` : 'Confirm selected';

  const finishGated = pendingCount > 0;

  return (
    <PageLayout selectedNavItem="partners">
      <Stack spacing={2} sx={{ pb: 10 }}>
        <PageHeader
          title="Categorize uncategorized systems"
          showBreadcrumb
          breadcrumbLabel="Partners"
          onBreadcrumbClick={() => navigate('/partners')}
          showInfoIcon={!isManual}
          onInfoClick={() => setAboutOpen(true)}
          refreshStatus={isManual ? '' : `${totalCount} systems · ${remaining} remaining`}
        />

        {!isManual && (
          <Alert
            icon={<InfoOutlinedIcon fontSize="small" />}
            severity="info"
            sx={{ alignItems: 'center' }}
            action={
              <Button
                size="small"
                variant="text"
                startIcon={<DownloadIcon fontSize="small" />}
                onClick={session.exportSessionJson}
              >
                Export log
              </Button>
            }
          >
            Suggestions use three signals: connection strings, filename patterns, and transfer graph.
            Every categorization needs your confirmation — nothing auto-commits. Press
            &nbsp;<kbd style={{ padding: '1px 4px', border: '1px solid #ccc', borderRadius: 3 }}>Cmd/Ctrl</kbd>
            &nbsp;+&nbsp;<kbd style={{ padding: '1px 4px', border: '1px solid #ccc', borderRadius: 3 }}>Shift</kbd>
            &nbsp;+&nbsp;<kbd style={{ padding: '1px 4px', border: '1px solid #ccc', borderRadius: 3 }}>E</kbd>
            &nbsp;to export instrumentation.
          </Alert>
        )}

        {!isManual && zone1.length > 0 && (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Needs attention
              </Typography>
              <Chips label={`${zone1.length}`} size="small" variant="filled" color="warning" />
              <Typography variant="caption" color="text.secondary">
                Low or unknown signal — review individually.
              </Typography>
            </Stack>
            <Stack spacing={1.25}>
              {zone1.map((row) => (
                <NeedsAttentionCard
                  key={row.id}
                  row={row}
                  state={rowStates[row.id]}
                  existingPartners={existingPartners}
                  reasoningOpen={expandedRowReasoning.has(row.id)}
                  onToggleReasoning={() => toggleReasoning(row.id)}
                  onChange={(next) => updateRowState(row.id, () => next)}
                  onFocus={() => session.markRowFocused(row.id, row.suggestion)}
                  onRevealPermissions={() => session.markPermissionOpened(row.id, row.suggestion)}
                  onAccept={() => handleAccept(row.id)}
                  onReject={() => handleReject(row.id)}
                  onSkip={() => handleSkip(row.id)}
                  onCalibrate={(v) => session.setCalibration(row.id, v)}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Box>
          {!isManual && (
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Suggested categorizations
              </Typography>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel id="grouping-axis-label">Group by</InputLabel>
                <Select
                  labelId="grouping-axis-label"
                  label="Group by"
                  value={groupingAxis}
                  onChange={(e) => setGroupingAxis(e.target.value as GroupingAxis)}
                >
                  <MenuItem value="filename_token">Shared filename token</MenuItem>
                  <MenuItem value="host_root">Shared host root</MenuItem>
                  <MenuItem value="graph_neighborhood">Shared transfer-graph neighborhood</MenuItem>
                  <MenuItem value="none">Ungrouped</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
          <FilterControls
            search={{
              value: searchValue,
              onChange: setSearchValue,
              placeholder: 'Search hostname, domain, or partner',
            }}
            filters={filterOptions}
            onFilterChange={(filterId, value) => {
              if (filterId === 'tier') setTierFilter(value as 'all' | Tier);
              if (filterId === 'protocol') setProtocolFilter(value as string);
            }}
            activeFilters={activeFilters}
            onFilterRemove={(filterId) => {
              if (filterId === 'tier') setTierFilter('all');
              if (filterId === 'protocol') setProtocolFilter('all');
            }}
            onClearAll={() => {
              setTierFilter('all');
              setProtocolFilter('all');
            }}
            clearAllLabel="Reset filters"
            resultCount={`${filteredZone2.length} results`}
            actions={{
              secondary: {
                label: bulkLabel,
                disabled: !hasSelection,
                options: hasSelection ? [{ value: 'confirm', label: bulkLabel }] : [],
                onSelect: (v) => { if (v === 'confirm') setBulkModalOpen(true); },
              },
            }}
          />
        </Box>

        {ineligibleMsg && (
          <Alert severity="warning" onClose={() => setIneligibleMsg(null)}>
            {ineligibleMsg}
          </Alert>
        )}

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
          <MuiTable size="small">
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: 48 }}>
                  <Checkbox
                    size="small"
                    checked={
                      filteredZone2.length > 0 &&
                      filteredZone2.filter(isBulkEligible).every((r) => selection.has(r.id)) &&
                      filteredZone2.some(isBulkEligible)
                    }
                    indeterminate={
                      selection.size > 0 &&
                      !filteredZone2.filter(isBulkEligible).every((r) => selection.has(r.id))
                    }
                    onChange={(_, checked) => {
                      if (checked) toggleGroupSelected(filteredZone2.map((r) => r.id), true);
                      else setSelection(new Set());
                    }}
                  />
                </TableCell>
                {!isManual && <TableCell sx={{ minWidth: 110 }}>Confidence</TableCell>}
                <TableCell sx={{ minWidth: 240 }}>Hostname</TableCell>
                <TableCell sx={{ minWidth: 80 }}>Protocol</TableCell>
                <TableCell sx={{ minWidth: 240 }}>Business name</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Type</TableCell>
                {!isManual && <TableCell sx={{ minWidth: 320 }}>Reasoning</TableCell>}
                {!isManual && <TableCell sx={{ minWidth: 260 }}>Permission impact</TableCell>}
                <TableCell align="right" sx={{ minWidth: 180 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grouped.groups.map((g) => {
                const memberIds = g.rows.map((r) => r.id);
                const eligibleIds = g.rows.filter(isBulkEligible).map((r) => r.id);
                const allSelected = eligibleIds.length > 0 && eligibleIds.every((id) => selection.has(id));
                const someSelected = eligibleIds.some((id) => selection.has(id));
                const isOpen = expandedGroups.has(g.key);
                const highCount = g.tierCounts.high;
                const conflictCount = g.tierCounts.medium_conflicted;
                return (
                  <Fragment key={g.key}>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={allSelected}
                          indeterminate={!allSelected && someSelected}
                          disabled={eligibleIds.length === 0}
                          onChange={(_, checked) => toggleGroupSelected(memberIds, checked)}
                        />
                      </TableCell>
                      <TableCell colSpan={isManual ? 6 : 8} onClick={() => toggleGroup(g.key)} sx={{ cursor: 'pointer' }}>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                          <IconButton size="small" aria-label={isOpen ? 'Collapse group' : 'Expand group'}>
                            {isOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                          </IconButton>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {g.label}
                          </Typography>
                          <Chips label={`${g.rows.length} systems`} size="small" variant="outlined" />
                          {g.dominantSuggestion && (
                            <Chips label={`Dominant: ${g.dominantSuggestion}`} size="small" variant="outlined" color="primary" />
                          )}
                          {highCount > 0 && (
                            <Chips label={`${highCount} High`} size="small" variant="outlined" color="success" />
                          )}
                          {conflictCount > 0 && (
                            <Chips label={`${conflictCount} Conflict`} size="small" variant="outlined" color="warning" />
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                    {isOpen &&
                      g.rows.map((row) => (
                        <SuggestedRow
                          key={row.id}
                          row={row}
                          isManual={isManual}
                          state={rowStates[row.id]}
                          selected={selection.has(row.id)}
                          bulkEligible={isBulkEligible(row)}
                          onSelect={(checked) => toggleRowSelected(row.id, checked)}
                          reasoningOpen={expandedRowReasoning.has(row.id)}
                          onToggleReasoning={() => toggleReasoning(row.id)}
                          onChange={(next) => updateRowState(row.id, () => next)}
                          onFocus={() => session.markRowFocused(row.id, row.suggestion)}
                          onRevealPermissions={() => session.markPermissionOpened(row.id, row.suggestion)}
                          onAccept={() => handleAccept(row.id)}
                          onReject={() => handleReject(row.id)}
                          onSkip={() => handleSkip(row.id)}
                          indent
                        />
                      ))}
                  </Fragment>
                );
              })}
              {grouped.singletons.map((row) => (
                <SuggestedRow
                  key={row.id}
                  row={row}
                  isManual={isManual}
                  state={rowStates[row.id]}
                  selected={selection.has(row.id)}
                  bulkEligible={isBulkEligible(row)}
                  onSelect={(checked) => toggleRowSelected(row.id, checked)}
                  reasoningOpen={expandedRowReasoning.has(row.id)}
                  onToggleReasoning={() => toggleReasoning(row.id)}
                  onChange={(next) => updateRowState(row.id, () => next)}
                  onFocus={() => session.markRowFocused(row.id, row.suggestion)}
                  onRevealPermissions={() => session.markPermissionOpened(row.id, row.suggestion)}
                  onAccept={() => handleAccept(row.id)}
                  onReject={() => handleReject(row.id)}
                  onSkip={() => handleSkip(row.id)}
                />
              ))}
              {filteredZone2.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isManual ? 6 : 9} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      {isManual ? 'No systems to review.' : 'No systems match the current filters.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </MuiTable>
        </Box>
      </Stack>

      <Box
        aria-live="polite"
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {totalCount - pendingCount} of {totalCount} categorized · {pendingCount} remaining
          </Typography>
          {hasSelection && (
            <Chips label={`${selection.size} selected`} size="small" variant="filled" color="primary" />
          )}
          {(tierFilter !== 'all' || protocolFilter !== 'all' || searchValue) && (
            <Typography variant="caption" color="text.secondary">
              Filters active
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          {hasSelection && (
            <Button variant="outlined" color="primary" onClick={() => setBulkModalOpen(true)}>
              {bulkLabel}
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            disabled={finishGated}
            onClick={() => setFinishModalOpen(true)}
          >
            Finish & Apply
          </Button>
        </Stack>
      </Box>

      <Modal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        title="Confirm bulk categorization"
        maxWidth="md"
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="text" color="secondary" onClick={() => setBulkModalOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={bulkConfirm}>
              Confirm {selection.size} systems
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2}>
          <Typography variant="body2">
            You're about to apply categorizations to <strong>{selection.size} High-tier systems</strong>. Review the permission consequences below before confirming.
          </Typography>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Permission group deltas</Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>+ Visible to:</Typography>
              {permissionDelta.add.length === 0 && <Typography variant="caption">(none)</Typography>}
              {permissionDelta.add.map((g) => (
                <Chips key={`add-${g}`} label={g} size="small" variant="outlined" color="primary" />
              ))}
            </Stack>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>− Hidden from:</Typography>
              {permissionDelta.hide.length === 0 && <Typography variant="caption">(none)</Typography>}
              {permissionDelta.hide.map((g) => (
                <Chips key={`hide-${g}`} label={g} size="small" variant="outlined" color="default" />
              ))}
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ maxHeight: 220, overflowY: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Systems being confirmed</Typography>
            <Stack spacing={0.5}>
              {selectionIds.map((id) => {
                const r = rowById.get(id);
                const s = rowStates[id];
                if (!r) return null;
                return (
                  <Stack key={id} direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', minWidth: 220 }}>
                      {r.hostname}
                    </Typography>
                    <Typography variant="caption">→ {s?.businessName ?? '(none)'}</Typography>
                    {s?.internalExternal && (
                      <Tag
                        label={s.internalExternal === 'external' ? 'External' : 'Internal'}
                        variant="neutral"
                        size="small"
                        hideIcon
                      />
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </Box>
          <Divider />
          <CalibrationControl value={bulkCalibration} onChange={setBulkCalibration} />
        </Stack>
      </Modal>

      <Modal
        open={finishModalOpen}
        onClose={() => setFinishModalOpen(false)}
        title="Finish & Apply all categorizations"
        maxWidth="sm"
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="text" color="secondary" onClick={() => setFinishModalOpen(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleFinishApply}>
              Apply
            </Button>
          </Stack>
        }
      >
        <Typography variant="body2">
          {pendingCount === 0
            ? `All ${totalCount} systems are resolved. Apply to commit.`
            : `${pendingCount} systems are still pending. Mark them as skipped to proceed.`}
        </Typography>
      </Modal>

      <Modal
        open={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title="About this prototype"
        maxWidth="sm"
        actions={<Button variant="contained" color="primary" onClick={() => setAboutOpen(false)}>Got it</Button>}
      >
        <Stack spacing={1.5}>
          <Typography variant="body2">
            Suggestions draw on three signals Syncrofy actually has: <strong>connection strings</strong> (host, directory, username), <strong>filename patterns</strong> (stable prefix/suffix/embedded tokens), and the <strong>transfer graph</strong> (who-talks-to-whom and how often).
          </Typography>
          <Typography variant="body2">
            Transfer graph alone never justifies a High-tier pre-fill — it can corroborate a naming signal, act as a tiebreaker, or hint at Internal/External, but it never originates a name. This prevents past mistakes from propagating.
          </Typography>
          <Typography variant="body2">
            Low and No-signal rows appear in <strong>Needs attention</strong> above. Only High-tier rows are eligible for bulk confirmation. Internal/External is never pre-filled; when graph patterns skew ≥80% one way, the row shows a soft hint, not a selection.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mode: prototype · Press Cmd/Ctrl + Shift + E to export the session log.
          </Typography>
        </Stack>
      </Modal>

      <SnackBar
        open={undoOpen}
        onClose={() => setUndoOpen(false)}
        severity="success"
        autoHideDuration={30000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={
          <Stack direction="row" spacing={2} alignItems="center">
            <span>Categorizations applied.</span>
            <Link
              component="button"
              onClick={() => setUndoOpen(false)}
              sx={{ color: 'inherit', fontWeight: 600 }}
            >
              Undo
            </Link>
          </Stack>
        }
      />
    </PageLayout>
  );
}

interface SuggestedRowProps {
  row: UncategorizedSystem;
  isManual: boolean;
  state: RowState;
  selected: boolean;
  bulkEligible: boolean;
  onSelect: (checked: boolean) => void;
  reasoningOpen: boolean;
  onToggleReasoning: () => void;
  onChange: (next: RowState) => void;
  onFocus: () => void;
  onRevealPermissions: () => void;
  onAccept: () => void;
  onReject: () => void;
  onSkip: () => void;
  indent?: boolean;
}

function SuggestedRow(props: SuggestedRowProps) {
  const {
    row,
    isManual,
    state,
    selected,
    bulkEligible,
    onSelect,
    reasoningOpen,
    onToggleReasoning,
    onChange,
    onFocus,
    onRevealPermissions,
    onAccept,
    onReject,
    onSkip,
    indent,
  } = props;
  const disabled = state.status !== 'pending';
  const tier = resolveTier(row.suggestion);
  const isConflicted = tier === 'medium_conflicted';

  return (
    <>
      <TableRow
        hover
        onFocus={onFocus}
        onClick={onFocus}
        sx={{
          opacity: disabled ? 0.55 : 1,
          '& > td': indent ? { pl: 3 } : undefined,
          ...(isConflicted && !isManual
            ? {
                borderLeft: '3px solid',
                borderLeftColor: 'warning.main',
                bgcolor: 'rgba(237, 108, 2, 0.04)',
              }
            : {}),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            size="small"
            checked={selected}
            disabled={disabled || !bulkEligible}
            title={!bulkEligible ? 'Not eligible for bulk — review individually' : undefined}
            onChange={(_, checked) => onSelect(checked)}
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
        {!isManual && (
          <TableCell>{tierTag(tier)}</TableCell>
        )}
        <TableCell>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 13 }}>
            {row.hostname}
          </Typography>
        </TableCell>
        <TableCell>
          <Tag
            label={row.protocol}
            variant={PROTOCOL_TAG_VARIANT[row.protocol] ?? 'neutral'}
            size="small"
            hideIcon
          />
        </TableCell>
        <TableCell>
          <BusinessNameEditor
            row={row}
            state={state}
            showSuggestionFrame={!isManual && !!row.suggestion}
            partners={existingPartners}
            onChange={onChange}
          />
        </TableCell>
        <TableCell>
          <InternalExternalControl
            row={row}
            value={state.internalExternal}
            onChange={(v) => onChange({ ...state, internalExternal: v })}
            isManual={isManual}
          />
        </TableCell>
        {!isManual && (
          <TableCell>
            {row.suggestion ? (
              <Stack direction="row" spacing={0.5} alignItems="flex-start">
                <Box sx={{ flex: 1, maxWidth: 340 }}>
                  <RenderedReasoning suggestion={row.suggestion} />
                </Box>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleReasoning(); }}>
                  {reasoningOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
              </Stack>
            ) : (
              <Typography variant="caption" color="text.secondary">—</Typography>
            )}
          </TableCell>
        )}
        {!isManual && (
          <TableCell>
            <PermissionPreviewInline
              permissionPreview={row.permissionPreview}
              onReveal={onRevealPermissions}
            />
          </TableCell>
        )}
        <TableCell align="right">
          <RowActionButtons
            status={state.status}
            onAccept={onAccept}
            onReject={onReject}
            onSkip={onSkip}
          />
        </TableCell>
      </TableRow>
      {reasoningOpen && (
        <TableRow>
          <TableCell colSpan={isManual ? 6 : 9} sx={{ bgcolor: 'grey.50' }}>
            <Collapse in={reasoningOpen} unmountOnExit>
              <SignalBreakdownPanel row={row} />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function RowActionButtons({
  status,
  onAccept,
  onReject,
  onSkip,
}: {
  status: RowState['status'];
  onAccept: () => void;
  onReject: () => void;
  onSkip: () => void;
}) {
  if (status === 'accepted') {
    return (
      <Tag label="Accepted" variant="success" size="small" icon={<CheckCircleIcon fontSize="small" />} />
    );
  }
  if (status === 'rejected') {
    return <Tag label="Rejected" variant="error" size="small" icon={<DangerousIcon fontSize="small" />} />;
  }
  if (status === 'skipped') {
    return <Tag label="Skipped" variant="neutral" size="small" icon={<SkipNextIcon fontSize="small" />} />;
  }
  return (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <IconButton size="small" onClick={onAccept} aria-label="Accept" color="success">
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onReject} aria-label="Reject" color="error">
        <CloseIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onSkip} aria-label="Skip">
        <SkipNextIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

interface NeedsAttentionCardProps {
  row: UncategorizedSystem;
  state: RowState;
  existingPartners: ExistingPartner[];
  reasoningOpen: boolean;
  onToggleReasoning: () => void;
  onChange: (next: RowState) => void;
  onFocus: () => void;
  onRevealPermissions: () => void;
  onAccept: () => void;
  onReject: () => void;
  onSkip: () => void;
  onCalibrate: (v: Calibration) => void;
}

function NeedsAttentionCard(props: NeedsAttentionCardProps) {
  const {
    row,
    state,
    existingPartners: partners,
    reasoningOpen,
    onToggleReasoning,
    onChange,
    onFocus,
    onRevealPermissions,
    onAccept,
    onReject,
    onSkip,
    onCalibrate,
  } = props;

  const conflict = detectConflict(row, partners);
  const disabled = state.status !== 'pending';
  const suggestion: Suggestion | null = row.suggestion;
  const tier = resolveTier(suggestion);

  return (
    <Box
      onFocus={onFocus}
      onClick={onFocus}
      tabIndex={0}
      sx={{
        border: '1px solid',
        borderColor: conflict ? 'warning.main' : 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        p: 2,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {tierTag(tier)}
            <Tag
              label={row.protocol}
              variant={PROTOCOL_TAG_VARIANT[row.protocol] ?? 'neutral'}
              size="small"
              hideIcon
            />
            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {row.hostname}
            </Typography>
            {conflict && (
              <Chips
                label={`Conflicts with: ${conflict.conflictsWith.name}`}
                size="small"
                variant="outlined"
                color="warning"
                icon={<WarningAmberIcon fontSize="small" />}
              />
            )}
          </Stack>

          {suggestion && (
            <Box>
              <Stack direction="row" alignItems="flex-start" spacing={0.5}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                  Reasoning:
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <RenderedReasoning suggestion={suggestion} />
                </Box>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleReasoning(); }}>
                  {reasoningOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
              </Stack>
              <Collapse in={reasoningOpen} unmountOnExit>
                <Box sx={{ mt: 0.5, pl: 1, borderLeft: '2px solid', borderLeftColor: 'divider' }}>
                  <SignalBreakdownPanel row={row} />
                </Box>
              </Collapse>
            </Box>
          )}

          {!suggestion && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  No suggestion — inspect raw signals to decide.
                </Typography>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggleReasoning(); }}>
                  {reasoningOpen ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
              </Stack>
              <Collapse in={reasoningOpen} unmountOnExit>
                <Box sx={{ mt: 0.5, pl: 1, borderLeft: '2px solid', borderLeftColor: 'divider' }}>
                  <SignalBreakdownPanel row={row} />
                </Box>
              </Collapse>
            </Box>
          )}

          <Stack direction="row" spacing={1} alignItems="flex-start" flexWrap="wrap">
            <BusinessNameEditor
              row={row}
              state={state}
              showSuggestionFrame={!!suggestion}
              partners={partners}
              onChange={onChange}
            />
            <InternalExternalControl
              row={row}
              value={state.internalExternal}
              onChange={(v) => onChange({ ...state, internalExternal: v })}
              isManual={false}
            />
            {conflict && (
              <Button
                size="small"
                variant="outlined"
                color="warning"
                startIcon={<LinkIcon fontSize="small" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ ...state, businessName: conflict.conflictsWith.name });
                }}
              >
                Link to existing: {conflict.conflictsWith.name}
              </Button>
            )}
          </Stack>

          <PermissionPreviewInline
            permissionPreview={row.permissionPreview}
            onReveal={onRevealPermissions}
          />
        </Stack>
        <Stack spacing={1} alignItems="flex-end">
          {state.status === 'pending' ? (
            <Stack direction="row" spacing={0.5}>
              <Button size="small" variant="contained" color="primary" startIcon={<CheckIcon fontSize="small" />} onClick={onAccept}>
                Accept
              </Button>
              <IconButton size="small" onClick={onReject} aria-label="Reject" color="error">
                <CloseIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onSkip} aria-label="Skip">
                <SkipNextIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <RowActionButtons status={state.status} onAccept={onAccept} onReject={onReject} onSkip={onSkip} />
          )}
          {state.status === 'accepted' && (
            <CalibrationControl
              value={null}
              onChange={onCalibrate}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
