import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Checkbox,
  Menu,
  MenuItem as MuiMenuItem,
  Divider,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import {
  Table,
  TableColumn,
  Tag,
  Button,
  Tabs,
  Dropdown,
  Chips,
  IconButton,
} from '@design-system';
import { PageLayout } from '../components/PageLayout';
import {
  ExceptionDetailModal,
  ExceptionDetail,
  ExceptionType,
  renderExceptionSentence,
  exceptionStatusConfig,
} from '../components/ExceptionDetailModal';
import { exceptionToTransfers } from '../mocks/exceptionTransferLinks';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ExceptionItem {
  id: string;
  type: ExceptionType;
  status: 'pending' | 'in_progress' | 'resolved' | 'dismissed';
  partnerName: string;
  fileName: string;
  frequency: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  openDuration: string;
  modified: string;
  // Type-specific
  failureCount?: number;
  failureWindow?: string;
  stagedDuration?: string;
  retryMode?: 'first_failure' | 'after_retries';
  retryCount?: number;
  // Detail meta
  category?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  watchCount?: number;
  openedAt?: string;
  lastModifiedAt?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockExceptions: ExceptionItem[] = [
  { id: '1',  type: 'missing_file', status: 'pending',     partnerName: 'Summit Energy Partners',         fileName: 'test_notification_settings.txt', frequency: 'Every 10 minutes, every day', severity: 'critical', openDuration: '10 minutes', modified: '' },
  { id: '2',  type: 'missing_file', status: 'pending',     partnerName: '1234',                           fileName: 'file.txt',                       frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '3',  type: 'missing_file', status: 'pending',     partnerName: 'AWS S3',                         fileName: 'ARTHURTEST',                     frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '4',  type: 'missing_file', status: 'pending',     partnerName: 'John Deere',                     fileName: 'report.txt',                     frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '5',  type: 'missing_file', status: 'pending',     partnerName: 'Commercial Loan System',         fileName: 'abc.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '6',  type: 'missing_file', status: 'pending',     partnerName: 'Mainframe',                      fileName: 'ABC.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '7',  type: 'missing_file', status: 'pending',     partnerName: 'Hello',                          fileName: 'file.txt',                       frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '8',  type: 'missing_file', status: 'pending',     partnerName: 'SAP Krishna',                    fileName: '',                               frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '9',  type: 'missing_file', status: 'pending',     partnerName: 'John Deere US',                  fileName: 'abc.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '10', type: 'missing_file', status: 'pending',     partnerName: 'Summit Energy Partners',         fileName: 'test_notification_settings.txt', frequency: 'Every 10 minutes, every day', severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '11', type: 'missing_file', status: 'in_progress', partnerName: 'Summit Energy Partners',         fileName: 'test_notification_settings.txt', frequency: 'Every 10 minutes, every day', severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '12', type: 'missing_file', status: 'in_progress', partnerName: '1234',                           fileName: 'file.txt',                       frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '13', type: 'missing_file', status: 'in_progress', partnerName: 'AWS S3',                         fileName: 'ARTHURTEST',                     frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '14', type: 'missing_file', status: 'pending',     partnerName: 'John Deere',                     fileName: 'report.txt',                     frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '15', type: 'missing_file', status: 'pending',     partnerName: 'Commercial Loan System',         fileName: 'abc.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '16', type: 'missing_file', status: 'pending',     partnerName: 'Mainframe',                      fileName: 'ABC.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '17', type: 'missing_file', status: 'pending',     partnerName: 'Hello',                          fileName: 'file.txt',                       frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },

  // ─── Frequent Transfer Failures ────────────────────────────────────────────
  { id: '18', type: 'frequent_failures',      status: 'pending',     partnerName: 'AWS S3',                  fileName: '',              frequency: '', severity: 'critical', openDuration: '12 minutes', modified: '', failureCount: 8,  failureWindow: '15 minutes' },
  { id: '19', type: 'frequent_failures',      status: 'in_progress', partnerName: 'Goldman Sachs',           fileName: '',              frequency: '', severity: 'high',     openDuration: '45 minutes', modified: '', failureCount: 12, failureWindow: '30 minutes' },

  // ─── Transfer Failure (single) ─────────────────────────────────────────────
  { id: '20', type: 'transfer_failure',       status: 'pending',     partnerName: 'John Deere',              fileName: 'report.txt',    frequency: '', severity: 'high',     openDuration: '5 minutes',  modified: '', retryMode: 'first_failure' },
  { id: '21', type: 'transfer_failure',       status: 'pending',     partnerName: 'Mainframe',               fileName: 'payroll.csv',   frequency: '', severity: 'critical', openDuration: '20 minutes', modified: '', retryMode: 'after_retries', retryCount: 3 },

  // ─── Zero Byte File ────────────────────────────────────────────────────────
  { id: '22', type: 'zero_byte',              status: 'pending',     partnerName: 'Fidelity',                fileName: 'positions.csv', frequency: '', severity: 'medium',   openDuration: '8 minutes',  modified: '' },
  { id: '23', type: 'zero_byte',              status: 'in_progress', partnerName: 'Northern Trust',          fileName: 'eod.xml',       frequency: '', severity: 'high',     openDuration: '32 minutes', modified: '' },

  // ─── Staged but Not Picked Up ──────────────────────────────────────────────
  { id: '24', type: 'staged_not_picked_up',   status: 'pending',     partnerName: 'Core Banking System',     fileName: 'batch_*.dat',   frequency: '', severity: 'high',     openDuration: '2 hours',    modified: '', stagedDuration: '2 hours' },
  { id: '25', type: 'staged_not_picked_up',   status: 'pending',     partnerName: 'Trade Settlement Platform', fileName: 'trades.csv',  frequency: '', severity: 'critical', openDuration: '4 hours',    modified: '', stagedDuration: '4 hours' },

  // ─── Expected File Received ────────────────────────────────────────────────
  { id: '26', type: 'expected_file_received', status: 'pending',     partnerName: 'Acme Corp',               fileName: 'invoice_*.xml', frequency: '', severity: 'low',      openDuration: '2 minutes',  modified: '' },
  { id: '27', type: 'expected_file_received', status: 'pending',     partnerName: 'Delta Manufacturing',     fileName: 'orders_*.json', frequency: '', severity: 'medium',   openDuration: '6 minutes',  modified: '' },

  // ─── Staged File Downloaded ────────────────────────────────────────────────
  { id: '28', type: 'staged_downloaded',      status: 'pending',     partnerName: 'Anderson & Sons',         fileName: 'report_*.csv',  frequency: '', severity: 'low',      openDuration: '3 minutes',  modified: '' },

  // ─── File Delivered to Partner ─────────────────────────────────────────────
  { id: '29', type: 'file_delivered',         status: 'pending',     partnerName: 'SAP Krishna',             fileName: 'invoice_*.xml', frequency: '', severity: 'low',      openDuration: '1 minute',   modified: '' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getSeverityConfig = (severity: ExceptionItem['severity']) => {
  switch (severity) {
    case 'critical': return { label: 'Critical', variant: 'error'   as const, icon: <ArrowUpwardIcon /> };
    case 'high':     return { label: 'High',     variant: 'warning' as const, icon: <ArrowUpwardIcon /> };
    case 'medium':   return { label: 'Medium',   variant: 'primary' as const, icon: <ArrowForwardIcon /> };
    case 'low':      return { label: 'Low',      variant: 'neutral' as const, icon: <ArrowForwardIcon /> };
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

function Exceptions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]     = useState<string>('active');
  const [viewMode, setViewMode]       = useState<'list' | 'grid' | 'table'>('list');
  const [selected, setSelected]       = useState<string[]>([]);
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedExceptionIdx, setSelectedExceptionIdx] = useState<number | null>(null);
  const [typeMenuAnchor, setTypeMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTypes, setSelectedTypes] = useState<ExceptionType[]>([]);

  // Enrich rows with detail fields used by the modal
  const enrichException = (e: ExceptionItem): ExceptionDetail => ({
    id: e.id,
    type: e.type,
    status: e.status,
    partnerName: e.partnerName,
    fileName: e.fileName,
    frequency: e.frequency,
    severity: e.severity,
    failureCount: e.failureCount,
    failureWindow: e.failureWindow,
    stagedDuration: e.stagedDuration,
    retryMode: e.retryMode,
    retryCount: e.retryCount,
    category: e.category ?? 'Commercial Banking',
    assigneeName: e.assigneeName ?? 'Cindy Baker',
    assigneeInitials: e.assigneeInitials ?? 'CB',
    watchCount: e.watchCount ?? 0,
    openedAt: e.openedAt ?? 'May 12, 2026 at 11:00 AM',
    lastModifiedAt: e.lastModifiedAt,
    relatedTransfers: exceptionToTransfers[e.id],
  });

  // Filter state (kept simple for prototype – chips are static)
  const [filterStates, setFilterStates] = useState<Record<string, string>>({});

  const filteredExceptions = mockExceptions.filter((e) => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(e.type)) return false;
    return true;
  });

  const selectedException =
    selectedExceptionIdx != null ? enrichException(filteredExceptions[selectedExceptionIdx]) : null;

  const isAllSelected    = selected.length === filteredExceptions.length && filteredExceptions.length > 0;
  const isIndeterminate  = selected.length > 0 && selected.length < filteredExceptions.length;

  const handleSelectAll = (_: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(isAllSelected ? [] : filteredExceptions.map((e) => e.id));

  const handleSelectRow = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  // ── Filter options ─────────────────────────────────────────────────────────

  const filterDefs = [
    {
      id: 'partnerSystem',
      label: 'Partner/System',
      options: [
        { value: '', label: 'All' },
        { value: 'summit', label: 'Summit Energy Partners' },
        { value: 'aws', label: 'AWS S3' },
        { value: 'johnDeere', label: 'John Deere' },
      ],
    },
    {
      id: 'date',
      label: 'Date (1)',
      options: [
        { value: 'custom', label: '2/1/2026 – 3/3/2026' },
        { value: 'last7',  label: 'Last 7 days' },
        { value: 'last30', label: 'Last 30 days' },
      ],
    },
    {
      id: 'status',
      label: 'Status (2)',
      options: [
        { value: 'pending',     label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'resolved',    label: 'Resolved' },
      ],
    },
    {
      id: 'severity',
      label: 'Severity',
      options: [
        { value: '', label: 'All' },
        { value: 'critical', label: 'Critical' },
        { value: 'high',     label: 'High' },
        { value: 'medium',   label: 'Medium' },
        { value: 'low',      label: 'Low' },
      ],
    },
    {
      id: 'assignedTo',
      label: 'Assigned to',
      options: [
        { value: '', label: 'All' },
        { value: 'me', label: 'Me' },
      ],
    },
  ];

  const typeOptions: { value: ExceptionType; label: string }[] = [
    { value: 'missing_file',           label: 'Missing File' },
    { value: 'frequent_failures',      label: 'Frequent Transfer Failures' },
    { value: 'transfer_failure',       label: 'Transfer Failure' },
    { value: 'zero_byte',              label: 'Zero Byte File' },
    { value: 'staged_not_picked_up',   label: 'Staged but Not Picked Up' },
    { value: 'expected_file_received', label: 'Expected File Received' },
    { value: 'staged_downloaded',      label: 'Staged File Downloaded' },
    { value: 'file_delivered',         label: 'File Delivered to Partner' },
  ];

  const toggleType = (val: ExceptionType) =>
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );

  const typeLabelFor = (val: ExceptionType) =>
    typeOptions.find((o) => o.value === val)?.label ?? val;

  // Active filter chips — static placeholders plus dynamic type chips
  const staticFilterChips = [
    { id: 'date-chip',      label: 'Date: 2/1/2026 – 3/3/2026', onDelete: () => {} },
    { id: 'status-pending', label: 'Status: Pending',           onDelete: () => {} },
    { id: 'status-ip',      label: 'Status: In Progress',       onDelete: () => {} },
  ];
  const typeFilterChips = selectedTypes.map((t) => ({
    id: `type-${t}`,
    label: `Type: ${typeLabelFor(t)}`,
    onDelete: () => toggleType(t),
  }));
  const activeFilterChips = [...staticFilterChips, ...typeFilterChips];

  // ── Table columns ──────────────────────────────────────────────────────────

  const columns: TableColumn<ExceptionItem>[] = [
    {
      id: 'checkbox',
      label: '',
      headerCheckbox: true,
      headerCheckboxChecked: isAllSelected,
      headerCheckboxIndeterminate: isIndeterminate,
      onHeaderCheckboxChange: handleSelectAll,
      width: 48,
      sortable: false,
      render: (row) => (
        <Checkbox
          size="small"
          checked={selected.includes(row.id)}
          onChange={() => handleSelectRow(row.id)}
          onClick={(e) => e.stopPropagation()}
          sx={{ padding: 0 }}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      width: 70,
      render: (row) => {
        const cfg = exceptionStatusConfig[row.status];
        const StatusIcon = cfg.Icon;
        return <StatusIcon sx={{ fontSize: 18, color: cfg.color }} />;
      },
    },
    {
      id: 'exception',
      label: 'Exception',
      render: (row) => {
        const idx = filteredExceptions.findIndex((e) => e.id === row.id);
        return (
          <Typography
            variant="body2"
            onClick={() => setSelectedExceptionIdx(idx)}
            sx={{
              lineHeight: 1.5,
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {renderExceptionSentence(enrichException(row))}
          </Typography>
        );
      },
    },
    {
      id: 'severity',
      label: 'Severity',
      width: 130,
      render: (row) => {
        const cfg = getSeverityConfig(row.severity);
        return <Tag label={cfg.label} variant={cfg.variant} icon={cfg.icon} size="small" />;
      },
    },
    {
      id: 'open',
      label: 'Open ↓',
      width: 120,
      render: (row) => <Typography variant="body2">{row.openDuration}</Typography>,
    },
    {
      id: 'modified',
      label: 'Modified',
      width: 150,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">{row.modified || '—'}</Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      width: 80,
      sortable: false,
      render: (_row) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setRowMenuAnchor(e.currentTarget);
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  // ── Tabs ───────────────────────────────────────────────────────────────────

  const tabs = [
    { label: 'My Exceptions', value: 'my' },
    { label: 'Unassigned',    value: 'unassigned' },
    { label: 'Active',        value: 'active' },
    { label: 'Watched',       value: 'watched' },
    { label: 'Resolved',      value: 'resolved' },
    { label: 'Custom ▾',      value: 'custom' },
  ];

  // ── View-mode icon button ──────────────────────────────────────────────────

  const ViewModeButton = ({
    mode,
    children,
  }: {
    mode: 'list' | 'grid' | 'table';
    children: React.ReactNode;
  }) => (
    <IconButton
      size="small"
      onClick={() => setViewMode(mode)}
      sx={{
        height: 32,
        width: 32,
        padding: '6px',
        backgroundColor: viewMode === mode ? 'background.paper' : 'transparent',
        borderRadius: '6px',
        boxShadow: viewMode === mode ? 1 : 'none',
        '&:hover': {
          backgroundColor: viewMode === mode ? 'background.paper' : 'action.hover',
        },
      }}
    >
      {children}
    </IconButton>
  );

  return (
    <PageLayout selectedNavItem="exceptions" backgroundColor="#FAFCFC">
      <Stack spacing={2} sx={{ mb: 2 }}>

        {/* ── Header Row ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography
              variant="h6"
              sx={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.4px', color: 'text.primary' }}
            >
              Exceptions
            </Typography>
            <IconButton
              size="small"
              onClick={() => navigate('/exceptions/rules')}
              sx={{ width: 32, height: 32 }}
            >
              <SettingsIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
              Last refreshed: Just now
            </Typography>
            <IconButton
              size="small"
              sx={{
                width: 32, height: 32,
                border: '1px solid', borderColor: 'divider',
                borderRadius: '6px',
                boxShadow: '0px 1px 2px -2px rgba(0,0,0,0.04)',
              }}
            >
              <RefreshIcon sx={{ fontSize: 16, color: 'text.primary' }} />
            </IconButton>
          </Box>
        </Box>

        {/* ── Tabs Row ── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tabs
            tabs={tabs}
            value={activeTab}
            onChange={(_, val) => setActiveTab(String(val))}
            sx={{
              flex: 1,
              '& .MuiTabs-root': { borderBottom: 'none' },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                minHeight: 40,
                padding: '6px 16px',
              },
            }}
          />
          <IconButton size="small" sx={{ mb: 0.5, mr: 0.5 }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
      </Stack>

      {/* ── Filter Controls ── */}
      {/*
        NOTE: Missing design system component — a filter bar that supports:
          - 3-way view-mode toggle (list / grid / table)
          - Bulk Actions dropdown positioned on the far right
        The existing FilterControls only supports list/grid toggle and doesn't
        have a "Bulk Actions"-style grouped action. Built manually below.
      */}
      <Box
        sx={{
          p: 2,
          mb: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
        }}
      >
        {/* Row 1: Filter dropdowns + view controls + Bulk Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* Type filter (multi-select) */}
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            endIcon={<ExpandMoreIcon />}
            onClick={(e) => setTypeMenuAnchor(e.currentTarget)}
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 400,
              justifyContent: 'space-between',
              minWidth: 120,
            }}
          >
            {selectedTypes.length === 0
              ? 'Type'
              : selectedTypes.length === 1
                ? `Type: ${typeLabelFor(selectedTypes[0])}`
                : `Type (${selectedTypes.length})`}
          </Button>
          <Menu
            anchorEl={typeMenuAnchor}
            open={Boolean(typeMenuAnchor)}
            onClose={() => setTypeMenuAnchor(null)}
            PaperProps={{ sx: { borderRadius: '8px', boxShadow: 3, minWidth: 260, mt: 0.5 } }}
          >
            {typeOptions.map((o) => (
              <MuiMenuItem
                key={o.value}
                dense
                onClick={() => toggleType(o.value)}
                sx={{ py: 0.5 }}
              >
                <Checkbox
                  size="small"
                  checked={selectedTypes.includes(o.value)}
                  sx={{ p: 0.5, mr: 1 }}
                />
                <Typography variant="body2">{o.label}</Typography>
              </MuiMenuItem>
            ))}
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ display: 'flex', gap: 1, px: 1.5, py: 1 }}>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                fullWidth
                onClick={() => setSelectedTypes(typeOptions.map((o) => o.value))}
                sx={{ textTransform: 'none', fontSize: '13px', fontWeight: 400 }}
              >
                Select all
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                fullWidth
                onClick={() => setSelectedTypes([])}
                sx={{ textTransform: 'none', fontSize: '13px', fontWeight: 400 }}
              >
                Select none
              </Button>
            </Box>
          </Menu>
          {filterDefs.map((f) => (
            <Dropdown
              key={f.id}
              options={f.options}
              value={filterStates[f.id] ?? ''}
              onSelect={(val) => setFilterStates((prev) => ({ ...prev, [f.id]: String(val) }))}
              hugContents
              minWidth={240}
              trigger={
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  endIcon={<ExpandMoreIcon />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 400,
                    justifyContent: 'space-between',
                    minWidth: 120,
                  }}
                >
                  {f.label}
                </Button>
              }
            />
          ))}

          <Box sx={{ flex: 1 }} />

          {/* View mode toggle */}
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              bgcolor: 'grey.50',
              borderRadius: '8px',
              p: 0.5,
            }}
          >
            <ViewModeButton mode="list">
              <ViewListIcon sx={{ fontSize: 18 }} />
            </ViewModeButton>
            <ViewModeButton mode="grid">
              <ViewModuleIcon sx={{ fontSize: 18 }} />
            </ViewModeButton>
            <ViewModeButton mode="table">
              <TableChartOutlinedIcon sx={{ fontSize: 18 }} />
            </ViewModeButton>
          </Box>

          {/* Bulk Actions */}
          <Dropdown
            options={[
              { value: 'assign',  label: 'Assign' },
              { value: 'resolve', label: 'Resolve' },
              { value: 'watch',   label: 'Watch' },
            ]}
            onSelect={() => {}}
            trigger={
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                endIcon={<ExpandMoreIcon />}
                disabled={selected.length === 0}
                sx={{ textTransform: 'none', fontSize: '14px', fontWeight: 400 }}
              >
                Bulk Actions
              </Button>
            }
          />
        </Box>

        {/* Row 2: Result count + active filter chips */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '16px', color: 'text.primary' }}>
            7359 Exceptions
          </Typography>
          {activeFilterChips.map((chip) => (
            <Chips
              key={chip.id}
              label={chip.label}
              variant="rounded"
              size="small"
              onDelete={chip.onDelete}
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                height: '24px',
                '& .MuiChip-deleteIcon': { fontSize: '16px' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* ── Table ── */}
      <Box
        sx={{
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiTableCell-root': { borderLeft: 'none !important', borderRight: 'none !important' },
          '& .MuiTableCell-head': {
            fontWeight: 700,
            color: 'text.secondary',
            padding: '6px 12px !important',
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
          },
          '& .MuiTableCell-body': {
            padding: '6px 12px !important',
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
          },
          '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-body': {
            borderBottom: 'none !important',
          },
        }}
      >
        <Table
          columns={columns}
          rows={filteredExceptions}
          stickyHeader
          sx={{
            border: 'none',
            '& .MuiTableCell-root': { borderLeft: 'none !important', borderRight: 'none !important' },
          }}
        />
      </Box>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={rowMenuAnchor}
        open={Boolean(rowMenuAnchor)}
        onClose={() => setRowMenuAnchor(null)}
        PaperProps={{ sx: { borderRadius: '8px', boxShadow: 3, minWidth: 160 } }}
      >
        <MuiMenuItem onClick={() => setRowMenuAnchor(null)}>Assign</MuiMenuItem>
        <MuiMenuItem onClick={() => setRowMenuAnchor(null)}>Resolve</MuiMenuItem>
        <MuiMenuItem onClick={() => setRowMenuAnchor(null)}>Watch</MuiMenuItem>
        <MuiMenuItem onClick={() => setRowMenuAnchor(null)}>View Details</MuiMenuItem>
      </Menu>

      <ExceptionDetailModal
        open={selectedExceptionIdx != null}
        exception={selectedException}
        onClose={() => setSelectedExceptionIdx(null)}
        onPrev={() =>
          setSelectedExceptionIdx((i) => (i != null && i > 0 ? i - 1 : i))
        }
        onNext={() =>
          setSelectedExceptionIdx((i) =>
            i != null && i < filteredExceptions.length - 1 ? i + 1 : i,
          )
        }
        hasPrev={selectedExceptionIdx != null && selectedExceptionIdx > 0}
        hasNext={
          selectedExceptionIdx != null &&
          selectedExceptionIdx < filteredExceptions.length - 1
        }
      />
    </PageLayout>
  );
}

export default Exceptions;
