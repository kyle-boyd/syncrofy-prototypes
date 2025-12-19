import { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  Table,
  TableColumn,
  Tag,
  PageHeader,
  ViewControls,
  FilterControls,
  FilterOption
} from '@kyleboyd/design-system';
import { PageLayout } from '../components/PageLayout';

// Transfer data interface
export interface Transfer {
  id: string;
  sender: string;
  receiver: string;
  direction: 'Inbound' | 'Outbound' | 'Unknown';
  senderFileName: string;
  senderFileSize: string;
  status: 'Success' | 'Failed';
  startTime: string; // "10:52 PM, Dec 17 2025"
  endTime: string; // "10:52 PM, Dec 17 2025" or "-"
}

// Mock data matching the image description
const mockTransfers: Transfer[] = [
  {
    id: 'S77978032085213674098',
    sender: 'Partner Payroll Engine',
    receiver: 'Sunrise Builders Payroll System',
    direction: 'Outbound',
    senderFileName: 'weekly_payroll_sunrs_9168.pgp',
    senderFileSize: '4.89 MB',
    status: 'Success',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S33100120781663519971',
    sender: 'Partner Payroll Engine',
    receiver: 'Sunrise Builders',
    direction: 'Outbound',
    senderFileName: 'payroll_confirmation_sunrs_3934.pgp',
    senderFileSize: '6.93 MB',
    status: 'Failed',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S35833673559415047731',
    sender: 'John Deere',
    receiver: 'Commercial Banking New York',
    direction: 'Inbound',
    senderFileName: 'incoming_wire_2518.zip',
    senderFileSize: '14.21 MB',
    status: 'Success',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S036558100769505022024',
    sender: 'Branch Cash Operations System',
    receiver: '-',
    direction: 'Unknown',
    senderFileName: 'check_deposit_batch_046_6946.zip',
    senderFileSize: '9.95 MB',
    status: 'Failed',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '-',
  },
  {
    id: 'S285823851575222743240',
    sender: 'Joe\'s Burgers',
    receiver: 'Branch Cash Operations System',
    direction: 'Inbound',
    senderFileName: 'audit_shipment_confirm_1403.txt',
    senderFileSize: '1.55 MB',
    status: 'Success',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S89114975934067908093',
    sender: 'Loan Management System',
    receiver: 'Silverhair Builders',
    direction: 'Outbound',
    senderFileName: 'loan_deposit_advice_8110.zip',
    senderFileSize: '9.85 MB',
    status: 'Failed',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S40595348254815151069',
    sender: 'Loan Management System',
    receiver: 'Anderson & Sons',
    direction: 'Outbound',
    senderFileName: 'fund_notification_2452.zip',
    senderFileSize: '13.25 MB',
    status: 'Success',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S4075176851632767870',
    sender: 'Sunrise Builders',
    receiver: 'Partner Payroll Engine',
    direction: 'Inbound',
    senderFileName: 'weekly_payroll_sunrs_4162.pgp',
    senderFileSize: '11.75 MB',
    status: 'Failed',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S33100070005495799251',
    sender: 'Silverhair Builders',
    receiver: '-',
    direction: 'Inbound',
    senderFileName: 'weekly_payroll_anderson_3256.pgp',
    senderFileSize: '1.53 MB',
    status: 'Failed',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '-',
  },
  {
    id: 'S62534552404373423359',
    sender: 'Anderson & Sons',
    receiver: 'Partner Payroll Engine',
    direction: 'Inbound',
    senderFileName: 'weekly_payroll_anderson_3256.pgp',
    senderFileSize: '4.45 MB',
    status: 'Failed',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S90352331962042129702',
    sender: 'Sunrise Builders',
    receiver: 'Partner Payroll Engine',
    direction: 'Inbound',
    senderFileName: 'weekly_payroll_sunrs_5398.pgp',
    senderFileSize: '11.70 MB',
    status: 'Success',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S54155553231076851331',
    sender: 'Private Bank Billing Engine',
    receiver: 'Heritage Family Enterprises',
    direction: 'Outbound',
    senderFileName: 'fee_schedule_5153.zip',
    senderFileSize: '477 KB',
    status: 'Failed',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S30045685279732711406',
    sender: 'Crestline Wealth & Capital Servic...',
    receiver: 'Wealth Compliance Engine',
    direction: 'Inbound',
    senderFileName: 'kyc_refresh_6103.zip',
    senderFileSize: '4.91 MB',
    status: 'Success',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
  {
    id: 'S35582176238901853313',
    sender: 'MBS Allocation Hub',
    receiver: '-',
    direction: 'Inbound',
    senderFileName: 'mbs_alloc_4107.zip',
    senderFileSize: '4.15 MB',
    status: 'Failed',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '-',
  },
  {
    id: 'S96891615408193111776',
    sender: 'Securities Trade Engine',
    receiver: 'Stonebridge Capital Management',
    direction: 'Outbound',
    senderFileName: 'trade_confirms_7534.zip',
    senderFileSize: '8.03 MB',
    status: 'Success',
    startTime: '10:52 PM, Dec 17 2025',
    endTime: '10:52 PM, Dec 17 2025',
  },
];

type SortColumn = keyof Transfer | '';
type SortDirection = 'asc' | 'desc';

// Default column widths
const defaultColumnWidths: Record<string, number> = {
  id: 180,
  sender: 180,
  receiver: 180,
  direction: 120,
  senderFileName: 220,
  senderFileSize: 120,
  status: 100,
  startTime: 150,
  endTime: 150,
};

function Transfers() {
  const navigate = useNavigate();

  // State management
  const [selectedView, setSelectedView] = useState<string>('default');
  const [isViewFavorited, setIsViewFavorited] = useState(false);
  const [senderReceiverFilter, setSenderReceiverFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('startTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchValue, setSearchValue] = useState('');
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(defaultColumnWidths);

  // Column resize state
  const resizingColumnRef = useRef<string | null>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // Handle column resize
  const handleResizeStart = useCallback((columnId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    resizingColumnRef.current = columnId;
    startXRef.current = event.clientX;
    startWidthRef.current = columnWidths[columnId] || defaultColumnWidths[columnId] || 150;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingColumnRef.current) return;
      
      const deltaX = e.clientX - startXRef.current;
      const newWidth = Math.max(80, startWidthRef.current + deltaX); // Minimum 80px width
      
      setColumnWidths(prev => ({
        ...prev,
        [resizingColumnRef.current!]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      resizingColumnRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [columnWidths]);

  // Get unique senders and receivers for filter options
  const allSenders = useMemo(() => {
    const senders = new Set(mockTransfers.map(t => t.sender));
    return Array.from(senders).sort();
  }, []);

  const allReceivers = useMemo(() => {
    const receivers = new Set(mockTransfers.map(t => t.receiver).filter(r => r !== '-'));
    return Array.from(receivers).sort();
  }, []);

  // Filter and sort data
  const filteredAndSortedTransfers = useMemo(() => {
    let filtered = [...mockTransfers];

    // Apply search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(t =>
        t.id.toLowerCase().includes(searchLower) ||
        t.sender.toLowerCase().includes(searchLower) ||
        t.receiver.toLowerCase().includes(searchLower) ||
        t.senderFileName.toLowerCase().includes(searchLower)
      );
    }

    // Apply filter dropdowns
    if (senderReceiverFilter !== 'all') {
      filtered = filtered.filter(
        t => t.sender === senderReceiverFilter || t.receiver === senderReceiverFilter
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === bVal) return 0;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const comparison = aVal.localeCompare(bVal);
          return sortDirection === 'asc' ? comparison : -comparison;
        }

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [searchValue, senderReceiverFilter, statusFilter, sortColumn, sortDirection]);

  const handleSort = (column: keyof Transfer) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleRowClick = (transfer: Transfer) => {
    navigate(`/transfers/${transfer.id}`);
  };

  const filterOptions: FilterOption[] = [
    {
      id: 'senderReceiver',
      label: 'Sender/Receiver',
      value: senderReceiverFilter,
      options: [
        { value: 'all', label: 'All' },
        ...allSenders.map(s => ({ value: s, label: s })),
        ...allReceivers.map(r => ({ value: r, label: r })),
      ],
    },
    {
      id: 'date',
      label: 'Date',
      value: 'last30',
      options: [
        { value: 'last30', label: 'Last 30 days' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      options: [
        { value: 'all', label: 'All' },
        { value: 'Success', label: 'Success' },
        { value: 'Failed', label: 'Failed' },
      ],
    },
  ];

  // Table columns configuration
  const columns: TableColumn<Transfer>[] = [
    {
      id: 'id',
      label: 'Transfer ID',
      minWidth: 180,
      render: (row) => <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.id}</Typography>,
    },
    {
      id: 'sender',
      label: 'Sender',
      minWidth: 150,
      render: (row) => <Typography variant="body2">{row.sender}</Typography>,
    },
    {
      id: 'receiver',
      label: 'Receiver',
      minWidth: 150,
      render: (row) => <Typography variant="body2">{row.receiver}</Typography>,
    },
    {
      id: 'direction',
      label: 'Direction',
      minWidth: 120,
      render: (row) => {
        if (row.direction === 'Inbound') {
          return (
            <Tag
              variant="info"
              label="Inbound"
              size="small"
              icon={<AddCircleIcon sx={{ fontSize: 16 }} />}
            />
          );
        }
        if (row.direction === 'Outbound') {
          return (
            <Tag
              variant="warning"
              label="Outbound"
              size="small"
              icon={<ArrowCircleUpIcon sx={{ fontSize: 16 }} />}
            />
          );
        }
        return (
          <Tag
            variant="neutral"
            label="Unknown"
            size="small"
            icon={<HelpOutlineIcon sx={{ fontSize: 16 }} />}
          />
        );
      },
    },
    {
      id: 'senderFileName',
      label: 'Sender File Name',
      minWidth: 200,
      render: (row) => <Typography variant="body2">{row.senderFileName}</Typography>,
    },
    {
      id: 'senderFileSize',
      label: 'Sender File Size',
      minWidth: 120,
      render: (row) => <Typography variant="body2">{row.senderFileSize}</Typography>,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (row) => (
        <Tag
          variant={row.status === 'Success' ? 'success' : 'error'}
          label={row.status}
          size="small"
          hideIcon
        />
      ),
    },
    {
      id: 'startTime',
      label: 'Start (MST)',
      minWidth: 150,
      render: () => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>10:52 PM</Typography>
          <Typography variant="caption" color="text.secondary">Dec 17 2025</Typography>
        </Box>
      ),
    },
    {
      id: 'endTime',
      label: 'End (MST)',
      minWidth: 150,
      render: (row) => row.endTime !== '-' ? (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>10:52 PM</Typography>
          <Typography variant="caption" color="text.secondary">Dec 17 2025</Typography>
        </Box>
      ) : '-',
    },
  ];

  return (
    <PageLayout selectedNavItem="transfers" backgroundColor="#FAFCFC">
      {/* Scrollable Header Section */}
      <Stack spacing={2} sx={{ mb: 2 }}>
        <PageHeader
          title="Transfers"
          showBreadcrumb={false}
          refreshStatus="Last refreshed: 27 mins ago"
        />

        <ViewControls
          viewName={selectedView === 'default' ? 'Default View' : 'My View'}
          selectedView={selectedView}
          onViewSelect={(val) => setSelectedView(String(val))}
          viewOptions={[
            { value: 'default', label: 'Default View' },
            { value: 'myview', label: 'My View' },
          ]}
          onStarClick={() => setIsViewFavorited(!isViewFavorited)}
          onMoreOptionsClick={() => { }}
        />
      </Stack>

      {/* Sticky FilterControls */}
      <Box
        sx={{
          position: 'sticky',
          top: -24, // Negative offset to account for parent padding (p: 3 = 24px)
          zIndex: 20,
          backgroundColor: '#FAFCFC',
          pt: 3, // Add padding top to compensate for the negative top offset
          pb: 2,
          mb: 2,
          mx: -3, // Negative margin to extend to container edges
          px: 3, // Add padding back
        }}
      >
        <FilterControls
          search={{
            value: searchValue,
            onChange: setSearchValue,
          }}
          filters={filterOptions}
          onFilterChange={(id, val) => {
            if (id === 'senderReceiver') setSenderReceiverFilter(String(val));
            if (id === 'status') setStatusFilter(String(val));
          }}
          resultCount={`${filteredAndSortedTransfers.length} results`}
          layoutToggle={{
            mode: viewMode,
            onChange: (mode) => setViewMode(mode as 'list' | 'grid'),
          }}
          actions={{
            secondary: {
              label: 'Customize Columns',
              onClick: () => { },
            }
          }}
        />
      </Box>

      {/* Data Table with Sticky Header */}
      <Table
        elevation={1}
        sx={{
          backgroundColor: '#FFFFFF !important',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px',
          overflow: 'visible',
          '& .MuiTableContainer-root': {
            borderRadius: '12px',
            overflow: 'visible',
          },
          '& .MuiTable-root': {
            tableLayout: 'fixed',
          },
          '& .MuiTableCell-root': {
            paddingTop: '8px',
            paddingBottom: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          '& .MuiTableHead-root': {
            position: 'sticky',
            top: 120, // Position below the sticky FilterControls (~120px height)
            zIndex: 10,
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: '#F9FAFB !important',
            position: 'relative',
            overflow: 'visible',
          },
        }}
          columns={columns.map(col => ({
            ...col,
            width: columnWidths[col.id] || defaultColumnWidths[col.id],
            minWidth: undefined, // Remove minWidth since we're using explicit width
            label: (
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  userSelect: 'none',
                  pr: 2, // Add padding for resize handle
                  width: '100%',
                }}
                onClick={() => col.id && handleSort(col.id as keyof Transfer)}
              >
                <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                  {col.label}
                </Typography>
                {sortColumn === col.id && (
                  sortDirection === 'desc' ? <ArrowDownwardIcon sx={{ fontSize: 14 }} /> : <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                )}
                {/* Resize handle */}
                <Box
                  onMouseDown={(e) => handleResizeStart(col.id, e)}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    position: 'absolute',
                    right: -4,
                    top: -10,
                    bottom: -10,
                    width: '12px',
                    cursor: 'col-resize',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.15s ease',
                    zIndex: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: '5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: '20px',
                      width: '2px',
                      backgroundColor: 'divider',
                      borderRadius: '1px',
                    },
                    '&:hover::after': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              </Box>
            ),
          }))}
          rows={filteredAndSortedTransfers}
          getRowId={(row) => row.id}
          onRowClick={handleRowClick}
        />
    </PageLayout>
  );
}

export default Transfers;
