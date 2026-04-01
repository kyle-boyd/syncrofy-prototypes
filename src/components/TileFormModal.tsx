import { useState, useEffect, useRef, forwardRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import PieChartIcon from '@mui/icons-material/PieChart';
import TagIcon from '@mui/icons-material/Tag';
import RefreshIcon from '@mui/icons-material/Refresh';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Chips } from '@design-system';
import { TileType, Tile, TileContent, ChartVariant, CHART_COLORS, PRIMARY, SPLIT_SERIES_KEYS, SERIES_NAMES } from './TileCharts';

const CHART_COLOR_NAMES: Record<string, string> = {
  '#5a85a1': 'Steel Blue',
  '#00A6C8': 'Cyan',
  '#00BFA0': 'Teal',
  '#4CB81B': 'Green',
  '#8DBE1B': 'Lime',
  '#C9B800': 'Yellow',
  '#CC7A18': 'Orange',
  '#D43012': 'Red',
  '#C0238A': 'Magenta',
  '#1B81C5': 'Blue',
  '#00A49E': 'Seafoam',
  '#00C660': 'Emerald',
  '#7B5EA7': 'Purple',
  '#E05C8A': 'Pink',
  '#6B8E23': 'Olive',
  '#B8860B': 'Gold',
  '#E0E0E0': 'Gray',
};

const HIGHLIGHT_OPTIONS = [
  { value: 'all',          label: 'All',    group: 'all' },
  { value: 'top3-avg',     label: 'Top 3',  group: 'avg' },
  { value: 'top5-avg',     label: 'Top 5',  group: 'avg' },
  { value: 'bottom3-avg',  label: 'Bot 3',  group: 'avg' },
  { value: 'bottom5-avg',  label: 'Bot 5',  group: 'avg' },
  { value: 'top3-max',     label: 'Top 3',  group: 'max' },
  { value: 'top5-max',     label: 'Top 5',  group: 'max' },
  { value: 'bottom3-min',  label: 'Bot 3',  group: 'max' },
  { value: 'bottom5-min',  label: 'Bot 5',  group: 'max' },
] as const;

const SORT_MODE_OPTIONS = [
  { value: 'top-avg',    label: 'Highest average value' },
  { value: 'top-max',    label: 'Highest single value' },
  { value: 'top-total',  label: 'Highest total' },
  { value: 'bottom-avg', label: 'Lowest average value' },
  { value: 'bottom-min', label: 'Lowest single value' },
];

// ─── Tile type options ────────────────────────────────────────────────────────

const TILE_TYPE_OPTIONS = [
  { value: 'verticalBar'   as TileType, label: 'Vert. Bar',  icon: <BarChartIcon /> },
  { value: 'horizontalBar' as TileType, label: 'Hor. Bar',   icon: <AlignHorizontalLeftIcon /> },
  { value: 'line'          as TileType, label: 'Line',        icon: <ShowChartIcon /> },
  { value: 'percent'       as TileType, label: 'Percent',     icon: <DonutSmallIcon /> },
  { value: 'pie'           as TileType, label: 'Pie',         icon: <PieChartIcon /> },
  { value: 'multiBar'      as TileType, label: 'Summary',     icon: <TagIcon /> },
];

const DATASETS = [
  'File Transfers Last Week',
  'All Documents – This Month',
  'Exceptions Overview',
  'Purchase Orders Q1',
  'Supplier Compliance',
];

// ─── Filter data ──────────────────────────────────────────────────────────────

type DataType = 'String' | 'Size' | 'EventSummaryStatus' | 'Direction' | 'Date' | 'BusinessPartner' | 'Boolean';

interface FilterOption {
  label: string;
  dataType: DataType;
  group: string;
}

const GROUP_ORDER = [
  'File Data',
  'Sender Info',
  'Receiver Info',
  'Delivery Details',
  'Event Source',
  'Processing Info',
  'Timestamp',
];

const ALL_FILTERS: FilterOption[] = [
  { label: 'Exceptions',               dataType: 'Boolean',            group: 'File Data' },
  { label: 'Transfer ID',              dataType: 'String',             group: 'File Data' },
  { label: 'Status',                   dataType: 'EventSummaryStatus', group: 'File Data' },
  { label: 'Direction',                dataType: 'Direction',          group: 'File Data' },
  { label: 'Has Exceptions',           dataType: 'Boolean',            group: 'File Data' },
  { label: 'Sender Error Message',     dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender File Name',         dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender Mailbox Path',      dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender Message ID',        dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender Name',              dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender Operation',         dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender Path File Name',    dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender Protocol',          dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender Remote Host',       dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender Remote IP',         dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender User ID',           dataType: 'String',             group: 'Sender Info' },
  { label: 'Sender File Size',         dataType: 'Size',               group: 'Sender Info' },
  { label: 'Sender Status',            dataType: 'EventSummaryStatus', group: 'Sender Info' },
  { label: 'Start (EST)',              dataType: 'Date',               group: 'Sender Info' },
  { label: 'Sender',                   dataType: 'BusinessPartner',    group: 'Sender Info' },
  { label: 'Receiver Error Message',   dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver File Name',       dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver Mailbox Path',    dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver Name',            dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver Operation',       dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver Path File Name',  dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver Protocol',        dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver Remote Host',     dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver Remote IP',       dataType: 'String',             group: 'Receiver Info' },
  { label: 'Receiver File Size',       dataType: 'Size',               group: 'Receiver Info' },
  { label: 'Receiver Status',          dataType: 'EventSummaryStatus', group: 'Receiver Info' },
  { label: 'End (EST)',                dataType: 'Date',               group: 'Receiver Info' },
  { label: 'Receiver',                 dataType: 'BusinessPartner',    group: 'Receiver Info' },
  { label: 'Delivery Error Message',   dataType: 'String',             group: 'Delivery Details' },
  { label: 'Delivery Status',          dataType: 'EventSummaryStatus', group: 'Delivery Details' },
  { label: 'Delivery Timestamp',       dataType: 'Date',               group: 'Delivery Details' },
  { label: 'Event Source Name',        dataType: 'String',             group: 'Event Source' },
  { label: 'Event Source Type',        dataType: 'String',             group: 'Event Source' },
  { label: 'Event Source URL',         dataType: 'String',             group: 'Event Source' },
  { label: 'Processing Error Message', dataType: 'String',             group: 'Processing Info' },
  { label: 'Processing Status',        dataType: 'EventSummaryStatus', group: 'Processing Info' },
  { label: 'Processing Timestamp',     dataType: 'Date',               group: 'Processing Info' },
  { label: 'Last Run Time',            dataType: 'Date',               group: 'Timestamp' },
  { label: 'Last Event Time',          dataType: 'Date',               group: 'Timestamp' },
  { label: 'Loaded On Timestamp',      dataType: 'Date',               group: 'Timestamp' },
  { label: 'Last Updated on Date',     dataType: 'Date',               group: 'Timestamp' },
];

const TOP_8_FILTER_LABELS = [
  'Status', 'Direction', 'Sender', 'Receiver',
  'Start (EST)', 'End (EST)', 'Has Exceptions', 'Transfer ID',
];
const TOP_8_FILTERS = ALL_FILTERS.filter(f => TOP_8_FILTER_LABELS.includes(f.label));

// ─── Condition options ────────────────────────────────────────────────────────

const CONDITIONS: Record<DataType, string[]> = {
  String:             ['Equal to', 'Not equal to', 'Starts with', 'Does not start with', 'Contains', 'Does not contain', 'Exists', 'Does not exist', 'Including', 'Not including'],
  Size:               ['Greater than', 'Less than', 'Within range'],
  EventSummaryStatus: ['Equals', 'Not Equals', 'Including', 'Not Including'],
  BusinessPartner:    ['Equals', 'Not Equals', 'Including', 'Not Including', 'Starts with (Name)', 'Contains (Name)', 'Starts with (Code/ID)', 'Contains (Code/ID)', 'Exists', 'Does not exist'],
  Date:               ['Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'Custom Range', 'Custom Range + Specific Time'],
  Direction:          ['Equals', 'Not Equals', 'Including', 'Not Including'],
  Boolean:            ['Equals'],
};

const NO_VALUE_CONDITIONS = new Set([
  'Exists', 'Does not exist',
  'Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month',
]);

const VALUE_OPTIONS: Partial<Record<DataType, string[]>> = {
  EventSummaryStatus: ['Success', 'Error', 'Warning', 'Processing', 'Pending'],
  Direction:          ['Inbound', 'Outbound'],
  Boolean:            ['True', 'False'],
};

// ─── Config data ─────────────────────────────────────────────────────────────

const DATE_FILTERS = ALL_FILTERS.filter(f => f.dataType === 'Date').map(f => f.label);
const INTERVALS    = ['Day', 'Week', 'Month', 'Quarter', 'Year'];
const Y_OPERATIONS = ['Count', 'Average', 'Sum'];
const Y_FIELDS     = ['Total', 'File Size', 'Transfer Count', 'Error Count'];
const SPLIT_FIELDS = [
  'Status', 'Direction', 'Sender', 'Receiver',
  'Sender Status', 'Receiver Status', 'Delivery Status', 'Processing Status',
  'Sender Protocol', 'Receiver Protocol', 'Event Source Type',
];

// ─── Config row ───────────────────────────────────────────────────────────────

const ConfigRow = forwardRef<HTMLDivElement, { label: string; value: string; onClick?: () => void; colorPreview?: string[] }>(
  ({ label, value, onClick, colorPreview }, ref) => (
    <Box ref={ref} onClick={onClick} sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: 1.5, py: 1.25, border: '1px solid', borderColor: 'divider',
      borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' },
    }}>
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>{label}</Typography>
        <Typography variant="body2" fontWeight={500}>{value}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
        {colorPreview?.map((c, i) => (
          <Box key={i} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c, flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }} />
        ))}
        <NavigateNextIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
      </Box>
    </Box>
  )
);

// ─── Applied filter type & chip formatter ─────────────────────────────────────

interface AppliedFilter {
  filter: string;
  condition: string;
  value: string;
}

function formatFilterChip(f: AppliedFilter): string {
  const { filter, condition, value } = f;
  switch (condition) {
    case 'Equal to':
    case 'Equals':
      return `${filter} = ${value}`;
    case 'Not equal to':
    case 'Not Equals':
      return `${filter} ≠ ${value}`;
    case 'Starts with':
    case 'Starts with (Name)':
    case 'Starts with (Code/ID)':
      return `${filter} starts: ${value}`;
    case 'Does not start with':
      return `${filter} doesn't start: ${value}`;
    case 'Contains':
    case 'Contains (Name)':
    case 'Contains (Code/ID)':
      return `${filter} contains: ${value}`;
    case 'Does not contain':
      return `${filter} doesn't contain: ${value}`;
    case 'Exists':
      return `${filter} exists`;
    case 'Does not exist':
      return `${filter} missing`;
    case 'Including':
      return `${filter} includes: ${value}`;
    case 'Not Including':
      return `${filter} doesn't include: ${value}`;
    case 'Greater than':
      return `${filter} > ${value}`;
    case 'Less than':
      return `${filter} < ${value}`;
    case 'Within range':
      return `${filter} ${value}`;
    case 'Today':
    case 'Yesterday':
    case 'This Week':
    case 'Last Week':
    case 'This Month':
    case 'Last Month':
      return `${filter}: ${condition}`;
    case 'Custom Range':
    case 'Custom Range + Specific Time':
      return `${filter}: ${value}`;
    default:
      return value ? `${filter} = ${value}` : filter;
  }
}

// ─── Filter row (sidebar) ─────────────────────────────────────────────────────

function FilterRow({ filter, onDelete }: { filter: AppliedFilter; onDelete: () => void }) {
  const chipLabel = formatFilterChip(filter);
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: 1.5, py: 1, border: '1px solid', borderColor: 'divider',
      borderRadius: 1, bgcolor: 'background.paper',
    }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.3}>
          {filter.filter}
        </Typography>
        <Chips
          label={chipLabel}
          size="small"
          sx={{ mt: 0.25, height: 20, fontSize: 11, bgcolor: 'grey.100', borderRadius: 1, maxWidth: '100%' }}
        />
      </Box>
      <IconButton size="small" onClick={onDelete} sx={{ ml: 0.5, flexShrink: 0 }}>
        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TileFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updates: { name: string; type: TileType; xAxisField: string; xAxisInterval: string; yAxisOperation: string; yAxisField: string; splitField: string; splitSortMode: string; splitLimit: string; splitAutoParam: string; splitCount: number; splitSortBy: string | undefined; chartVariant: ChartVariant; primaryColor: string; seriesColors: string[] }) => void;
  tile?: Tile;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const POPUP_WIDTH     = 300;
const FLYOUT_WIDTH    = 340;
const POPUP_EST_HEIGHT = 220; // height of the small Apply Filter popup only

export default function TileFormModal({ open, onClose, onSave, tile }: TileFormModalProps) {
  const isEdit = !!tile;

  const [tileName, setTileName]             = useState('');
  const [dataset, setDataset]               = useState('File Transfers Last Week');
  const [tileType, setTileType]             = useState<TileType | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  const [showFilterPopup, setShowFilterPopup]     = useState(false);
  const [showFlyout, setShowFlyout]               = useState(false);
  const [filterSearch, setFilterSearch]           = useState('');
  const [showAll, setShowAll]                     = useState(false);
  const [selectedFilter, setSelectedFilter]       = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedValue, setSelectedValue]         = useState('');
  const [popupAnchor, setPopupAnchor]             = useState<{ top: number; left: number } | null>(null);

  // X-Axis / Y-Axis / Split Data config
  const [xAxisField, setXAxisField]         = useState('Start (EST)');
  const [xAxisInterval, setXAxisInterval]   = useState('Month');
  const [yAxisOperation, setYAxisOperation] = useState('');
  const [yAxisField, setYAxisField]         = useState('');
  const [splitField, setSplitField]         = useState('');
  const [splitSortMode, setSplitSortMode]   = useState('top-avg');
  const [splitLimit, setSplitLimit]         = useState('5');
  const [splitAutoParam, setSplitAutoParam] = useState('all');
  const [chartVariant, setChartVariant]     = useState<ChartVariant>('click-highlight');

  // Appearance (colors)
  const [primaryColor, setPrimaryColor]     = useState(PRIMARY);
  const [seriesColors, setSeriesColors]     = useState<string[]>([]);

  // Temp (in-popup) state
  const [configPopup, setConfigPopup]       = useState<'xaxis' | 'yaxis' | 'splitdata' | 'appearance' | null>(null);
  const [tempXField, setTempXField]         = useState('');
  const [tempXInterval, setTempXInterval]   = useState('');
  const [tempYOperation, setTempYOperation] = useState('');
  const [tempYField, setTempYField]         = useState('');
  const [tempSplitField, setTempSplitField] = useState('');
  const [tempSplitSortMode, setTempSplitSortMode] = useState('top-avg');
  const [tempSplitLimit, setTempSplitLimit] = useState('5');
  const [tempSplitAutoParam, setTempSplitAutoParam] = useState('all');
  const [tempPrimaryColor, setTempPrimaryColor] = useState(PRIMARY);
  const [tempSeriesColors, setTempSeriesColors] = useState<string[]>([]);
  const [configAnchor, setConfigAnchor]     = useState<{ top: number; left: number } | null>(null);

  const addFilterRef      = useRef<HTMLDivElement>(null);
  const xAxisRowRef       = useRef<HTMLDivElement>(null);
  const yAxisRowRef       = useRef<HTMLDivElement>(null);
  const splitDataRowRef   = useRef<HTMLDivElement>(null);
  const appearanceRowRef  = useRef<HTMLDivElement>(null);
  const dialogPaperRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTileName(tile?.name ?? '');
      setTileType(tile?.type ?? null);
      setDataset('File Transfers Last Week');
      setAppliedFilters([]);
      setXAxisField(tile?.xAxisField ?? 'Start (EST)');
      setXAxisInterval(tile?.xAxisInterval ?? 'Month');
      setYAxisOperation(tile?.yAxisOperation ?? '');
      setYAxisField(tile?.yAxisField ?? '');
      setSplitField(tile?.splitField ?? '');
      setSplitSortMode(tile?.splitSortMode ?? 'top-avg');
      setSplitLimit(tile?.splitLimit ?? '5');
      setSplitAutoParam(tile?.splitAutoParam ?? 'all');
      setChartVariant(tile?.chartVariant ?? 'click-highlight');
      setPrimaryColor(tile?.primaryColor ?? PRIMARY);
      setSeriesColors(tile?.seriesColors ?? []);
      setConfigPopup(null);
      closeEverything();
    }
  }, [open, tile]);

  const closeEverything = () => {
    setShowFilterPopup(false);
    setShowFlyout(false);
    setFilterSearch('');
    setShowAll(false);
    setSelectedFilter('');
    setSelectedCondition('');
    setSelectedValue('');
  };

  const openConfigPopup = (type: 'xaxis' | 'yaxis' | 'splitdata' | 'appearance') => {
    const refMap = { xaxis: xAxisRowRef, yaxis: yAxisRowRef, splitdata: splitDataRowRef, appearance: appearanceRowRef };
    const ref = refMap[type];
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const popupHeight = type === 'splitdata' ? 580 : type === 'appearance' ? 480 : 300;
      const modalBottom = dialogPaperRef.current
        ? dialogPaperRef.current.getBoundingClientRect().bottom - 16
        : window.innerHeight - 16;
      const top = Math.max(16, Math.min(rect.top, modalBottom - popupHeight));
      setConfigAnchor({ top, left: rect.right + 8 });
    }
    if (type === 'xaxis') {
      setTempXField(xAxisField);
      setTempXInterval(xAxisInterval);
    } else if (type === 'yaxis') {
      setTempYOperation(yAxisOperation);
      setTempYField(yAxisField);
    } else if (type === 'splitdata') {
      setTempSplitField(splitField);
      setTempSplitSortMode(splitSortMode || 'top-avg');
      setTempSplitLimit(splitLimit || '5');
      setTempSplitAutoParam(splitAutoParam || 'all');
    } else {
      setTempPrimaryColor(primaryColor);
      setTempSeriesColors([...seriesColors]);
    }
    setConfigPopup(type);
  };

  const handleConfigDone = () => {
    if (configPopup === 'xaxis') {
      setXAxisField(tempXField);
      setXAxisInterval(tempXInterval);
    } else if (configPopup === 'yaxis') {
      setYAxisOperation(tempYOperation);
      setYAxisField(tempYField);
    } else if (configPopup === 'splitdata') {
      setSplitField(tempSplitField);
      setSplitSortMode(tempSplitSortMode);
      setSplitLimit(tempSplitLimit);
      setSplitAutoParam(tempSplitAutoParam);
    } else if (configPopup === 'appearance') {
      setPrimaryColor(tempPrimaryColor);
      setSeriesColors([...tempSeriesColors]);
    }
    setConfigPopup(null);
  };

  const handleRemoveSplit = () => {
    setSplitField('');
    setSplitSortMode('top-avg');
    setSplitLimit('5');
    setSplitAutoParam('all');
    setConfigPopup(null);
  };

  const handleOpenFilter = () => {
    if (addFilterRef.current) {
      const rect = addFilterRef.current.getBoundingClientRect();
      const top  = Math.min(rect.top, window.innerHeight - POPUP_EST_HEIGHT - 16);
      setPopupAnchor({ top: Math.max(16, top), left: rect.right + 8 });
    }
    setShowFilterPopup(true);
    setShowFlyout(true);
  };

  const handleApplyFilter = () => {
    if (selectedFilter) {
      setAppliedFilters(prev => [...prev, { filter: selectedFilter, condition: selectedCondition, value: selectedValue }]);
    }
    closeEverything();
  };

  const handleSelectFilter = (label: string) => {
    setSelectedFilter(label);
    setSelectedCondition('');
    setSelectedValue('');
    setShowFlyout(false);
    setFilterSearch('');
  };

  // What to show in the flyout list
  const searchActive = filterSearch.trim().length > 0;
  const listFilters  = searchActive
    ? ALL_FILTERS.filter(f => f.label.toLowerCase().includes(filterSearch.toLowerCase()))
    : showAll ? ALL_FILTERS : TOP_8_FILTERS;

  const useGroups = searchActive || showAll;
  const groupedFilters = GROUP_ORDER.map(g => ({
    group: g,
    filters: listFilters.filter(f => f.group === g),
  })).filter(g => g.filters.length > 0);

  const selectedFilterDef = ALL_FILTERS.find(f => f.label === selectedFilter);
  const conditionOptions  = selectedFilterDef ? CONDITIONS[selectedFilterDef.dataType] : [];
  const valueOptions      = selectedFilterDef ? VALUE_OPTIONS[selectedFilterDef.dataType] : undefined;
  const needsValue        = !!selectedCondition && !NO_VALUE_CONDITIONS.has(selectedCondition);
  const canApply          = !!selectedFilter && !!selectedCondition &&
                            (!needsValue || !!selectedValue);
  const canSave           = tileName.trim() !== '' && tileType !== null;

  const xAxisLabel  = `${xAxisField} by ${xAxisInterval}`;
  const yAxisLabel  = yAxisOperation || 'Choose Axis';
  const splitLabel  = splitField || 'Choose Category';

  const splitCount = splitField ? Math.min(10, Math.max(1, splitLimit ? parseInt(splitLimit, 10) : 5)) : 1;
  const splitSortBy = splitField ? splitSortMode : undefined;

  const chartColors = splitField
    ? Array.from({ length: splitCount }, (_, i) => seriesColors[i] ?? CHART_COLORS[i])
    : [primaryColor];
  const appearanceLabel = splitField ? `${splitCount} series` : (CHART_COLOR_NAMES[primaryColor] ?? primaryColor);
  const appearanceColorPreview = splitField
    ? Array.from({ length: Math.min(splitCount, 5) }, (_, i) => seriesColors[i] ?? CHART_COLORS[i])
    : [primaryColor];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ ref: dialogPaperRef, sx: { height: '88vh', maxHeight: 820, display: 'flex', flexDirection: 'column', borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        <Typography variant="h6" fontWeight={700} component="span" display="block">{isEdit ? 'Edit Tile' : 'Create New Tile'}</Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your tile settings. Preview updates in real-time.
        </Typography>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 0, display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left panel ──────────────────────────────────────── */}
        <Box sx={{
          width: 340, flexShrink: 0, borderRight: '1px solid', borderColor: 'divider',
          overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Tile Name</Typography>
            <TextField placeholder="Name" size="small" fullWidth value={tileName} onChange={e => setTileName(e.target.value)} />
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Data</Typography>
            <FormControl fullWidth size="small">
              <Select value={dataset} onChange={e => setDataset(e.target.value)}>
                {DATASETS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>Tile Type</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {TILE_TYPE_OPTIONS.map(opt => (
                <Box key={opt.value} onClick={() => setTileType(opt.value)} sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                  py: 1.5, border: '1px solid',
                  borderColor: tileType === opt.value ? 'primary.main' : 'divider',
                  borderRadius: 1.5, cursor: 'pointer',
                  bgcolor: tileType === opt.value ? 'rgba(43, 122, 140, 0.06)' : 'transparent',
                  transition: 'all 0.15s', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                }}>
                  <Box sx={{ color: tileType === opt.value ? 'primary.main' : 'text.secondary' }}>{opt.icon}</Box>
                  <Typography variant="caption" fontWeight={tileType === opt.value ? 600 : 400}>{opt.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>Filters</Typography>
              <Tooltip title="Reset filters">
                <IconButton size="small" onClick={() => setAppliedFilters([])}><RefreshIcon sx={{ fontSize: 16 }} /></IconButton>
              </Tooltip>
            </Box>
            {appliedFilters.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 1 }}>
                {appliedFilters.map((f, i) => (
                  <FilterRow key={i} filter={f}
                    onDelete={() => setAppliedFilters(prev => prev.filter((_, j) => j !== i))} />
                ))}
              </Box>
            )}
            <Box ref={addFilterRef} onClick={handleOpenFilter} sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 1.5, py: 1.25, border: '1px solid', borderColor: 'divider',
              borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' },
            }}>
              <Typography variant="body2" fontWeight={500}>Add Filter</Typography>
              <NavigateNextIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>Configuration</Typography>
              <Tooltip title="Reset configuration">
                <IconButton size="small"><RefreshIcon sx={{ fontSize: 16 }} /></IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <ConfigRow ref={xAxisRowRef} label="X-Axis" value={xAxisLabel} onClick={() => openConfigPopup('xaxis')} />
              <ConfigRow ref={yAxisRowRef} label="Y-Axis" value={yAxisLabel} onClick={() => openConfigPopup('yaxis')} />
              <ConfigRow ref={splitDataRowRef} label="Split Data" value={splitLabel} onClick={() => openConfigPopup('splitdata')} />
              <ConfigRow label="Drilldown" value="None" />
              <ConfigRow ref={appearanceRowRef} label="Appearance" value={appearanceLabel} colorPreview={appearanceColorPreview} onClick={() => openConfigPopup('appearance')} />
            </Box>

          </Box>
        </Box>

        {/* ── Right panel ─────────────────────────────────────── */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', px: 3, py: 3, gap: 2 }}>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, px: 2, py: 1.5, flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Global Filters</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chips label="Date = This Week" size="small" variant="rounded" />
              <Chips label="Date = This Week" size="small" variant="rounded" />
            </Box>
          </Box>

          <Box sx={{ height: 360, flexShrink: 0, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: appliedFilters.length > 0 ? 0.5 : 1, flexShrink: 0 }}>{tileName || 'Tile Name'}</Typography>
            {appliedFilters.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1, flexShrink: 0 }}>
                {appliedFilters.map((f, i) => (
                  <Chips key={i} label={formatFilterChip(f)} size="small" variant="rounded" />
                ))}
              </Box>
            )}
            {tileType ? (
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'visible' }}><TileContent type={tileType} height={280} xAxisInterval={xAxisInterval} splitCount={splitCount} splitSortBy={splitSortBy} chartVariant={chartVariant} splitHighlight={splitAutoParam} colors={chartColors} /></Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1.5 }}>
                  <BarChartOutlinedIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
                </Box>
                <Typography variant="h6" fontWeight={600}>Select Data &amp; Type</Typography>
                <Typography variant="body2" color="text.secondary">No data to display, select data to create a chart.</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexShrink: 0 }}>
            <Button variant="text" color="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="contained" disabled={!canSave} onClick={() => { if (canSave) onSave({ name: tileName.trim(), type: tileType!, xAxisField, xAxisInterval, yAxisOperation, yAxisField, splitField, splitSortMode, splitLimit, splitAutoParam, splitCount, splitSortBy, chartVariant, primaryColor, seriesColors }); }}>Save</Button>
          </Box>
        </Box>
      </DialogContent>

      {/* ── Config popup overlay ────────────────────────────────────────── */}
      {configPopup && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1400 }} onClick={() => setConfigPopup(null)}>
          <Paper
            elevation={8}
            onClick={e => e.stopPropagation()}
            sx={{
              position: 'fixed',
              top: configAnchor?.top ?? 300,
              left: configAnchor?.left ?? 360,
              width: configPopup === 'splitdata' || configPopup === 'appearance' ? 280 : 240,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {configPopup === 'xaxis' ? 'X-Axis' : configPopup === 'yaxis' ? 'Y-Axis' : configPopup === 'splitdata' ? 'Split Data into Multiple Lines' : 'Appearance'}
            </Typography>

            {configPopup === 'xaxis' && (
              <>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Field</Typography>
                  <FormControl fullWidth size="small">
                    <Select value={tempXField} onChange={e => setTempXField(e.target.value)}>
                      {DATE_FILTERS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Interval</Typography>
                  <FormControl fullWidth size="small">
                    <Select value={tempXInterval} onChange={e => setTempXInterval(e.target.value)}>
                      {INTERVALS.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}

            {configPopup === 'yaxis' && (
              <>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Operation</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={tempYOperation}
                      onChange={e => { setTempYOperation(e.target.value); setTempYField(''); }}
                      displayEmpty
                      renderValue={v => v || 'Select'}
                    >
                      {Y_OPERATIONS.map(op => <MenuItem key={op} value={op}>{op}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color={tempYOperation === 'Sum' || tempYOperation === 'Average' ? 'text.secondary' : 'text.disabled'}
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    Field
                  </Typography>
                  <FormControl fullWidth size="small" disabled={tempYOperation !== 'Sum' && tempYOperation !== 'Average'}>
                    <Select
                      value={tempYField}
                      onChange={e => setTempYField(e.target.value)}
                      displayEmpty
                      renderValue={v => v || 'Total'}
                    >
                      {Y_FIELDS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                  {tempYOperation !== 'Sum' && tempYOperation !== 'Average' && (
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                      Choose a "sum" or "average" operation to enable this field.
                    </Typography>
                  )}
                </Box>
              </>
            )}

            {configPopup === 'splitdata' && (
              <>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Field</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={tempSplitField}
                      onChange={e => setTempSplitField(e.target.value)}
                      displayEmpty
                      renderValue={v => v || 'Select Field'}
                    >
                      {SPLIT_FIELDS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">Max series shown</Typography>
                    <Tooltip
                      title="Up to 10 series shown at a time. Add filters to control which series are included."
                      placement="top"
                      arrow
                    >
                      <InfoOutlinedIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'default' }} />
                    </Tooltip>
                  </Box>
                  <TextField
                    size="small"
                    fullWidth
                    type="number"
                    value={tempSplitLimit}
                    onChange={e => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v)) setTempSplitLimit(String(Math.min(10, Math.max(1, v))));
                      else setTempSplitLimit(e.target.value);
                    }}
                    inputProps={{ min: 1, max: 10 }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Select series by</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={tempSplitSortMode}
                      onChange={e => setTempSplitSortMode(e.target.value)}
                    >
                      {SORT_MODE_OPTIONS.map(o => (
                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Highlight */}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Highlight
                  </Typography>

                  {/* All */}
                  {(['all'] as const).map(v => {
                    const active = tempSplitAutoParam === v;
                    return (
                      <Box key={v} onClick={() => setTempSplitAutoParam(v)} sx={{
                        py: 0.5, textAlign: 'center', borderRadius: 1, cursor: 'pointer', mb: 0.75,
                        border: '1px solid', fontSize: 12, fontFamily: 'Geist, sans-serif',
                        borderColor: active ? 'primary.main' : 'divider',
                        bgcolor: active ? 'rgba(43,122,140,0.06)' : 'transparent',
                        color: active ? 'primary.main' : 'text.secondary',
                        fontWeight: active ? 600 : 400,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}>All</Box>
                    );
                  })}

                  {/* By Average */}
                  <Typography sx={{ fontSize: 9, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.4, mb: 0.4 }}>By Average</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.5, mb: 0.75 }}>
                    {(['top3-avg', 'top5-avg', 'bottom3-avg', 'bottom5-avg'] as const).map(v => {
                      const active = tempSplitAutoParam === v;
                      const label  = HIGHLIGHT_OPTIONS.find(h => h.value === v)!.label;
                      return (
                        <Box key={v} onClick={() => setTempSplitAutoParam(v)} sx={{
                          py: 0.5, textAlign: 'center', borderRadius: 1, cursor: 'pointer',
                          border: '1px solid', fontSize: 11, fontFamily: 'Geist, sans-serif',
                          borderColor: active ? 'primary.main' : 'divider',
                          bgcolor: active ? 'rgba(43,122,140,0.06)' : 'transparent',
                          color: active ? 'primary.main' : 'text.secondary',
                          fontWeight: active ? 600 : 400,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}>{label}</Box>
                      );
                    })}
                  </Box>

                  {/* By Max / Min */}
                  <Typography sx={{ fontSize: 9, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.4, mb: 0.4 }}>By Max / Min</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.5 }}>
                    {(['top3-max', 'top5-max', 'bottom3-min', 'bottom5-min'] as const).map(v => {
                      const active = tempSplitAutoParam === v;
                      const label  = HIGHLIGHT_OPTIONS.find(h => h.value === v)!.label;
                      return (
                        <Box key={v} onClick={() => setTempSplitAutoParam(v)} sx={{
                          py: 0.5, textAlign: 'center', borderRadius: 1, cursor: 'pointer',
                          border: '1px solid', fontSize: 11, fontFamily: 'Geist, sans-serif',
                          borderColor: active ? 'primary.main' : 'divider',
                          bgcolor: active ? 'rgba(43,122,140,0.06)' : 'transparent',
                          color: active ? 'primary.main' : 'text.secondary',
                          fontWeight: active ? 600 : 400,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}>{label}</Box>
                      );
                    })}
                  </Box>
                </Box>

                <Box
                  onClick={handleRemoveSplit}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75,
                    py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1,
                    cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">Remove Split</Typography>
                </Box>
              </>
            )}

            {configPopup === 'appearance' && (
              <>
                {!splitField ? (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>Color</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.4 }}>
                      {CHART_COLORS.map((color, i) => {
                        const active = tempPrimaryColor === color;
                        return (
                          <Box
                            key={i}
                            onClick={() => setTempPrimaryColor(color)}
                            sx={{
                              display: 'flex', alignItems: 'center', gap: 0.75,
                              px: 0.75, py: 0.5, borderRadius: 1, cursor: 'pointer',
                              border: '1px solid',
                              borderColor: active ? 'primary.main' : 'transparent',
                              bgcolor: active ? 'rgba(43,122,140,0.06)' : 'transparent',
                              transition: 'all 0.1s',
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                          >
                            <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: color, flexShrink: 0, border: '1px solid rgba(0,0,0,0.08)' }} />
                            <Typography sx={{ fontSize: 11, fontFamily: 'Geist, sans-serif', color: active ? 'primary.main' : 'text.secondary', fontWeight: active ? 600 : 400, lineHeight: 1 }}>
                              {CHART_COLOR_NAMES[color] ?? color}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.25, pr: 0.25 }}>
                    {Array.from({ length: splitCount }, (_, i) => {
                      const key = SPLIT_SERIES_KEYS[i];
                      const currentColor = tempSeriesColors[i] ?? CHART_COLORS[i];
                      return (
                        <Box key={key}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {SERIES_NAMES[key]}
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={currentColor}
                              onChange={e => setTempSeriesColors(prev => {
                                const next = [...prev];
                                next[i] = e.target.value;
                                return next;
                              })}
                              renderValue={(v) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: v, flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }} />
                                  <Typography sx={{ fontSize: 13, fontFamily: 'Geist, sans-serif' }}>{CHART_COLOR_NAMES[v] ?? v}</Typography>
                                </Box>
                              )}
                            >
                              {CHART_COLORS.map((color, ci) => (
                                <MenuItem key={ci} value={color} sx={{ gap: 1 }}>
                                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: color, flexShrink: 0, border: '1px solid rgba(0,0,0,0.1)' }} />
                                  {CHART_COLOR_NAMES[color] ?? color}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </>
            )}

            <Divider sx={{ mx: -2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="text" color="secondary" onClick={() => setConfigPopup(null)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleConfigDone}
                disabled={
                  configPopup === 'xaxis' ? !tempXField :
                  configPopup === 'yaxis' ? !tempYOperation :
                  configPopup === 'appearance' ? false :
                  !tempSplitField
                }
              >
                Done
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* ── Filter overlay ──────────────────────────────────────────────── */}
      {showFilterPopup && (
        <Box sx={{ position: 'fixed', inset: 0, zIndex: 1400 }} onClick={closeEverything}>

          {/* Apply Filter popup */}
          <Paper
            elevation={8}
            onClick={e => e.stopPropagation()}
            sx={{
              position: 'fixed',
              top: popupAnchor?.top ?? 200,
              left: popupAnchor?.left ?? 400,
              width: POPUP_WIDTH,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>Apply Filter</Typography>

            {/* Filter select — clicking opens the flyout */}
            <FormControl fullWidth size="small">
              <Select
                value={selectedFilter}
                open={false}
                onOpen={() => setShowFlyout(v => !v)}
                displayEmpty
                renderValue={v => v || 'Select a filter'}
              >
                <MenuItem value="" />
              </Select>
            </FormControl>

            {/* Condition */}
            <FormControl fullWidth size="small" disabled={!selectedFilter}>
              <Select
                value={selectedCondition}
                onChange={e => { setSelectedCondition(e.target.value); setSelectedValue(''); }}
                displayEmpty
                renderValue={v => v || 'Condition'}
              >
                {conditionOptions.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Value */}
            {needsValue && (
              valueOptions ? (
                <FormControl fullWidth size="small">
                  <Select value={selectedValue} onChange={e => setSelectedValue(e.target.value)} displayEmpty renderValue={v => v || 'Select value'}>
                    {valueOptions.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  placeholder="Value"
                  size="small"
                  fullWidth
                  value={selectedValue}
                  onChange={e => setSelectedValue(e.target.value)}
                  type={selectedFilterDef?.dataType === 'Size' ? 'number' : 'text'}
                />
              )
            )}

            <Divider sx={{ mx: -2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <IconButton size="small" onClick={closeEverything}>
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="text" color="secondary" onClick={closeEverything}>Cancel</Button>
                <Button variant="contained" onClick={handleApplyFilter} disabled={!canApply}>Done</Button>
              </Box>
            </Box>
          </Paper>

          {/* Filter flyout */}
          {showFlyout && (
            <Paper
              elevation={8}
              onClick={e => e.stopPropagation()}
              sx={{
                position: 'fixed',
                top: Math.max(16, Math.min(popupAnchor?.top ?? 200, window.innerHeight - (showAll ? 800 : 640) - 16)),
                left: (popupAnchor?.left ?? 400) + POPUP_WIDTH + 8,
                width: FLYOUT_WIDTH,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: showAll ? 800 : 640,
              }}
            >
              {/* Search */}
              <Box sx={{ px: 2, pt: 1.5, pb: 1, flexShrink: 0 }}>
                <TextField
                  placeholder="Filters"
                  size="small"
                  fullWidth
                  autoFocus
                  value={filterSearch}
                  onChange={e => setFilterSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Divider />

              {/* List */}
              <List dense disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
                {useGroups ? (
                  groupedFilters.length > 0 ? groupedFilters.map(({ group, filters }) => (
                    <Box key={group}>
                      <Box sx={{ px: 2, py: 0.5, bgcolor: 'grey.50', position: 'sticky', top: 0, zIndex: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{group}</Typography>
                      </Box>
                      {filters.map(f => (
                        <ListItemButton key={f.label} selected={selectedFilter === f.label} onClick={() => handleSelectFilter(f.label)} sx={{ px: 2, py: 1 }}>
                          <ListItemText primary={f.label} primaryTypographyProps={{ variant: 'body2' }} />
                        </ListItemButton>
                      ))}
                    </Box>
                  )) : (
                    <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">No filters match your search</Typography>
                    </Box>
                  )
                ) : (
                  listFilters.map(f => (
                    <ListItemButton key={f.label} selected={selectedFilter === f.label} onClick={() => handleSelectFilter(f.label)} sx={{ px: 2, py: 1 }}>
                      <ListItemText primary={f.label} primaryTypographyProps={{ variant: 'body2' }} />
                    </ListItemButton>
                  ))
                )}
              </List>

              {/* Show all / Show less button */}
              {!searchActive && (
                <>
                  <Divider />
                  <Box
                    onClick={() => setShowAll(v => !v)}
                    sx={{
                      mx: 1.5, my: 1.5, py: 1.25,
                      border: '1px solid', borderColor: 'divider', borderRadius: 1.5,
                      textAlign: 'center', cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {showAll ? 'Show less' : 'Show all filters'}
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          )}
        </Box>
      )}
    </Dialog>
  );
}
