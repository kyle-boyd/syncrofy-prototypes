import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  MenuItem,
  Snackbar,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Drawer } from '@mui/material';
import { ArrowDown, ArrowUp, Check, AlertTriangle, X } from 'lucide-react';
import {
  uncategorizedSenders,
  uncategorizedSendersById,
} from '../fixtures/uncategorizedSenders';
import type {
  ConfidenceLabel,
  FieldRecommendation,
  Signal,
  UncategorizedSender,
} from '../types/uncategorized';
import { partners, partnersById, type Partner } from '../fixtures/partners';
import { documentsById, type EdiDocument } from '../fixtures/documents';
import { recommendations } from '../fixtures/recommendations';
import { DocumentInspector } from '../components/DocumentInspector';
import { notifyUncategorizedChanged } from '../lib/uncategorizedStore';

const DRAWER_WIDTH = 720;

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
  none: 'No signal',
};

function ConfidenceDot({ confidence, label }: { confidence: ConfidenceLabel; label?: string }) {
  if (confidence === 'none' && !label) return null;
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: CONFIDENCE_COLOR[confidence],
          flexShrink: 0,
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {label ?? CONFIDENCE_LABEL[confidence]}
      </Typography>
    </Stack>
  );
}

function formatTimeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diffMs / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function envelopeId(s: UncategorizedSender): string {
  return `${s.envelope.qualifier} / ${s.envelope.value}${
    s.envelope.subValue ? ' / ' + s.envelope.subValue : ''
  }`;
}

// ── Section: Header banner ─────────────────────────────────────────────────
function HeaderBanner({ sender }: { sender: UncategorizedSender }) {
  const { recommendation } = sender;
  const { overallConfidence, signalSummary } = recommendation;
  const name = recommendation.fields.name.value;

  let text: string;
  let showDot = true;
  if (overallConfidence === 'high' || overallConfidence === 'moderate') {
    text = `${signalSummary.agreeing} of ${signalSummary.totalSignals} signals agree — likely ${name ?? 'unknown'}`;
  } else if (overallConfidence === 'exploratory') {
    text = "Signals don't fully agree — review carefully before committing";
  } else {
    text = 'Not enough signal to recommend — please categorize manually';
    showDot = false;
  }

  return (
    <Box
      sx={{
        mt: 1.5,
        px: 1.5,
        py: 1,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {showDot && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: CONFIDENCE_COLOR[overallConfidence],
            flexShrink: 0,
          }}
        />
      )}
      <Typography variant="body2">{text}</Typography>
    </Box>
  );
}

// ── Section: What we observed ──────────────────────────────────────────────
function DocumentsHeldStrip({
  ids,
  onOpenDoc,
}: {
  ids: string[];
  onOpenDoc: (id: string) => void;
}) {
  const docs = ids.map((id) => documentsById[id]).filter(Boolean) as EdiDocument[];
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        Click a document to inspect raw EDI
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        {docs.map((d) => {
          const DirIcon = d.direction === 'inbound' ? ArrowDown : ArrowUp;
          return (
            <Box
              key={d.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenDoc(d.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenDoc(d.id);
                }
              }}
              sx={{
                px: 1,
                py: 0.75,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                minWidth: 140,
                '&:hover': { bgcolor: 'grey.50' },
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: (t) => `inset 0 0 0 2px ${t.palette.primary.main}`,
                },
              }}
            >
              <Chip
                label={d.docType}
                size="small"
                variant="outlined"
                sx={{ fontFamily: 'monospace', fontWeight: 600, height: 20 }}
              />
              <DirIcon size={14} />
              <Typography variant="caption" color="text.secondary">
                {formatTimeAgo(d.receivedAt)}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

function IdentifyingSignalsTable({ sender }: { sender: UncategorizedSender }) {
  const ids = sender.observedSignals.documentIdentities;
  const glns = ids.filter((i) => i.identityType === 'GLN').map((i) => i.value);
  const refs = ids.filter((i) => i.source === 'REF').map((i) => `${i.identityType}: ${i.value}`);
  const dunsList = ids.filter((i) => i.identityType === 'DUNS').map((i) => i.value);
  const groupSenders = ids.filter((i) => i.source === 'GS').map((i) => i.value);

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    {
      label: 'Envelope qualifier + value',
      value: (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {sender.envelope.qualifier} / {sender.envelope.value}
        </Typography>
      ),
    },
    {
      label: 'Sub-value',
      value: (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {sender.envelope.subValue ?? '—'}
        </Typography>
      ),
    },
  ];

  if (glns.length > 0) {
    rows.push({
      label: 'N1 GLN(s)',
      value: (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {glns.join(', ')}
        </Typography>
      ),
    });
  }
  if (refs.length > 0 || dunsList.length > 0) {
    const combined = [...dunsList.map((d) => `DUNS: ${d}`), ...refs];
    rows.push({
      label: 'REF identifiers',
      value: (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {combined.join(', ')}
        </Typography>
      ),
    });
  }
  if (groupSenders.length > 0) {
    rows.push({
      label: 'Group sender ID',
      value: (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {groupSenders.join(', ')}
        </Typography>
      ),
    });
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Identifying signals
      </Typography>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        {rows.map((r, idx) => (
          <Box
            key={r.label}
            sx={{
              display: 'grid',
              gridTemplateColumns: '200px 1fr',
              gap: 2,
              px: 1.5,
              py: 0.75,
              borderTop: idx === 0 ? 'none' : '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {r.label}
            </Typography>
            <Box>{r.value}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function AddressFingerprint({ sender }: { sender: UncategorizedSender }) {
  const addresses = sender.observedSignals.addresses;
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Address fingerprint
      </Typography>
      {addresses.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No address blocks observed in held documents.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {addresses.map((a, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1.5,
                py: 1,
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
                <Chip
                  label={a.role}
                  size="small"
                  sx={{ height: 20, alignSelf: 'flex-start', flexShrink: 0 }}
                />
                <Box>
                  <Typography variant="body2">{a.normalized.street}</Typography>
                  <Typography variant="body2">
                    {a.normalized.city}, {a.normalized.state} {a.normalized.postal}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {a.normalized.country}
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                seen {a.occurrenceCount} time{a.occurrenceCount === 1 ? '' : 's'} across{' '}
                {sender.heldDocumentIds.length} doc
                {sender.heldDocumentIds.length === 1 ? '' : 's'}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

function DocumentPatternLine({ sender }: { sender: UncategorizedSender }) {
  const pattern = sender.observedSignals.docTypePattern;
  if (pattern.length === 0) return null;
  const patternText = pattern.map((p) => `${p.count}× ${p.docType}`).join(', ');
  // Direction comes from documents; all held docs are inbound in fixtures, but compute for safety.
  const docs = sender.heldDocumentIds
    .map((id) => documentsById[id])
    .filter(Boolean) as EdiDocument[];
  const allInbound = docs.every((d) => d.direction === 'inbound');
  const allOutbound = docs.every((d) => d.direction === 'outbound');
  const dirSummary = allInbound ? 'all inbound' : allOutbound ? 'all outbound' : 'mixed direction';
  return (
    <Typography variant="body2" color="text.secondary">
      Pattern: {patternText} — {dirSummary}
    </Typography>
  );
}

// ── Section: Recommended categorization (fields) ───────────────────────────
interface FieldRowProps {
  fieldKey: string;
  label: string;
  rec: FieldRecommendation;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  required: boolean;
  showError: boolean;
}

function FieldRow({
  label,
  rec,
  value,
  onChange,
  options,
  required,
  showError,
}: FieldRowProps) {
  const hasConflict = rec.value === null && rec.candidates && rec.candidates.length > 0;
  const isNoSignal = rec.confidence === 'none';
  const [candidateChoice, setCandidateChoice] = React.useState<string>(value);

  React.useEffect(() => {
    setCandidateChoice(value);
  }, [value]);

  const handleCandidate = (val: string) => {
    setCandidateChoice(val);
    onChange(val);
  };

  const sortedSignals: Signal[] = React.useMemo(() => {
    const order = { strong: 0, moderate: 1, weak: 2 } as const;
    return [...rec.signals].sort((a, b) => order[a.strength] - order[b.strength]);
  }, [rec.signals]);

  const error = showError && required && !value.trim();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: 2,
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'text.secondary',
          pt: 1,
        }}
      >
        {label}
      </Typography>
      <Box>
        {options ? (
          <TextField
            select
            fullWidth
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            helperText={error ? 'Required' : undefined}
          >
            {options.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <TextField
            fullWidth
            size="small"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={hasConflict ? 'needs review — see options below' : ''}
            error={error}
            helperText={error ? 'Required' : undefined}
          />
        )}

        {hasConflict ? (
          <Box sx={{ mt: 1 }}>
            <ConfidenceDot confidence="exploratory" />
            <Typography variant="caption" sx={{ display: 'block', mt: 1, mb: 0.5 }}>
              Signals disagree on this field. Possible values:
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              {rec.candidates!.map((c, idx) => (
                <Box
                  key={idx}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderTop: idx === 0 ? 'none' : '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Radio
                        size="small"
                        checked={candidateChoice === c.value}
                        onChange={() => handleCandidate(c.value)}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        "{c.value}"
                      </Typography>
                    }
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', pl: 4 }}
                  >
                    based on:{' '}
                    {c.signals.map((s) => s.description).join('; ')}
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Radio
                      size="small"
                      checked={
                        candidateChoice !== '' &&
                        !rec.candidates!.some((c) => c.value === candidateChoice)
                      }
                      onChange={() => handleCandidate('')}
                    />
                  }
                  label={<Typography variant="body2">Other:</Typography>}
                />
                <TextField
                  size="small"
                  value={
                    rec.candidates!.some((c) => c.value === candidateChoice) ? '' : candidateChoice
                  }
                  onChange={(e) => handleCandidate(e.target.value)}
                  placeholder="enter value"
                  sx={{ flex: 1 }}
                />
              </Box>
            </Box>
          </Box>
        ) : isNoSignal ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: 'italic', display: 'block', mt: 0.75 }}
          >
            No signal — please enter manually
          </Typography>
        ) : (
          <Box sx={{ mt: 0.75 }}>
            <ConfidenceDot confidence={rec.confidence} />
            {sortedSignals.length > 0 && (
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  based on:
                </Typography>
                <Box component="ul" sx={{ m: 0, mt: 0.25, pl: 2.5 }}>
                  {sortedSignals.map((s, i) => (
                    <Typography
                      key={i}
                      component="li"
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'list-item' }}
                    >
                      {s.description}
                    </Typography>
                  ))}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  {(() => {
                    const agree = sortedSignals.filter((s) => s.agrees).length;
                    const total = sortedSignals.length;
                    return agree === total
                      ? `${agree} signal${agree === 1 ? '' : 's'} agree`
                      : `${agree} of ${total} signals agree`;
                  })()}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Section: Pre-commit checks ─────────────────────────────────────────────
type CheckState = 'pass' | 'warn' | 'error';
interface Check {
  state: CheckState;
  text: string;
}

function getChecks(senderId: string): Check[] {
  switch (senderId) {
    case 'UNC-001':
      return [
        { state: 'pass', text: 'Qualifier+value combination is unique (no conflicts with existing partners)' },
        { state: 'pass', text: 'Required fields populated for qualifier 12' },
        { state: 'pass', text: 'Direction matches observed traffic' },
        {
          state: 'warn',
          text: 'Sub-value 217 is new — confirm this is a separate division needing distinct handling, or a typo of an existing sub-value (Walmart has sub-values 003, 045, 102 already)',
        },
      ];
    case 'UNC-002':
      return [
        { state: 'pass', text: 'Qualifier+value combination is unique (no conflicts with existing partners)' },
        { state: 'pass', text: 'Required fields populated for qualifier ZZ' },
        { state: 'pass', text: 'Direction matches observed traffic' },
      ];
    case 'UNC-003':
      return [
        { state: 'error', text: 'Resolve conflicting fields above before committing' },
      ];
    case 'UNC-004':
      return [
        { state: 'warn', text: 'No signals to validate against — review manually' },
      ];
    default:
      return [];
  }
}

function CheckRow({ check }: { check: Check }) {
  const icon =
    check.state === 'pass' ? (
      <Check size={16} color="var(--color-success, #2e7d32)" />
    ) : check.state === 'warn' ? (
      <AlertTriangle size={16} color="var(--color-warning, #ed6c02)" />
    ) : (
      <X size={16} color="var(--color-error, #d32f2f)" />
    );
  const color =
    check.state === 'pass'
      ? 'success.main'
      : check.state === 'warn'
        ? 'warning.main'
        : 'error.main';
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ py: 0.5 }}>
      <Box sx={{ color, display: 'flex', alignItems: 'center', mt: 0.25 }}>{icon}</Box>
      <Typography variant="body2">{check.text}</Typography>
    </Stack>
  );
}

// ── Main drawer ────────────────────────────────────────────────────────────
export interface CategorizationDrawerProps {
  senderId: string | null;
  onClose: () => void;
  onCommitted?: (summary: { senderId: string; partnerId: string; docCount: number }) => void;
}

type ActionChoice = 'create-new' | 'link-to-existing';

const PARTY_TYPE_OPTIONS = ['External partner', 'Internal company', 'Service provider'];
const DIRECTION_OPTIONS = ['Inbound', 'Outbound', 'Both'];

export function CategorizationDrawer({
  senderId,
  onClose,
  onCommitted,
}: CategorizationDrawerProps) {
  const sender = senderId ? uncategorizedSendersById[senderId] : null;
  const [inspectorDocId, setInspectorDocId] = React.useState<string | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [draftToast, setDraftToast] = React.useState(false);

  const initialAction: ActionChoice = React.useMemo(() => {
    if (!sender) return 'create-new';
    return sender.recommendation.proposedAction === 'link-to-existing'
      ? 'link-to-existing'
      : 'create-new';
  }, [sender]);

  const proposedPartner: Partner | null = React.useMemo(() => {
    if (!sender || !sender.recommendation.proposedPartnerId) return null;
    return partnersById[sender.recommendation.proposedPartnerId] ?? null;
  }, [sender]);

  const [action, setAction] = React.useState<ActionChoice>(initialAction);
  const [showErrors, setShowErrors] = React.useState(false);

  // Form values, initialized from recommendation fields.
  const initVal = (f: FieldRecommendation): string => f.value ?? '';
  const [form, setForm] = React.useState({
    name: '',
    qualifier: '',
    value: '',
    subValue: '',
    description: '',
    partyType: '',
    direction: '',
  });

  React.useEffect(() => {
    if (!sender) return;
    const f = sender.recommendation.fields;
    setForm({
      name: initVal(f.name),
      qualifier: initVal(f.qualifier),
      value: initVal(f.value),
      subValue: sender.recommendation.proposedSubValue ?? initVal(f.subValue),
      description: initVal(f.description),
      partyType: initVal(f.partyType),
      direction: initVal(f.direction),
    });
    setAction(
      sender.recommendation.proposedAction === 'link-to-existing'
        ? 'link-to-existing'
        : 'create-new',
    );
    setShowErrors(false);
  }, [sender]);

  if (!sender) {
    return <Drawer anchor="right" open={false} onClose={onClose} />;
  }

  const checks = getChecks(sender.id);
  const hasErrors = checks.some((c) => c.state === 'error');
  const requiredFieldsFilled =
    action === 'link-to-existing'
      ? form.subValue.trim() !== '' && form.direction.trim() !== ''
      : form.name.trim() !== '' &&
        form.qualifier.trim() !== '' &&
        form.value.trim() !== '' &&
        form.partyType.trim() !== '' &&
        form.direction.trim() !== '';

  const commitDisabled = hasErrors || !requiredFieldsFilled;

  const handleSubmit = () => {
    if (commitDisabled) {
      setShowErrors(true);
      return;
    }

    const docCount = sender.heldDocumentIds.length;
    let partnerId = '';
    let nameForToast = '';

    if (action === 'link-to-existing' && proposedPartner) {
      partnerId = proposedPartner.id;
      nameForToast = proposedPartner.name;
      const existing = proposedPartner.subValues ?? [];
      if (form.subValue && !existing.includes(form.subValue)) {
        proposedPartner.subValues = [...existing, form.subValue];
      }
    } else {
      partnerId = `p-new-${sender.id.toLowerCase()}`;
      nameForToast = form.name;
      if (!partnersById[partnerId]) {
        const newPartner: Partner = {
          id: partnerId,
          name: form.name,
          tier: 3,
          gln: form.value,
          additionalGLNs: [],
          accountManager: { name: '—', email: '' },
          partnerContacts: [],
          slaThresholds: {
            asnTimelinessPercent: 0,
            ackTimelinessPercent: 0,
            invoiceMatchPercent: 0,
          },
          currentSLA: {
            asnTimelinessPercent: 0,
            ackTimelinessPercent: 0,
            invoiceMatchPercent: 0,
          },
          healthLabel: 'Watch',
          healthTrend: 'flat',
          healthChangeNote: null,
          exchangedDocTypes: sender.observedSignals.docTypePattern.map((p) => p.docType),
          mapVersions: [],
          notes: [],
          recentIncidents: [],
          lastActivityAt: sender.lastSeenAt,
          subValues: form.subValue ? [form.subValue] : [],
        };
        partners.push(newPartner);
        (partnersById as Record<string, Partner>)[partnerId] = newPartner;
      }
    }

    // Remove sender from in-memory fixtures.
    const senderIdx = uncategorizedSenders.findIndex((s) => s.id === sender.id);
    if (senderIdx >= 0) uncategorizedSenders.splice(senderIdx, 1);
    delete (uncategorizedSendersById as Record<string, UncategorizedSender>)[sender.id];

    // Append audit-log entry.
    const auditConfidence =
      sender.recommendation.overallConfidence === 'none'
        ? 'exploratory'
        : sender.recommendation.overallConfidence;
    recommendations.push({
      id: `REC-cat-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'categorize-sender',
      exceptionId: sender.id,
      headline: `Categorized ${envelopeId(sender)} as ${nameForToast}`,
      reasoning:
        action === 'link-to-existing'
          ? `Linked to existing partner ${nameForToast}${
              form.subValue ? ` (sub-value ${form.subValue})` : ''
            }.`
          : `Created new partner record "${nameForToast}".`,
      confidence: auditConfidence,
      status: 'accepted',
      operator: 'You',
    });

    setToastMessage(
      `Categorized as ${nameForToast}. ${docCount} document${docCount === 1 ? '' : 's'} released to processing.`,
    );
    notifyUncategorizedChanged();
    onCommitted?.({ senderId: sender.id, partnerId, docCount });
    onClose();
  };

  const fields = sender.recommendation.fields;

  return (
    <>
      <Drawer
        anchor="right"
        open={senderId !== null}
        onClose={onClose}
        PaperProps={{
          sx: { width: DRAWER_WIDTH, display: 'flex', flexDirection: 'column' },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 3, pt: 2, pb: 1.5 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}
              >
                Categorize sender
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'monospace', fontWeight: 600, mt: 0.25, wordBreak: 'break-all' }}
              >
                {envelopeId(sender)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {sender.heldDocumentIds.length} document
                {sender.heldDocumentIds.length === 1 ? '' : 's'} held · first seen{' '}
                {formatTimeAgo(sender.firstSeenAt)} · last seen{' '}
                {formatTimeAgo(sender.lastSeenAt)}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small" aria-label="Close drawer">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          <HeaderBanner sender={sender} />
        </Box>
        <Divider />

        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
          {/* Section 1 — What we observed */}
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            What we observed
          </Typography>
          <Stack spacing={2.5} sx={{ mb: 4 }}>
            <DocumentsHeldStrip
              ids={sender.heldDocumentIds}
              onOpenDoc={(id) => setInspectorDocId(id)}
            />
            <IdentifyingSignalsTable sender={sender} />
            <AddressFingerprint sender={sender} />
            <DocumentPatternLine sender={sender} />
          </Stack>

          {/* Section 2 — Recommended categorization */}
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Recommended categorization
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            How should this sender be categorized?
          </Typography>
          <RadioGroup
            value={action}
            onChange={(_, v) => setAction(v as ActionChoice)}
            sx={{ flexDirection: 'row', gap: 1.5, flexWrap: 'nowrap' }}
          >
            <Box
              sx={{
                flex: 1,
                border: '1px solid',
                borderColor: action === 'create-new' ? 'primary.main' : 'divider',
                borderRadius: 1.5,
                p: 1.5,
                bgcolor: action === 'create-new' ? 'action.selected' : 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => setAction('create-new')}
            >
              <FormControlLabel
                value="create-new"
                control={<Radio size="small" />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Create new partner record
                  </Typography>
                }
                sx={{ m: 0 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', pl: 3.5 }}>
                This sender doesn't match any existing partner.
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                border: '1px solid',
                borderColor: action === 'link-to-existing' ? 'primary.main' : 'divider',
                borderRadius: 1.5,
                p: 1.5,
                bgcolor: action === 'link-to-existing' ? 'action.selected' : 'transparent',
                cursor: proposedPartner ? 'pointer' : 'not-allowed',
                opacity: proposedPartner ? 1 : 0.5,
              }}
              onClick={() => proposedPartner && setAction('link-to-existing')}
            >
              <FormControlLabel
                value="link-to-existing"
                control={<Radio size="small" disabled={!proposedPartner} />}
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {proposedPartner
                      ? `Add to existing partner: ${proposedPartner.name}`
                      : 'Add to existing partner (none suggested)'}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
              {proposedPartner && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', pl: 3.5 }}>
                  This sender appears to be a new identifier
                  {sender.recommendation.proposedSubValue
                    ? ` (sub-value ${sender.recommendation.proposedSubValue})`
                    : ''}{' '}
                  for {proposedPartner.name}, which already has{' '}
                  {proposedPartner.exchangedDocTypes.length} configured doc type
                  {proposedPartner.exchangedDocTypes.length === 1 ? '' : 's'}.
                </Typography>
              )}
            </Box>
          </RadioGroup>

          {action === 'link-to-existing' && proposedPartner && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                Inheriting from {proposedPartner.name}: qualifier {form.qualifier || '—'}, party type{' '}
                {form.partyType || 'External partner'}
              </Typography>
              <TextField
                label="Add as sub-value"
                size="small"
                value={form.subValue}
                onChange={(e) => setForm({ ...form, subValue: e.target.value })}
                error={showErrors && form.subValue.trim() === ''}
                helperText={
                  showErrors && form.subValue.trim() === '' ? 'Required' : undefined
                }
              />
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            {action === 'create-new' ? (
              <>
                <FieldRow
                  fieldKey="name"
                  label="Name"
                  rec={fields.name}
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                  showError={showErrors}
                />
                <FieldRow
                  fieldKey="qualifier"
                  label="Qualifier"
                  rec={fields.qualifier}
                  value={form.qualifier}
                  onChange={(v) => setForm({ ...form, qualifier: v })}
                  required
                  showError={showErrors}
                />
                <FieldRow
                  fieldKey="value"
                  label="Value"
                  rec={fields.value}
                  value={form.value}
                  onChange={(v) => setForm({ ...form, value: v })}
                  required
                  showError={showErrors}
                />
                <FieldRow
                  fieldKey="subValue"
                  label="Sub value"
                  rec={fields.subValue}
                  value={form.subValue}
                  onChange={(v) => setForm({ ...form, subValue: v })}
                  required={false}
                  showError={showErrors}
                />
                <FieldRow
                  fieldKey="description"
                  label="Description"
                  rec={fields.description}
                  value={form.description}
                  onChange={(v) => setForm({ ...form, description: v })}
                  required={false}
                  showError={showErrors}
                />
                <FieldRow
                  fieldKey="partyType"
                  label="Party type"
                  rec={fields.partyType}
                  value={form.partyType}
                  onChange={(v) => setForm({ ...form, partyType: v })}
                  options={PARTY_TYPE_OPTIONS}
                  required
                  showError={showErrors}
                />
                <FieldRow
                  fieldKey="direction"
                  label="Direction"
                  rec={fields.direction}
                  value={form.direction}
                  onChange={(v) => setForm({ ...form, direction: v })}
                  options={DIRECTION_OPTIONS}
                  required
                  showError={showErrors}
                />
              </>
            ) : (
              <>
                <FieldRow
                  fieldKey="subValue"
                  label="Sub value"
                  rec={fields.subValue}
                  value={form.subValue}
                  onChange={(v) => setForm({ ...form, subValue: v })}
                  required
                  showError={showErrors}
                />
                <FieldRow
                  fieldKey="description"
                  label="Description"
                  rec={fields.description}
                  value={form.description}
                  onChange={(v) => setForm({ ...form, description: v })}
                  required={false}
                  showError={showErrors}
                />
                <FieldRow
                  fieldKey="direction"
                  label="Direction"
                  rec={fields.direction}
                  value={form.direction}
                  onChange={(v) => setForm({ ...form, direction: v })}
                  options={DIRECTION_OPTIONS}
                  required
                  showError={showErrors}
                />
              </>
            )}
          </Box>

          {/* Section 3 — Pre-commit checks */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Pre-commit checks
            </Typography>
            <Box>
              {checks.map((c, i) => (
                <CheckRow key={i} check={c} />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              {sender.heldDocumentIds.length} held document
              {sender.heldDocumentIds.length === 1 ? '' : 's'} will be released to processing once
              committed.
            </Typography>
          </Box>
        </Box>

        {/* Sticky footer */}
        <Divider />
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Button variant="text" color="secondary" onClick={onClose}>
            Dismiss
          </Button>
          <Button variant="outlined" onClick={() => setDraftToast(true)}>
            Save as draft
          </Button>
          <Button variant="contained" disabled={commitDisabled} onClick={handleSubmit}>
            Categorize and release {sender.heldDocumentIds.length} document
            {sender.heldDocumentIds.length === 1 ? '' : 's'}
          </Button>
        </Box>
      </Drawer>

      <DocumentInspector
        open={inspectorDocId !== null}
        documentId={inspectorDocId}
        onClose={() => setInspectorDocId(null)}
        onOpenDocument={(id) => setInspectorDocId(id)}
      />

      <Snackbar
        open={toastMessage !== null}
        autoHideDuration={5000}
        onClose={() => setToastMessage(null)}
        message={toastMessage ?? ''}
      />
      <Snackbar
        open={draftToast}
        autoHideDuration={3000}
        onClose={() => setDraftToast(false)}
        message="Saved as draft"
      />
    </>
  );
}

export default CategorizationDrawer;
