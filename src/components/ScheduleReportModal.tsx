import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Modal, Button, Input } from '@design-system';

interface ScheduleReportModalProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_VIEWS = [
  '1234 Partners Transfer View',
  'Acme Corporation - Exceptions',
  'Active_Tab_View',
  'JL - Anderson and Sons Inbound',
  "Andrew's Family Trust - Exceptions",
  'Last3Days',
  'BetaNXT - Failed',
  'COETestUser_View',
  'Commercial Banking - Transfers',
  'Consumer Banking - Transfers',
  'Corporate Banking Transfers',
  'Date_Filter_View_With_TimeStamp',
  'Exceptions - Assigned To Tracy',
  'File Transfer Admin - Transfers',
  'Final_Test_Transfer_View_2',
  'Global Logistics - Exceptions',
  'Global Logistics: Missing & Expected Files',
  'Horizon Manufacturing - Exceptions',
];

const SECTION_ROWS = [
  { label: 'Schedule', subtitle: 'No schedule selected', buttonLabel: 'Manage Frequency' },
  { label: 'Recipients', subtitle: null, buttonLabel: 'Add Recipients' },
  { label: 'Message', subtitle: 'Specify your email content', buttonLabel: 'Compose Email' },
];

export function ScheduleReportModal({ open, onClose }: ScheduleReportModalProps) {
  const [selectedView, setSelectedView] = useState('');
  const [reportName, setReportName] = useState('');

  const canSubmit = selectedView !== '' && reportName.trim() !== '';

  const handleClose = () => {
    setSelectedView('');
    setReportName('');
    onClose();
  };

  const modalTitle = (
    <Box>
      <Typography variant="h6" fontWeight={600}>
        Schedule a Report
      </Typography>
    </Box>
  );

  const modalActions = (
    <>
      <Button variant="text" color="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="contained" color="primary" disabled={!canSubmit}>
        Schedule Report
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title={modalTitle}
      actions={modalActions}
      showCloseButton
    >
      <Stack spacing={2.5}>
        {/* Subtitle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            Automate Report distribution from a Saved View
          </Typography>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Box>

        {/* View selector */}
        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ mb: 0.75, color: 'text.primary' }}
          >
            View{' '}
            <Typography component="span" variant="body2" color="text.secondary">
              (required)
            </Typography>{' '}
            <Typography component="span" variant="body2" color="error">
              *
            </Typography>
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={selectedView}
              onChange={(e: SelectChangeEvent) => setSelectedView(e.target.value)}
              displayEmpty
              renderValue={(v) => (v ? v : 'Select a view')}
              sx={{
                color: selectedView ? 'text.primary' : 'text.disabled',
                '& .MuiSelect-select': { fontSize: 14 },
              }}
            >
              {MOCK_VIEWS.map((view) => (
                <MenuItem key={view} value={view} sx={{ fontSize: 14 }}>
                  {view}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Report name */}
        <Box>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ mb: 0.75, color: 'text.primary' }}
          >
            Scheduled Report Name{' '}
            <Typography component="span" variant="body2" color="text.secondary">
              (required)
            </Typography>{' '}
            <Typography component="span" variant="body2" color="error">
              *
            </Typography>
          </Typography>
          <Input
            placeholder=""
            fullWidth
            value={reportName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReportName(e.target.value)}
          />
        </Box>

        {/* Schedule / Recipients / Message sections */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          {SECTION_ROWS.map((row, index) => (
            <React.Fragment key={row.label}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  gap: 1.5,
                }}
              >
                <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 22, flexShrink: 0 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {row.label}
                  </Typography>
                  {row.subtitle && (
                    <Typography variant="caption" color="text.secondary">
                      {row.subtitle}
                    </Typography>
                  )}
                </Box>
                <Button variant="outlined" color="secondary" size="small">
                  {row.buttonLabel}
                </Button>
              </Box>
              {index < SECTION_ROWS.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Stack>
    </Modal>
  );
}
