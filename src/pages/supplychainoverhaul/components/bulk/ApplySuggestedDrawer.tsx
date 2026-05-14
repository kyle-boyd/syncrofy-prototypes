import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Stack,
  Typography,
  Tooltip,
  Link,
  Divider,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link as RouterLink } from 'react-router-dom';
import { SideSheet } from '../../../../components/SideSheet';
import type { Exception } from '../../fixtures/exceptions';
import type {
  RecommendationConfidence,
} from '../../ai/RecommendationCard';
import type { InboxRecommendation } from '../../ai/inboxRecommendations';

export interface DrawerRow {
  ex: Exception;
  rec: InboxRecommendation;
}

interface Props {
  open: boolean;
  /** Rows whose suggested action has high or moderate confidence (count toward M). */
  applicable: DrawerRow[];
  /** Rows whose suggested action is exploratory or 'none' — opt-in. */
  weak: DrawerRow[];
  onClose: () => void;
  onApply: (selectedIds: string[]) => void;
}

const dotColor = (c: RecommendationConfidence): string => {
  switch (c) {
    case 'high':
      return 'success.main';
    case 'moderate':
      return 'warning.main';
    case 'exploratory':
      return 'grey.400';
    default:
      return 'transparent';
  }
};

const confidenceLabel = (c: RecommendationConfidence): string => {
  switch (c) {
    case 'high':
      return 'High';
    case 'moderate':
      return 'Moderate';
    case 'exploratory':
      return 'Exploratory';
    default:
      return 'No recommendation';
  }
};

export function ApplySuggestedDrawer({ open, applicable, weak, onClose, onApply }: Props) {
  const allRows: DrawerRow[] = React.useMemo(() => [...applicable, ...weak], [applicable, weak]);
  const M = applicable.length;

  // Default check state: high & moderate checked; exploratory & none unchecked.
  const computeDefaults = React.useCallback((): Record<string, boolean> => {
    const out: Record<string, boolean> = {};
    for (const r of allRows) {
      const c = r.rec.confidence;
      out[r.ex.id] = c === 'high' || c === 'moderate';
    }
    return out;
  }, [allRows]);

  const [checked, setChecked] = React.useState<Record<string, boolean>>(computeDefaults);
  const [showWeak, setShowWeak] = React.useState(false);

  // Reset when drawer reopens or applicable set changes.
  React.useEffect(() => {
    if (open) {
      setChecked(computeDefaults());
      setShowWeak(false);
    }
  }, [open, computeDefaults]);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  const toggle = (id: string) =>
    setChecked((s) => ({ ...s, [id]: !s[id] }));

  const setAll = (val: boolean, ids?: string[]) => {
    setChecked((s) => {
      const next = { ...s };
      const target = ids ?? allRows.map((r) => r.ex.id);
      for (const id of target) next[id] = val;
      return next;
    });
  };

  const setHighOnly = () => {
    setChecked(() => {
      const next: Record<string, boolean> = {};
      for (const r of allRows) next[r.ex.id] = r.rec.confidence === 'high';
      return next;
    });
  };

  const handleApply = () => {
    const ids = Object.entries(checked)
      .filter(([, v]) => v)
      .map(([k]) => k);
    onApply(ids);
  };

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      width={640}
      title={
        <Stack>
          <Typography variant="h6">Review {M} suggested actions</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>
            Each selected exception with a high or moderate confidence recommendation is shown
            below. Adjust selections, then commit.
          </Typography>
        </Stack>
      }
      footer={
        <>
          <Button variant="text" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={checkedCount === 0}
          >
            Apply {checkedCount} action{checkedCount === 1 ? '' : 's'}
          </Button>
        </>
      }
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5, flexWrap: 'wrap', rowGap: 1 }}
      >
        <Stack direction="row" spacing={0.5}>
          <Button size="small" variant="text" onClick={() => setAll(true)}>
            Select all
          </Button>
          <Button size="small" variant="text" color="secondary" onClick={() => setAll(false)}>
            Select none
          </Button>
          <Button size="small" variant="text" onClick={setHighOnly}>
            Select high-confidence only
          </Button>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {checkedCount} of {M} ready to apply
        </Typography>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      <Stack divider={<Divider flexItem />}>
        {applicable.map((r) => (
          <DrawerRowView
            key={r.ex.id}
            row={r}
            checked={!!checked[r.ex.id]}
            onToggle={() => toggle(r.ex.id)}
          />
        ))}
      </Stack>

      {weak.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="text"
            color="secondary"
            size="small"
            onClick={() => setShowWeak((v) => !v)}
            startIcon={showWeak ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showWeak ? 'Hide' : `Show ${weak.length} more without strong recommendations`}
          </Button>
          <Collapse in={showWeak} unmountOnExit>
            <Stack divider={<Divider flexItem />} sx={{ mt: 1 }}>
              {weak.map((r) => (
                <DrawerRowView
                  key={r.ex.id}
                  row={r}
                  checked={!!checked[r.ex.id]}
                  onToggle={() => toggle(r.ex.id)}
                />
              ))}
            </Stack>
          </Collapse>
        </Box>
      )}
    </SideSheet>
  );
}

function DrawerRowView({
  row,
  checked,
  onToggle,
}: {
  row: DrawerRow;
  checked: boolean;
  onToggle: () => void;
}) {
  const { ex, rec } = row;
  const conf = rec.confidence;

  return (
    <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ py: 1.25 }}>
      <Checkbox
        size="small"
        checked={checked}
        onChange={onToggle}
        sx={{ mt: -0.5 }}
        inputProps={{ 'aria-label': `Apply suggestion for ${ex.id}` }}
      />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: dotColor(conf),
              flex: '0 0 auto',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {confidenceLabel(conf)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
          >
            {ex.id}
          </Typography>
          <Link
            component={RouterLink}
            to={`/supplychainoverhaul/exception/${ex.id}`}
            target="_blank"
            rel="noopener"
            variant="caption"
            underline="hover"
          >
            view
          </Link>
        </Stack>
        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
          {ex.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'primary.main', mt: 0.25 }} noWrap>
          {rec.primaryLabel}
        </Typography>
        {rec.reasoning && (
          <Tooltip title={rec.reasoning} arrow placement="top">
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {rec.reasoning}
            </Typography>
          </Tooltip>
        )}
      </Box>
    </Stack>
  );
}

export default ApplySuggestedDrawer;
