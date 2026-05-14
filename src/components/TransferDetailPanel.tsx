import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  Paper,
  Avatar,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Tag } from '@design-system';
import { Transfer } from '../pages/Transfers';

interface TransferDetailPanelProps {
  transfer: Transfer;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const timelineData = [
  {
    time: '8:48 AM',
    date: 'Apr 10 2026',
    title: 'MBX_/SYN_MBX_Producer/Outbound',
    subtitle: 'Sent By',
    connectionDetails: {
      protocol: 'MBX',
      host: '-',
      port: '-',
      directory: '/SYN_MBX_Producer/Outbound',
      user: 'SYN_MBX_Producer',
      transferSize: '1.21 KB',
      transactionId: '20260410032481848373',
      interaction: 'PUSH',
    },
    subItems: undefined as undefined | { time: string; date: string; type: string; description: string; fileName: string }[],
  },
  {
    time: '8:48 AM',
    date: 'Apr 10 2026',
    title: 'MBX_/SYN_MBX_Consumer/Inbox',
    subtitle: 'Delivered to',
    connectionDetails: {
      protocol: 'MBX',
      host: '-',
      port: '-',
      directory: '/SYN_MBX_Consumer/Inbox',
      user: '-',
      transferSize: '1.21 KB',
      transactionId: '20260410089481848375',
      interaction: 'PUSH',
    },
    subItems: [
      { time: '8:48 AM', date: 'Apr 10 2026', type: 'Delivery', description: 'Delivery started', fileName: 'edi.dat' },
      { time: '8:48 AM', date: 'Apr 10 2026', type: 'Staged', description: 'Staged to temporary mailbox', fileName: 'edi.dat' },
    ],
  },
];

export function TransferDetailPanel({
  transfer,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: TransferDetailPanelProps) {
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  const directionConfig: Record<Transfer['direction'], { variant: 'warning' | 'primary' | 'neutral'; icon: React.ReactNode }> = {
    Outbound: { variant: 'warning', icon: <ArrowUpwardIcon sx={{ fontSize: 14 }} /> },
    Inbound: { variant: 'primary', icon: <ArrowDownwardIcon sx={{ fontSize: 14 }} /> },
    Unknown: { variant: 'neutral', icon: <HelpOutlineIcon sx={{ fontSize: 14 }} /> },
  };
  const dirConfig = directionConfig[transfer.direction];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#FAFCFC' }}>
      {/* Header Bar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1.5,
        py: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
      }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton size="small" onClick={onClose} title="Close panel">
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
          <IconButton size="small" onClick={onPrev} disabled={!hasPrev} title="Previous transfer (↑)">
            <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={onNext} disabled={!hasNext} title="Next transfer (↓)">
            <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
        <IconButton
          size="small"
          onClick={() => navigate(`/transfers/${transfer.id}`)}
          title="Open full details"
        >
          <OpenInFullIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Overview Card */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>{transfer.senderFileName}</Typography>
              <Typography variant="caption" color="text.secondary">{transfer.senderFileSize}</Typography>
            </Box>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
              <Tag label={transfer.direction} variant={dirConfig.variant} size="small" icon={dirConfig.icon} />
              <Tag
                label={transfer.status}
                variant={transfer.status === 'Success' ? 'success' : 'error'}
                size="small"
                icon={transfer.status === 'Success'
                  ? <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                  : <ErrorOutlineIcon sx={{ fontSize: 14 }} />
                }
              />
            </Stack>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">Transfer ID</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              {transfer.id}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" display="block">Sender</Typography>
              <Typography variant="body2" fontWeight={600}>{transfer.sender}</Typography>
              <Typography variant="caption" color="text.secondary">{transfer.startTime}</Typography>
            </Box>
            <Box sx={{ pl: 0.5, py: 0.5 }}>
              <ArrowDownwardIcon sx={{ fontSize: 16, color: 'action.disabled' }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">Receiver</Typography>
              <Typography variant="body2" fontWeight={600}>{transfer.receiver}</Typography>
              <Typography variant="caption" color="text.secondary">{transfer.endTime}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Timeline Card */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Timeline</Typography>

          {timelineData.map((item, index) => {
            const isLastItem = index === timelineData.length - 1;

            return (
              <Box key={index}>
                {/* Main event row */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {/* Icon + connecting line */}
                  <Box sx={{ width: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 20, flexShrink: 0 }} />
                    {(!isLastItem || (item.subItems?.length ?? 0) > 0) && (
                      <Box sx={{ flex: 1, width: 2, bgcolor: 'divider', minHeight: 12, mt: 0.5 }} />
                    )}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0, pb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 0.25 }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" display="block">{item.subtitle}</Typography>
                        <Typography variant="body2" fontWeight={700} noWrap>{item.title}</Typography>
                      </Box>
                      <Tag label="Success" variant="success" size="small" icon={<CheckCircleOutlineIcon sx={{ fontSize: 12 }} />} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {item.time} · {item.date}
                    </Typography>

                    {/* Sub-items */}
                    {(item.subItems?.length ?? 0) > 0 && (
                      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {item.subItems!.map((subItem, subIndex) => (
                          <Box key={subIndex} sx={{ display: 'flex', gap: 1.5 }}>
                            <Box sx={{ width: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative' }}>
                              {/* Line connecting to parent */}
                              {subIndex < item.subItems!.length - 1 && (
                                <Box sx={{ position: 'absolute', top: 10, bottom: -8, width: 2, bgcolor: 'divider', left: '50%', transform: 'translateX(-1px)' }} />
                              )}
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.25, flexShrink: 0, position: 'relative', zIndex: 1 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                                <Typography variant="caption" fontWeight={700}>{subItem.type}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>{subItem.description}</Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                                {subItem.time} · {subItem.date}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Paper>

        {/* Comments Card */}
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#ffffff' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Comments</Typography>
          <Box sx={{ py: 2, textAlign: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">No one has commented yet.</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <Avatar sx={{ width: 28, height: 28, fontSize: '0.65rem', flexShrink: 0 }}>KB</Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Say Something..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
