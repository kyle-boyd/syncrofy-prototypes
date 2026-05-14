export type RecommendationType =
  | 'reassign'
  | 'snooze'
  | 'escalate'
  | 'resolve'
  | 'rule-suggested'
  | 'request-redelivery'
  | 'categorize-sender';

export type RecommendationConfidence = 'high' | 'moderate' | 'exploratory';

export type RecommendationStatus = 'accepted' | 'dismissed' | 'overridden';

export interface Recommendation {
  id: string;
  timestamp: string;
  type: RecommendationType;
  exceptionId: string;
  headline: string;
  reasoning: string;
  confidence: RecommendationConfidence;
  status: RecommendationStatus;
  operator: string;
  /** Set when status === 'overridden'. The action the operator chose instead. */
  actionTaken?: RecommendationType;
}

/**
 * 25 historical recommendations spanning the last 14 days.
 * Distribution: 15 accepted (60%), 6 dismissed (24%), 4 overridden (16%).
 */
export const recommendations: Recommendation[] = [
  // ── Accepted (15) ──────────────────────────────────────────────────────────
  {
    id: 'REC-001',
    timestamp: '2026-04-22T14:08:00Z',
    type: 'reassign',
    exceptionId: 'EXC-h-2204',
    headline: 'Reassign to Priya Natarajan',
    reasoning: 'Priya has resolved 7 Walmart ASN issues in the last 30 days with median time-to-resolution of 22 minutes.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Marcus Doyle',
  },
  {
    id: 'REC-002',
    timestamp: '2026-04-23T09:42:00Z',
    type: 'request-redelivery',
    exceptionId: 'EXC-h-2208',
    headline: 'Request 850 redelivery from Target',
    reasoning: 'Document failed checksum validation; Target redelivery typically arrives within 6 minutes.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Sara Chen',
  },
  {
    id: 'REC-003',
    timestamp: '2026-04-23T16:21:00Z',
    type: 'resolve',
    exceptionId: 'EXC-h-2211',
    headline: 'Auto-resolve — late 997 within tolerance',
    reasoning: 'Partner SLA is 4 hours; ack arrived at 3h 51m. No chargeback exposure.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Priya Natarajan',
  },
  {
    id: 'REC-004',
    timestamp: '2026-04-24T11:03:00Z',
    type: 'escalate',
    exceptionId: 'EXC-h-2218',
    headline: 'Escalate to McKesson trading partner manager',
    reasoning: '3rd 855 rejection from McKesson this week with same AK reason code; pattern suggests contract sync issue.',
    confidence: 'moderate',
    status: 'accepted',
    operator: 'Jamal Reyes',
  },
  {
    id: 'REC-005',
    timestamp: '2026-04-24T18:55:00Z',
    type: 'reassign',
    exceptionId: 'EXC-h-2221',
    headline: 'Reassign to Jamal Reyes',
    reasoning: 'Jamal owns the McKesson partner channel and has open context on contract changes.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Marcus Doyle',
  },
  {
    id: 'REC-006',
    timestamp: '2026-04-25T08:30:00Z',
    type: 'snooze',
    exceptionId: 'EXC-h-2225',
    headline: 'Snooze 4h — partner outage notice received',
    reasoning: 'Walgreens posted a known outage window 08:00–12:00 ET; retry after.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Sara Chen',
  },
  {
    id: 'REC-007',
    timestamp: '2026-04-25T15:12:00Z',
    type: 'resolve',
    exceptionId: 'EXC-h-2229',
    headline: 'Auto-resolve — duplicate PO collapsed',
    reasoning: 'Duplicate detected by control-number match; second copy discarded with audit trail.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Priya Natarajan',
  },
  {
    id: 'REC-008',
    timestamp: '2026-04-26T10:08:00Z',
    type: 'request-redelivery',
    exceptionId: 'EXC-h-2233',
    headline: 'Request 940 redelivery from CVS',
    reasoning: 'Parser improvement deployed; redelivery is likely to succeed.',
    confidence: 'moderate',
    status: 'accepted',
    operator: 'Sara Chen',
  },
  {
    id: 'REC-009',
    timestamp: '2026-04-27T13:44:00Z',
    type: 'reassign',
    exceptionId: 'EXC-h-2240',
    headline: 'Reassign to Marcus Doyle',
    reasoning: 'Marcus is the primary on Costco invoice variance; current owner is on PTO.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Priya Natarajan',
  },
  {
    id: 'REC-010',
    timestamp: '2026-04-28T09:55:00Z',
    type: 'escalate',
    exceptionId: 'EXC-h-2244',
    headline: 'Escalate — OTIF chargeback exposure > $5k',
    reasoning: 'Walmart OTIF threshold breach is imminent; loop in trading-partner manager.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Jamal Reyes',
  },
  {
    id: 'REC-011',
    timestamp: '2026-04-29T16:18:00Z',
    type: 'snooze',
    exceptionId: 'EXC-h-2248',
    headline: 'Snooze 1h — awaiting partner reply',
    reasoning: 'Operator confirmed Target replied via email; auto-resume in 60m.',
    confidence: 'moderate',
    status: 'accepted',
    operator: 'Sara Chen',
  },
  {
    id: 'REC-012',
    timestamp: '2026-04-30T11:02:00Z',
    type: 'rule-suggested',
    exceptionId: 'EXC-h-2253',
    headline: 'Suggest rule: auto-redeliver Target 850 on checksum failure',
    reasoning: '8/8 redeliveries in the last 14 days succeeded within 10 minutes.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Marcus Doyle',
  },
  {
    id: 'REC-013',
    timestamp: '2026-05-01T07:38:00Z',
    type: 'resolve',
    exceptionId: 'EXC-h-2257',
    headline: 'Auto-resolve — partner re-sent ASN',
    reasoning: 'Replacement 856 received 3 minutes ago and validated cleanly.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Priya Natarajan',
  },
  {
    id: 'REC-014',
    timestamp: '2026-05-02T14:21:00Z',
    type: 'reassign',
    exceptionId: 'EXC-h-2261',
    headline: 'Reassign to Jamal Reyes',
    reasoning: 'McKesson cluster — concentrate ownership for faster pattern recognition.',
    confidence: 'high',
    status: 'accepted',
    operator: 'Marcus Doyle',
  },
  {
    id: 'REC-015',
    timestamp: '2026-05-03T17:09:00Z',
    type: 'request-redelivery',
    exceptionId: 'EXC-h-2266',
    headline: 'Request 856 redelivery from Home Depot',
    reasoning: 'Pack-structure fix confirmed by partner ops; resend will validate.',
    confidence: 'moderate',
    status: 'accepted',
    operator: 'Sara Chen',
  },

  // ── Dismissed (6) ──────────────────────────────────────────────────────────
  {
    id: 'REC-016',
    timestamp: '2026-04-22T19:44:00Z',
    type: 'snooze',
    exceptionId: 'EXC-h-2206',
    headline: 'Snooze 24h — low-impact reference formatting',
    reasoning: 'Cosmetic 810 REF formatting; partner accepts with warning.',
    confidence: 'exploratory',
    status: 'dismissed',
    operator: 'Marcus Doyle',
  },
  {
    id: 'REC-017',
    timestamp: '2026-04-24T08:11:00Z',
    type: 'rule-suggested',
    exceptionId: 'EXC-h-2216',
    headline: 'Suggest rule: auto-snooze Kroger 997 lateness < 30m',
    reasoning: 'Pattern observed 4 times in 7 days, but sample size is small.',
    confidence: 'exploratory',
    status: 'dismissed',
    operator: 'Priya Natarajan',
  },
  {
    id: 'REC-018',
    timestamp: '2026-04-26T12:26:00Z',
    type: 'escalate',
    exceptionId: 'EXC-h-2231',
    headline: 'Escalate — repeated CVS 940 parse failures',
    reasoning: 'Parser fix is already in-flight per release notes.',
    confidence: 'moderate',
    status: 'dismissed',
    operator: 'Sara Chen',
  },
  {
    id: 'REC-019',
    timestamp: '2026-04-28T15:50:00Z',
    type: 'reassign',
    exceptionId: 'EXC-h-2242',
    headline: 'Reassign to Sara Chen',
    reasoning: 'Sara has bandwidth based on workload signals.',
    confidence: 'exploratory',
    status: 'dismissed',
    operator: 'Marcus Doyle',
  },
  {
    id: 'REC-020',
    timestamp: '2026-05-01T10:14:00Z',
    type: 'request-redelivery',
    exceptionId: 'EXC-h-2255',
    headline: 'Request 850 redelivery from Walgreens',
    reasoning: 'Recent redeliveries from Walgreens have been 50/50; uncertain ROI.',
    confidence: 'exploratory',
    status: 'dismissed',
    operator: 'Priya Natarajan',
  },
  {
    id: 'REC-021',
    timestamp: '2026-05-03T09:33:00Z',
    type: 'resolve',
    exceptionId: 'EXC-h-2263',
    headline: 'Auto-resolve — count variance under tolerance',
    reasoning: '0.5% variance is below the 1% threshold; safe to close.',
    confidence: 'moderate',
    status: 'dismissed',
    operator: 'Jamal Reyes',
  },

  // ── Overridden (4) ─────────────────────────────────────────────────────────
  {
    id: 'REC-022',
    timestamp: '2026-04-23T13:01:00Z',
    type: 'snooze',
    exceptionId: 'EXC-h-2210',
    headline: 'Snooze 2h — likely partner side',
    reasoning: 'Walmart support queue depth suggests delay is upstream.',
    confidence: 'moderate',
    status: 'overridden',
    operator: 'Marcus Doyle',
    actionTaken: 'escalate',
  },
  {
    id: 'REC-023',
    timestamp: '2026-04-27T11:46:00Z',
    type: 'reassign',
    exceptionId: 'EXC-h-2237',
    headline: 'Reassign to Priya Natarajan',
    reasoning: 'Highest historical resolution rate on Costco invoice variance.',
    confidence: 'high',
    status: 'overridden',
    operator: 'Sara Chen',
    actionTaken: 'resolve',
  },
  {
    id: 'REC-024',
    timestamp: '2026-04-30T15:28:00Z',
    type: 'rule-suggested',
    exceptionId: 'EXC-h-2251',
    headline: 'Suggest rule: auto-resolve duplicate POs by control number',
    reasoning: 'Detected 6 clean duplicate-collapse outcomes in 14 days.',
    confidence: 'moderate',
    status: 'overridden',
    operator: 'Jamal Reyes',
    actionTaken: 'resolve',
  },
  {
    id: 'REC-025',
    timestamp: '2026-05-04T08:55:00Z',
    type: 'request-redelivery',
    exceptionId: 'EXC-h-2270',
    headline: 'Request 856 redelivery from Walmart',
    reasoning: 'Mapping error fixed; retry should succeed.',
    confidence: 'moderate',
    status: 'overridden',
    operator: 'Priya Natarajan',
    actionTaken: 'reassign',
  },
];
