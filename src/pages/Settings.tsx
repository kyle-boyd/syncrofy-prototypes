/**
 * Settings page — User Management and settings sub-navigation.
 *
 * Uses design-system: PageLayout, Header, PageHeader, SegmentedControl,
 * FilterControls, Table, Button, IconButton, Link, Dropdown, theme tokens.
 *
 * --- Missing components / functionality (flagged) ---
 * 1. Nested/Collapsible Settings SideNav: Left settings menu (My Account,
 *    Production Environment, Company, Global with sub-items) is built with
 *    Box/Typography. Design system has only flat CollapsibleSideNav — no
 *    nested or sectioned side nav component.
 * 2. Pagination: No pagination under the user table (infinite scroll or
 *    Pagination component not wired).
 * 3. Notification/Toast: Header bell implies notifications; SnackBar/Toast
 *    exists in design system but is not integrated for notification panel.
 * 4. PageHeader primary action slot: "+ Invite User" is in a custom row;
 *    PageHeader has no dedicated slot for a primary action next to refresh.
 */
import { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Typography,
  Checkbox,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  PageHeader,
  FilterControls,
  FilterOption,
  Table,
  TableColumn,
  Button,
  IconButton,
  Link,
  SegmentedControl,
  Dropdown,
  Tag,
  type SegmentedControlItemData,
} from '@kyleboyd/design-system';
import { PageLayout } from '../components/PageLayout';
import { mockPartners } from './Partners';

// Settings sub-navigation sections (matches screenshot)
const SETTINGS_SECTIONS = [
  {
    heading: 'My Account',
    items: [
      { id: 'account', label: 'Account' },
      { id: 'notifications', label: 'Notifications' },
    ],
  },
  {
    heading: 'Production Environment',
    items: [
      { id: 'adapter', label: 'Adapter' },
      { id: 'data-source', label: 'Data Source' },
      { id: 'line-of-business', label: 'Line of Business' },
      { id: 'groups', label: 'Groups' },
      { id: 'users', label: 'Users' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { id: 'company-management', label: 'Company Management' },
    ],
  },
  {
    heading: 'Global',
    items: [
      { id: 'environments', label: 'Environments' },
      { id: 'theme', label: 'Theme' },
    ],
  },
] as const;

export interface UserRow {
  id: string;
  name: string;
  email: string;
  groups: string;
  lastActivity: string;
  /** When set, user is an external user; show Badge "External User - {partnerName}" in Groups column */
  partnerId?: string;
  partnerName?: string;
}

const getPartnerName = (id: string) => mockPartners.find((p) => p.id === id)?.partnerName ?? '';

const mockUsers: UserRow[] = [
  { id: '1', name: 'Abhi Arora', email: 'abhi.arora@coenterprise.com', groups: 'Administrators, All Users, Group 102 + 2 more', lastActivity: 'February 11, 2026', partnerId: '3', partnerName: getPartnerName('3') || 'Acme Corporation' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@coenterprise.com', groups: 'All Users, Finance', lastActivity: 'February 10, 2026', partnerId: '2', partnerName: getPartnerName('2') || 'A & M Investment' },
  { id: '3', name: 'John Doe', email: 'john.doe@coenterprise.com', groups: 'All Users, Administrators', lastActivity: 'February 9, 2026' },
  { id: '4', name: 'Maria Garcia', email: 'maria.garcia@coenterprise.com', groups: 'All Users, Group 102', lastActivity: 'February 8, 2026', partnerId: '7', partnerName: getPartnerName('7') || 'Commercial Banking New York' },
  { id: '5', name: 'David Lee', email: 'david.lee@coenterprise.com', groups: 'All Users', lastActivity: 'February 7, 2026', partnerId: '19', partnerName: getPartnerName('19') || 'Sunrise Builders' },
  { id: '6', name: 'Priya Sharma', email: 'priya.sharma@coenterprise.com', groups: 'All Users, Compliance', lastActivity: 'February 6, 2026', partnerId: '18', partnerName: getPartnerName('18') || 'Stonebridge Capital Management' },
  { id: '7', name: 'James Wilson', email: 'james.wilson@coenterprise.com', groups: 'Administrators, All Users, IT', lastActivity: 'February 5, 2026' },
  { id: '8', name: 'Sarah Chen', email: 'sarah.chen@coenterprise.com', groups: 'All Users, Finance', lastActivity: 'February 4, 2026', partnerId: '11', partnerName: getPartnerName('11') || 'John Deere' },
  { id: '9', name: 'Emily Watson', email: 'emily.watson@coenterprise.com', groups: 'All Users, Group 102', lastActivity: 'February 3, 2026', partnerId: '22', partnerName: getPartnerName('22') || 'Alpha Financial Services' },
  { id: '10', name: 'Michael Torres', email: 'michael.torres@coenterprise.com', groups: 'All Users', lastActivity: 'February 2, 2026', partnerId: '14', partnerName: getPartnerName('14') || 'Partner Payroll Engine' },
  { id: '11', name: 'Lisa Anderson', email: 'lisa.anderson@coenterprise.com', groups: 'All Users, HR, Administrators', lastActivity: 'February 1, 2026' },
  { id: '12', name: 'Robert Kim', email: 'robert.kim@coenterprise.com', groups: 'All Users, Finance', lastActivity: 'January 31, 2026', partnerId: '9', partnerName: getPartnerName('9') || 'Heritage Family Enterprises' },
  { id: '13', name: 'Amanda Foster', email: 'amanda.foster@coenterprise.com', groups: 'All Users, Group 102 + 1 more', lastActivity: 'January 30, 2026' },
  { id: '14', name: 'Daniel Brown', email: 'daniel.brown@coenterprise.com', groups: 'All Users', lastActivity: 'January 29, 2026', partnerId: '16', partnerName: getPartnerName('16') || 'Securities Trade Engine' },
  { id: '15', name: 'Jennifer Martinez', email: 'jennifer.martinez@coenterprise.com', groups: 'All Users, Compliance, Administrators', lastActivity: 'January 28, 2026' },
  { id: '16', name: 'Christopher Davis', email: 'christopher.davis@coenterprise.com', groups: 'All Users, IT', lastActivity: 'January 27, 2026', partnerId: '8', partnerName: getPartnerName('8') || 'Crestline Wealth & Capital Services' },
  { id: '17', name: 'Rachel Green', email: 'rachel.green@coenterprise.com', groups: 'All Users, Finance', lastActivity: 'January 26, 2026' },
  { id: '18', name: 'Kevin Nguyen', email: 'kevin.nguyen@coenterprise.com', groups: 'All Users, Group 102', lastActivity: 'January 25, 2026', partnerId: '17', partnerName: getPartnerName('17') || 'Silverhair Builders' },
  { id: '19', name: 'Nicole Taylor', email: 'nicole.taylor@coenterprise.com', groups: 'All Users, HR', lastActivity: 'January 24, 2026' },
  { id: '20', name: 'Andrew Johnson', email: 'andrew.johnson@coenterprise.com', groups: 'Administrators, All Users', lastActivity: 'January 23, 2026', partnerId: '5', partnerName: getPartnerName('5') || 'Anderson & Sons' },
  { id: '21', name: 'Stephanie White', email: 'stephanie.white@coenterprise.com', groups: 'All Users, Compliance', lastActivity: 'January 22, 2026' },
  { id: '22', name: 'Avinash Kumar', email: 'avinash.kumar@partner.com', groups: 'All Users', lastActivity: 'January 21, 2026', partnerId: '20', partnerName: getPartnerName('20') || 'Sunrise Builders Payroll System' },
  { id: '23', name: 'Olivia Harris', email: 'olivia.harris@coenterprise.com', groups: 'All Users, Finance, Group 102', lastActivity: 'January 20, 2026' },
  { id: '24', name: 'Ryan Clark', email: 'ryan.clark@coenterprise.com', groups: 'All Users', lastActivity: 'January 19, 2026', partnerId: '21', partnerName: getPartnerName('21') || 'Wealth Compliance Engine' },
  { id: '25', name: 'Lauren Lewis', email: 'lauren.lewis@coenterprise.com', groups: 'All Users, IT, Administrators', lastActivity: 'January 18, 2026' },
];

const USER_STATUS_TABS: SegmentedControlItemData[] = [
  { id: 'active', text: 'Active (39)' },
  { id: 'invited', text: 'Invited (14)' },
  { id: 'deactivated', text: 'Deactivated (2)' },
];

function Settings() {
  const [settingsSection, setSettingsSection] = useState<string>('users');
  const [userStatusTab, setUserStatusTab] = useState<string | number>('active');
  const [searchValue, setSearchValue] = useState('');
  const [groupsFilter, setGroupsFilter] = useState<string | number>('all');
  const [lastActivityFilter, setLastActivityFilter] = useState<string | number>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredUsers = useMemo(() => {
    let list = [...mockUsers];
    if (searchValue) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.groups.toLowerCase().includes(q)
      );
    }
    if (sortBy) {
      list.sort((a, b) => {
        const aVal = a[sortBy as keyof UserRow] ?? '';
        const bVal = b[sortBy as keyof UserRow] ?? '';
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDirection === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [searchValue, sortBy, sortDirection]);

  const allSelected = filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length;
  const someSelected = selectedUserIds.size > 0;

  const handleHeaderCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleRowCheckboxChange = (id: string, checked: boolean) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const filterOptions: FilterOption[] = [
    {
      id: 'groups',
      label: 'Groups',
      value: groupsFilter,
      options: [
        { value: 'all', label: 'All Groups' },
        { value: 'administrators', label: 'Administrators' },
        { value: 'all-users', label: 'All Users' },
      ],
    },
    {
      id: 'lastActivity',
      label: 'Last Activity',
      value: lastActivityFilter,
      options: [
        { value: 'all', label: 'All' },
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
      ],
    },
  ];

  const columns: TableColumn<UserRow>[] = useMemo(
    () => [
      {
        id: 'select',
        label: '',
        sortable: false,
        headerCheckbox: true,
        headerCheckboxChecked: allSelected,
        headerCheckboxIndeterminate: someSelected && !allSelected,
        onHeaderCheckboxChange: handleHeaderCheckboxChange,
        render: (row) => (
          <Checkbox
            size="small"
            checked={selectedUserIds.has(row.id)}
            onChange={(_, checked) => handleRowCheckboxChange(row.id, checked)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        id: 'name',
        label: 'Name',
        sortable: true,
        sortValue: (row) => row.name,
        minWidth: 200,
        render: (row) => (
          <Box>
            <Link
              href="#"
              color="primary"
              underline="hover"
              sx={{ fontWeight: 500, fontSize: '0.875rem' }}
            >
              {row.name}
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
              {row.email}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'groups',
        label: 'Groups',
        sortable: true,
        sortValue: (row) => (row.partnerName ? `External User, ${row.partnerName}` : row.groups),
        minWidth: 220,
        render: (row) =>
          row.partnerName ? (
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75 }}>
              <Tag label="External User" variant="info" size="small" hideIcon />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {row.partnerName}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              {row.groups}
            </Typography>
          ),
      },
      {
        id: 'lastActivity',
        label: 'Last Activity',
        sortable: true,
        sortValue: (row) => row.lastActivity,
        minWidth: 140,
        render: (row) => (
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            {row.lastActivity}
          </Typography>
        ),
      },
      {
        id: 'actions',
        label: 'Actions',
        sortable: false,
        minWidth: 80,
        render: (row) => (
          <Dropdown
            trigger={
              <IconButton size="small" aria-label="Row actions">
                <MoreVertIcon sx={{ fontSize: 20 }} />
              </IconButton>
            }
            options={[
              { value: 'edit', label: 'Edit user' },
              { value: 'deactivate', label: 'Deactivate' },
            ]}
            onSelect={(value) => console.log('Action', value, row.id)}
            hugContents
          />
        ),
      },
    ],
    [allSelected, someSelected, selectedUserIds]
  );

  return (
    <PageLayout selectedNavItem="settings" backgroundColor="#FAFCFC">
      {/* Single white container (background-overlay) around all settings */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 1,
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
          }}
        >
          Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 0, flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Settings sub-navigation — custom (no NestedSideNav in design system) */}
          <Box
            sx={{
              width: 220,
              flexShrink: 0,
              p: 2,
              borderRight: '1px solid',
              borderRightColor: 'divider',
              overflowY: 'auto',
            }}
          >
            {SETTINGS_SECTIONS.map((section) => (
            <Box key={section.heading} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 600,
                  color: 'text.secondary',
                  mb: 0.5,
                  px: 1,
                }}
              >
                {section.heading}
              </Typography>
              {section.items.map((item) => {
                const isActive = settingsSection === item.id;
                return (
                  <Box
                    key={item.id}
                    onClick={() => setSettingsSection(item.id)}
                    sx={{
                      py: 0.75,
                      px: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: isActive ? 'grey.100' : 'transparent',
                      '&:hover': { bgcolor: isActive ? 'grey.100' : 'action.hover' },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isActive ? 600 : 400,
                        color: 'text.primary',
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* Main content: User Management (when Users is selected) */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 3 }}>
          {settingsSection === 'users' ? (
            <>
              <Stack spacing={2} sx={{ mb: 2 }}>
                <PageHeader
                  title="User Management"
                  showBreadcrumb={false}
                  refreshStatus="Last refreshed: just now"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
                  Manage CoEnterprise user accounts
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <SegmentedControl
                    items={USER_STATUS_TABS}
                    defaultSelectedId={userStatusTab}
                    onChange={setUserStatusTab}
                    size="md"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Typography variant="caption" color="text.secondary">
                      Last refreshed: just now
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        width: 32,
                        height: 32,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '6px',
                      }}
                    >
                      <RefreshIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {}}
                    >
                      Invite User
                    </Button>
                  </Box>
                </Box>
              </Stack>

              <Box
                sx={{
                  position: 'sticky',
                  top: -24,
                  zIndex: 20,
                  bgcolor: 'background.paper',
                  pt: 3,
                  pb: 2,
                  mb: 2,
                  mx: -3,
                  px: 3,
                }}
              >
                <FilterControls
                  search={{
                    placeholder: 'Search Active Users',
                    value: searchValue,
                    onChange: setSearchValue,
                  }}
                  filters={filterOptions}
                  onFilterChange={(id, val) => {
                    if (id === 'groups') setGroupsFilter(val);
                    if (id === 'lastActivity') setLastActivityFilter(val);
                  }}
                  resultCount={`${filteredUsers.length} users`}
                  clearAllLabel="Reset Filters"
                  alwaysShowClearAll
                  onClearAll={() => {
                    setGroupsFilter('all');
                    setLastActivityFilter('all');
                    setSearchValue('');
                  }}
                  actions={{
                    secondary: {
                      label: 'Actions',
                      options: [
                        { value: 'bulk-invite', label: 'Resend invite' },
                        { value: 'bulk-deactivate', label: 'Deactivate selected' },
                      ],
                      onSelect: (value) => console.log('Bulk action', value),
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                  '& .MuiTableCell-root': {
                    borderLeft: 'none !important',
                    borderRight: 'none !important',
                  },
                  '& .MuiTableBody-root .MuiTableRow-root': {
                    height: 48,
                  },
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
                <Table<UserRow>
                  columns={columns}
                  rows={filteredUsers}
                  stickyHeader
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSort={(col, dir) => {
                    setSortBy(col);
                    setSortDirection(dir);
                  }}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                {SETTINGS_SECTIONS.flatMap((s) => s.items).find((i) => i.id === settingsSection)?.label ?? settingsSection}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Select a settings section from the menu.
              </Typography>
            </Box>
          )}
        </Box>
        </Box>
      </Box>
    </PageLayout>
  );
}

export default Settings;
