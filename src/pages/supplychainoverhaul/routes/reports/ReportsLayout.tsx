import { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Snackbar, Stack, Typography } from '@mui/material';
import { Download } from 'lucide-react';
import { Tabs } from '@design-system';
import { SupplyChainPageLayout } from '../../components/nav/SupplyChainPageLayout';
import { TimeRangeControl, type TimeRangeValue } from '../../components/TimeRangeControl';

interface ReportsContextValue {
  timeRange: TimeRangeValue;
  setTimeRange: (v: TimeRangeValue) => void;
  timeRangeLocked: boolean;
  setTimeRangeLocked: (locked: boolean, fixedValue?: TimeRangeValue) => void;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function useReportsContext(defaultRange: TimeRangeValue) {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReportsContext must be used inside ReportsLayout');
  // Each dashboard registers its preferred default on first mount.
  return ctx;
}

const TAB_DEFS = [
  { label: 'Operations Today', value: 'operations', path: '/supplychainoverhaul/reports/operations' },
  { label: 'SLA Compliance', value: 'sla', path: '/supplychainoverhaul/reports/sla' },
  { label: 'Partner Health', value: 'partner-health', path: '/supplychainoverhaul/reports/partner-health' },
  { label: 'Error Patterns', value: 'error-patterns', path: '/supplychainoverhaul/reports/error-patterns' },
  { label: 'AI Performance', value: 'ai-performance', path: '/supplychainoverhaul/reports/ai-performance' },
];

export default function ReportsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeRange, setTimeRangeState] = useState<TimeRangeValue>('last30');
  const [timeRangeLocked, setLocked] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const activeTab = useMemo(() => {
    const match = TAB_DEFS.find((t) => location.pathname.startsWith(t.path));
    return match?.value ?? 'operations';
  }, [location.pathname]);

  const setTimeRange = useCallback((v: TimeRangeValue) => setTimeRangeState(v), []);
  const setTimeRangeLocked = useCallback(
    (locked: boolean, fixedValue?: TimeRangeValue) => {
      setLocked(locked);
      if (fixedValue) setTimeRangeState(fixedValue);
    },
    [],
  );

  const ctx: ReportsContextValue = { timeRange, setTimeRange, timeRangeLocked, setTimeRangeLocked };

  return (
    <SupplyChainPageLayout>
      <ReportsContext.Provider value={ctx}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Reports
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TimeRangeControl
                value={timeRange}
                onChange={setTimeRange}
                disabled={timeRangeLocked}
              />
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Download size={16} />}
                onClick={() => setToastOpen(true)}
              >
                Export
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Tabs
              tabs={TAB_DEFS.map((t) => ({ label: t.label, value: t.value }))}
              value={activeTab}
              onChange={(_, v) => {
                const next = TAB_DEFS.find((t) => t.value === v);
                if (next) navigate(next.path);
              }}
              variant="scrollable"
              scrollButtons="auto"
            />
          </Box>

          <Box>
            <Outlet />
          </Box>
        </Stack>

        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          message="Export not implemented in prototype"
        />
      </ReportsContext.Provider>
    </SupplyChainPageLayout>
  );
}

export { ReportsContext };
