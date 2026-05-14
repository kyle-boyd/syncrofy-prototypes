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
  Chip,
  Checkbox,
} from '@mui/material';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { PriorityChip } from '../components/PriorityChip';
import {
  RecommendationCard,
  type RecommendationDisplayState,
} from '../ai/RecommendationCard';
import { inboxRecommendations, type InboxRecommendation } from '../ai/inboxRecommendations';
import { exceptions, type Exception } from '../fixtures/exceptions';
import { partners, partnersById } from '../fixtures/partners';
import { computePriority } from '../lib/priority';
import { formatTimeToBreach, type TimeSeverity } from '../lib/time';
import { BulkActionBar, type BulkConfirmation } from '../components/bulk/BulkActionBar';
import { ApplySuggestedDrawer, type DrawerRow } from '../components/bulk/ApplySuggestedDrawer';
import {
  recommendations,
  type Recommendation,
  type RecommendationType,
} from '../fixtures/recommendations';
import { useUncategorizedSenders } from '../lib/uncategorizedStore';
import type { ConfidenceLabel, UncategorizedSender } from '../types/uncategorized';
import { ChevronRight, Info } from 'lucide-react';

const ME = 'Priya Natarajan';

type AssignmentScope = 'all' | 'mine' | 'unassigned';
type SortKey = 'priority' | 'severity' | 'ttb' | 'newest';
type BulkActionKind = 'reassign' | 'snooze' | 'resolve' | 'apply-suggested';

const TTB_COLOR: Record<TimeSeverity, string> = {
  critical: 'error.main',
  warn: 'warning.main',
  neutral: 'text.primary',
};

const DOC_TYPES: Exception['ediDocType'][] = ['850', '855', '856', '810', '940', '997'];

const GRID_COLUMNS =
  '40px 56px minmax(0, 2.4fr) minmax(0, 1.2fr) 64px 110px 140px minmax(360px, 1.6fr)';

interface RowProps {
  ex: Exception;
  score: number;
  state: RecommendationDisplayState;
  selected: boolean;
  selectionActive: boolean;
  onToggleSelect: (e: React.MouseEvent | React.ChangeEvent | null, shiftKey: boolean) => void;
  onCommit: () => void;
  onDismiss: () => void;
  onUndo: () => void;
  onExpire: () => void;
}

function InboxRow({
  ex,
  score,
  state,
  selected,
  selectionActive,
  onToggleSelect,
  onCommit,
  onDismiss,
  onUndo,
  onExpire,
}: RowProps) {
  const navigate = useNavigate();
  const partner = partnersById[ex.partnerId];
  const ttb = formatTimeToBreach(ex.breachInMinutes);
  const rec = inboxRecommendations[ex.id];

  const open = () => navigate(`/supplychainoverhaul/exception/${ex.id}`);
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          open();
        } else if (e.key === ' ') {
          e.preventDefault();
          onToggleSelect(null, e.shiftKey);
        }
      }}
      sx={{
        display: 'grid',
        gridTemplateColumns: GRID_COLUMNS,
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        transition: 'background-color 80ms ease',
        outline: 'none',
        bgcolor: selected ? 'action.selected' : 'transparent',
        boxShadow: selected
          ? (t) => `inset 3px 0 0 0 ${t.palette.primary.main}`
          : 'none',
        '&:hover': { bgcolor: selected ? 'action.selected' : 'grey.50' },
        '&:focus-visible': {
          bgcolor: selected ? 'action.selected' : 'grey.50',
          boxShadow: (t) => `inset 0 0 0 2px ${t.palette.primary.main}`,
        },
      }}
    >
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(e, e.shiftKey);
        }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Checkbox
          size="small"
          checked={selected}
          onChange={() => {}}
          inputProps={{ 'aria-label': `Select ${ex.id}` }}
        />
      </Box>

      <PriorityChip score={score} severity={ex.severity} ttb={ex.ttb} impact={ex.impact} tier={ex.tier} />

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
          {ex.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {ex.id} · {ex.poId}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" noWrap>{partner?.name ?? '—'}</Typography>
        <Typography variant="caption" color="text.secondary">Tier {partner?.tier ?? '—'}</Typography>
      </Box>

      <Chip
        label={ex.ediDocType}
        size="small"
        variant="outlined"
        sx={{ fontFamily: 'monospace', fontWeight: 600, height: 22 }}
      />

      <Box>
        <Typography variant="body2" sx={{ color: TTB_COLOR[ttb.severity], fontWeight: 600 }}>
          {ttb.label}
        </Typography>
        <Typography variant="caption" color="text.secondary">age {ex.age}</Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        {ex.assignee ? (
          <Typography variant="body2" noWrap>{ex.assignee}</Typography>
        ) : (
          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>Unassigned</Typography>
        )}
      </Box>

      <Box
        sx={{ minWidth: 0, opacity: selectionActive ? 0.4 : 1, pointerEvents: selectionActive ? 'none' : 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <RecommendationCard
          layout="compact"
          confidence={rec.confidence}
          headline={rec.headline}
          reasoning={rec.reasoning}
          provenance={rec.provenance}
          primaryAction={{ label: rec.primaryLabel, onClick: onCommit }}
          alternatives={rec.alternatives?.map((a) => ({ label: a.label, onClick: () => {} }))}
          onDismiss={onDismiss}
          state={state}
          committedLabel={rec.committedLabel}
          onUndo={onUndo}
          onCommittedExpire={onExpire}
        />
      </Box>
    </Box>
  );
}

const CONFIDENCE_COLOR: Record<ConfidenceLabel, string> = {
  high: 'success.main',
  moderate: 'warning.main',
  exploratory: 'grey.400',
  none: 'transparent',
};

const CONFIDENCE_LABEL: Record<ConfidenceLabel, string> = {
  high: 'High confidence',
  moderate: 'Moderate confidence',
  exploratory: 'Exploratory',
  none: 'No recommendation',
};

function formatTimeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diffMs / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function UncategorizedSenderRow({
  sender,
  onOpen,
}: {
  sender: UncategorizedSender;
  onOpen: () => void;
}) {
  const conf = sender.recommendation.overallConfidence;
  const envelopeId = `${sender.envelope.qualifier}/${sender.envelope.value}${
    sender.envelope.subValue ? `/${sender.envelope.subValue}` : ''
  }`;
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
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) 110px minmax(0, 1fr) minmax(0, 1.2fr) 140px',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.25,
        borderTop: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        outline: 'none',
        '&:hover': { bgcolor: 'grey.50' },
        '&:focus-visible': {
          bgcolor: 'grey.50',
          boxShadow: (t) => `inset 0 0 0 2px ${t.palette.primary.main}`,
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.primary' }}
        noWrap
      >
        {envelopeId}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {sender.heldDocumentIds.length} doc{sender.heldDocumentIds.length === 1 ? '' : 's'} held
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        first seen {formatTimeAgo(sender.firstSeenAt)}
      </Typography>
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
        {conf !== 'none' && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: CONFIDENCE_COLOR[conf],
              flexShrink: 0,
            }}
          />
        )}
        <Typography variant="body2" color="text.secondary" noWrap>
          {CONFIDENCE_LABEL[conf]}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Categorize
        </Typography>
        <ChevronRight size={16} />
      </Stack>
    </Box>
  );
}

const isApplicable = (rec: InboxRecommendation): boolean =>
  rec.confidence === 'high' || rec.confidence === 'moderate';

const inferActionType = (rec: InboxRecommendation): RecommendationType => {
  const t = `${rec.primaryLabel} ${rec.headline}`.toLowerCase();
  if (t.includes('reassign')) return 'reassign';
  if (t.includes('snooze')) return 'snooze';
  if (t.includes('escalate')) return 'escalate';
  if (t.includes('redelivery') || t.includes('re-run') || t.includes('rerun')) return 'request-redelivery';
  if (t.includes('rule')) return 'rule-suggested';
  return 'resolve';
};

export default function Inbox() {
  const navigate = useNavigate();
  const uncategorizedSenders = useUncategorizedSenders();
  const [scope, setScope] = React.useState<AssignmentScope>('all');
  const [partnerId, setPartnerId] = React.useState<string>('all');
  const [docType, setDocType] = React.useState<string>('all');
  const [sortKey, setSortKey] = React.useState<SortKey>('priority');
  const [recStates, setRecStates] = React.useState<Record<string, RecommendationDisplayState>>({});

  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const lastSelectedRef = React.useRef<string | null>(null);

  const [removedIds, setRemovedIds] = React.useState<Set<string>>(new Set());
  const [confirmation, setConfirmation] = React.useState<BulkConfirmation | null>(null);
  const [confirmationKind, setConfirmationKind] = React.useState<BulkActionKind | null>(null);
  const [undoSecondsLeft, setUndoSecondsLeft] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const setState = (id: string, next: RecommendationDisplayState) =>
    setRecStates((s) => ({ ...s, [id]: next }));

  const filtered = React.useMemo(() => {
    return exceptions
      .filter((e) => {
        if (removedIds.has(e.id)) return false;
        if (scope === 'mine' && e.assignee !== ME) return false;
        if (scope === 'unassigned' && e.assignee !== null) return false;
        if (partnerId !== 'all' && e.partnerId !== partnerId) return false;
        if (docType !== 'all' && e.ediDocType !== docType) return false;
        return true;
      })
      .map((e) => ({ ex: e, score: computePriority(e) }))
      .sort((a, b) => {
        switch (sortKey) {
          case 'severity':
            return b.ex.severity - a.ex.severity;
          case 'ttb':
            return a.ex.breachInMinutes - b.ex.breachInMinutes;
          case 'newest':
            return (
              new Date(b.ex.timeline[0]?.ts ?? 0).getTime() -
              new Date(a.ex.timeline[0]?.ts ?? 0).getTime()
            );
          case 'priority':
          default:
            return b.score - a.score;
        }
      });
  }, [scope, partnerId, docType, sortKey, removedIds]);

  const visibleIds = React.useMemo(() => filtered.map((r) => r.ex.id), [filtered]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));

  // Count of selected exceptions whose suggested action has high/moderate confidence.
  const applicableCount = React.useMemo(() => {
    let n = 0;
    for (const id of selected) {
      const rec = inboxRecommendations[id];
      if (rec && isApplicable(rec)) n += 1;
    }
    return n;
  }, [selected]);

  // Undo countdown timer for the action bar's confirmation state.
  React.useEffect(() => {
    if (!confirmation || undoSecondsLeft <= 0) return;
    const t = window.setTimeout(() => setUndoSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [confirmation, undoSecondsLeft]);

  // When countdown hits 0, drop the confirmation but keep removed rows removed.
  React.useEffect(() => {
    if (confirmation && undoSecondsLeft === 0) {
      const t = window.setTimeout(() => {
        setConfirmation(null);
        setConfirmationKind(null);
      }, 400);
      return () => window.clearTimeout(t);
    }
  }, [confirmation, undoSecondsLeft]);

  // Esc clears selection (only if no drawer/dialog open — drawer handles its own Esc).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !drawerOpen && selected.size > 0) {
        setSelected(new Set());
        lastSelectedRef.current = null;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, selected.size]);

  const toggleOne = (id: string, shiftKey: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (shiftKey && lastSelectedRef.current && lastSelectedRef.current !== id) {
        const a = visibleIds.indexOf(lastSelectedRef.current);
        const b = visibleIds.indexOf(id);
        if (a >= 0 && b >= 0) {
          const [from, to] = a < b ? [a, b] : [b, a];
          for (let i = from; i <= to; i += 1) next.add(visibleIds[i]);
          lastSelectedRef.current = id;
          return next;
        }
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      lastSelectedRef.current = id;
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        for (const id of visibleIds) next.delete(id);
      } else {
        for (const id of visibleIds) next.add(id);
      }
      return next;
    });
    lastSelectedRef.current = null;
  };

  const clearSelection = () => {
    setSelected(new Set());
    lastSelectedRef.current = null;
  };

  const startConfirmation = (
    ids: string[],
    message: string,
    kind: BulkActionKind,
  ) => {
    setRemovedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) next.add(id);
      return next;
    });
    setConfirmation({ message, ids });
    setConfirmationKind(kind);
    setUndoSecondsLeft(10);
    clearSelection();
  };

  const handleReassign = (teammateName: string) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    startConfirmation(
      ids,
      `${ids.length} exceptions reassigned to ${teammateName}.`,
      'reassign',
    );
  };

  const handleSnooze = (durationLabel: string) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    startConfirmation(
      ids,
      `${ids.length} exceptions snoozed (${durationLabel}).`,
      'snooze',
    );
  };

  const handleResolve = (note: string) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    startConfirmation(
      ids,
      `${ids.length} exceptions resolved — "${note.length > 40 ? `${note.slice(0, 40)}…` : note}"`,
      'resolve',
    );
  };

  const handleApplySuggested = (ids: string[]) => {
    if (ids.length === 0) return;
    setDrawerOpen(false);

    // Push accepted recommendations onto the audit log fixture.
    const now = new Date().toISOString();
    const appended: Recommendation[] = ids.map((id, i) => {
      const rec = inboxRecommendations[id];
      return {
        id: `REC-bulk-${Date.now()}-${i}`,
        timestamp: now,
        type: inferActionType(rec),
        exceptionId: id,
        headline: rec.headline || rec.primaryLabel,
        reasoning: rec.reasoning || '(applied via bulk action)',
        confidence: rec.confidence === 'none' ? 'exploratory' : rec.confidence,
        status: 'accepted',
        operator: 'You',
      };
    });
    recommendations.push(...appended);

    startConfirmation(
      ids,
      `Applied ${ids.length} suggested action${ids.length === 1 ? '' : 's'}.`,
      'apply-suggested',
    );
  };

  const handleUndo = () => {
    if (!confirmation) return;
    setRemovedIds((prev) => {
      const next = new Set(prev);
      for (const id of confirmation.ids) next.delete(id);
      return next;
    });

    // If undoing an apply-suggested action, drop the matching audit-log entries.
    if (confirmationKind === 'apply-suggested') {
      const idSet = new Set(confirmation.ids);
      for (let i = recommendations.length - 1; i >= 0; i -= 1) {
        const r = recommendations[i];
        if (r.operator === 'You' && idSet.has(r.exceptionId) && r.status === 'accepted') {
          recommendations.splice(i, 1);
          idSet.delete(r.exceptionId);
        }
      }
    }

    setConfirmation(null);
    setConfirmationKind(null);
    setUndoSecondsLeft(0);
  };

  const drawerRows = React.useMemo(() => {
    const applicable: DrawerRow[] = [];
    const weak: DrawerRow[] = [];
    for (const id of selected) {
      const ex = exceptions.find((e) => e.id === id);
      const rec = inboxRecommendations[id];
      if (!ex || !rec) continue;
      if (isApplicable(rec)) applicable.push({ ex, rec });
      else weak.push({ ex, rec });
    }
    return { applicable, weak };
  }, [selected]);

  const selectionActive = selected.size > 0;

  return (
    <SupplyChainPageLayout>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4">Inbox</Typography>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} of {exceptions.length} exceptions
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={scope}
          onChange={(_, v) => v && setScope(v)}
          color="primary"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="mine">Mine</ToggleButton>
          <ToggleButton value="unassigned">Unassigned</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 180 }}>
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

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="doc-label">Doc type</InputLabel>
          <Select
            labelId="doc-label"
            label="Doc type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            <MenuItem value="all">All docs</MenuItem>
            {DOC_TYPES.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flex: 1 }} />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            label="Sort by"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="severity">Severity</MenuItem>
            <MenuItem value="ttb">Time to breach</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {uncategorizedSenders.length > 0 && (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'background.paper',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Info size={16} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Uncategorized senders ({uncategorizedSenders.length})
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              Documents from these senders are held pending categorization.
            </Typography>
          </Box>
          {uncategorizedSenders.map((s) => (
            <UncategorizedSenderRow
              key={s.id}
              sender={s}
              onOpen={() =>
                navigate(
                  `/supplychainoverhaul/partners?tab=uncategorized&open=${encodeURIComponent(s.id)}`,
                )
              }
            />
          ))}
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50',
            }}
          >
            <Box
              role="button"
              tabIndex={0}
              onClick={() => navigate('/supplychainoverhaul/partners?tab=uncategorized')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/supplychainoverhaul/partners?tab=uncategorized');
                }
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: 'primary.main',
                fontSize: 13,
                fontWeight: 600,
                outline: 'none',
                '&:focus-visible': { textDecoration: 'underline' },
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Manage in Partners → Uncategorized
              <ChevronRight size={14} />
            </Box>
          </Box>
        </Box>
      )}

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
            gridTemplateColumns: GRID_COLUMNS,
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              size="small"
              checked={allVisibleSelected}
              indeterminate={!allVisibleSelected && someVisibleSelected}
              onChange={toggleSelectAll}
              inputProps={{ 'aria-label': 'Select all visible' }}
              sx={{ p: 0 }}
            />
          </Box>
          <Box>Priority</Box>
          <Box>Title</Box>
          <Box>Partner</Box>
          <Box>Doc</Box>
          <Box>Time to breach</Box>
          <Box>Assignee</Box>
          <Box>Suggested action</Box>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No exceptions match the current filters.
            </Typography>
          </Box>
        ) : (
          filtered.map(({ ex, score }) => {
            const state = recStates[ex.id] ?? 'idle';
            return (
              <InboxRow
                key={ex.id}
                ex={ex}
                score={score}
                state={state}
                selected={selected.has(ex.id)}
                selectionActive={selectionActive}
                onToggleSelect={(_e, shiftKey) => toggleOne(ex.id, shiftKey)}
                onCommit={() => setState(ex.id, 'committed')}
                onDismiss={() => setState(ex.id, 'dismissed')}
                onUndo={() => setState(ex.id, 'idle')}
                onExpire={() => setState(ex.id, 'idle')}
              />
            );
          })
        )}
      </Box>

      <BulkActionBar
        selectedCount={selected.size}
        applicableCount={applicableCount}
        confirmation={confirmation}
        undoSecondsLeft={undoSecondsLeft}
        onClearSelection={clearSelection}
        onApplySuggestedClick={() => setDrawerOpen(true)}
        onReassign={handleReassign}
        onSnooze={handleSnooze}
        onResolve={handleResolve}
        onUndo={handleUndo}
        onDismissConfirmation={() => {
          setConfirmation(null);
          setConfirmationKind(null);
          setUndoSecondsLeft(0);
        }}
      />

      <ApplySuggestedDrawer
        open={drawerOpen}
        applicable={drawerRows.applicable}
        weak={drawerRows.weak}
        onClose={() => setDrawerOpen(false)}
        onApply={handleApplySuggested}
      />
    </SupplyChainPageLayout>
  );
}
