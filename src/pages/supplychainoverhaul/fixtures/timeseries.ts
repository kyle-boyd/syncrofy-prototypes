// Deterministic, seed-based time series fixtures for the Reports surface.
// All randomness flows through mulberry32 so reloads produce identical data.

const TODAY_ISO = '2026-05-06';

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isoDay(daysAgo: number): string {
  const d = new Date(TODAY_ISO + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function isWeekend(iso: string): boolean {
  const d = new Date(iso + 'T00:00:00Z').getUTCDay();
  return d === 0 || d === 6;
}

export const REPORT_PARTNERS: { id: string; name: string; tier: 1 | 2 | 3 }[] = [
  { id: 'p-walmart', name: 'Walmart', tier: 1 },
  { id: 'p-target', name: 'Target', tier: 1 },
  { id: 'p-costco', name: 'Costco', tier: 1 },
  { id: 'p-homedepot', name: 'Home Depot', tier: 2 },
  { id: 'p-kroger', name: 'Kroger', tier: 2 },
  { id: 'p-mckesson', name: 'McKesson', tier: 2 },
  { id: 'p-cvs', name: 'CVS', tier: 2 },
  { id: 'p-walgreens', name: 'Walgreens', tier: 2 },
  { id: 'p-abc3pl', name: 'ABC Warehousing 3PL', tier: 3 },
];

export const TOP_ERROR_TYPES = [
  'ASN late',
  'PO quantity mismatch',
  'Invalid SSCC label',
  'Invoice price variance',
  'Missing acknowledgment',
  'Catalog item unknown',
  'Pack structure mismatch',
  'Missing ASN',
  'Duplicate transaction',
  'GLN mismatch',
] as const;

export type ErrorType = (typeof TOP_ERROR_TYPES)[number];

export const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'] as const;
export type Severity = (typeof SEVERITIES)[number];

export const SLA_METRICS = ['asnTimeliness', 'ackTimeliness', 'invoiceMatch'] as const;
export type SLAMetric = (typeof SLA_METRICS)[number];

export const CONFIDENCE_LEVELS = ['high', 'moderate', 'exploratory'] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  value: number;
  isToday?: boolean;
}

// ---- Generators ---------------------------------------------------------

function buildDailyExceptionVolume(): DailyPoint[] {
  const rng = mulberry32(hashSeed('exception-volume-daily'));
  const out: DailyPoint[] = [];
  // Anomalous spike day: 3 days ago
  const spikeDayIndex = 3;
  for (let i = 29; i >= 0; i--) {
    const date = isoDay(i);
    const weekend = isWeekend(date);
    const base = weekend ? 28 : 78;
    const jitter = Math.round((rng() - 0.5) * (weekend ? 12 : 24));
    let value = base + jitter;
    if (i === spikeDayIndex) value = Math.round(value * 1.85); // anomaly spike
    out.push({ date, value, isToday: i === 0 });
  }
  return out;
}

function buildHourlyToday(): { hour: number; value: number; isNow?: boolean }[] {
  const rng = mulberry32(hashSeed('exception-volume-hourly'));
  const nowHour = 14;
  const out: { hour: number; value: number; isNow?: boolean }[] = [];
  for (let h = 0; h < 24; h++) {
    const businessHours = h >= 8 && h <= 18;
    const base = businessHours ? 7 : 1.5;
    const jitter = rng() * (businessHours ? 4 : 1.5);
    const value = Math.max(0, Math.round(base + jitter));
    out.push({ hour: h, value, isNow: h === nowHour });
  }
  return out;
}

export interface PartnerDayPoint {
  date: string;
  partnerId: string;
  value: number;
}

function buildExceptionsByPartnerDaily(): PartnerDayPoint[] {
  const out: PartnerDayPoint[] = [];
  for (const p of REPORT_PARTNERS) {
    const rng = mulberry32(hashSeed('partner-daily:' + p.id));
    const tierBase = p.tier === 1 ? 14 : p.tier === 2 ? 8 : 4;
    for (let i = 29; i >= 0; i--) {
      const date = isoDay(i);
      const weekend = isWeekend(date);
      const base = weekend ? tierBase * 0.4 : tierBase;
      const jitter = (rng() - 0.5) * tierBase * 0.6;
      out.push({ date, partnerId: p.id, value: Math.max(0, Math.round(base + jitter)) });
    }
  }
  return out;
}

export interface ErrorTypeDayPoint {
  date: string;
  errorType: ErrorType;
  value: number;
}

function buildExceptionsByErrorTypeDaily(): ErrorTypeDayPoint[] {
  const out: ErrorTypeDayPoint[] = [];
  TOP_ERROR_TYPES.forEach((errorType, idx) => {
    const rng = mulberry32(hashSeed('etype-daily:' + errorType));
    const base = 18 - idx * 1.4;
    // Some types have positive trend, some flat, some declining
    const trendSlope = idx % 3 === 0 ? 0.18 : idx % 3 === 1 ? 0 : -0.08;
    for (let i = 29; i >= 0; i--) {
      const date = isoDay(i);
      const weekend = isWeekend(date);
      const dayIdx = 29 - i;
      const trended = base + dayIdx * trendSlope;
      const weekendFactor = weekend ? 0.45 : 1;
      const jitter = (rng() - 0.5) * 4;
      out.push({
        date,
        errorType,
        value: Math.max(0, Math.round(trended * weekendFactor + jitter)),
      });
    }
  });
  return out;
}

export interface SeverityDayPoint {
  date: string;
  severity: Severity;
  mttrMinutes: number;
}

function buildMttrBySeverityDaily(): SeverityDayPoint[] {
  const out: SeverityDayPoint[] = [];
  const baseBySeverity: Record<Severity, number> = {
    Critical: 18,
    High: 38,
    Medium: 92,
    Low: 220,
  };
  for (const severity of SEVERITIES) {
    const rng = mulberry32(hashSeed('mttr:' + severity));
    for (let i = 29; i >= 0; i--) {
      const date = isoDay(i);
      const base = baseBySeverity[severity];
      const jitter = (rng() - 0.5) * base * 0.25;
      out.push({ date, severity, mttrMinutes: Math.max(1, Math.round(base + jitter)) });
    }
  }
  return out;
}

export interface SLAPartnerDayPoint {
  date: string;
  partnerId: string;
  metric: SLAMetric;
  value: number; // percent 0-100
}

function buildSlaPartnerDaily(): SLAPartnerDayPoint[] {
  const out: SLAPartnerDayPoint[] = [];
  const baseByPartner: Record<string, number> = {
    'p-walmart': 95.2,
    'p-target': 97.4,
    'p-costco': 92.8,
    'p-homedepot': 96.1,
    'p-kroger': 95.5,
    'p-mckesson': 98.2,
    'p-cvs': 96.7,
    'p-walgreens': 94.3,
    'p-abc3pl': 91.5,
  };
  for (const p of REPORT_PARTNERS) {
    for (const metric of SLA_METRICS) {
      const rng = mulberry32(hashSeed(`sla:${p.id}:${metric}`));
      const baseline = baseByPartner[p.id] ?? 95;
      // Each metric varies a bit
      const metricOffset = metric === 'asnTimeliness' ? -0.4 : metric === 'ackTimeliness' ? 1.1 : 0.2;
      for (let i = 29; i >= 0; i--) {
        const date = isoDay(i);
        const jitter = (rng() - 0.5) * 3;
        const v = Math.max(80, Math.min(100, baseline + metricOffset + jitter));
        out.push({ date, partnerId: p.id, metric, value: Number(v.toFixed(2)) });
      }
    }
  }
  return out;
}

export interface AIAcceptanceDayPoint {
  date: string;
  confidence: ConfidenceLevel;
  shown: number;
  accepted: number;
}

function buildAiAcceptanceDaily(): AIAcceptanceDayPoint[] {
  const out: AIAcceptanceDayPoint[] = [];
  const acceptanceByConfidence: Record<ConfidenceLevel, number> = {
    high: 0.91,
    moderate: 0.64,
    exploratory: 0.22,
  };
  const shownByConfidence: Record<ConfidenceLevel, number> = {
    high: 28,
    moderate: 18,
    exploratory: 9,
  };
  for (const confidence of CONFIDENCE_LEVELS) {
    const rng = mulberry32(hashSeed('ai-daily:' + confidence));
    for (let i = 29; i >= 0; i--) {
      const date = isoDay(i);
      const baseShown = shownByConfidence[confidence];
      const shown = Math.max(1, Math.round(baseShown + (rng() - 0.5) * baseShown * 0.4));
      const acceptanceRate = Math.max(
        0,
        Math.min(1, acceptanceByConfidence[confidence] + (rng() - 0.5) * 0.12),
      );
      const accepted = Math.round(shown * acceptanceRate);
      out.push({ date, confidence, shown, accepted });
    }
  }
  return out;
}

export interface AIAcceptanceByType {
  type: string;
  suggestedAction: string;
  mostCommonActualAction: string;
  occurrences: number;
  accepted: number;
  dismissed: number;
  overridden: number;
}

const RECOMMENDATION_TYPES: AIAcceptanceByType[] = [
  {
    type: 'Auto-retry with corrected payload',
    suggestedAction: 'Resubmit transaction',
    mostCommonActualAction: 'Resubmit transaction',
    occurrences: 142,
    accepted: 118,
    dismissed: 14,
    overridden: 10,
  },
  {
    type: 'Route to partner contact',
    suggestedAction: 'Email primary EDI contact',
    mostCommonActualAction: 'Email primary EDI contact',
    occurrences: 96,
    accepted: 81,
    dismissed: 9,
    overridden: 6,
  },
  {
    type: 'Apply mapping override',
    suggestedAction: 'Apply suggested mapping',
    mostCommonActualAction: 'Apply suggested mapping',
    occurrences: 73,
    accepted: 59,
    dismissed: 7,
    overridden: 7,
  },
  {
    type: 'Adjust threshold',
    suggestedAction: 'Raise variance to 3%',
    mostCommonActualAction: 'Manual review only',
    occurrences: 64,
    accepted: 28,
    dismissed: 18,
    overridden: 18,
  },
  {
    type: 'Suppress recurring noise',
    suggestedAction: 'Mute pattern 30 days',
    mostCommonActualAction: 'Mute pattern 30 days',
    occurrences: 58,
    accepted: 47,
    dismissed: 6,
    overridden: 5,
  },
  {
    type: 'Escalate to account manager',
    suggestedAction: 'Notify AM with summary',
    mostCommonActualAction: 'Resolve in queue',
    occurrences: 52,
    accepted: 19,
    dismissed: 22,
    overridden: 11,
  },
  {
    type: 'Consolidate duplicate transactions',
    suggestedAction: 'Merge duplicates',
    mostCommonActualAction: 'Merge duplicates',
    occurrences: 41,
    accepted: 36,
    dismissed: 3,
    overridden: 2,
  },
];

export const exceptionVolumeDaily: DailyPoint[] = buildDailyExceptionVolume();
export const exceptionVolumeHourlyToday = buildHourlyToday();
export const exceptionsByPartnerDaily: PartnerDayPoint[] = buildExceptionsByPartnerDaily();
export const exceptionsByErrorTypeDaily: ErrorTypeDayPoint[] = buildExceptionsByErrorTypeDaily();
export const mttrBySeverityDaily: SeverityDayPoint[] = buildMttrBySeverityDaily();
export const slaCompliancePartnerDaily: SLAPartnerDayPoint[] = buildSlaPartnerDaily();
export const aiAcceptanceDaily: AIAcceptanceDayPoint[] = buildAiAcceptanceDaily();
export const aiAcceptanceByType = RECOMMENDATION_TYPES;

// ---- Aggregates --------------------------------------------------------

export function sumLastNDays(points: DailyPoint[], n: number): number {
  return points.slice(-n).reduce((acc, p) => acc + p.value, 0);
}

export function avgLastNDays(points: DailyPoint[], n: number): number {
  if (n === 0) return 0;
  return sumLastNDays(points, n) / n;
}

export function todayValue(points: DailyPoint[]): number {
  return points[points.length - 1]?.value ?? 0;
}

export function partnerTotalsForDay(date: string) {
  const totals = new Map<string, number>();
  for (const row of exceptionsByPartnerDaily) {
    if (row.date !== date) continue;
    totals.set(row.partnerId, (totals.get(row.partnerId) ?? 0) + row.value);
  }
  return totals;
}

export function partnerAvgOverDays(partnerId: string, days: number): number {
  const subset = exceptionsByPartnerDaily.filter((r) => r.partnerId === partnerId).slice(-days);
  if (!subset.length) return 0;
  return subset.reduce((a, b) => a + b.value, 0) / subset.length;
}

export function errorTypeTotalsForDay(date: string) {
  const totals = new Map<ErrorType, number>();
  for (const row of exceptionsByErrorTypeDaily) {
    if (row.date !== date) continue;
    totals.set(row.errorType, (totals.get(row.errorType) ?? 0) + row.value);
  }
  return totals;
}

export function errorTypeTotalsOverRange(days: number) {
  const totals = new Map<ErrorType, number>();
  for (const et of TOP_ERROR_TYPES) {
    const subset = exceptionsByErrorTypeDaily.filter((r) => r.errorType === et).slice(-days);
    totals.set(et, subset.reduce((a, b) => a + b.value, 0));
  }
  return totals;
}

export function errorTypeSlope(errorType: ErrorType, days: number): number {
  const subset = exceptionsByErrorTypeDaily.filter((r) => r.errorType === errorType).slice(-days);
  if (subset.length < 2) return 0;
  const half = Math.floor(subset.length / 2);
  const firstAvg = subset.slice(0, half).reduce((a, b) => a + b.value, 0) / Math.max(1, half);
  const secondAvg =
    subset.slice(half).reduce((a, b) => a + b.value, 0) / Math.max(1, subset.length - half);
  return secondAvg - firstAvg;
}

export const TODAY = TODAY_ISO;
