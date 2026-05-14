import { useContext, useEffect } from 'react';
import { ReportsContext } from './ReportsLayout';
import type { TimeRangeValue } from '../../components/TimeRangeControl';

// On mount, set the default time range for this dashboard.
// If `lock` is true, the control becomes read-only (used by Operations Today).
export function useDashboardTimeRange(defaultValue: TimeRangeValue, lock = false) {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useDashboardTimeRange must be used inside ReportsLayout');

  useEffect(() => {
    ctx.setTimeRange(defaultValue);
    ctx.setTimeRangeLocked(lock, lock ? defaultValue : undefined);
    return () => ctx.setTimeRangeLocked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, lock]);

  return ctx.timeRange;
}
