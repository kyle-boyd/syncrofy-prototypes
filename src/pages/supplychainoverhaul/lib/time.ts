export type TimeSeverity = 'critical' | 'warn' | 'neutral';

export interface FormattedTimeToBreach {
  label: string;
  severity: TimeSeverity;
}

/**
 * Formats minutes-to-breach as "12m", "2h 4m", "1d 3h" and a severity hint:
 *  - critical: < 30 min remaining (or already breached)
 *  - warn:     < 120 min remaining
 *  - neutral:  otherwise
 */
export function formatTimeToBreach(minutes: number): FormattedTimeToBreach {
  const breached = minutes < 0;
  const abs = Math.abs(minutes);

  let body: string;
  if (abs < 1) body = '<1m';
  else if (abs < 60) body = `${Math.round(abs)}m`;
  else if (abs < 60 * 24) {
    const h = Math.floor(abs / 60);
    const m = Math.round(abs % 60);
    body = m ? `${h}h ${m}m` : `${h}h`;
  } else {
    const d = Math.floor(abs / (60 * 24));
    const h = Math.round((abs % (60 * 24)) / 60);
    body = h ? `${d}d ${h}h` : `${d}d`;
  }

  const label = breached ? `Breached ${body} ago` : body;

  let severity: TimeSeverity;
  if (breached || minutes < 30) severity = 'critical';
  else if (minutes < 120) severity = 'warn';
  else severity = 'neutral';

  return { label, severity };
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
