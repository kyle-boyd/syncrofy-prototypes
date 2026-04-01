import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  InputAdornment,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ImageIcon from '@mui/icons-material/Image';
import PaletteIcon from '@mui/icons-material/Palette';
import LabelIcon from '@mui/icons-material/Label';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentsIcon from '@mui/icons-material/Payments';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Button } from '@design-system';
import { PageLayout } from '../components/PageLayout';

// ─── Palette ────────────────────────────────────────────────────────────────

// Flexoki accent palette — red, orange, yellow, green, cyan, blue, purple, magenta
const PALETTE = ['#D14D41', '#DA702C', '#D0A215', '#879A39', '#3AA99F', '#4385BE', '#8B7EC8', '#CE5D97'];

// ─── Data ──────────────────────────────────────────────────────────────────

const IMAGES = [
  '/exampleimages/cesar-couto-27HiryxnHJk-unsplash.jpg',
  '/exampleimages/codioful-formerly-gradienta-26WixHTutxc-unsplash.jpg',
  '/exampleimages/luke-chesser-pJadQetzTkI-unsplash.jpg',
  '/exampleimages/magicpattern-87PP9Zd7MNo-unsplash.jpg',
  '/exampleimages/magicpattern-8h_tctpq4h0-unsplash.jpg',
  '/exampleimages/milad-fakurian-iFu2HILEng8-unsplash.jpg',
  '/exampleimages/milad-fakurian-nY14Fs8pxT8-unsplash.jpg',
  '/exampleimages/mohammad-alizade-XgeZu2jBaVI-unsplash.jpg',
  '/exampleimages/mymind-XUlsF9LYeVk-unsplash.jpg',
  '/exampleimages/mymind-tZCrFpSNiIQ-unsplash.jpg',
  '/exampleimages/mymind-wHJ5L9KGTl4-unsplash.jpg',
  '/exampleimages/sean-fahrenbruch-Ir2dJmcJpys-unsplash.jpg',
];

const favorites = [
  { id: 1, name: 'Accounts Payable Overview',        lastEdited: 'May 13, 2025', starred: true, color: PALETTE[5], icon: <AccountBalanceIcon />, image: IMAGES[0] },
  { id: 2, name: 'Supplier Compliance Overview',     lastEdited: 'May 13, 2025', starred: true, color: PALETTE[3], icon: <PeopleIcon />,         image: IMAGES[1] },
  { id: 3, name: 'ASN Error Reporting — This Month', lastEdited: 'May 13, 2025', starred: true, color: PALETTE[6], icon: <AssessmentIcon />,     image: IMAGES[2] },
  { id: 4, name: 'Monthly Payment Analysis',         lastEdited: 'May 13, 2025', starred: true, color: PALETTE[7], icon: <PaymentsIcon />,       image: IMAGES[3] },
  { id: 5, name: 'Invoice Reconciliation Process',   lastEdited: 'May 13, 2025', starred: true, color: PALETTE[0], icon: <ReceiptIcon />,        image: IMAGES[4] },
  { id: 6, name: 'Vendor Performance Dashboard',     lastEdited: 'May 13, 2025', starred: true, color: PALETTE[1], icon: <BarChartIcon />,       image: IMAGES[5] },
  { id: 7, name: 'Payment Cycle Times',              lastEdited: 'May 13, 2025', starred: true, color: PALETTE[2], icon: <LocalShippingIcon />,  image: IMAGES[6] },
  { id: 8, name: 'Accounts Receivable Overview',     lastEdited: 'May 13, 2025', starred: true, color: PALETTE[4], icon: <AccountBalanceIcon />, image: IMAGES[0] },
];

const allDashboards = [
  { id: 9,  name: 'Accounts Payable Overview',        lastEdited: 'May 13, 2025', starred: false, color: PALETTE[5], icon: <AccountBalanceIcon />, image: IMAGES[1] },
  { id: 10, name: 'Supplier Compliance Overview',     lastEdited: 'May 13, 2025', starred: false, color: PALETTE[3], icon: <PeopleIcon />,         image: IMAGES[2] },
  { id: 11, name: 'ASN Error Reporting — This Month', lastEdited: 'May 13, 2025', starred: false, color: PALETTE[6], icon: <AssessmentIcon />,     image: IMAGES[3] },
  { id: 12, name: 'Monthly Payment Analysis',         lastEdited: 'May 13, 2025', starred: false, color: PALETTE[7], icon: <PaymentsIcon />,       image: IMAGES[4] },
  { id: 13, name: 'Inbound Shipment Tracker',         lastEdited: 'Apr 28, 2025', starred: false, color: PALETTE[1], icon: <LocalShippingIcon />,  image: IMAGES[5] },
  { id: 14, name: 'Inventory Reconciliation',         lastEdited: 'Apr 21, 2025', starred: false, color: PALETTE[2], icon: <InventoryIcon />,      image: IMAGES[6] },
  { id: 15, name: 'Payment Cycle Times',              lastEdited: 'Apr 15, 2025', starred: false, color: PALETTE[4], icon: <BarChartIcon />,       image: IMAGES[0] },
  { id: 16, name: 'Vendor Scorecard',                 lastEdited: 'Apr 10, 2025', starred: false, color: PALETTE[0], icon: <PeopleIcon />,         image: IMAGES[1] },
];

const templates = [
  {
    id: 1,
    name: 'ASN Error Report – This Month',
    description: 'View and drill down into ASN that have errors by location, description and messaging.',
    image: '/exampleimages/template1.png',
  },
  {
    id: 2,
    name: 'Supplier Compliance Overview',
    description: 'Track supplier performance and compliance metrics across your trading partner network.',
    image: '/exampleimages/template2.png',
  },
  {
    id: 3,
    name: 'Monthly Payment Analysis',
    description: 'Analyze payment trends, cycle times, and exceptions across your accounts payable workflow.',
    image: '/exampleimages/template3.png',
  },
];

// ─── Responsive card grid ───────────────────────────────────────────────────
// Cards are min 200px, max 320px, filling the row with auto-fill.

const CARD_ROW_HEIGHT: Record<string, number> = {
  default:    108,
  colorDot:   108,
  subtleIcon: 108,
  colorIcon:  148,
  image:      220,
};


// ─── Dashboard image preview (Variant 2) ───────────────────────────────────

function DashboardImagePreview({ src }: { src: string }) {
  return (
    <Box sx={{ width: '100%', height: 130, overflow: 'hidden', borderRadius: '6px 6px 0 0', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box
        component="img"
        src={src}
        alt=""
        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </Box>
  );
}

// ─── Card variants ──────────────────────────────────────────────────────────

// Shared card styles — no shadow at rest, lift on hover
const CARD_SX = {
  borderRadius: 2,
  boxShadow: 'none',
  '&:hover': { boxShadow: 3 },
  transition: 'box-shadow 0.2s ease',
} as const;

type DashboardItem = typeof favorites[0];
type CardVariant = 'default' | 'colorDot' | 'subtleIcon' | 'image' | 'colorIcon';

interface CardProps {
  item: DashboardItem;
  starred: boolean;
  onToggleStar: (e: React.MouseEvent) => void;
}

function StarButton({ starred, onToggle, light = false }: { starred: boolean; onToggle: (e: React.MouseEvent) => void; light?: boolean }) {
  return (
    <IconButton
      size="small"
      onClick={onToggle}
      sx={{
        p: 0.25,
        flexShrink: 0,
        color: light
          ? (starred ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)')
          : (starred ? 'secondary.main' : 'text.disabled'),
        '&:hover': { bgcolor: 'transparent' },
      }}
    >
      {starred
        ? <StarIcon sx={{ fontSize: 18 }} />
        : <StarBorderIcon sx={{ fontSize: 18 }} />
      }
    </IconButton>
  );
}

function DefaultCard({ item, starred, onToggleStar }: CardProps) {
  return (
    <Card variant="outlined" sx={{ ...CARD_SX, height: '100%' }}>
      <CardActionArea sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ flex: 1, pr: 1, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </Typography>
          <StarButton starred={starred} onToggle={onToggleStar} />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Last edited: {item.lastEdited}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

function ImageCard({ item, starred, onToggleStar }: CardProps) {
  return (
    <Card variant="outlined" sx={{ ...CARD_SX, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DashboardImagePreview src={item.image} />
      <CardActionArea sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ flex: 1, pr: 1, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </Typography>
          <StarButton starred={starred} onToggle={onToggleStar} />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Last edited: {item.lastEdited}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

function ColorIconCard({ item, starred, onToggleStar }: CardProps) {
  return (
    <Card variant="outlined" sx={{ ...CARD_SX, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ bgcolor: item.color + '18', px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ bgcolor: item.color + '28', borderRadius: 1.5, p: 0.75, display: 'flex', color: item.color }}>
          {item.icon}
        </Box>
        <StarButton starred={starred} onToggle={onToggleStar} />
      </Box>
      <CardActionArea sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.4, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last edited: {item.lastEdited}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

function ColorDotCard({ item, starred, onToggleStar }: CardProps) {
  return (
    <Card variant="outlined" sx={{ ...CARD_SX, height: '100%' }}>
      <CardActionArea sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, pr: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: item.color,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </Typography>
          </Box>
          <StarButton starred={starred} onToggle={onToggleStar} />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ pl: '18px' }}>
          Last edited: {item.lastEdited}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

function SubtleIconCard({ item, starred, onToggleStar }: CardProps) {
  return (
    <Card variant="outlined" sx={{ ...CARD_SX, height: '100%' }}>
      <CardActionArea sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flex: 1, pr: 1 }}>
            <Box
              sx={{
                color: item.color,
                bgcolor: item.color + '18',
                display: 'flex',
                flexShrink: 0,
                borderRadius: 1,
                p: 0.5,
              }}
            >
              {item.icon}
            </Box>
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </Typography>
          </Box>
          <StarButton starred={starred} onToggle={onToggleStar} />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ pl: '36px' }}>
          Last edited: {item.lastEdited}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

function DashboardCard({ item, variant, starred, onToggleStar }: CardProps & { variant: CardVariant }) {
  if (variant === 'colorDot')   return <ColorDotCard  item={item} starred={starred} onToggleStar={onToggleStar} />;
  if (variant === 'subtleIcon') return <SubtleIconCard item={item} starred={starred} onToggleStar={onToggleStar} />;
  if (variant === 'image')      return <ImageCard      item={item} starred={starred} onToggleStar={onToggleStar} />;
  if (variant === 'colorIcon')  return <ColorIconCard  item={item} starred={starred} onToggleStar={onToggleStar} />;
  return <DefaultCard item={item} starred={starred} onToggleStar={onToggleStar} />;
}

// ─── Page ───────────────────────────────────────────────────────────────────

const allItems = [...favorites, ...allDashboards];
const initialStarred = new Set(allItems.filter(i => i.starred).map(i => i.id));

export default function DashboardsHome() {
  const navigate = useNavigate();
  const [cardVariant, setCardVariant] = useState<CardVariant>('colorDot');
  const [showMoreFavorites, setShowMoreFavorites] = useState(false);
  const [starredIds, setStarredIds] = useState<Set<number>>(initialStarred);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleStar = (id: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <PageLayout selectedNavItem="dashboard" contentPadding={0}>
      <Box sx={{ px: 4, py: 4 }}>

        {/* Page header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" fontWeight={700}>Dashboards</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ToggleButtonGroup
              value={cardVariant}
              exclusive
              onChange={(_, val) => val && setCardVariant(val)}
              size="small"
              sx={{ '& .MuiToggleButton-root': { px: 1.5, py: 0.5 } }}
            >
              <Tooltip title="Default">
                <ToggleButton value="default"><ViewModuleIcon fontSize="small" /></ToggleButton>
              </Tooltip>
              <Tooltip title="Color dot">
                <ToggleButton value="colorDot"><FiberManualRecordIcon fontSize="small" /></ToggleButton>
              </Tooltip>
              <Tooltip title="Colored icon">
                <ToggleButton value="subtleIcon"><LabelIcon fontSize="small" /></ToggleButton>
              </Tooltip>
              <Tooltip title="With chart preview">
                <ToggleButton value="image"><ImageIcon fontSize="small" /></ToggleButton>
              </Tooltip>
              <Tooltip title="Color header & icon">
                <ToggleButton value="colorIcon"><PaletteIcon fontSize="small" /></ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
            <Button variant="outlined" color="primary" startIcon={<AddIcon />}>
              New Dashboard
            </Button>
          </Box>
        </Box>

        {/* Search */}
        <TextField
          placeholder="Search"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 320, mb: 4 }}
        />

        {/* Favorites */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>Favorites</Typography>
            <Chip label={favorites.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
          </Box>
          <Box
            ref={gridRef}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gridAutoRows: CARD_ROW_HEIGHT[cardVariant],
              gap: 2,
              overflow: 'hidden',
              maxHeight: showMoreFavorites ? 'none' : CARD_ROW_HEIGHT[cardVariant],
            }}
          >
            {favorites.map(item => (
              <Box key={item.id} onClick={() => navigate(`/dashboards/${encodeURIComponent(item.name)}`)}>
                <DashboardCard item={item} variant={cardVariant} starred={starredIds.has(item.id)} onToggleStar={toggleStar(item.id)} />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="outlined" color="secondary" onClick={() => setShowMoreFavorites(v => !v)}>
              {showMoreFavorites ? 'Show Less' : 'Show More'}
            </Button>
          </Box>
        </Box>

        {/* Templates */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Templates</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 2 }}>
            {templates.map(tmpl => (
              <Card key={tmpl.id} variant="outlined" sx={{ ...CARD_SX, overflow: 'hidden' }}>
                <Box sx={{ width: '100%', height: 160, overflow: 'hidden', borderRadius: '6px 6px 0 0', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box component="img" src={tmpl.image} alt={tmpl.name} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>{tmpl.name}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1.5 }}
                  >
                    {tmpl.description}
                  </Typography>
                  <Button variant="outlined" color="secondary" size="small">Open</Button>
                </Box>
              </Card>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="outlined" color="secondary">See all Templates</Button>
          </Box>
        </Box>

        {/* All Dashboards */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>Dashboards</Typography>
            <Chip label={allDashboards.length} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
          </Box>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gridAutoRows: CARD_ROW_HEIGHT[cardVariant],
            gap: 2,
          }}>
            {allDashboards.map(item => (
              <Box key={item.id} onClick={() => navigate(`/dashboards/${encodeURIComponent(item.name)}`)}>
                <DashboardCard item={item} variant={cardVariant} starred={starredIds.has(item.id)} onToggleStar={toggleStar(item.id)} />
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </PageLayout>
  );
}
