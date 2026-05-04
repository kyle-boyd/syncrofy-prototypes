import type { UncategorizedSystem, Tier } from './types';
import { resolveTier } from './types';

export type GroupingAxis = 'filename_token' | 'host_root' | 'graph_neighborhood' | 'none';

export interface RowGroup {
  key: string;
  /** Human-friendly token string (e.g., "ACME_", "*.acme-corp.com", "Acme-categorized"). */
  label: string;
  /** The axis this group was computed on. */
  axis: GroupingAxis;
  rows: UncategorizedSystem[];
  /** Dominant suggestion name across the group, if one exists. */
  dominantSuggestion: string | null;
  /** Summary of tier distribution across the group. */
  tierCounts: Record<Tier, number>;
}

export interface GroupedRows {
  groups: RowGroup[];
  singletons: UncategorizedSystem[];
}

const MIN_GROUP_SIZE = 2;

function emptyTierCounts(): Record<Tier, number> {
  return { high: 0, medium_corroborated: 0, medium_conflicted: 0, low: 0, none: 0 };
}

function finalizeGroup(
  key: string,
  label: string,
  axis: GroupingAxis,
  rows: UncategorizedSystem[]
): RowGroup {
  const tierCounts = emptyTierCounts();
  const nameCounts = new Map<string, number>();
  for (const r of rows) {
    tierCounts[resolveTier(r.suggestion)] += 1;
    const name = r.suggestion?.businessName;
    if (name) nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
  }
  let dominant: string | null = null;
  let max = 0;
  for (const [n, c] of nameCounts) {
    if (c > max) { dominant = n; max = c; }
  }
  return { key, label, axis, rows, dominantSuggestion: dominant, tierCounts };
}

function bucketize(
  rows: UncategorizedSystem[],
  axis: GroupingAxis,
  keyOf: (r: UncategorizedSystem) => string | null,
  labelOf: (key: string) => string
): GroupedRows {
  const byKey = new Map<string, UncategorizedSystem[]>();
  const unkeyed: UncategorizedSystem[] = [];
  for (const r of rows) {
    const k = keyOf(r);
    if (!k) { unkeyed.push(r); continue; }
    const list = byKey.get(k) ?? [];
    list.push(r);
    byKey.set(k, list);
  }
  const groups: RowGroup[] = [];
  const singletons: UncategorizedSystem[] = [...unkeyed];
  for (const [key, list] of byKey) {
    if (list.length >= MIN_GROUP_SIZE) {
      groups.push(finalizeGroup(`${axis}:${key}`, labelOf(key), axis, list));
    } else {
      singletons.push(...list);
    }
  }
  groups.sort((a, b) => b.rows.length - a.rows.length);
  return { groups, singletons };
}

function topFilenameToken(row: UncategorizedSystem): string | null {
  const tokens = row.filenameTokens ?? [];
  if (tokens.length === 0) return null;
  let best = tokens[0];
  for (const t of tokens) {
    if (t.occurrences > best.occurrences) best = t;
  }
  // ignore weak tokens that occur in <30% of transfers
  if (best.totalTransfers > 0 && best.occurrences / best.totalTransfers < 0.3) return null;
  return best.token;
}

function dominantGraphNeighborhood(row: UncategorizedSystem): string | null {
  const edges = row.transferGraph ?? [];
  if (edges.length === 0) return null;
  const partnerCounts = new Map<string, number>();
  let total = 0;
  for (const e of edges) {
    total += e.count;
    if (e.counterpartyPartner) {
      partnerCounts.set(
        e.counterpartyPartner,
        (partnerCounts.get(e.counterpartyPartner) ?? 0) + e.count
      );
    }
  }
  if (total === 0) return null;
  let best: string | null = null;
  let bestCount = 0;
  for (const [p, c] of partnerCounts) {
    if (c > bestCount) { best = p; bestCount = c; }
  }
  if (!best) return null;
  if (bestCount / total < 0.5) return null;
  return best;
}

export function groupRows(
  rows: UncategorizedSystem[],
  axis: GroupingAxis
): GroupedRows {
  switch (axis) {
    case 'none':
      return { groups: [], singletons: [...rows] };
    case 'filename_token':
      return bucketize(rows, 'filename_token', topFilenameToken, (k) => `Filename: ${k}*`);
    case 'host_root':
      return bucketize(rows, 'host_root', (r) => r.domainRoot, (k) => `*.${k}`);
    case 'graph_neighborhood':
      return bucketize(rows, 'graph_neighborhood', dominantGraphNeighborhood, (k) => `${k}-categorized cluster`);
  }
}

/** Compute the percentage of transfers flowing to internal counterparties, or null if no graph. */
export function internalExternalLean(
  row: UncategorizedSystem
): { type: 'internal' | 'external'; percent: number } | null {
  const edges = row.transferGraph ?? [];
  if (edges.length === 0) return null;
  let total = 0;
  let internal = 0;
  let external = 0;
  for (const e of edges) {
    total += e.count;
    if (e.counterpartyStatus === 'internal') internal += e.count;
    else if (e.counterpartyStatus === 'external') external += e.count;
  }
  if (total === 0) return null;
  const internalPct = internal / total;
  const externalPct = external / total;
  if (internalPct >= 0.8) return { type: 'internal', percent: Math.round(internalPct * 100) };
  if (externalPct >= 0.8) return { type: 'external', percent: Math.round(externalPct * 100) };
  return null;
}

/** Graph-proximity weight for a partner name on a given row. Higher = stronger lean. */
export function graphWeightForPartner(
  row: UncategorizedSystem,
  partnerName: string
): number {
  const edges = row.transferGraph ?? [];
  if (edges.length === 0) return 0;
  let total = 0;
  let match = 0;
  const target = partnerName.toLowerCase();
  for (const e of edges) {
    total += e.count;
    if (e.counterpartyPartner && e.counterpartyPartner.toLowerCase() === target) {
      match += e.count;
    }
  }
  return total === 0 ? 0 : match / total;
}
