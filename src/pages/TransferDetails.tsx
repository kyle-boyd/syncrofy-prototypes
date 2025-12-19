import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  IconButton,
  Avatar,
  TextField,
  Collapse,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import { Button, Tag, Chips } from '@kyleboyd/design-system';
import { RawEventsModal } from '../components/RawEventsModal';
import { PageLayout } from '../components/PageLayout';

interface TimelineItem {
  time: string;
  date: string;
  title: string;
  subtitle?: string;
  status: 'success' | 'processing';
  actionCount: number;
  details?: {
    type: string;
    description: string;
    fileName: string;
    status: 'success';
  }[];
  connectionDetails?: {
    protocol: string;
    port: string;
    user: string;
    transactionId: string;
    host: string;
    directory: string;
    transferSize: string;
    interactionType: string;
  };
}

function TransferDetails() {
  const navigate = useNavigate();
  const [expandedTimeline, setExpandedTimeline] = useState<string>('timeline-0');
  const [comment, setComment] = useState('');
  const [rawEventsModalOpen, setRawEventsModalOpen] = useState(false);
  const [rawEvents, setRawEvents] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timelineData: TimelineItem[] = [
    {
      time: '12:00:32 PM',
      date: 'Dec 16 2025',
      title: 'Loan Management System',
      subtitle: 'Sent By',
      status: 'success',
      actionCount: 1,
      connectionDetails: {
        protocol: 'SFTP',
        port: '22',
        user: 'loanfund_user',
        transactionId: 'S73847958390500035265',
        host: 'sftp.loanfund.bank.com',
        directory: '/home/loanfund',
        transferSize: '888.00 KB',
        interactionType: 'PUSH',
      },
      details: [
        {
          type: 'Zip',
          description: 'File unzipped',
          fileName: 'anderson_loan_funding.dat',
          status: 'success',
        },
      ],
    },
    {
      time: '12:00:32 PM',
      date: 'Dec 16 2025',
      title: 'Processing',
      status: 'success',
      actionCount: 1,
      details: [
        {
          type: 'Verify',
          description: 'Loan funding validations passed',
          fileName: 'funding_check.log',
          status: 'success',
        },
      ],
    },
    {
      time: '12:00:32 PM',
      date: 'Dec 16 2025',
      title: 'Anderson & Sons',
      subtitle: 'Delivered To',
      status: 'success',
      actionCount: 3,
      connectionDetails: {
        protocol: 'SFTP',
        port: '22',
        user: 'anderson_sftp',
        transactionId: 'S73847958390500035265',
        host: 'sftp.anderson.com',
        directory: '/incoming/loans',
        transferSize: '888.00 KB',
        interactionType: 'PUSH',
      },
      details: [
        {
          type: 'Connect',
          description: 'Connection established',
          fileName: '-',
          status: 'success',
        },
        {
          type: 'Upload',
          description: 'File uploaded successfully',
          fileName: 'anderson_loan_funding.dat',
          status: 'success',
        },
        {
          type: 'Disconnect',
          description: 'Connection closed',
          fileName: '-',
          status: 'success',
        },
      ],
    },
  ];

  const handleTimelineChange = (panel: string) => {
    setExpandedTimeline(expandedTimeline === panel ? '' : panel);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Handle comment submission
      console.log('Comment submitted:', comment);
      setComment('');
    }
  };

  // Load raw events from the example JSON file
  const loadRawEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/PUSH_PULL_A_pretty.json');
      if (!response.ok) {
        throw new Error('Failed to load raw events');
      }
      const data = await response.json();
      setRawEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load raw events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rawEventsModalOpen && !rawEvents && !loading) {
      loadRawEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawEventsModalOpen]);

  const handleOpenRawEvents = () => {
    setRawEventsModalOpen(true);
  };

  const handleCloseRawEvents = () => {
    setRawEventsModalOpen(false);
  };

  return (
    <PageLayout selectedNavItem="transfers" hideHeaderBorder backgroundColor="#FAFCFC">
      {/* Breadcrumb */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 2 }}
          onClick={() => navigate('/')}
        >
          <ChevronLeftIcon sx={{ fontSize: 20, mr: 0.5 }} />
          <Typography variant="subtitle2">Transfers</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Typography variant="h6">
            Transfer Details
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Last Refreshed: 35 seconds ago
            </Typography>
            <IconButton size="small" color="secondary" sx={{ p: 0.5 }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Overview Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          {/* Left: File Info */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                fund_notification_4744.dat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                888.00 KB
              </Typography>
              <Tag
                label="Outbound"
                variant="warning"
                size="small"
                icon={<ArrowCircleUpIcon sx={{ fontSize: 14 }} />}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              S73847958390500035265
            </Typography>
          </Box>

          {/* Right: Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" size="small" startIcon={<CodeIcon />} onClick={handleOpenRawEvents} sx={{ color: 'text.primary', borderColor: 'divider' }}>
              View code
            </Button>
            <Button variant="outlined" size="small" startIcon={<EmailIcon />} sx={{ color: 'text.primary', borderColor: 'divider' }}>
              Email
            </Button>
            <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <Tag
              label="Success"
              variant="success"
              size="medium"
              icon={<CheckCircleOutlineIcon fontSize="small" />}
            />
          </Stack>
        </Box>

        {/* Flow Section */}
        <Grid container alignItems="center" spacing={4}>
          {/* Sent By */}
          <Grid item xs={5}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Sent By
            </Typography>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              Loan Management System
            </Typography>
            <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" component="span" fontWeight={500} sx={{ mr: 1 }}>
                12:00:32 PM
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ mr: 2 }}>
                Dec 16, 2025
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chips label="Finance" size="small" variant="rounded" />
                <Chips label="Priority" size="small" variant="rounded" />
              </Stack>
            </Box>
          </Grid>

          {/* Arrow */}
          <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowForwardIcon sx={{ fontSize: 40, color: 'action.disabled' }} />
          </Grid>

          {/* Delivered To */}
          <Grid item xs={5}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Delivered to
            </Typography>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              Anderson & Sons
            </Typography>
            <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" component="span" fontWeight={500} sx={{ mr: 1 }}>
                12:01:15 PM
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ mr: 2 }}>
                Dec 16, 2025
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chips label="External" size="small" variant="rounded" />
                <Chips label="Vendor" size="small" variant="rounded" />
                <Box sx={{ border: '1px solid', borderColor: 'divider', px: 1, py: 0.25, borderRadius: 4 }}>
                  <Typography variant="caption" color="text.secondary">+ 4 more</Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Timeline Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
          Timeline
        </Typography>
        <Box>
          {timelineData.map((item, index) => {
            const isLastItem = index === timelineData.length - 1;
            const isExpanded = expandedTimeline === `timeline-${index}`;

            return (
              <Box key={index}>
                {/* Main Row */}
                <Box
                  sx={{ display: 'flex', cursor: 'pointer' }}
                  onClick={() => handleTimelineChange(`timeline-${index}`)}
                >
                  {/* Time Column */}
                  <Box sx={{ width: 120, textAlign: 'right', pr: 3, pt: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                      {item.time}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                      {item.date}
                    </Typography>
                  </Box>

                  {/* Line Column */}
                  <Box sx={{ width: 40, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    {/* Vertical Line */}
                    {!isLastItem && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          bottom: -12, // Connect to next item
                          width: '2px',
                          bgcolor: 'divider',
                          left: '50%',
                          transform: 'translateX(-1px)' // Center perfectly
                        }}
                      />
                    )}
                    {(isExpanded && item.details) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          bottom: 0,
                          width: '2px',
                          bgcolor: 'divider',
                          left: '50%',
                          transform: 'translateX(-1px)'
                        }}
                      />
                    )}

                    {/* Main Icon */}
                    <Box sx={{ position: 'relative', zIndex: 1, bgcolor: '#ffffff' }}>
                      {item.status === 'success' ? (
                        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 24, bgcolor: 'white' }} />
                      ) : (
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid', borderColor: 'primary.main' }} />
                      )}
                    </Box>
                  </Box>

                  {/* Content Column */}
                  <Box sx={{ flex: 1, pt: 0, pb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        {item.subtitle && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {item.subtitle}
                          </Typography>
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {item.title}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {item.actionCount} Actions
                        </Typography>
                        <Tag
                          label="Success"
                          variant="success"
                          size="medium"
                          icon={<CheckCircleOutlineIcon fontSize="small" />}
                        />
                        <Box sx={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          display: 'flex'
                        }}>
                          <ExpandMoreIcon color="action" />
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Box>

                {/* Expanded Details */}
                <Collapse in={isExpanded}>
                  <Box>
                    {item.details?.map((detail, dIndex) => {
                      const isLastDetail = dIndex === (item.details?.length || 0) - 1;
                      const showLineBelow = !isLastDetail || !isLastItem;

                      return (
                        <Box key={dIndex} sx={{ display: 'flex' }}>
                          {/* Time Column */}
                          <Box sx={{ width: 120, textAlign: 'right', pr: 3, pt: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                              {item.time}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                              {item.date}
                            </Typography>
                          </Box>

                          {/* Line Column */}
                          <Box sx={{ width: 40, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                bottom: showLineBelow ? 0 : '50%',
                                width: '2px',
                                bgcolor: 'divider',
                                left: '50%',
                                transform: 'translateX(-1px)'
                              }}
                            />
                            {/* Dot Icon */}
                            <Box sx={{
                              position: 'relative',
                              zIndex: 1,
                              mt: 0.8,
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: 'success.main',
                              border: '2px solid white',
                              boxShadow: '0 0 0 1px #4caf50'
                            }} />
                          </Box>

                          {/* Content Column */}
                          <Box sx={{ flex: 1, pt: 0.5, pb: 3, pr: 2 }}>
                            <Box sx={{
                              pb: 2,
                              borderBottom: isLastDetail ? 'none' : '1px solid',
                              borderColor: 'divider',
                              display: 'flex',
                              alignItems: 'center'
                            }}>
                              <Box sx={{ width: '25%' }}>
                                <Typography variant="body2" fontWeight={700}>
                                  {detail.type}
                                </Typography>
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {detail.description}
                                </Typography>
                              </Box>
                              <Box sx={{ width: '25%' }}>
                                <Typography variant="body2" color="text.secondary">
                                  {detail.fileName}
                                </Typography>
                              </Box>
                              <Box sx={{ width: 40, textAlign: 'right' }}>
                                <CheckCircleOutlineIcon color="success" fontSize="small" />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Comments Card */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Comments
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ p: 3, borderRadius: 1, bgcolor: 'background.default' }}>
            <Typography variant="subtitle1" color="primary">
              No one has commented yet.
            </Typography>
          </Box>
        </Box>
        <form onSubmit={handleCommentSubmit}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item>
              <Avatar sx={{ width: 40, height: 40, cursor: 'pointer' }}>
                <Typography variant="body1">KB</Typography>
              </Avatar>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                multiline
                size="small"
                placeholder="Say Something..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                minRows={1}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="secondary" type="submit" fullWidth>
              Comment
            </Button>
          </Box>
        </form>
      </Paper>

      <RawEventsModal
        open={rawEventsModalOpen}
        onClose={handleCloseRawEvents}
        events={rawEvents}
        loading={loading}
        error={error}
        onRetry={loadRawEvents}
      />
    </PageLayout>
  );
}

export default TransferDetails;

