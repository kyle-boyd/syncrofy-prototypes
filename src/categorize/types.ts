export type Protocol = 'SFTP' | 'FTPS' | 'HTTPS' | 'AS2' | 'FTP' | 'MBX' | 'CDI' | (string & {});

export type Confidence = 'high' | 'medium' | 'low';

export type Tier =
  | 'high'
  | 'medium_corroborated'
  | 'medium_conflicted'
  | 'low'
  | 'none';

export type InternalExternal = 'internal' | 'external';

export type SignalType =
  | 'connection_strings'
  | 'filename_pattern'
  | 'transfer_graph'
  | 'multi_signal_agreement'
  | 'multi_signal_conflict'
  | 'graph_inference_only'
  | 'none'
  // legacy values — tolerated for graceful degradation of older mock records
  | 'whois'
  | 'hostname_inference'
  | 'reverse_dns'
  | 'cloud_infra_demoted';

export interface QuotedToken {
  source: 'host' | 'directory' | 'username' | 'filename';
  value: string;
}

export interface Suggestion {
  businessName: string | null;
  internalExternal: InternalExternal | null;
  /**
   * Legacy three-tier confidence, retained for backward compatibility.
   * Prefer {@link tier} when present.
   */
  confidence: Confidence;
  /** Five-tier model. When absent, derive from {@link confidence}. */
  tier?: Tier;
  reasoning: string;
  /** Structured tokens quoted inline in the reasoning string. */
  quotedTokens?: QuotedToken[];
  signalType: SignalType;
}

export interface ContextualSignals {
  reverseDns?: string;
  recentCounterparties?: string[];
  transferVolume?: string;
  firstSeen?: string;
}

export interface FilenameToken {
  token: string;
  position: 'prefix' | 'suffix' | 'embedded';
  occurrences: number;
  totalTransfers: number;
}

export interface TransferGraphEdge {
  counterpartyId: string;
  counterpartyLabel: string;
  counterpartyStatus: 'internal' | 'external' | 'uncategorized';
  counterpartyPartner?: string;
  direction: 'to' | 'from' | 'bidirectional';
  count: number;
  lastSeen: string;
}

export interface PermissionPreview {
  visibleTo: string[];
  hiddenFrom: string[];
}

export interface GroundTruth {
  businessName: string;
  internalExternal: InternalExternal;
}

export interface UncategorizedSystem {
  id: string;
  hostname: string;
  protocol: Protocol;
  domainRoot: string | null;
  directory?: string;
  username?: string;
  suggestion: Suggestion | null;
  contextualSignals: ContextualSignals;
  filenameTokens?: FilenameToken[];
  transferGraph?: TransferGraphEdge[];
  permissionPreview: PermissionPreview;
  groundTruth?: GroundTruth;
}

export interface ExistingPartner {
  id: string;
  name: string;
}

export type OutcomeBucket =
  | 'accepted_as_is'
  | 'edited_then_accepted'
  | 'rejected'
  | 'skipped'
  | 'manually_categorized_no_suggestion';

export type Calibration = 'high' | 'medium' | 'low';

export interface CategorizationLogEntry {
  rowId: string;
  timeRowFirstFocused: number | null;
  timeConfirmed: number | null;
  outcomeBucket: OutcomeBucket | null;
  openedReasoning: boolean;
  openedPermissionPreview: boolean;
  finalValues: {
    businessName: string | null;
    internalExternal: InternalExternal | null;
  };
  suggestionValues: {
    businessName: string | null;
    internalExternal: InternalExternal | null;
    confidence: Confidence;
    tier?: Tier;
  } | null;
  calibration: Calibration | null;
}

export interface GroupAction {
  groupKey: string;
  timeStart: number;
  timeEnd: number;
  outcome: OutcomeBucket;
  rowIds: string[];
}

export interface BulkAction {
  at: number;
  count: number;
  selectionIds: string[];
  calibration: Calibration | null;
}

export interface SessionLog {
  sessionId: string;
  mode: 'prototype' | 'manual';
  sessionStart: number;
  sessionEnd: number | null;
  totalElapsed: number | null;
  entries: Record<string, CategorizationLogEntry>;
  groupsActioned: GroupAction[];
  bulkActions: BulkAction[];
}

export type RowStatus = 'pending' | 'accepted' | 'rejected' | 'skipped';

export interface RowState {
  status: RowStatus;
  businessName: string | null;
  internalExternal: InternalExternal | null;
}

/** Derive a 5-tier value from a suggestion, falling back to legacy confidence. */
export function resolveTier(suggestion: Suggestion | null): Tier {
  if (!suggestion) return 'none';
  if (suggestion.tier) return suggestion.tier;
  if (suggestion.confidence === 'high') return 'high';
  if (suggestion.confidence === 'medium') return 'medium_corroborated';
  return 'low';
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case 'high': return 'High';
    case 'medium_corroborated': return 'Medium';
    case 'medium_conflicted': return 'Conflict';
    case 'low': return 'Low';
    case 'none': return 'No signal';
  }
}
