/**
 * UserDetail page — individual user profile within Settings > Users.
 *
 * Renders inside the same Settings chrome (sidebar + white card).
 * Shows user profile, default landing page, security, and group memberships.
 */
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  IconButton as MuiIconButton,
} from '@mui/material';
import MuiAvatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import {
  Button,
  IconButton,
  Link,
  Dropdown,
  Modal,
  SegmentedControl,
} from '@design-system';
import { PageLayout } from '../components/PageLayout';
import { mockUsers, SETTINGS_SECTIONS } from './Settings';

interface PermissionRow {
  name: string;
  description: string;
  access: 'No Access' | 'View' | 'Edit' | 'Full Access';
}

interface PermissionSection {
  title: string;
  description: string;
  rows: PermissionRow[];
}

const ADMIN_PERMISSION_SECTIONS: PermissionSection[] = [
  {
    title: 'Company Configuration',
    description: 'Control company-wide settings related to security, environments, and integrations',
    rows: [
      { name: 'Company Management', description: 'Manage company-wide settings related to security, environments, integrations, and domains', access: 'No Access' },
      { name: 'Environments', description: 'Configure staging, test, or production environments used by your company', access: 'No Access' },
      { name: 'Data Source', description: 'Connect and manage internal or external data sources', access: 'No Access' },
      { name: 'Adapter', description: 'Monitor and configure Syncrofy adapters that connect to external systems. Includes update status, auto-update settings, and connectivity health', access: 'No Access' },
      { name: 'Theme', description: "Set your company's logo", access: 'No Access' },
      { name: 'Lines of Business', description: 'Create, manage and edit Lines of Business', access: 'No Access' },
    ],
  },
  {
    title: 'People & Access Management',
    description: 'Control who has access to the system and how their permissions are structured',
    rows: [
      { name: 'Users', description: 'Permissions to invite, remove, or update users in your company', access: 'No Access' },
      { name: 'Groups', description: 'Permissions to create and manage permission groups to standardize user access', access: 'No Access' },
    ],
  },
  {
    title: 'Data & Integration',
    description: 'Manage data flows, trading partners, and EDI transaction handling',
    rows: [
      { name: 'Trading Partners', description: 'Create and manage trading partner relationships and configurations', access: 'No Access' },
      { name: 'Transactions', description: 'View and manage EDI transactions across all trading partners', access: 'No Access' },
      { name: 'Maps', description: 'Create and edit translation maps for EDI document transformation', access: 'No Access' },
    ],
  },
];

const FEATURE_PERMISSION_SECTIONS: PermissionSection[] = [
  {
    title: 'Transfers',
    description: 'Control access to file transfer monitoring and management',
    rows: [
      { name: 'View Transfers', description: 'View transfer history, status, and related documents', access: 'No Access' },
      { name: 'Retry Transfers', description: 'Retry failed or rejected transfers', access: 'No Access' },
      { name: 'Archive Transfers', description: 'Archive and restore transfer records', access: 'No Access' },
    ],
  },
  {
    title: 'Exceptions',
    description: 'Control access to exception handling and rule configuration',
    rows: [
      { name: 'View Exceptions', description: 'View exception details and related transfer data', access: 'No Access' },
      { name: 'Manage Exception Rules', description: 'Create and edit rules for exception detection and routing', access: 'No Access' },
    ],
  },
];

const ACCESS_ICON_COLOR: Record<string, string> = {
  'No Access': 'text.disabled',
  View: 'info.main',
  Edit: 'warning.main',
  'Full Access': 'success.main',
};

const PERMISSION_TABS = [
  { id: 'admin', text: 'Admin Permissions' },
  { id: 'feature', text: 'Feature Permissions' },
];

function GroupPermissionsContent({ groupId, groupName }: { groupId: string; groupName: string }) {
  const [tab, setTab] = useState<string | number>('admin');
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  const sections = tab === 'admin' ? ADMIN_PERMISSION_SECTIONS : FEATURE_PERMISSION_SECTIONS;

  return (
    <Box sx={{ borderTop: '1px solid', borderTopColor: 'divider' }}>
      {/* Toolbar row: segmented control + remove button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
        }}
      >
        <SegmentedControl
          items={PERMISSION_TABS}
          defaultSelectedId="admin"
          size="sm"
          onChange={(id) => setTab(id)}
        />
        {groupId !== 'all-users' && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setRemoveModalOpen(true)}
          >
            Remove from Group
          </Button>
        )}
      </Box>

      <Modal
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        title={`Remove from ${groupName}?`}
        maxWidth="xs"
        actions={
          <>
            <Button variant="text" color="secondary" size="small" onClick={() => setRemoveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => { console.log('Removed from group:', groupId); setRemoveModalOpen(false); }}
              sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
            >
              Remove
            </Button>
          </>
        }
      >
        <Typography variant="body2">
          Are you sure you want to remove this user from <strong>{groupName}</strong>?
        </Typography>
      </Modal>

      {/* Permissions list container */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          mx: 2.5,
          my: 2,
          overflow: 'hidden',
        }}
      >
        {sections.map((section, si) => (
          <Box key={`${groupId}-${section.title}`}>
            {/* Section header */}
            <Box sx={{ px: 2, pt: 1.5, pb: 0.75 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                {section.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                {section.description}
              </Typography>
            </Box>

            {/* Permission rows */}
            {section.rows.map((row, ri) => (
              <Box key={row.name}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    py: 1.25,
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {row.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                      {row.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                    <DoNotDisturbOnIcon sx={{ fontSize: 18, color: ACCESS_ICON_COLOR[row.access] }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>
                      {row.access}
                    </Typography>
                  </Box>
                </Box>
                {ri < section.rows.length - 1 && <Divider />}
              </Box>
            ))}

            {si < sections.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

interface UserDetailData {
  title: string;
  department: string;
  bio: string;
  mobile: string;
  office: string;
  defaultLandingPage: string;
  groups: Array<{
    id: string;
    name: string;
    description: string;
    isFixed: boolean;
  }>;
}

const mockUserDetailsMap: Record<string, UserDetailData> = {
  '1': {
    title: 'sa',
    department: 'Accounts Receivable',
    bio: 'DSADA',
    mobile: '7009395983',
    office: '7009395983',
    defaultLandingPage: 'dashboard',
    groups: [
      { id: 'test-permission', name: 'test permission', description: 'Custom permission group for testing access controls.', isFixed: false },
      { id: 'administrators', name: 'Administrators', description: 'Reserved for CoEnterprise users who have full access within the company. This group cannot be edited or deleted.', isFixed: true },
      { id: 'all-users', name: 'All Users', description: 'This group includes all users in the company. It includes only the most essential permissions to avoid giving broad access too widely. All active company users are automatically added to this group.', isFixed: true },
      { id: 'group-102', name: 'Group 102', description: 'Standard access group with limited permissions.', isFixed: false },
      { id: 'group-test-101', name: 'Group test 101', description: 'Test group for development and QA purposes.', isFixed: false },
      { id: 'dasnida', name: 'dasnidadasnida dasnida dasnida dasnida dasnida', description: 'Custom access group.', isFixed: false },
    ],
  },
  '2': {
    title: 'Finance Manager',
    department: 'Finance',
    bio: '',
    mobile: '555-0102',
    office: '555-0102 ext. 105',
    defaultLandingPage: 'dashboard',
    groups: [
      { id: 'all-users', name: 'All Users', description: 'This group includes all users in the company. All active company users are automatically added to this group.', isFixed: true },
      { id: 'finance', name: 'Finance', description: 'Access group for finance team members with permissions scoped to financial reporting and transaction data.', isFixed: false },
      { id: 'group-102', name: 'Group 102', description: 'Standard access group with limited permissions.', isFixed: false },
    ],
  },
  '3': {
    title: 'Senior Engineer',
    department: 'IT',
    bio: '',
    mobile: '555-0103',
    office: '555-0103 ext. 201',
    defaultLandingPage: 'transfers',
    groups: [
      { id: 'all-users', name: 'All Users', description: 'This group includes all users in the company. All active company users are automatically added to this group.', isFixed: true },
      { id: 'administrators', name: 'Administrators', description: 'Reserved for CoEnterprise users who have full access within the company. This group cannot be edited or deleted.', isFixed: true },
      { id: 'group-test-101', name: 'Group test 101', description: 'Test group for development and QA purposes.', isFixed: false },
    ],
  },
};

const getDefaultDetail = (_userId: string): UserDetailData => ({
  title: 'User',
  department: 'General',
  bio: '',
  mobile: '555-0100',
  office: '555-0101',
  defaultLandingPage: 'dashboard',
  groups: [
    { id: 'all-users', name: 'All Users', description: 'This group includes all users in the company. All active company users are automatically added to this group.', isFixed: true },
    { id: 'group-102', name: 'Group 102', description: 'Standard access group with limited permissions.', isFixed: false },
  ],
});

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const PASSWORD_REQUIREMENTS = [
  'at least 12 characters',
  'include at least one letter',
  'include at least one number',
  'include at least one special character (! @ # $ % ^ & *)',
];

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  reenterPassword?: string;
}

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showReenter, setShowReenter] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): PasswordErrors => {
    const errs: PasswordErrors = {};
    if (!currentPassword) errs.currentPassword = 'Current Password is required';
    if (!newPassword) {
      errs.newPassword = 'New Password is required';
    } else if (
      newPassword.length < 12 ||
      !/[a-zA-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[!@#$%^&*]/.test(newPassword)
    ) {
      errs.newPassword = 'New Password does not meet complexity requirements';
    }
    if (!reenterPassword) {
      errs.reenterPassword = 'Reenter New Password is required';
    } else if (reenterPassword !== newPassword) {
      errs.reenterPassword = 'Reenter New Password text must match the New Password entered';
    }
    return errs;
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setReenterPassword('');
    setErrors({});
    setHasSubmitted(false);
    onClose();
  };

  const handleSubmit = () => {
    const errs = validate();
    setHasSubmitted(true);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSuccess(true);
      handleClose();
    }
  };

  const hasErrors = hasSubmitted && Object.keys(errors).length > 0;

  const eyeAdornment = (show: boolean, toggle: () => void) => ({
    endAdornment: (
      <InputAdornment position="end">
        <MuiIconButton size="small" onClick={toggle} edge="end" tabIndex={-1}>
          {show ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
        </MuiIconButton>
      </InputAdornment>
    ),
  });

  const FieldLabel = ({ text }: { text: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{text}</Typography>
      <Typography component="span" variant="body2" color="error.main" sx={{ ml: 0.25 }}>*</Typography>
    </Box>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="Change Password"
        maxWidth="sm"
        actions={
          <>
            <Button variant="text" color="secondary" size="small" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" size="small" onClick={handleSubmit}>Change Password</Button>
          </>
        }
      >
        {hasErrors && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>Error(s) Identified</Typography>
            <Typography variant="body2">
              The error(s) identified below must be fixed before you can change the password.
            </Typography>
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Passwords must be:
        </Typography>
        <Box component="ul" sx={{ m: 0, mb: 2.5, pl: 2.5, listStyleType: 'disc' }}>
          {PASSWORD_REQUIREMENTS.map((req) => (
            <Typography key={req} component="li" variant="body2" color="text.secondary">
              {req}
            </Typography>
          ))}
        </Box>

        <Box sx={{ mb: 2 }}>
          <FieldLabel text="Current Password (required)" />
          <TextField
            fullWidth
            size="small"
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            InputProps={eyeAdornment(showCurrent, () => setShowCurrent((v) => !v))}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <FieldLabel text="New Password (required)" />
            <TextField
              fullWidth
              size="small"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={eyeAdornment(showNew, () => setShowNew((v) => !v))}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <FieldLabel text="Reenter New Password (required)" />
            <TextField
              fullWidth
              size="small"
              type={showReenter ? 'text' : 'password'}
              value={reenterPassword}
              onChange={(e) => setReenterPassword(e.target.value)}
              error={!!errors.reenterPassword}
              helperText={errors.reenterPassword}
              InputProps={eyeAdornment(showReenter, () => setShowReenter((v) => !v))}
            />
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ width: '100%' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Password Changed</Typography>
          <Typography variant="body2">Your password has been successfully changed.</Typography>
        </Alert>
      </Snackbar>
    </>
  );
}

interface AdminResetPasswordErrors {
  newPassword?: string;
  reenterPassword?: string;
}

function AdminResetPasswordModal({
  open,
  onClose,
  userName,
  userEmail,
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
}) {
  const [newPassword, setNewPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showReenter, setShowReenter] = useState(false);
  const [errors, setErrors] = useState<AdminResetPasswordErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (): AdminResetPasswordErrors => {
    const errs: AdminResetPasswordErrors = {};
    if (!newPassword) {
      errs.newPassword = 'New Password is required';
    } else if (
      newPassword.length < 12 ||
      !/[a-zA-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword) ||
      !/[!@#$%^&*]/.test(newPassword)
    ) {
      errs.newPassword = 'Password does not meet complexity requirements';
    }
    if (!reenterPassword) {
      errs.reenterPassword = 'Please confirm the new password';
    } else if (reenterPassword !== newPassword) {
      errs.reenterPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleClose = () => {
    setNewPassword('');
    setReenterPassword('');
    setErrors({});
    setHasSubmitted(false);
    onClose();
  };

  const handleSubmit = () => {
    const errs = validate();
    setHasSubmitted(true);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSuccess(true);
      handleClose();
    }
  };

  const hasErrors = hasSubmitted && Object.keys(errors).length > 0;

  const eyeAdornment = (show: boolean, toggle: () => void) => ({
    endAdornment: (
      <InputAdornment position="end">
        <MuiIconButton size="small" onClick={toggle} edge="end" tabIndex={-1}>
          {show ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
        </MuiIconButton>
      </InputAdornment>
    ),
  });

  const FieldLabel = ({ text }: { text: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{text}</Typography>
      <Typography component="span" variant="body2" color="error.main" sx={{ ml: 0.25 }}>*</Typography>
    </Box>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberIcon sx={{ color: 'error.main', fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Reset Password</Typography>
          </Box>
        }
        maxWidth="sm"
        actions={
          <>
            <Button variant="text" color="secondary" size="small" onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              sx={{
                bgcolor: 'error.main',
                '&:hover': { bgcolor: 'error.dark' },
                color: 'error.contrastText',
              }}
            >
              Set Temporary Password
            </Button>
          </>
        }
      >
        {/* Top warning banner */}
        <Alert
          severity="error"
          icon={<WarningAmberIcon fontSize="inherit" />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            You are resetting the password for {userName}
          </Typography>
          <Typography variant="body2">
            This action will immediately affect their ability to log in.
          </Typography>
        </Alert>

        {/* Set temporary password */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <LockResetIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Set a temporary password</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manually set a password. The user will be required to change it on next login.
          </Typography>

          <Box>
                {hasErrors && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">Fix the errors below before continuing.</Typography>
                  </Alert>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8125rem' }}>
                  Password must be: at least 12 characters, one letter, one number, one special character (! @ # $ % ^ & *)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel text="New Password" />
                    <TextField
                      fullWidth
                      size="small"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      InputProps={eyeAdornment(showNew, () => setShowNew((v) => !v))}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FieldLabel text="Confirm Password" />
                    <TextField
                      fullWidth
                      size="small"
                      type={showReenter ? 'text' : 'password'}
                      value={reenterPassword}
                      onChange={(e) => setReenterPassword(e.target.value)}
                      error={!!errors.reenterPassword}
                      helperText={errors.reenterPassword}
                      InputProps={eyeAdornment(showReenter, () => setShowReenter((v) => !v))}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'error.50',
                    border: '1px solid',
                    borderColor: 'error.light',
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                  }}
                >
                  <Checkbox size="small" checked disabled color="error" sx={{ p: 0 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Require password change on next login
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    (enforced)
                  </Typography>
                </Box>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setSuccess(false)} sx={{ width: '100%' }} icon={<WarningAmberIcon fontSize="inherit" />}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Temporary Password Set
          </Typography>
          <Typography variant="body2">
            {`${userName}'s password has been updated. They will be prompted to change it on next login.`}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
}

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const CURRENT_USER_ID = '1';
  const user = mockUsers.find((u) => u.id === id) ?? mockUsers[0];
  const detail = mockUserDetailsMap[id ?? ''] ?? getDefaultDetail(id ?? '');
  const isCurrentUser = user.id === CURRENT_USER_ID;

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [landingPage, setLandingPage] = useState(detail.defaultLandingPage);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [adminResetOpen, setAdminResetOpen] = useState(false);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const initials = getInitials(user.name);

  return (
    <PageLayout selectedNavItem="settings" backgroundColor="#FAFCFC">
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

        <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Settings sidebar */}
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
                  const isActive = item.id === 'users';
                  return (
                    <Box
                      key={item.id}
                      onClick={() => navigate('/settings')}
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
                        sx={{ fontWeight: isActive ? 600 : 400, color: 'text.primary' }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>

          {/* Main content */}
          <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', p: 3 }}>
            {/* Breadcrumb */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
              <ChevronLeftIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              <Link
                href="#"
                color="primary"
                underline="hover"
                sx={{ fontSize: '0.875rem' }}
                onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
              >
                User Management
              </Link>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                / {user.name}
              </Typography>
            </Box>

            {/* Profile card */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2.5,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Avatar */}
                <MuiAvatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '28px',
                    bgcolor: 'rgba(33,33,33,0.05)',
                    color: 'rgba(33,33,33,0.65)',
                    border: '1px solid rgba(33,33,33,0.1)',
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </MuiAvatar>

                {/* Name + contact */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25 }}>
                    {user.name}
                  </Typography>
                  <Link
                    href={`mailto:${user.email}`}
                    color="primary"
                    underline="hover"
                    sx={{ fontSize: '0.875rem', display: 'block', mb: 0.5 }}
                  >
                    {user.email}
                  </Link>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Mobile: {detail.mobile}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Office: {detail.office}
                  </Typography>
                </Box>

                {/* Role + dept + bio */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    {detail.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {detail.department}
                  </Typography>
                  {detail.bio && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mt: 0.5 }}>
                      {detail.bio}
                    </Typography>
                  )}
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {}}
                  >
                    Edit Profile
                  </Button>
                  <Dropdown
                    trigger={
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        aria-label="More actions"
                        sx={{ minWidth: 0, p: 0, width: '30.75px', height: '30.75px' }}
                      >
                        <MoreVertIcon sx={{ fontSize: 20 }} />
                      </Button>
                    }
                    options={[
                      { value: 'reset-password', label: 'Reset password', icon: <LockResetIcon sx={{ fontSize: 18 }} /> },
                      { value: 'delete-user', label: 'Delete user', icon: <DeleteIcon sx={{ fontSize: 18 }} />, color: 'error' as const },
                      { value: 'deactivate', label: 'Deactivate user', icon: <PersonOffIcon sx={{ fontSize: 18 }} /> },
                    ]}
                    onSelect={(value) => {
                      if (value === 'reset-password') setAdminResetOpen(true);
                    }}
                    hugContents
                    minWidth={200}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Default landing page + Security row — only shown for current user */}
            {isCurrentUser && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap', minWidth: 140 }}>
                  Default Landing Page
                </Typography>
                <Select
                  value={landingPage}
                  onChange={(e) => setLandingPage(e.target.value)}
                  size="small"
                  sx={{ minWidth: 160, fontSize: '0.875rem' }}
                >
                  <MenuItem value="dashboard">Dashboard</MenuItem>
                  <MenuItem value="transfers">Transfers</MenuItem>
                  <MenuItem value="partners">Partners</MenuItem>
                  <MenuItem value="exceptions">Exceptions</MenuItem>
                </Select>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Security
                </Typography>
                <Button variant="outlined" color="primary" size="small" onClick={() => setAdminResetOpen(true)}>
                  Reset Password
                </Button>
              </Box>
            </Box>
            )}

            {/* Groups section */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2.5,
                  pt: 2,
                  pb: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Groups
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8125rem' }}>
                    {user.name.split(' ')[0]} belongs to the following groups. Their access is based on the most permissive permissions across them.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => {}}
                >
                  Add Group
                </Button>
              </Box>

              <Divider />

              {/* Group rows */}
              {detail.groups.map((group, index) => {
                const isExpanded = expandedGroups.has(group.id);
                return (
                  <Box key={group.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2.5,
                        py: 1.5,
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: 'primary.main',
                          fontSize: '0.875rem',
                          flex: 1,
                          minWidth: 0,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                        onClick={() => toggleGroup(group.id)}
                      >
                        {group.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleGroup(group.id)}
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          sx={{
                            width: 28,
                            height: 28,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '6px',
                          }}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                    {isExpanded && <GroupPermissionsContent groupId={group.id} groupName={group.name} />}
                    {index < detail.groups.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
      <AdminResetPasswordModal
        open={adminResetOpen}
        onClose={() => setAdminResetOpen(false)}
        userName={user.name}
        userEmail={user.email}
      />
    </PageLayout>
  );
}

export default UserDetail;
