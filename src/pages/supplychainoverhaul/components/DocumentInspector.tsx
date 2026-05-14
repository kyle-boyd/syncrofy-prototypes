import React from 'react';
import { Box, Typography, Stack, Chip, Divider, Tabs, Tab, IconButton, Tooltip, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import { SideSheet } from '../../../components/SideSheet';
import {
  documentsById,
  relatedDocuments,
  type EdiDocument,
  type ParsedSegment,
} from '../fixtures/documents';
import { formatTimestamp } from '../lib/time';

export interface DocumentInspectorProps {
  open: boolean;
  documentId: string | null;
  onClose: () => void;
  onOpenDocument: (id: string) => void;
}

const STATUS_COLOR: Record<EdiDocument['status'], 'success' | 'error' | 'warning'> = {
  translated: 'success',
  failed: 'error',
  pending: 'warning',
  duplicate: 'warning',
};

const STATUS_LABEL: Record<EdiDocument['status'], string> = {
  translated: 'Translated',
  failed: 'Failed',
  pending: 'Pending',
  duplicate: 'Duplicate',
};

function HeaderField({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontFamily: mono ? 'monospace' : undefined, fontWeight: mono ? 600 : 400 }}>
        {value}
      </Typography>
    </Box>
  );
}

function SegmentNode({
  segment,
  depth,
  expandedIds,
  toggle,
  errorRef,
}: {
  segment: ParsedSegment;
  depth: number;
  expandedIds: Set<string>;
  toggle: (id: string) => void;
  errorRef: React.RefObject<HTMLDivElement>;
}) {
  const hasChildren = !!segment.children?.length;
  const isOpen = expandedIds.has(segment.id);
  const isError = !!segment.errorMessage;

  return (
    <Box>
      <Box
        ref={isError ? errorRef : undefined}
        sx={(t) => ({
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0.5,
          pl: depth * 2 + 0.5,
          pr: 1,
          py: 0.75,
          cursor: hasChildren ? 'pointer' : 'default',
          borderLeft: isError ? `3px solid ${t.palette.error.main}` : '3px solid transparent',
          bgcolor: isError ? alpha(t.palette.error.main, 0.06) : 'transparent',
          '&:hover': hasChildren ? { bgcolor: isError ? alpha(t.palette.error.main, 0.1) : 'action.hover' } : undefined,
        })}
        onClick={() => hasChildren && toggle(segment.id)}
      >
        <Box sx={{ width: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.25 }}>
          {hasChildren ? (
            isOpen ? <ExpandMoreIcon sx={{ fontSize: 16 }} /> : <ChevronRightIcon sx={{ fontSize: 16 }} />
          ) : null}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: isError ? 'error.main' : 'text.primary' }}>
              {segment.tag}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 0 }} noWrap>
              {segment.label}
            </Typography>
          </Stack>
          {segment.fields && segment.fields.length > 0 && (
            <Stack spacing={0.25} sx={{ mt: 0.5 }}>
              {segment.fields.map((f, i) => (
                <Stack key={i} direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ width: 140, flexShrink: 0 }}>
                    {f.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: f.mono ? 'monospace' : undefined, color: isError && f.value.includes('missing') ? 'error.main' : 'text.primary', fontWeight: f.mono ? 600 : 400 }}>
                    {f.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
          {isError && (
            <Stack direction="row" spacing={0.75} alignItems="flex-start" sx={{ mt: 0.75 }}>
              <ErrorOutlineIcon sx={{ fontSize: 14, color: 'error.main', mt: '2px' }} />
              <Typography variant="caption" sx={{ color: 'error.dark', lineHeight: 1.4 }}>
                {segment.errorMessage}
              </Typography>
            </Stack>
          )}
        </Box>
      </Box>
      {hasChildren && isOpen && (
        <Box>
          {segment.children!.map((child) => (
            <SegmentNode
              key={child.id}
              segment={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              toggle={toggle}
              errorRef={errorRef}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

function collectAncestorsOfError(segments: ParsedSegment[], targetId: string, trail: string[] = []): string[] | null {
  for (const s of segments) {
    if (s.id === targetId) return trail;
    if (s.children) {
      const found = collectAncestorsOfError(s.children, targetId, [...trail, s.id]);
      if (found) return found;
    }
  }
  return null;
}

function findFirstErrorId(segments: ParsedSegment[]): string | null {
  for (const s of segments) {
    if (s.errorMessage) return s.id;
    if (s.children) {
      const found = findFirstErrorId(s.children);
      if (found) return found;
    }
  }
  return null;
}

function StructuredTab({ doc }: { doc: EdiDocument }) {
  const errorRef = React.useRef<HTMLDivElement | null>(null);

  const initialExpanded = React.useMemo(() => {
    const set = new Set<string>();
    const errorId = doc.defaultExpandSegmentId ?? findFirstErrorId(doc.parsed);
    if (errorId) {
      const ancestors = collectAncestorsOfError(doc.parsed, errorId);
      if (ancestors) ancestors.forEach((a) => set.add(a));
    } else {
      doc.parsed.forEach((s) => set.add(s.id));
    }
    return set;
  }, [doc]);

  const [expanded, setExpanded] = React.useState<Set<string>>(initialExpanded);

  React.useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);

  React.useEffect(() => {
    if (errorRef.current) {
      errorRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [doc.id]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (doc.parsed.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          Structured view not available for this document in the prototype.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack divider={<Divider flexItem />} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
      {doc.parsed.map((s) => (
        <SegmentNode key={s.id} segment={s} depth={0} expandedIds={expanded} toggle={toggle} errorRef={errorRef as React.RefObject<HTMLDivElement>} />
      ))}
    </Stack>
  );
}

function RawTab({ doc }: { doc: EdiDocument }) {
  const [copied, setCopied] = React.useState(false);

  if (doc.raw.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          Raw EDI not available for this document in the prototype.
        </Typography>
      </Box>
    );
  }

  const handleCopy = () => {
    const text = doc.raw.map((l) => l.text).join('\n');
    void navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title={copied ? 'Copied' : 'Copy raw EDI'} arrow>
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
        >
          <ContentCopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'grey.900',
          color: 'grey.100',
          fontFamily: 'monospace',
          fontSize: 12,
          lineHeight: 1.55,
          p: 1.5,
          overflow: 'auto',
        }}
      >
        {doc.raw.map((line, i) => {
          const isError = !!line.errorMessage;
          return (
            <Box key={i}>
              <Box
                sx={(t) => ({
                  px: 0.75,
                  py: 0.25,
                  borderLeft: isError ? `3px solid ${t.palette.error.main}` : '3px solid transparent',
                  bgcolor: isError ? alpha(t.palette.error.main, 0.18) : 'transparent',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                })}
              >
                <Typography component="span" sx={{ color: 'grey.500', minWidth: 28, fontFamily: 'inherit', fontSize: 'inherit', userSelect: 'none' }}>
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Typography component="span" sx={{ color: isError ? 'error.light' : 'grey.100', flex: 1, fontFamily: 'inherit', fontSize: 'inherit' }}>
                  {line.text}
                </Typography>
                {isError && <ErrorOutlineIcon sx={{ fontSize: 14, color: 'error.light', mt: '2px' }} />}
              </Box>
              {isError && (
                <Box sx={(t) => ({ pl: 5, py: 0.5, color: 'error.light', bgcolor: alpha(t.palette.error.main, 0.08) })}>
                  <Typography variant="caption" sx={{ fontFamily: 'inherit', fontSize: 11 }}>
                    ↳ {line.errorMessage}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function RelatedTab({ doc, onOpen }: { doc: EdiDocument; onOpen: (id: string) => void }) {
  const related = relatedDocuments(doc);

  if (related.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 1.5 }}>
        <Typography variant="body2" color="text.secondary">No related documents in this transaction.</Typography>
      </Box>
    );
  }

  return (
    <Stack divider={<Divider flexItem />} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
      {related.map((r) => {
        const statusColor = STATUS_COLOR[r.status];
        return (
          <Box
            key={r.id}
            onClick={() => onOpen(r.id)}
            sx={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr auto auto',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {r.docType}
            </Typography>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" noWrap>{r.docName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {r.direction === 'inbound' ? 'Inbound' : 'Outbound'} · {r.partnerName}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatTimestamp(r.receivedAt)}
            </Typography>
            <Chip size="small" label={STATUS_LABEL[r.status]} color={statusColor} variant="outlined" sx={{ height: 20, fontSize: 11 }} />
          </Box>
        );
      })}
    </Stack>
  );
}

export function DocumentInspector({ open, documentId, onClose, onOpenDocument }: DocumentInspectorProps) {
  const doc = documentId ? documentsById[documentId] : undefined;
  const [tab, setTab] = React.useState<'structured' | 'raw' | 'related'>('structured');

  React.useEffect(() => {
    if (documentId) setTab('structured');
  }, [documentId]);

  if (!doc) {
    return (
      <SideSheet open={open} onClose={onClose} title="Document inspector" width={640}>
        <Typography variant="body2" color="text.secondary">No document selected.</Typography>
      </SideSheet>
    );
  }

  const statusColor = STATUS_COLOR[doc.status];
  const DirIcon = doc.direction === 'inbound' ? CallReceivedIcon : CallMadeIcon;

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      title={
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{doc.docType}</Typography>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>— {doc.docName}</Typography>
        </Stack>
      }
      width={680}
      footer={
        <Button variant="text" color="secondary" onClick={onClose}>Close</Button>
      }
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ rowGap: 0.5 }}>
          <Chip
            size="small"
            icon={<DirIcon sx={{ fontSize: 14 }} />}
            label={doc.direction === 'inbound' ? 'Inbound' : 'Outbound'}
            variant="outlined"
            sx={{ height: 22 }}
          />
          <Chip size="small" label={doc.partnerName} variant="outlined" sx={{ height: 22 }} />
          <Chip size="small" color={statusColor} label={STATUS_LABEL[doc.status]} sx={{ height: 22, fontWeight: 600 }} />
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1.5,
            p: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'grey.50',
          }}
        >
          <HeaderField label="ISA13" value={doc.controlNumbers.isa13} mono />
          <HeaderField label="GS06" value={doc.controlNumbers.gs06} mono />
          <HeaderField label="ST02" value={doc.controlNumbers.st02} mono />
          <HeaderField label="Received" value={formatTimestamp(doc.receivedAt)} />
        </Box>

        <Box>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0.5 } }}
          >
            <Tab value="structured" label="Structured" />
            <Tab value="raw" label="Raw EDI" />
            <Tab value="related" label="Related" />
          </Tabs>
          <Box sx={{ pt: 2 }}>
            {tab === 'structured' && <StructuredTab doc={doc} />}
            {tab === 'raw' && <RawTab doc={doc} />}
            {tab === 'related' && <RelatedTab doc={doc} onOpen={onOpenDocument} />}
          </Box>
        </Box>
      </Stack>
    </SideSheet>
  );
}

export default DocumentInspector;
