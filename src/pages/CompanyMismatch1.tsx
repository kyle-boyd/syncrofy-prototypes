import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton } from '@design-system';
import { PageLayout } from '../components/PageLayout';

export default function CompanyMismatch1() {
  const navigate = useNavigate();
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <PageLayout selectedNavItem="dashboard" backgroundColor="#FAFCFC">
      {/* Persistent banner — card style with rounded corners and border */}
      {bannerVisible && (
        <Box
          sx={{
            bgcolor: '#E3F4FD',
            border: '1.5px solid',
            borderColor: 'info.main',
            borderRadius: '8px',
            px: 2,
            py: 1.5,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <InfoOutlinedIcon sx={{ color: 'info.main', fontSize: 20, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ flex: 1, color: 'info.dark', lineHeight: 1.5 }}>
            <strong>Link not available in your current company and environment.</strong> You tried to navigate to a link
            that is not available in your current company and environment. If this link is correct, try switching to that
            company/environment and follow the link again.
          </Typography>
          <IconButton
            size="small"
            aria-label="Dismiss"
            onClick={() => setBannerVisible(false)}
            sx={{ color: 'info.dark', flexShrink: 0 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Home page content */}
      <Box>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', letterSpacing: '-0.4px' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            CoEnterprise — Production
          </Typography>
        </Stack>

        {/* Placeholder dashboard cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {['Total Transfers', 'Active Partners', 'Open Exceptions'].map((label, i) => (
            <Paper
              key={label}
              elevation={0}
              sx={{
                flex: 1,
                p: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                {label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                {['1,284', '47', '12'][i]}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Paper
          elevation={0}
          sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px', minHeight: 200 }}
        >
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Recent activity would appear here…
          </Typography>
        </Paper>

        <Box sx={{ mt: 4 }}>
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
