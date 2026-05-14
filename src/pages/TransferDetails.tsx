import { useState } from 'react';
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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, Tag } from '@design-system';
import { PageLayout } from '../components/PageLayout';
import {
  ExceptionDetailModal,
  renderExceptionSentence,
  exceptionStatusConfig,
} from '../components/ExceptionDetailModal';
import { defaultRelatedExceptions, exceptionToTransfers } from '../mocks/exceptionTransferLinks';

interface ConnectionDetails {
  protocol: string;
  host: string;
  port: string;
  directory: string;
  user: string;
  transferSize: string;
  transactionId: string;
  interaction: string;
  interactionLabel: string;
}

interface SubItem {
  time: string;
  date: string;
  type: string;
  description: string;
  fileName: string;
}

interface TimelineItem {
  time: string;
  date: string;
  title: string;
  subtitle: string;
  status: 'success';
  actionCount?: number;
  connectionDetails: ConnectionDetails;
  subItems?: SubItem[];
}

function TransferDetails() {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0, 1]));
  const [comment, setComment] = useState('');
  const [selectedExceptionIdx, setSelectedExceptionIdx] = useState<number | null>(null);
  const [showAllExceptions, setShowAllExceptions] = useState(false);

  const transfer = {
    filename: 'edi.dat',
    fileSize: '1.21 KB',
    transferId: '20260410032481848373',
    routeId: '-',
  };

  const sentBy = { name: 'MBX_/SYN_MBX_Producer/Outbound', time: '8:48 AM', date: 'Apr 10 2026' };
  const deliveredTo = { name: 'MBX_/SYN_MBX_Consumer/Inbox', time: '8:48 AM', date: 'Apr 10 2026' };

  const severityRank: Record<'critical' | 'high' | 'medium' | 'low', number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const sortedRelatedExceptions = [...defaultRelatedExceptions].sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity],
  );
  const INITIAL_VISIBLE_EXCEPTIONS = 3;
  const visibleRelatedExceptions = showAllExceptions
    ? sortedRelatedExceptions
    : sortedRelatedExceptions.slice(0, INITIAL_VISIBLE_EXCEPTIONS);
  const hiddenExceptionCount =
    sortedRelatedExceptions.length - INITIAL_VISIBLE_EXCEPTIONS;

  const timelineData: TimelineItem[] = [
    {
      time: '8:48 AM',
      date: 'Apr 10 2026',
      title: 'MBX_/SYN_MBX_Producer/Outbound',
      subtitle: 'Sent By',
      status: 'success',
      connectionDetails: {
        protocol: 'MBX',
        host: '-',
        port: '-',
        directory: '/SYN_MBX_Producer/Outbound',
        user: 'SYN_MBX_Producer',
        transferSize: '1.21 KB',
        transactionId: '20260410032481848373',
        interaction: 'PUSH',
        interactionLabel: 'Interaction',
      },
    },
    {
      time: '8:48 AM',
      date: 'Apr 10 2026',
      title: 'MBX_/SYN_MBX_Consumer/Inbox',
      subtitle: 'Delivered to',
      status: 'success',
      actionCount: 2,
      connectionDetails: {
        protocol: 'MBX',
        host: '-',
        port: '-',
        directory: '/SYN_MBX_Consumer/Inbox',
        user: '-',
        transferSize: '1.21 KB',
        transactionId: '20260410089481848375',
        interaction: 'PUSH',
        interactionLabel: 'Interaction Type',
      },
      subItems: [
        { time: '8:48 AM', date: 'Apr 10 2026', type: 'Delivery', description: 'Delivery started', fileName: 'edi.dat' },
        { time: '8:48 AM', date: 'Apr 10 2026', type: 'Staged', description: 'Staged to temporary mailbox', fileName: 'edi.dat' },
      ],
    },
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const getConnectionRows = (cd: ConnectionDetails): [string, string, string, string][] => [
    ['Protocol', cd.protocol, 'Host', cd.host],
    ['Port', cd.port, 'Directory', cd.directory],
    ['User', cd.user, 'Transfer Size', cd.transferSize],
    ['Transaction/Route ID', cd.transactionId, cd.interactionLabel, cd.interaction],
  ];

  return (
    <PageLayout selectedNavItem="transfers" hideHeaderBorder backgroundColor="#FAFCFC">
      {/* Breadcrumb + page heading */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 1, width: 'fit-content' }}
          onClick={() => navigate('/transfers')}
        >
          <ChevronLeftIcon sx={{ fontSize: 20, mr: 0.5 }} />
          <Typography variant="subtitle2">Transfers</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Transfer Details</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">Last refreshed: Just now</Typography>
            <IconButton size="small" color="secondary" sx={{ p: 0.5 }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Overview Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
        {/* Title row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>{transfer.filename}</Typography>
            <Typography variant="body2" color="text.secondary">{transfer.fileSize}</Typography>
            <Tag
              label="Unknown"
              variant="neutral"
              size="small"
              icon={<HelpOutlineIcon sx={{ fontSize: 14 }} />}
            />
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              startIcon={<EmailIcon />}
              sx={{ color: 'text.primary', borderColor: 'divider' }}
            >
              Email
            </Button>
            <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.75 }}>
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 0.75 }}>
              <MoreHorizIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Tag
              label="Success"
              variant="success"
              size="medium"
              icon={<CheckCircleOutlineIcon fontSize="small" />}
            />
          </Stack>
        </Box>

        {/* Transfer ID / Route ID row */}
        <Box sx={{ display: 'flex', gap: 5, mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Transfer ID</Typography>
            <Typography variant="body2">{transfer.transferId}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Route ID</Typography>
            <Typography variant="body2">{transfer.routeId}</Typography>
          </Box>
        </Box>

        {/* Sent By → Delivered to flow */}
        <Grid container alignItems="center">
          <Grid size={5}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Sent By
            </Typography>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {sentBy.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sentBy.time}&nbsp;&nbsp;{sentBy.date}
            </Typography>
          </Grid>
          <Grid size={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowForwardIcon sx={{ fontSize: 36, color: 'action.disabled' }} />
          </Grid>
          <Grid size={5}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Delivered to
            </Typography>
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {deliveredTo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deliveredTo.time}&nbsp;&nbsp;{deliveredTo.date}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Related Exceptions Card */}
      {sortedRelatedExceptions.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: '1px solid',
            borderColor: 'error.main',
            bgcolor: 'error.lighter',
            backgroundColor: (theme) =>
              theme.palette.error.lighter ?? '#FEF2F2',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Related Exceptions
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 22,
                  height: 22,
                  px: 0.75,
                  borderRadius: '999px',
                  bgcolor: 'error.main',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {sortedRelatedExceptions.length}
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              endIcon={<ChevronRightIcon />}
              onClick={() => navigate('/exceptions')}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
                borderColor: 'divider',
                bgcolor: '#ffffff',
              }}
            >
              Go to all exceptions
            </Button>
          </Box>
          <Stack spacing={1}>
            {visibleRelatedExceptions.map((ex, idx) => {
              const sevConfig =
                ex.severity === 'critical'
                  ? { label: 'Critical', variant: 'error' as const, icon: <ArrowUpwardIcon /> }
                  : ex.severity === 'high'
                  ? { label: 'High', variant: 'warning' as const, icon: <ArrowUpwardIcon /> }
                  : ex.severity === 'medium'
                  ? { label: 'Medium', variant: 'primary' as const, icon: <ArrowForwardIcon /> }
                  : { label: 'Low', variant: 'neutral' as const, icon: <ArrowForwardIcon /> };
              const statusCfg = exceptionStatusConfig[ex.status];
              const StatusIcon = statusCfg.Icon;
              return (
                <Box
                  key={ex.id}
                  onClick={() => setSelectedExceptionIdx(idx)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1.25,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '6px',
                    bgcolor: '#ffffff',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'error.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <StatusIcon sx={{ fontSize: 18, color: statusCfg.color }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.4 }}>
                      {renderExceptionSentence(ex)}
                    </Typography>
                    {(ex.openedAt || ex.lastModifiedAt) && (
                      <Typography
                        sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}
                      >
                        {ex.openedAt ? `Opened ${ex.openedAt}` : null}
                        {ex.openedAt && ex.lastModifiedAt ? ' · ' : null}
                        {ex.lastModifiedAt ? `Last modified ${ex.lastModifiedAt}` : null}
                      </Typography>
                    )}
                  </Box>
                  <Tag
                    label={sevConfig.label}
                    variant={sevConfig.variant}
                    icon={sevConfig.icon}
                    size="small"
                  />
                  <ChevronRightIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </Box>
              );
            })}
          </Stack>
          {hiddenExceptionCount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowAllExceptions((v) => !v)}
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  borderColor: 'divider',
                  bgcolor: '#ffffff',
                }}
              >
                {showAllExceptions ? 'Show less' : `+${hiddenExceptionCount} more`}
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {/* Timeline Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Timeline</Typography>

        {timelineData.map((item, index) => {
          const isExpanded = expandedItems.has(index);
          const isLastItem = index === timelineData.length - 1;
          const hasSubItems = (item.subItems?.length ?? 0) > 0;

          return (
            <Box key={index}>
              {/* Main timeline row */}
              <Box
                sx={{ display: 'flex', cursor: 'pointer' }}
                onClick={() => toggleItem(index)}
              >
                {/* Time column */}
                <Box sx={{ width: 120, textAlign: 'right', pr: 3, pt: 0.5, flexShrink: 0 }}>
                  <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.3 }}>
                    {item.time}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                    {item.date}
                  </Typography>
                </Box>

                {/* Icon + line column */}
                <Box sx={{ width: 40, position: 'relative', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  {/* Vertical line below icon */}
                  {(!isLastItem || isExpanded) && (
                    <Box sx={{
                      position: 'absolute',
                      top: 24,
                      bottom: isExpanded ? 0 : -16,
                      width: 2,
                      bgcolor: 'divider',
                      left: '50%',
                      transform: 'translateX(-1px)',
                    }} />
                  )}
                  <Box sx={{ position: 'relative', zIndex: 1, bgcolor: '#ffffff', lineHeight: 0 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 24 }} />
                  </Box>
                </Box>

                {/* Content column */}
                <Box sx={{ flex: 1, pb: isExpanded ? 1.5 : 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {item.subtitle}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 2 }}>
                      {item.actionCount != null && (
                        <Typography variant="body2" color="text.secondary">
                          {item.actionCount} Actions
                        </Typography>
                      )}
                      <Tag
                        label="Success"
                        variant="success"
                        size="medium"
                        icon={<CheckCircleOutlineIcon fontSize="small" />}
                      />
                      <Box sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        display: 'flex',
                      }}>
                        <ExpandMoreIcon color="action" />
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Box>

              {/* Expanded section: connection details + sub-items */}
              <Collapse in={isExpanded}>
                {/* Connection details grid */}
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ width: 120, flexShrink: 0 }} />
                  <Box sx={{ width: 40, position: 'relative', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      width: 2,
                      bgcolor: 'divider',
                      left: '50%',
                      transform: 'translateX(-1px)',
                    }} />
                  </Box>
                  <Box sx={{ flex: 1, pb: hasSubItems ? 2 : 4, pt: 0.5 }}>
                    {getConnectionRows(item.connectionDetails).map((row, rowIndex) => (
                      <Grid container key={rowIndex} sx={{ mb: 0.75 }}>
                        <Grid size={3}>
                          <Typography variant="body2" color="text.secondary">{row[0]}</Typography>
                        </Grid>
                        <Grid size={3}>
                          <Typography variant="body2">{row[1]}</Typography>
                        </Grid>
                        <Grid size={3}>
                          <Typography variant="body2" color="text.secondary">{row[2]}</Typography>
                        </Grid>
                        <Grid size={3}>
                          <Typography variant="body2">{row[3]}</Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                </Box>

                {/* Sub-items */}
                {item.subItems?.map((subItem, subIndex) => {
                  const isLastSub = subIndex === (item.subItems?.length ?? 0) - 1;
                  const showLineBelow = !isLastSub || !isLastItem;

                  return (
                    <Box key={subIndex} sx={{ display: 'flex' }}>
                      {/* Time column */}
                      <Box sx={{ width: 120, textAlign: 'right', pr: 3, pt: 0.5, flexShrink: 0 }}>
                        <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.3 }}>
                          {subItem.time}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                          {subItem.date}
                        </Typography>
                      </Box>

                      {/* Dot + line column */}
                      <Box sx={{ width: 40, position: 'relative', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                        {showLineBelow && (
                          <Box sx={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            width: 2,
                            bgcolor: 'divider',
                            left: '50%',
                            transform: 'translateX(-1px)',
                          }} />
                        )}
                        <Box sx={{
                          position: 'relative',
                          zIndex: 1,
                          mt: 0.75,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          flexShrink: 0,
                        }} />
                      </Box>

                      {/* Sub-item content */}
                      <Box sx={{
                        flex: 1,
                        pt: 0.25,
                        pb: isLastSub ? 0 : 3,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}>
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'baseline' }}>
                          <Typography variant="body2" fontWeight={700} sx={{ minWidth: 80 }}>
                            {subItem.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {subItem.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {subItem.fileName}
                          </Typography>
                        </Box>
                        <InfoOutlinedIcon sx={{ fontSize: 16, color: 'primary.main', flexShrink: 0, mt: 0.25 }} />
                      </Box>
                    </Box>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}
      </Paper>


      {/* Comments Card */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Comments</Typography>
        <Box sx={{ py: 3, textAlign: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">No one has commented yet.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', flexShrink: 0 }}>KB</Avatar>
          <TextField
            fullWidth
            size="small"
            placeholder="Say Something..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Box>
      </Paper>

      <ExceptionDetailModal
        open={selectedExceptionIdx != null}
        exception={
          selectedExceptionIdx != null
            ? {
                ...sortedRelatedExceptions[selectedExceptionIdx],
                relatedTransfers:
                  sortedRelatedExceptions[selectedExceptionIdx].relatedTransfers ??
                  exceptionToTransfers[sortedRelatedExceptions[selectedExceptionIdx].id],
              }
            : null
        }
        onClose={() => setSelectedExceptionIdx(null)}
        onPrev={() =>
          setSelectedExceptionIdx((i) => (i != null && i > 0 ? i - 1 : i))
        }
        onNext={() =>
          setSelectedExceptionIdx((i) =>
            i != null && i < sortedRelatedExceptions.length - 1 ? i + 1 : i,
          )
        }
        hasPrev={selectedExceptionIdx != null && selectedExceptionIdx > 0}
        hasNext={
          selectedExceptionIdx != null &&
          selectedExceptionIdx < sortedRelatedExceptions.length - 1
        }
      />
    </PageLayout>
  );
}

export default TransferDetails;
