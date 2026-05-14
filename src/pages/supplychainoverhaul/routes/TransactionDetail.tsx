import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, Stack, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { LifecycleStrip, type LifecycleStage } from '../components/LifecycleStrip';
import { DocumentInspector } from '../components/DocumentInspector';
import { transactionsByPoId } from '../fixtures/transactions';
import type { Transaction, TransactionStatus } from '../fixtures/transactions';
import { partnersById } from '../fixtures/partners';
import { exceptionsById, type TimelineState } from '../fixtures/exceptions';
import { documents, type DocStage, type EdiDocument } from '../fixtures/documents';
import { computePriority } from '../lib/priority';
import { bandFor } from '../components/PriorityChip';
import { formatTimestamp } from '../lib/time';

const TIMELINE_DOT: Record<TimelineState, string> = {
  ok: 'success.main',
  pending: 'info.main',
  warn: 'warning.main',
  breach: 'error.main',
  info: 'info.light',
  future: 'grey.300',
};

const STATUS_TONE: Record<TransactionStatus, { label: string; bg: string; fg: string }> = {
  'on-track': { label: 'On track', bg: 'success.main', fg: 'common.white' },
  'at-risk': { label: 'At risk', bg: 'warning.main', fg: 'common.white' },
  breached: { label: 'Breached', bg: 'error.main', fg: 'common.white' },
  complete: { label: 'Complete', bg: 'grey.400', fg: 'common.white' },
};

const LIFECYCLE_TO_DOC_STAGE: Record<LifecycleStage, DocStage[]> = {
  '850': ['850'],
  '855': ['855'],
  '856': ['856'],
  Receipt: ['Receipt'],
  Invoice: ['810'],
};

const BAND_BG: Record<ReturnType<typeof bandFor>, string> = {
  critical: 'error.main',
  high: 'warning.main',
  medium: 'info.main',
  low: 'grey.400',
};

const formatUSD = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function timeAgo(iso: string, now: Date = new Date('2026-05-06T12:00:00Z')): string {
  const ms = now.getTime() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const DOC_CODE_RE = /\b(850|855|856|810|940|997)\b/g;

function findDocsForTransaction(t: Transaction): EdiDocument[] {
  const exIds = new Set(t.openExceptionIds);
  return documents.filter((d) => d.exceptionId && exIds.has(d.exceptionId));
}

export default function TransactionDetail() {
  const { poId } = useParams();
  const navigate = useNavigate();
  const transaction = poId ? transactionsByPoId[poId] : undefined;
  const [inspectorDocId, setInspectorDocId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const txnDocs = useMemo(
    () => (transaction ? findDocsForTransaction(transaction) : []),
    [transaction],
  );

  const docByLifecycleStage = useMemo(() => {
    const m = new Map<LifecycleStage, EdiDocument>();
    if (!transaction) return m;
    (Object.keys(LIFECYCLE_TO_DOC_STAGE) as LifecycleStage[]).forEach((stage) => {
      for (const docStage of LIFECYCLE_TO_DOC_STAGE[stage]) {
        const found = txnDocs.find((d) => d.stage === docStage);
        if (found) {
          m.set(stage, found);
          break;
        }
      }
    });
    return m;
  }, [transaction, txnDocs]);

  const docByCode = useMemo(() => {
    const m = new Map<string, EdiDocument>();
    txnDocs.forEach((d) => {
      if (!m.has(d.docType)) m.set(d.docType, d);
    });
    return m;
  }, [txnDocs]);

  const clickableStages = useMemo(() => {
    const set = new Set<LifecycleStage>();
    docByLifecycleStage.forEach((_, stage) => set.add(stage));
    return set;
  }, [docByLifecycleStage]);

  const handleStageClick = (stage: LifecycleStage) => {
    const doc = docByLifecycleStage.get(stage);
    if (doc) setInspectorDocId(doc.id);
  };

  if (!transaction) {
    return (
      <SupplyChainPageLayout>
        <Typography variant="h5" gutterBottom>Transaction not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {poId ? `No transaction with PO id "${poId}".` : 'No PO id provided.'}
        </Typography>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => navigate('/supplychainoverhaul/transactions')}>
          Back to transactions
        </Button>
      </SupplyChainPageLayout>
    );
  }

  const partner = partnersById[transaction.partnerId];
  const statusTone = STATUS_TONE[transaction.status];
  const openExceptions = transaction.openExceptionIds
    .map((id) => exceptionsById[id])
    .filter((ex): ex is NonNullable<typeof ex> => Boolean(ex));

  return (
    <SupplyChainPageLayout>
      <Button
        variant="text"
        size="small"
        startIcon={<ArrowBackIcon fontSize="small" />}
        onClick={() => navigate('/supplychainoverhaul/transactions')}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Transactions
      </Button>

      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
              {transaction.poId}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              · {partner?.name ?? '—'}
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: statusTone.bg,
                color: statusTone.fg,
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusTone.fg }} />
              <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.04em' }}>
                {statusTone.label}
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {transaction.lineItemCount} line items · {formatUSD(transaction.totalValueUSD)} · opened {timeAgo(transaction.openedAt)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon fontSize="small" />}
            onClick={() => setToast('Refreshed transaction state')}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon fontSize="small" />}
            onClick={() => setToast('Export started')}
          >
            Export
          </Button>
        </Stack>
      </Stack>

      {/* Section 1 — Lifecycle */}
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
          timeline={transaction.timeline}
          clickableStages={clickableStages}
          onStageClick={handleStageClick}
        />
      </Box>

      {/* Section 2 — Timeline */}
      <Box sx={{ mb: 3 }}>
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
            {transaction.timeline.map((entry, i) => {
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
                    <Box
                      key={`${match.index}-${code}`}
                      component="button"
                      type="button"
                      onClick={() => setInspectorDocId(doc.id)}
                      sx={{
                        all: 'unset',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: 'primary.main',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {code}
                    </Box>,
                  );
                } else {
                  parts.push(code);
                }
                lastIndex = match.index + code.length;
              }
              if (lastIndex < text.length) parts.push(text.slice(lastIndex));
              return (
                <Box key={i} sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -22,
                      top: 6,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: TIMELINE_DOT[entry.state],
                      border: '2px solid',
                      borderColor: 'background.paper',
                      boxShadow: (th) => `0 0 0 2px ${th.palette.divider}`,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {formatTimestamp(entry.ts)}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {parts.map((p, idx) => (
                      <React.Fragment key={idx}>{p}</React.Fragment>
                    ))}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>

      {/* Section 3 — Open exceptions */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          Open exceptions on this transaction
        </Typography>
        {openExceptions.length === 0 ? (
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1.5,
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              color: 'text.secondary',
            }}
          >
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
            <Typography variant="body2">No open exceptions on this transaction.</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              bgcolor: 'background.paper',
              overflow: 'hidden',
            }}
          >
            {openExceptions.map((ex, i) => {
              const score = computePriority(ex);
              const band = bandFor(score);
              return (
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
                    gridTemplateColumns: '40px minmax(0, 1fr) 110px 140px',
                    gap: 1.5,
                    alignItems: 'center',
                    px: 2,
                    py: 1.25,
                    borderBottom: i < openExceptions.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    outline: 'none',
                    '&:hover': { bgcolor: 'grey.50' },
                    '&:focus-visible': { bgcolor: 'grey.50', boxShadow: (th) => `inset 0 0 0 2px ${th.palette.primary.main}` },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 24,
                      borderRadius: 1,
                      bgcolor: BAND_BG[band],
                      color: band === 'low' ? 'text.primary' : 'common.white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {score}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{ex.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ex.id} · {ex.ediDocType} · age {ex.age}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {ex.assignee ?? 'Unassigned'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    sev {ex.severity}/5
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <DocumentInspector
        open={inspectorDocId !== null}
        documentId={inspectorDocId}
        onClose={() => setInspectorDocId(null)}
        onOpenDocument={(id) => setInspectorDocId(id)}
      />

      <Snackbar
        open={toast !== null}
        autoHideDuration={1800}
        onClose={() => setToast(null)}
        message={toast ?? ''}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </SupplyChainPageLayout>
  );
}
