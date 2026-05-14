import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, Divider, Stack, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { PriorityChip, bandFor } from '../components/PriorityChip';
import { LifecycleStrip, type LifecycleStage } from '../components/LifecycleStrip';
import { DocumentInspector } from '../components/DocumentInspector';
import { TriageAssistant } from '../ai/TriageAssistant';
import { exceptionsById, type TimelineState, type TimelineEntry } from '../fixtures/exceptions';
import { partnersById } from '../fixtures/partners';
import {
  documentsForException,
  documentForExceptionStage,
  type DocStage,
  type EdiDocument,
} from '../fixtures/documents';
import { computePriority, type Factor } from '../lib/priority';
import { formatTimeToBreach, formatTimestamp, type TimeSeverity } from '../lib/time';

const TTB_COLOR: Record<TimeSeverity, string> = {
  critical: 'error.main',
  warn: 'warning.main',
  neutral: 'text.primary',
};

const TIMELINE_DOT: Record<TimelineState, string> = {
  ok: 'success.main',
  pending: 'info.main',
  warn: 'warning.main',
  breach: 'error.main',
  info: 'info.light',
  future: 'grey.300',
};

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  );
}

function FactorBar({ label, value }: { label: string; value: Factor }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 110 }}>
      <Typography variant="caption" color="text.secondary" sx={{ width: 56 }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1, height: 4, bgcolor: 'grey.200', borderRadius: 0.5, position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            width: `${(value / 5) * 100}%`,
            bgcolor: 'primary.main',
            borderRadius: 0.5,
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ width: 14, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  );
}

const LIFECYCLE_TO_DOC_STAGE: Record<LifecycleStage, DocStage[]> = {
  '850': ['850'],
  '855': ['855'],
  '856': ['856'],
  Receipt: ['Receipt'],
  Invoice: ['810'],
};

const DOC_CODE_RE = /\b(850|855|856|810|940|997)\b/g;

function TimelineEventText({
  entry,
  docByCode,
  onOpen,
}: {
  entry: TimelineEntry;
  docByCode: Map<string, EdiDocument>;
  onOpen: (id: string) => void;
}) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const text = entry.event;
  let match: RegExpExecArray | null;
  DOC_CODE_RE.lastIndex = 0;
  while ((match = DOC_CODE_RE.exec(text)) !== null) {
    const code = match[1];
    const doc = docByCode.get(code);
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (doc) {
      parts.push(
        <Link
          key={`${match.index}-${code}`}
          component="button"
          type="button"
          onClick={() => onOpen(doc.id)}
          sx={{ fontWeight: 700, fontFamily: 'monospace', verticalAlign: 'baseline', cursor: 'pointer' }}
        >
          {code}
        </Link>,
      );
    } else {
      parts.push(code);
    }
    lastIndex = match.index + code.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {parts.map((p, i) => (
        <React.Fragment key={i}>{p}</React.Fragment>
      ))}
    </Typography>
  );
}

export default function ExceptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exception = id ? exceptionsById[id] : undefined;
  const [inspectorDocId, setInspectorDocId] = useState<string | null>(null);

  const docs = useMemo(
    () => (exception ? documentsForException(exception.id) : []),
    [exception],
  );
  const docByCode = useMemo(() => {
    const m = new Map<string, EdiDocument>();
    docs.forEach((d) => {
      if (!m.has(d.docType)) m.set(d.docType, d);
    });
    return m;
  }, [docs]);
  const clickableStages = useMemo(() => {
    const set = new Set<LifecycleStage>();
    (Object.keys(LIFECYCLE_TO_DOC_STAGE) as LifecycleStage[]).forEach((stage) => {
      const targets = LIFECYCLE_TO_DOC_STAGE[stage];
      if (exception && targets.some((t) => documentForExceptionStage(exception.id, t))) {
        set.add(stage);
      }
    });
    return set;
  }, [exception]);

  const handleStageClick = (stage: LifecycleStage) => {
    if (!exception) return;
    for (const docStage of LIFECYCLE_TO_DOC_STAGE[stage]) {
      const doc = documentForExceptionStage(exception.id, docStage);
      if (doc) {
        setInspectorDocId(doc.id);
        return;
      }
    }
  };

  if (!exception) {
    return (
      <SupplyChainPageLayout>
        <Typography variant="h5" gutterBottom>Exception not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {id ? `No exception with id "${id}".` : 'No id provided.'}
        </Typography>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate('/supplychainoverhaul/inbox')}>
          Back to inbox
        </Button>
      </SupplyChainPageLayout>
    );
  }

  const partner = partnersById[exception.partnerId];
  const score = computePriority(exception);
  const ttb = formatTimeToBreach(exception.breachInMinutes);

  return (
    <SupplyChainPageLayout contentPadding={0}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr 360px', height: '100%', minHeight: 0 }}>
        {/* Left rail */}
        <Box sx={{ borderRight: '1px solid', borderColor: 'divider', p: 2, overflow: 'auto' }}>
          <Button
            variant="text"
            size="small"
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate('/supplychainoverhaul/inbox')}
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            Inbox
          </Button>
          <Stack spacing={1.5}>
            <MetaRow label="Exception" value={exception.id} />
            <MetaRow label="Type" value={exception.type} />
            <MetaRow
              label="Partner"
              value={`${partner?.name ?? '—'} · Tier ${partner?.tier ?? '—'}`}
            />
            <MetaRow label="GLN" value={partner?.gln ?? '—'} />
            <MetaRow label="PO" value={exception.poId} />
            <MetaRow label="Doc type" value={exception.ediDocType} />
            <MetaRow label="Age" value={exception.age} />
            <MetaRow
              label="Assignee"
              value={
                exception.assignee ?? (
                  <Typography component="span" variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                    Unassigned
                  </Typography>
                )
              }
            />
            <Divider />
            <MetaRow
              label="Time to breach"
              value={
                <Typography component="span" variant="body2" sx={{ color: TTB_COLOR[ttb.severity], fontWeight: 600 }}>
                  {ttb.label}
                </Typography>
              }
            />
            <MetaRow label="Severity" value={`${exception.severity}/5`} />
          </Stack>
        </Box>

        {/* Center column */}
        <Box sx={{ overflow: 'auto', p: 3, minWidth: 0 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
            <PriorityChip
              score={score}
              severity={exception.severity}
              ttb={exception.ttb}
              impact={exception.impact}
              tier={exception.tier}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                {exception.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Priority {score} · {bandFor(score)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 0.5, maxWidth: 360 }}>
              <FactorBar label="severity" value={exception.severity} />
              <FactorBar label="ttb" value={exception.ttb} />
              <FactorBar label="impact" value={exception.impact} />
              <FactorBar label="tier" value={exception.tier} />
            </Stack>
          </Stack>

          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              mb: 3,
            }}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.08em' }}>
                Lifecycle
              </Typography>
            </Box>
            <LifecycleStrip
              timeline={exception.timeline}
              clickableStages={clickableStages}
              onStageClick={handleStageClick}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Description</Typography>
            <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
              {exception.description}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Impact</Typography>
            <Typography variant="body2" color="text.secondary">
              {exception.impactNote}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Timeline</Typography>
            <Box sx={{ position: 'relative', pl: 3 }}>
              <Box
                sx={{
                  position: 'absolute',
                  left: 9,
                  top: 6,
                  bottom: 6,
                  width: '2px',
                  bgcolor: 'divider',
                }}
              />
              <Stack spacing={1.75}>
                {exception.timeline.map((t, i) => (
                  <Box key={i} sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: -19,
                        top: 4,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: TIMELINE_DOT[t.state],
                        border: '2px solid',
                        borderColor: 'background.paper',
                      }}
                    />
                    <Stack direction="row" spacing={1} alignItems="baseline">
                      <TimelineEventText
                        entry={t}
                        docByCode={docByCode}
                        onOpen={(docId) => setInspectorDocId(docId)}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(t.ts)}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Right rail */}
        <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', p: 2, minHeight: 0, display: 'flex' }}>
          <TriageAssistant exception={exception} />
        </Box>
      </Box>
      <DocumentInspector
        open={inspectorDocId !== null}
        documentId={inspectorDocId}
        onClose={() => setInspectorDocId(null)}
        onOpenDocument={(id) => setInspectorDocId(id)}
      />
    </SupplyChainPageLayout>
  );
}
