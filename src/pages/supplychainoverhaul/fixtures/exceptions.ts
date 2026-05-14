import type { Factor } from '../lib/priority';
import type { RecommendationConfidence } from '../ai/RecommendationCard';

export type EdiDocType = '850' | '855' | '856' | '810' | '940' | '997';

export type ExceptionType =
  | 'asn-late'
  | 'po-ack-rejected'
  | 'po-invalid-sku'
  | 'invoice-mismatch'
  | 'asn-missing-pack'
  | 'shipping-order-parse-failure'
  | 'ack-overdue'
  | 'duplicate-po'
  | 'count-variance'
  | 'late-ack'
  | 'reference-format';

export type TimelineState = 'ok' | 'pending' | 'breach' | 'warn' | 'info' | 'future';

export interface TimelineEntry {
  ts: string;
  event: string;
  state: TimelineState;
}

export interface TriageRecommendation {
  confidence: RecommendationConfidence;
  headline: string;
  reasoning: string;
  provenance: { label: string }[];
  primaryLabel: string;
  committedLabel: string;
}

export interface TriageMessage {
  role: 'user' | 'ai';
  content: string;
  recommendation?: TriageRecommendation;
}

export interface Exception {
  id: string;
  title: string;
  type: ExceptionType;
  ediDocType: EdiDocType;
  partnerId: string;
  poId: string;
  severity: Factor;
  ttb: Factor;
  impact: Factor;
  tier: Factor;
  breachInMinutes: number;
  age: string;
  assignee: string | null;
  description: string;
  impactNote: string;
  timeline: TimelineEntry[];
  triageRecommendation: TriageRecommendation;
  triageConversation: TriageMessage[];
}

export const exceptions: Exception[] = [
  // ── 3 critical (severity 5) ────────────────────────────────────────────────
  {
    id: 'EXC-001',
    title: 'Walmart 856 ASN late — PO 4521-1041',
    type: 'asn-late',
    ediDocType: '856',
    partnerId: 'p-walmart',
    poId: 'PO-WMT-1041',
    severity: 5,
    ttb: 5,
    impact: 5,
    tier: 5,
    breachInMinutes: 18,
    age: '3h 12m',
    assignee: 'Priya Natarajan',
    description: 'ASN for PO 4521-1041 has not been transmitted. Walmart requires 856 at least 1 hour before truck arrival; receiver expects delivery in 18 minutes.',
    impactNote: '$142,000 shipment risks OTIF chargeback ($4,260) and dock turn-away.',
    timeline: [
      { ts: '2026-05-05T05:14:00Z', event: 'PO 850 received',         state: 'ok' },
      { ts: '2026-05-05T07:02:00Z', event: 'PO ack 855 sent',          state: 'ok' },
      { ts: '2026-05-05T11:30:00Z', event: 'Pick complete in WMS',     state: 'ok' },
      { ts: '2026-05-05T13:45:00Z', event: 'ASN 856 generation failed (mapping error)', state: 'breach' },
      { ts: '2026-05-05T14:18:00Z', event: 'Dock appointment',         state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'high',
      headline: 'Reassign + notify Priya Natarajan',
      reasoning: 'Priya has resolved 7 Walmart 856 mapping issues in the last 30 days; median fix is 22m. Truck arrives in 18m.',
      provenance: [
        { label: 'Priya · 7 prior fixes' },
        { label: 'Walmart Tier 1' },
        { label: 'OTIF SLA' },
      ],
      primaryLabel: 'Reassign + notify Priya',
      committedLabel: 'Reassigned + notified Priya',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'What caused the mapping error?',
      },
      {
        role: 'ai',
        content: 'The HL pack-loop generator threw on PO line 7 because the SSCC-18 label is missing from the WMS feed. Same root cause as PO 4521-1042 in the next slot.',
      },
      {
        role: 'ai',
        content: 'I can prep a manual ASN bypass while Priya investigates the upstream feed.',
        recommendation: {
          confidence: 'moderate',
          headline: 'Prep manual ASN bypass',
          reasoning: 'Manual ASN entry has cleared 4/4 prior Walmart mapping failures in the last 60 days. Adds ~6m of operator time.',
          provenance: [{ label: '4/4 prior bypasses' }],
          primaryLabel: 'Open bypass form',
          committedLabel: 'Manual ASN draft started',
        },
      },
    ],
  },
  {
    id: 'EXC-002',
    title: 'Walmart 856 ASN late — PO 4521-1042',
    type: 'asn-late',
    ediDocType: '856',
    partnerId: 'p-walmart',
    poId: 'PO-WMT-1042',
    severity: 5,
    ttb: 5,
    impact: 5,
    tier: 5,
    breachInMinutes: 26,
    age: '2h 48m',
    assignee: null,
    description: 'Second Walmart ASN failure in the same window. Same mapping error as PO 4521-1041.',
    impactNote: '$98,400 shipment; OTIF chargeback exposure $2,950.',
    timeline: [
      { ts: '2026-05-05T05:22:00Z', event: 'PO 850 received',                    state: 'ok' },
      { ts: '2026-05-05T07:06:00Z', event: 'PO ack 855 sent',                     state: 'ok' },
      { ts: '2026-05-05T11:55:00Z', event: 'Pick complete in WMS',                state: 'ok' },
      { ts: '2026-05-05T13:52:00Z', event: 'ASN 856 generation failed (mapping)', state: 'breach' },
      { ts: '2026-05-05T14:26:00Z', event: 'Dock appointment',                    state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'moderate',
      headline: 'Snooze 30m — partner ack received',
      reasoning: 'Walmart partner ack arrived 2m ago; the upstream mapping fix from EXC-001 should propagate to this PO\'s retry.',
      provenance: [
        { label: 'Linked to EXC-001' },
        { label: 'Walmart ack 2m ago' },
      ],
      primaryLabel: 'Snooze 30m',
      committedLabel: 'Snoozed 30 minutes',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Will fixing EXC-001 also fix this one?',
      },
      {
        role: 'ai',
        content: 'Yes — both POs share the same SSCC-18 missing-label root cause. A single mapping deploy clears both.',
      },
    ],
  },
  {
    id: 'EXC-003',
    title: 'McKesson 855 PO ack rejected — PO MCK-2210',
    type: 'po-ack-rejected',
    ediDocType: '855',
    partnerId: 'p-mckesson',
    poId: 'PO-MCK-2210',
    severity: 5,
    ttb: 4,
    impact: 5,
    tier: 3,
    breachInMinutes: 95,
    age: '5h 02m',
    assignee: 'Jamal Reyes',
    description: 'McKesson rejected our 855 PO acknowledgement; reason code AK = "Item not on contract". 14 line items affected.',
    impactNote: 'Pharmacy replenishment for 8 distribution centers blocked; $214,000 order value.',
    timeline: [
      { ts: '2026-05-05T03:10:00Z', event: 'PO 850 received',                  state: 'ok' },
      { ts: '2026-05-05T04:11:00Z', event: 'PO ack 855 sent',                   state: 'ok' },
      { ts: '2026-05-05T05:02:00Z', event: '855 rejected by partner (AK)',      state: 'breach' },
      { ts: '2026-05-05T15:35:00Z', event: 'Resubmission deadline',             state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'high',
      headline: 'Escalate to McKesson trading-partner manager',
      reasoning: '3rd 855 reject this week with the same AK code; pattern points at a contract-sync issue on McKesson\'s side.',
      provenance: [
        { label: '3 rejects in 7d' },
        { label: 'AK error code' },
        { label: 'McKesson TPM' },
      ],
      primaryLabel: 'Escalate',
      committedLabel: 'Escalated to TPM',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Can I resubmit without escalating?',
      },
      {
        role: 'ai',
        content: 'Resubmits with the same items will hit the same AK code. The contract record on McKesson\'s side needs to be updated before any resubmit will clear.',
      },
      {
        role: 'ai',
        content: 'Suggest reassigning to Jamal — he owns the McKesson channel and has the open ticket.',
        recommendation: {
          confidence: 'high',
          headline: 'Reassign to Jamal Reyes',
          reasoning: 'Jamal owns McKesson and has the open contract-sync ticket from earlier this week.',
          provenance: [{ label: 'Channel owner' }, { label: 'Ticket #PT-3315' }],
          primaryLabel: 'Reassign',
          committedLabel: 'Reassigned to Jamal Reyes',
        },
      },
    ],
  },

  // ── 4 high (severity 4) ────────────────────────────────────────────────────
  {
    id: 'EXC-004',
    title: 'Target 850 with invalid SKU — PO TGT-7745',
    type: 'po-invalid-sku',
    ediDocType: '850',
    partnerId: 'p-target',
    poId: 'PO-TGT-7745',
    severity: 4,
    ttb: 3,
    impact: 4,
    tier: 5,
    breachInMinutes: 240,
    age: '1h 30m',
    assignee: 'Priya Natarajan',
    description: 'Inbound PO contains 3 SKUs (DPCI 248-91-1042, 248-91-1043, 248-91-1044) not in item master.',
    impactNote: 'Holds 22 line items / $48,300 from entering OMS.',
    timeline: [
      { ts: '2026-05-05T13:00:00Z', event: 'PO 850 received',           state: 'ok' },
      { ts: '2026-05-05T13:00:30Z', event: 'Item master validation failed', state: 'warn' },
      { ts: '2026-05-05T18:30:00Z', event: 'Ack deadline',              state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'high',
      headline: 'Reassign to Daniel Park',
      reasoning: 'Daniel owns the Target item-master pipeline; he has cleared 9/10 invalid-DPCI exceptions in the last 60 days.',
      provenance: [{ label: 'Target item master' }, { label: '9/10 fix rate' }],
      primaryLabel: 'Reassign',
      committedLabel: 'Reassigned to Daniel Park',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Are these new items or just missing from the master?',
      },
      {
        role: 'ai',
        content: 'All three DPCIs were added by Target in their April 28 catalog refresh; we never received the corresponding 832 item maintenance doc.',
      },
    ],
  },
  {
    id: 'EXC-005',
    title: 'Costco 810 invoice mismatch — PO COS-4421',
    type: 'invoice-mismatch',
    ediDocType: '810',
    partnerId: 'p-costco',
    poId: 'PO-COS-4421',
    severity: 4,
    ttb: 3,
    impact: 4,
    tier: 5,
    breachInMinutes: 360,
    age: '6h 14m',
    assignee: 'Sara Chen',
    description: 'Invoice total $61,420.18 vs PO total $58,200.00. Variance $3,220.18 across freight + 2 unit-cost lines.',
    impactNote: 'Costco auto-rejects invoices > 5% variance; chargeback risk on 4 lines.',
    timeline: [
      { ts: '2026-05-04T22:00:00Z', event: 'Goods received',     state: 'ok' },
      { ts: '2026-05-05T08:46:00Z', event: '810 invoice sent',    state: 'ok' },
      { ts: '2026-05-05T08:46:20Z', event: 'Variance flagged',    state: 'warn' },
      { ts: '2026-05-05T20:46:00Z', event: 'Costco match window', state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'exploratory',
      headline: 'Auto-merge with INV-92841',
      reasoning: 'INV-92841 is a freight credit posted 4h ago whose total ($3,220.18) matches the variance exactly — but I\'ve only seen this pattern twice before.',
      provenance: [
        { label: 'INV-92841 · $3,220.18' },
        { label: '2 prior matches' },
      ],
      primaryLabel: 'Open merge preview',
      committedLabel: 'Merge preview opened',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'How confident are you the credit applies to this PO?',
      },
      {
        role: 'ai',
        content: 'The amounts match to the cent and the PO numbers correlate, but I haven\'t seen Costco process freight credits this way often enough to be sure. Worth a human eyeball before committing.',
      },
      {
        role: 'ai',
        content: 'If you\'d rather not auto-merge, we can flag for AP review.',
        recommendation: {
          confidence: 'moderate',
          headline: 'Flag for AP review instead',
          reasoning: 'Routes the variance to AP without committing; safe default if the merge looks risky.',
          provenance: [{ label: 'AP queue' }],
          primaryLabel: 'Flag for AP',
          committedLabel: 'Flagged for AP review',
        },
      },
    ],
  },
  {
    id: 'EXC-006',
    title: 'Home Depot 856 missing pack structure — PO HD-8830',
    type: 'asn-missing-pack',
    ediDocType: '856',
    partnerId: 'p-homedepot',
    poId: 'PO-HD-8830',
    severity: 4,
    ttb: 4,
    impact: 3,
    tier: 3,
    breachInMinutes: 75,
    age: '2h 05m',
    assignee: null,
    description: 'ASN missing HL pack/item segments. Home Depot rejects ASNs without SSCC-18 pallet labels.',
    impactNote: 'Inbound truck risks dock refusal; $36,800 shipment.',
    timeline: [
      { ts: '2026-05-05T11:55:00Z', event: 'Pick complete', state: 'ok' },
      { ts: '2026-05-05T13:55:00Z', event: 'ASN 856 sent',  state: 'warn' },
      { ts: '2026-05-05T15:15:00Z', event: 'Dock arrival',  state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'moderate',
      headline: 'Request 856 redelivery from Home Depot',
      reasoning: 'Pack-structure fix was confirmed by Home Depot ops at 13:40; resend is likely to validate.',
      provenance: [{ label: 'Partner fix · 13:40' }, { label: 'Pack structure' }],
      primaryLabel: 'Request redelivery',
      committedLabel: 'Redelivery requested',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Can we generate the SSCCs ourselves?',
      },
      {
        role: 'ai',
        content: 'No — Home Depot rejects ASNs whose SSCC-18 prefix doesn\'t match their issued range. Redelivery from the partner is the cleanest path.',
      },
    ],
  },
  {
    id: 'EXC-007',
    title: 'CVS 940 warehouse shipping order parse failure — WS CVS-3318',
    type: 'shipping-order-parse-failure',
    ediDocType: '940',
    partnerId: 'p-cvs',
    poId: 'PO-CVS-3318',
    severity: 4,
    ttb: 3,
    impact: 3,
    tier: 3,
    breachInMinutes: 180,
    age: '1h 47m',
    assignee: 'Sara Chen',
    description: '940 contains an unrecognized N1 qualifier (DV) in ship-to loop. WMS connector rejected the document.',
    impactNote: '12 retail stores cannot be shipped today without manual entry.',
    timeline: [
      { ts: '2026-05-05T14:00:00Z', event: '940 received',             state: 'ok' },
      { ts: '2026-05-05T14:00:05Z', event: 'WMS rejected (parse error)', state: 'warn' },
      { ts: '2026-05-05T17:00:00Z', event: 'Cut-off for today\'s wave',  state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'exploratory',
      headline: 'Re-run with parser v2',
      reasoning: 'Parser v2 handled the unrecognized N1 qualifier in 3 of 4 prior cases — small sample, but the behaviour is plausible here.',
      provenance: [{ label: 'Parser v2 · 3/4 prior' }],
      primaryLabel: 'Re-run parser',
      committedLabel: 'Parser v2 re-run',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Do we know if v2 is safe in production yet?',
      },
      {
        role: 'ai',
        content: 'It\'s feature-flagged on for ~30% of partners with no regressions logged this week, but CVS isn\'t in that cohort yet.',
      },
    ],
  },

  // ── 3 medium (severity 3) ──────────────────────────────────────────────────
  {
    id: 'EXC-008',
    title: 'Kroger 997 functional ack overdue — PO KRG-9912',
    type: 'ack-overdue',
    ediDocType: '997',
    partnerId: 'p-kroger',
    poId: 'PO-KRG-9912',
    severity: 3,
    ttb: 3,
    impact: 2,
    tier: 3,
    breachInMinutes: 240,
    age: '4h 00m',
    assignee: null,
    description: 'No 997 received from Kroger for our 855 sent at 11:42. SLA is 4 hours.',
    impactNote: 'Trading-partner SLA breach; not a shipment blocker.',
    timeline: [
      { ts: '2026-05-05T11:42:00Z', event: '855 sent',              state: 'ok' },
      { ts: '2026-05-05T15:42:00Z', event: '997 SLA window',         state: 'pending' },
      { ts: '2026-05-05T19:42:00Z', event: 'Escalation threshold',   state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'none',
      headline: '',
      reasoning: '',
      provenance: [],
      primaryLabel: 'Choose action',
      committedLabel: 'Action taken',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Has Kroger\'s ack been late before?',
      },
      {
        role: 'ai',
        content: 'Yes — 4 times in the last 7 days, all under 30 minutes. None caused chargebacks.',
      },
    ],
  },
  {
    id: 'EXC-009',
    title: 'Walgreens 850 duplicate received — PO WAG-5510',
    type: 'duplicate-po',
    ediDocType: '850',
    partnerId: 'p-walgreens',
    poId: 'PO-WAG-5510',
    severity: 3,
    ttb: 2,
    impact: 3,
    tier: 3,
    breachInMinutes: 480,
    age: '7h 22m',
    assignee: 'Marcus Doyle',
    description: 'Same control number BIG02=5510 received twice within 4 minutes. Second copy has identical line items.',
    impactNote: 'Risk of duplicate fulfillment / $12,450 over-ship.',
    timeline: [
      { ts: '2026-05-05T08:18:00Z', event: 'PO 850 received (first)',  state: 'ok' },
      { ts: '2026-05-05T08:22:00Z', event: 'PO 850 received (duplicate)', state: 'warn' },
      { ts: '2026-05-05T23:40:00Z', event: 'Resolution target',         state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'high',
      headline: 'Auto-resolve — collapse duplicate',
      reasoning: 'Control number BIG02=5510 is already processed. Second copy is byte-identical; safe to discard with audit trail.',
      provenance: [{ label: 'Same BIG02' }, { label: 'Identical lines' }],
      primaryLabel: 'Collapse duplicate',
      committedLabel: 'Duplicate collapsed',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Will collapsing trigger any partner notification?',
      },
      {
        role: 'ai',
        content: 'No — Walgreens won\'t see a notification. The audit log gets a "duplicate-collapsed" entry tied to both control numbers.',
      },
    ],
  },
  {
    id: 'EXC-010',
    title: 'ABC 856 shipment count variance — PO ABC-2204',
    type: 'count-variance',
    ediDocType: '856',
    partnerId: 'p-abc3pl',
    poId: 'PO-ABC-2204',
    severity: 3,
    ttb: 3,
    impact: 3,
    tier: 1,
    breachInMinutes: 360,
    age: '2h 48m',
    assignee: null,
    description: '3PL ASN reports 1,200 EA but inbound 856 from carrier shows 1,194 EA. 6-unit shortfall on SKU SKU-77124.',
    impactNote: 'Cycle-count variance; downstream invoice will likely mismatch.',
    timeline: [
      { ts: '2026-05-05T12:55:00Z', event: '856 received from 3PL', state: 'ok' },
      { ts: '2026-05-05T12:55:10Z', event: 'Count variance flagged', state: 'warn' },
      { ts: '2026-05-05T21:43:00Z', event: 'Cutoff for reconciliation', state: 'future' },
    ],
    triageRecommendation: {
      confidence: 'moderate',
      headline: 'Open variance reconciliation',
      reasoning: '6-unit shortfall on SKU-77124 matches a 3PL miscount pattern from last week. Reconciliation worksheet auto-fills.',
      provenance: [{ label: 'SKU-77124' }, { label: '3PL pattern' }],
      primaryLabel: 'Open reconciliation',
      committedLabel: 'Reconciliation opened',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Where did the 6 units go?',
      },
      {
        role: 'ai',
        content: 'Most likely a sortation miscount in zone B; 4 of 5 prior shortfalls on this SKU were recovered there within 24h.',
      },
    ],
  },

  // ── 2 low (severity 1–2) ───────────────────────────────────────────────────
  {
    id: 'EXC-011',
    title: 'Target 997 late ack — control 4488',
    type: 'late-ack',
    ediDocType: '997',
    partnerId: 'p-target',
    poId: 'PO-TGT-4488',
    severity: 2,
    ttb: 2,
    impact: 2,
    tier: 5,
    breachInMinutes: 720,
    age: '11h 04m',
    assignee: null,
    description: 'Outbound 997 to Target was sent 23 minutes after 850 receipt. Target SLA target is 15 minutes.',
    impactNote: 'No financial impact; surfaces in monthly partner scorecard.',
    timeline: [
      { ts: '2026-05-05T03:11:00Z', event: '850 received',  state: 'ok' },
      { ts: '2026-05-05T03:34:00Z', event: '997 sent (late)', state: 'info' },
    ],
    triageRecommendation: {
      confidence: 'exploratory',
      headline: 'Add auto-snooze rule for Target 997 < 30m late',
      reasoning: 'Pattern observed 4 times this week, but the sample is small and Target\'s scorecard sometimes counts <30m as on-time.',
      provenance: [{ label: '4 occurrences · 7d' }],
      primaryLabel: 'Suggest rule',
      committedLabel: 'Rule suggestion drafted',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Could this turn into a chargeback?',
      },
      {
        role: 'ai',
        content: 'Unlikely on its own — Target\'s monthly scorecard counts repeated lateness, not a single 23-minute event.',
      },
    ],
  },
  {
    id: 'EXC-012',
    title: 'Costco 810 reference number formatting — PO COS-4501',
    type: 'reference-format',
    ediDocType: '810',
    partnerId: 'p-costco',
    poId: 'PO-COS-4501',
    severity: 1,
    ttb: 1,
    impact: 1,
    tier: 5,
    breachInMinutes: 1440,
    age: '14h 18m',
    assignee: 'Marcus Doyle',
    description: 'REF*IV qualifier sent as alphanumeric "INV-29014" but partner expects digits only. Accepted with warning.',
    impactNote: 'Cosmetic; no chargeback. Tracked for cleanup.',
    timeline: [
      { ts: '2026-05-04T22:08:00Z', event: '810 sent',       state: 'ok' },
      { ts: '2026-05-04T22:08:30Z', event: 'Partner warning', state: 'info' },
    ],
    triageRecommendation: {
      confidence: 'none',
      headline: '',
      reasoning: '',
      provenance: [],
      primaryLabel: 'Choose action',
      committedLabel: 'Action taken',
    },
    triageConversation: [
      {
        role: 'user',
        content: 'Is the warning blocking anything?',
      },
      {
        role: 'ai',
        content: 'No — the invoice posted; the REF*IV format issue is cosmetic and shows up on monthly cleanup reports.',
      },
    ],
  },
];

export const exceptionsById: Record<string, Exception> = Object.fromEntries(
  exceptions.map((e) => [e.id, e]),
);
