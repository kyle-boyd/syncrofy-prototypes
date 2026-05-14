// Mock data for AI prototype features: Ghost File Detection & Failure Fingerprinting

export type TransferStatus = 'success' | 'failed' | 'in_progress' | 'ghost';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type CauseCategory = 'internal' | 'external' | 'environmental';

export interface Transfer {
  id: string;
  status: TransferStatus;
  partner: string;
  fileName: string;
  filePattern?: string;
  protocol: string;
  direction: 'inbound' | 'outbound';
  fileSize?: string;
  timestamp?: string;
  // Ghost-specific fields
  isGhost?: boolean;
  expectedWindow?: string;
  overdueBy?: string;
  confidence?: ConfidenceLevel;
  confidencePercent?: number;
  historicalPattern?: string;
  // Fingerprint link
  fingerprintId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface FingerprintResolution {
  id: string;
  date: string;
  resolvedBy: string;
  causeCategory: CauseCategory;
  description: string;
}

export interface Fingerprint {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium';
  occurrenceCount: number;
  affectedPartners: string[];
  errorSignature: string;
  errorCode: string;
  protocol: string;
  timePattern: string;
  possibleCause: {
    category: CauseCategory;
    confidence: string;
    evidence: string;
  };
  matchedSignals: string[];
  occurrenceTimeline: { date: string; count: number }[];
  pastResolutions: FingerprintResolution[];
  memberTransferIds: string[];
  firstSeen: string;
  lastSeen: string;
}

// ---------- Partners ----------
export const partners = [
  'Acme Distribution',
  'GlobalParts Co.',
  'Meridian Logistics',
  'Summit Healthcare',
  'NorthStar Financial',
  'Pacific Rim Trading',
  'Evergreen Supply',
  'Atlas Manufacturing',
];

// ---------- Transfers ----------
export const transfers: Transfer[] = [
  // Successful transfers
  {
    id: 'tf-001',
    status: 'success',
    partner: 'Acme Distribution',
    fileName: 'PO_850_20260415_001.edi',
    protocol: 'SFTP',
    direction: 'inbound',
    fileSize: '245 KB',
    timestamp: '2026-04-15 06:12:03',
  },
  {
    id: 'tf-002',
    status: 'success',
    partner: 'GlobalParts Co.',
    fileName: 'INV_DAILY_20260415.csv',
    protocol: 'AS2',
    direction: 'inbound',
    fileSize: '1.2 MB',
    timestamp: '2026-04-15 05:45:22',
  },
  {
    id: 'tf-003',
    status: 'success',
    partner: 'Summit Healthcare',
    fileName: 'CLM_837_20260415.edi',
    protocol: 'SFTP',
    direction: 'outbound',
    fileSize: '512 KB',
    timestamp: '2026-04-15 04:30:11',
  },
  {
    id: 'tf-004',
    status: 'success',
    partner: 'NorthStar Financial',
    fileName: 'PMT_820_20260415.edi',
    protocol: 'FTPS',
    direction: 'inbound',
    fileSize: '89 KB',
    timestamp: '2026-04-15 07:01:45',
  },
  {
    id: 'tf-005',
    status: 'success',
    partner: 'Pacific Rim Trading',
    fileName: 'SHPN_856_20260415_003.edi',
    protocol: 'AS2',
    direction: 'outbound',
    fileSize: '334 KB',
    timestamp: '2026-04-15 06:55:18',
  },
  {
    id: 'tf-006',
    status: 'success',
    partner: 'Evergreen Supply',
    fileName: 'CATLOG_20260415.xml',
    protocol: 'SFTP',
    direction: 'inbound',
    fileSize: '2.1 MB',
    timestamp: '2026-04-15 03:22:09',
  },
  {
    id: 'tf-007',
    status: 'success',
    partner: 'Atlas Manufacturing',
    fileName: 'WO_20260415_batch2.csv',
    protocol: 'FTPS',
    direction: 'outbound',
    fileSize: '178 KB',
    timestamp: '2026-04-15 05:10:33',
  },

  // In-progress transfers
  {
    id: 'tf-008',
    status: 'in_progress',
    partner: 'Acme Distribution',
    fileName: 'PO_850_20260415_002.edi',
    protocol: 'SFTP',
    direction: 'inbound',
    fileSize: '310 KB',
    timestamp: '2026-04-15 07:22:00',
  },
  {
    id: 'tf-009',
    status: 'in_progress',
    partner: 'GlobalParts Co.',
    fileName: 'RMA_BATCH_20260415.csv',
    protocol: 'AS2',
    direction: 'outbound',
    fileSize: '456 KB',
    timestamp: '2026-04-15 07:18:44',
  },

  // Failed transfers (some linked to fingerprints)
  {
    id: 'tf-010',
    status: 'failed',
    partner: 'Acme Distribution',
    fileName: 'ASN_856_20260415_001.edi',
    protocol: 'SFTP',
    direction: 'inbound',
    fileSize: '0 KB',
    timestamp: '2026-04-15 06:15:02',
    fingerprintId: 'fp-001',
    errorCode: 'SFTP_TIMEOUT',
    errorMessage: 'Connection timed out after 30s — remote host not responding',
  },
  {
    id: 'tf-011',
    status: 'failed',
    partner: 'Acme Distribution',
    fileName: 'ASN_856_20260414_003.edi',
    protocol: 'SFTP',
    direction: 'inbound',
    fileSize: '0 KB',
    timestamp: '2026-04-14 06:22:18',
    fingerprintId: 'fp-001',
    errorCode: 'SFTP_TIMEOUT',
    errorMessage: 'Connection timed out after 30s — remote host not responding',
  },
  {
    id: 'tf-012',
    status: 'failed',
    partner: 'Meridian Logistics',
    fileName: 'FREIGHT_204_20260415.edi',
    protocol: 'AS2',
    direction: 'outbound',
    fileSize: '128 KB',
    timestamp: '2026-04-15 04:48:31',
    fingerprintId: 'fp-002',
    errorCode: 'AS2_MDN_MISMATCH',
    errorMessage: 'MDN signature verification failed — certificate mismatch',
  },
  {
    id: 'tf-013',
    status: 'failed',
    partner: 'Meridian Logistics',
    fileName: 'FREIGHT_204_20260414.edi',
    protocol: 'AS2',
    direction: 'outbound',
    fileSize: '115 KB',
    timestamp: '2026-04-14 04:52:10',
    fingerprintId: 'fp-002',
    errorCode: 'AS2_MDN_MISMATCH',
    errorMessage: 'MDN signature verification failed — certificate mismatch',
  },
  {
    id: 'tf-014',
    status: 'failed',
    partner: 'NorthStar Financial',
    fileName: 'PMT_820_20260415_002.edi',
    protocol: 'FTPS',
    direction: 'inbound',
    fileSize: '0 KB',
    timestamp: '2026-04-15 07:05:22',
    fingerprintId: 'fp-003',
    errorCode: 'TLS_HANDSHAKE_FAIL',
    errorMessage: 'TLS handshake failed — certificate expired',
  },
  {
    id: 'tf-015',
    status: 'success',
    partner: 'Meridian Logistics',
    fileName: 'BOL_20260415_001.pdf',
    protocol: 'SFTP',
    direction: 'inbound',
    fileSize: '890 KB',
    timestamp: '2026-04-15 02:14:55',
  },

  // Ghost file entries
  {
    id: 'ghost-001',
    status: 'ghost',
    isGhost: true,
    partner: 'Acme Distribution',
    fileName: '',
    filePattern: 'INV_DAILY_*.csv',
    protocol: 'SFTP',
    direction: 'inbound',
    expectedWindow: '2:15 AM \u2013 2:45 AM',
    overdueBy: '4h 42m',
    confidence: 'high',
    confidencePercent: 95,
    historicalPattern: 'Received every weekday for the past 6 months. Last 30 arrivals averaged 2:18 AM with a standard deviation of 8 minutes.',
  },
  {
    id: 'ghost-002',
    status: 'ghost',
    isGhost: true,
    partner: 'Meridian Logistics',
    fileName: '',
    filePattern: 'SHPMT_STATUS_*.edi',
    protocol: 'AS2',
    direction: 'inbound',
    expectedWindow: '5:00 AM \u2013 5:30 AM',
    overdueBy: '2h 15m',
    confidence: 'high',
    confidencePercent: 88,
    historicalPattern: 'Received every weekday. Occasional skip on holidays. Last arrival was Monday at 5:12 AM.',
  },
  {
    id: 'ghost-003',
    status: 'ghost',
    isGhost: true,
    partner: 'Pacific Rim Trading',
    fileName: '',
    filePattern: 'FORECAST_*.xlsx',
    protocol: 'SFTP',
    direction: 'inbound',
    expectedWindow: '6:00 AM \u2013 7:00 AM',
    overdueBy: '45m',
    confidence: 'medium',
    confidencePercent: 72,
    historicalPattern: 'Typically received on Tuesdays and Thursdays. Pattern is less consistent — arrived 14 of the last 20 expected windows.',
  },
  {
    id: 'ghost-004',
    status: 'ghost',
    isGhost: true,
    partner: 'Atlas Manufacturing',
    fileName: '',
    filePattern: 'WO_CONFIRM_*.csv',
    protocol: 'FTPS',
    direction: 'inbound',
    expectedWindow: '4:00 AM \u2013 5:00 AM',
    overdueBy: '2h 30m',
    confidence: 'low',
    confidencePercent: 58,
    historicalPattern: 'Sporadic pattern. File arrived 8 of the last 15 weekdays. May be manually triggered by partner.',
  },
];

// ---------- Fingerprints ----------
export const fingerprints: Fingerprint[] = [
  {
    id: 'fp-001',
    name: 'Recurring SFTP timeout \u2014 Acme Distribution',
    severity: 'high',
    occurrenceCount: 12,
    affectedPartners: ['Acme Distribution'],
    errorSignature: 'Connection timed out after 30s \u2014 remote host not responding',
    errorCode: 'SFTP_TIMEOUT',
    protocol: 'SFTP',
    timePattern: 'Clusters on weekday mornings, 6\u20138 AM EST',
    possibleCause: {
      category: 'external',
      confidence: 'High',
      evidence:
        'All 12 failures share the same remote host error (sftp.acme-dist.com:22). No internal config changes detected in the past 30 days. Acme\'s SFTP server has responded with RST packets during these windows.',
    },
    matchedSignals: [
      'error_code = SFTP_TIMEOUT',
      'partner = Acme Distribution',
      'protocol = SFTP',
      'remote_host = sftp.acme-dist.com',
      'time_window = Weekday 6\u20138 AM EST',
    ],
    occurrenceTimeline: [
      { date: '2026-04-09', count: 2 },
      { date: '2026-04-10', count: 1 },
      { date: '2026-04-11', count: 3 },
      { date: '2026-04-12', count: 0 },
      { date: '2026-04-13', count: 0 },
      { date: '2026-04-14', count: 2 },
      { date: '2026-04-15', count: 1 },
    ],
    pastResolutions: [
      {
        id: 'res-001',
        date: '2026-03-28',
        resolvedBy: 'Sarah Chen',
        causeCategory: 'external',
        description:
          'Contacted Acme IT team. Their SFTP server had a misconfigured connection pool limit causing drops during peak batch window. They increased the pool from 10 to 50 connections.',
      },
    ],
    memberTransferIds: ['tf-010', 'tf-011'],
    firstSeen: '2026-03-15',
    lastSeen: '2026-04-15',
  },
  {
    id: 'fp-002',
    name: 'AS2 MDN signature mismatch \u2014 Meridian Logistics',
    severity: 'critical',
    occurrenceCount: 6,
    affectedPartners: ['Meridian Logistics'],
    errorSignature: 'MDN signature verification failed \u2014 certificate mismatch',
    errorCode: 'AS2_MDN_MISMATCH',
    protocol: 'AS2',
    timePattern: 'No specific time pattern \u2014 occurs on every attempted delivery',
    possibleCause: {
      category: 'external',
      confidence: 'Very high',
      evidence:
        'Meridian renewed their AS2 signing certificate on 2026-04-12. The new certificate fingerprint does not match the one stored in our partner profile. All failures began after the renewal date.',
    },
    matchedSignals: [
      'error_code = AS2_MDN_MISMATCH',
      'partner = Meridian Logistics',
      'protocol = AS2',
      'cert_fingerprint \u2260 stored_fingerprint',
      'failures_started = 2026-04-12',
    ],
    occurrenceTimeline: [
      { date: '2026-04-09', count: 0 },
      { date: '2026-04-10', count: 0 },
      { date: '2026-04-11', count: 0 },
      { date: '2026-04-12', count: 2 },
      { date: '2026-04-13', count: 0 },
      { date: '2026-04-14', count: 2 },
      { date: '2026-04-15', count: 2 },
    ],
    pastResolutions: [],
    memberTransferIds: ['tf-012', 'tf-013'],
    firstSeen: '2026-04-12',
    lastSeen: '2026-04-15',
  },
  {
    id: 'fp-003',
    name: 'TLS handshake failure \u2014 NorthStar Financial',
    severity: 'medium',
    occurrenceCount: 3,
    affectedPartners: ['NorthStar Financial'],
    errorSignature: 'TLS handshake failed \u2014 certificate expired',
    errorCode: 'TLS_HANDSHAKE_FAIL',
    protocol: 'FTPS',
    timePattern: 'Intermittent \u2014 2\u20133 failures per day since Apr 13',
    possibleCause: {
      category: 'internal',
      confidence: 'Medium',
      evidence:
        'Our FTPS server certificate for the NorthStar endpoint expired on 2026-04-13. The certificate was issued by our internal CA. Evidence suggests this is an internal renewal oversight.',
    },
    matchedSignals: [
      'error_code = TLS_HANDSHAKE_FAIL',
      'partner = NorthStar Financial',
      'protocol = FTPS',
      'cert_expiry = 2026-04-13',
      'endpoint = ftps-northstar.syncrofy.internal',
    ],
    occurrenceTimeline: [
      { date: '2026-04-09', count: 0 },
      { date: '2026-04-10', count: 0 },
      { date: '2026-04-11', count: 0 },
      { date: '2026-04-12', count: 0 },
      { date: '2026-04-13', count: 1 },
      { date: '2026-04-14', count: 1 },
      { date: '2026-04-15', count: 1 },
    ],
    pastResolutions: [],
    memberTransferIds: ['tf-014'],
    firstSeen: '2026-04-13',
    lastSeen: '2026-04-15',
  },
];

// Helpers
export function getTransfersByFingerprint(fingerprintId: string): Transfer[] {
  return transfers.filter((t) => t.fingerprintId === fingerprintId);
}

export function getFingerprintById(id: string): Fingerprint | undefined {
  return fingerprints.find((f) => f.id === id);
}

export const dismissReasons = [
  'File intentionally stopped',
  'Partner confirmed no file today',
  'Duplicate schedule — already received',
  'Test / development file',
  'Other',
];
