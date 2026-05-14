import { useTheme } from '@mui/material/styles';
import {
  Bar,
  CartesianGrid,
  Cell,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartEmptyState } from './ChartEmptyState';

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  height?: number;
  layout?: 'horizontal' | 'vertical';
  highlightX?: string | number;
  highlightColor?: string;
  baseColor?: string;
  emphasizeRange?: { from: number; to: number };
  xTickFormatter?: (v: string | number) => string;
  tooltipValueFormatter?: (v: number) => string;
}

export function BarChart({
  data,
  xKey,
  yKey,
  height = 220,
  layout = 'horizontal',
  highlightX,
  highlightColor,
  baseColor,
  emphasizeRange,
  xTickFormatter,
  tooltipValueFormatter,
}: BarChartProps) {
  const theme = useTheme();
  if (!data.length) return <ChartEmptyState height={height} />;

  const fill = baseColor ?? theme.palette.primary.main;
  const dim = theme.palette.primary.light;
  const accent = highlightColor ?? theme.palette.warning.dark;

  const isVertical = layout === 'vertical';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 8, right: 12, left: isVertical ? 80 : 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={!isVertical}
          vertical={isVertical}
          stroke={theme.palette.divider}
        />
        {isVertical ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              tickLine={false}
              axisLine={false}
              tickFormatter={xTickFormatter}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 11, fill: theme.palette.text.primary }}
              tickLine={false}
              axisLine={false}
              width={120}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              tickLine={false}
              axisLine={{ stroke: theme.palette.divider }}
              tickFormatter={xTickFormatter}
            />
            <YAxis
              tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${theme.palette.divider}`,
            fontSize: 12,
          }}
          formatter={(v: number) => (tooltipValueFormatter ? tooltipValueFormatter(v) : v)}
          cursor={{ fill: theme.palette.action.hover }}
        />
        <Bar dataKey={yKey} radius={[4, 4, 0, 0]} isAnimationActive animationDuration={400}>
          {data.map((d, idx) => {
            let cellColor = fill;
            if (emphasizeRange) {
              const v = d[xKey];
              if (typeof v === 'number' && (v < emphasizeRange.from || v > emphasizeRange.to)) {
                cellColor = dim;
              }
            }
            if (highlightX !== undefined && d[xKey] === highlightX) {
              cellColor = accent;
            }
            return <Cell key={idx} fill={cellColor} />;
          })}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
