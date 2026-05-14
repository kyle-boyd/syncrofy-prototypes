import React from 'react';
import { Box, Typography, Button, IconButton, Chip, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export type RecommendationConfidence = 'high' | 'moderate' | 'exploratory' | 'none';
export type RecommendationDisplayState = 'idle' | 'committed' | 'dismissed';

export interface RecommendationAction {
  label: string;
  onClick: () => void;
}

export interface RecommendationProvenanceChip {
  label: string;
  onClick?: () => void;
}

export interface RecommendationCardProps {
  confidence: RecommendationConfidence;
  headline: string;
  reasoning: string;
  provenance: RecommendationProvenanceChip[];
  primaryAction: RecommendationAction;
  alternatives?: RecommendationAction[];
  onDismiss: () => void;
  state?: RecommendationDisplayState;
  committedLabel?: string;
  /** Optional handler for the undo affordance in the committed state. */
  onUndo?: () => void;
  /** Fired when the 10s undo countdown expires. */
  onCommittedExpire?: () => void;
  /** 'default' = full card; 'compact' = single-row variant for dense lists. */
  layout?: 'default' | 'compact';
}

const EXPLORATORY_HEDGE = "I'm less sure here, but ";

const dotColor = (c: RecommendationConfidence): string => {
  switch (c) {
    case 'high':
      return 'success.main';
    case 'moderate':
      return 'warning.main';
    case 'exploratory':
      return 'grey.400';
    case 'none':
      return 'transparent';
  }
};

const confidenceLabel = (c: RecommendationConfidence): string => {
  switch (c) {
    case 'high':
      return 'High confidence';
    case 'moderate':
      return 'Moderate confidence';
    case 'exploratory':
      return 'Exploratory';
    case 'none':
      return '';
  }
};

const hasLeftRule = (c: RecommendationConfidence) => c === 'high' || c === 'moderate';

const reframeExploratoryHeadline = (h: string) =>
  /^consider\b/i.test(h.trim()) ? h : `Consider ${h.charAt(0).toLowerCase()}${h.slice(1)}`;

const reframeExploratoryReasoning = (r: string) =>
  r.startsWith(EXPLORATORY_HEDGE) ? r : `${EXPLORATORY_HEDGE}${r.charAt(0).toLowerCase()}${r.slice(1)}`;

const SURFACE_SX = {
  position: 'relative' as const,
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1.5,
  p: 2,
  pt: 1.75,
};

export function RecommendationCard(props: RecommendationCardProps) {
  const {
    confidence,
    headline,
    reasoning,
    provenance,
    primaryAction,
    alternatives,
    onDismiss,
    state = 'idle',
    committedLabel,
    onUndo,
    onCommittedExpire,
    layout = 'default',
  } = props;

  if (state === 'dismissed') return null;

  if (state === 'committed') {
    return (
      <CommittedRow
        label={committedLabel ?? 'Action taken'}
        onUndo={onUndo}
        onExpire={onCommittedExpire}
      />
    );
  }

  if (layout === 'compact') {
    return (
      <CompactRow
        confidence={confidence}
        headline={headline}
        reasoning={reasoning}
        provenance={provenance}
        primaryAction={primaryAction}
        alternatives={alternatives}
        onDismiss={onDismiss}
      />
    );
  }

  if (confidence === 'none') {
    return (
      <Box sx={SURFACE_SX}>
        <DismissButton onClick={onDismiss} />
        <Typography variant="subtitle2" sx={{ mb: 1.25, color: 'text.primary' }}>
          Choose action
        </Typography>
        <Stack spacing={0.75}>
          <Button variant="outlined" color="primary" fullWidth onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
          {alternatives?.map((a) => (
            <Button
              key={a.label}
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={a.onClick}
            >
              {a.label}
            </Button>
          ))}
        </Stack>
      </Box>
    );
  }

  const displayHeadline =
    confidence === 'exploratory' ? reframeExploratoryHeadline(headline) : headline;
  const displayReasoning =
    confidence === 'exploratory' ? reframeExploratoryReasoning(reasoning) : reasoning;
  const showLeftRule = hasLeftRule(confidence);

  return (
    <Box
      sx={{
        ...SURFACE_SX,
        pl: showLeftRule ? 2.25 : 2,
      }}
    >
      {showLeftRule && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            bgcolor: 'primary.main',
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }}
        />
      )}

      <DismissButton onClick={onDismiss} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: dotColor(confidence),
            flex: '0 0 auto',
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {confidenceLabel(confidence)}
        </Typography>
      </Box>

      <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }}>
        {displayHeadline}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
        {displayReasoning}
      </Typography>

      {provenance.length > 0 && (
        <Stack direction="row" spacing={0.75} sx={{ mb: 1.5, flexWrap: 'wrap', rowGap: 0.75 }}>
          {provenance.slice(0, 4).map((chip) => (
            <Chip
              key={chip.label}
              label={chip.label}
              size="small"
              variant="outlined"
              onClick={chip.onClick}
              sx={{ cursor: chip.onClick ? 'pointer' : 'default' }}
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
        <Button variant="contained" color="primary" onClick={primaryAction.onClick} size="small">
          {primaryAction.label}
        </Button>
        {alternatives?.map((a) => (
          <Button key={a.label} variant="text" color="secondary" onClick={a.onClick} size="small">
            {a.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      aria-label="Dismiss recommendation"
      sx={{
        position: 'absolute',
        top: 4,
        right: 4,
        color: 'text.disabled',
        '&:hover': { color: 'text.secondary', bgcolor: 'transparent' },
      }}
    >
      <CloseIcon sx={{ fontSize: 16 }} />
    </IconButton>
  );
}

function CommittedRow({
  label,
  onUndo,
  onExpire,
}: {
  label: string;
  onUndo?: () => void;
  onExpire?: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = React.useState(10);
  const onExpireRef = React.useRef(onExpire);
  onExpireRef.current = onExpire;

  React.useEffect(() => {
    if (secondsLeft <= 0) {
      onExpireRef.current?.();
      return;
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [secondsLeft]);

  const expired = secondsLeft <= 0;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        px: 1.5,
        py: 1,
      }}
    >
      <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
      <Typography variant="body2" sx={{ color: 'text.primary', flex: 1, minWidth: 0 }} noWrap>
        {label}
      </Typography>
      {!expired ? (
        <>
          <Typography variant="body2" color="text.secondary">
            ·
          </Typography>
          <Button variant="text" size="small" onClick={onUndo} sx={{ minWidth: 0, py: 0 }}>
            undo ({secondsLeft}s)
          </Button>
        </>
      ) : (
        <Typography variant="caption" color="text.disabled">
          undo expired
        </Typography>
      )}
    </Box>
  );
}

function CompactRow({
  confidence,
  headline,
  reasoning,
  provenance,
  primaryAction,
  alternatives,
  onDismiss,
}: {
  confidence: RecommendationConfidence;
  headline: string;
  reasoning: string;
  provenance: RecommendationProvenanceChip[];
  primaryAction: RecommendationAction;
  alternatives?: RecommendationAction[];
  onDismiss: () => void;
}) {
  const showLeftRule = hasLeftRule(confidence);
  const isPicker = confidence === 'none';

  if (isPicker) {
    return (
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          px: 1.25,
          py: 0.5,
          minHeight: 36,
          minWidth: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography
          variant="body2"
          noWrap
          sx={{ flex: 1, minWidth: 0, color: 'text.secondary' }}
        >
          Choose action
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            primaryAction.onClick();
          }}
          sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
        >
          Select action ▾
        </Button>
        <IconButton
          size="small"
          aria-label="Dismiss recommendation"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary', bgcolor: 'transparent' } }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    );
  }

  const displayHeadline =
    confidence === 'exploratory' ? reframeExploratoryHeadline(headline) : headline;
  const displayReasoning =
    confidence === 'exploratory' ? reframeExploratoryReasoning(reasoning) : reasoning;

  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        pl: showLeftRule ? 1.5 : 1.25,
        pr: 1.25,
        py: 1,
        minWidth: 0,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {showLeftRule && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            bgcolor: 'primary.main',
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }}
        />
      )}

      {/* Line 1: confidence dot + headline + dismiss */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: dotColor(confidence),
            flex: '0 0 auto',
            mt: '6px',
          }}
        />
        <Typography
          variant="body2"
          sx={{ flex: 1, minWidth: 0, color: 'text.primary', fontWeight: 600, lineHeight: 1.35 }}
        >
          {displayHeadline}
        </Typography>
        <IconButton
          size="small"
          aria-label="Dismiss recommendation"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          sx={{
            color: 'text.disabled',
            p: 0.25,
            mt: '-2px',
            '&:hover': { color: 'text.secondary', bgcolor: 'transparent' },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Line 2: reasoning */}
      {displayReasoning && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 0.5, ml: 2, lineHeight: 1.4 }}
        >
          {displayReasoning}
        </Typography>
      )}

      {/* Line 3: provenance chips */}
      {provenance.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.5,
            mt: 0.75,
            ml: 2,
          }}
        >
          <Typography variant="caption" color="text.disabled" sx={{ mr: 0.25 }}>
            Based on:
          </Typography>
          {provenance.slice(0, 4).map((chip, idx) => (
            <React.Fragment key={chip.label}>
              {idx > 0 && (
                <Typography variant="caption" color="text.disabled">
                  ·
                </Typography>
              )}
              <Typography
                component={chip.onClick ? 'button' : 'span'}
                variant="caption"
                onClick={
                  chip.onClick
                    ? (e: React.MouseEvent) => {
                        e.stopPropagation();
                        chip.onClick!();
                      }
                    : undefined
                }
                sx={{
                  color: 'text.secondary',
                  bgcolor: 'transparent',
                  border: 'none',
                  p: 0,
                  font: 'inherit',
                  fontSize: 11,
                  cursor: chip.onClick ? 'pointer' : 'default',
                  textDecoration: chip.onClick ? 'underline dotted' : 'none',
                  textUnderlineOffset: 2,
                  '&:hover': chip.onClick ? { color: 'text.primary' } : undefined,
                }}
              >
                {chip.label}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      )}

      {/* Line 4: right-aligned primary action */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 0.5 }}>
        {alternatives?.slice(0, 1).map((a) => (
          <Button
            key={a.label}
            variant="text"
            color="secondary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              a.onClick();
            }}
            sx={{ whiteSpace: 'nowrap', minWidth: 0 }}
          >
            {a.label}
          </Button>
        ))}
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            primaryAction.onClick();
          }}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {primaryAction.label}
        </Button>
      </Box>
    </Box>
  );
}

export interface ShowRecommendationAffordanceProps {
  onClick: () => void;
  label?: string;
}

export function ShowRecommendationAffordance({
  onClick,
  label = 'Show recommendation',
}: ShowRecommendationAffordanceProps) {
  return (
    <Button
      variant="text"
      size="small"
      onClick={onClick}
      sx={{ color: 'text.secondary', textTransform: 'none', px: 0.5, fontWeight: 400 }}
    >
      {label}
    </Button>
  );
}

export default RecommendationCard;
