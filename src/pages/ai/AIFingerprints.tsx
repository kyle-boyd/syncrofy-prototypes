import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Collapse,
  Chip,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Divider,
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import { Tag, Button, Modal, PageHeader } from '@design-system';
import { PageLayout } from '../../components/PageLayout';
import {
  fingerprints,
  getTransfersByFingerprint,
  type Fingerprint,
  type CauseCategory,
} from './data';

function getSeverityTag(severity: 'critical' | 'high' | 'medium') {
  switch (severity) {
    case 'critical':
      return <Tag label="Critical" variant="error" icon={<ErrorIcon />} size="small" />;
    case 'high':
      return <Tag label="High" variant="warning" icon={<WarningAmberIcon />} size="small" />;
    case 'medium':
      return <Tag label="Medium" variant="info" icon={<InfoIcon />} size="small" />;
  }
}

function getCauseBadgeColor(category: CauseCategory) {
  switch (category) {
    case 'internal':
      return { bg: 'rgba(211, 47, 47, 0.08)', color: 'error.main', border: 'rgba(211, 47, 47, 0.3)' };
    case 'external':
      return { bg: 'rgba(237, 108, 2, 0.08)', color: 'warning.dark', border: 'rgba(237, 108, 2, 0.3)' };
    case 'environmental':
      return { bg: 'rgba(2, 136, 209, 0.08)', color: 'info.main', border: 'rgba(2, 136, 209, 0.3)' };
  }
}

function MiniSparkline({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const barWidth = 18;
  const height = 32;
  return (
    <Stack direction="row" spacing={0.25} alignItems="flex-end" sx={{ height }}>
      {data.map((d) => (
        <Box
          key={d.date}
          title={`${d.date}: ${d.count}`}
          sx={{
            width: barWidth,
            height: d.count === 0 ? 2 : (d.count / max) * height,
            backgroundColor: d.count === 0 ? 'grey.200' : 'error.main',
            borderRadius: '2px 2px 0 0',
            opacity: d.count === 0 ? 0.5 : 0.8,
            transition: 'height 0.2s',
          }}
        />
      ))}
    </Stack>
  );
}

function FingerprintCard({
  fp,
  expanded,
  highlighted,
  onToggle,
  onResolve,
}: {
  fp: Fingerprint;
  expanded: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onResolve: () => void;
}) {
  const navigate = useNavigate();
  const memberTransfers = getTransfersByFingerprint(fp.id);
  const causeColors = getCauseBadgeColor(fp.possibleCause.category);

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: highlighted ? 'warning.main' : 'divider',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
        borderLeft: '4px solid',
        borderLeftColor:
          fp.severity === 'critical'
            ? 'error.main'
            : fp.severity === 'high'
              ? 'warning.main'
              : 'info.main',
        transition: 'box-shadow 0.2s',
        ...(highlighted && {
          boxShadow: '0 0 0 2px rgba(230, 81, 0, 0.2)',
        }),
      }}
    >
      {/* Card header - always visible */}
      <Box
        sx={{
          px: 3,
          py: 2,
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'action.hover' },
        }}
        onClick={onToggle}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <FingerprintIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="subtitle1" fontWeight={600}>
                {fp.name}
              </Typography>
              {getSeverityTag(fp.severity)}
            </Stack>
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Occurrences:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {fp.occurrenceCount}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Partners:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {fp.affectedPartners.join(', ')}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Protocol:
                </Typography>
                <Typography variant="body2">{fp.protocol}</Typography>
              </Stack>
              {fp.pastResolutions.length > 0 && (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                  label="Has resolution"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    color: 'success.dark',
                    border: '1px solid',
                    borderColor: 'rgba(46, 125, 50, 0.3)',
                  }}
                />
              )}
            </Stack>
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            <MiniSparkline data={fp.occurrenceTimeline} />
            {expanded ? (
              <ExpandLessIcon sx={{ color: 'text.secondary' }} />
            ) : (
              <ExpandMoreIcon sx={{ color: 'text.secondary' }} />
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Expanded content */}
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ px: 3, py: 2 }}>
          <Stack spacing={3}>
            {/* Error signature */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Error Signature
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', fontSize: '13px', color: 'error.main' }}
              >
                [{fp.errorCode}] {fp.errorSignature}
              </Typography>
            </Box>

            {/* Time pattern */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Time Pattern
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2">{fp.timePattern}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  First seen: {fp.firstSeen}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  \u00B7
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last seen: {fp.lastSeen}
                </Typography>
              </Stack>
            </Box>

            {/* Occurrence timeline */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Occurrence Timeline (Last 7 Days)
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="flex-end">
                {fp.occurrenceTimeline.map((d) => {
                  const max = Math.max(...fp.occurrenceTimeline.map((x) => x.count), 1);
                  const barH = d.count === 0 ? 3 : (d.count / max) * 48;
                  return (
                    <Stack key={d.date} alignItems="center" spacing={0.5}>
                      <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 600 }}>
                        {d.count > 0 ? d.count : ''}
                      </Typography>
                      <Box
                        sx={{
                          width: 28,
                          height: barH,
                          backgroundColor: d.count === 0 ? 'grey.200' : 'error.main',
                          borderRadius: '3px 3px 0 0',
                          opacity: d.count === 0 ? 0.4 : 0.85,
                        }}
                      />
                      <Typography variant="caption" sx={{ fontSize: '10px', color: 'text.secondary' }}>
                        {d.date.slice(5)}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>

            <Divider />

            {/* Possible cause / blame attribution */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Possible Cause
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: causeColors.bg,
                  border: '1px solid',
                  borderColor: causeColors.border,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Chip
                    label={fp.possibleCause.category.charAt(0).toUpperCase() + fp.possibleCause.category.slice(1)}
                    size="small"
                    sx={{
                      backgroundColor: causeColors.bg,
                      color: causeColors.color,
                      border: '1px solid',
                      borderColor: causeColors.border,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Confidence: {fp.possibleCause.confidence}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Evidence suggests: {fp.possibleCause.evidence}
                </Typography>
              </Box>
            </Box>

            {/* Why this cluster? */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Why this cluster?
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Matched signals:
                </Typography>
                <Stack spacing={0.5}>
                  {fp.matchedSignals.map((signal, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="center">
                      <LinkIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace', fontSize: '12px' }}
                      >
                        {signal}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Box>

            {/* Past resolutions */}
            {fp.pastResolutions.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Past Resolutions
                </Typography>
                {fp.pastResolutions.map((res) => {
                  const resColors = getCauseBadgeColor(res.causeCategory);
                  return (
                    <Box
                      key={res.id}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: 'rgba(46, 125, 50, 0.04)',
                        border: '1px solid',
                        borderColor: 'rgba(46, 125, 50, 0.2)',
                        mb: 1,
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                        <Typography variant="body2" fontWeight={600}>
                          Suggested Resolution
                        </Typography>
                        <Chip
                          label={res.causeCategory}
                          size="small"
                          sx={{
                            backgroundColor: resColors.bg,
                            color: resColors.color,
                            border: '1px solid',
                            borderColor: resColors.border,
                            textTransform: 'capitalize',
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                        {res.description}
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {res.resolvedBy}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <HistoryIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {res.date}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Member transfers */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Member Transfers ({memberTransfers.length})
              </Typography>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                {memberTransfers.map((t, i) => (
                  <Box
                    key={t.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderBottom: i < memberTransfers.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      '&:hover': { backgroundColor: 'action.hover' },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/ai/transfers`)}
                  >
                    <Tag label="Failed" variant="error" icon={<ErrorIcon />} size="small" />
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: '13px', flex: 1 }}
                    >
                      {t.fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.timestamp}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Resolve button for unresolved */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={onResolve}>
                Resolve Fingerprint
              </Button>
            </Box>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

export default function AIFingerprints() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const [expandedId, setExpandedId] = useState<string | null>(highlightId);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolvingFp, setResolvingFp] = useState<Fingerprint | null>(null);
  const [resolveCategory, setResolveCategory] = useState<CauseCategory>('external');
  const [resolveDescription, setResolveDescription] = useState('');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  // Auto-expand highlighted fingerprint
  useEffect(() => {
    if (highlightId) {
      setExpandedId(highlightId);
      // Scroll into view after a short delay
      setTimeout(() => {
        const el = document.getElementById(`fp-${highlightId}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [highlightId]);

  const handleResolve = () => {
    if (resolvingFp) {
      setResolvedIds((prev) => new Set(prev).add(resolvingFp.id));
      setResolveModalOpen(false);
      setResolvingFp(null);
      setResolveCategory('external');
      setResolveDescription('');
    }
  };

  return (
    <PageLayout selectedNavItem="transfers">
      <PageHeader
        title="Failure Fingerprints"
        showBreadcrumb={false}
        showInfoIcon={false}
      />
      <Box sx={{ pb: 3 }}>
        {/* Summary */}
        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Active Fingerprints
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {fingerprints.length}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Total Failures Clustered
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {fingerprints.reduce((sum, fp) => sum + fp.occurrenceCount, 0)}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              With Past Resolution
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {fingerprints.filter((fp) => fp.pastResolutions.length > 0).length}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Resolved This Session
            </Typography>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {resolvedIds.size}
            </Typography>
          </Box>
        </Stack>

        {/* Fingerprint cards */}
        <Stack spacing={2}>
          {fingerprints.map((fp) => (
            <Box key={fp.id} id={`fp-${fp.id}`}>
              {resolvedIds.has(fp.id) ? (
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: 'rgba(46, 125, 50, 0.3)',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                    borderLeft: '4px solid',
                    borderLeftColor: 'success.main',
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {fp.name}
                    </Typography>
                    <Tag label="Resolved" variant="success" size="small" />
                  </Stack>
                </Box>
              ) : (
                <FingerprintCard
                  fp={fp}
                  expanded={expandedId === fp.id}
                  highlighted={highlightId === fp.id}
                  onToggle={() =>
                    setExpandedId(expandedId === fp.id ? null : fp.id)
                  }
                  onResolve={() => {
                    setResolvingFp(fp);
                    setResolveModalOpen(true);
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Resolve modal */}
      <Modal
        open={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Fingerprint"
        maxWidth="sm"
        actions={
          <>
            <Button
              variant="text"
              color="secondary"
              onClick={() => setResolveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleResolve}
              disabled={!resolveDescription.trim()}
            >
              Submit Resolution
            </Button>
          </>
        }
      >
        <Stack spacing={3}>
          {resolvingFp && (
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <FingerprintIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={600}>
                  {resolvingFp.name}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {resolvingFp.occurrenceCount} occurrences \u00B7 {resolvingFp.affectedPartners.join(', ')}
              </Typography>
            </Box>
          )}

          <FormControl>
            <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Cause Category</FormLabel>
            <RadioGroup
              value={resolveCategory}
              onChange={(e) => setResolveCategory(e.target.value as CauseCategory)}
            >
              <FormControlLabel
                value="internal"
                control={<Radio size="small" />}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">Internal</Typography>
                    <Typography variant="caption" color="text.secondary">
                      \u2014 our systems, config, or certificates
                    </Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="external"
                control={<Radio size="small" />}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">External</Typography>
                    <Typography variant="caption" color="text.secondary">
                      \u2014 partner-side issue
                    </Typography>
                  </Stack>
                }
              />
              <FormControlLabel
                value="environmental"
                control={<Radio size="small" />}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">Environmental</Typography>
                    <Typography variant="caption" color="text.secondary">
                      \u2014 network, DNS, cloud provider
                    </Typography>
                  </Stack>
                }
              />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Resolution description"
            multiline
            rows={4}
            size="small"
            value={resolveDescription}
            onChange={(e) => setResolveDescription(e.target.value)}
            placeholder="Describe the root cause and what was done to fix it..."
            helperText="This description will be linked to the fingerprint and suggested if this pattern recurs."
          />
        </Stack>
      </Modal>
    </PageLayout>
  );
}
