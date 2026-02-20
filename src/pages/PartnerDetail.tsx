import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Checkbox,
  TableSortLabel,
} from '@mui/material';
import MuiLink from '@mui/material/Link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';
import {
  FilterControls,
  FilterOption,
  Table,
  TableColumn,
  Tabs,
  Chips,
  Tag,
} from '@kyleboyd/design-system';
import { PageLayout } from '../components/PageLayout';

export interface Endpoint {
  id: string;
  endpointName: string;
  protocol: 'API' | 'HTTP' | 'MBX' | 'SFTP';
  hosts: string;
  port: number;
  directory: string;
}

const protocolTagVariant: Record<Endpoint['protocol'], 'success' | 'info' | 'primary' | 'neutral'> = {
  API: 'success',
  HTTP: 'info',
  MBX: 'primary',
  SFTP: 'success',
};

const mockEndpoints: Endpoint[] = [
  { id: '1', endpointName: 'API_sfapi.company.com_report_user1', protocol: 'API', hosts: 'sfapi.company.com', port: 0, directory: '/report/Inbox' },
  { id: '2', endpointName: 'HTTP_echo.free.beeceptor.com_test', protocol: 'HTTP', hosts: 'echo.free.beeceptor.com', port: 0, directory: '/SYN_Consume' },
  { id: '3', endpointName: 'MBX_/Consumer_2507231306_5/Inbox', protocol: 'MBX', hosts: '-', port: 0, directory: '/Consumer_25' },
  { id: '4', endpointName: 'SFTP_cs-Producer_2507231214_1.coenterprise.com_Producer_2507231214_1', protocol: 'SFTP', hosts: 'CS-Producer_2507231214_1.coenterprise.com', port: 0, directory: '/Producer_250' },
  { id: '5', endpointName: 'SFTP_cs-Producer_2507231214_2.coenterprise.com_Producer_2507231214_2', protocol: 'SFTP', hosts: 'CS-Producer_2507231214_2.coenterprise.com', port: 0, directory: '/Producer_250' },
  { id: '6', endpointName: 'SFTP_cs-Producer_2507231214_3.coenterprise.com_Producer_2507231214_3', protocol: 'SFTP', hosts: 'CS-Producer_2507231214_3.coenterprise.com', port: 0, directory: '/Producer_250' },
];

function PartnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | number>('endpoints');
  const [domains, setDomains] = useState<string[]>(['@abcd.com']);
  const [endpointSearch, setEndpointSearch] = useState('');
  const [protocolFilter, setProtocolFilter] = useState<string | number>('all');
  const [selectedEndpointIds, setSelectedEndpointIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>('endpointName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const partnerName = id ? decodeURIComponent(id) : '';

  const filteredEndpoints = useMemo(() => {
    let list = [...mockEndpoints];
    if (endpointSearch.trim()) {
      const q = endpointSearch.toLowerCase();
      list = list.filter(
        (e) =>
          e.endpointName.toLowerCase().includes(q) ||
          e.protocol.toLowerCase().includes(q) ||
          e.hosts.toLowerCase().includes(q) ||
          e.directory.toLowerCase().includes(q)
      );
    }
    if (protocolFilter !== 'all') {
      list = list.filter((e) => e.protocol.toLowerCase() === String(protocolFilter).toLowerCase());
    }
    list.sort((a, b) => {
      const aVal = String((a as any)[sortField] ?? '').toLowerCase();
      const bVal = String((b as any)[sortField] ?? '').toLowerCase();
      if (sortField === 'port') {
        return sortDirection === 'asc' ? a.port - b.port : b.port - a.port;
      }
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [endpointSearch, protocolFilter, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleHeaderCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSelectedEndpointIds(new Set(filteredEndpoints.map((e) => e.id)));
    } else {
      setSelectedEndpointIds(new Set());
    }
  };

  const handleRowCheckboxChange = (endpointId: string, checked: boolean) => {
    setSelectedEndpointIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(endpointId);
      else next.delete(endpointId);
      return next;
    });
  };

  const removeDomain = (domain: string) => {
    setDomains((prev) => prev.filter((d) => d !== domain));
  };

  const filterOptions: FilterOption[] = [
    {
      id: 'protocols',
      label: 'Protocols',
      value: protocolFilter,
      options: [
        { value: 'all', label: 'All' },
        { value: 'API', label: 'API' },
        { value: 'HTTP', label: 'HTTP' },
        { value: 'MBX', label: 'MBX' },
        { value: 'SFTP', label: 'SFTP' },
      ],
    },
    {
      id: 'more',
      label: 'More Filters',
      value: '',
      options: [
        { value: '', label: 'No additional filters' },
      ],
    },
  ];

  const endpointColumns: TableColumn<Endpoint>[] = [
    {
      id: 'select',
      label: '',
      sortable: false,
      minWidth: 48,
      headerCheckbox: true,
      headerCheckboxChecked: selectedEndpointIds.size === filteredEndpoints.length && filteredEndpoints.length > 0,
      headerCheckboxIndeterminate: selectedEndpointIds.size > 0 && selectedEndpointIds.size < filteredEndpoints.length,
      onHeaderCheckboxChange: handleHeaderCheckboxChange,
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedEndpointIds.has(row.id)}
          onChange={(_, checked) => handleRowCheckboxChange(row.id, checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      id: 'endpointName',
      label: (
        <TableSortLabel
          active={sortField === 'endpointName'}
          direction={sortField === 'endpointName' ? sortDirection : 'asc'}
          onClick={() => handleSort('endpointName')}
        >
          Endpoint Name
        </TableSortLabel>
      ),
      minWidth: 280,
      render: (row) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.endpointName}
        </Typography>
      ),
    },
    {
      id: 'protocol',
      label: 'Protocol',
      minWidth: 100,
      render: (row) => (
        <Tag label={row.protocol} variant={protocolTagVariant[row.protocol]} size="small" hideIcon />
      ),
    },
    {
      id: 'hosts',
      label: 'Hosts',
      minWidth: 220,
      render: (row) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.hosts}
        </Typography>
      ),
    },
    {
      id: 'port',
      label: (
        <TableSortLabel
          active={sortField === 'port'}
          direction={sortField === 'port' ? sortDirection : 'asc'}
          onClick={() => handleSort('port')}
        >
          Port
        </TableSortLabel>
      ),
      minWidth: 80,
      render: (row) => <Typography variant="body2">{row.port}</Typography>,
    },
    {
      id: 'directory',
      label: 'Directory',
      minWidth: 160,
      render: (row) => (
        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.directory}
        </Typography>
      ),
    },
  ];

  const tabsConfig = [
    { label: 'Endpoints', value: 'endpoints' },
    { label: 'Contacts', value: 'contacts' },
    { label: 'Users', value: 'users' },
  ];

  return (
    <PageLayout selectedNavItem="partners" backgroundColor="#FAFCFC">
      <Box sx={{ mb: 3 }}>
        <Box
          component="button"
          onClick={() => navigate('/partners')}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
            mb: 2,
            border: 'none',
            background: 'none',
            padding: 0,
            font: 'inherit',
            color: 'text.primary',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 20, mr: 0.5 }} />
          <Typography variant="subtitle2" component="span">External Partners</Typography>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          {partnerName}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Domains
          </Typography>
          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
            {domains.map((domain) => (
              <Chips
                key={domain}
                label={domain}
                size="small"
                variant="outlined"
                onDelete={() => removeDomain(domain)}
              />
            ))}
            <MuiLink
              component="button"
              variant="body2"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                color: 'primary.main',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => setDomains((prev) => [...prev, `@newdomain${prev.length + 1}.com`])}
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Add domain
            </MuiLink>
          </Stack>
        </Box>

        <Tabs
          tabs={tabsConfig}
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}
        />
      </Box>

      {activeTab === 'endpoints' && (
        <>
          <Box
            sx={{
              position: 'sticky',
              top: -24,
              zIndex: 20,
              backgroundColor: '#FAFCFC',
              pb: 2,
              mb: 2,
              mx: -3,
              px: 3,
            }}
          >
            <FilterControls
              search={{
                value: endpointSearch,
                onChange: setEndpointSearch,
                placeholder: 'Search',
              }}
              filters={filterOptions}
              onFilterChange={(filterId, value) => {
                if (filterId === 'protocols') setProtocolFilter(value);
              }}
              resultCount={`${filteredEndpoints.length} results`}
            />
          </Box>

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
              columns={endpointColumns}
              rows={filteredEndpoints}
              stickyHeader
              bordered={false}
              sx={{ border: 'none' }}
            />
          </Box>
        </>
      )}

      {activeTab === 'contacts' && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Contacts content — coming soon
          </Typography>
        </Box>
      )}

      {activeTab === 'users' && (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Users content — coming soon
          </Typography>
        </Box>
      )}
    </PageLayout>
  );
}

export default PartnerDetail;
