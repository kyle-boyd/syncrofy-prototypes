import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Checkbox,
  Menu,
  MenuItem as MuiMenuItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
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

// ─── Types ───────────────────────────────────────────────────────────────────

interface ExceptionItem {
  id: string;
  status: 'pending' | 'in_progress';
  partnerName: string;
  fileName: string;
  frequency: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  openDuration: string;
  modified: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockExceptions: ExceptionItem[] = [
  { id: '1',  status: 'pending',     partnerName: 'Summit Energy Partners',         fileName: 'test_notification_settings.txt', frequency: 'Every 10 minutes, every day', severity: 'critical', openDuration: '10 minutes', modified: '' },
  { id: '2',  status: 'pending',     partnerName: '1234',                           fileName: 'file.txt',                       frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '3',  status: 'pending',     partnerName: 'AWS S3',                         fileName: 'ARTHURTEST',                     frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '4',  status: 'pending',     partnerName: 'John Deere',                     fileName: 'report.txt',                     frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '5',  status: 'pending',     partnerName: 'Commercial Loan System',         fileName: 'abc.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '6',  status: 'pending',     partnerName: 'Mainframe',                      fileName: 'ABC.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '7',  status: 'pending',     partnerName: 'Hello',                          fileName: 'file.txt',                       frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '8',  status: 'pending',     partnerName: 'SAP Krishna',                    fileName: '',                               frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '9',  status: 'pending',     partnerName: 'John Deere US',                  fileName: 'abc.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '10', status: 'pending',     partnerName: 'Summit Energy Partners',         fileName: 'test_notification_settings.txt', frequency: 'Every 10 minutes, every day', severity: 'critical', openDuration: '40 minutes', modified: '' },
  { id: '11', status: 'in_progress', partnerName: 'Summit Energy Partners',         fileName: 'test_notification_settings.txt', frequency: 'Every 10 minutes, every day', severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '12', status: 'in_progress', partnerName: '1234',                           fileName: 'file.txt',                       frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '13', status: 'in_progress', partnerName: 'AWS S3',                         fileName: 'ARTHURTEST',                     frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '14', status: 'pending',     partnerName: 'John Deere',                     fileName: 'report.txt',                     frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '15', status: 'pending',     partnerName: 'Commercial Loan System',         fileName: 'abc.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '16', status: 'pending',     partnerName: 'Mainframe',                      fileName: 'ABC.txt',                        frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
  { id: '17', status: 'pending',     partnerName: 'Hello',                          fileName: 'file.txt',                       frequency: 'Every hour, every day',         severity: 'critical', openDuration: '1 hour',     modified: '' },
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

  // Filter state (kept simple for prototype – chips are static)
  const [filterStates, setFilterStates] = useState<Record<string, string>>({});

  const isAllSelected    = selected.length === mockExceptions.length;
  const isIndeterminate  = selected.length > 0 && selected.length < mockExceptions.length;

  const handleSelectAll = (_: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(isAllSelected ? [] : mockExceptions.map((e) => e.id));

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
      id: 'type',
      label: 'Type',
      options: [
        { value: '', label: 'All' },
        { value: 'late', label: 'Late Rule' },
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

  // Active filter chips (static for prototype)
  const activeFilterChips = [
    { id: 'date-chip',      label: 'Date: 2/1/2026 – 3/3/2026' },
    { id: 'status-pending', label: 'Status: Pending' },
    { id: 'status-ip',      label: 'Status: In Progress' },
  ];

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
      render: (row) => (
        <RadioButtonUncheckedIcon
          sx={{
            fontSize: 18,
            color: row.status === 'pending' ? '#F97316' : '#3B82F6',
          }}
        />
      ),
    },
    {
      id: 'exception',
      label: 'Exception',
      render: (row) => (
        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
          <strong>{row.partnerName}</strong>
          {' was supposed to send a file'}
          {row.fileName ? <> named <strong>{row.fileName}</strong></> : null}
          {' by '}
          <strong>{row.frequency}</strong>
          {'.'}
        </Typography>
      ),
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
          {filterDefs.map((f) => (
            <Dropdown
              key={f.id}
              options={f.options}
              value={filterStates[f.id] ?? ''}
              onSelect={(val) => setFilterStates((prev) => ({ ...prev, [f.id]: String(val) }))}
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
              onDelete={() => {}}
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
          rows={mockExceptions}
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
    </PageLayout>
  );
}

export default Exceptions;
