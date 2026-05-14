import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  Box,
  Stack,
  Typography,
  Chip,
  Menu,
  MenuItem as MuiMenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import SettingsIcon from '@mui/icons-material/Settings';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Tag, Tabs, Button, IconButton, Avatar } from '@design-system';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ExceptionType =
  | 'missing_file'
  | 'frequent_failures'
  | 'transfer_failure'
  | 'zero_byte'
  | 'staged_not_picked_up'
  | 'expected_file_received'
  | 'staged_downloaded'
  | 'file_delivered';

export interface RelatedTransfer {
  id: string;
  fileName: string;
  partnerName: string;
  direction: 'Inbound' | 'Outbound';
  status: 'Success' | 'Failed';
  timestamp: string;
  size?: string;
}

export interface ExceptionDetail {
  id: string;
  type: ExceptionType;
  status: 'pending' | 'in_progress' | 'resolved' | 'dismissed';
  partnerName: string;
  fileName: string;
  frequency: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  // Type-specific fields
  failureCount?: number;
  failureWindow?: string;
  stagedDuration?: string;
  retryMode?: 'first_failure' | 'after_retries';
  retryCount?: number;
  // Common
  category?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  watchCount?: number;
  openedAt?: string;
  lastModifiedAt?: string;
  description?: string;
  relatedTransfers?: RelatedTransfer[];
}

interface ExceptionDetailModalProps {
  open: boolean;
  exception: ExceptionDetail | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const severityConfig = {
  critical: { label: 'Critical', variant: 'error' as const, icon: <ArrowUpwardIcon /> },
  high:     { label: 'High',     variant: 'warning' as const, icon: <ArrowUpwardIcon /> },
  medium:   { label: 'Medium',   variant: 'primary' as const, icon: <ArrowForwardIcon /> },
  low:      { label: 'Low',      variant: 'neutral' as const, icon: <ArrowForwardIcon /> },
};

export const exceptionStatusConfig = {
  pending:     { label: 'Open',        color: 'error.main',    Icon: CircleOutlinedIcon },
  in_progress: { label: 'In Progress', color: 'info.main',     Icon: RotateRightIcon },
  resolved:    { label: 'Resolved',    color: 'success.main',  Icon: CheckCircleIcon },
  dismissed:   { label: 'Dismissed',   color: 'text.secondary', Icon: RemoveCircleOutlineIcon },
};

export const exceptionTypeLabel: Record<ExceptionType, string> = {
  missing_file:           'Missing file',
  frequent_failures:      'Frequent transfer failures',
  transfer_failure:       'Transfer failure',
  zero_byte:              'Zero byte file',
  staged_not_picked_up:   'Staged but not picked up',
  expected_file_received: 'Expected file received',
  staged_downloaded:      'Staged file downloaded',
  file_delivered:         'File delivered to partner',
};

// Renders the bold sentence shown both in the table row and modal title
export const renderExceptionSentence = (e: ExceptionDetail): React.ReactNode => {
  const partner = <strong>{e.partnerName}</strong>;
  const file = e.fileName ? <strong>{e.fileName}</strong> : null;

  switch (e.type) {
    case 'missing_file':
      return (
        <>
          {partner} was supposed to send a file
          {file ? <> named {file}</> : null} by <strong>{e.frequency}</strong>.
        </>
      );
    case 'frequent_failures':
      return (
        <>
          {partner} had <strong>{e.failureCount ?? '—'}</strong> failed transfers within{' '}
          <strong>{e.failureWindow ?? '—'}</strong>.
        </>
      );
    case 'transfer_failure':
      return (
        <>
          A transfer from {partner}
          {file ? <> for file {file}</> : null} failed
          {e.retryMode === 'after_retries' ? (
            <> after <strong>{e.retryCount ?? '—'}</strong> retries</>
          ) : null}
          .
        </>
      );
    case 'zero_byte':
      return (
        <>
          {partner} sent a zero byte file
          {file ? <> named {file}</> : null}.
        </>
      );
    case 'staged_not_picked_up':
      return (
        <>
          A file{file ? <> named {file}</> : null} from {partner} has been staged for{' '}
          <strong>{e.stagedDuration ?? '—'}</strong> without being picked up.
        </>
      );
    case 'expected_file_received':
      return (
        <>
          {partner} delivered an expected file
          {file ? <> matching {file}</> : null}.
        </>
      );
    case 'staged_downloaded':
      return (
        <>
          A staged file{file ? <> matching {file}</> : null} from {partner} was downloaded.
        </>
      );
    case 'file_delivered':
      return (
        <>
          A file{file ? <> matching {file}</> : null} was delivered to {partner}.
        </>
      );
  }
};

// ─── Subcomponents ───────────────────────────────────────────────────────────

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '8px',
      bgcolor: 'background.paper',
      overflow: 'hidden',
    }}
  >
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 700, color: 'text.primary' }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
  </Box>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.25 }}>
    {children}
  </Typography>
);

const FieldValue: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
    {children}
  </Typography>
);

// ─── Type-specific detail bodies ─────────────────────────────────────────────

const TypeSpecificFields: React.FC<{ exception: ExceptionDetail }> = ({ exception }) => {
  const rows: { label: string; value: React.ReactNode }[] = [];

  if (exception.fileName) rows.push({ label: 'File pattern', value: exception.fileName });

  switch (exception.type) {
    case 'missing_file':
      rows.push({ label: 'Expected frequency', value: exception.frequency });
      break;
    case 'frequent_failures':
      rows.push({ label: 'Failed transfers', value: exception.failureCount ?? '—' });
      rows.push({ label: 'Within', value: exception.failureWindow ?? '—' });
      break;
    case 'transfer_failure':
      rows.push({
        label: 'Trigger condition',
        value:
          exception.retryMode === 'after_retries'
            ? `After ${exception.retryCount ?? '—'} retries`
            : 'On first failure',
      });
      break;
    case 'staged_not_picked_up':
      rows.push({ label: 'Staged duration', value: exception.stagedDuration ?? '—' });
      break;
    case 'zero_byte':
    case 'expected_file_received':
    case 'staged_downloaded':
    case 'file_delivered':
      break;
  }

  rows.push({ label: 'Opened', value: exception.openedAt ?? '—' });
  rows.push({ label: 'Last modified', value: exception.lastModifiedAt ?? 'N/A' });

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, pt: 1 }}>
      {rows.map((r) => (
        <Box key={r.label}>
          <FieldLabel>{r.label}</FieldLabel>
          <FieldValue>{r.value}</FieldValue>
        </Box>
      ))}
    </Box>
  );
};

const renderTypeDetails = (exception: ExceptionDetail) => (
  <Stack spacing={2}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography sx={{ fontSize: 14, color: 'text.primary' }}>
        {exceptionTypeLabel[exception.type]}
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<SettingsIcon sx={{ fontSize: 16 }} />}
        sx={{ textTransform: 'none', fontSize: 13, fontWeight: 500 }}
      >
        Edit Rule
      </Button>
    </Box>
    <TypeSpecificFields exception={exception} />
  </Stack>
);

// ─── Main component ──────────────────────────────────────────────────────────

export const ExceptionDetailModal: React.FC<ExceptionDetailModalProps> = ({
  open,
  exception,
  onClose,
  onPrev,
  onNext,
  hasPrev = true,
  hasNext = true,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('details');
  const [actionsAnchor, setActionsAnchor] = useState<null | HTMLElement>(null);
  const [assigneeAnchor, setAssigneeAnchor] = useState<null | HTMLElement>(null);
  const [showAllTransfers, setShowAllTransfers] = useState(false);

  if (!exception) return null;

  const INITIAL_VISIBLE_TRANSFERS = 3;
  const allTransfers = exception.relatedTransfers ?? [];
  const visibleTransfers = showAllTransfers
    ? allTransfers
    : allTransfers.slice(0, INITIAL_VISIBLE_TRANSFERS);
  const hiddenTransferCount = allTransfers.length - INITIAL_VISIBLE_TRANSFERS;

  const handleTransferClick = (id: string) => {
    onClose();
    navigate(`/transfers/${id}`);
  };

  const sev = severityConfig[exception.severity];
  const status = exceptionStatusConfig[exception.status];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 64px)',
        },
      }}
    >
      {/* ── Top toolbar ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1,
          px: 2,
          pt: 1.5,
          pb: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            height: 32,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '6px',
            color: 'text.secondary',
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
            {exception.watchCount ?? 0}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            height: 32,
            px: 1.25,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '999px',
          }}
        >
          <status.Icon sx={{ fontSize: 14, color: status.color }} />
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
            {status.label}
          </Typography>
        </Box>

        <Box
          onClick={(e) => setAssigneeAnchor(e.currentTarget)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            height: 32,
            px: 0.5,
            pr: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '999px',
            cursor: 'pointer',
          }}
        >
          <Avatar size="24px" sx={{ bgcolor: 'grey.300', color: 'grey.700', fontSize: 11, fontWeight: 600 }}>
            {exception.assigneeInitials ?? '?'}
          </Avatar>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
            {exception.assigneeName ?? 'Unassigned'}
          </Typography>
          <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>
        <Menu
          anchorEl={assigneeAnchor}
          open={Boolean(assigneeAnchor)}
          onClose={() => setAssigneeAnchor(null)}
        >
          <MuiMenuItem onClick={() => setAssigneeAnchor(null)}>Assign to me</MuiMenuItem>
          <MuiMenuItem onClick={() => setAssigneeAnchor(null)}>Unassign</MuiMenuItem>
        </Menu>

        <IconButton
          size="small"
          onClick={(e) => setActionsAnchor(e.currentTarget)}
          sx={{ width: 32, height: 32 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={actionsAnchor}
          open={Boolean(actionsAnchor)}
          onClose={() => setActionsAnchor(null)}
        >
          <MuiMenuItem onClick={() => setActionsAnchor(null)}>Resolve</MuiMenuItem>
          <MuiMenuItem onClick={() => setActionsAnchor(null)}>Watch</MuiMenuItem>
          <MuiMenuItem onClick={() => setActionsAnchor(null)}>Mark in progress</MuiMenuItem>
        </Menu>

        <Tag label={sev.label} variant={sev.variant} icon={sev.icon} size="small" />

        <IconButton size="small" onClick={onClose} sx={{ width: 32, height: 32 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── Title block ── */}
      <Box sx={{ px: 3, pt: 1, pb: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4, color: 'text.primary' }}>
          {renderExceptionSentence(exception)}
        </Typography>

        {exception.category && (
          <Box sx={{ mt: 1.5 }}>
            <Chip
              label={exception.category}
              size="small"
              sx={{
                height: 28,
                borderRadius: '999px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                fontSize: 13,
                fontWeight: 500,
                color: 'text.primary',
              }}
            />
          </Box>
        )}
      </Box>

      {/* ── Tabs ── */}
      <Box sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs
          tabs={[
            { label: 'Details', value: 'details' },
            { label: 'Comments', value: 'comments' },
          ]}
          value={activeTab}
          onChange={(_, val) => setActiveTab(String(val))}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 500,
              minHeight: 40,
              padding: '6px 12px',
            },
          }}
        />
      </Box>

      {/* ── Body ── */}
      <Box sx={{ p: 3, bgcolor: '#FAFCFC', flex: 1, overflowY: 'auto' }}>
        {activeTab === 'details' ? (
          <Stack spacing={2}>
            <SectionCard title="Exception Details">
              {renderTypeDetails(exception)}
            </SectionCard>

            {allTransfers.length > 0 && (
              <SectionCard
                title={`Related Transfers (${allTransfers.length})`}
              >
                <Stack spacing={1} sx={{ pt: 1 }}>
                  {visibleTransfers.map((t) => (
                    <Box
                      key={t.id}
                      onClick={() => handleTransferClick(t.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 1.5,
                        py: 1.25,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '6px',
                        bgcolor: 'background.paper',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      {t.direction === 'Inbound' ? (
                        <ArrowCircleDownIcon sx={{ fontSize: 20, color: 'info.main' }} />
                      ) : (
                        <ArrowCircleUpIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {t.fileName}
                          </Typography>
                          {t.size && (
                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                              {t.size}
                            </Typography>
                          )}
                        </Box>
                        <Typography
                          sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}
                        >
                          {t.direction === 'Inbound' ? 'From' : 'To'} {t.partnerName} · {t.timestamp}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: 'text.disabled',
                            fontFamily: 'monospace',
                            mt: 0.25,
                          }}
                        >
                          {t.id}
                        </Typography>
                      </Box>
                      <Tag
                        label={t.status}
                        variant={t.status === 'Success' ? 'success' : 'error'}
                        size="small"
                        icon={
                          t.status === 'Success' ? (
                            <CheckCircleOutlineIcon />
                          ) : (
                            <ErrorOutlineIcon />
                          )
                        }
                      />
                      <ChevronRightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </Box>
                  ))}
                </Stack>
                {hiddenTransferCount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => setShowAllTransfers((v) => !v)}
                      sx={{ textTransform: 'none' }}
                    >
                      {showAllTransfers ? 'Show less' : `+${hiddenTransferCount} more`}
                    </Button>
                  </Box>
                )}
              </SectionCard>
            )}

            <SectionCard title="Description">
              <Box
                sx={{
                  bgcolor: 'grey.50',
                  borderRadius: '6px',
                  px: 2,
                  py: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  {exception.description ?? 'No notes have been added to this exception'}
                </Typography>
              </Box>
            </SectionCard>
          </Stack>
        ) : (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              bgcolor: 'background.paper',
              p: 3,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
              No comments yet.
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Footer prev/next ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <IconButton size="small" disabled={!hasPrev} onClick={onPrev}>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton size="small" disabled={!hasNext} onClick={onNext}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Dialog>
  );
};

export default ExceptionDetailModal;
