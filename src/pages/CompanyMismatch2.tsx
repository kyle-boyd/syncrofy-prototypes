import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Divider } from '@mui/material';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Button } from '@design-system';
import { PageLayout } from '../components/PageLayout';

export default function CompanyMismatch2() {
  const navigate = useNavigate();

  return (
    <PageLayout selectedNavItem="dashboard" backgroundColor="#FAFCFC">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          px: 2,
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: 'error.50',
            border: '2px solid',
            borderColor: 'error.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <LinkOffIcon sx={{ fontSize: 36, color: 'error.main' }} />
        </Box>

        {/* Heading */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, letterSpacing: '-0.3px' }}>
          This link isn't available in your current company
        </Typography>

        {/* Sub-heading */}
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', maxWidth: 520, mb: 4, lineHeight: 1.6 }}
        >
          The link you followed references a different company or environment than the one you're currently logged into.
          You can switch to the correct context and try again, or go back to your home page.
        </Typography>

        {/* Context detail card */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '12px',
            bgcolor: 'background.paper',
            overflow: 'hidden',
            mb: 4,
            textAlign: 'left',
          }}
        >
          <Box sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600 }}>
              Details
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={0}>
            <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>You are logged into</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>CoEnterprise — Production</Typography>
            </Box>
            <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Link belongs to</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.dark' }}>Acme Corp — Staging</Typography>
            </Box>
          </Stack>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SwapHorizIcon />}
          >
            Switch Company / Environment
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<HomeOutlinedIcon />}
            onClick={() => navigate('/')}
          >
            Go to my Home page
          </Button>
        </Stack>

        <Box sx={{ mt: 5 }}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/company-mismatch')}
          >
            Back to options
          </Button>
        </Box>
      </Box>
    </PageLayout>
  );
}
