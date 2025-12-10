import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Drawer,
  AppBar,
  Toolbar,
  Grid,
  Stack,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Divider,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CodeIcon from '@mui/icons-material/Code';
import { Button } from '@ds/components/atoms/Button';
import { Badge } from '@ds/components/atoms/Badge';
import { RawEventsModal } from '../components/RawEventsModal';

const drawerWidth = 240;

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
  const [expandedTimeline, setExpandedTimeline] = useState<string>('sent-by');
  const [comment, setComment] = useState('');
  const [rawEventsModalOpen, setRawEventsModalOpen] = useState(false);
  const [rawEvents, setRawEvents] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timelineData: TimelineItem[] = [
    {
      time: '8:04:48 PM',
      date: 'Dec 8 2025',
      title: 'John Deere',
      subtitle: 'Sent By',
      status: 'success',
      actionCount: 3,
      connectionDetails: {
        protocol: 'SFTP',
        port: '-',
        user: 'payroll_user',
        transactionId: 'S00029346479611949792',
        host: '10.24.11.5',
        directory: '/hr/outbound',
        transferSize: '659.00 KB',
        interactionType: 'PUSH',
      },
      details: [
        {
          type: 'ZIP',
          description: 'File Unzipped',
          fileName: 'ach_batch_1207.pgp',
          status: 'success',
        },
        {
          type: 'PGP',
          description: 'File Decrypted',
          fileName: 'ach_batch_1207.dat',
          status: 'success',
        },
        {
          type: 'PARSE',
          description: 'File Parsed',
          fileName: '820 direct deposit records extracted',
          status: 'success',
        },
      ],
    },
    {
      time: '8:04:48 PM',
      date: 'Dec 8 2025',
      title: 'Processing',
      status: 'success',
      actionCount: 6,
      details: [
        {
          type: 'Verify',
          description: 'All employee IDs validated',
          fileName: 'employee_check.txt',
          status: 'success',
        },
        {
          type: 'Verify',
          description: 'Deposits categorized by destination bank',
          fileName: 'split_bank.txt',
          status: 'success',
        },
        {
          type: 'Verify',
          description: 'Withholding tax calculations applied',
          fileName: 'tax_adjusted.txt',
          status: 'success',
        },
        {
          type: 'Translate',
          description: 'Employee pay advices generated',
          fileName: 'pay_advice_1207.txt',
          status: 'success',
        },
        {
          type: 'Translate',
          description: 'Payroll summary report compiled',
          fileName: 'payroll_summary.txt',
          status: 'success',
        },
        {
          type: 'Archive',
          description: 'Final payroll package archived',
          fileName: 'archive_payroll_1207.zip',
          status: 'success',
        },
      ],
    },
    {
      time: '8:04:48 PM',
      date: 'Dec 8 2025',
      title: 'Employee Payments Engine',
      subtitle: 'Delivered To',
      status: 'success',
      actionCount: 4,
      connectionDetails: {
        protocol: 'SFTP',
        port: '-',
        user: 'sftp_pay_user',
        transactionId: 'S00029346479611949792',
        host: 'sftp.payroll.company.com',
        directory: '/payments/inbox',
        transferSize: '-',
        interactionType: 'PUSH',
      },
      details: [
        {
          type: 'Start',
          description: 'Delivery started',
          fileName: 'payroll_run_1207.dat',
          status: 'success',
        },
        {
          type: 'ZIP',
          description: 'File Zipped',
          fileName: 'payroll_run_1207.zip',
          status: 'success',
        },
        {
          type: 'PGP',
          description: 'File Encrypted',
          fileName: 'payroll_run_1207.pgp',
          status: 'success',
        },
        {
          type: 'PUT',
          description: 'Success',
          fileName: 'payroll_run_5333.zip',
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="114" height="48" fill="none" viewBox="0 0 114 48">
              <path stroke="#266079" d="M7.97 10.5c2.162 0 4.184.475 5.65 1.501 1.336.935 2.243 2.35 2.37 4.39h-3.57c-.166-1.165-.694-1.984-1.5-2.504-.874-.566-2.007-.732-3.16-.732-.803 0-1.71.168-2.433.615-.748.461-1.29 1.219-1.29 2.312 0 .46.07.894.324 1.281.251.383.639.657 1.14.89.732.343 1.846.66 3.47 1.084l1.8.466h.002c.796.2 2.291.527 3.596 1.376 1.277.83 2.355 2.147 2.355 4.372 0 .601-.203 1.718-.445 2.603-.88-2.43-3.236-3.928-5.353-4.822a21 21 0 0 0-3.293-1.059 21 21 0 0 0-1.364-.27l-.077-.013c-1.519-.416-2.943-.92-3.988-1.756C1.182 19.417.5 18.267.5 16.472c0-2.006.935-3.48 2.33-4.468 1.41-1 3.296-1.504 5.14-1.504Z"></path>
              <path fill="#266079" d="M20.199 35.014c.974 0 1.834-.587 2.336-1.815l.47-1.088-4.724-10.69c-.167-.419-.362-.502-.753-.502h-.415v-3.015h2.336c1.002 0 1.502.363 1.863 1.34l2.781 7.117c.277.725.5 1.898.5 1.898h.058s.221-1.173.47-1.898l2.42-7.118c.334-.976.918-1.339 1.89-1.339h2.392v3.015h-.416c-.419 0-.64.083-.809.502L25.51 34.288c-1 2.568-3.003 3.712-5.116 3.712-2.225 0-3.588-1.45-3.588-1.45l1.364-2.513s.86.977 2.029.977M34.748 21.533c0-.418-.223-.614-.615-.614h-1.11v-3.015h3.254c1.251 0 1.862.586 1.862 1.59v.419a4 4 0 0 1-.055.614h.056c.612-1.201 2.142-2.958 5.005-2.958 3.143 0 4.95 1.646 4.95 5.414v5.555c0 .39.223.614.612.614h1.11v2.986h-3.363c-1.335 0-1.891-.558-1.891-1.897v-6.532c0-1.73-.445-2.903-2.225-2.903-1.89 0-3.309 1.2-3.81 2.903-.195.586-.279 1.228-.279 1.899v6.53h-3.502zM57.581 17.57c1.835 0 5.144.755 5.144 3.21v1.674H59.61v-.782c0-.782-1.167-1.117-2.029-1.117-2.446 0-4.198 1.87-4.198 4.438 0 2.903 2.142 4.382 4.421 4.382 2.42 0 4.2-1.925 4.2-1.925l1.475 2.455s-2.113 2.568-5.98 2.568c-4.672 0-7.675-3.322-7.675-7.453-.003-4.018 2.89-7.45 7.757-7.45M65.645 21.533c0-.418-.222-.614-.611-.614h-1.11v-3.015h3.224c1.252 0 1.89.53 1.89 1.73v.837a6.5 6.5 0 0 1-.056.893h.056c.64-2.038 2.338-3.656 4.506-3.656q.321.005.638.056v3.49a6 6 0 0 0-.86-.057c-1.503 0-3.225.866-3.866 2.987a8.7 8.7 0 0 0-.305 2.317v5.637h-3.504zM81.8 17.57c4.34 0 7.787 3.097 7.787 7.451 0 4.381-3.448 7.453-7.786 7.453-4.311 0-7.762-3.072-7.762-7.453.002-4.354 3.451-7.452 7.762-7.452m0 11.89c2.31 0 4.227-1.788 4.227-4.44 0-2.623-1.918-4.438-4.226-4.438-2.281 0-4.199 1.815-4.199 4.439 0 2.65 1.918 4.438 4.199 4.438M91.117 20.723h-1.754v-2.819h1.754v-.419c0-4.661 3.807-5.275 5.782-5.275q.6-.006 1.197.083v3.015a4.5 4.5 0 0 0-.724-.056c-1.001 0-2.725.251-2.725 2.317v.335h3.032v2.819h-3.032v11.415h-3.53zM102.376 35.014c.973 0 1.837-.587 2.337-1.815l.473-1.09-4.728-10.689c-.167-.418-.362-.5-.752-.5h-.417v-3.016h2.335c1.003 0 1.502.363 1.865 1.34l2.779 7.117c.279.725.5 1.898.5 1.898h.057s.223-1.173.473-1.898l2.418-7.118c.335-.976.918-1.339 1.893-1.339H114v3.015h-.418c-.417 0-.639.083-.806.502l-5.089 12.867c-1.001 2.568-3.003 3.712-5.116 3.712-2.225 0-3.588-1.45-3.588-1.45l1.364-2.513s.863.977 2.029.977"></path>
            </svg>
          </Box>
        </Toolbar>
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          <List>
            <ListItemButton onClick={() => navigate('/')}>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                <DashboardRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton selected onClick={() => navigate('/transfers')}>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                <InsertDriveFileRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Transfers" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                <GroupRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Partners" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                <ErrorRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Exceptions" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Scheduled Reports" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                <SettingsRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </List>
        </Box>
        <Box>
          <List>
            <ListItemButton>
              <Button variant="text" fullWidth startIcon={<KeyboardDoubleArrowLeftIcon />}>
                Collapse
              </Button>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Box sx={{ flexShrink: 0, width: '100%', maxWidth: '500px', position: 'relative' }}>
                <TextField
                  size="small"
                  placeholder="Search for files"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ position: 'absolute', right: 0 }}>
                <Chip label="CoEnterprise - Production" variant="outlined" size="small" />
              </Box>
            </Box>
            <IconButton>
              <Badge badgeContent={1} color="error" variant="dot">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
            <IconButton>
              <Avatar sx={{ width: 32, height: 32 }}>
                <Typography variant="body1">KB</Typography>
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          {/* Breadcrumb and Refresh */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box 
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/')}
              >
                <ChevronLeftIcon sx={{ fontSize: 20, mr: 0.5 }} />
                <Typography variant="subtitle2">Transfers</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last refreshed: 35 seconds
                </Typography>
                <IconButton size="small" color="secondary">
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
              Transfer Details
            </Typography>
          </Box>

          {/* Overview Card */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Overview
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Button variant="outlined" size="small" startIcon={<CodeIcon />} onClick={handleOpenRawEvents}>
                  View JSON
                </Button>
                <Button variant="outlined" size="small" startIcon={<EmailIcon />}>
                  Email
                </Button>
                <IconButton size="small" color="secondary">
                  <VisibilityOffIcon color="primary" />
                </IconButton>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1.5, py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutlineIcon fontSize="small" />
                  <Typography variant="body2">Success</Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Transfer Details Grid */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
              <Grid item xs={8}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Sender File Name
                    </Typography>
                    <Typography variant="h5">payroll_run_7759.zip</Typography>
                  </Grid>
              <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Sender File Size
                    </Typography>
                    <Typography variant="h5">659.00 KB</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Transfer ID
                </Typography>
                <Typography variant="h5">S00029346479611949792</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Direction
                </Typography>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1.5, py: 0.5, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                  <ArrowCircleDownIcon fontSize="small" />
                  <Typography variant="body2">Inbound</Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Sender/Receiver and Times */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
              <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Sent By
                    </Typography>
                    <Typography variant="h5">John Deere</Typography>
                  </Grid>
              <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: '96px', height: '48px', display: 'flex', alignItems: 'center' }}>
                        <svg width="96px" height="48px" viewBox="0 0 24 24" fill="#a0a0a0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.0681 11.9928L18.8183 7.75732L17.4065 9.17392L19.2419 11.0031L0.932836 11.0011L0.932617 13.0011L19.2373 13.0031L17.4158 14.8308L18.8324 16.2426L23.0681 11.9928Z" fill="#a0a0a0"></path>
                        </svg>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Delivered To
                    </Typography>
                    <Typography variant="h5">Employee Payments Engine</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
              <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Start
                    </Typography>
                    <Box>
                      <Typography variant="h6">8:04 PM MST</Typography>
                      <Typography variant="body1" color="text.secondary">
                        Dec 8 2025
                      </Typography>
                    </Box>
                  </Grid>
              <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      End
                    </Typography>
                    <Box>
                      <Typography variant="h6">8:04 PM MST</Typography>
                      <Typography variant="body1" color="text.secondary">
                        Dec 8 2025
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Timeline Card */}
          <Paper elevation={1} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Timeline
            </Typography>
            <Box>
              {timelineData.map((item, index) => (
                <Accordion
                  key={index}
                  expanded={expandedTimeline === `timeline-${index}`}
                  onChange={() => handleTimelineChange(`timeline-${index}`)}
                  sx={{ boxShadow: 'none', border: 'none', '&:before': { display: 'none' } }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                        <Box>
                          <Typography variant="body1">{item.time}</Typography>
                          <Typography variant="body1" color="text.secondary">
                            {item.date}
                          </Typography>
                        </Box>
                      </Grid>
              <Grid item xs={8}>
                        {item.subtitle && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {item.subtitle}
                          </Typography>
                        )}
                        <Typography variant="h5">{item.title}</Typography>
                      </Grid>
              <Grid item xs={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="body1">{item.actionCount} Actions</Typography>
                          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1.5, py: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CheckCircleOutlineIcon fontSize="small" />
                            <Typography variant="body2">Success</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0, pb: 2 }}>
                    {item.connectionDetails && (
                      <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Grid container spacing={2}>
              <Grid item xs={6}>
                            <Grid container spacing={1}>
              <Grid item xs={5.5}>
                                <Typography variant="body2" color="text.secondary">Protocol</Typography>
                              </Grid>
              <Grid item xs={6.5}>
                                <Typography variant="body2">{item.connectionDetails.protocol}</Typography>
                              </Grid>
              <Grid item xs={5.5}>
                                <Typography variant="body2" color="text.secondary">Port</Typography>
                              </Grid>
              <Grid item xs={6.5}>
                                <Typography variant="body2">{item.connectionDetails.port}</Typography>
                              </Grid>
              <Grid item xs={5.5}>
                                <Typography variant="body2" color="text.secondary">User</Typography>
                              </Grid>
              <Grid item xs={6.5}>
                                <Typography variant="body2">{item.connectionDetails.user}</Typography>
                              </Grid>
              <Grid item xs={5.5}>
                                <Typography variant="body2" color="text.secondary">Transaction/Route ID</Typography>
                              </Grid>
              <Grid item xs={6.5}>
                                <Typography variant="body2">{item.connectionDetails.transactionId}</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
              <Grid item xs={6}>
                            <Grid container spacing={1}>
              <Grid item xs={5.5}>
                                <Typography variant="body2" color="text.secondary">Host</Typography>
                              </Grid>
              <Grid item xs={6.5}>
                                <Typography variant="body2">{item.connectionDetails.host}</Typography>
                              </Grid>
              <Grid item xs={5.5}>
                                <Typography variant="body2" color="text.secondary">Directory</Typography>
                              </Grid>
              <Grid item xs={6.5}>
                                <Typography variant="body2">{item.connectionDetails.directory}</Typography>
                              </Grid>
              <Grid item xs={5.5}>
                                <Typography variant="body2" color="text.secondary">Transfer Size</Typography>
                              </Grid>
              <Grid item xs={6.5}>
                                <Typography variant="body2">{item.connectionDetails.transferSize}</Typography>
                              </Grid>
              <Grid item xs={5.5}>
                                <Typography variant="body2" color="text.secondary">Interaction Type</Typography>
                              </Grid>
              <Grid item xs={6.5}>
                                <Typography variant="body2">{item.connectionDetails.interactionType}</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                    {item.details && (
                      <Box>
                        {item.details.map((detail, detailIndex) => (
                          <Box key={detailIndex} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                                <Box>
                                  <Typography variant="body2">{item.time}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.date}
                                  </Typography>
                                </Box>
                              </Grid>
              <Grid item xs={11}>
                                <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                                    <Typography variant="body1" fontWeight={500}>
                                      {detail.type}
                                    </Typography>
                                  </Grid>
              <Grid item xs={6.5}>
                                    <Typography variant="body1">{detail.description}</Typography>
                                  </Grid>
              <Grid item xs={3.5}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="body1">{detail.fileName}</Typography>
                                      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1, py: 0.5, display: 'flex', alignItems: 'center' }}>
                                        <CheckCircleOutlineIcon fontSize="small" />
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>

          {/* Comments Card */}
          <Paper elevation={1} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
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
        </Box>
      </Box>

      <RawEventsModal
        open={rawEventsModalOpen}
        onClose={handleCloseRawEvents}
        events={rawEvents}
        loading={loading}
        error={error}
        onRetry={loadRawEvents}
      />
    </Box>
  );
}

export default TransferDetails;

