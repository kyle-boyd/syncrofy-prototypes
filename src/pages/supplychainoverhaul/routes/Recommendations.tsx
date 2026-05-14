import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  Link,
  Divider,
} from '@mui/material';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { SideSheet } from '../../../components/SideSheet';
import { RecommendationCard } from '../ai/RecommendationCard';
import {
  recommendations,
  type Recommendation,
  type RecommendationType,
  type RecommendationConfidence as RecConfidence,
  type RecommendationStatus,
} from '../fixtures/recommendations';
import { exceptionsById } from '../fixtures/exceptions';
import { formatTimestamp } from '../lib/time';

const TODAY = new Date('2026-05-06T12:00:00Z');

type StatusFilter = 'all' | RecommendationStatus;
type TypeFilter = 'all' | RecommendationType;
type ConfidenceFilter = 'all' | RecConfidence;
type DateFilter = '7d' | '14d' | '30d' | 'custom';

const TYPE_LABEL: Record<RecommendationType, string> = {
  reassign: 'Reassign',
  snooze: 'Snooze',
  escalate: 'Escalate',
  resolve: 'Resolve',
  'rule-suggested': 'Rule',
  'request-redelivery': 'Request redelivery',
  'categorize-sender': 'Categorize sender',
};

const STATUS_TONE: Record<
  RecommendationStatus,
  { label: string; dot: string; fg: string }
> = {
  accepted: { label: 'Accepted', dot: 'success.main', fg: 'success.dark' },
  dismissed: { label: 'Dismissed', dot: 'grey.400', fg: 'text.secondary' },
  overridden: { label: 'Overridden', dot: 'warning.main', fg: 'warning.dark' },
};

const CONFIDENCE_TONE: Record<RecConfidence, { label: string; dot: string }> = {
  high: { label: 'High', dot: 'success.main' },
  moderate: { label: 'Moderate', dot: 'warning.main' },
  exploratory: { label: 'Exploratory', dot: 'grey.400' },
};

function StatusPill({ r }: { r: Recommendation }) {
  const t = STATUS_TONE[r.status];
  const dot = (
    <Box
      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: t.dot, flex: '0 0 auto' }}
    />
  );
  const content = (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      {dot}
      <Typography variant="caption" sx={{ color: t.fg, fontWeight: 500 }}>
        {t.label}
      </Typography>
    </Stack>
  );
  if (r.status === 'overridden' && r.actionTaken) {
    return (
      <Tooltip title={`Operator chose: ${TYPE_LABEL[r.actionTaken]}`} arrow>
        <Box sx={{ cursor: 'default' }}>{content}</Box>
      </Tooltip>
    );
  }
  return content;
}

function ConfidenceCell({ confidence }: { confidence: RecConfidence }) {
  const t = CONFIDENCE_TONE[confidence];
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: t.dot, flex: '0 0 auto' }} />
      <Typography variant="caption" color="text.secondary">
        {t.label}
      </Typography>
    </Stack>
  );
}

function dateCutoff(d: DateFilter): Date | null {
  const now = TODAY.getTime();
  if (d === '7d') return new Date(now - 7 * 24 * 60 * 60 * 1000);
  if (d === '14d') return new Date(now - 14 * 24 * 60 * 60 * 1000);
  if (d === '30d') return new Date(now - 30 * 24 * 60 * 60 * 1000);
  return null;
}

const DEFAULT_STATUS: StatusFilter = 'all';
const DEFAULT_TYPE: TypeFilter = 'all';
const DEFAULT_CONFIDENCE: ConfidenceFilter = 'all';
const DEFAULT_DATE: DateFilter = '14d';

export default function Recommendations() {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState<'audit' | 'outcomes'>('audit');
  const [status, setStatus] = React.useState<StatusFilter>(DEFAULT_STATUS);
  const [type, setType] = React.useState<TypeFilter>(DEFAULT_TYPE);
  const [confidence, setConfidence] = React.useState<ConfidenceFilter>(DEFAULT_CONFIDENCE);
  const [dateRange, setDateRange] = React.useState<DateFilter>(DEFAULT_DATE);
  const [openId, setOpenId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const cutoff = dateCutoff(dateRange);
    return recommendations.filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (type !== 'all' && r.type !== type) return false;
      if (confidence !== 'all' && r.confidence !== confidence) return false;
      if (cutoff && new Date(r.timestamp) < cutoff) return false;
      return true;
    });
  }, [status, type, confidence, dateRange]);

  const acceptanceRate = React.useMemo(() => {
    if (filtered.length === 0) return 0;
    const accepted = filtered.filter((r) => r.status === 'accepted').length;
    return Math.round((accepted / filtered.length) * 100);
  }, [filtered]);

  const resetFilters = () => {
    setStatus(DEFAULT_STATUS);
    setType(DEFAULT_TYPE);
    setConfidence(DEFAULT_CONFIDENCE);
    setDateRange(DEFAULT_DATE);
  };

  const openRec = openId ? recommendations.find((r) => r.id === openId) ?? null : null;

  return (
    <SupplyChainPageLayout>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h4">Recommendations</Typography>
        <Typography variant="body2" color="text.secondary">
          Every recommendation the system has made, what you decided, and the outcome.
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: 36,
          '& .MuiTab-root': { minHeight: 36, textTransform: 'none' },
        }}
      >
        <Tab value="audit" label="Audit log" />
        <Tab
          value="outcomes"
          disabled
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>Outcomes</span>
              <Typography
                component="span"
                variant="caption"
                sx={{
                  color: 'text.disabled',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontSize: 10,
                }}
              >
                Coming with telemetry phase
              </Typography>
            </Stack>
          }
        />
      </Tabs>

      {/* Filter bar */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="dismissed">Dismissed</MenuItem>
            <MenuItem value="overridden">Overridden</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as TypeFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            {(Object.keys(TYPE_LABEL) as RecommendationType[]).map((t) => (
              <MenuItem key={t} value={t}>
                {TYPE_LABEL[t]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="confidence-label">Confidence</InputLabel>
          <Select
            labelId="confidence-label"
            label="Confidence"
            value={confidence}
            onChange={(e) => setConfidence(e.target.value as ConfidenceFilter)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="exploratory">Exploratory</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="date-label">Date range</InputLabel>
          <Select
            labelId="date-label"
            label="Date range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateFilter)}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="14d">Last 14 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="custom" disabled>
              Custom…
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Table */}
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
            gridTemplateColumns:
              '160px 130px minmax(0, 2.4fr) 130px 130px 140px 110px',
            gap: 1.5,
            px: 2,
            py: 1,
            bgcolor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.secondary',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <Box>Timestamp</Box>
          <Box>Type</Box>
          <Box>Headline</Box>
          <Box>Confidence</Box>
          <Box>Status</Box>
          <Box>Operator</Box>
          <Box>Linked</Box>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              No recommendations match these filters.
            </Typography>
            <Button variant="outlined" color="primary" size="small" onClick={resetFilters}>
              Reset filters
            </Button>
          </Box>
        ) : (
          filtered.map((r, i) => {
            const linked = exceptionsById[r.exceptionId];
            return (
              <Box
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => setOpenId(r.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenId(r.id);
                  }
                }}
                sx={{
                  display: 'grid',
                  gridTemplateColumns:
                    '160px 130px minmax(0, 2.4fr) 130px 130px 140px 110px',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  cursor: 'pointer',
                  borderBottom: i < filtered.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  outline: 'none',
                  '&:hover': { bgcolor: 'grey.50' },
                  '&:focus-visible': { bgcolor: 'grey.50', boxShadow: (t) => `inset 0 0 0 2px ${t.palette.primary.main}` },
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {formatTimestamp(r.timestamp)}
                </Typography>
                <Typography variant="body2">{TYPE_LABEL[r.type]}</Typography>
                <Typography variant="body2" sx={{ color: 'text.primary' }} noWrap>
                  {r.headline}
                </Typography>
                <ConfidenceCell confidence={r.confidence} />
                <StatusPill r={r} />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {r.operator}
                </Typography>
                {linked ? (
                  <Link
                    component={RouterLink}
                    to={`/supplychainoverhaul/exception/${r.exceptionId}`}
                    onClick={(e) => e.stopPropagation()}
                    underline="hover"
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: 12 }}
                  >
                    {r.exceptionId}
                  </Link>
                ) : (
                  <Tooltip title="Historical exception not in current dataset" arrow>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.disabled', cursor: 'default' }}
                    >
                      {r.exceptionId}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
            );
          })
        )}
      </Box>

      {/* Footer summary */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="baseline"
        sx={{ mt: 2, color: 'text.secondary' }}
      >
        <Typography variant="caption">
          Showing {filtered.length} of {recommendations.length} recommendations
        </Typography>
        <Typography variant="caption">·</Typography>
        <Tooltip
          title="Acceptance rate is shown for context. Quality of recommendations should be evaluated against outcomes, not acceptance — see Outcomes tab when available."
          arrow
          placement="top"
        >
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', textDecoration: 'underline dotted', cursor: 'help' }}
          >
            {acceptanceRate}% acceptance rate
          </Typography>
        </Tooltip>
      </Stack>

      {/* Detail side panel */}
      <SideSheet
        open={Boolean(openRec)}
        onClose={() => setOpenId(null)}
        title="Recommendation detail"
        width={480}
      >
        {openRec && <RecommendationDetailPanel r={openRec} onOpenException={(id) => {
          setOpenId(null);
          navigate(`/supplychainoverhaul/exception/${id}`);
        }} />}
      </SideSheet>
    </SupplyChainPageLayout>
  );
}

function RecommendationDetailPanel({
  r,
  onOpenException,
}: {
  r: Recommendation;
  onOpenException: (id: string) => void;
}) {
  const noop = () => {};
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            When
          </Typography>
          <Typography variant="body2">{formatTimestamp(r.timestamp)}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Type
          </Typography>
          <Typography variant="body2">{TYPE_LABEL[r.type]}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Operator
          </Typography>
          <Typography variant="body2">{r.operator}</Typography>
        </Box>
      </Stack>

      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1 }}>
          As shown at the time
        </Typography>
        <Box sx={{ pointerEvents: 'none', opacity: 0.95 }}>
          <RecommendationCard
            confidence={r.confidence}
            headline={r.headline}
            reasoning={r.reasoning}
            provenance={[{ label: r.exceptionId }]}
            primaryAction={{ label: TYPE_LABEL[r.type], onClick: noop }}
            onDismiss={noop}
          />
        </Box>
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1 }}>
          Operator action
        </Typography>
        <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'grey.50' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: r.status === 'overridden' ? 0.75 : 0 }}>
            <StatusPill r={r} />
            <Typography variant="body2" color="text.secondary">
              by {r.operator}
            </Typography>
          </Stack>
          {r.status === 'overridden' && r.actionTaken && (
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              Chose <strong>{TYPE_LABEL[r.actionTaken]}</strong> instead of the recommended{' '}
              <strong>{TYPE_LABEL[r.type]}</strong>.
            </Typography>
          )}
        </Box>
      </Box>

      <Divider />

      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1 }}>
          Linked exception
        </Typography>
        {exceptionsById[r.exceptionId] ? (
          <Button variant="outlined" size="small" onClick={() => onOpenException(r.exceptionId)}>
            Open {r.exceptionId}
          </Button>
        ) : (
          <Typography variant="body2" color="text.disabled">
            {r.exceptionId} — historical, not in current dataset
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
