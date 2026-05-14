import { useTheme } from '@mui/material/styles';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartEmptyState } from './ChartEmptyState';

interface SparklineProps {
  data: number[];
  height?: number;
  width?: number | string;
  color?: string;
  showTooltip?: boolean;
  formatter?: (v: number) => string;
}

export function Sparkline({
  data,
  height = 32,
  width = '100%',
  color,
  showTooltip = false,
  formatter,
}: SparklineProps) {
  const theme = useTheme();

  if (!data.length) return <ChartEmptyState height={height} />;

  const stroke = color ?? theme.palette.primary.main;
  const series = data.map((v, i) => ({ x: i, y: v }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: `1px solid ${theme.palette.divider}`,
                fontSize: 11,
                padding: '4px 8px',
              }}
              formatter={(v: number) => (formatter ? formatter(v) : v)}
              labelFormatter={() => ''}
            />
          )}
          <Line
            type="monotone"
            dataKey="y"
            stroke={stroke}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
