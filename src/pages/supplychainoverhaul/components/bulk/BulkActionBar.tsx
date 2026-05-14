import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Popover,
  MenuList,
  MenuItem,
  ListItemText,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { teammates } from '../../fixtures/teammates';

export type BulkActionKind = 'reassign' | 'snooze' | 'resolve' | 'apply-suggested';

export interface BulkConfirmation {
  /** e.g. "12 exceptions reassigned to Maria Chen." */
  message: string;
  /** Original IDs that were affected — used for undo. */
  ids: string[];
}

interface Props {
  selectedCount: number;
  applicableCount: number; // M = high/moderate among selected
  confirmation: BulkConfirmation | null;
  undoSecondsLeft: number;
  onClearSelection: () => void;
  onApplySuggestedClick: () => void;
  onReassign: (teammateName: string) => void;
  onSnooze: (durationLabel: string) => void;
  onResolve: (note: string) => void;
  onUndo: () => void;
  onDismissConfirmation: () => void;
}

/**
 * Sticky bar pinned to the bottom of the inbox content area.
 * Shows selection summary + action buttons when rows are selected,
 * or a confirmation + undo countdown after a bulk action commits.
 */
export function BulkActionBar(props: Props) {
  const {
    selectedCount,
    applicableCount,
    confirmation,
    undoSecondsLeft,
    onClearSelection,
    onApplySuggestedClick,
    onReassign,
    onSnooze,
    onResolve,
    onUndo,
    onDismissConfirmation,
  } = props;

  const reassignAnchor = React.useRef<HTMLButtonElement | null>(null);
  const snoozeAnchor = React.useRef<HTMLButtonElement | null>(null);
  const [reassignOpen, setReassignOpen] = React.useState(false);
  const [snoozeOpen, setSnoozeOpen] = React.useState(false);
  const [resolveOpen, setResolveOpen] = React.useState(false);

  if (confirmation) {
    return (
      <BarShell>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {confirmation.message}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          {undoSecondsLeft > 0 ? (
            <Button variant="text" size="small" onClick={onUndo}>
              Undo ({undoSecondsLeft}s)
            </Button>
          ) : (
            <Typography variant="caption" color="text.disabled">
              undo expired
            </Typography>
          )}
          <Button variant="text" size="small" onClick={onDismissConfirmation} color="secondary">
            Dismiss
          </Button>
        </Stack>
      </BarShell>
    );
  }

  if (selectedCount === 0) return null;

  return (
    <BarShell>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {selectedCount} selected
        </Typography>
        <Button variant="text" size="small" color="secondary" onClick={onClearSelection}>
          Clear selection
        </Button>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        {applicableCount > 0 && (
          <Button variant="contained" size="small" color="primary" onClick={onApplySuggestedClick}>
            Apply suggested actions ({applicableCount})
          </Button>
        )}
        <Button
          ref={reassignAnchor}
          variant="outlined"
          size="small"
          onClick={() => setReassignOpen(true)}
        >
          Reassign…
        </Button>
        <Button
          ref={snoozeAnchor}
          variant="outlined"
          size="small"
          onClick={() => setSnoozeOpen(true)}
        >
          Snooze…
        </Button>
        <Button variant="outlined" size="small" onClick={() => setResolveOpen(true)}>
          Resolve…
        </Button>
      </Stack>

      <Popover
        open={reassignOpen}
        anchorEl={reassignAnchor.current}
        onClose={() => setReassignOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ minWidth: 240, py: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1,
              display: 'block',
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Reassign to teammate
          </Typography>
          <Divider />
          <MenuList dense>
            {teammates.map((t) => (
              <MenuItem
                key={t.id}
                onClick={() => {
                  setReassignOpen(false);
                  onReassign(t.name);
                }}
              >
                <ListItemText primary={t.name} secondary={t.role} />
              </MenuItem>
            ))}
          </MenuList>
        </Box>
      </Popover>

      <SnoozePopover
        open={snoozeOpen}
        anchorEl={snoozeAnchor.current}
        onClose={() => setSnoozeOpen(false)}
        onSelect={(label) => {
          setSnoozeOpen(false);
          onSnooze(label);
        }}
      />

      <ResolveDialog
        open={resolveOpen}
        count={selectedCount}
        onClose={() => setResolveOpen(false)}
        onConfirm={(note) => {
          setResolveOpen(false);
          onResolve(note);
        }}
      />
    </BarShell>
  );
}

function BarShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 16,
        mt: 2,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
        px: 2,
        py: 1.25,
      }}
    >
      {children}
    </Box>
  );
}

function SnoozePopover({
  open,
  anchorEl,
  onClose,
  onSelect,
}: {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onSelect: (label: string) => void;
}) {
  const [showCustom, setShowCustom] = React.useState(false);
  const [customValue, setCustomValue] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      setShowCustom(false);
      setCustomValue('');
    }
  }, [open]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Box sx={{ minWidth: 240, py: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Snooze duration
        </Typography>
        <Divider />
        {!showCustom ? (
          <MenuList dense>
            {[
              { key: '1h', label: '1 hour' },
              { key: '4h', label: '4 hours' },
              { key: '1d', label: '1 day' },
            ].map((opt) => (
              <MenuItem key={opt.key} onClick={() => onSelect(opt.label)}>
                {opt.label}
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={() => setShowCustom(true)}>Custom…</MenuItem>
          </MenuList>
        ) : (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <TextField
              size="small"
              type="datetime-local"
              label="Wake at"
              InputLabelProps={{ shrink: true }}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" variant="text" color="secondary" onClick={() => setShowCustom(false)}>
                Back
              </Button>
              <Button
                size="small"
                variant="contained"
                disabled={!customValue}
                onClick={() => onSelect(`until ${customValue.replace('T', ' ')}`)}
              >
                Snooze
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Popover>
  );
}

function ResolveDialog({
  open,
  count,
  onClose,
  onConfirm,
}: {
  open: boolean;
  count: number;
  onClose: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = React.useState('');
  React.useEffect(() => {
    if (!open) setNote('');
  }, [open]);

  const enabled = note.trim().length >= 10;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Resolve {count} exception{count === 1 ? '' : 's'}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          A short note keeps the audit trail meaningful. Required (10+ characters).
        </Typography>
        <TextField
          label="Resolution note"
          multiline
          minRows={3}
          fullWidth
          autoFocus
          value={note}
          onChange={(e) => setNote(e.target.value)}
          helperText={`${note.trim().length} / 10 minimum`}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" disabled={!enabled} onClick={() => onConfirm(note.trim())}>
          Resolve
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BulkActionBar;
