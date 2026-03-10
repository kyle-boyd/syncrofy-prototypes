import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, Typography, Paper, Tooltip } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Modal, Toggle } from '@design-system';
import { PageLayout } from '../components/PageLayout';

// Toggle this to simulate the "no access" scenario
const NO_ACCESS = false;

export default function CompanyMismatch3() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);
  const [noAccess, setNoAccess] = useState(NO_ACCESS);

  return (
    <PageLayout selectedNavItem="dashboard" backgroundColor="#FAFCFC">
      {/* Home page content — visible behind the modal */}
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '20px', letterSpacing: '-0.4px' }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          CoEnterprise — Production
        </Typography>
      </Stack>

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

      {/* Mismatch modal — opens immediately on render */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        showCloseButton
        title="Link not available in your current company"
        maxWidth="sm"
        actions={
          <Stack direction="row" spacing={1.5} justifyContent="space-between" alignItems="center" sx={{ width: '100%', px: 1, pb: 0.5 }}>
            {/* Prototype toggle — left side */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Simulate no access</Typography>
              <Toggle
                checked={noAccess}
                onChange={(e) => setNoAccess(e.target.checked)}
                size="small"
              />
            </Stack>
            <Button variant="outlined" color="secondary" onClick={() => setModalOpen(false)}>
              Dismiss
            </Button>
          </Stack>
        }
      >
        <Stack spacing={2.5}>
          {/* Icon + summary */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ErrorOutlineIcon sx={{ color: 'error.main', fontSize: 22, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'error.main' }}>
              You tried to navigate to a link that is not available in your current company and environment. If this
              link is correct, try switching to that company/environment and follow the link again.
            </Typography>
          </Stack>

          {/* Context rows */}
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* Logged-in row */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'grey.50',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>You are logged into</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>CoEnterprise — Production</Typography>
            </Box>

            {/* Link belongs to row — includes Switch button */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', flexShrink: 0 }}>Link belongs to</Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                {noAccess ? (
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.disabled', fontStyle: 'italic' }}>
                    Hidden for security purposes
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.dark' }}>
                    Acme Corp — Staging
                  </Typography>
                )}
                <Tooltip title={noAccess ? "You don't have access to this company" : ''} placement="top">
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<SwapHorizIcon />}
                      disabled={noAccess}
                    >
                      Switch here
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Modal>
    </PageLayout>
  );
}
