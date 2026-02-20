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
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
} from '@kyleboyd/design-system';
import AddIcon from '@mui/icons-material/Add';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { ButtonGroup } from '@kyleboyd/design-system';
import { Dropdown } from '@kyleboyd/design-system';
import { ListItem } from '@kyleboyd/design-system';
import { SegmentedControl } from '@kyleboyd/design-system';
import { SnackBar } from '@kyleboyd/design-system';
import { Stepper } from '@kyleboyd/design-system';
import { Tabs } from '@kyleboyd/design-system';
import { Typeahead } from '@kyleboyd/design-system';
import { Accordion } from '@kyleboyd/design-system';
import { Modal } from '@kyleboyd/design-system';
import { PageHeader } from '@kyleboyd/design-system';
import { Table } from '@kyleboyd/design-system';
import type { TableColumn } from '@kyleboyd/design-system';
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
  children,
}: {
  id: string;
  title: string;
  description: string;
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
  const [typeaheadOption, setTypeaheadOption] = useState<{ value: string; label: string } | null>(null);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('opt1');
  const [toggleChecked, setToggleChecked] = useState(false);

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
    { id: 'name', label: 'Name', render: (row) => row.name },
    { id: 'status', label: 'Status', render: (row) => row.status },
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

  const renderStory = () => {
    switch (selectedId) {
      case 'avatar':
        return (
          <ComponentStory id="avatar" title="Avatar" description="User or entity avatar.">
            <Avatar alt="User" />
            <Avatar alt="AB">AB</Avatar>
            <Avatar alt="Icon" sx={{ bgcolor: 'primary.main' }}>
              <WhatshotIcon />
            </Avatar>
          </ComponentStory>
        );
      case 'badge':
        return (
          <ComponentStory id="badge" title="Badge" description="Badge for counts or status.">
            <Badge badgeContent={4} color="primary">
              <Button variant="contained">Notifications</Button>
            </Badge>
            <Badge badgeContent={99} color="error">
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
          <ComponentStory id="button" title="Button" description="Primary actions.">
            <Button variant="contained" color="primary">Primary</Button>
            <Button variant="outlined" color="primary">Outlined</Button>
            <Button variant="text" color="primary">Text</Button>
            <Button variant="contained" disabled>Disabled</Button>
          </ComponentStory>
        );
      case 'checkbox':
        return (
          <ComponentStory id="checkbox" title="Checkbox" description="Boolean form control.">
            <Checkbox checked={checkboxChecked} onChange={(e) => setCheckboxChecked((e.target as HTMLInputElement).checked)} />
            <Typography component="span" sx={{ ml: 1 }}>Option</Typography>
          </ComponentStory>
        );
      case 'chips':
        return (
          <ComponentStory id="chips" title="Chips" description="Compact labels or filters.">
            <Chips label="Chip" />
            <Chips label="Deletable" onDelete={() => {}} />
            <Chips label="Primary" color="primary" />
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
          <ComponentStory id="icon-button" title="Icon Button" description="Icon-only button.">
            <DSIconButton size="small" aria-label="add"><AddIcon /></DSIconButton>
            <DSIconButton aria-label="add"><AddIcon /></DSIconButton>
            <DSIconButton size="large" aria-label="add"><AddIcon /></DSIconButton>
          </ComponentStory>
        );
      case 'input':
        return (
          <ComponentStory id="input" title="Input" description="Text input field.">
            <Input label="Label" placeholder="Placeholder" value="" onChange={() => {}} />
            <Input label="Required" required />
            <Input label="Disabled" disabled value="Disabled" />
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
          <ComponentStory id="radio" title="Radio" description="Single choice from options.">
            <Radio checked={radioValue === 'opt1'} onChange={() => setRadioValue('opt1')} value="opt1" /> Option 1
            <Radio checked={radioValue === 'opt2'} onChange={() => setRadioValue('opt2')} value="opt2" /> Option 2
          </ComponentStory>
        );
      case 'search':
        return (
          <ComponentStory id="search" title="Search" description="Search input.">
            <Search placeholder="Search..." />
          </ComponentStory>
        );
      case 'spinner':
        return (
          <ComponentStory id="spinner" title="Spinner" description="Loading indicator.">
            <Spinner size={24} />
            <Spinner size={40} />
          </ComponentStory>
        );
      case 'tag':
        return (
          <ComponentStory id="tag" title="Tag" description="Status or category tag.">
            <Tag label="Primary" variant="primary" />
            <Tag label="Success" variant="success" />
            <Tag label="Error" variant="error" />
            <Tag label="Neutral" variant="neutral" />
          </ComponentStory>
        );
      case 'toggle':
        return (
          <ComponentStory id="toggle" title="Toggle" description="Switch control.">
            <Toggle checked={toggleChecked} onChange={(e) => setToggleChecked((e.target as HTMLInputElement).checked)} />
          </ComponentStory>
        );
      case 'toggle-button':
        return (
          <ComponentStory id="toggle-button" title="Toggle Button" description="Button that toggles state.">
            <ToggleButton selected>Selected</ToggleButton>
            <ToggleButton>Unselected</ToggleButton>
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
          <ComponentStory id="dropdown" title="Dropdown" description="Menu of options.">
            <Dropdown
              trigger={<Button variant="outlined">Open menu</Button>}
              options={[
                { value: '1', label: 'Option 1' },
                { value: '2', label: 'Option 2' },
              ]}
              onSelect={() => {}}
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
          <ComponentStory id="typeahead" title="Typeahead" description="Autocomplete input.">
            <Typeahead
              placeholder="Type to search..."
              options={typeaheadOptions}
              value={typeaheadOption}
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
