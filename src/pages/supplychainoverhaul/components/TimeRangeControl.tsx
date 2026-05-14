import { FormControl, MenuItem, Select } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

export type TimeRangeValue =
  | 'today'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom';

export const TIME_RANGE_LABELS: Record<TimeRangeValue, string> = {
  today: 'Today',
  last7: 'Last 7 days',
  last30: 'Last 30 days',
  thisMonth: 'This month',
  lastMonth: 'Last month',
  custom: 'Custom',
};

interface TimeRangeControlProps {
  value: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export function TimeRangeControl({
  value,
  onChange,
  disabled,
  size = 'small',
}: TimeRangeControlProps) {
  return (
    <FormControl size={size} disabled={disabled} sx={{ minWidth: 160 }}>
      <Select
        value={value}
        onChange={(e: SelectChangeEvent) => onChange(e.target.value as TimeRangeValue)}
        sx={{ bgcolor: 'background.paper' }}
      >
        {(Object.keys(TIME_RANGE_LABELS) as TimeRangeValue[]).map((key) => (
          <MenuItem key={key} value={key}>
            {TIME_RANGE_LABELS[key]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function timeRangeToDays(value: TimeRangeValue): number {
  switch (value) {
    case 'today':
      return 1;
    case 'last7':
      return 7;
    case 'last30':
      return 30;
    case 'thisMonth':
      return 30;
    case 'lastMonth':
      return 30;
    case 'custom':
      return 30;
  }
}
