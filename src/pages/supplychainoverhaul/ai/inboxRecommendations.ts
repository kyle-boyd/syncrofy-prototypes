import type {
  RecommendationConfidence,
  RecommendationAction,
  RecommendationProvenanceChip,
} from './RecommendationCard';

export interface InboxRecommendation {
  confidence: RecommendationConfidence;
  headline: string;
  reasoning: string;
  /** 2–4 evidence chips. "Show your work" surface beneath reasoning. */
  provenance: RecommendationProvenanceChip[];
  /** label only — the actual onClick is wired in the page */
  primaryLabel: string;
  /** past-tense label shown after commit */
  committedLabel: string;
  alternatives?: { label: string }[];
}

/**
 * One recommendation per fixture exception. Variety enforced so the inbox
 * naturally exercises all four confidence states.
 */
export const inboxRecommendations: Record<string, InboxRecommendation> = {
  'EXC-001': {
    confidence: 'high',
    headline: 'Reassign + notify Priya Natarajan',
    reasoning:
      'Priya cleared 7 Walmart 856 mapping failures in last 30d, median 22m; truck arrives in 18m.',
    provenance: [
      { label: 'Priya · 7 prior fixes' },
      { label: 'Walmart Tier 1' },
      { label: 'OTIF SLA · 18m' },
    ],
    primaryLabel: 'Reassign + notify',
    committedLabel: 'Reassigned + notified Priya',
    alternatives: [{ label: 'Reassign…' }],
  },
  'EXC-002': {
    confidence: 'moderate',
    headline: 'Snooze 30m — partner ack received',
    reasoning:
      'Walmart ack landed 2m ago; EXC-001 mapping fix typically clears linked POs within 25m.',
    provenance: [
      { label: 'Linked to EXC-001' },
      { label: 'Walmart ack · 2m ago' },
      { label: 'Retry pending' },
    ],
    primaryLabel: 'Snooze 30m',
    committedLabel: 'Snoozed 30 minutes',
    alternatives: [{ label: 'Reassign + notify Priya' }],
  },
  'EXC-003': {
    confidence: 'high',
    headline: 'Escalate to McKesson trading-partner manager',
    reasoning:
      '3rd 855 reject this week with AK="not on contract"; pattern matches Q1 contract-sync incident.',
    provenance: [
      { label: '3 rejects in 7d' },
      { label: 'AK error code' },
      { label: 'McKesson TPM' },
    ],
    primaryLabel: 'Escalate',
    committedLabel: 'Escalated to TPM',
  },
  'EXC-004': {
    confidence: 'high',
    headline: 'Reassign to Daniel Park',
    reasoning:
      'Daniel resolved 9/10 Target invalid-DPCI exceptions in last 60d, median 41m; owns the item-master pipeline.',
    provenance: [
      { label: 'Daniel · 9/10 fix rate' },
      { label: 'Target item master' },
      { label: 'DPCI pipeline owner' },
    ],
    primaryLabel: 'Reassign',
    committedLabel: 'Reassigned to Daniel Park',
  },
  'EXC-005': {
    confidence: 'moderate',
    headline: 'Auto-merge with INV-92841',
    reasoning:
      'INV-92841 freight credit posted 4h ago totals $3,220.18 — exact match to the variance on PO COS-4421.',
    provenance: [
      { label: 'INV-92841 · $3,220.18' },
      { label: 'Exact variance match' },
      { label: 'Freight credit · 4h ago' },
    ],
    primaryLabel: 'Auto-merge',
    committedLabel: 'Merged with INV-92841',
    alternatives: [{ label: 'Open variance…' }],
  },
  'EXC-006': {
    confidence: 'moderate',
    headline: 'Request 856 redelivery from Home Depot',
    reasoning:
      'Home Depot ops confirmed pack-structure fix at 13:40; 5/6 prior redelivery requests this quarter validated on first resend.',
    provenance: [
      { label: 'Partner fix · 13:40' },
      { label: '5/6 prior redeliveries' },
      { label: 'SSCC-18 prefix' },
    ],
    primaryLabel: 'Request redelivery',
    committedLabel: 'Redelivery requested',
  },
  'EXC-007': {
    confidence: 'exploratory',
    headline: 'Re-run with parser v2',
    reasoning:
      'Parser v2 cleared unrecognized N1 qualifiers in 3/4 prior CVS-class cases — small sample, CVS not yet in v2 cohort.',
    provenance: [
      { label: 'Parser v2 · 3/4 prior' },
      { label: 'CVS not in v2 cohort' },
      { label: 'N1 qualifier DV' },
    ],
    primaryLabel: 'Re-run parser',
    committedLabel: 'Parser v2 re-run',
  },
  'EXC-008': {
    confidence: 'none',
    headline: '',
    reasoning: '',
    provenance: [],
    primaryLabel: 'Choose action',
    committedLabel: 'Action taken',
    alternatives: [{ label: 'Snooze' }, { label: 'Resolve' }, { label: 'Escalate' }],
  },
  'EXC-009': {
    confidence: 'high',
    headline: 'Auto-resolve — collapse duplicate',
    reasoning:
      'Control number BIG02=5510 received twice in 4 min with byte-identical line items; matches duplicate-collapse threshold.',
    provenance: [
      { label: 'BIG02=5510 · 2 copies' },
      { label: '4 min apart' },
      { label: 'Identical line items' },
    ],
    primaryLabel: 'Collapse duplicate',
    committedLabel: 'Duplicate collapsed',
  },
  'EXC-010': {
    confidence: 'moderate',
    headline: 'Open variance reconciliation',
    reasoning:
      '6-unit shortfall on SKU-77124 matches a 3PL zone-B sortation miscount pattern; 4/5 prior shortfalls recovered within 24h.',
    provenance: [
      { label: 'SKU-77124' },
      { label: '3PL zone B pattern' },
      { label: '4/5 prior recoveries' },
    ],
    primaryLabel: 'Open reconciliation',
    committedLabel: 'Reconciliation opened',
  },
  'EXC-011': {
    confidence: 'exploratory',
    headline: 'Add auto-snooze rule for Target 997 < 30m late',
    reasoning:
      'Target 997 has been 15–30m late 4 times in last 7d; Target scorecard often forgives <30m, but sample is thin.',
    provenance: [
      { label: '4 occurrences · 7d' },
      { label: 'Target scorecard' },
      { label: 'Small sample' },
    ],
    primaryLabel: 'Suggest rule',
    committedLabel: 'Rule suggestion drafted',
  },
  'EXC-012': {
    confidence: 'none',
    headline: '',
    reasoning: '',
    provenance: [],
    primaryLabel: 'Choose action',
    committedLabel: 'Action taken',
    alternatives: [{ label: 'Resolve' }, { label: 'Snooze 24h' }],
  },
};

export function buildPrimaryAction(rec: InboxRecommendation, onCommit: () => void): RecommendationAction {
  return { label: rec.primaryLabel, onClick: onCommit };
}
