import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import {
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  Chips,
  Divider,
  IconButton as DSIconButton,
  Input,
  Link,
  Logo,
  Pagination,
  PasswordInput,
  Radio,
  Search,
  Spinner,
  Tag,
  Toggle,
  ToggleButton,
  Tooltip,
} from '@design-system';
import AddIcon from '@mui/icons-material/Add';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { ButtonGroup } from '@design-system';
import { Dropdown } from '@design-system';
import { ListItem } from '@design-system';
import { SegmentedControl } from '@design-system';
import { SnackBar } from '@design-system';
import { Stepper } from '@design-system';
import { Tabs } from '@design-system';
import { Typeahead } from '@design-system';
import { Accordion } from '@design-system';
import { Modal } from '@design-system';
import { PageHeader } from '@design-system';
import { Table, TextCell } from '@design-system';
import type { TableColumn } from '@design-system';
import MuiLink from '@mui/material/Link';

const DRAWER_WIDTH = 280;

const SIDEBAR_SECTIONS: { id: string; label: string; items: { id: string; label: string }[] }[] = [
  {
    id: 'atoms',
    label: 'Atoms',
    items: [
      { id: 'avatar', label: 'Avatar' },
      { id: 'badge', label: 'Badge' },
      { id: 'breadcrumbs', label: 'Breadcrumbs' },
      { id: 'button', label: 'Button' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'chips', label: 'Chips' },
      { id: 'divider', label: 'Divider' },
      { id: 'icon-button', label: 'Icon Button' },
      { id: 'input', label: 'Input' },
      { id: 'link', label: 'Link' },
      { id: 'logo', label: 'Logo' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'password-input', label: 'Password Input' },
      { id: 'radio', label: 'Radio' },
      { id: 'search', label: 'Search' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'tag', label: 'Tag' },
      { id: 'toggle', label: 'Toggle' },
      { id: 'toggle-button', label: 'Toggle Button' },
      { id: 'tooltip', label: 'Tooltip' },
    ],
  },
  {
    id: 'molecules',
    label: 'Molecules',
    items: [
      { id: 'button-group', label: 'Button Group' },
      { id: 'dropdown', label: 'Dropdown' },
      { id: 'list-item', label: 'List Item' },
      { id: 'segmented-control', label: 'Segmented Control' },
      { id: 'snackbar', label: 'SnackBar' },
      { id: 'stepper', label: 'Stepper' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'typeahead', label: 'Typeahead' },
    ],
  },
  {
    id: 'organisms',
    label: 'Organisms',
    items: [
      { id: 'accordion', label: 'Accordion' },
      { id: 'modal', label: 'Modal' },
      { id: 'page-header', label: 'Page Header' },
      { id: 'table', label: 'Table' },
    ],
  },
];

type ControlDef =
  | { type: 'select'; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }
  | { type: 'toggle'; label: string; value: boolean; onChange: (v: boolean) => void };

function ControlBar({ controls }: { controls: ControlDef[] }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        p: 2,
        mb: 2,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ mr: 1, lineHeight: 1 }}>
        Controls
      </Typography>
      {controls.map((ctrl, i) =>
        ctrl.type === 'select' ? (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {ctrl.label}
            </Typography>
            <Select
              size="small"
              value={ctrl.value}
              onChange={(e) => ctrl.onChange(e.target.value)}
              sx={{ fontSize: 13, minWidth: 110 }}
            >
              {ctrl.options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        ) : (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {ctrl.label}
            </Typography>
            <Toggle
              size="small"
              checked={ctrl.value}
              onChange={(e) => ctrl.onChange((e.target as HTMLInputElement).checked)}
            />
          </Box>
        )
      )}
    </Box>
  );
}

function GalleryPreview({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.default',
        borderColor: 'divider',
      }}
    >
      {title && (
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          {title}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>{children}</Box>
    </Paper>
  );
}

function ComponentStory({
  id,
  title,
  description,
  controls,
  children,
}: {
  id: string;
  title: string;
  description: string;
  controls?: ControlDef[];
  children: React.ReactNode;
}) {
  return (
    <Box id={id} sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      {controls && controls.length > 0 && <ControlBar controls={controls} />}
      <GalleryPreview>{children}</GalleryPreview>
    </Box>
  );
}

export default function ComponentGallery() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<string | number>('1');
  const [accordionExpanded, setAccordionExpanded] = useState<string | string[]>('panel1');
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [typeaheadOption, setTypeaheadOption] = useState<{ value: string | number; label: string } | null>(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('opt1');
  const [toggleChecked, setToggleChecked] = useState(false);

  // Button controls
  const [buttonVariant, setButtonVariant] = useState<'contained' | 'outlined' | 'text'>('contained');
  const [buttonColor, setButtonColor] = useState<'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'>('primary');
  const [buttonSize, setButtonSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Toggle controls
  const [toggleSize, setToggleSize] = useState<'small' | 'medium'>('medium');
  const [toggleColor, setToggleColor] = useState<'primary' | 'secondary' | 'default' | 'error' | 'warning' | 'success' | 'info'>('primary');
  const [toggleDisabled, setToggleDisabled] = useState(false);

  // Dropdown controls
  const [dropdownHugContents, setDropdownHugContents] = useState(false);
  const [dropdownWithIcons, setDropdownWithIcons] = useState(false);
  const [dropdownWithSecondary, setDropdownWithSecondary] = useState(false);
  const [dropdownWithDisabled, setDropdownWithDisabled] = useState(false);
  const [dropdownSelected, setDropdownSelected] = useState<string | number | undefined>(undefined);

  // Input controls
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputRequired, setInputRequired] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [inputSize, setInputSize] = useState<'small' | 'medium'>('medium');

  // Avatar controls
  const [avatarSize, setAvatarSize] = useState<'40px' | '32px' | '24px' | '18px'>('40px');

  // Badge controls
  const [badgeColor, setBadgeColor] = useState<'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default'>('primary');

  // Spinner controls
  const [spinnerSize, setSpinnerSize] = useState<'24' | '32' | '40' | '48'>('24');

  // Tag controls
  const [tagVariant, setTagVariant] = useState<'primary' | 'success' | 'error' | 'neutral' | 'warning' | 'info'>('primary');

  // Chips controls
  const [chipsDisabled, setChipsDisabled] = useState(false);
  const [chipsDeletable, setChipsDeletable] = useState(false);

  // Icon button controls
  const [iconButtonSize, setIconButtonSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [iconButtonDisabled, setIconButtonDisabled] = useState(false);

  // Checkbox controls
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);

  // Radio controls
  const [radioDisabled, setRadioDisabled] = useState(false);

  // Search controls
  const [searchDisabled, setSearchDisabled] = useState(false);

  // Toggle button controls
  const [toggleButtonDisabled, setToggleButtonDisabled] = useState(false);

  // Typeahead controls
  const [typeaheadDisabled, setTypeaheadDisabled] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (isMobile) setDrawerOpen(false);
  };

  const sidebar = (
    <Box sx={{ width: DRAWER_WIDTH, pt: 2, pb: 2 }}>
      <List dense>
        {SIDEBAR_SECTIONS.map((section) => (
          <Box key={section.id}>
            <Typography variant="overline" color="text.secondary" sx={{ px: 2, py: 0.5 }}>
              {section.label}
            </Typography>
            {section.items.map((item) => (
              <ListItemButton
                key={item.id}
                selected={selectedId === item.id}
                onClick={() => handleSelect(item.id)}
                sx={{ py: 0.5 }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItemButton>
            ))}
          </Box>
        ))}
      </List>
    </Box>
  );

  const tableColumns: TableColumn<{ name: string; status: string }>[] = [
    { id: 'name', label: 'Name', render: (row) => <TextCell value={row.name} /> },
    { id: 'status', label: 'Status', render: (row) => <TextCell value={row.status} /> },
  ];
  const tableRows = [
    { name: 'Item One', status: 'Active' },
    { name: 'Item Two', status: 'Pending' },
  ];

  const typeaheadOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'apricot', label: 'Apricot' },
    { value: 'banana', label: 'Banana' },
  ];

  const dropdownBaseOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  const dropdownOptions = dropdownBaseOptions.map((opt, i) => ({
    ...opt,
    ...(dropdownWithIcons ? { icon: i === 0 ? <DashboardIcon /> : i === 1 ? <SettingsIcon /> : <PersonIcon /> } : {}),
    ...(dropdownWithSecondary ? { secondary: `Description for ${opt.label}` } : {}),
    ...(dropdownWithDisabled && i === 1 ? { disabled: true } : {}),
  }));

  const renderStory = () => {
    switch (selectedId) {
      case 'avatar':
        return (
          <ComponentStory
            id="avatar"
            title="Avatar"
            description="User or entity avatar."
            controls={[
              {
                type: 'select',
                label: 'Size',
                value: avatarSize,
                onChange: (v) => setAvatarSize(v as typeof avatarSize),
                options: [
                  { value: '40px', label: '40px' },
                  { value: '32px', label: '32px' },
                  { value: '24px', label: '24px' },
                  { value: '18px', label: '18px' },
                ],
              },
            ]}
          >
            <Avatar alt="User" size={avatarSize} />
            <Avatar alt="AB" size={avatarSize}>AB</Avatar>
            <Avatar alt="Icon" size={avatarSize} sx={{ bgcolor: 'primary.main' }}>
              <WhatshotIcon />
            </Avatar>
          </ComponentStory>
        );
      case 'badge':
        return (
          <ComponentStory
            id="badge"
            title="Badge"
            description="Badge for counts or status."
            controls={[
              {
                type: 'select',
                label: 'Color',
                value: badgeColor,
                onChange: (v) => setBadgeColor(v as typeof badgeColor),
                options: [
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'error', label: 'Error' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'info', label: 'Info' },
                  { value: 'success', label: 'Success' },
                ],
              },
            ]}
          >
            <Badge badgeContent={4} color={badgeColor}>
              <Button variant="contained">Notifications</Button>
            </Badge>
            <Badge badgeContent={99} color={badgeColor}>
              <Button variant="outlined">Messages</Button>
            </Badge>
          </ComponentStory>
        );
      case 'breadcrumbs':
        return (
          <ComponentStory id="breadcrumbs" title="Breadcrumbs" description="Navigation hierarchy.">
            <Breadcrumbs>
              <MuiLink href="#" color="inherit" underline="hover">
                Home
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover">
                Catalog
              </MuiLink>
              <Typography color="text.primary">Product</Typography>
            </Breadcrumbs>
          </ComponentStory>
        );
      case 'button':
        return (
          <ComponentStory
            id="button"
            title="Button"
            description="Primary actions."
            controls={[
              {
                type: 'select',
                label: 'Variant',
                value: buttonVariant,
                onChange: (v) => setButtonVariant(v as typeof buttonVariant),
                options: [
                  { value: 'contained', label: 'Contained' },
                  { value: 'outlined', label: 'Outlined' },
                  { value: 'text', label: 'Text' },
                ],
              },
              {
                type: 'select',
                label: 'Color',
                value: buttonColor,
                onChange: (v) => setButtonColor(v as typeof buttonColor),
                options: [
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'error', label: 'Error' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'info', label: 'Info' },
                  { value: 'success', label: 'Success' },
                ],
              },
              {
                type: 'select',
                label: 'Size',
                value: buttonSize,
                onChange: (v) => setButtonSize(v as typeof buttonSize),
                options: [
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ],
              },
              { type: 'toggle', label: 'Disabled', value: buttonDisabled, onChange: setButtonDisabled },
            ]}
          >
            <Button variant={buttonVariant} color={buttonColor} size={buttonSize} disabled={buttonDisabled}>
              Button
            </Button>
            <Button variant={buttonVariant} color={buttonColor} size={buttonSize} disabled={buttonDisabled} startIcon={<AddIcon />}>
              With Icon
            </Button>
          </ComponentStory>
        );
      case 'checkbox':
        return (
          <ComponentStory
            id="checkbox"
            title="Checkbox"
            description="Boolean form control."
            controls={[
              { type: 'toggle', label: 'Disabled', value: checkboxDisabled, onChange: setCheckboxDisabled },
            ]}
          >
            <Checkbox
              checked={checkboxChecked}
              disabled={checkboxDisabled}
              onChange={(e) => setCheckboxChecked((e.target as HTMLInputElement).checked)}
            />
            <Typography component="span" sx={{ ml: 1 }}>Option</Typography>
          </ComponentStory>
        );
      case 'chips':
        return (
          <ComponentStory
            id="chips"
            title="Chips"
            description="Compact labels or filters."
            controls={[
              { type: 'toggle', label: 'Disabled', value: chipsDisabled, onChange: setChipsDisabled },
              { type: 'toggle', label: 'Deletable', value: chipsDeletable, onChange: setChipsDeletable },
            ]}
          >
            <Chips label="Default" disabled={chipsDisabled} onDelete={chipsDeletable ? () => {} : undefined} />
            <Chips label="Primary" color="primary" disabled={chipsDisabled} onDelete={chipsDeletable ? () => {} : undefined} />
          </ComponentStory>
        );
      case 'divider':
        return (
          <ComponentStory id="divider" title="Divider" description="Visual separator.">
            <Box sx={{ width: '100%' }}>
              <Typography>Above</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>Below</Typography>
            </Box>
          </ComponentStory>
        );
      case 'icon-button':
        return (
          <ComponentStory
            id="icon-button"
            title="Icon Button"
            description="Icon-only button."
            controls={[
              {
                type: 'select',
                label: 'Size',
                value: iconButtonSize,
                onChange: (v) => setIconButtonSize(v as typeof iconButtonSize),
                options: [
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ],
              },
              { type: 'toggle', label: 'Disabled', value: iconButtonDisabled, onChange: setIconButtonDisabled },
            ]}
          >
            <DSIconButton size={iconButtonSize} disabled={iconButtonDisabled} aria-label="add">
              <AddIcon />
            </DSIconButton>
          </ComponentStory>
        );
      case 'input':
        return (
          <ComponentStory
            id="input"
            title="Input"
            description="Text input field."
            controls={[
              {
                type: 'select',
                label: 'Size',
                value: inputSize,
                onChange: (v) => setInputSize(v as typeof inputSize),
                options: [
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                ],
              },
              { type: 'toggle', label: 'Disabled', value: inputDisabled, onChange: setInputDisabled },
              { type: 'toggle', label: 'Required', value: inputRequired, onChange: setInputRequired },
              { type: 'toggle', label: 'Error', value: inputError, onChange: setInputError },
            ]}
          >
            <Input
              label="Label"
              placeholder="Placeholder"
              size={inputSize}
              disabled={inputDisabled}
              required={inputRequired}
              error={inputError}
              helperText={inputError ? 'This field has an error' : undefined}
            />
          </ComponentStory>
        );
      case 'link':
        return (
          <ComponentStory id="link" title="Link" description="Navigation link.">
            <Link href="#">Link</Link>
            <Link href="#" variant="body2">Secondary link</Link>
          </ComponentStory>
        );
      case 'logo':
        return (
          <ComponentStory id="logo" title="Logo" description="Brand logo.">
            <Logo />
          </ComponentStory>
        );
      case 'pagination':
        return (
          <ComponentStory id="pagination" title="Pagination" description="Page navigation.">
            <Pagination page={page} count={10} onChange={(_, p) => setPage(p)} />
          </ComponentStory>
        );
      case 'password-input':
        return (
          <ComponentStory id="password-input" title="Password Input" description="Password field with visibility toggle.">
            <PasswordInput label="Password" placeholder="Enter password" />
          </ComponentStory>
        );
      case 'radio':
        return (
          <ComponentStory
            id="radio"
            title="Radio"
            description="Single choice from options."
            controls={[
              { type: 'toggle', label: 'Disabled', value: radioDisabled, onChange: setRadioDisabled },
            ]}
          >
            <Radio checked={radioValue === 'opt1'} onChange={() => setRadioValue('opt1')} value="opt1" disabled={radioDisabled} /> Option 1
            <Radio checked={radioValue === 'opt2'} onChange={() => setRadioValue('opt2')} value="opt2" disabled={radioDisabled} /> Option 2
          </ComponentStory>
        );
      case 'search':
        return (
          <ComponentStory
            id="search"
            title="Search"
            description="Search input."
            controls={[
              { type: 'toggle', label: 'Disabled', value: searchDisabled, onChange: setSearchDisabled },
            ]}
          >
            <Search placeholder="Search..." disabled={searchDisabled} />
          </ComponentStory>
        );
      case 'spinner':
        return (
          <ComponentStory
            id="spinner"
            title="Spinner"
            description="Loading indicator."
            controls={[
              {
                type: 'select',
                label: 'Size',
                value: spinnerSize,
                onChange: (v) => setSpinnerSize(v as typeof spinnerSize),
                options: [
                  { value: '24', label: '24px' },
                  { value: '32', label: '32px' },
                  { value: '40', label: '40px' },
                  { value: '48', label: '48px' },
                ],
              },
            ]}
          >
            <Spinner size={Number(spinnerSize)} />
          </ComponentStory>
        );
      case 'tag':
        return (
          <ComponentStory
            id="tag"
            title="Tag"
            description="Status or category tag."
            controls={[
              {
                type: 'select',
                label: 'Variant',
                value: tagVariant,
                onChange: (v) => setTagVariant(v as typeof tagVariant),
                options: [
                  { value: 'primary', label: 'Primary' },
                  { value: 'success', label: 'Success' },
                  { value: 'error', label: 'Error' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'info', label: 'Info' },
                  { value: 'neutral', label: 'Neutral' },
                ],
              },
            ]}
          >
            <Tag label="Tag" variant={tagVariant} />
          </ComponentStory>
        );
      case 'toggle':
        return (
          <ComponentStory
            id="toggle"
            title="Toggle"
            description="Switch control."
            controls={[
              {
                type: 'select',
                label: 'Size',
                value: toggleSize,
                onChange: (v) => setToggleSize(v as typeof toggleSize),
                options: [
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                ],
              },
              {
                type: 'select',
                label: 'Color',
                value: toggleColor,
                onChange: (v) => setToggleColor(v as typeof toggleColor),
                options: [
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'default', label: 'Default' },
                  { value: 'error', label: 'Error' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'success', label: 'Success' },
                  { value: 'info', label: 'Info' },
                ],
              },
              { type: 'toggle', label: 'Disabled', value: toggleDisabled, onChange: setToggleDisabled },
            ]}
          >
            <Toggle
              checked={toggleChecked}
              size={toggleSize}
              color={toggleColor}
              disabled={toggleDisabled}
              onChange={(e) => setToggleChecked((e.target as HTMLInputElement).checked)}
            />
            <Typography variant="body2" color="text.secondary">
              {toggleChecked ? 'On' : 'Off'}
            </Typography>
          </ComponentStory>
        );
      case 'toggle-button':
        return (
          <ComponentStory
            id="toggle-button"
            title="Toggle Button"
            description="Button that toggles state."
            controls={[
              { type: 'toggle', label: 'Disabled', value: toggleButtonDisabled, onChange: setToggleButtonDisabled },
            ]}
          >
            <ToggleButton value="selected" selected disabled={toggleButtonDisabled}>Selected</ToggleButton>
            <ToggleButton value="unselected" disabled={toggleButtonDisabled}>Unselected</ToggleButton>
          </ComponentStory>
        );
      case 'tooltip':
        return (
          <ComponentStory id="tooltip" title="Tooltip" description="Context on hover.">
            <Tooltip title="Tooltip text">
              <Button variant="outlined">Hover me</Button>
            </Tooltip>
          </ComponentStory>
        );
      case 'button-group':
        return (
          <ComponentStory id="button-group" title="Button Group" description="Grouped buttons.">
            <ButtonGroup variant="outlined" color="primary">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </ComponentStory>
        );
      case 'dropdown':
        return (
          <ComponentStory
            id="dropdown"
            title="Dropdown"
            description="Menu of options."
            controls={[
              { type: 'toggle', label: 'Hug Contents', value: dropdownHugContents, onChange: setDropdownHugContents },
              { type: 'toggle', label: 'Icons', value: dropdownWithIcons, onChange: setDropdownWithIcons },
              { type: 'toggle', label: 'Secondary Text', value: dropdownWithSecondary, onChange: setDropdownWithSecondary },
              { type: 'toggle', label: 'Disabled Item', value: dropdownWithDisabled, onChange: setDropdownWithDisabled },
            ]}
          >
            <Dropdown
              trigger={<Button variant="outlined">Open menu</Button>}
              options={dropdownOptions}
              value={dropdownSelected}
              hugContents={dropdownHugContents}
              onSelect={(v) => setDropdownSelected(v)}
            />
          </ComponentStory>
        );
      case 'list-item':
        return (
          <ComponentStory id="list-item" title="List Item" description="Row in a list.">
            <Box sx={{ width: 320 }}>
              <ListItem primary="List item" />
              <ListItem primary="With secondary" secondary="Secondary text" />
            </Box>
          </ComponentStory>
        );
      case 'segmented-control':
        return (
          <ComponentStory id="segmented-control" title="Segmented Control" description="Select one of several options.">
            <SegmentedControl
              items={[
                { id: 'a', text: 'Option A' },
                { id: 'b', text: 'Option B' },
                { id: 'c', text: 'Option C' },
              ]}
              defaultSelectedId="a"
              onChange={() => {}}
            />
          </ComponentStory>
        );
      case 'snackbar':
        return (
          <ComponentStory id="snackbar" title="SnackBar" description="Temporary message.">
            <Button variant="contained" onClick={() => setSnackbarOpen(true)}>Show SnackBar</Button>
            <SnackBar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message="SnackBar message" />
          </ComponentStory>
        );
      case 'stepper':
        return (
          <ComponentStory id="stepper" title="Stepper" description="Multi-step progress.">
            <Stepper
              steps={[
                { label: 'Step 1', description: 'First step' },
                { label: 'Step 2', description: 'Second step' },
                { label: 'Step 3', description: 'Third step' },
              ]}
              activeStep={1}
              showDescription
            />
          </ComponentStory>
        );
      case 'tabs':
        return (
          <ComponentStory id="tabs" title="Tabs" description="Tabbed content.">
            <Box sx={{ width: '100%' }}>
              <Tabs
                tabs={[
                  { label: 'Tab 1', value: '1', content: <Typography>Content 1</Typography> },
                  { label: 'Tab 2', value: '2', content: <Typography>Content 2</Typography> },
                ]}
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                showPanels
              />
            </Box>
          </ComponentStory>
        );
      case 'typeahead':
        return (
          <ComponentStory
            id="typeahead"
            title="Typeahead"
            description="Autocomplete input."
            controls={[
              { type: 'toggle', label: 'Disabled', value: typeaheadDisabled, onChange: setTypeaheadDisabled },
            ]}
          >
            <Typeahead
              placeholder="Type to search..."
              options={typeaheadOptions}
              value={typeaheadOption}
              disabled={typeaheadDisabled}
              onChange={(_, opt) => setTypeaheadOption(opt)}
            />
          </ComponentStory>
        );
      case 'accordion':
        return (
          <ComponentStory id="accordion" title="Accordion" description="Collapsible sections.">
            <Box sx={{ width: '100%', maxWidth: 400 }}>
              <Accordion
                items={[
                  { id: 'panel1', title: 'Section 1', content: <Typography>Content for section 1.</Typography> },
                  { id: 'panel2', title: 'Section 2', content: <Typography>Content for section 2.</Typography> },
                ]}
                expanded={accordionExpanded}
                onChange={(exp) => setAccordionExpanded(exp)}
                exclusive
              />
            </Box>
          </ComponentStory>
        );
      case 'modal':
        return (
          <ComponentStory id="modal" title="Modal" description="Dialog overlay.">
            <Button variant="contained" onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Modal title"
              actions={<Button variant="contained" onClick={() => setModalOpen(false)}>Close</Button>}
            >
              <Typography>Modal body content.</Typography>
            </Modal>
          </ComponentStory>
        );
      case 'page-header':
        return (
          <ComponentStory id="page-header" title="Page Header" description="Page title and actions.">
            <Box sx={{ width: '100%' }}>
              <PageHeader
                title="Page Title"
                showBreadcrumb
                breadcrumbLabel="Back"
                onBreadcrumbClick={() => {}}
                refreshStatus="Last updated 2 min ago"
                onRefreshClick={() => {}}
              />
            </Box>
          </ComponentStory>
        );
      case 'table':
        return (
          <ComponentStory id="table" title="Table" description="Data table.">
            <Box sx={{ width: '100%', minWidth: 300 }}>
              <Table columns={tableColumns} rows={tableRows} />
            </Box>
          </ComponentStory>
        );
      default:
        return (
          <Box sx={{ py: 4 }}>
            <Typography color="text.secondary">
              Select a component from the sidebar to view its preview.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar - desktop */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 1,
            borderColor: 'divider',
            mt: { xs: 0, md: 0 },
          },
        }}
      >
        {sidebar}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </IconButton>
          )}
          <DSIconButton onClick={() => navigate('/')} aria-label="Back to home" size="small">
            <ArrowBackIcon />
          </DSIconButton>
          <Typography variant="h6" component="h1">
            Component Gallery
          </Typography>
        </Paper>

        <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
          {renderStory()}
        </Container>
      </Box>
    </Box>
  );
}
