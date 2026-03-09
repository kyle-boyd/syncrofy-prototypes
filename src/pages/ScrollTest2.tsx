import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  TableSortLabel,
  Collapse,
  Paper,
  ClickAwayListener,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import {
  PageHeader,
  ViewControls,
  FilterControls,
  FilterOption,
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
  { id: 'S11223344556677889900', sender: 'Apex Logistics', receiver: 'Regional Distribution Hub', direction: 'Outbound', senderFileName: 'shipment_manifest_0012.xml', senderFileSize: '2.14 MB', status: 'Success', startTime: '08:15 AM, Dec 18 2025', endTime: '08:15 AM, Dec 18 2025' },
  { id: 'S22334455667788990011', sender: 'Heritage Family Enterprises', receiver: 'Partner Payroll Engine', direction: 'Inbound', senderFileName: 'payroll_hfe_dec_8821.pgp', senderFileSize: '5.67 MB', status: 'Failed', startTime: '09:30 AM, Dec 18 2025', endTime: '09:31 AM, Dec 18 2025' },
  { id: 'S33445566778899001122', sender: 'Wealth Compliance Engine', receiver: 'Crestline Wealth & Capital', direction: 'Outbound', senderFileName: 'compliance_report_4490.pdf', senderFileSize: '1.02 MB', status: 'Success', startTime: '10:00 AM, Dec 18 2025', endTime: '10:00 AM, Dec 18 2025' },
  { id: 'S44556677889900112233', sender: 'John Deere', receiver: 'Loan Management System', direction: 'Inbound', senderFileName: 'equipment_invoice_3341.zip', senderFileSize: '7.88 MB', status: 'Success', startTime: '11:20 AM, Dec 18 2025', endTime: '11:21 AM, Dec 18 2025' },
  { id: 'S55667788990011223344', sender: 'Branch Cash Operations System', receiver: 'Commercial Banking New York', direction: 'Outbound', senderFileName: 'daily_cash_summary_6612.dat', senderFileSize: '512 KB', status: 'Failed', startTime: '12:00 PM, Dec 18 2025', endTime: '-' },
  { id: 'S66778899001122334455', sender: 'Stonebridge Capital Management', receiver: 'Securities Trade Engine', direction: 'Inbound', senderFileName: 'portfolio_rebalance_2290.zip', senderFileSize: '11.43 MB', status: 'Success', startTime: '01:05 PM, Dec 18 2025', endTime: '01:06 PM, Dec 18 2025' },
  { id: 'S77889900112233445566', sender: 'MBS Allocation Hub', receiver: 'Anderson & Sons', direction: 'Outbound', senderFileName: 'mbs_settlement_0077.zip', senderFileSize: '3.75 MB', status: 'Success', startTime: '02:30 PM, Dec 18 2025', endTime: '02:30 PM, Dec 18 2025' },
  { id: 'S88990011223344556677', sender: 'Mainframe Batch Processor', receiver: 'Sunrise Builders', direction: 'Outbound', senderFileName: 'batch_output_1198.dat', senderFileSize: '22.10 MB', status: 'Failed', startTime: '03:45 PM, Dec 18 2025', endTime: '-' },
  { id: 'S99001122334455667788', sender: 'AWS S3', receiver: 'Wealth Compliance Engine', direction: 'Inbound', senderFileName: 'audit_trail_s3_5539.gz', senderFileSize: '6.22 MB', status: 'Success', startTime: '04:10 PM, Dec 18 2025', endTime: '04:11 PM, Dec 18 2025' },
  { id: 'S00112233445566778899', sender: 'SAP Krishna', receiver: 'Loan Management System', direction: 'Outbound', senderFileName: 'gl_extract_sap_8874.xml', senderFileSize: '9.56 MB', status: 'Success', startTime: '05:00 PM, Dec 18 2025', endTime: '05:01 PM, Dec 18 2025' },
  { id: 'S10203040506070809010', sender: "Joe's Burgers", receiver: 'Branch Cash Operations System', direction: 'Inbound', senderFileName: 'pos_reconcile_1144.csv', senderFileSize: '344 KB', status: 'Success', startTime: '06:22 PM, Dec 18 2025', endTime: '06:22 PM, Dec 18 2025' },
  { id: 'S20304050607080901020', sender: 'Private Bank Billing Engine', receiver: 'Stonebridge Capital Management', direction: 'Outbound', senderFileName: 'statement_q4_2025_3301.pdf', senderFileSize: '780 KB', status: 'Failed', startTime: '07:00 PM, Dec 18 2025', endTime: '07:00 PM, Dec 18 2025' },
  { id: 'S30405060708090102030', sender: 'Commercial Banking New York', receiver: 'MBS Allocation Hub', direction: 'Outbound', senderFileName: 'wire_batch_cbny_7720.dat', senderFileSize: '4.33 MB', status: 'Success', startTime: '08:15 PM, Dec 18 2025', endTime: '08:15 PM, Dec 18 2025' },
  { id: 'S40506070809010203040', sender: 'Silverhair Builders', receiver: 'Partner Payroll Engine', direction: 'Inbound', senderFileName: 'timesheet_silverhair_9934.zip', senderFileSize: '1.89 MB', status: 'Success', startTime: '09:40 PM, Dec 18 2025', endTime: '09:40 PM, Dec 18 2025' },
  { id: 'S50607080901020304050', sender: 'Anderson & Sons', receiver: 'AWS S3', direction: 'Outbound', senderFileName: 'archive_andersons_2241.tar.gz', senderFileSize: '18.77 MB', status: 'Failed', startTime: '10:55 PM, Dec 18 2025', endTime: '-' },
  { id: 'S60708090102030405060', sender: 'Regional Distribution Hub', receiver: 'Apex Logistics', direction: 'Inbound', senderFileName: 'delivery_confirm_rdh_5513.xml', senderFileSize: '657 KB', status: 'Success', startTime: '11:30 PM, Dec 18 2025', endTime: '11:30 PM, Dec 18 2025' },
  { id: 'S70809010203040506070', sender: 'Loan Management System', receiver: 'SAP Krishna', direction: 'Outbound', senderFileName: 'loan_feed_sap_6601.xml', senderFileSize: '3.12 MB', status: 'Success', startTime: '12:05 AM, Dec 19 2025', endTime: '12:05 AM, Dec 19 2025' },
  { id: 'S80901020304050607080', sender: 'John Deere', receiver: 'Mainframe Batch Processor', direction: 'Inbound', senderFileName: 'telemetry_jd_fleet_0029.zip', senderFileSize: '14.90 MB', status: 'Success', startTime: '01:15 AM, Dec 19 2025', endTime: '01:16 AM, Dec 19 2025' },
  { id: 'S90102030405060708090', sender: 'Partner Payroll Engine', receiver: 'Heritage Family Enterprises', direction: 'Outbound', senderFileName: 'payroll_hfe_final_4477.pgp', senderFileSize: '5.01 MB', status: 'Failed', startTime: '02:00 AM, Dec 19 2025', endTime: '02:00 AM, Dec 19 2025' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ScrollTest2() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('default');
  const [isViewFavorited, setIsViewFavorited] = useState(false);
  const [senderReceiverFilter, setSenderReceiverFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Collapsed filter bar state
  const [filterBarCollapsed, setFilterBarCollapsed] = useState(false);
  const [filterPillExpanded, setFilterPillExpanded] = useState(false);

  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const [filterBarHeight, setFilterBarHeight] = useState(0);

  // Collapse filter bar when page header scrolls out of view.
  // IntersectionObserver works on any scroll container, unlike window scroll events.
  useEffect(() => {
    const el = pageHeaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const hidden = !entry.isIntersecting;
        setFilterBarCollapsed(hidden);
        if (!hidden) setFilterPillExpanded(false);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track filter bar height for sticky table header offset
  useEffect(() => {
    const el = filterBarRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setFilterBarHeight(el.offsetHeight));
    observer.observe(el);
    setFilterBarHeight(el.offsetHeight);
    return () => observer.disconnect();
  }, []);

  const allSenders = useMemo(() => Array.from(new Set(mockTransfers.map(t => t.sender))).sort(), []);
  const allReceivers = useMemo(() => Array.from(new Set(mockTransfers.map(t => t.receiver).filter(r => r !== '-'))).sort(), []);

  const filteredTransfers = useMemo(() => {
    let data = [...mockTransfers];
    if (searchValue) {
      const q = searchValue.toLowerCase();
      data = data.filter(t =>
        t.id.toLowerCase().includes(q) || t.sender.toLowerCase().includes(q) ||
        t.receiver.toLowerCase().includes(q) || t.senderFileName.toLowerCase().includes(q)
      );
    }
    if (senderReceiverFilter !== 'all') data = data.filter(t => t.sender === senderReceiverFilter || t.receiver === senderReceiverFilter);
    if (statusFilter !== 'all') data = data.filter(t => t.status === statusFilter);
    if (sortField) {
      data.sort((a, b) => {
        const av = String((a as any)[sortField] || '').toLowerCase();
        const bv = String((b as any)[sortField] || '').toLowerCase();
        return sortDirection === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return data;
  }, [searchValue, senderReceiverFilter, statusFilter, sortField, sortDirection]);

  const handleSort = useCallback((field: string) => {
    setSortField(prev => {
      if (prev === field) { setSortDirection(d => d === 'asc' ? 'desc' : 'asc'); return prev; }
      setSortDirection('asc'); return field;
    });
  }, []);

  const filterOptions: FilterOption[] = [
    { id: 'senderReceiver', label: 'Sender/Receiver', value: senderReceiverFilter, options: [{ value: 'all', label: 'All' }, ...allSenders.map(s => ({ value: s, label: s })), ...allReceivers.map(r => ({ value: r, label: r }))] },
    { id: 'date', label: 'Date', value: 'last30', options: [{ value: 'last30', label: 'Last 30 days' }] },
    { id: 'status', label: 'Status', value: statusFilter, options: [{ value: 'all', label: 'All' }, { value: 'Success', label: 'Success' }, { value: 'Failed', label: 'Failed' }] },
  ];

  // Count active filters
  const activeFilterCount = [
    senderReceiverFilter !== 'all',
    statusFilter !== 'all',
    searchValue !== '',
  ].filter(Boolean).length;

  const SortLabel = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortDirection : 'asc'}
      onClick={() => handleSort(field)}
    >
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

      {/* Page header — scrolls away */}
      <Stack spacing={2} sx={{ mb: 2, px: 3, pt: 3 }} ref={pageHeaderRef}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="text" color="secondary" size="small" onClick={() => navigate('/scroll-test')}
            sx={{ textTransform: 'none', fontWeight: 400, color: 'text.secondary', minWidth: 0, px: 0.5 }}>
            ← Scroll Test
          </Button>
          <Typography variant="body2" color="text.secondary">/</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Option 2 — Collapsing Filter Bar</Typography>
        </Box>
        <PageHeader title="Transfers" showBreadcrumb={false} refreshStatus="Last refreshed: 27 mins ago" />
        <ViewControls
          viewName={selectedView === 'default' ? 'Default View' : 'My View'}
          selectedView={selectedView}
          onViewSelect={(val) => setSelectedView(String(val))}
          viewOptions={[{ value: 'default', label: 'Default View' }, { value: 'myview', label: 'My View' }]}
          onStarClick={() => setIsViewFavorited(!isViewFavorited)}
          onMoreOptionsClick={() => { }}
        />
      </Stack>

      {/* ── Sticky area ───────────────────────────────────────────────────── */}
      <Box ref={filterBarRef} sx={{ position: 'sticky', top: 0, zIndex: 30, px: 3, pb: filterBarCollapsed ? 0 : 2 }}>

        {/* Full filter bar — shown when not scrolled */}
        <Collapse in={!filterBarCollapsed} timeout={200}>
          <Box sx={{ bgcolor: '#FAFCFC', pb: 1 }}>
            <FilterControls
              search={{ value: searchValue, onChange: setSearchValue }}
              filters={filterOptions}
              onFilterChange={(id, val) => {
                if (id === 'senderReceiver') setSenderReceiverFilter(String(val));
                if (id === 'status') setStatusFilter(String(val));
              }}
              resultCount={`${filteredTransfers.length} results`}
              layoutToggle={{ mode: 'list', onChange: () => { } }}
            />
          </Box>
        </Collapse>

        {/* Collapsed pill — shown when scrolled past header */}
        <Collapse in={filterBarCollapsed} timeout={200}>
          <Box sx={{ py: 1, display: 'flex', justifyContent: 'center' }}>
            <ClickAwayListener onClickAway={() => setFilterPillExpanded(false)}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                {/* The pill button */}
                <Box
                  onClick={() => setFilterPillExpanded(v => !v)}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: filterPillExpanded ? 'primary.main' : 'divider',
                    borderRadius: '20px',
                    boxShadow: 2,
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': { borderColor: 'primary.main', boxShadow: 3 },
                  }}
                >
                  <TuneIcon sx={{ fontSize: 16, color: activeFilterCount > 0 ? 'primary.main' : 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Controls
                  </Typography>
                  {activeFilterCount > 0 && (
                    <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{activeFilterCount}</Typography>
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                    {filteredTransfers.length} results
                  </Typography>
                </Box>

                {/* Expanded floating panel */}
                <Collapse in={filterPillExpanded} timeout={150}>
                  <Paper
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 680,
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      zIndex: 100,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Filters & Search</Typography>
                      <IconButton size="small" onClick={() => setFilterPillExpanded(false)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <FilterControls
                      search={{ value: searchValue, onChange: setSearchValue }}
                      filters={filterOptions}
                      onFilterChange={(id, val) => {
                        if (id === 'senderReceiver') setSenderReceiverFilter(String(val));
                        if (id === 'status') setStatusFilter(String(val));
                      }}
                      resultCount={`${filteredTransfers.length} results`}
                      layoutToggle={{ mode: 'list', onChange: () => { } }}
                    />
                  </Paper>
                </Collapse>
              </Box>
            </ClickAwayListener>
          </Box>
        </Collapse>
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
          position: 'relative',
          '& .MuiTableContainer-root': { overflow: 'visible' },
          '& .MuiTableHead-root': { position: 'static' },
          '& .MuiTableCell-stickyHeader': { top: `${filterBarHeight}px`, backgroundColor: 'background.paper', zIndex: 5 },
          '& .MuiTableCell-root': { borderLeft: 'none !important', borderRight: 'none !important' },
          '& .MuiTableCell-head': { fontWeight: 700, color: 'text.secondary', padding: '6px 12px !important', borderBottom: '1px solid', borderBottomColor: 'divider', backgroundColor: 'background.paper' },
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
    </PageLayout>
  );
}
