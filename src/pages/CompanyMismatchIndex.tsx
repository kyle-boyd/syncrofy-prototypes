import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Button } from '@design-system';
import { PageLayout } from '../components/PageLayout';

const OPTIONS = [
  {
    number: 1,
    path: '/company-mismatch/1',
    icon: <NotificationsActiveOutlinedIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Persistent Top Banner + Redirect to Home',
    description:
      'Redirect the user to the home/dashboard page and show a full-width dismissible banner at the top of the screen. The banner stays until the user clicks X, explaining that the link they followed belongs to a different company or environment.',
    label: 'Option 1',
  },
  {
    number: 2,
    path: '/company-mismatch/2',
    icon: <ErrorOutlineIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Static Error Page',
    description:
      'Route the user to a dedicated error page (not their home page). A purposeful, clear layout with a heading, mismatch explanation, and guidance on what to do next — more room for context without feeling like something is broken.',
    label: 'Option 2',
  },
  {
    number: 3,
    path: '/company-mismatch/3',
    icon: <ChatBubbleOutlineIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    title: 'Modal on Home Page',
    description:
      'Redirect the user to their home page and immediately open a dialog over it explaining the mismatch. Includes an X to dismiss and an optional "Switch Company" CTA. Once dismissed the user lands normally on their home page.',
    label: 'Option 3',
  },
];

export default function CompanyMismatchIndex() {
  const navigate = useNavigate();

  return (
    <PageLayout selectedNavItem="dashboard" backgroundColor="#FAFCFC">
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', letterSpacing: '-0.4px' }}>
          Company / Environment Mismatch — Error Handling Prototypes
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Three approaches to handling a URL that references a company or environment the current user isn't logged into.
          Click an option to try it.
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
                    bgcolor: 'primary.50',
                    border: '1px solid',
                    borderColor: 'primary.200',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 500, color: 'primary.main' }}>
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
