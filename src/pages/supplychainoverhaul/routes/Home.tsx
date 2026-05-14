import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Link,
  Divider,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import { PriorityChip } from '../components/PriorityChip';
import { StatTile } from '../components/StatTile';
import { PatternBanner } from '../ai/PatternBanner';
import { DraftRuleDrawer } from '../components/DraftRuleDrawer';
import { useUncategorizedSenders, totalDocsHeld } from '../lib/uncategorizedStore';
import type { ConfidenceLabel } from '../types/uncategorized';
import { exceptions } from '../fixtures/exceptions';
import { partnersById } from '../fixtures/partners';
import { recommendations, type Recommendation } from '../fixtures/recommendations';
import { computePriority } from '../lib/priority';
import { formatTimeToBreach, formatTimestamp, type TimeSeverity } from '../lib/time';
import type { RecommendationDisplayState } from '../ai/RecommendationCard';

const TTB_COLOR: Record<TimeSeverity, string> = {
  critical: 'error.main',
  warn: 'warning.main',
  neutral: 'text.primary',
};

const STATUS_LABEL: Record<Recommendation['status'], string> = {
  accepted: 'Accepted',
  dismissed: 'Dismissed',
  overridden: 'Overridden',
};

interface PersonaOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const PERSONAS: PersonaOption[] = [
  { value: 'edi-manager', label: 'EDI Manager' },
  { value: 'tpm', label: 'Trading Partner Manager', disabled: true },
  { value: 'logistics', label: 'Logistics Coordinator', disabled: true },
  { value: 'exec', label: 'Supply Chain Exec', disabled: true },
];

function StatusBadge({ status }: { status: Recommendation['status'] }) {
  const theme = useTheme();
  const tone =
    status === 'accepted'
      ? { bg: alpha(theme.palette.success.main, 0.1), fg: theme.palette.success.dark }
      : status === 'overridden'
      ? { bg: alpha(theme.palette.warning.main, 0.12), fg: theme.palette.warning.dark }
      : { bg: theme.palette.grey[100], fg: theme.palette.text.secondary };
  return (
    <Chip
      label={STATUS_LABEL[status]}
      size="small"
      sx={{
        height: 20,
        fontSize: 11,
        fontWeight: 500,
        bgcolor: tone.bg,
        color: tone.fg,
        border: 'none',
      }}
    />
  );
}

const DISMISS_KEY = 'syncrofy:uncategorized-banner-dismissed-until';

function highestConfidence(confs: ConfidenceLabel[]): ConfidenceLabel {
  if (confs.includes('high')) return 'high';
  if (confs.includes('moderate')) return 'moderate';
  if (confs.includes('exploratory')) return 'exploratory';
  return 'none';
}

function timeAgoShort(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.max(1, Math.round(diff / 60000));
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const BANNER_CONF_COLOR: Record<ConfidenceLabel, string> = {
  high: 'success.main',
  moderate: 'warning.main',
  exploratory: 'grey.400',
  none: 'grey.400',
};

function UncategorizedBanner({
  onReview,
  onDismiss,
}: {
  onReview: () => void;
  onDismiss: () => void;
}) {
  const senders = useUncategorizedSenders();
  if (senders.length === 0) return null;

  const conf = highestConfidence(senders.map((s) => s.recommendation.overallConfidence));
  const mostRecent = [...senders].sort(
    (a, b) => new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime(),
  )[0];
  const docsHeld = totalDocsHeld(senders);
  const envelope = `${mostRecent.envelope.qualifier} / ${mostRecent.envelope.value}${
    mostRecent.envelope.subValue ? ' / ' + mostRecent.envelope.subValue : ''
  }`;

  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: '4px solid',
        borderLeftColor: BANNER_CONF_COLOR[conf],
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        p: 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: BANNER_CONF_COLOR[conf],
          mt: 0.75,
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {senders.length} uncategorized sender{senders.length === 1 ? '' : 's'} detected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Documents from {senders.length} sender{senders.length === 1 ? '' : 's'} ({docsHeld}{' '}
          document{docsHeld === 1 ? '' : 's'} total) are held pending categorization.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Most recent: <Box component="span" sx={{ fontFamily: 'monospace' }}>{envelope}</Box>, first
          seen {timeAgoShort(mostRecent.firstSeenAt)}
        </Typography>
      </Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
        <Link
          component="button"
          variant="caption"
          underline="hover"
          color="text.secondary"
          onClick={onDismiss}
          sx={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Dismiss for 1 hour
        </Link>
        <Box
          role="button"
          tabIndex={0}
          onClick={onReview}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onReview();
            }
          }}
          sx={{
            px: 1.5,
            py: 0.75,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 1,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            '&:hover': { filter: 'brightness(1.08)' },
          }}
        >
          Review uncategorized →
        </Box>
      </Stack>
    </Box>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [persona, setPersona] = React.useState('edi-manager');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [bannerState, setBannerState] = React.useState<RecommendationDisplayState>('idle');
  const [bannerVisible, setBannerVisible] = React.useState(() => {
    if (typeof window === 'undefined') return true;
    const until = Number(window.sessionStorage.getItem(DISMISS_KEY) ?? '0');
    return Date.now() >= until;
  });

  const dismissBanner = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        DISMISS_KEY,
        String(Date.now() + 60 * 60 * 1000),
      );
    }
    setBannerVisible(false);
  };

  const topFive = React.useMemo(
    () =>
      exceptions
        .map((e) => ({ ex: e, score: computePriority(e) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    [],
  );

  const recentFive = React.useMemo(
    () =>
      [...recommendations]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5),
    [],
  );

  return (
    <SupplyChainPageLayout>
      {/* Greeting + persona */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Good afternoon, EDI Manager</Typography>
          <Typography variant="body2" color="text.secondary">
            Here's what needs your attention today.
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <Select value={persona} onChange={(e) => setPersona(e.target.value)}>
            {PERSONAS.map((p) => (
              <MenuItem key={p.value} value={p.value} disabled={p.disabled}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                  <span>{p.label}</span>
                  {p.disabled && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ color: 'text.disabled', ml: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                    >
                      phase 2
                    </Typography>
                  )}
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Stat strip */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <StatTile label="Open exceptions" value={12} trend="+2 vs. yesterday" tone="neutral" />
        <StatTile label="Breach risk" value={3} trend="next 30 minutes" tone="critical" />
        <StatTile label="OTIF today" value="96.1%" trend="target 98%" tone="warn" />
        <StatTile label="Resolved today" value={47} trend="median 18m to resolve" tone="success" />
      </Stack>

      {/* Uncategorized senders banner (operationally more urgent than rule
          suggestions, so it renders first) */}
      {bannerVisible && (
        <Box sx={{ mb: 2 }}>
          <UncategorizedBanner
            onReview={() =>
              navigate('/supplychainoverhaul/partners?tab=uncategorized')
            }
            onDismiss={dismissBanner}
          />
        </Box>
      )}

      {/* Pattern banner */}
      <Box sx={{ mb: 4 }}>
        <PatternBanner
          onReviewDraftRule={() => setDrawerOpen(true)}
          onDismiss30Days={() => setBannerState('committed')}
          state={bannerState}
          onCommittedExpire={() => setBannerState('idle')}
        />
      </Box>

      {/* Today's priority queue */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 1.5 }}>
          <Typography variant="h6">Today's priority queue</Typography>
          <Link
            component={RouterLink}
            to="/supplychainoverhaul/inbox"
            underline="hover"
            variant="body2"
            color="primary"
          >
            View inbox →
          </Link>
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
          {topFive.map(({ ex, score }, i) => {
            const partner = partnersById[ex.partnerId];
            const ttb = formatTimeToBreach(ex.breachInMinutes);
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
                  gridTemplateColumns: '56px minmax(0, 2.4fr) minmax(0, 1fr) 110px 140px',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  cursor: 'pointer',
                  borderBottom: i < topFive.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  outline: 'none',
                  '&:hover': { bgcolor: 'grey.50' },
                  '&:focus-visible': { bgcolor: 'grey.50', boxShadow: (t) => `inset 0 0 0 2px ${t.palette.primary.main}` },
                }}
              >
                <PriorityChip
                  score={score}
                  severity={ex.severity}
                  ttb={ex.ttb}
                  impact={ex.impact}
                  tier={ex.tier}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                    {ex.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {ex.id} · {ex.poId}
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" noWrap>{partner?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tier {partner?.tier}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: TTB_COLOR[ttb.severity], fontWeight: 600 }}>
                  {ttb.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {ex.assignee ?? 'Unassigned'}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Recent recommendations */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>Recent recommendations</Typography>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.5,
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          {recentFive.map((r, i) => (
            <Box
              key={r.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr auto',
                alignItems: 'center',
                gap: 2,
                px: 2,
                py: 1,
                borderBottom: i < recentFive.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(r.timestamp)}
              </Typography>
              <Typography variant="body2" noWrap>
                {r.headline}
              </Typography>
              <StatusBadge status={r.status} />
            </Box>
          ))}
          <Divider />
          <Box sx={{ px: 2, py: 1, textAlign: 'right' }}>
            <Link
              component={RouterLink}
              to="/supplychainoverhaul/recommendations"
              underline="hover"
              variant="body2"
              color="primary"
            >
              View all recommendations →
            </Link>
          </Box>
        </Box>
      </Box>

      <DraftRuleDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onActivate={() => {
          setDrawerOpen(false);
          setBannerState('committed');
        }}
        onSaveDraft={() => setDrawerOpen(false)}
      />
    </SupplyChainPageLayout>
  );
}
