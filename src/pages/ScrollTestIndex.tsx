import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PushPinIcon from '@mui/icons-material/PushPin';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import { Button } from '@design-system';
import { PageLayout } from '../components/PageLayout';

const OPTIONS = [
  {
    number: 1,
    path: '/transfers',
    icon: <PushPinIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Sticky Filter Bar + Sticky Header',
    description:
      'The filter bar freezes at the top of the screen when you scroll. The table header sticks directly beneath it. Both remain visible at all times — no screen space is ever reclaimed.',
    label: 'Current behaviour — Transfers page',
  },
  {
    number: 2,
    path: '/scroll-test/2',
    icon: <UnfoldLessIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Collapsing Floating Filter Bar',
    description:
      'As you scroll down, the filter bar shrinks into a compact "Controls" pill that floats above the table. Hover or click it to expand the full filter panel as an overlay. The table header remains sticky the whole time.',
    label: 'New prototype',
  },
  {
    number: 3,
    path: '/scroll-test/3',
    icon: <ViewSidebarOutlinedIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Slide-In Filter Panel',
    description:
      'No filter bar above the table at all. A "Filters" button lives inside the table toolbar. Clicking it slides open a panel from the right side that overlays the table — filters never consume vertical space. Active filters surface as compact chips in the toolbar.',
    label: 'New prototype',
  },
];

export default function ScrollTestIndex() {
  const navigate = useNavigate();

  return (
    <PageLayout selectedNavItem="transfers" backgroundColor="#FAFCFC">
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', letterSpacing: '-0.4px' }}>
          Transfers — Scroll / Filter UX Prototypes
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Three approaches to maximising table space while keeping filters accessible. Click an option to try it.
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {OPTIONS.map((opt) => (
          <Box
            key={opt.number}
            onClick={() => navigate(opt.path)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px',
              bgcolor: 'background.paper',
              cursor: 'pointer',
              transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
              '&:hover': {
                boxShadow: 3,
                borderColor: 'primary.main',
              },
            }}
          >
            {/* Number badge */}
            <Box
              sx={{
                flexShrink: 0,
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'primary.50',
                border: '2px solid',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '20px', color: 'primary.main' }}>
                {opt.number}
              </Typography>
            </Box>

            {/* Icon */}
            <Box sx={{ flexShrink: 0 }}>{opt.icon}</Box>

            {/* Text */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {opt.title}
                </Typography>
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '4px',
                    bgcolor: opt.number === 1 ? 'grey.100' : 'primary.50',
                    border: '1px solid',
                    borderColor: opt.number === 1 ? 'divider' : 'primary.200',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 500, color: opt.number === 1 ? 'text.secondary' : 'primary.main' }}
                  >
                    {opt.label}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {opt.description}
              </Typography>
            </Box>

            {/* Arrow */}
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ textTransform: 'none', flexShrink: 0 }}
            >
              Open
            </Button>
          </Box>
        ))}
      </Stack>
    </PageLayout>
  );
}
