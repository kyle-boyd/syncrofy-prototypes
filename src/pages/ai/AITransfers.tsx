import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Drawer,
  Stack,
  IconButton,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SnoozeIcon from '@mui/icons-material/Snooze';
import BlockIcon from '@mui/icons-material/Block';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import {
  Tag,
  Button,
  Modal,
  PageHeader,
  ViewControls,
  FilterControls,
  type FilterOption,
} from '@design-system';
import { PageLayout } from '../../components/PageLayout';
import {
  transfers as allTransfers,
  dismissReasons,
  type Transfer,
  type TransferStatus,
} from './data';

type StatusFilter = 'all' | TransferStatus;

function getStatusTag(status: TransferStatus) {
  switch (status) {
    case 'success':
      return <Tag label="Success" variant="success" size="small" />;
    case 'failed':
      return <Tag label="Failed" variant="error" size="small" />;
    case 'in_progress':
      return <Tag label="In Progress" variant="info" size="small" />;
    case 'ghost':
      return <Tag label="Ghost" variant="warning" size="small" />;
  }
}

function getConfidenceColor(percent: number) {
  if (percent >= 80) return 'success.main';
  if (percent >= 60) return 'warning.main';
  return 'text.secondary';
}

export default function AITransfers() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState<string>('default');
  const [isViewFavorited, setIsViewFavorited] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [partnerFilter, setPartnerFilter] = useState<string>('all');
  const [searchValue, setSearchValue] = useState('');
  const [selectedGhost, setSelectedGhost] = useState<Transfer | null>(null);
  const [dismissModalOpen, setDismissModalOpen] = useState(false);
  const [dismissReason, setDismissReason] = useState('');
  const [dismissNote, setDismissNote] = useState('');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());

  const filterControlsRef = useRef<HTMLDivElement>(null);
  const [filterControlsHeight, setFilterControlsHeight] = useState<number>(0);

  useEffect(() => {
    const el = filterControlsRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setFilterControlsHeight(el.offsetHeight));
    observer.observe(el);
    setFilterControlsHeight(el.offsetHeight);
    return () => observer.disconnect();
  }, []);

  const uniquePartners = useMemo(
    () => [...new Set(allTransfers.map((t) => t.partner))].sort(),
    []
  );

  const filteredTransfers = useMemo(() => {
    return allTransfers.filter((t) => {
      if (dismissedIds.has(t.id)) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (partnerFilter !== 'all' && t.partner !== partnerFilter) return false;
      if (searchValue) {
        const s = searchValue.toLowerCase();
        const matchesSearch =
          t.partner.toLowerCase().includes(s) ||
          t.fileName.toLowerCase().includes(s) ||
          (t.filePattern || '').toLowerCase().includes(s) ||
          t.protocol.toLowerCase().includes(s);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [statusFilter, partnerFilter, searchValue, dismissedIds]);

  const handleRowClick = (row: Transfer) => {
    if (row.isGhost) {
      setSelectedGhost(row);
    }
  };

  const handleDismiss = () => {
    if (selectedGhost) {
      setDismissedIds((prev) => new Set(prev).add(selectedGhost.id));
      setDismissModalOpen(false);
      setSelectedGhost(null);
      setDismissReason('');
      setDismissNote('');
    }
  };

  const handleSnooze = () => {
    if (selectedGhost) {
      setSnoozedIds((prev) => new Set(prev).add(selectedGhost.id));
      setSelectedGhost(null);
    }
  };

  const ghostCount = allTransfers.filter(
    (t) => t.isGhost && !dismissedIds.has(t.id)
  ).length;

  const filterOptions: FilterOption[] = [
    {
      id: 'partner',
      label: 'Partner',
      value: partnerFilter,
      options: [
        { value: 'all', label: 'All' },
        ...uniquePartners.map((p) => ({ value: p, label: p })),
      ],
    },
    {
      id: 'date',
      label: 'Date',
      value: 'today',
      options: [{ value: 'today', label: 'Today' }],
    },
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      options: [
        { value: 'all', label: 'All' },
        { value: 'success', label: 'Success' },
        { value: 'failed', label: 'Failed' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'ghost', label: `Ghost (${ghostCount})` },
      ],
    },
  ];

  const columns: TableColumn<Transfer>[] = [
    {
      id: 'status',
      label: 'Status',
      width: 120,
      sortable: false,
      render: (row: Transfer) => getStatusTag(row.status),
    },
    {
      id: 'partner',
      label: 'Partner',
      width: 200,
      render: (row: Transfer) => (
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {row.partner}
        </Typography>
      ),
    },
    {
      id: 'fileName',
      label: 'File Name',
      width: 240,
      render: (row: Transfer) => (
        <Box>
          <Typography
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              ...(row.isGhost && {
                fontStyle: 'italic',
                color: 'text.secondary',
              }),
            }}
          >
            {row.isGhost ? row.filePattern : row.fileName}
          </Typography>
          {row.isGhost && (
            <Typography variant="caption" color="text.secondary">
              Expected pattern
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'direction',
      label: 'Direction',
      width: 100,
      render: (row: Transfer) => (
        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
          {row.direction}
        </Typography>
      ),
    },
    {
      id: 'protocol',
      label: 'Protocol',
      width: 90,
      render: (row: Transfer) => (
        <Typography variant="body2">{row.protocol}</Typography>
      ),
    },
    {
      id: 'fileSize',
      label: 'Size',
      width: 90,
      render: (row: Transfer) =>
        row.isGhost ? (
          <Typography variant="body2" color="text.secondary">
            \u2014
          </Typography>
        ) : (
          <Typography variant="body2">{row.fileSize}</Typography>
        ),
    },
    {
      id: 'timestamp',
      label: 'Time',
      width: 200,
      render: (row: Transfer) => {
        if (row.isGhost) {
          return (
            <Box>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <ScheduleIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                <Typography variant="body2" color="warning.main" fontWeight={500}>
                  {row.expectedWindow}
                </Typography>
              </Stack>
              <Typography variant="caption" color="error.main" fontWeight={500}>
                Overdue by {row.overdueBy}
              </Typography>
            </Box>
          );
        }
        return (
          <Box>
            <Typography variant="body2">{row.timestamp?.split(' ').slice(1).join(' ')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {row.timestamp?.split(' ')[0]}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'confidence',
      label: 'AI Insight',
      width: 140,
      sortable: false,
      render: (row: Transfer) => {
        if (!row.isGhost) {
          if (row.fingerprintId) {
            return (
              <Chip
                icon={<FingerprintIcon sx={{ fontSize: 14 }} />}
                label="Fingerprint"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/ai/fingerprints?highlight=${row.fingerprintId}`);
                }}
                sx={{
                  backgroundColor: 'rgba(230, 81, 0, 0.08)',
                  color: 'warning.dark',
                  border: '1px solid',
                  borderColor: 'rgba(230, 81, 0, 0.3)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(230, 81, 0, 0.16)',
                  },
                  '& .MuiChip-icon': {
                    color: 'warning.dark',
                  },
                }}
              />
            );
          }
          return null;
        }
        return (
          <Box sx={{ minWidth: 80 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ color: getConfidenceColor(row.confidencePercent || 0) }}
              >
                {row.confidencePercent}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.confidence}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={row.confidencePercent || 0}
              sx={{
                mt: 0.5,
                height: 4,
                borderRadius: 2,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getConfidenceColor(row.confidencePercent || 0),
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        );
      },
    },
  ];

  return (
    <PageLayout selectedNavItem="transfers" backgroundColor="#FAFCFC" contentPadding={0}>
      {/* Page header — scrolls away */}
      <Stack spacing={2} sx={{ mb: '16px', px: 3, pt: 3 }}>
        <PageHeader
          title="Transfers"
          showBreadcrumb={false}
          refreshStatus="Last refreshed: 12 mins ago"
        />

        <ViewControls
          viewName={selectedView === 'default' ? 'Default View' : 'AI Insights View'}
          selectedView={selectedView}
          onViewSelect={(val) => setSelectedView(String(val))}
          viewOptions={[
            { value: 'default', label: 'Default View' },
            { value: 'ai', label: 'AI Insights View' },
          ]}
          onStarClick={() => setIsViewFavorited(!isViewFavorited)}
          onMoreOptionsClick={() => {}}
        />
      </Stack>

      {/* FilterControls — sticks to top once the page header scrolls away */}
      <Box
        ref={filterControlsRef}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backgroundColor: '#FAFCFC',
          px: 3,
          mb: '16px',
        }}
      >
        <FilterControls
          search={{
            value: searchValue,
            onChange: setSearchValue,
          }}
          filters={filterOptions}
          onFilterChange={(id, val) => {
            if (id === 'partner') setPartnerFilter(String(val));
            if (id === 'status') setStatusFilter(String(val) as StatusFilter);
          }}
          resultCount={`${filteredTransfers.length} results`}
        />
      </Box>

      {/* Table — matches Transfers page structure */}
      <Box
        sx={{
          mx: 3,
          mb: 3,
          borderRadius: '8px',
          overflow: 'visible',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          // Corner radius on corner cells (overflow:visible can't clip)
          '& thead tr th:first-of-type': { borderTopLeftRadius: '7px' },
          '& thead tr th:last-of-type': { borderTopRightRadius: '7px' },
          '& tbody tr:last-of-type td:first-of-type': { borderBottomLeftRadius: '7px' },
          '& tbody tr:last-of-type td:last-of-type': { borderBottomRightRadius: '7px' },
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
        >
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  style={{
                    textAlign: 'left',
                    padding: '6px 12px',
                    fontWeight: 700,
                    fontSize: '13px',
                    borderBottom: '1px solid var(--mui-palette-divider, rgba(0,0,0,0.12))',
                    width: col.width || 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    top: filterControlsHeight,
                    zIndex: 5,
                    color: 'var(--mui-palette-text-secondary, rgba(0,0,0,0.6))',
                    backgroundColor: '#fff',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransfers.map((row) => (
              <Box
                component="tr"
                key={row.id}
                onClick={() => {
                  if (row.isGhost) handleRowClick(row);
                }}
                sx={{
                  transition: 'background-color 0.15s',
                  cursor: row.isGhost ? 'pointer' : 'default',
                  ...(row.isGhost
                    ? {
                        borderLeft: '3px dashed',
                        borderLeftColor: 'warning.main',
                        backgroundColor: snoozedIds.has(row.id)
                          ? 'rgba(237, 108, 2, 0.02)'
                          : 'rgba(237, 108, 2, 0.04)',
                        '&:hover': {
                          backgroundColor: 'rgba(237, 108, 2, 0.08)',
                        },
                      }
                    : {
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }),
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    style={{
                      padding: '6px 12px',
                      borderBottom: '1px solid var(--mui-palette-divider, rgba(0,0,0,0.12))',
                      verticalAlign: 'middle',
                      overflow: 'hidden',
                    }}
                  >
                    {col.render ? col.render(row) : (row as any)[col.id]}
                  </td>
                ))}
              </Box>
            ))}
            {filteredTransfers.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: 'center',
                    padding: '48px 12px',
                    color: 'var(--mui-palette-text-secondary, rgba(0,0,0,0.6))',
                    fontSize: '14px',
                  }}
                >
                  No transfers match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>

      {/* Ghost Detail Slide-over */}
      <Drawer
        anchor="right"
        open={!!selectedGhost}
        onClose={() => setSelectedGhost(null)}
        PaperProps={{
          sx: { width: 440, p: 0 },
        }}
      >
        {selectedGhost && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(237, 108, 2, 0.04)',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <VisibilityOffIcon sx={{ color: 'warning.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Ghost File Alert
                </Typography>
              </Stack>
              <IconButton onClick={() => setSelectedGhost(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Partner
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedGhost.partner}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Expected file pattern
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: 'monospace', fontSize: '14px' }}
                  >
                    {selectedGhost.filePattern}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                    <Typography variant="subtitle2">Expected Arrival Window</Typography>
                  </Stack>
                  <Typography variant="body1" fontWeight={500}>
                    {selectedGhost.expectedWindow}
                  </Typography>
                  <Typography variant="body2" color="error.main" fontWeight={500} sx={{ mt: 0.5 }}>
                    Overdue by {selectedGhost.overdueBy}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 18, color: getConfidenceColor(selectedGhost.confidencePercent || 0) }} />
                    <Typography variant="subtitle2">Prediction Confidence</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ color: getConfidenceColor(selectedGhost.confidencePercent || 0) }}
                    >
                      {selectedGhost.confidencePercent}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      ({selectedGhost.confidence} confidence)
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={selectedGhost.confidencePercent || 0}
                    sx={{
                      mt: 1,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getConfidenceColor(selectedGhost.confidencePercent || 0),
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>

                <Divider />

                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="subtitle2">Historical Pattern</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {selectedGhost.historicalPattern}
                  </Typography>
                </Box>

                <Divider />

                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Protocol
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedGhost.protocol}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Direction
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                      {selectedGhost.direction}
                    </Typography>
                  </Box>
                </Stack>

                {snoozedIds.has(selectedGhost.id) && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: 'rgba(2, 136, 209, 0.06)',
                      border: '1px solid',
                      borderColor: 'rgba(2, 136, 209, 0.2)',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SnoozeIcon sx={{ fontSize: 18, color: 'info.main' }} />
                      <Typography variant="body2" color="info.main" fontWeight={500}>
                        Snoozed \u2014 will re-alert in 2 hours
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Actions */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<SnoozeIcon />}
                onClick={handleSnooze}
                disabled={snoozedIds.has(selectedGhost.id)}
                sx={{ flex: 1 }}
              >
                Snooze 2h
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<BlockIcon />}
                onClick={() => setDismissModalOpen(true)}
                sx={{ flex: 1 }}
              >
                Dismiss
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Dismiss Modal */}
      <Modal
        open={dismissModalOpen}
        onClose={() => setDismissModalOpen(false)}
        title="Dismiss Ghost File Alert"
        maxWidth="sm"
        actions={
          <>
            <Button
              variant="text"
              color="secondary"
              onClick={() => setDismissModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDismiss}
              disabled={!dismissReason}
            >
              Dismiss Alert
            </Button>
          </>
        }
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Dismissing this alert will remove it from the transfer list and feed this
              signal back to the prediction model.
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                mb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                File pattern
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {selectedGhost?.filePattern}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Partner
              </Typography>
              <Typography variant="body2">{selectedGhost?.partner}</Typography>
            </Box>
          </Box>
          <FormControl fullWidth size="small">
            <InputLabel>Reason for dismissal</InputLabel>
            <Select
              value={dismissReason}
              label="Reason for dismissal"
              onChange={(e) => setDismissReason(e.target.value)}
            >
              {dismissReasons.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Additional notes (optional)"
            multiline
            rows={3}
            size="small"
            value={dismissNote}
            onChange={(e) => setDismissNote(e.target.value)}
            placeholder="Any context that might help improve future predictions..."
          />
          <Box
            sx={{
              p: 1.5,
              borderRadius: 1,
              backgroundColor: 'rgba(237, 108, 2, 0.06)',
              border: '1px solid',
              borderColor: 'rgba(237, 108, 2, 0.2)',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TrendingUpIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="caption" color="text.secondary">
                This dismissal will be used to improve future predictions for this partner and file pattern.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Modal>
    </PageLayout>
  );
}
