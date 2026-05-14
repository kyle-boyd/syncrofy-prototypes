export type PartnerTier = 1 | 2 | 3;

export type PartnerHealthLabel = 'Healthy' | 'Watch' | 'At Risk' | 'Declining';
export type PartnerHealthTrend = 'up' | 'flat' | 'down';

export interface PartnerContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface AccountManager {
  name: string;
  email: string;
}

export interface SLAValues {
  asnTimelinessPercent: number;
  ackTimelinessPercent: number;
  invoiceMatchPercent: number;
}

export interface MapVersion {
  docType: string;
  version: string;
  deployedAt: string;
}

export interface PartnerNote {
  ts: string;
  author: string;
  body: string;
}

export interface PartnerIncident {
  date: string;
  summary: string;
  status: 'Resolved' | 'Open' | 'Monitoring';
}

export interface Partner {
  id: string;
  name: string;
  tier: PartnerTier;
  gln: string;
  additionalGLNs: string[];
  accountManager: AccountManager;
  partnerContacts: PartnerContact[];
  slaThresholds: SLAValues;
  currentSLA: SLAValues;
  healthLabel: PartnerHealthLabel;
  healthTrend: PartnerHealthTrend;
  healthChangeNote: string | null;
  exchangedDocTypes: string[];
  mapVersions: MapVersion[];
  notes: PartnerNote[];
  recentIncidents: PartnerIncident[];
  lastActivityAt: string;
  subValues?: string[];
}

export const partners: Partner[] = [
  {
    id: 'p-walmart',
    name: 'Walmart',
    tier: 1,
    gln: '0078742000008',
    additionalGLNs: ['0078742000015', '0078742000022', '0078742000039'],
    accountManager: {
      name: 'Priya Natarajan',
      email: 'priya.natarajan@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Marcus Hill',  role: 'EDI Coordinator',     email: 'mhill@walmart.com',    phone: '+1 479-273-4000' },
      { name: 'Lana Brooks',  role: 'Vendor Compliance',   email: 'lbrooks@walmart.com',  phone: '+1 479-273-4221' },
      { name: 'DC-217 Ops',   role: 'DC EDI Contact',      email: 'dc217-edi@walmart.com', phone: '+1 770-441-1217' },
    ],
    slaThresholds: { asnTimelinessPercent: 95, ackTimelinessPercent: 98, invoiceMatchPercent: 97 },
    currentSLA:    { asnTimelinessPercent: 92.8, ackTimelinessPercent: 97.4, invoiceMatchPercent: 96.1 },
    healthLabel: 'At Risk',
    healthTrend: 'down',
    healthChangeNote:
      'ASN timeliness dropped from 96.1% to 92.8% over the last 14 days. Decline concentrated in DC-217 (5 of 7 late ASNs). Consider scheduling a call with the DC-217 EDI contact.',
    exchangedDocTypes: ['850', '855', '856', '810', '997'],
    mapVersions: [
      { docType: '850', version: 'v4.2.1', deployedAt: '2026-02-14T00:00:00Z' },
      { docType: '855', version: 'v3.1.0', deployedAt: '2026-02-14T00:00:00Z' },
      { docType: '856', version: 'v5.0.3', deployedAt: '2026-04-22T00:00:00Z' },
      { docType: '810', version: 'v2.4.0', deployedAt: '2025-11-09T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-04T18:14:00Z', author: 'Priya Natarajan', body: 'Walmart vendor compliance flagged the DC-217 lateness pattern in their weekly call. Asked for the next two weeks of data before escalating.' },
      { ts: '2026-05-01T14:02:00Z', author: 'Jamal Reyes',     body: 'SSCC label generator failed on 856 for PO 4521-1041 — same root cause we saw on Tier 2 partners last month.' },
      { ts: '2026-04-28T10:30:00Z', author: 'Priya Natarajan', body: 'Re-deployed 856 map v5.0.3 to address pack-loop generator regression.' },
      { ts: '2026-04-22T09:45:00Z', author: 'Sara Chen',       body: '856 map v5.0.3 promoted to prod after a clean week in staging.' },
      { ts: '2026-04-15T16:00:00Z', author: 'Priya Natarajan', body: 'QBR with Walmart vendor team — discussed OTIF chargeback exposure.' },
    ],
    recentIncidents: [
      { date: '2026-05-05', summary: 'Two ASN failures (PO 4521-1041, 4521-1042) — SSCC mapping error', status: 'Open' },
      { date: '2026-04-28', summary: '856 map v5.0.3 regression — pack-loop generator', status: 'Resolved' },
      { date: '2026-04-12', summary: 'Walmart issued OTIF chargeback for late 856 in DC-217', status: 'Resolved' },
    ],
    lastActivityAt: '2026-05-05T13:45:00Z',
  },

  {
    id: 'p-target',
    name: 'Target',
    tier: 1,
    gln: '0085239000004',
    additionalGLNs: ['0085239000011', '0085239000028'],
    accountManager: {
      name: 'Daniel Park',
      email: 'daniel.park@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Erica Vance',  role: 'EDI Trading-Partner Mgr', email: 'evance@target.com',  phone: '+1 612-304-6073' },
      { name: 'Ben Schultz',  role: 'Item Master Ops',         email: 'bschultz@target.com', phone: '+1 612-304-6118' },
    ],
    slaThresholds: { asnTimelinessPercent: 95, ackTimelinessPercent: 98, invoiceMatchPercent: 97 },
    currentSLA:    { asnTimelinessPercent: 98.4, ackTimelinessPercent: 99.1, invoiceMatchPercent: 98.6 },
    healthLabel: 'Healthy',
    healthTrend: 'flat',
    healthChangeNote: null,
    exchangedDocTypes: ['850', '855', '856', '810', '997'],
    mapVersions: [
      { docType: '850', version: 'v3.7.0', deployedAt: '2026-01-09T00:00:00Z' },
      { docType: '855', version: 'v2.9.1', deployedAt: '2026-01-09T00:00:00Z' },
      { docType: '856', version: 'v4.4.2', deployedAt: '2026-03-01T00:00:00Z' },
      { docType: '810', version: 'v2.0.5', deployedAt: '2025-10-12T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-02T11:00:00Z', author: 'Daniel Park', body: 'Target rolled out a DPCI catalog refresh — 3 SKUs missing from item master, follow-up on EXC-004.' },
      { ts: '2026-04-18T08:30:00Z', author: 'Daniel Park', body: 'Quarterly partner scorecard arrived — all green.' },
    ],
    recentIncidents: [
      { date: '2026-05-05', summary: 'Invalid DPCI on PO TGT-7745 (catalog refresh lag)', status: 'Monitoring' },
      { date: '2026-03-01', summary: 'Deployed 856 map v4.4.2 — pallet hierarchy fix', status: 'Resolved' },
    ],
    lastActivityAt: '2026-05-06T13:08:00Z',
  },

  {
    id: 'p-costco',
    name: 'Costco',
    tier: 1,
    gln: '0096619000003',
    additionalGLNs: ['0096619000010', '0096619000027'],
    accountManager: {
      name: 'Sara Chen',
      email: 'sara.chen@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Owen McCray',   role: 'EDI Lead',           email: 'omccray@costco.com',  phone: '+1 425-313-8100' },
      { name: 'Jeanette Liu',  role: 'AP Supervisor',      email: 'jliu@costco.com',     phone: '+1 425-313-8312' },
    ],
    slaThresholds: { asnTimelinessPercent: 95, ackTimelinessPercent: 98, invoiceMatchPercent: 97 },
    currentSLA:    { asnTimelinessPercent: 95.7, ackTimelinessPercent: 98.2, invoiceMatchPercent: 94.8 },
    healthLabel: 'Watch',
    healthTrend: 'down',
    healthChangeNote:
      'SSCC label validation has failed 4 times in 2 weeks, all from East Coast DCs. Pattern matches a known label printer firmware issue from Q2 2025.',
    exchangedDocTypes: ['850', '855', '856', '810', '997'],
    mapVersions: [
      { docType: '850', version: 'v3.5.0', deployedAt: '2025-12-04T00:00:00Z' },
      { docType: '855', version: 'v2.8.0', deployedAt: '2025-12-04T00:00:00Z' },
      { docType: '856', version: 'v4.2.1', deployedAt: '2026-02-20T00:00:00Z' },
      { docType: '810', version: 'v2.1.0', deployedAt: '2025-09-30T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-04T20:55:00Z', author: 'Sara Chen', body: 'Costco AP confirmed freight credits land in their match window 4–6h after the invoice — investigating auto-merge possibility.' },
      { ts: '2026-04-29T09:18:00Z', author: 'Sara Chen', body: 'Two more SSCC label validation failures from East Coast DCs — same printer firmware fingerprint as Q2 2025.' },
    ],
    recentIncidents: [
      { date: '2026-05-05', summary: 'Invoice variance flagged on PO COS-4421', status: 'Monitoring' },
      { date: '2026-04-29', summary: 'SSCC label validation failures — East Coast DCs', status: 'Open' },
      { date: '2026-02-20', summary: '856 map v4.2.1 deployed for pallet ID change', status: 'Resolved' },
    ],
    lastActivityAt: '2026-05-05T16:30:00Z',
  },

  {
    id: 'p-homedepot',
    name: 'Home Depot',
    tier: 2,
    gln: '0078180500005',
    additionalGLNs: ['0078180500012'],
    accountManager: {
      name: 'Marcus Doyle',
      email: 'marcus.doyle@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Tasha Ferraro', role: 'Vendor EDI Ops', email: 'tferraro@homedepot.com', phone: '+1 770-433-8211' },
    ],
    slaThresholds: { asnTimelinessPercent: 93, ackTimelinessPercent: 96, invoiceMatchPercent: 95 },
    currentSLA:    { asnTimelinessPercent: 96.2, ackTimelinessPercent: 98.4, invoiceMatchPercent: 97.1 },
    healthLabel: 'Healthy',
    healthTrend: 'up',
    healthChangeNote: null,
    exchangedDocTypes: ['850', '855', '856', '810', '997'],
    mapVersions: [
      { docType: '850', version: 'v3.0.4', deployedAt: '2025-11-18T00:00:00Z' },
      { docType: '855', version: 'v2.5.0', deployedAt: '2025-11-18T00:00:00Z' },
      { docType: '856', version: 'v4.0.0', deployedAt: '2026-01-22T00:00:00Z' },
      { docType: '810', version: 'v2.0.0', deployedAt: '2025-10-01T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-05T13:55:00Z', author: 'Marcus Doyle', body: 'Pack-structure issue on PO HD-8830 — Home Depot ops confirmed fix on their side.' },
      { ts: '2026-04-08T15:00:00Z', author: 'Marcus Doyle', body: 'Annual EDI compliance review — no findings.' },
    ],
    recentIncidents: [
      { date: '2026-05-05', summary: 'ASN missing pack structure (PO HD-8830)', status: 'Monitoring' },
    ],
    lastActivityAt: '2026-05-06T10:05:00Z',
  },

  {
    id: 'p-kroger',
    name: 'Kroger',
    tier: 2,
    gln: '0001111000001',
    additionalGLNs: ['0001111000018'],
    accountManager: {
      name: 'Priya Natarajan',
      email: 'priya.natarajan@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Renee Aguilar', role: 'EDI Coordinator', email: 'raguilar@kroger.com',  phone: '+1 513-762-4000' },
    ],
    slaThresholds: { asnTimelinessPercent: 93, ackTimelinessPercent: 96, invoiceMatchPercent: 95 },
    currentSLA:    { asnTimelinessPercent: 94.9, ackTimelinessPercent: 96.5, invoiceMatchPercent: 96.0 },
    healthLabel: 'Healthy',
    healthTrend: 'flat',
    healthChangeNote: null,
    exchangedDocTypes: ['850', '855', '940', '997'],
    mapVersions: [
      { docType: '850', version: 'v3.1.0', deployedAt: '2026-01-30T00:00:00Z' },
      { docType: '855', version: 'v2.6.0', deployedAt: '2026-01-30T00:00:00Z' },
      { docType: '940', version: 'v1.8.0', deployedAt: '2025-12-15T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-05T11:45:00Z', author: 'Priya Natarajan', body: 'Kroger 997 acks running ~20m late in the morning batch — within SLA, but worth monitoring.' },
    ],
    recentIncidents: [
      { date: '2026-05-06', summary: '940 parse failure on KR-2188 — single occurrence', status: 'Resolved' },
    ],
    lastActivityAt: '2026-05-06T05:51:00Z',
  },

  {
    id: 'p-mckesson',
    name: 'McKesson',
    tier: 2,
    gln: '0036385000007',
    additionalGLNs: ['0036385000014', '0036385000021'],
    accountManager: {
      name: 'Jamal Reyes',
      email: 'jamal.reyes@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Carla Whitfield', role: 'Trading-Partner Manager', email: 'cwhitfield@mckesson.com', phone: '+1 415-983-8300' },
      { name: 'Henrik Sato',     role: 'Contract Operations',     email: 'hsato@mckesson.com',      phone: '+1 415-983-8417' },
    ],
    slaThresholds: { asnTimelinessPercent: 93, ackTimelinessPercent: 96, invoiceMatchPercent: 95 },
    currentSLA:    { asnTimelinessPercent: 95.1, ackTimelinessPercent: 95.6, invoiceMatchPercent: 92.8 },
    healthLabel: 'Watch',
    healthTrend: 'down',
    healthChangeNote:
      'Three duplicate-invoice rejects in the last 7 days, all on POs originating from McKesson DC 14. Pattern suggests their AP system is double-submitting after partial matches.',
    exchangedDocTypes: ['850', '855', '856', '810', '997'],
    mapVersions: [
      { docType: '850', version: 'v3.4.0', deployedAt: '2025-10-22T00:00:00Z' },
      { docType: '855', version: 'v2.7.0', deployedAt: '2025-10-22T00:00:00Z' },
      { docType: '856', version: 'v4.1.0', deployedAt: '2026-01-15T00:00:00Z' },
      { docType: '810', version: 'v2.2.0', deployedAt: '2026-03-04T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-05T05:10:00Z', author: 'Jamal Reyes', body: 'Third 855 reject this week with AK error — McKesson contract sync is the root cause. Ticket #PT-3315 still open on their side.' },
      { ts: '2026-04-29T09:00:00Z', author: 'Jamal Reyes', body: 'Discussed duplicate invoice pattern with Carla — they suspect AP system retry logic.' },
    ],
    recentIncidents: [
      { date: '2026-05-05', summary: '855 ack rejected (AK code) — PO MCK-2210', status: 'Open' },
      { date: '2026-04-29', summary: 'Duplicate invoice pattern flagged in AP queue', status: 'Monitoring' },
    ],
    lastActivityAt: '2026-05-06T03:07:00Z',
  },

  {
    id: 'p-cvs',
    name: 'CVS',
    tier: 2,
    gln: '0050428000002',
    additionalGLNs: ['0050428000019', '0050428000026'],
    accountManager: {
      name: 'Sara Chen',
      email: 'sara.chen@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Marshall Pritchett', role: 'Inbound EDI Lead', email: 'mpritchett@cvshealth.com', phone: '+1 401-765-1500' },
      { name: 'Daniela Cortes',     role: 'WMS Integration',  email: 'dcortes@cvshealth.com',    phone: '+1 401-765-1612' },
    ],
    slaThresholds: { asnTimelinessPercent: 93, ackTimelinessPercent: 96, invoiceMatchPercent: 95 },
    currentSLA:    { asnTimelinessPercent: 88.7, ackTimelinessPercent: 91.4, invoiceMatchPercent: 93.2 },
    healthLabel: 'Declining',
    healthTrend: 'down',
    healthChangeNote:
      'Segment-validation failures on inbound 940s have tripled over the last 21 days. CVS introduced a new diverter qualifier (N1*DV) that our parser does not recognize — and the change appears to have rolled out without partner notice.',
    exchangedDocTypes: ['850', '855', '940', '810', '997'],
    mapVersions: [
      { docType: '850', version: 'v3.2.0', deployedAt: '2025-11-04T00:00:00Z' },
      { docType: '855', version: 'v2.5.1', deployedAt: '2025-11-04T00:00:00Z' },
      { docType: '940', version: 'v1.7.0', deployedAt: '2025-09-19T00:00:00Z' },
      { docType: '810', version: 'v2.0.0', deployedAt: '2025-10-01T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-05T14:10:00Z', author: 'Sara Chen', body: 'Re-confirmed with Marshall that CVS rolled out the DV qualifier change without notifying partners. Will request a v2 940 map after parser flag is enabled.' },
      { ts: '2026-04-22T10:30:00Z', author: 'Sara Chen', body: 'Opened parser v2 feature flag rollout for evaluation.' },
    ],
    recentIncidents: [
      { date: '2026-05-05', summary: '940 parse failure on WS CVS-3318', status: 'Open' },
      { date: '2026-05-05', summary: 'Duplicate 940 retransmit on CVS-3325', status: 'Monitoring' },
      { date: '2026-04-30', summary: 'Trend: segment-validation failures +210% over 21 days', status: 'Open' },
    ],
    lastActivityAt: '2026-05-05T15:18:00Z',
  },

  {
    id: 'p-walgreens',
    name: 'Walgreens',
    tier: 2,
    gln: '0031191000009',
    additionalGLNs: ['0031191000016'],
    accountManager: {
      name: 'Marcus Doyle',
      email: 'marcus.doyle@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Beatriz Almeida', role: 'EDI Coordinator', email: 'balmeida@walgreens.com', phone: '+1 847-315-2500' },
    ],
    slaThresholds: { asnTimelinessPercent: 93, ackTimelinessPercent: 96, invoiceMatchPercent: 95 },
    currentSLA:    { asnTimelinessPercent: 96.8, ackTimelinessPercent: 98.0, invoiceMatchPercent: 96.4 },
    healthLabel: 'Healthy',
    healthTrend: 'flat',
    healthChangeNote: null,
    exchangedDocTypes: ['850', '855', '856', '810', '997'],
    mapVersions: [
      { docType: '850', version: 'v3.0.0', deployedAt: '2025-09-22T00:00:00Z' },
      { docType: '855', version: 'v2.4.0', deployedAt: '2025-09-22T00:00:00Z' },
      { docType: '856', version: 'v4.0.1', deployedAt: '2026-01-30T00:00:00Z' },
      { docType: '810', version: 'v2.0.0', deployedAt: '2025-10-01T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-05T08:25:00Z', author: 'Marcus Doyle', body: 'Duplicate 850 received on WAG-5510 — collapsed without partner contact.' },
    ],
    recentIncidents: [
      { date: '2026-05-05', summary: 'Duplicate 850 collapsed (PO WAG-5510)', status: 'Resolved' },
    ],
    lastActivityAt: '2026-05-05T22:40:00Z',
  },

  {
    id: 'p-abc3pl',
    name: 'ABC Warehousing 3PL',
    tier: 3,
    gln: '0860001234560',
    additionalGLNs: ['0860001234577'],
    accountManager: {
      name: 'Jamal Reyes',
      email: 'jamal.reyes@acmecorp.com',
    },
    partnerContacts: [
      { name: 'Glenn Whitaker', role: 'Operations Manager', email: 'gwhitaker@abc3pl.com', phone: '+1 901-555-2202' },
    ],
    slaThresholds: { asnTimelinessPercent: 90, ackTimelinessPercent: 94, invoiceMatchPercent: 92 },
    currentSLA:    { asnTimelinessPercent: 92.0, ackTimelinessPercent: 94.5, invoiceMatchPercent: 91.0 },
    healthLabel: 'Watch',
    healthTrend: 'down',
    healthChangeNote:
      'Recent map deploy (856 v3.2.0) failed validation on the first inbound — fell back to v3.1.0. Partner-side data quality has not regressed, but our deploy pipeline did.',
    exchangedDocTypes: ['856', '997'],
    mapVersions: [
      { docType: '856', version: 'v3.1.0', deployedAt: '2026-04-30T00:00:00Z' },
      { docType: '997', version: 'v1.2.0', deployedAt: '2025-08-01T00:00:00Z' },
    ],
    notes: [
      { ts: '2026-05-05T13:00:00Z', author: 'Jamal Reyes', body: 'Sortation miscount on SKU-77124 — same zone B pattern as last week.' },
      { ts: '2026-05-02T11:18:00Z', author: 'Jamal Reyes', body: '856 v3.2.0 deploy failed validation — rolled back automatically.' },
    ],
    recentIncidents: [
      { date: '2026-05-05', summary: 'Count variance on PO ABC-2204 (SKU-77124)', status: 'Open' },
      { date: '2026-05-02', summary: '856 map v3.2.0 deploy failed validation, auto-rollback', status: 'Resolved' },
    ],
    lastActivityAt: '2026-05-05T14:50:00Z',
  },
];

export const partnersById: Record<string, Partner> = Object.fromEntries(
  partners.map((p) => [p.id, p]),
);
