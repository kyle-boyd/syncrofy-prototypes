import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Checkbox,
  FormControl,
  Select,
  MenuItem as MuiMenuItem,
  InputLabel,
  TextField,
  Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Table,
  TableColumn,
  Tag,
  Button,
  Modal,
  Toggle,
  Avatar,
  Breadcrumbs,
  Dropdown,
  IconButton,
} from '@design-system';
import { PageLayout } from '../components/PageLayout';
import PartnerSystemMultiSelect from '../components/PartnerSystemMultiSelect';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExceptionRule {
  id: string;
  name: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  partnerSystem: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: { initials: string; name: string };
  active: boolean;
}

interface CreateRuleForm {
  enabled: boolean;
  ruleCategory: string;
  ruleType: string;
  // Late Rule / Missing File fields
  partnerSystem: string[];
  frequency: string;
  filePattern: string;
  // Frequent Transfer Failures fields
  failurePartnerSystem: string[];
  failureCount: string;
  failureDuration: string;
  // Expected File Received fields
  fileMatchPartnerSystem: string[];
  fileMatchPattern: string;
  // Transfer Failure fields
  singlePartnerSystem: string[];
  singleFilePattern: string;
  retryMode: 'first_failure' | 'after_retries';
  retryCount: string;
  // Zero Byte File fields
  zeroBytePartnerSystem: string[];
  zeroByteFilePattern: string;
  // Staged Not Picked Up fields
  stagedPartnerSystem: string[];
  stagedDuration: string;
  stagedFilePattern: string;
  // Staged File Downloaded fields
  stagedDownloadedPartnerSystem: string[];
  stagedDownloadedFilePattern: string;
  // File Delivered to Partner fields
  deliveredPartnerSystem: string[];
  deliveredFilePattern: string;
  // Common fields
  assignedTo: string;
  severity: string;
  watchers: string;
  customName: string;
  description: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockRules: ExceptionRule[] = [
  { id: '1',  name: 'SAP Krishna was supposed to send a file named by Every hour, every day',                                               lastModifiedBy: 'Krishna Gajula',    lastModifiedDate: 'February 10, 2026 at 10:22',  partnerSystem: 'SAP Krishna',                       severity: 'medium',   assignedTo: { initials: 'KG', name: 'Krishna' },    active: true },
  { id: '2',  name: '1234 was supposed to send a file named 123123.12312 by 12:00 PM, on the last day of the month',                       lastModifiedBy: 'Igor Kovalev',      lastModifiedDate: 'February 5, 2026 at 08:34',   partnerSystem: '1234',                              severity: 'critical', assignedTo: { initials: 'IK', name: 'Igor' },       active: true },
  { id: '3',  name: '1234 was supposed to send a file named by Every hour, every day',                                                     lastModifiedBy: 'Rahul Pancholi',    lastModifiedDate: 'January 29, 2026 at 07:42',   partnerSystem: '1234',                              severity: 'critical', assignedTo: { initials: 'RP', name: 'Rahul' },      active: true },
  { id: '4',  name: '1234 was supposed to send a file named by 08:00 AM, every weekday',                                                   lastModifiedBy: 'Krishna Gajula',    lastModifiedDate: 'January 29, 2026 at 07:25',   partnerSystem: '1234',                              severity: 'critical', assignedTo: { initials: 'AA', name: 'Abhi' },       active: true },
  { id: '5',  name: 'COE_Test_Internal_System_For_Testing was supposed to send a file named by 05:00 PM, only on Friday',                  lastModifiedBy: 'Vince Tkac',        lastModifiedDate: 'January 28, 2026 at 08:47',   partnerSystem: 'COE_Test_Internal_System_For_Testing', severity: 'critical', assignedTo: { initials: 'AR', name: 'Arthur' },   active: true },
  { id: '6',  name: '1234 was supposed to send a file named by Every hour, every day',                                                     lastModifiedBy: 'Krishna Gajula',    lastModifiedDate: 'January 15, 2026 at 11:12',   partnerSystem: '1234',                              severity: 'critical', assignedTo: { initials: 'SS', name: 'shubhankar' }, active: true },
  { id: '7',  name: 'test file name',                                                                                                      lastModifiedBy: 'shubhankar Sengupta',lastModifiedDate: 'January 12, 2026 at 11:54',  partnerSystem: '1234',                              severity: 'critical', assignedTo: { initials: 'SS', name: 'shubhankar' }, active: false },
  { id: '8',  name: '1234 was supposed to send a file named by 05:00 PM, on the last day of the month',                                    lastModifiedBy: 'Rahul Pancholi',    lastModifiedDate: 'January 29, 2026 at 06:49',   partnerSystem: '1234',                              severity: 'critical', assignedTo: { initials: 'RP', name: 'Rahul' },      active: false },
  { id: '9',  name: 'Anderson & Sons was supposed to send a file named *.txt by Every hour, every day',                                    lastModifiedBy: 'Krishna Gajula',    lastModifiedDate: 'January 27, 2026 at 09:45',   partnerSystem: 'Anderson & Sons',                   severity: 'critical', assignedTo: { initials: 'AK', name: 'Avinash' },    active: true },
  { id: '10', name: '1234 was supposed to send a file named *.* by 08:00 AM, only on Friday',                                             lastModifiedBy: 'kamal Singh',       lastModifiedDate: 'January 6, 2026 at 06:48',    partnerSystem: '1234',                              severity: 'critical', assignedTo: { initials: 'MK', name: 'Mayank' },     active: true },
  { id: '11', name: '1234 was supposed to send a file named *.* by 12:00 PM, only on Friday',                                             lastModifiedBy: 'kamal Singh',       lastModifiedDate: 'January 7, 2026 at 10:00',    partnerSystem: '1234',                              severity: 'medium',   assignedTo: { initials: 'MK', name: 'Mayank' },     active: true },
  { id: '12', name: 'John Deere US was supposed to send a file named report.txt by 05:00 PM, only on Friday',                             lastModifiedBy: 'Vince Tkac',        lastModifiedDate: 'December 19, 2025 at 08:34',  partnerSystem: 'John Deere US',                     severity: 'critical', assignedTo: { initials: 'VT', name: 'Vince' },      active: true },
  { id: '13', name: 'John Deere rule every hour',                                                                                         lastModifiedBy: 'Krishna Gajula',    lastModifiedDate: 'January 29, 2026 at 07:21',   partnerSystem: 'John Deere Inc.',                   severity: 'high',     assignedTo: { initials: 'RP', name: 'Rahul' },      active: true },
  { id: '14', name: 'AWS S3 was supposed to send a file named ARTHURTEST by Every hour, every day',                                       lastModifiedBy: 'Arthur Rafal',      lastModifiedDate: 'December 17, 2025 at 14:02',  partnerSystem: 'AWS S3',                            severity: 'critical', assignedTo: { initials: 'AR', name: 'Arthur' },     active: true },
  { id: '15', name: '1234 was supposed to send a file named abc.txt by 08:00 AM, every day',                                              lastModifiedBy: 'kamal Singh',       lastModifiedDate: 'February 6, 2026 at 07:20',   partnerSystem: '1234',                              severity: 'critical', assignedTo: { initials: 'TS', name: 'Tracy' },      active: true },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getSeverityConfig = (severity: ExceptionRule['severity']) => {
  switch (severity) {
    case 'critical': return { label: 'Critical', variant: 'error'   as const, icon: <ArrowUpwardIcon /> };
    case 'high':     return { label: 'High',     variant: 'warning' as const, icon: <ArrowUpwardIcon /> };
    case 'medium':   return { label: 'Medium',   variant: 'primary' as const, icon: <ArrowForwardIcon /> };
    case 'low':      return { label: 'Low',      variant: 'neutral' as const, icon: <ArrowForwardIcon /> };
  }
};

const defaultForm: CreateRuleForm = {
  enabled: true,
  ruleCategory: 'all',
  ruleType: 'missing',
  partnerSystem: [],
  frequency: '',
  filePattern: '',
  failurePartnerSystem: [],
  failureCount: '',
  failureDuration: '',
  fileMatchPartnerSystem: [],
  fileMatchPattern: '',
  singlePartnerSystem: [],
  singleFilePattern: '',
  retryMode: 'first_failure',
  retryCount: '',
  zeroBytePartnerSystem: [],
  zeroByteFilePattern: '',
  stagedPartnerSystem: [],
  stagedDuration: '',
  stagedFilePattern: '',
  stagedDownloadedPartnerSystem: [],
  stagedDownloadedFilePattern: '',
  deliveredPartnerSystem: [],
  deliveredFilePattern: '',
  assignedTo: 'me',
  severity: 'critical',
  watchers: '',
  customName: '',
  description: '',
};

// ─── Module-level constants and helpers (must NOT be defined inside the component) ──

interface RuleFieldRowProps {
  filled: boolean;
  required?: boolean;
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}

const RuleFieldRow: React.FC<RuleFieldRowProps> = ({ filled, required = true, label, tooltip, children }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '8px',
      px: 2,
      py: 1.5,
      bgcolor: 'background.paper',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 200 }}>
      {filled ? (
        <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main', flexShrink: 0 }} />
      ) : (
        <RadioButtonUncheckedIcon
          sx={{ fontSize: 20, color: required ? 'error.main' : 'text.disabled', flexShrink: 0 }}
        />
      )}
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{label}</Typography>
      {tooltip && (
        <InfoOutlinedIcon
          sx={{ fontSize: 14, color: 'text.secondary', cursor: 'default' }}
          titleAccess={tooltip}
        />
      )}
    </Box>
    {children}
  </Box>
);

// ─── Component ────────────────────────────────────────────────────────────────

function ExceptionRuleConfig() {
  const [rules, setRules] = useState<ExceptionRule[]>(mockRules);
  const [scheduledExpanded, setScheduledExpanded] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateRuleForm>(defaultForm);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>('list');
  const [filterStates, setFilterStates] = useState<Record<string, string>>({});
  const [partnerSystemFilter, setPartnerSystemFilter] = useState<string[]>([]);

  const isAllSelected   = selected.length === rules.length;
  const isIndeterminate = selected.length > 0 && selected.length < rules.length;

  const handleSelectAll = (_: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(isAllSelected ? [] : rules.map((r) => r.id));
  const handleSelectRow = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const handleToggleRule = (id: string) =>
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));

  const handleDeleteRule = (id: string) =>
    setRules((prev) => prev.filter((r) => r.id !== id));

  const handleCreate = () => {
    setCreateOpen(false);
    setForm(defaultForm);
  };

  // ── Filter defs ─────────────────────────────────────────────────────────────

  const filterDefs = [
    {
      id: 'createdBy',
      label: 'Created by',
      options: [
        { value: '', label: 'All' },
        { value: 'kg', label: 'Krishna Gajula' },
        { value: 'vt', label: 'Vince Tkac' },
      ],
    },
    {
      id: 'type',
      label: 'Type',
      options: [
        { value: '', label: 'All' },
        { value: 'missing', label: 'Missing File' },
        { value: 'frequent_failures', label: 'Frequent Transfer Failures' },
        { value: 'single_failure', label: 'Transfer Failure' },
        { value: 'zero_byte', label: 'Zero Byte File' },
        { value: 'staged_not_picked_up', label: 'Staged but Not Picked Up' },
        { value: 'file_match', label: 'Expected File Received' },
        { value: 'staged_downloaded', label: 'Staged File Downloaded' },
        { value: 'file_delivered', label: 'File Delivered to Partner' },
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
    {
      id: 'severity',
      label: 'Severity',
      options: [
        { value: '', label: 'All' },
        { value: 'critical', label: 'Critical' },
        { value: 'high',     label: 'High' },
        { value: 'medium',   label: 'Medium' },
      ],
    },
  ];

  // ── View mode toggle ─────────────────────────────────────────────────────────

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
        '&:hover': { backgroundColor: viewMode === mode ? 'background.paper' : 'action.hover' },
      }}
    >
      {children}
    </IconButton>
  );

  // ── Table columns ──────────────────────────────────────────────────────────

  const columns: TableColumn<ExceptionRule>[] = [
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
      id: 'rule',
      label: 'Rule ↑',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
            {row.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Last modified by {row.lastModifiedBy} on {row.lastModifiedDate}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'partnerSystem',
      label: 'Partner or System',
      width: 220,
      render: (row) => (
        <Tag
          label={row.partnerSystem}
          variant="neutral"
          size="small"
          hideIcon
        />
      ),
    },
    {
      id: 'severity',
      label: 'Severity',
      width: 120,
      render: (row) => {
        const cfg = getSeverityConfig(row.severity);
        return <Tag label={cfg.label} variant={cfg.variant} icon={cfg.icon} size="small" />;
      },
    },
    {
      id: 'assignedTo',
      label: 'Assigned To',
      width: 160,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar size="24px" sx={{ fontSize: '10px', fontWeight: 600 }}>
            {row.assignedTo.initials}
          </Avatar>
          <Typography variant="body2">{row.assignedTo.name}</Typography>
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      width: 100,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); handleDeleteRule(row.id); }}
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <Toggle
            checked={row.active}
            size="small"
            color="primary"
            onChange={() => handleToggleRule(row.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
      ),
    },
  ];

  // ── Derived values ─────────────────────────────────────────────────────────

  const canCreate = (() => {
    switch (form.ruleType) {
      case 'frequent_failures':    return form.failurePartnerSystem.length > 0 && form.failureCount !== '' && form.failureDuration !== '';
      case 'single_failure':       return form.singlePartnerSystem.length > 0;
      case 'zero_byte':            return form.zeroBytePartnerSystem.length > 0;
      case 'staged_not_picked_up': return form.stagedPartnerSystem.length > 0 && form.stagedDuration !== '';
      case 'file_match':           return form.fileMatchPartnerSystem.length > 0 && form.fileMatchPattern !== '';
      case 'staged_downloaded':    return form.stagedDownloadedPartnerSystem.length > 0 && form.stagedDownloadedFilePattern !== '';
      case 'file_delivered':       return form.deliveredPartnerSystem.length > 0 && form.deliveredFilePattern !== '';
      default:                     return form.partnerSystem.length > 0 && form.frequency !== '';
    }
  })();

  return (
    <PageLayout selectedNavItem="exceptions" backgroundColor="#FAFCFC">

      {/* ── Breadcrumb + Header ── */}
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Breadcrumbs separator="›" sx={{ fontSize: '14px', color: 'text.secondary' }}>
          <Link
            to="/exceptions"
            style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}
          >
            Exceptions
          </Link>
          <Typography sx={{ fontSize: '14px', color: 'text.primary', fontWeight: 500 }}>
            Rule Configurations
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.4px', color: 'text.primary' }}
          >
            Exception Rule Configuration
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Create Rule
          </Button>
        </Box>
      </Stack>

      {/* ── Filter Controls ── */}
      {/*
        NOTE: Missing design system component — "Activate" button styled as
        a secondary outlined disabled button on the far right of the filter bar.
        FilterControls actions.secondary renders as primary contained. Built manually.
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <PartnerSystemMultiSelect
            value={partnerSystemFilter}
            onChange={setPartnerSystemFilter}
            placeholder="Partner/System"
            width={160}
          />
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
          <Box sx={{ display: 'flex', gap: 0.5, bgcolor: 'grey.50', borderRadius: '8px', p: 0.5 }}>
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

          {/* Activate button — disabled until rows selected */}
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            disabled={selected.length === 0}
            sx={{ textTransform: 'none', fontSize: '14px', fontWeight: 400 }}
          >
            Activate
          </Button>
        </Box>

        {/* Result count row */}
        <Box sx={{ mt: 1.5 }}>
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '16px', color: 'text.primary' }}>
            {rules.length} rules
          </Typography>
        </Box>
      </Box>

      {/* ── Rules Table ── */}
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
        {/*
          NOTE: Missing design system component — Table section/group headers.
          The design system Table doesn't support grouped row sections with
          collapsible headers. Implemented as a styled Box row above the table body.
        */}
        {/* Section header — "Scheduled Rules" */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.25,
            bgcolor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '14px' }}>
            Scheduled Rules
          </Typography>
          <Button
            variant="text"
            color="secondary"
            size="small"
            endIcon={scheduledExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setScheduledExpanded((v) => !v)}
            sx={{ textTransform: 'none', fontSize: '13px', fontWeight: 500, color: 'text.secondary' }}
          >
            {rules.length} Rules
          </Button>
        </Box>

        <Collapse in={scheduledExpanded}>
          <Table
            columns={columns}
            rows={rules}
            sx={{
              border: 'none',
              '& .MuiTableCell-root': { borderLeft: 'none !important', borderRight: 'none !important' },
              // Hide the built-in table header (section header above replaces it)
              '& .MuiTableHead-root': { display: 'none' },
            }}
          />
        </Collapse>
      </Box>

      {/* ── Create Rule Modal ── */}
      {/*
        NOTE: Missing design system components used inside this dialog:
          1. Form Select / Combobox — design system has Dropdown (menu popup) but no
             native <select>-based form control. Using MUI Select directly.
          2. Textarea — design system Input doesn't have a multiline/textarea variant.
             Using MUI TextField multiline directly.
          3. Row-level radio toggle — a UX pattern where each rule criterion row has
             an independent radio/checkbox to enable/disable that criterion.
      */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth={false}
        PaperProps={{ sx: { width: 1024, maxWidth: 1024 } }}
        showCloseButton
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 4 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                Create rule
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                Configure your rule settings.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {form.enabled ? 'Enabled' : 'Disabled'}
              </Typography>
              <Toggle
                checked={form.enabled}
                color="primary"
                size="small"
                onChange={(_, checked) => setForm((f) => ({ ...f, enabled: checked }))}
              />
            </Box>
          </Box>
        }
        actions={
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%', px: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => setCreateOpen(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled={!canCreate}
              onClick={handleCreate}
              sx={{ textTransform: 'none' }}
            >
              Create
            </Button>
          </Box>
        }
      >
        <Stack spacing={2.5}>

          {/* Rule Category + Rule Type */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ width: 240 }}>
              <InputLabel>Rule Category</InputLabel>
              <Select
                label="Rule Category"
                value={form.ruleCategory}
                onChange={(e) => {
                  const cat = e.target.value;
                  setForm((f) => ({
                    ...f,
                    ruleCategory: cat,
                    // Reset ruleType when switching categories to keep it valid
                    ruleType: cat === 'scheduled' ? 'missing'
                      : (cat === 'event' && f.ruleType === 'missing') ? 'frequent_failures'
                      : f.ruleType,
                  }));
                }}
              >
                <MuiMenuItem value="all">All Rules</MuiMenuItem>
                <MuiMenuItem value="scheduled">Scheduled Rules</MuiMenuItem>
                <MuiMenuItem value="event">Event Rules</MuiMenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 240 }}>
              <InputLabel>Rule Type</InputLabel>
              <Select
                label="Rule Type"
                value={form.ruleType}
                onChange={(e) => setForm((f) => ({ ...f, ruleType: e.target.value }))}
              >
                {(form.ruleCategory === 'all' || form.ruleCategory === 'scheduled') && (
                  <MuiMenuItem value="missing">Missing File</MuiMenuItem>
                )}
                {(form.ruleCategory === 'all' || form.ruleCategory === 'event') && [
                  <MuiMenuItem key="frequent_failures" value="frequent_failures">Frequent Transfer Failures</MuiMenuItem>,
                  <MuiMenuItem key="single_failure" value="single_failure">Transfer Failure</MuiMenuItem>,
                  <MuiMenuItem key="zero_byte" value="zero_byte">Zero Byte File</MuiMenuItem>,
                  <MuiMenuItem key="staged_not_picked_up" value="staged_not_picked_up">Staged but Not Picked Up</MuiMenuItem>,
                  <MuiMenuItem key="file_match" value="file_match">Expected File Received</MuiMenuItem>,
                  <MuiMenuItem key="staged_downloaded" value="staged_downloaded">Staged File Downloaded</MuiMenuItem>,
                  <MuiMenuItem key="file_delivered" value="file_delivered">File Delivered to Partner</MuiMenuItem>,
                ]}
              </Select>
            </FormControl>
          </Box>

          {/* ── Rule-type-specific fields ── */}

          {/* Missing File */}
          {form.ruleType === 'missing' && (
            <>
              <RuleFieldRow filled={form.partnerSystem.length > 0} label="Partner or System" tooltip="Select the partner or system that should be sending files on the defined schedule.">
                <PartnerSystemMultiSelect
                  value={form.partnerSystem}
                  onChange={(next) => setForm((f) => ({ ...f, partnerSystem: next }))}
                />
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.frequency} label="Expected Frequency" tooltip="How often the file should arrive. An exception is raised if the file has not appeared by this schedule.">
                <FormControl size="small" sx={{ width: 240 }}>
                  <InputLabel>Frequency</InputLabel>
                  <Select label="Frequency" value={form.frequency} onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}>
                    <MuiMenuItem value="every_hour">Every hour, every day</MuiMenuItem>
                    <MuiMenuItem value="every_10_min">Every 10 minutes, every day</MuiMenuItem>
                    <MuiMenuItem value="8am_weekday">08:00 AM, every weekday</MuiMenuItem>
                    <MuiMenuItem value="5pm_friday">05:00 PM, only on Friday</MuiMenuItem>
                    <MuiMenuItem value="last_day">Last day of the month</MuiMenuItem>
                  </Select>
                </FormControl>
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.filePattern} required={false} label="File Name Pattern" tooltip="Optionally match only files whose name matches this pattern, e.g. *.txt.">
                <TextField size="small" placeholder="e.g. file*.txt" value={form.filePattern} onChange={(e) => setForm((f) => ({ ...f, filePattern: e.target.value }))} sx={{ width: 240 }} />
              </RuleFieldRow>
            </>
          )}

          {/* Frequent Transfer Failures */}
          {form.ruleType === 'frequent_failures' && (
            <>
              <RuleFieldRow filled={form.failurePartnerSystem.length > 0} label="Partner or System" tooltip="Select the partner or system whose incoming or outgoing transfers should be monitored for failure spikes.">
                <PartnerSystemMultiSelect
                  value={form.failurePartnerSystem}
                  onChange={(next) => setForm((f) => ({ ...f, failurePartnerSystem: next }))}
                />
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.failureCount} label="Failed Transfers" tooltip="Enter the number of failed transfers that must occur within the selected time window to trigger this rule.">
                <TextField size="small" sx={{ width: 240 }} type="number" placeholder="e.g. 5" value={form.failureCount} onChange={(e) => setForm((f) => ({ ...f, failureCount: e.target.value }))} inputProps={{ min: 1 }} />
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.failureDuration} label="Duration / Period" tooltip="This defines the time window in which the system counts failed transfers. If the total failures reach the threshold within this period, an exception will be created.">
                <FormControl size="small" sx={{ width: 240 }}>
                  <InputLabel>Select duration</InputLabel>
                  <Select label="Select duration" value={form.failureDuration} onChange={(e) => setForm((f) => ({ ...f, failureDuration: e.target.value }))}>
                    <MuiMenuItem value="5m">5 minutes</MuiMenuItem>
                    <MuiMenuItem value="15m">15 minutes</MuiMenuItem>
                    <MuiMenuItem value="30m">30 minutes</MuiMenuItem>
                  </Select>
                </FormControl>
              </RuleFieldRow>
            </>
          )}

          {/* Expected File Received */}
          {form.ruleType === 'file_match' && (
            <>
              <RuleFieldRow filled={form.fileMatchPartnerSystem.length > 0} label="Partner or System" tooltip="Select the partner or system whose incoming transfers should be monitored for matching files.">
                <PartnerSystemMultiSelect
                  value={form.fileMatchPartnerSystem}
                  onChange={(next) => setForm((f) => ({ ...f, fileMatchPartnerSystem: next }))}
                />
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.fileMatchPattern} label="File Name Pattern" tooltip="Enter the file name pattern to watch for. An exception is triggered when a file matching this pattern is received, e.g. invoice_*.xml.">
                <TextField size="small" placeholder="e.g. invoice_*.xml" value={form.fileMatchPattern} onChange={(e) => setForm((f) => ({ ...f, fileMatchPattern: e.target.value }))} sx={{ width: 240 }} />
              </RuleFieldRow>
            </>
          )}

          {/* Transfer Failure */}
          {form.ruleType === 'single_failure' && (
            <>
              <RuleFieldRow filled={form.singlePartnerSystem.length > 0} label="Partner or System" tooltip="Select the partner or system to monitor. An exception will be created when a transfer failure is detected.">
                <PartnerSystemMultiSelect
                  value={form.singlePartnerSystem}
                  onChange={(next) => setForm((f) => ({ ...f, singlePartnerSystem: next }))}
                />
              </RuleFieldRow>

              <RuleFieldRow filled={true} required={false} label="Trigger Condition" tooltip="Choose when to trigger the exception: immediately on the first failure, or only after a specified number of retries.">
                <Box sx={{ display: 'flex', gap: 1, width: 240 }}>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <Select
                      value={form.retryMode}
                      onChange={(e) => setForm((f) => ({
                        ...f,
                        retryMode: e.target.value as 'first_failure' | 'after_retries',
                        retryCount: e.target.value === 'first_failure' ? '' : f.retryCount,
                      }))}
                    >
                      <MuiMenuItem value="first_failure">On first failure</MuiMenuItem>
                      <MuiMenuItem value="after_retries">After retries</MuiMenuItem>
                    </Select>
                  </FormControl>
                  {form.retryMode === 'after_retries' && (
                    <TextField
                      size="small"
                      type="number"
                      placeholder="e.g. 3"
                      value={form.retryCount}
                      onChange={(e) => setForm((f) => ({ ...f, retryCount: e.target.value }))}
                      inputProps={{ min: 1 }}
                      sx={{ width: 110 }}
                    />
                  )}
                </Box>
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.singleFilePattern} required={false} label="File Name Pattern" tooltip="Optionally match only files whose name matches this pattern, e.g. *.txt.">
                <TextField size="small" placeholder="e.g. file*.txt" value={form.singleFilePattern} onChange={(e) => setForm((f) => ({ ...f, singleFilePattern: e.target.value }))} sx={{ width: 240 }} />
              </RuleFieldRow>
            </>
          )}

          {/* Zero Byte File */}
          {form.ruleType === 'zero_byte' && (
            <>
              <RuleFieldRow filled={form.zeroBytePartnerSystem.length > 0} label="Partner or System" tooltip="Select the partner or system to monitor for incoming or outgoing zero byte files.">
                <PartnerSystemMultiSelect
                  value={form.zeroBytePartnerSystem}
                  onChange={(next) => setForm((f) => ({ ...f, zeroBytePartnerSystem: next }))}
                />
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.zeroByteFilePattern} required={false} label="File Name Pattern" tooltip="Optionally match only files whose name matches this pattern, e.g. *.txt.">
                <TextField size="small" placeholder="e.g. file*.txt" value={form.zeroByteFilePattern} onChange={(e) => setForm((f) => ({ ...f, zeroByteFilePattern: e.target.value }))} sx={{ width: 240 }} />
              </RuleFieldRow>
            </>
          )}

          {/* Staged but Not Picked Up */}
          {form.ruleType === 'staged_not_picked_up' && (
            <>
              <RuleFieldRow filled={form.stagedPartnerSystem.length > 0} label="Partner or System" tooltip="Select the partner or system whose staged files should be monitored for pickup delays.">
                <PartnerSystemMultiSelect
                  value={form.stagedPartnerSystem}
                  onChange={(next) => setForm((f) => ({ ...f, stagedPartnerSystem: next }))}
                />
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.stagedDuration} label="Staged Duration" tooltip="How long a file can remain staged and not picked up before an exception is triggered.">
                <FormControl size="small" sx={{ width: 240 }}>
                  <InputLabel>Select threshold</InputLabel>
                  <Select label="Select threshold" value={form.stagedDuration} onChange={(e) => setForm((f) => ({ ...f, stagedDuration: e.target.value }))}>
                    <MuiMenuItem value="30m">30 minutes</MuiMenuItem>
                    <MuiMenuItem value="1h">1 hour</MuiMenuItem>
                    <MuiMenuItem value="2h">2 hours</MuiMenuItem>
                    <MuiMenuItem value="4h">4 hours</MuiMenuItem>
                    <MuiMenuItem value="8h">8 hours</MuiMenuItem>
                  </Select>
                </FormControl>
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.stagedFilePattern} required={false} label="File Name Pattern" tooltip="Optionally match only files whose name matches this pattern, e.g. *.txt.">
                <TextField size="small" placeholder="e.g. file*.txt" value={form.stagedFilePattern} onChange={(e) => setForm((f) => ({ ...f, stagedFilePattern: e.target.value }))} sx={{ width: 240 }} />
              </RuleFieldRow>
            </>
          )}

          {/* Staged File Downloaded */}
          {form.ruleType === 'staged_downloaded' && (
            <>
              <RuleFieldRow filled={form.stagedDownloadedPartnerSystem.length > 0} label="Partner or System" tooltip="Select the partner or system whose staged files should be monitored for downloads.">
                <PartnerSystemMultiSelect
                  value={form.stagedDownloadedPartnerSystem}
                  onChange={(next) => setForm((f) => ({ ...f, stagedDownloadedPartnerSystem: next }))}
                />
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.stagedDownloadedFilePattern} label="File Name Pattern" tooltip="Enter the file name pattern to watch for. An exception is triggered when a staged file matching this pattern is downloaded, e.g. report_*.csv.">
                <TextField size="small" placeholder="e.g. report_*.csv" value={form.stagedDownloadedFilePattern} onChange={(e) => setForm((f) => ({ ...f, stagedDownloadedFilePattern: e.target.value }))} sx={{ width: 240 }} />
              </RuleFieldRow>
            </>
          )}

          {/* File Delivered to Partner */}
          {form.ruleType === 'file_delivered' && (
            <>
              <RuleFieldRow filled={form.deliveredPartnerSystem.length > 0} label="Partner or System" tooltip="Select the partner or system to monitor. An exception is triggered when a file matching the pattern is delivered to this destination.">
                <PartnerSystemMultiSelect
                  value={form.deliveredPartnerSystem}
                  onChange={(next) => setForm((f) => ({ ...f, deliveredPartnerSystem: next }))}
                />
              </RuleFieldRow>

              <RuleFieldRow filled={!!form.deliveredFilePattern} label="File Name Pattern" tooltip="Enter the file name pattern to watch for. An exception is triggered when a file matching this pattern is delivered to the selected partner or system, e.g. invoice_*.xml.">
                <TextField size="small" placeholder="e.g. invoice_*.xml" value={form.deliveredFilePattern} onChange={(e) => setForm((f) => ({ ...f, deliveredFilePattern: e.target.value }))} sx={{ width: 240 }} />
              </RuleFieldRow>
            </>
          )}

          {/* Assigned To + Severity + Watchers — common to all rule types */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ width: 240 }}>
              <InputLabel>Assigned To</InputLabel>
              <Select
                label="Assigned To"
                value={form.assignedTo}
                onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
              >
                <MuiMenuItem value="me">Me</MuiMenuItem>
                <MuiMenuItem value="team">Team</MuiMenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 240 }}>
              <InputLabel>Severity</InputLabel>
              <Select
                label="Severity"
                value={form.severity}
                onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}
              >
                <MuiMenuItem value="critical">↑ Critical</MuiMenuItem>
                <MuiMenuItem value="high">↑ High</MuiMenuItem>
                <MuiMenuItem value="medium">→ Medium</MuiMenuItem>
                <MuiMenuItem value="low">↓ Low</MuiMenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 240 }}>
              <InputLabel>Watchers</InputLabel>
              <Select
                label="Watchers"
                value={form.watchers}
                onChange={(e) => setForm((f) => ({ ...f, watchers: e.target.value }))}
              >
                <MuiMenuItem value="">No Watchers</MuiMenuItem>
                <MuiMenuItem value="team">Team</MuiMenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Custom Rule Name */}
          <TextField
            size="small"
            label="Custom Rule Name (optional)"
            placeholder="e.g. My rule name"
            value={form.customName}
            onChange={(e) => setForm((f) => ({ ...f, customName: e.target.value }))}
            fullWidth
          />

          {/* Description */}
          <TextField
            size="small"
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            multiline
            rows={3}
            fullWidth
          />
        </Stack>
      </Modal>
    </PageLayout>
  );
}

export default ExceptionRuleConfig;
