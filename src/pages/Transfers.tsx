import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  TableSortLabel,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  PageHeader,
  ViewControls,
  FilterControls,
  FilterOption,
  Table,
  TableColumn,
  Tag,
} from '@design-system';
import { PageLayout } from '../components/PageLayout';
import { CustomizeColumnsModal, ColumnConfig } from '../components/CustomizeColumnsModal';

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

// All column identifiers in display order
const ALL_COLUMN_IDS: string[] = [
  'id',
  'sender',
  'receiver',
  'direction',
  'senderFileName',
  'senderFileSize',
  'status',
  'startTime',
  'endTime',
];

// Human-readable labels for each column
const COLUMN_LABELS: Record<string, string> = {
  id: 'Transfer ID',
  sender: 'Sender',
  receiver: 'Receiver',
  direction: 'Direction',
  senderFileName: 'Sender File Name',
  senderFileSize: 'Sender File Size',
  status: 'Status',
  startTime: 'Start (MST)',
  endTime: 'End (MST)',
};

function Transfers() {
  const navigate = useNavigate();
  // State management
  const [selectedView, setSelectedView] = useState<string>('default');
  const [isViewFavorited, setIsViewFavorited] = useState(false);
  const [senderReceiverFilter, setSenderReceiverFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchValue, setSearchValue] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [customizeColumnsOpen, setCustomizeColumnsOpen] = useState(false);
  const [customizeColumnsAnchor, setCustomizeColumnsAnchor] = useState<HTMLElement | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(ALL_COLUMN_IDS);
  
  // Column resizing state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const resizeClickOffsetRef = useRef<number>(0); // Offset between click position and actual divider
  const tableRef = useRef<HTMLDivElement>(null);

  // Measure header cell positions for accurate resize handle placement
  const [headerPositions, setHeaderPositions] = useState<Record<string, { left: number; width: number }>>({});
  const [headerHeight, setHeaderHeight] = useState<number>(48);
  const filterControlsRef = useRef<HTMLDivElement>(null);
  const [filterControlsHeight, setFilterControlsHeight] = useState<number>(0);

  // Column IDs in order - defined before columns to avoid dependency issues
  const columnIds = useMemo(() => ALL_COLUMN_IDS, []);

  // Default widths for each column
  const defaultColumnWidths: Record<string, number> = {
    id: 200,
    sender: 200,
    receiver: 200,
    direction: 120,
    senderFileName: 250,
    senderFileSize: 130,
    status: 100,
    startTime: 180,
    endTime: 180,
  };

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
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortField as keyof Transfer];
        let bValue: any = b[sortField as keyof Transfer];

        // Handle special cases
        if (sortField === 'startTime' || sortField === 'endTime') {
          // Parse date strings for comparison (simple string comparison works for this format)
          aValue = aValue === '-' ? '' : aValue;
          bValue = bValue === '-' ? '' : bValue;
        } else if (sortField === 'senderFileSize') {
          // Parse file sizes (convert to bytes for comparison)
          const parseSize = (size: string): number => {
            const match = size.match(/([\d.]+)\s*(KB|MB|GB)?/i);
            if (!match) return 0;
            const num = parseFloat(match[1]);
            const unit = match[2]?.toUpperCase() || 'B';
            if (unit === 'KB') return num * 1024;
            if (unit === 'MB') return num * 1024 * 1024;
            if (unit === 'GB') return num * 1024 * 1024 * 1024;
            return num;
          };
          aValue = parseSize(aValue);
          bValue = parseSize(bValue);
        } else {
          // String comparison for other fields
          aValue = String(aValue || '').toLowerCase();
          bValue = String(bValue || '').toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchValue, senderReceiverFilter, statusFilter, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Column resizing handlers
  const handleResizeStart = useCallback((columnId: string, clickX: number) => {
    if (!tableRef.current) return;
    
    // Get current width from state or use default
    let currentWidth = columnWidths[columnId];
    if (!currentWidth) {
      currentWidth = defaultColumnWidths[columnId] || 200;
    }
    
    // Calculate the actual divider position in screen coordinates
    const tableRect = tableRef.current.getBoundingClientRect();
    const position = headerPositions[columnId];
    
    let dividerScreenX: number;
    if (position) {
      // Use the actual divider position (column left + current width)
      const dividerRelativeX = position.left + currentWidth;
      dividerScreenX = tableRect.left + dividerRelativeX;
    } else {
      // Fallback: calculate from column widths
      const columnIndex = columnIds.indexOf(columnId);
      let left = 0;
      for (let i = 0; i <= columnIndex; i++) {
        const prevColumnId = columnIds[i];
        const width = columnWidths[prevColumnId] || defaultColumnWidths[prevColumnId] || 200;
        left += width;
      }
      dividerScreenX = tableRect.left + left;
    }
    
    // Calculate the offset between click position and actual divider position
    const clickOffset = clickX - dividerScreenX;
    resizeClickOffsetRef.current = clickOffset;
    
    setResizingColumn(columnId);
    setResizeStartX(dividerScreenX); // Use actual divider position as baseline
    setResizeStartWidth(currentWidth);
  }, [columnWidths, headerPositions, columnIds]);

  const handleResizeMove = useCallback((currentX: number) => {
    if (!resizingColumn) return;
    // Account for where the user initially clicked relative to the divider
    const diff = (currentX - resizeStartX) - resizeClickOffsetRef.current;
    const newWidth = Math.max(50, resizeStartWidth + diff); // Minimum width of 50px
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn]: newWidth,
    }));
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null);
    resizeClickOffsetRef.current = 0;
  }, []);

  // Mouse event handlers for resizing
  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleResizeMove(e.clientX);
    };

    const handleMouseUp = () => {
      handleResizeEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizingColumn, handleResizeMove, handleResizeEnd]);

  // Calculate handle position dynamically based on current column widths
  const getHandlePosition = useCallback((columnId: string, index: number): number => {
    const position = headerPositions[columnId];
    
    // If we have a measured position, use it as the base
    if (position) {
      // During resize, use the initial left position + current width
      if (resizingColumn === columnId) {
        const currentWidth = columnWidths[columnId] || position.width;
        return position.left + currentWidth;
      }
      // Otherwise use the measured position
      return position.left + position.width;
    }
    
    // Fallback: calculate from column widths (for initial render before measurement)
    let left = 0;
    for (let i = 0; i <= index; i++) {
      const prevColumnId = columnIds[i];
      const width = columnWidths[prevColumnId] || defaultColumnWidths[prevColumnId] || 200;
      left += width;
    }
    return left;
  }, [columnIds, columnWidths, headerPositions, resizingColumn]);
  
  useEffect(() => {
    if (!tableRef.current) return;
    
    // Skip position updates during active resizing to prevent infinite loops
    if (resizingColumn) return;
    
    const updatePositions = () => {
      // Skip if actively resizing
      if (resizingColumn) return;
      
      const headerCells = tableRef.current?.querySelectorAll('.MuiTableCell-head');
      if (!headerCells || headerCells.length === 0) return;
      
      // Get header row height from first cell
      const firstCell = headerCells[0] as HTMLElement;
      const cellHeight = firstCell.getBoundingClientRect().height;
      setHeaderHeight(cellHeight);
      
      const positions: Record<string, { left: number; width: number }> = {};
      headerCells.forEach((cell, index) => {
        const rect = cell.getBoundingClientRect();
        const tableRect = tableRef.current?.getBoundingClientRect();
        if (tableRect && columnIds[index]) {
          positions[columnIds[index]] = {
            left: rect.left - tableRect.left,
            width: rect.width,
          };
        }
      });
      setHeaderPositions(positions);
    };
    
    // Use a small delay to ensure table is rendered
    const timeoutId = setTimeout(updatePositions, 0);
    window.addEventListener('resize', updatePositions);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePositions);
    };
  }, [columnIds, filteredAndSortedTransfers.length, resizingColumn]); // Added resizingColumn to skip updates during resize

  // Track filter controls height so sticky table header knows how far down to offset
  useEffect(() => {
    const el = filterControlsRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setFilterControlsHeight(el.offsetHeight));
    observer.observe(el);
    setFilterControlsHeight(el.offsetHeight);
    return () => observer.disconnect();
  }, []);

  // Find the customize columns button when popover opens
  useEffect(() => {
    if (customizeColumnsOpen) {
      // Find the button by looking for the text "Customize Columns"
      const findButton = () => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const customizeButton = buttons.find(
          (btn) => btn.textContent?.includes('Customize Columns')
        );
        if (customizeButton) {
          setCustomizeColumnsAnchor(customizeButton);
        }
      };
      // Small delay to ensure button is rendered
      const timeoutId = setTimeout(findButton, 10);
      return () => clearTimeout(timeoutId);
    } else {
      setCustomizeColumnsAnchor(null);
    }
  }, [customizeColumnsOpen]);

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

  // Table columns configuration with dynamic widths
  const columns: TableColumn<Transfer>[] = useMemo(() => [
    {
      id: 'id',
      label: (
        <TableSortLabel
          active={sortField === 'id'}
          direction={sortField === 'id' ? sortDirection : 'asc'}
          onClick={() => handleSort('id')}
        >
          Transfer ID
        </TableSortLabel>
      ),
      minWidth: 200,
      width: columnWidths.id || undefined,
      render: (row: Transfer) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.id}
        </Typography>
      ),
    },
    {
      id: 'sender',
      label: (
        <TableSortLabel
          active={sortField === 'sender'}
          direction={sortField === 'sender' ? sortDirection : 'asc'}
          onClick={() => handleSort('sender')}
        >
          Sender
        </TableSortLabel>
      ),
      minWidth: 200,
      width: columnWidths.sender || undefined,
      render: (row: Transfer) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.sender}
        </Typography>
      ),
    },
    {
      id: 'receiver',
      label: (
        <TableSortLabel
          active={sortField === 'receiver'}
          direction={sortField === 'receiver' ? sortDirection : 'asc'}
          onClick={() => handleSort('receiver')}
        >
          Receiver
        </TableSortLabel>
      ),
      minWidth: 200,
      width: columnWidths.receiver || undefined,
      render: (row: Transfer) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.receiver}
        </Typography>
      ),
    },
    {
      id: 'direction',
      label: (
        <TableSortLabel
          active={sortField === 'direction'}
          direction={sortField === 'direction' ? sortDirection : 'asc'}
          onClick={() => handleSort('direction')}
        >
          Direction
        </TableSortLabel>
      ),
      minWidth: 120,
      width: columnWidths.direction || undefined,
      render: (row: Transfer) => {
        const directionConfig: Record<Transfer['direction'], { icon: typeof ArrowUpwardIcon; variant: 'warning' | 'primary' | 'neutral' }> = {
          Outbound: { icon: ArrowUpwardIcon, variant: 'warning' as const },
          Inbound: { icon: ArrowDownwardIcon, variant: 'primary' as const },
          Unknown: { icon: HelpOutlineIcon, variant: 'neutral' as const },
        };
        const config = directionConfig[row.direction];
        const IconComponent = config.icon;
        return (
          <Tag
            label={row.direction}
            variant={config.variant}
            icon={<IconComponent />}
            size="small"
          />
        );
      },
    },
    {
      id: 'senderFileName',
      label: (
        <TableSortLabel
          active={sortField === 'senderFileName'}
          direction={sortField === 'senderFileName' ? sortDirection : 'asc'}
          onClick={() => handleSort('senderFileName')}
        >
          Sender File Name
        </TableSortLabel>
      ),
      minWidth: 250,
      width: columnWidths.senderFileName || undefined,
      render: (row: Transfer) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.senderFileName}
        </Typography>
      ),
    },
    {
      id: 'senderFileSize',
      label: (
        <TableSortLabel
          active={sortField === 'senderFileSize'}
          direction={sortField === 'senderFileSize' ? sortDirection : 'asc'}
          onClick={() => handleSort('senderFileSize')}
        >
          Sender File Size
        </TableSortLabel>
      ),
      minWidth: 130,
      width: columnWidths.senderFileSize || undefined,
      render: (row: Transfer) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.senderFileSize}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: (
        <TableSortLabel
          active={sortField === 'status'}
          direction={sortField === 'status' ? sortDirection : 'asc'}
          onClick={() => handleSort('status')}
        >
          Status
        </TableSortLabel>
      ),
      minWidth: 100,
      width: columnWidths.status || undefined,
      render: (row: Transfer) => {
        return (
          <Tag
            label={row.status}
            variant={row.status === 'Success' ? 'success' : 'error'}
            size="small"
          />
        );
      },
    },
    {
      id: 'startTime',
      label: (
        <TableSortLabel
          active={sortField === 'startTime'}
          direction={sortField === 'startTime' ? sortDirection : 'asc'}
          onClick={() => handleSort('startTime')}
        >
          Start (MST)
        </TableSortLabel>
      ),
      minWidth: 180,
      width: columnWidths.startTime || undefined,
      render: (row: Transfer) => {
        if (row.startTime === '-') {
          return <Typography variant="body2">-</Typography>;
        }
        const [time, date] = row.startTime.split(', ');
        return (
          <Box>
            <Typography variant="body2">{time}</Typography>
            <Typography variant="body2" color="text.secondary">
              {date}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'endTime',
      label: (
        <TableSortLabel
          active={sortField === 'endTime'}
          direction={sortField === 'endTime' ? sortDirection : 'asc'}
          onClick={() => handleSort('endTime')}
        >
          End (MST)
        </TableSortLabel>
      ),
      minWidth: 180,
      width: columnWidths.endTime || undefined,
      render: (row: Transfer) => {
        if (row.endTime === '-') {
          return <Typography variant="body2">-</Typography>;
        }
        const [time, date] = row.endTime.split(', ');
        return (
          <Box>
            <Typography variant="body2">{time}</Typography>
            <Typography variant="body2" color="text.secondary">
              {date}
            </Typography>
          </Box>
        );
      },
    },
  ].filter((column) => visibleColumns.includes(column.id as string)), [
    sortField,
    sortDirection,
    columnWidths,
    visibleColumns,
  ]);

  return (
    <PageLayout selectedNavItem="transfers" backgroundColor="#FAFCFC" contentPadding={0}>
      {/* Page header — scrolls away */}
      <Stack spacing={2} sx={{ mb: '16px', px: 3, pt: 3 }}>
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
              onClick: () => {
                setCustomizeColumnsOpen(true);
              },
            }
          }}
        />
      </Box>

      {/* Table — overflow:visible on wrapper + TableContainer lets <th> sticky resolve
           to the page-level scroll container. Corner radius applied per-cell instead
           of via overflow:hidden (which would clip the sticky header). */}
      <Box
        ref={tableRef}
        sx={{
          mx: 3,
          mb: 3,
          borderRadius: '8px',
          overflow: 'visible',
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          // Override MUI's overflow-x:auto on TableContainer.
          // CSS spec converts any axis that is 'visible' to 'auto' when the other axis is non-visible,
          // which would silently create a scroll container that intercepts sticky lookup.
          // Setting BOTH axes to visible !important prevents that conversion and lets the
          // th sticky cells resolve to the page scroll container instead.
          '& .MuiTableContainer-root': {
            overflowX: 'visible !important' as 'visible',
            overflowY: 'visible !important' as 'visible',
          },
          // thead must be static so only the individual th cells carry sticky positioning.
          // !important beats the design system's stickyHeader sx on TableContainer.
          '& .MuiTableHead-root': {
            position: 'static !important' as 'static',
          },
          // th cells are made sticky by MUI's stickyHeader prop; offset them below the sticky FilterControls.
          '& .MuiTableCell-stickyHeader': {
            top: `${filterControlsHeight}px`,
            backgroundColor: 'background.paper',
            zIndex: 5,
          },
          // Apply border-radius to corner cells (since overflow:visible can't clip them)
          '& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root:first-of-type': {
            borderTopLeftRadius: '7px',
          },
          '& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root:last-of-type': {
            borderTopRightRadius: '7px',
          },
          '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root:first-of-type': {
            borderBottomLeftRadius: '7px',
          },
          '& .MuiTableBody-root .MuiTableRow-root:last-of-type .MuiTableCell-root:last-of-type': {
            borderBottomRightRadius: '7px',
          },
          // Remove vertical grid lines for all cells
          '& .MuiTableCell-root': {
            borderLeft: 'none !important',
            borderRight: 'none !important',
          },
          // Header cell styles
          '& .MuiTableCell-head': {
            fontWeight: 700,
            color: 'text.secondary',
            padding: '6px 12px !important',
            borderTop: 'none !important',
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            backgroundColor: 'background.paper',
            borderLeft: 'none !important',
            borderRight: 'none !important',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            '& > *': {
              fontWeight: 700,
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            },
            // Ensure TableSortLabel and its children truncate properly
            '& .MuiTableSortLabel-root': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              '& .MuiTableSortLabel-icon': {
                flexShrink: 0,
                marginLeft: '4px',
              },
            },
          },
          // Use fixed table layout for accurate column widths
          '& .MuiTable-root': {
            tableLayout: 'fixed',
            width: '100%',
          },
          // Body cell styles - horizontal divider lines only
          '& .MuiTableCell-body': {
            padding: '6px 12px !important',
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            borderTop: 'none !important',
          },
          // Remove bottom border from last row
          '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-body': {
            borderBottom: 'none !important',
          },
        }}
      >
        <Table
          columns={columns}
          rows={filteredAndSortedTransfers}
          getRowId={(row) => row.id}
          stickyHeader
          bordered={false}
          sx={{
            border: 'none',
            '& .MuiTableCell-root': {
              borderLeft: 'none !important',
              borderRight: 'none !important',
            },
          }}
          {...({
            onRowClick: (row: any) => {
              navigate(`/transfers/${row.id as string}`);
            },
          } as any)}
        />
        {/* Resize handles overlay — sticky at same offset as sticky table header */}
        <Box
          sx={{
            position: 'sticky',
            top: `${filterControlsHeight}px`,
            left: 0,
            right: 0,
            height: `${headerHeight}px`,
            marginBottom: `-${headerHeight}px`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {columnIds.map((columnId, index) => {
            // Skip divider after the last column
            if (index === columnIds.length - 1) return null;
            
            const handleLeft = getHandlePosition(columnId, index);
            const isResizing = resizingColumn === columnId;
            
            return (
              <Box
                key={`resize-handle-${columnId}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleResizeStart(columnId, e.clientX);
                }}
                sx={{
                  position: 'absolute',
                  left: `${handleLeft - 1}px`, // Center the 2px handle on the column edge
                  top: '8px', // Small margin from top
                  bottom: '8px', // Small margin from bottom
                  width: isResizing ? '4px' : '2px', // Wider when resizing for better visibility
                  cursor: 'col-resize',
                  pointerEvents: 'auto',
                  backgroundColor: isResizing ? 'primary.dark' : 'divider', // Highlight when resizing
                  transition: isResizing ? 'none' : 'background-color 0.15s ease, width 0.15s ease', // No transition during resize
                  '&:hover': {
                    backgroundColor: 'primary.main', // Highlight on hover
                    width: '4px', // Wider on hover for easier clicking
                    // Keep left position the same to avoid shifting clickable area
                  },
                  '&:active': {
                    backgroundColor: 'primary.dark', // Darker when dragging
                    width: '4px',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>
      {/* Customize Columns Popover */}
      <CustomizeColumnsModal
        open={customizeColumnsOpen}
        anchorEl={customizeColumnsAnchor}
        onClose={() => {
          setCustomizeColumnsOpen(false);
          setCustomizeColumnsAnchor(null);
        }}
        columns={columnIds.map((id): ColumnConfig => ({
          id,
          label: COLUMN_LABELS[id] || id,
          visible: visibleColumns.includes(id),
        }))}
        allAvailableColumns={ALL_COLUMN_IDS.map((id): ColumnConfig => ({
          id,
          label: COLUMN_LABELS[id] || id,
          visible: true,
        }))}
        onApply={(visibleIds) => {
          setVisibleColumns(visibleIds);
        }}
        onReset={() => {
          setVisibleColumns(ALL_COLUMN_IDS);
          // Reset widths back to defaults
          setColumnWidths({});
        }}
      />
    </PageLayout>
  );
}

export default Transfers;
