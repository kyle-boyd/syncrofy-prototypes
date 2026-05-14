import { useTheme } from '@mui/material/styles';
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartEmptyState } from './ChartEmptyState';

export interface LineSeries {
  key: string;
  label: string;
  color?: string;
}

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  series: LineSeries[];
  xKey: string;
  height?: number;
  yDomain?: [number | 'auto', number | 'auto'];
  referenceY?: { value: number; label?: string };
  highlightX?: string | number;
  yTickFormatter?: (v: number) => string;
  xTickFormatter?: (v: string | number) => string;
  tooltipValueFormatter?: (v: number) => string;
}

export function LineChart({
  data,
  series,
  xKey,
  height = 220,
  yDomain,
  referenceY,
  highlightX,
  yTickFormatter,
  xTickFormatter,
  tooltipValueFormatter,
}: LineChartProps) {
  const theme = useTheme();

  if (!data.length) return <ChartEmptyState height={height} />;

  const palette = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.primary.light,
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
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
          domain={yDomain}
          tickFormatter={yTickFormatter}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: `1px solid ${theme.palette.divider}`,
            fontSize: 12,
          }}
          formatter={(v: number) => (tooltipValueFormatter ? tooltipValueFormatter(v) : v)}
        />
        {referenceY !== undefined && (
          <ReferenceLine
            y={referenceY.value}
            stroke={theme.palette.text.secondary}
            strokeDasharray="4 4"
            label={
              referenceY.label
                ? { value: referenceY.label, fontSize: 10, fill: theme.palette.text.secondary, position: 'right' }
                : undefined
            }
          />
        )}
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color ?? palette[i % palette.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
            animationDuration={400}
          />
        ))}
        {highlightX !== undefined &&
          series.map((s, i) => {
            const point = data.find((d) => d[xKey] === highlightX);
            if (!point) return null;
            const v = point[s.key];
            if (typeof v !== 'number') return null;
            return (
              <ReferenceDot
                key={`hl-${s.key}`}
                x={highlightX}
                y={v}
                r={5}
                fill={s.color ?? palette[i % palette.length]}
                stroke={theme.palette.background.paper}
                strokeWidth={2}
              />
            );
          })}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
