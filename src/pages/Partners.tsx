import { useState, useMemo, Fragment } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  TableSortLabel,
  Checkbox,
  Link,
  IconButton,
  ToggleButtonGroup,
  ToggleButton as MuiToggleButton,
  Select,
  MenuItem,
  Divider,
  FormControl,
  SelectChangeEvent,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  Alert,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { PartnerColorSwatch } from '../components/PartnerColorSwatch';
import {
  PageHeader,
  FilterControls,
  FilterOption,
  Table,
  TableColumn,
  SegmentedControl,
  Tag,
  Chips,
  Button,
  Modal,
} from '@design-system';
import { PageLayout } from '../components/PageLayout';

export interface Partner {
  id: string;
  partnerName: string;
  endpoints: number;
  contacts: number;
}

export interface UncategorizedEndpoint {
  id: string;
  endpoint: string;
  protocol: string;
  name?: string;
}

export interface InternalSystem {
  id: string;
  name: string;
  endpoints: number;
}

const mockUncategorizedEndpoints: UncategorizedEndpoint[] = [
  { id: 'u1', endpoint: 'CDI_MROCFTP01_NxRspacer1', protocol: 'CDI', name: 'MROCFTP01' },
  { id: 'u2', endpoint: 'CDI_ACBN0TCLOAD', protocol: 'CDI' },
  { id: 'u3', endpoint: 'FTP_MROCFTP01_NxRspacer1', protocol: 'FTP' },
  { id: 'u4', endpoint: 'FTP_MROCFTP02_Wholesale', protocol: 'FTP', name: 'MROCFTP02' },
  { id: 'u5', endpoint: 'FTP_ACBN0TCLOAD', protocol: 'FTP' },
  { id: 'u6', endpoint: 'MBX_', protocol: 'MBX' },
  { id: 'u7', endpoint: 'MBX_OKAccounts/hubhvhP', protocol: 'MBX' },
  { id: 'u8', endpoint: 'MBX_OKAccounts/hubAUrTA3A', protocol: 'MBX' },
  { id: 'u9', endpoint: 'MBX_Innatem/Completed', protocol: 'MBX' },
  { id: 'u10', endpoint: 'MBX_InnaTemTo_MarketingFTP', protocol: 'MBX' },
  { id: 'u11', endpoint: 'MBX_OceanServ/Completed', protocol: 'MBX' },
  { id: 'u12', endpoint: 'MBX_OceanServ/Collector', protocol: 'MBX', name: 'service-Recognized=prod' },
  { id: 'u13', endpoint: 'MBX_OCB0/Items', protocol: 'MBX' },
  { id: 'u14', endpoint: 'MBX_ChicagoClearing/Completed', protocol: 'MBX', name: 'MROCFTP02' },
  { id: 'u15', endpoint: 'MBX_Comm/Credits/Completed', protocol: 'MBX' },
  { id: 'u16', endpoint: 'MBX_Comm/Logic/Completed', protocol: 'MBX' },
  { id: 'u17', endpoint: 'MBX_CoreLogicBiz/Outgoing', protocol: 'MBX' },
  { id: 'u18', endpoint: 'MBX_CreditFin/Union', protocol: 'MBX' },
  { id: 'u19', endpoint: 'MBX_DeltaPayroll/Inbound', protocol: 'MBX' },
  { id: 'u20', endpoint: 'MBX_EastCoast/Settlements', protocol: 'MBX' },
  { id: 'u21', endpoint: 'MBX_FidelityTrade/Outbound', protocol: 'MBX' },
  { id: 'u22', endpoint: 'MBX_GlobalNet/Transfers', protocol: 'MBX' },
  { id: 'u23', endpoint: 'MBX_HarborBank/Clearing', protocol: 'MBX' },
  { id: 'u24', endpoint: 'MBX_IronBridge/Completed', protocol: 'MBX', name: 'service-Recognized=prod' },
  { id: 'u25', endpoint: 'MBX_JupiterFin/Inbound', protocol: 'MBX' },
  { id: 'u26', endpoint: 'MBX_KeystoneBank/Outgoing', protocol: 'MBX' },
  { id: 'u27', endpoint: 'MBX_LakeFront/Settlements', protocol: 'MBX' },
  { id: 'u28', endpoint: 'MBX_MidWest/Clearing', protocol: 'MBX' },
  { id: 'u29', endpoint: 'AS2_MROCFTP01_Partner1', protocol: 'AS2' },
  { id: 'u30', endpoint: 'AS2_ACBN0TC_Inbound', protocol: 'AS2' },
  { id: 'u31', endpoint: 'AS2_GoldmanSachs/Transfer', protocol: 'AS2', name: 'MROCFTP01' },
  { id: 'u32', endpoint: 'AS2_NorthernTrust/Outbound', protocol: 'AS2' },
  { id: 'u33', endpoint: 'SFTP_MROCFTP02_Payroll', protocol: 'SFTP' },
  { id: 'u34', endpoint: 'SFTP_ACBN0TC_Wholesale', protocol: 'SFTP' },
  { id: 'u35', endpoint: 'SFTP_AlphaFin/Completed', protocol: 'SFTP', name: 'service-Recognized=prod' },
  { id: 'u36', endpoint: 'SFTP_BetaLogistics/Inbound', protocol: 'SFTP' },
  { id: 'u37', endpoint: 'SFTP_GammaSystems/Outbound', protocol: 'SFTP' },
  { id: 'u38', endpoint: 'CDI_MROCFTP02_Partner2', protocol: 'CDI' },
  { id: 'u39', endpoint: 'CDI_EastCoast/Settlements', protocol: 'CDI' },
  { id: 'u40', endpoint: 'CDI_WestCoast/Transfers', protocol: 'CDI', name: 'MROCFTP02' },
  { id: 'u41', endpoint: 'FTP_DeltaManufacturing/Out', protocol: 'FTP' },
  { id: 'u42', endpoint: 'FTP_EpsilonConsult/Inbound', protocol: 'FTP' },
  { id: 'u43', endpoint: 'FTP_ZetaHoldings/Transfer', protocol: 'FTP' },
  { id: 'u44', endpoint: 'MBX_NorthEast/Clearing', protocol: 'MBX' },
  { id: 'u45', endpoint: 'MBX_OceanView/Completed', protocol: 'MBX' },
  { id: 'u46', endpoint: 'MBX_PacificRim/Outbound', protocol: 'MBX' },
  { id: 'u47', endpoint: 'MBX_QuantumFin/Inbound', protocol: 'MBX', name: 'service-Recognized=prod' },
  { id: 'u48', endpoint: 'MBX_RiverBend/Settlements', protocol: 'MBX' },
  { id: 'u49', endpoint: 'MBX_SilverBridge/Clearing', protocol: 'MBX' },
  { id: 'u50', endpoint: 'MBX_TridentBank/Transfer', protocol: 'MBX' },
  { id: 'u51', endpoint: 'MBX_UnionPac/Completed', protocol: 'MBX' },
  { id: 'u52', endpoint: 'MBX_VaultNet/Outbound', protocol: 'MBX' },
  { id: 'u53', endpoint: 'MBX_WestBridge/Inbound', protocol: 'MBX' },
  { id: 'u54', endpoint: 'MBX_XcelFin/Clearing', protocol: 'MBX' },
  { id: 'u55', endpoint: 'AS2_YieldPoint/Settlements', protocol: 'AS2' },
  { id: 'u56', endpoint: 'AS2_ZenithBank/Transfer', protocol: 'AS2' },
  { id: 'u57', endpoint: 'SFTP_ApexCapital/Inbound', protocol: 'SFTP' },
  { id: 'u58', endpoint: 'SFTP_BlueStar/Outbound', protocol: 'SFTP' },
  { id: 'u59', endpoint: 'CDI_ClearPath/Completed', protocol: 'CDI' },
  { id: 'u60', endpoint: 'CDI_DawnBreak/Transfer', protocol: 'CDI', name: 'MROCFTP01' },
];

export const mockPartners: Partner[] = [
  { id: '1', partnerName: '1234', endpoints: 0, contacts: 0 },
  { id: '2', partnerName: 'A & M Investment', endpoints: 0, contacts: 0 },
  { id: '3', partnerName: 'Acme Corporation', endpoints: 0, contacts: 0 },
  { id: '4', partnerName: 'Advisor Document Vault', endpoints: 0, contacts: 0 },
  { id: '5', partnerName: 'Anderson & Sons', endpoints: 0, contacts: 0 },
  { id: '6', partnerName: 'Branch Cash Operations System', endpoints: 0, contacts: 0 },
  { id: '7', partnerName: 'Commercial Banking New York', endpoints: 0, contacts: 0 },
  { id: '8', partnerName: 'Crestline Wealth & Capital Services', endpoints: 0, contacts: 0 },
  { id: '9', partnerName: 'Heritage Family Enterprises', endpoints: 0, contacts: 0 },
  { id: '10', partnerName: "Joe's Burgers", endpoints: 0, contacts: 0 },
  { id: '11', partnerName: 'John Deere', endpoints: 0, contacts: 0 },
  { id: '12', partnerName: 'Loan Management System', endpoints: 0, contacts: 0 },
  { id: '13', partnerName: 'MBS Allocation Hub', endpoints: 0, contacts: 0 },
  { id: '14', partnerName: 'Partner Payroll Engine', endpoints: 0, contacts: 0 },
  { id: '15', partnerName: 'Private Bank Billing Engine', endpoints: 0, contacts: 0 },
  { id: '16', partnerName: 'Securities Trade Engine', endpoints: 0, contacts: 0 },
  { id: '17', partnerName: 'Silverhair Builders', endpoints: 0, contacts: 0 },
  { id: '18', partnerName: 'Stonebridge Capital Management', endpoints: 0, contacts: 0 },
  { id: '19', partnerName: 'Sunrise Builders', endpoints: 0, contacts: 0 },
  { id: '20', partnerName: 'Sunrise Builders Payroll System', endpoints: 0, contacts: 0 },
  { id: '21', partnerName: 'Wealth Compliance Engine', endpoints: 0, contacts: 0 },
  { id: '22', partnerName: 'Alpha Financial Services', endpoints: 0, contacts: 0 },
  { id: '23', partnerName: 'Beta Logistics Co', endpoints: 0, contacts: 0 },
  { id: '24', partnerName: 'Gamma Data Systems', endpoints: 0, contacts: 0 },
  { id: '25', partnerName: 'Delta Manufacturing', endpoints: 0, contacts: 0 },
  { id: '26', partnerName: 'Epsilon Consulting', endpoints: 0, contacts: 0 },
  { id: '27', partnerName: 'Zeta Holdings', endpoints: 0, contacts: 0 },
  { id: '28', partnerName: 'Eta Partners LLC', endpoints: 0, contacts: 0 },
  { id: '29', partnerName: 'Theta Networks', endpoints: 0, contacts: 0 },
  { id: '30', partnerName: 'Iota Solutions', endpoints: 0, contacts: 0 },
];

const mockInternalSystems: InternalSystem[] = [
  { id: 'is1', name: 'Core Banking System', endpoints: 0 },
  { id: 'is2', name: 'Loan Processing Engine', endpoints: 0 },
  { id: 'is3', name: 'Trade Settlement Platform', endpoints: 0 },
  { id: 'is4', name: 'Risk Analytics Hub', endpoints: 0 },
  { id: 'is5', name: 'Compliance Monitoring System', endpoints: 0 },
  { id: 'is6', name: 'Payment Gateway', endpoints: 0 },
  { id: 'is7', name: 'Customer Data Platform', endpoints: 0 },
];

const SEGMENT_ITEMS = [
  { id: 'external-partners', text: 'External Partners' },
  { id: 'internal-systems', text: 'Internal Systems' },
  { id: 'uncategorized', text: 'Uncategorized' },
];

const PROTOCOL_TAG_VARIANT: Record<string, 'info' | 'error' | 'warning' | 'success' | 'neutral' | 'primary'> = {
  CDI: 'primary',
  FTP: 'info',
  MBX: 'success',
  AS2: 'warning',
  SFTP: 'neutral',
};

const PROTOCOL_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'CDI', label: 'CDI' },
  { value: 'FTP', label: 'FTP' },
  { value: 'MBX', label: 'MBX' },
  { value: 'AS2', label: 'AS2' },
  { value: 'SFTP', label: 'SFTP' },
];

function getEndpointDetails(ep: UncategorizedEndpoint) {
  const withoutProtocol = ep.endpoint.replace(/^[A-Za-z0-9]+_/, '');
  const hasSlash = withoutProtocol.includes('/');
  if (hasSlash) {
    return {
      directory: '/' + withoutProtocol.replace(/_/g, '/'),
      user: '-',
      host: ep.name || withoutProtocol.split('/')[0] || '-',
    };
  }
  const parts = withoutProtocol.split('_');
  return {
    directory: '-',
    host: parts[0] || '-',
    user: parts[1] || '-',
  };
}

function Partners() {
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState<string | number>('external-partners');
  const [searchValue, setSearchValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedUncatIds, setSelectedUncatIds] = useState<Set<string>>(new Set());
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [internalSystems, setInternalSystems] = useState<InternalSystem[]>(mockInternalSystems);
  const [uncategorizedEndpoints, setUncategorizedEndpoints] = useState<UncategorizedEndpoint[]>(mockUncategorizedEndpoints);
  const [sortField, setSortField] = useState<string>('partnerName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortFieldUncat, setSortFieldUncat] = useState<string>('endpoint');
  const [sortDirectionUncat, setSortDirectionUncat] = useState<'asc' | 'desc'>('asc');
  const [protocolFilter, setProtocolFilter] = useState<string | number>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Categorize modal state
  const [categorizeOpen, setCategorizeOpen] = useState(false);
  const [categorizeTarget, setCategorizeTarget] = useState<UncategorizedEndpoint | null>(null);
  const [integrationType, setIntegrationType] = useState<'external' | 'internal'>('external');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredPartners = useMemo(() => {
    let list = [...partners];
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (p) =>
          p.partnerName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortField === 'endpoints' || sortField === 'contacts') {
        const an = (a as any)[sortField] ?? 0;
        const bn = (b as any)[sortField] ?? 0;
        return sortDirection === 'asc' ? an - bn : bn - an;
      }
      const aVal = String((a as any)[sortField] ?? '').toLowerCase();
      const bVal = String((b as any)[sortField] ?? '').toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [partners, searchValue, sortField, sortDirection]);

  const filteredInternalSystems = useMemo(() => {
    let list = [...internalSystems];
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sortField === 'endpoints') {
        return sortDirection === 'asc' ? a.endpoints - b.endpoints : b.endpoints - a.endpoints;
      }
      const cmp = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [internalSystems, searchValue, sortField, sortDirection]);

  const filteredUncategorized = useMemo(() => {
    let list = [...uncategorizedEndpoints];
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (e) =>
          e.endpoint.toLowerCase().includes(q) ||
          e.protocol.toLowerCase().includes(q) ||
          (e.name ?? '').toLowerCase().includes(q)
      );
    }
    if (protocolFilter !== 'all') {
      list = list.filter((e) => e.protocol === protocolFilter);
    }
    list.sort((a, b) => {
      const aVal = String((a as any)[sortFieldUncat] ?? '').toLowerCase();
      const bVal = String((b as any)[sortFieldUncat] ?? '').toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortDirectionUncat === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [uncategorizedEndpoints, searchValue, protocolFilter, sortFieldUncat, sortDirectionUncat]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSortUncat = (field: string) => {
    if (sortFieldUncat === field) {
      setSortDirectionUncat((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortFieldUncat(field);
      setSortDirectionUncat('asc');
    }
  };

  const handleHeaderCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredPartners.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleRowCheckboxChange = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleHeaderCheckboxChangeUncat = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSelectedUncatIds(new Set(filteredUncategorized.map((e) => e.id)));
    } else {
      setSelectedUncatIds(new Set());
    }
  };

  const handleRowCheckboxChangeUncat = (id: string, checked: boolean) => {
    setSelectedUncatIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleOpenCategorize = (endpoint?: UncategorizedEndpoint) => {
    setCategorizeTarget(endpoint ?? null);
    setIntegrationType('external');
    setSelectedCategory('');
    setCategorizeOpen(true);
  };

  const handleCloseCategorize = () => {
    setCategorizeOpen(false);
  };

  const uncatFilterOptions: FilterOption[] = [
    {
      id: 'protocol',
      label: 'Protocols',
      value: protocolFilter,
      options: PROTOCOL_OPTIONS,
    },
  ];

  const uncatActiveFilters = useMemo(() => {
    const list: { id: string; label: string; value: string; filterId: string }[] = [];
    if (protocolFilter !== 'all') {
      list.push({
        id: 'protocol-chip',
        label: 'Protocol',
        value: String(protocolFilter),
        filterId: 'protocol',
      });
    }
    return list;
  }, [protocolFilter]);

  const hasSelection =
    activeSegment === 'uncategorized'
      ? selectedUncatIds.size > 0
      : selectedIds.size > 0;

  const resultCount =
    activeSegment === 'uncategorized'
      ? `${filteredUncategorized.length} results`
      : activeSegment === 'internal-systems'
      ? `${filteredInternalSystems.length} results`
      : `${filteredPartners.length} results`;

  const isUncategorized = activeSegment === 'uncategorized';

  const bulkCategorizeCount = selectedUncatIds.size;
  const bulkCategorizeLabel = `Categorize ${bulkCategorizeCount} Endpoint${bulkCategorizeCount !== 1 ? 's' : ''}`;

  const partnerColumns: TableColumn<Partner>[] = [
    {
      id: 'select',
      label: '',
      sortable: false,
      minWidth: 48,
      headerCheckbox: true,
      headerCheckboxChecked: selectedIds.size === filteredPartners.length && filteredPartners.length > 0,
      headerCheckboxIndeterminate: selectedIds.size > 0 && selectedIds.size < filteredPartners.length,
      onHeaderCheckboxChange: handleHeaderCheckboxChange,
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedIds.has(row.id)}
          onChange={(_, checked) => handleRowCheckboxChange(row.id, checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      id: 'color',
      label: '',
      sortable: false,
      minWidth: 40,
      render: (row) => <PartnerColorSwatch partnerName={row.partnerName} />,
    },
    {
      id: 'partnerName',
      label: (
        <TableSortLabel
          active={sortField === 'partnerName'}
          direction={sortField === 'partnerName' ? sortDirection : 'asc'}
          onClick={() => handleSort('partnerName')}
        >
          Partner Name
        </TableSortLabel>
      ),
      minWidth: 220,
      render: (row) => (
        <Link
          component={RouterLink}
          to={`/partners/${encodeURIComponent(row.partnerName)}`}
          sx={{ color: 'primary.main', fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          <Typography variant="body2" component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.partnerName}
          </Typography>
        </Link>
      ),
    },
    {
      id: 'endpoints',
      label: (
        <TableSortLabel
          active={sortField === 'endpoints'}
          direction={sortField === 'endpoints' ? sortDirection : 'asc'}
          onClick={() => handleSort('endpoints')}
        >
          Endpoints
        </TableSortLabel>
      ),
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2">{row.endpoints}</Typography>
      ),
    },
    {
      id: 'contacts',
      label: (
        <TableSortLabel
          active={sortField === 'contacts'}
          direction={sortField === 'contacts' ? sortDirection : 'asc'}
          onClick={() => handleSort('contacts')}
        >
          Contacts
        </TableSortLabel>
      ),
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2">{row.contacts}</Typography>
      ),
    },
  ];


  const internalSystemColumns: TableColumn<InternalSystem>[] = [
    {
      id: 'select',
      label: '',
      sortable: false,
      minWidth: 48,
      headerCheckbox: true,
      headerCheckboxChecked: selectedIds.size === filteredInternalSystems.length && filteredInternalSystems.length > 0,
      headerCheckboxIndeterminate: selectedIds.size > 0 && selectedIds.size < filteredInternalSystems.length,
      onHeaderCheckboxChange: handleHeaderCheckboxChange,
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedIds.has(row.id)}
          onChange={(_, checked) => handleRowCheckboxChange(row.id, checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      id: 'color',
      label: '',
      sortable: false,
      minWidth: 40,
      render: (row) => <PartnerColorSwatch partnerName={row.name} />,
    },
    {
      id: 'name',
      label: (
        <TableSortLabel
          active={sortField === 'name'}
          direction={sortField === 'name' ? sortDirection : 'asc'}
          onClick={() => handleSort('name')}
        >
          System Name
        </TableSortLabel>
      ),
      minWidth: 220,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.name}
        </Typography>
      ),
    },
    {
      id: 'endpoints',
      label: (
        <TableSortLabel
          active={sortField === 'endpoints'}
          direction={sortField === 'endpoints' ? sortDirection : 'asc'}
          onClick={() => handleSort('endpoints')}
        >
          Endpoints
        </TableSortLabel>
      ),
      minWidth: 120,
      render: (row) => (
        <Typography variant="body2">{row.endpoints}</Typography>
      ),
    },
  ];

  const tableSx = {
    border: 'none',
    '& .MuiTableBody-root .MuiTableRow-root:not(.expand-row)': { height: 48 },
    '& .MuiTableCell-root': { borderLeft: 'none !important', borderRight: 'none !important' },
    '& .MuiTableCell-head': {
      fontWeight: 700,
      color: 'text.secondary',
      padding: '6px 12px !important',
      borderBottom: '1px solid',
      borderBottomColor: 'divider',
    },
    '& .MuiTableCell-body:not(.expand-cell)': {
      padding: '6px 12px !important',
      borderBottom: '1px solid',
      borderBottomColor: 'divider',
    },
    '& .MuiTableCell-body.expand-cell': {
      padding: '0 !important',
      borderBottom: 'none !important',
    },
    '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-body:not(.expand-cell)': {
      borderBottom: 'none !important',
    },
  };

  const handleConfirmCategorize = () => {
    if (!selectedCategory) {
      handleCloseCategorize();
      return;
    }

    const idsToRemove = categorizeTarget
      ? new Set([categorizeTarget.id])
      : selectedUncatIds;
    const count = idsToRemove.size;

    setUncategorizedEndpoints((prev) => prev.filter((e) => !idsToRemove.has(e.id)));

    if (integrationType === 'external') {
      setPartners((prev) =>
        prev.map((p) =>
          p.id === selectedCategory ? { ...p, endpoints: p.endpoints + count } : p
        )
      );
    } else {
      setInternalSystems((prev) =>
        prev.map((s) =>
          s.id === selectedCategory ? { ...s, endpoints: s.endpoints + count } : s
        )
      );
    }

    if (!categorizeTarget) {
      setSelectedUncatIds(new Set());
    }

    handleCloseCategorize();
  };

  // Derive endpoint details for the modal
  const modalDetails = categorizeTarget ? getEndpointDetails(categorizeTarget) : null;
  const categoryOptions = integrationType === 'external' ? partners : internalSystems;

  return (
    <PageLayout selectedNavItem="partners" backgroundColor="#FAFCFC">
      <Stack spacing={2} sx={{ mb: 2 }}>
        <PageHeader
          title="Partners"
          showBreadcrumb={false}
          refreshStatus="Last refreshed: Just now"
        />

        <SegmentedControl
          items={SEGMENT_ITEMS}
          defaultSelectedId={activeSegment}
          onChange={(id) => setActiveSegment(id)}
        />

        {activeSegment === 'uncategorized' && uncategorizedEndpoints.length > 0 && (
          <Alert
            icon={<AutoAwesomeIcon fontSize="small" />}
            severity="info"
            sx={{ alignItems: 'center' }}
            action={
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate('/partners/categorize')}
              >
                Categorize uncategorized systems ({uncategorizedEndpoints.length})
              </Button>
            }
          >
            <Typography variant="body2">
              <strong>New:</strong> Review system-suggested categorizations in one place with permission-impact preview and bulk confirm.
            </Typography>
          </Alert>
        )}
      </Stack>

      <Box
        sx={{
          position: 'sticky',
          top: -24,
          zIndex: 20,
          backgroundColor: '#FAFCFC',
          pt: 0,
          pb: 0,
          mb: 2,
          mx: 0,
          px: 0,
        }}
      >
        <FilterControls
          search={{
            value: searchValue,
            onChange: setSearchValue,
            placeholder: 'Search',
          }}
          filters={isUncategorized ? uncatFilterOptions : []}
          onFilterChange={(filterId, value) => {
            if (filterId === 'protocol') setProtocolFilter(value);
          }}
          activeFilters={isUncategorized ? uncatActiveFilters : []}
          onFilterRemove={(filterId) => {
            if (filterId === 'protocol') setProtocolFilter('all');
          }}
          onClearAll={() => {
            setProtocolFilter('all');
          }}
          clearAllLabel="Reset filters"
          alwaysShowClearAll
          resultCount={resultCount}
          actions={{
            secondary: {
              label: 'Actions',
              options: isUncategorized && selectedUncatIds.size > 0
                ? [{ value: 'categorize', label: bulkCategorizeLabel }]
                : [],
              disabled: !hasSelection,
              onSelect: (value) => {
                if (value === 'categorize') handleOpenCategorize();
              },
            },
          }}
        />
      </Box>

      <Box sx={{ mx: 0, ...tableSx }}>
        {activeSegment === 'internal-systems' ? (
          <Table
            columns={internalSystemColumns}
            rows={filteredInternalSystems}
            stickyHeader
          />
        ) : isUncategorized ? (
          <MuiTable stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: 48, minWidth: 48, bgcolor: '#FAFCFC' }}>
                  <Checkbox
                    size="small"
                    checked={selectedUncatIds.size === filteredUncategorized.length && filteredUncategorized.length > 0}
                    indeterminate={selectedUncatIds.size > 0 && selectedUncatIds.size < filteredUncategorized.length}
                    onChange={handleHeaderCheckboxChangeUncat}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 280, bgcolor: '#FAFCFC' }}>
                  <TableSortLabel
                    active={sortFieldUncat === 'endpoint'}
                    direction={sortFieldUncat === 'endpoint' ? sortDirectionUncat : 'asc'}
                    onClick={() => handleSortUncat('endpoint')}
                  >
                    Endpoint
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ minWidth: 100, bgcolor: '#FAFCFC' }}>
                  <TableSortLabel
                    active={sortFieldUncat === 'protocol'}
                    direction={sortFieldUncat === 'protocol' ? sortDirectionUncat : 'asc'}
                    onClick={() => handleSortUncat('protocol')}
                  >
                    Protocol
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ minWidth: 200, bgcolor: '#FAFCFC' }}>
                  <TableSortLabel
                    active={sortFieldUncat === 'name'}
                    direction={sortFieldUncat === 'name' ? sortDirectionUncat : 'asc'}
                    onClick={() => handleSortUncat('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sx={{ minWidth: 160, bgcolor: '#FAFCFC' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUncategorized.map((row) => {
                const isExpanded = expandedIds.has(row.id);
                const details = getEndpointDetails(row);
                const direction = /inbound/i.test(row.endpoint)
                  ? 'Inbound'
                  : /outbound|outgoing/i.test(row.endpoint)
                  ? 'Outbound'
                  : '-';
                return (
                  <Fragment key={row.id}>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={selectedUncatIds.has(row.id)}
                          onChange={(_, checked) => handleRowCheckboxChangeUncat(row.id, checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '13px' }}>
                          {row.endpoint}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tag
                          label={row.protocol}
                          variant={PROTOCOL_TAG_VARIANT[row.protocol] ?? 'neutral'}
                          size="small"
                          hideIcon
                        />
                      </TableCell>
                      <TableCell>
                        {row.name ? <Chips label={row.name} size="small" variant="outlined" /> : null}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={(e) => { e.stopPropagation(); handleOpenCategorize(row); }}
                          >
                            Categorize
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => toggleExpanded(row.id)}
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isExpanded
                              ? <KeyboardArrowUpIcon fontSize="small" />
                              : <KeyboardArrowDownIcon fontSize="small" />}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow className="expand-row">
                      <TableCell colSpan={5} className="expand-cell">
                        <Collapse in={isExpanded} unmountOnExit>
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              px: 7,
                              py: 0.5,
                              bgcolor: 'grey.50',
                              borderBottom: '1px solid',
                              borderBottomColor: 'divider',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, py: 0.75 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 70 }}>
                                Port
                              </Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 600 }}>
                                0
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, py: 0.75 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 160 }}>
                                Authentication Method
                              </Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 600 }}>
                                None
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, py: 0.75 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 70 }}>
                                Directory
                              </Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 600 }}>
                                {details.directory}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, py: 0.75 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 160 }}>
                                Direction
                              </Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic', fontWeight: 600 }}>
                                {direction}
                              </Typography>
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
          </MuiTable>
        ) : (
          <Table
            columns={partnerColumns}
            rows={filteredPartners}
            stickyHeader
          />
        )}
      </Box>

      {/* Categorize Modal */}
      <Modal
        open={categorizeOpen}
        onClose={handleCloseCategorize}
        maxWidth="md"
        title={
          <>
            Categorize
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400 }}>
              Categorize this entity as a partner or system.
            </Typography>
          </>
        }
        actions={
          <>
            <Button variant="text" color="secondary" onClick={handleCloseCategorize}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleConfirmCategorize} disabled={!selectedCategory}>
              Done
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', gap: 0, minHeight: 260 }}>
          {/* Left panel — endpoint details (single endpoint only) */}
          {categorizeTarget && modalDetails && (
            <>
              <Box sx={{ width: 200, flexShrink: 0, pr: 3 }}>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Directory
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '13px', wordBreak: 'break-all' }}>
                      {modalDetails.directory}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      User
                    </Typography>
                    <Typography variant="body2">{modalDetails.user}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Host
                    </Typography>
                    <Typography variant="body2">{modalDetails.host}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Protocol
                    </Typography>
                    <Typography variant="body2">{categorizeTarget.protocol}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Port
                    </Typography>
                    <Typography variant="body2">0</Typography>
                  </Box>
                </Stack>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mr: 3 }} />
            </>
          )}

          {/* Bulk info banner when no specific endpoint */}
          {!categorizeTarget && (
            <>
              <Box sx={{ width: 200, flexShrink: 0, pr: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {bulkCategorizeCount} endpoint{bulkCategorizeCount !== 1 ? 's' : ''} selected
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mr: 3 }} />
            </>
          )}

          {/* Right panel — categorization form */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Integration Relationship
                </Typography>
                <ToggleButtonGroup
                  value={integrationType}
                  exclusive
                  onChange={(_e, val) => { if (val) { setIntegrationType(val); setSelectedCategory(''); } }}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      fontSize: '14px',
                      px: 2,
                      py: 0.75,
                      borderColor: 'divider',
                      color: 'text.secondary',
                      '&.Mui-selected': {
                        color: 'text.primary',
                        backgroundColor: 'action.selected',
                        fontWeight: 500,
                      },
                    },
                  }}
                >
                  <MuiToggleButton value="external">External Partner</MuiToggleButton>
                  <MuiToggleButton value="internal">Internal System</MuiToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Categorize
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    displayEmpty
                    value={selectedCategory}
                    onChange={(e: SelectChangeEvent) => setSelectedCategory(e.target.value)}
                    renderValue={(val) => {
                      if (!val) {
                        return (
                          <Typography variant="body2" color="text.disabled">
                            {integrationType === 'external'
                              ? 'Select an external partner'
                              : 'Select an internal system'}
                          </Typography>
                        );
                      }
                      const match = categoryOptions.find(
                        (o) => o.id === val
                      );
                      return (
                        <Typography variant="body2">
                          {integrationType === 'external'
                            ? (match as Partner)?.partnerName
                            : (match as typeof mockInternalSystems[0])?.name}
                        </Typography>
                      );
                    }}
                    sx={{ borderRadius: '8px' }}
                  >
                    {integrationType === 'external'
                      ? partners.map((p) => (
                          <MenuItem key={p.id} value={p.id}>
                            <Typography variant="body2">{p.partnerName}</Typography>
                          </MenuItem>
                        ))
                      : internalSystems.map((s) => (
                          <MenuItem key={s.id} value={s.id}>
                            <Typography variant="body2">{s.name}</Typography>
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>

                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  sx={{ mt: 1, px: 0, textTransform: 'none', fontSize: '14px' }}
                  onClick={() => {}}
                >
                  Create New
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </PageLayout>
  );
}

export default Partners;
