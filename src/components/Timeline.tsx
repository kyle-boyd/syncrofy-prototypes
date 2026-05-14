import React from 'react';
import { Box, Typography } from '@mui/material';

export type TimelineDotColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'grey';

export interface TimelineEntry {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: string;
  author?: string;
  icon?: React.ReactNode;
  color?: TimelineDotColor;
}

export interface TimelineProps {
  entries: TimelineEntry[];
  dense?: boolean;
}

const colorToken = (c: TimelineDotColor) =>
  c === 'grey' ? 'grey.400' : `${c}.main`;

export function Timeline({ entries, dense }: TimelineProps) {
  const gap = dense ? 1.5 : 2.5;
  return (
    <Box sx={{ position: 'relative', pl: 3 }}>
      <Box
        sx={{
          position: 'absolute',
          left: 11,
          top: 6,
          bottom: 6,
          width: '2px',
          bgcolor: 'divider',
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap }}>
        {entries.map((e) => (
          <Box key={e.id} sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                left: -22,
                top: 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: colorToken(e.color ?? 'primary'),
                color: colorToken(e.color ?? 'primary'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}
            >
              {e.icon}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {e.title}
              </Typography>
              {e.timestamp && (
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {e.timestamp}
                </Typography>
              )}
            </Box>
            {e.author && (
              <Typography variant="caption" color="text.secondary">
                {e.author}
              </Typography>
            )}
            {e.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {e.description}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Timeline;
