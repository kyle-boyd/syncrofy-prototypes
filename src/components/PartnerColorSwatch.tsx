import { useState } from 'react';
import { Box, Typography, Popover, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { CHART_COLORS } from './TileCharts';
import { usePartnerColors, setPartnerColor, clearPartnerColor, PARTNER_COLOR_NAMES } from '../partnerColorStore';

interface PartnerColorSwatchProps {
  partnerName: string;
  size?: number;
}

export function PartnerColorSwatch({ partnerName, size = 20 }: PartnerColorSwatchProps) {
  const partnerColors = usePartnerColors();
  const color = partnerColors[partnerName];
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title={color ? PARTNER_COLOR_NAMES[color] ?? color : 'Set color'}>
        <Box
          onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget); }}
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            bgcolor: color ?? 'transparent',
            border: color ? '1.5px solid rgba(0,0,0,0.15)' : '1.5px dashed rgba(0,0,0,0.25)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'transform 0.1s',
            '&:hover': { transform: 'scale(1.2)' },
          }}
        />
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 1.5, borderRadius: 2, boxShadow: 3 } }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
          Partner Color
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0.75, mb: 1 }}>
          {CHART_COLORS.map((c) => {
            const active = color === c;
            return (
              <Tooltip key={c} title={PARTNER_COLOR_NAMES[c] ?? c}>
                <Box
                  onClick={() => { setPartnerColor(partnerName, c); setAnchor(null); }}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: c,
                    cursor: 'pointer',
                    border: active ? '2px solid' : '1.5px solid rgba(0,0,0,0.1)',
                    borderColor: active ? 'primary.main' : undefined,
                    outline: active ? '2px solid' : 'none',
                    outlineColor: active ? 'primary.light' : undefined,
                    transition: 'transform 0.1s',
                    '&:hover': { transform: 'scale(1.2)' },
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
        {color && (
          <Box
            onClick={() => { clearPartnerColor(partnerName); setAnchor(null); }}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
              color: 'text.secondary', borderTop: '1px solid', borderColor: 'divider', pt: 1,
              '&:hover': { color: 'text.primary' },
            }}
          >
            <ClearIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">Clear color</Typography>
          </Box>
        )}
      </Popover>
    </>
  );
}
