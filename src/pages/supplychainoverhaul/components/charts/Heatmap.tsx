import { Box, Tooltip, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ChartEmptyState } from './ChartEmptyState';

export interface HeatmapCell {
  rowKey: string;
  colKey: string;
  value: number;
}

interface HeatmapProps {
  rows: { key: string; label: string }[];
  cols: { key: string; label: string }[];
  cells: HeatmapCell[];
  onCellClick?: (cell: HeatmapCell) => void;
  cellLabelFormatter?: (cell: HeatmapCell) => string;
  emptyMessage?: string;
}

export function Heatmap({
  rows,
  cols,
  cells,
  onCellClick,
  cellLabelFormatter,
  emptyMessage,
}: HeatmapProps) {
  const theme = useTheme();
  if (!cells.length) return <ChartEmptyState message={emptyMessage} />;

  const max = Math.max(...cells.map((c) => c.value));
  const cellMap = new Map<string, HeatmapCell>();
  for (const c of cells) cellMap.set(`${c.rowKey}::${c.colKey}`, c);

  const accent = theme.palette.primary.main;

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `minmax(180px, 220px) repeat(${cols.length}, minmax(64px, 1fr))`,
          gap: 0.5,
          minWidth: 180 + cols.length * 64,
        }}
      >
        <Box />
        {cols.map((col) => (
          <Box key={col.key} sx={{ px: 0.5, pb: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: 10,
                lineHeight: 1.2,
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              {col.label}
            </Typography>
          </Box>
        ))}

        {rows.map((row) => (
          <Box key={row.key} sx={{ display: 'contents' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                pr: 1,
                py: 0.5,
                color: 'text.primary',
                fontSize: 12,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {row.label}
            </Box>
            {cols.map((col) => {
              const cell = cellMap.get(`${row.key}::${col.key}`);
              const value = cell?.value ?? 0;
              const intensity = max === 0 ? 0 : value / max;
              const bg = alpha(accent, 0.08 + intensity * 0.72);
              const tooltipLabel = cell
                ? cellLabelFormatter
                  ? cellLabelFormatter(cell)
                  : `${row.label} · ${col.label}: ${value}`
                : `${row.label} · ${col.label}: 0`;
              return (
                <Tooltip key={col.key} title={tooltipLabel} arrow>
                  <Box
                    role={onCellClick ? 'button' : undefined}
                    tabIndex={onCellClick ? 0 : -1}
                    onClick={onCellClick && cell ? () => onCellClick(cell) : undefined}
                    onKeyDown={(e) => {
                      if (!onCellClick || !cell) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onCellClick(cell);
                      }
                    }}
                    sx={{
                      bgcolor: bg,
                      borderRadius: 0.5,
                      height: 32,
                      cursor: onCellClick ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      color: intensity > 0.55 ? '#fff' : theme.palette.text.primary,
                      transition: 'transform 0.1s ease',
                      '&:hover': {
                        transform: onCellClick ? 'scale(1.05)' : 'none',
                      },
                    }}
                  >
                    {value > 0 ? value : ''}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
