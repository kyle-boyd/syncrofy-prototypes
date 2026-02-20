import { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  TableSortLabel,
  Checkbox,
  Link,
  IconButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  PageHeader,
  FilterControls,
  FilterOption,
  Table,
  TableColumn,
  SegmentedControl,
} from '@kyleboyd/design-system';
import { PageLayout } from '../components/PageLayout';

export interface Partner {
  id: string;
  partnerName: string;
  endpoints: number;
  contacts: number;
}

export interface ExternalUser {
  id: string;
  name: string;
  email: string;
  partnerId: string;
  partnerName: string;
  lastActivity: string;
}

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

const mockExternalUsers: ExternalUser[] = [
  { id: 'u1', name: 'Abhi Arora', email: 'abhi.arora@coenterprise.com', partnerId: '3', partnerName: 'Acme Corporation', lastActivity: 'February 11, 2026' },
  { id: 'u2', name: 'Aman Kapoor', email: 'aman.kapoor@coenterprise.com', partnerId: '2', partnerName: 'A & M Investment', lastActivity: 'February 10, 2026' },
  { id: 'u3', name: 'Avinash Kumar Ext', email: 'avinash.kumar@partner.com', partnerId: '14', partnerName: 'Partner Payroll Engine', lastActivity: 'December 26, 2025' },
  { id: 'u4', name: 'Priya Sharma', email: 'priya.sharma@coenterprise.com', partnerId: '7', partnerName: 'Commercial Banking New York', lastActivity: 'February 5, 2026' },
  { id: 'u5', name: 'Raj Patel', email: 'raj.patel@coenterprise.com', partnerId: '18', partnerName: 'Stonebridge Capital Management', lastActivity: 'January 28, 2026' },
  { id: 'u6', name: 'Sarah Chen', email: 'sarah.chen@coenterprise.com', partnerId: '11', partnerName: 'John Deere', lastActivity: 'February 1, 2026' },
  { id: 'u7', name: 'Michael Torres', email: 'michael.torres@coenterprise.com', partnerId: '19', partnerName: 'Sunrise Builders', lastActivity: 'January 15, 2026' },
  { id: 'u8', name: 'Emily Watson', email: 'emily.watson@coenterprise.com', partnerId: '22', partnerName: 'Alpha Financial Services', lastActivity: 'February 8, 2026' },
];

const SEGMENT_ITEMS = [
  { id: 'external-partners', text: 'External Partners' },
  { id: 'internal-systems', text: 'Internal Systems' },
  { id: 'uncategorized', text: 'Uncategorized' },
  { id: 'external-users', text: 'External Users' },
];

const LAST_ACTIVITY_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
];

function isWithinDays(dateStr: string, days: number): boolean {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= days;
}

function Partners() {
  const [activeSegment, setActiveSegment] = useState<string | number>('external-partners');
  const [searchValue, setSearchValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>('partnerName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortFieldUser, setSortFieldUser] = useState<string>('name');
  const [sortDirectionUser, setSortDirectionUser] = useState<'asc' | 'desc'>('asc');
  const [partnerFilter, setPartnerFilter] = useState<string | number>('all');
  const [lastActivityFilter, setLastActivityFilter] = useState<string | number>('all');

  const filteredPartners = useMemo(() => {
    let list = [...mockPartners];
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (p) =>
          p.partnerName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }
    if (partnerFilter !== 'all') {
      list = list.filter((p) => p.partnerName === partnerFilter);
    }
    list.sort((a, b) => {
      const aVal = String((a as any)[sortField] ?? '').toLowerCase();
      const bVal = String((b as any)[sortField] ?? '').toLowerCase();
      if (sortField === 'endpoints' || sortField === 'contacts') {
        const an = (a as any)[sortField] ?? 0;
        const bn = (b as any)[sortField] ?? 0;
        return sortDirection === 'asc' ? an - bn : bn - an;
      }
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [searchValue, partnerFilter, sortField, sortDirection]);

  const filteredExternalUsers = useMemo(() => {
    let list = [...mockExternalUsers];
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.partnerName.toLowerCase().includes(q)
      );
    }
    if (partnerFilter !== 'all') {
      list = list.filter((u) => u.partnerName === partnerFilter);
    }
    if (lastActivityFilter !== 'all') {
      const days = Number(lastActivityFilter);
      list = list.filter((u) => isWithinDays(u.lastActivity, days));
    }
    list.sort((a, b) => {
      const aVal = String((a as any)[sortFieldUser] ?? '').toLowerCase();
      const bVal = String((b as any)[sortFieldUser] ?? '').toLowerCase();
      if (sortFieldUser === 'lastActivity') {
        const ad = new Date(a.lastActivity).getTime();
        const bd = new Date(b.lastActivity).getTime();
        return sortDirectionUser === 'asc' ? ad - bd : bd - ad;
      }
      const cmp = aVal.localeCompare(bVal);
      return sortDirectionUser === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [searchValue, partnerFilter, lastActivityFilter, sortFieldUser, sortDirectionUser]);

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

  const handleHeaderCheckboxChangeUsers = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(new Set(filteredExternalUsers.map((u) => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleRowCheckboxChangeUser = (id: string, checked: boolean) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSortUser = (field: string) => {
    if (sortFieldUser === field) {
      setSortDirectionUser((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortFieldUser(field);
      setSortDirectionUser('asc');
    }
  };

  const partnerFilterOptions = useMemo(
    () => [
      { value: 'all', label: 'All' },
      ...mockPartners.map((p) => ({ value: p.partnerName, label: p.partnerName })),
    ],
    []
  );

  const lastActivityFilterOptions = useMemo(() => LAST_ACTIVITY_OPTIONS, []);

  const filterOptions: FilterOption[] = [
    {
      id: 'partner',
      label: 'Partner',
      value: partnerFilter,
      options: partnerFilterOptions,
    },
    {
      id: 'lastActivity',
      label: 'Last Activity',
      value: lastActivityFilter,
      options: lastActivityFilterOptions,
    },
  ];

  const activeFilters = useMemo(() => {
    const list: { id: string; label: string; value: string; filterId: string }[] = [];
    if (partnerFilter !== 'all') {
      list.push({
        id: 'partner-chip',
        label: 'Partner',
        value: String(partnerFilter),
        filterId: 'partner',
      });
    }
    if (lastActivityFilter !== 'all') {
      const option = lastActivityFilterOptions.find((o) => o.value === lastActivityFilter);
      list.push({
        id: 'lastActivity-chip',
        label: 'Last Activity',
        value: option?.label ?? String(lastActivityFilter),
        filterId: 'lastActivity',
      });
    }
    return list;
  }, [partnerFilter, lastActivityFilter, lastActivityFilterOptions]);

  const hasSelection =
    activeSegment === 'external-partners'
      ? selectedIds.size > 0
      : selectedUserIds.size > 0;

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

  const externalUserColumns: TableColumn<ExternalUser>[] = [
    {
      id: 'select',
      label: '',
      sortable: false,
      minWidth: 48,
      headerCheckbox: true,
      headerCheckboxChecked: selectedUserIds.size === filteredExternalUsers.length && filteredExternalUsers.length > 0,
      headerCheckboxIndeterminate: selectedUserIds.size > 0 && selectedUserIds.size < filteredExternalUsers.length,
      onHeaderCheckboxChange: handleHeaderCheckboxChangeUsers,
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedUserIds.has(row.id)}
          onChange={(_, checked) => handleRowCheckboxChangeUser(row.id, checked)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      id: 'name',
      label: (
        <TableSortLabel
          active={sortFieldUser === 'name'}
          direction={sortFieldUser === 'name' ? sortDirectionUser : 'asc'}
          onClick={() => handleSortUser('name')}
        >
          Name
        </TableSortLabel>
      ),
      minWidth: 240,
      render: (row) => (
        <Box>
          <Link
            component={RouterLink}
            to={`/partners/users/${row.id}`}
            sx={{ color: 'primary.main', fontWeight: 500, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {row.name}
          </Link>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
            {row.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'partner',
      label: (
        <TableSortLabel
          active={sortFieldUser === 'partnerName'}
          direction={sortFieldUser === 'partnerName' ? sortDirectionUser : 'asc'}
          onClick={() => handleSortUser('partnerName')}
        >
          Partner
        </TableSortLabel>
      ),
      minWidth: 200,
      render: (row) => (
          <Link
            component={RouterLink}
            to={`/partners/${encodeURIComponent(row.partnerName)}`}
            sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            {row.partnerName}
          </Link>
      ),
    },
    {
      id: 'lastActivity',
      label: (
        <TableSortLabel
          active={sortFieldUser === 'lastActivity'}
          direction={sortFieldUser === 'lastActivity' ? sortDirectionUser : 'asc'}
          onClick={() => handleSortUser('lastActivity')}
        >
          Last Activity
        </TableSortLabel>
      ),
      minWidth: 140,
      render: (row) => (
        <Typography variant="body2">{row.lastActivity}</Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      minWidth: 80,
      align: 'left',
      render: () => (
        <IconButton size="small" aria-label="Actions">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const tableSx = {
    border: 'none',
    '& .MuiTableBody-root .MuiTableRow-root': { height: 48 },
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
  };

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
          filters={filterOptions}
          onFilterChange={(filterId, value) => {
            if (filterId === 'partner') setPartnerFilter(value);
            if (filterId === 'lastActivity') setLastActivityFilter(value);
          }}
          activeFilters={activeFilters}
          onFilterRemove={(filterId) => {
            if (filterId === 'partner') setPartnerFilter('all');
            if (filterId === 'lastActivity') setLastActivityFilter('all');
          }}
          onClearAll={() => {
            setPartnerFilter('all');
            setLastActivityFilter('all');
          }}
          clearAllLabel="Reset filters"
          alwaysShowClearAll
          resultCount={activeSegment === 'external-users' ? `${filteredExternalUsers.length} results` : `${filteredPartners.length} results`}
          actions={{
            secondary: {
              label: 'Actions',
              options: [],
              disabled: !hasSelection,
            },
          }}
        />
      </Box>

      <Box sx={{ mx: 0, ...tableSx }}>
        {activeSegment === 'external-users' ? (
          <Table
            columns={externalUserColumns}
            rows={filteredExternalUsers}
            stickyHeader
          />
        ) : (
          <Table
            columns={partnerColumns}
            rows={filteredPartners}
            stickyHeader
          />
        )}
      </Box>
    </PageLayout>
  );
}

export default Partners;
