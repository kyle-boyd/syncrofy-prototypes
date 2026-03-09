import { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  TableSortLabel,
  IconButton as MuiIconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';
import ViewListIcon from '@mui/icons-material/ViewList';
import TableRowsIcon from '@mui/icons-material/TableRows';
import LayersIcon from '@mui/icons-material/Layers';
import {
  Search,
  Dropdown,
  DropdownOption,
  Table,
  TableColumn,
  Tag,
  Button,
} from '@design-system';
import { PageLayout } from '../components/PageLayout';
import { ScheduleReportModal } from '../components/ScheduleReportModal';

type ReportType = 'Transfers' | 'Exceptions';
type Frequency = 'Daily' | 'Hourly' | 'Weekly' | 'Monthly';

interface ScheduledReport {
  id: string;
  name: string;
  fromSavedView: string;
  reportType: ReportType;
  frequency: Frequency;
  frequencyDetail?: string;
}

const mockReports: ScheduledReport[] = [
  { id: '1', name: '1234 Partner Report 22', fromSavedView: '1234 Partners Transfer View', reportType: 'Transfers', frequency: 'Daily' },
  { id: '2', name: 'Acme Corp Missing and Expected Files', fromSavedView: 'Acme Corporation - Exceptions', reportType: 'Exceptions', frequency: 'Hourly' },
  { id: '3', name: 'Active Tab View', fromSavedView: 'Active_Tab_View', reportType: 'Exceptions', frequency: 'Weekly', frequencyDetail: 'on Friday' },
  { id: '4', name: 'Amantesting', fromSavedView: 'custom001', reportType: 'Exceptions', frequency: 'Daily' },
  { id: '5', name: 'Anderson and Sons Inbound Transfer Report', fromSavedView: 'JL - Anderson and Sons Inbound', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: 'Last Day' },
  { id: '6', name: 'Andrew Family Trust Report', fromSavedView: "Andrew's Family Trust - Exceptions", reportType: 'Exceptions', frequency: 'Daily' },
  { id: '7', name: 'ArthurLast3Days', fromSavedView: 'Last3Days', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: 'Last Day' },
  { id: '8', name: 'BetaNXT Failed', fromSavedView: 'BetaNXT - Failed', reportType: 'Transfers', frequency: 'Daily' },
  { id: '9', name: 'COETestUserView', fromSavedView: 'COETestUser_View', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: 'Last Day' },
  { id: '10', name: 'Commercial Banking Report', fromSavedView: 'Commercial Banking - Transfers', reportType: 'Transfers', frequency: 'Daily', frequencyDetail: 'on Weekdays' },
  { id: '11', name: 'Consumer Banking - Transfers', fromSavedView: 'Consumer Banking - Transfers', reportType: 'Transfers', frequency: 'Daily' },
  { id: '12', name: 'Corporate Banking Transfers', fromSavedView: 'Corporate Banking Transfers', reportType: 'Transfers', frequency: 'Daily' },
  { id: '13', name: 'Date Filter View With TimeStamp New', fromSavedView: 'Date_Filter_View_With_TimeStamp', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: '15th day' },
  { id: '14', name: 'Date_Filter_View_With_TimeStamp', fromSavedView: 'Date_Filter_View_With_TimeStamp', reportType: 'Transfers', frequency: 'Weekly', frequencyDetail: 'on Friday' },
  { id: '15', name: 'Exceptions Assigned To Tracy', fromSavedView: 'Exceptions - Assigned To Tracy', reportType: 'Exceptions', frequency: 'Daily', frequencyDetail: 'on Weekdays' },
  { id: '16', name: 'File Transfer Report', fromSavedView: 'File Transfer Admin - Transfers', reportType: 'Transfers', frequency: 'Daily', frequencyDetail: 'on Weekdays' },
  { id: '17', name: 'Final_Test_Transfer_View_2', fromSavedView: 'Final_Test_Transfer_View_2', reportType: 'Transfers', frequency: 'Hourly' },
  { id: '18', name: 'Global Freight Logistics Report', fromSavedView: 'Global Logistics - Exceptions', reportType: 'Exceptions', frequency: 'Daily' },
  { id: '19', name: 'Global Logistics Missing and Expected Files Daily Report', fromSavedView: 'Global Logistics: Missing & Expected Files', reportType: 'Exceptions', frequency: 'Daily', frequencyDetail: 'on Weekdays' },
  { id: '20', name: 'Horizon Manufacturing Report', fromSavedView: 'Horizon Manufacturing - Exceptions', reportType: 'Exceptions', frequency: 'Daily' },
  { id: '21', name: 'Inbound EDI 850 Report', fromSavedView: 'EDI 850 - Inbound', reportType: 'Transfers', frequency: 'Daily' },
  { id: '22', name: 'John Doe Exceptions', fromSavedView: 'JD - Exceptions View', reportType: 'Exceptions', frequency: 'Weekly', frequencyDetail: 'on Monday' },
  { id: '23', name: 'Legacy System Transfers', fromSavedView: 'Legacy - Transfers', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: '1st day' },
  { id: '24', name: 'Monthly Executive Summary', fromSavedView: 'Executive - All', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: 'Last Day' },
  { id: '25', name: 'NXT Corp Exceptions Report', fromSavedView: 'NXT Corp - Exceptions', reportType: 'Exceptions', frequency: 'Daily' },
  { id: '26', name: 'Outbound ACH Transfers', fromSavedView: 'ACH - Outbound', reportType: 'Transfers', frequency: 'Daily', frequencyDetail: 'on Weekdays' },
  { id: '27', name: 'Partner Onboarding Exceptions', fromSavedView: 'Onboarding - Exceptions', reportType: 'Exceptions', frequency: 'Weekly', frequencyDetail: 'on Wednesday' },
  { id: '28', name: 'Payroll Processing Report', fromSavedView: 'Payroll - Transfers', reportType: 'Transfers', frequency: 'Weekly', frequencyDetail: 'on Friday' },
  { id: '29', name: 'Quarterly Audit Report', fromSavedView: 'Audit - All', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: 'Last Day' },
  { id: '30', name: 'Real-Time Exceptions Alert', fromSavedView: 'Exceptions - Real-Time', reportType: 'Exceptions', frequency: 'Hourly' },
  { id: '31', name: 'Retail Banking Daily', fromSavedView: 'Retail Banking - Transfers', reportType: 'Transfers', frequency: 'Daily' },
  { id: '32', name: 'SLA Breach Exceptions', fromSavedView: 'SLA Breach - Exceptions', reportType: 'Exceptions', frequency: 'Daily', frequencyDetail: 'on Weekdays' },
  { id: '33', name: 'Supply Chain Transfers', fromSavedView: 'Supply Chain - Transfers', reportType: 'Transfers', frequency: 'Daily' },
  { id: '34', name: 'Test Automation Report', fromSavedView: 'Test_Auto_View', reportType: 'Transfers', frequency: 'Hourly' },
  { id: '35', name: 'Treasury Operations Report', fromSavedView: 'Treasury - Transfers', reportType: 'Transfers', frequency: 'Daily', frequencyDetail: 'on Weekdays' },
  { id: '36', name: 'Unresolved Exceptions Summary', fromSavedView: 'Unresolved - Exceptions', reportType: 'Exceptions', frequency: 'Daily' },
  { id: '37', name: 'Vendor Payment Transfers', fromSavedView: 'Vendor Payments - Transfers', reportType: 'Transfers', frequency: 'Weekly', frequencyDetail: 'on Thursday' },
  { id: '38', name: 'Weekly Operations Summary', fromSavedView: 'Operations - Weekly', reportType: 'Transfers', frequency: 'Weekly', frequencyDetail: 'on Monday' },
  { id: '39', name: 'Wire Transfer Report', fromSavedView: 'Wire - Transfers', reportType: 'Transfers', frequency: 'Daily' },
  { id: '40', name: 'XYZ Partner Exceptions', fromSavedView: 'XYZ - Exceptions', reportType: 'Exceptions', frequency: 'Daily' },
  { id: '41', name: 'Year-End Compliance Report', fromSavedView: 'Compliance - All', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: 'Last Day' },
  { id: '42', name: 'Zero-Value Transfers Alert', fromSavedView: 'Zero-Value - Transfers', reportType: 'Exceptions', frequency: 'Daily', frequencyDetail: 'on Weekdays' },
  { id: '43', name: 'Zenith Corp Transfers', fromSavedView: 'Zenith - Transfers', reportType: 'Transfers', frequency: 'Daily' },
  { id: '44', name: 'Alpha Team Exceptions', fromSavedView: 'Alpha - Exceptions', reportType: 'Exceptions', frequency: 'Weekly', frequencyDetail: 'on Tuesday' },
  { id: '45', name: 'Beta Release Transfers', fromSavedView: 'Beta - Transfers', reportType: 'Transfers', frequency: 'Hourly' },
  { id: '46', name: 'Critical Exceptions Daily', fromSavedView: 'Critical - Exceptions', reportType: 'Exceptions', frequency: 'Daily' },
  { id: '47', name: 'Delta Inbound Files', fromSavedView: 'Delta - Inbound', reportType: 'Transfers', frequency: 'Monthly', frequencyDetail: '15th day' },
];

const REPORT_TYPE_OPTIONS: DropdownOption[] = [
  { label: 'All Types', value: '' },
  { label: 'Transfers', value: 'Transfers' },
  { label: 'Exceptions', value: 'Exceptions' },
];

const FREQUENCY_OPTIONS: DropdownOption[] = [
  { label: 'All Frequencies', value: '' },
  { label: 'Daily', value: 'Daily' },
  { label: 'Hourly', value: 'Hourly' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
];

type SortDirection = 'asc' | 'desc';
type DensityView = 'compact' | 'default' | 'comfortable';

export default function ScheduledReports() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [densityView, setDensityView] = useState<DensityView>('default');
  const [reportTypeOpen, setReportTypeOpen] = useState(false);
  const [frequencyOpen, setFrequencyOpen] = useState(false);
  const [groupByView, setGroupByView] = useState(false);

  const filteredReports = useMemo(() => {
    let results = mockReports;
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      results = results.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (reportTypeFilter) {
      results = results.filter((r) => r.reportType === reportTypeFilter);
    }
    if (frequencyFilter) {
      results = results.filter((r) => r.frequency === frequencyFilter);
    }
    return [...results].sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [searchValue, reportTypeFilter, frequencyFilter, sortDir]);

  const groupedReports = useMemo(() => {
    if (!groupByView) return null;
    const map = new Map<string, ScheduledReport[]>();
    for (const report of filteredReports) {
      const key = report.fromSavedView;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(report);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredReports, groupByView]);

  const reportTypeLabel = reportTypeFilter || 'Report Type';
  const frequencyLabel = frequencyFilter || 'Frequency';

  const columns: TableColumn<ScheduledReport>[] = [
    {
      id: 'name',
      label: (
        <TableSortLabel
          active
          direction={sortDir}
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        >
          Scheduled Report Name
        </TableSortLabel>
      ) as unknown as string,
      minWidth: 280,
      render: (row) => (
        <Typography variant="body2" fontWeight={600} noWrap>
          {row.name}
        </Typography>
      ),
    },
    {
      id: 'fromSavedView',
      label: 'From Saved View',
      minWidth: 220,
      render: (row) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {row.fromSavedView}
        </Typography>
      ),
    },
    {
      id: 'reportType',
      label: 'Report Type',
      minWidth: 140,
      render: (row) => (
        <Tag
          label={row.reportType}
          variant="neutral"
          icon={
            row.reportType === 'Transfers' ? (
              <InsertDriveFileOutlinedIcon className="tag-icon" />
            ) : (
              <ErrorOutlineIcon className="tag-icon" />
            )
          }
        />
      ),
    },
    {
      id: 'frequency',
      label: 'Frequency',
      minWidth: 140,
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.frequency}
          </Typography>
          {row.frequencyDetail && (
            <Typography variant="caption" color="text.secondary">
              {row.frequencyDetail}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 80,
      render: () => (
        <MuiIconButton size="small">
          <MoreHorizIcon fontSize="small" />
        </MuiIconButton>
      ),
    },
  ];

  const densityBtnSx = (mode: DensityView) => ({
    height: 28,
    width: 28,
    borderRadius: '6px',
    color: densityView === mode ? 'primary.main' : 'text.secondary',
    backgroundColor: densityView === mode ? 'action.selected' : 'transparent',
    '&:hover': {
      backgroundColor: densityView === mode ? 'action.selected' : 'action.hover',
    },
  });

  return (
    <PageLayout selectedNavItem="reports" backgroundColor="#FAFCFC">
      <Stack spacing={2}>
        {/* Page title */}
        <Typography variant="h5" fontWeight={700}>
          Scheduled Reports
        </Typography>

        {/* Filter bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            px: 2,
            py: 1.5,
          }}
        >
          {/* Search */}
          <Search
            placeholder="Scheduled Report Name"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="small"
            sx={{ width: 220, '& .MuiOutlinedInput-root': { fontSize: '0.875rem' } }}
          />

          {/* Report Type dropdown */}
          <Dropdown
            options={REPORT_TYPE_OPTIONS}
            value={reportTypeFilter}
            onSelect={(v) => { setReportTypeFilter(String(v)); setReportTypeOpen(false); }}
            open={reportTypeOpen}
            onClose={() => setReportTypeOpen(false)}
            trigger={
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                endIcon={<ExpandMoreIcon />}
                onClick={() => setReportTypeOpen((o) => !o)}
                sx={{ textTransform: 'none', fontSize: 14, fontWeight: 400, minWidth: 130, justifyContent: 'space-between' }}
              >
                {reportTypeLabel}
              </Button>
            }
          />

          {/* Frequency dropdown */}
          <Dropdown
            options={FREQUENCY_OPTIONS}
            value={frequencyFilter}
            onSelect={(v) => { setFrequencyFilter(String(v)); setFrequencyOpen(false); }}
            open={frequencyOpen}
            onClose={() => setFrequencyOpen(false)}
            trigger={
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                endIcon={<ExpandMoreIcon />}
                onClick={() => setFrequencyOpen((o) => !o)}
                sx={{ textTransform: 'none', fontSize: 14, fontWeight: 400, minWidth: 120, justifyContent: 'space-between' }}
              >
                {frequencyLabel}
              </Button>
            }
          />

          {/* Group By: View Name button */}
          <Button
            variant={groupByView ? 'contained' : 'outlined'}
            color={groupByView ? 'primary' : 'secondary'}
            size="small"
            startIcon={<LayersIcon />}
            onClick={() => setGroupByView((v) => !v)}
            sx={{ textTransform: 'none', fontSize: 14, fontWeight: 400 }}
          >
            Group by: View Name
          </Button>

          <Box sx={{ flex: 1 }} />

          {/* Density view toggle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'grey.50',
              borderRadius: '8px',
              p: 0.5,
            }}
          >
            <MuiIconButton size="small" sx={densityBtnSx('compact')} onClick={() => setDensityView('compact')}>
              <ViewHeadlineIcon sx={{ fontSize: 16 }} />
            </MuiIconButton>
            <MuiIconButton size="small" sx={densityBtnSx('default')} onClick={() => setDensityView('default')}>
              <ViewListIcon sx={{ fontSize: 16 }} />
            </MuiIconButton>
            <MuiIconButton size="small" sx={densityBtnSx('comfortable')} onClick={() => setDensityView('comfortable')}>
              <TableRowsIcon sx={{ fontSize: 16 }} />
            </MuiIconButton>
          </Box>

          {/* Schedule Report button */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            Schedule Report
          </Button>
        </Box>

        {/* Result count */}
        <Typography variant="body1" fontWeight={600}>
          {filteredReports.length} Reports
        </Typography>

        {/* Table — flat or grouped */}
        {groupedReports ? (
          <Stack spacing={1.5}>
            {groupedReports.map(([viewName, rows]) => (
              <Box
                key={viewName}
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {/* Group header */}
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {viewName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({rows.length} {rows.length === 1 ? 'report' : 'reports'})
                  </Typography>
                </Box>
                <Table columns={columns} rows={rows} />
              </Box>
            ))}
          </Stack>
        ) : (
          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <Table columns={columns} rows={filteredReports} />
          </Box>
        )}
      </Stack>

      <ScheduleReportModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </PageLayout>
  );
}
