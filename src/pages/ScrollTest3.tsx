import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  TableSortLabel,
  Drawer,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  PageHeader,
  ViewControls,
  Table,
  TableColumn,
  Tag,
  Button,
  IconButton,
} from '@design-system';
import { PageLayout } from '../components/PageLayout';
import { Transfer } from './Transfers';

// ── Shared mock data ─────────────────────────────────────────────────────────

const mockTransfers: Transfer[] = [
  { id: 'S77978032085213674098', sender: 'Partner Payroll Engine', receiver: 'Sunrise Builders Payroll System', direction: 'Outbound', senderFileName: 'weekly_payroll_sunrs_9168.pgp', senderFileSize: '4.89 MB', status: 'Success', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S33100120781663519971', sender: 'Partner Payroll Engine', receiver: 'Sunrise Builders', direction: 'Outbound', senderFileName: 'payroll_confirmation_sunrs_3934.pgp', senderFileSize: '6.93 MB', status: 'Failed', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S35833673559415047731', sender: 'John Deere', receiver: 'Commercial Banking New York', direction: 'Inbound', senderFileName: 'incoming_wire_2518.zip', senderFileSize: '14.21 MB', status: 'Success', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S036558100769505022024', sender: 'Branch Cash Operations System', receiver: '-', direction: 'Unknown', senderFileName: 'check_deposit_batch_046_6946.zip', senderFileSize: '9.95 MB', status: 'Failed', startTime: '10:52 PM, Dec 17 2025', endTime: '-' },
  { id: 'S285823851575222743240', sender: "Joe's Burgers", receiver: 'Branch Cash Operations System', direction: 'Inbound', senderFileName: 'audit_shipment_confirm_1403.txt', senderFileSize: '1.55 MB', status: 'Success', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S89114975934067908093', sender: 'Loan Management System', receiver: 'Silverhair Builders', direction: 'Outbound', senderFileName: 'loan_deposit_advice_8110.zip', senderFileSize: '9.85 MB', status: 'Failed', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S40595348254815151069', sender: 'Loan Management System', receiver: 'Anderson & Sons', direction: 'Outbound', senderFileName: 'fund_notification_2452.zip', senderFileSize: '13.25 MB', status: 'Success', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S4075176851632767870', sender: 'Sunrise Builders', receiver: 'Partner Payroll Engine', direction: 'Inbound', senderFileName: 'weekly_payroll_sunrs_4162.pgp', senderFileSize: '11.75 MB', status: 'Failed', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S33100070005495799251', sender: 'Silverhair Builders', receiver: '-', direction: 'Inbound', senderFileName: 'weekly_payroll_anderson_3256.pgp', senderFileSize: '1.53 MB', status: 'Failed', startTime: '10:52 PM, Dec 17 2025', endTime: '-' },
  { id: 'S62534552404373423359', sender: 'Anderson & Sons', receiver: 'Partner Payroll Engine', direction: 'Inbound', senderFileName: 'weekly_payroll_anderson_3256.pgp', senderFileSize: '4.45 MB', status: 'Failed', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S90352331962042129702', sender: 'Sunrise Builders', receiver: 'Partner Payroll Engine', direction: 'Inbound', senderFileName: 'weekly_payroll_sunrs_5398.pgp', senderFileSize: '11.70 MB', status: 'Success', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S54155553231076851331', sender: 'Private Bank Billing Engine', receiver: 'Heritage Family Enterprises', direction: 'Outbound', senderFileName: 'fee_schedule_5153.zip', senderFileSize: '477 KB', status: 'Failed', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S30045685279732711406', sender: 'Crestline Wealth & Capital Servic...', receiver: 'Wealth Compliance Engine', direction: 'Inbound', senderFileName: 'kyc_refresh_6103.zip', senderFileSize: '4.91 MB', status: 'Success', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
  { id: 'S35582176238901853313', sender: 'MBS Allocation Hub', receiver: '-', direction: 'Inbound', senderFileName: 'mbs_alloc_4107.zip', senderFileSize: '4.15 MB', status: 'Failed', startTime: '10:52 PM, Dec 17 2025', endTime: '-' },
  { id: 'S96891615408193111776', sender: 'Securities Trade Engine', receiver: 'Stonebridge Capital Management', direction: 'Outbound', senderFileName: 'trade_confirms_7534.zip', senderFileSize: '8.03 MB', status: 'Success', startTime: '10:52 PM, Dec 17 2025', endTime: '10:52 PM, Dec 17 2025' },
];

const ALL_SENDERS = Array.from(new Set(mockTransfers.map(t => t.sender))).sort();
const ALL_RECEIVERS = Array.from(new Set(mockTransfers.map(t => t.receiver).filter(r => r !== '-'))).sort();

// ── Component ─────────────────────────────────────────────────────────────────

export default function ScrollTest3() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('default');
  const [isViewFavorited, setIsViewFavorited] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter state
  const [searchValue, setSearchValue] = useState('');
  const [senderFilter, setSenderFilter] = useState('all');
  const [receiverFilter, setReceiverFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Active filter chips
  interface ActiveFilter { id: string; label: string; onDelete: () => void }
  const activeFilters: ActiveFilter[] = [
    ...(searchValue ? [{ id: 'search', label: `"${searchValue}"`, onDelete: () => setSearchValue('') }] : []),
    ...(senderFilter !== 'all' ? [{ id: 'sender', label: `Sender: ${senderFilter}`, onDelete: () => setSenderFilter('all') }] : []),
    ...(receiverFilter !== 'all' ? [{ id: 'receiver', label: `Receiver: ${receiverFilter}`, onDelete: () => setReceiverFilter('all') }] : []),
    ...(statusFilter !== 'all' ? [{ id: 'status', label: `Status: ${statusFilter}`, onDelete: () => setStatusFilter('all') }] : []),
    ...(directionFilter !== 'all' ? [{ id: 'direction', label: `Direction: ${directionFilter}`, onDelete: () => setDirectionFilter('all') }] : []),
  ];

  const clearAll = () => {
    setSearchValue(''); setSenderFilter('all'); setReceiverFilter('all');
    setStatusFilter('all'); setDirectionFilter('all');
  };

  const filteredTransfers = useMemo(() => {
    let data = [...mockTransfers];
    if (searchValue) {
      const q = searchValue.toLowerCase();
      data = data.filter(t => t.id.toLowerCase().includes(q) || t.sender.toLowerCase().includes(q) || t.receiver.toLowerCase().includes(q) || t.senderFileName.toLowerCase().includes(q));
    }
    if (senderFilter !== 'all') data = data.filter(t => t.sender === senderFilter);
    if (receiverFilter !== 'all') data = data.filter(t => t.receiver === receiverFilter);
    if (statusFilter !== 'all') data = data.filter(t => t.status === statusFilter);
    if (directionFilter !== 'all') data = data.filter(t => t.direction === directionFilter);
    if (sortField) {
      data.sort((a, b) => {
        const av = String((a as any)[sortField] || '').toLowerCase();
        const bv = String((b as any)[sortField] || '').toLowerCase();
        return sortDirection === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return data;
  }, [searchValue, senderFilter, receiverFilter, statusFilter, directionFilter, sortField, sortDirection]);

  const handleSort = useCallback((field: string) => {
    setSortField(prev => {
      if (prev === field) { setSortDirection(d => d === 'asc' ? 'desc' : 'asc'); return prev; }
      setSortDirection('asc'); return field;
    });
  }, []);

  const SortLabel = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableSortLabel active={sortField === field} direction={sortField === field ? sortDirection : 'asc'} onClick={() => handleSort(field)}>
      {children}
    </TableSortLabel>
  );

  const directionConfig: Record<Transfer['direction'], { icon: typeof ArrowUpwardIcon; variant: 'warning' | 'primary' | 'neutral' }> = {
    Outbound: { icon: ArrowUpwardIcon, variant: 'warning' },
    Inbound: { icon: ArrowDownwardIcon, variant: 'primary' },
    Unknown: { icon: HelpOutlineIcon, variant: 'neutral' },
  };

  const columns: TableColumn<Transfer>[] = useMemo(() => [
    { id: 'id', label: <SortLabel field="id">Transfer ID</SortLabel>, minWidth: 200, render: (r) => <Typography variant="body2" noWrap>{r.id}</Typography> },
    { id: 'sender', label: <SortLabel field="sender">Sender</SortLabel>, minWidth: 180, render: (r) => <Typography variant="body2" noWrap>{r.sender}</Typography> },
    { id: 'receiver', label: <SortLabel field="receiver">Receiver</SortLabel>, minWidth: 180, render: (r) => <Typography variant="body2" noWrap>{r.receiver}</Typography> },
    {
      id: 'direction', label: <SortLabel field="direction">Direction</SortLabel>, minWidth: 120, render: (r) => {
        const cfg = directionConfig[r.direction]; const Icon = cfg.icon;
        return <Tag label={r.direction} variant={cfg.variant} icon={<Icon />} size="small" />;
      }
    },
    { id: 'senderFileName', label: <SortLabel field="senderFileName">Sender File Name</SortLabel>, minWidth: 220, render: (r) => <Typography variant="body2" noWrap>{r.senderFileName}</Typography> },
    { id: 'senderFileSize', label: <SortLabel field="senderFileSize">File Size</SortLabel>, minWidth: 100, render: (r) => <Typography variant="body2">{r.senderFileSize}</Typography> },
    { id: 'status', label: <SortLabel field="status">Status</SortLabel>, minWidth: 100, render: (r) => <Tag label={r.status} variant={r.status === 'Success' ? 'success' : 'error'} size="small" /> },
    {
      id: 'startTime', label: <SortLabel field="startTime">Start (MST)</SortLabel>, minWidth: 160, render: (r) => {
        if (r.startTime === '-') return <Typography variant="body2">-</Typography>;
        const [t, d] = r.startTime.split(', ');
        return <Box><Typography variant="body2">{t}</Typography><Typography variant="body2" color="text.secondary">{d}</Typography></Box>;
      }
    },
    {
      id: 'endTime', label: <SortLabel field="endTime">End (MST)</SortLabel>, minWidth: 160, render: (r) => {
        if (r.endTime === '-') return <Typography variant="body2">-</Typography>;
        const [t, d] = r.endTime.split(', ');
        return <Box><Typography variant="body2">{t}</Typography><Typography variant="body2" color="text.secondary">{d}</Typography></Box>;
      }
    },
  ], [sortField, sortDirection]);

  return (
    <PageLayout selectedNavItem="transfers" backgroundColor="#FAFCFC" contentPadding={0}>

      {/* Page header */}
      <Stack spacing={2} sx={{ mb: 2, px: 3, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="text" color="secondary" size="small" onClick={() => navigate('/scroll-test')}
            sx={{ textTransform: 'none', fontWeight: 400, color: 'text.secondary', minWidth: 0, px: 0.5 }}>
            ← Scroll Test
          </Button>
          <Typography variant="body2" color="text.secondary">/</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Option 3 — Slide-In Filter Panel</Typography>
        </Box>
        <PageHeader title="Transfers" showBreadcrumb={false} refreshStatus="Last refreshed: 27 mins ago" />
        <ViewControls
          viewName="Default View"
          selectedView={selectedView}
          onViewSelect={(val) => setSelectedView(String(val))}
          viewOptions={[{ value: 'default', label: 'Default View' }, { value: 'myview', label: 'My View' }]}
          onStarClick={() => setIsViewFavorited(!isViewFavorited)}
          onMoreOptionsClick={() => { }}
        />
      </Stack>

      {/* Table toolbar — sticky, compact, no filters visible */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          bgcolor: '#FAFCFC',
          px: 3,
          py: 1,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Result count */}
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mr: 1 }}>
          {filteredTransfers.length} results
        </Typography>

        {/* Active filter chips */}
        {activeFilters.map(f => (
          <Chip
            key={f.id}
            label={f.label}
            size="small"
            onDelete={f.onDelete}
            deleteIcon={<CloseIcon />}
            sx={{
              bgcolor: 'primary.50',
              border: '1px solid',
              borderColor: 'primary.200',
              color: 'primary.main',
              fontWeight: 500,
              fontSize: '12px',
              '& .MuiChip-deleteIcon': { color: 'primary.main', fontSize: 14 },
            }}
          />
        ))}

        {/* Clear all */}
        {activeFilters.length > 1 && (
          <Button variant="text" color="secondary" size="small" onClick={clearAll}
            sx={{ textTransform: 'none', fontSize: '12px', color: 'text.secondary', minWidth: 0, px: 0.5 }}>
            Clear all
          </Button>
        )}

        <Box sx={{ flex: 1 }} />

        {/* Filters button */}
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          startIcon={<TuneIcon />}
          onClick={() => setDrawerOpen(true)}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            borderColor: activeFilters.length > 0 ? 'primary.main' : undefined,
            color: activeFilters.length > 0 ? 'primary.main' : undefined,
          }}
        >
          Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}
        </Button>
      </Box>

      {/* Table */}
      <Box
        sx={{
          mx: 3,
          mb: 3,
          borderRadius: '8px',
          overflow: 'visible',
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiTableContainer-root': { overflow: 'visible' },
          '& .MuiTableHead-root': { position: 'static' },
          // Sticky header clears the compact toolbar (~49px) + page top offset
          '& .MuiTableCell-stickyHeader': { top: '49px' },
          '& .MuiTableCell-root': { borderLeft: 'none !important', borderRight: 'none !important' },
          '& .MuiTableCell-head': { fontWeight: 700, color: 'text.secondary', padding: '6px 12px !important', borderBottom: '1px solid', borderBottomColor: 'divider' },
          '& .MuiTableCell-body': { padding: '6px 12px !important', borderBottom: '1px solid', borderBottomColor: 'divider' },
          '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-body': { borderBottom: 'none !important' },
          '& .MuiTable-root': { tableLayout: 'fixed', width: '100%' },
          '& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root:first-of-type': { borderTopLeftRadius: '7px' },
          '& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root:last-of-type': { borderTopRightRadius: '7px' },
        }}
      >
        <Table
          columns={columns}
          rows={filteredTransfers}
          getRowId={(row) => row.id}
          stickyHeader
          bordered={false}
          sx={{ border: 'none' }}
          {...({ onRowClick: (row: any) => navigate(`/transfers/${row.id}`) } as any)}
        />
      </Box>

      {/* ── Filter Drawer ── */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 320,
            p: 0,
            boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
          },
        }}
      >
        {/* Drawer header */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>Filters</Typography>
          <IconButton size="small" onClick={() => setDrawerOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Drawer body */}
        <Stack spacing={2.5} sx={{ px: 2.5, py: 2.5, flex: 1, overflowY: 'auto' }}>
          {/* Search */}
          <TextField
            size="small"
            label="Search"
            placeholder="Transfer ID, sender, file…"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          <Divider />

          {/* Sender */}
          <FormControl size="small" fullWidth>
            <InputLabel>Sender</InputLabel>
            <Select label="Sender" value={senderFilter} onChange={e => setSenderFilter(e.target.value)}>
              <MenuItem value="all">All senders</MenuItem>
              {ALL_SENDERS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Receiver */}
          <FormControl size="small" fullWidth>
            <InputLabel>Receiver</InputLabel>
            <Select label="Receiver" value={receiverFilter} onChange={e => setReceiverFilter(e.target.value)}>
              <MenuItem value="all">All receivers</MenuItem>
              {ALL_RECEIVERS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Status */}
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Success">Success</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>

          {/* Direction */}
          <FormControl size="small" fullWidth>
            <InputLabel>Direction</InputLabel>
            <Select label="Direction" value={directionFilter} onChange={e => setDirectionFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Inbound">Inbound</MenuItem>
              <MenuItem value="Outbound">Outbound</MenuItem>
              <MenuItem value="Unknown">Unknown</MenuItem>
            </Select>
          </FormControl>

          {/* Date (static for prototype) */}
          <FormControl size="small" fullWidth>
            <InputLabel>Date</InputLabel>
            <Select label="Date" value="last30">
              <MenuItem value="last30">Last 30 days</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Drawer footer */}
        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="secondary" size="small" fullWidth onClick={clearAll} sx={{ textTransform: 'none' }}>
            Clear all
          </Button>
          <Button variant="contained" color="primary" size="small" fullWidth onClick={() => setDrawerOpen(false)} sx={{ textTransform: 'none' }}>
            Apply
          </Button>
        </Box>
      </Drawer>
    </PageLayout>
  );
}
