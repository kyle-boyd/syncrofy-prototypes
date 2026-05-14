import type { UncategorizedSystem, ExistingPartner } from './types';
import { resolveTier } from './types';

export interface ConflictInfo {
  conflictsWith: ExistingPartner;
}

export function detectConflict(
  row: UncategorizedSystem,
  existingPartners: ExistingPartner[]
): ConflictInfo | null {
  const name = row.suggestion?.businessName;
  if (!name) return null;
  const lower = name.toLowerCase();
  const exact = existingPartners.find((p) => p.name.toLowerCase() === lower);
  if (exact) return null;
  const fuzzy = existingPartners.find((p) => {
    const partner = p.name.toLowerCase();
    const first = lower.split(/\s+/)[0];
    return first.length >= 3 && partner.startsWith(first);
  });
  if (fuzzy) return { conflictsWith: fuzzy };
  return null;
}

/**
 * Zone 1 ("Needs attention") holds rows with no actionable pre-fill:
 *   - tier === 'low' (weak single signal) or 'none' (nothing legible)
 *   - null suggestion
 *
 * Medium-conflicted stays in Zone 2 but is flagged — it still has a pre-fill
 * worth reviewing individually.
 */
export function isNeedsAttention(row: UncategorizedSystem): boolean {
  if (row.suggestion === null) return true;
  const tier = resolveTier(row.suggestion);
  return tier === 'low' || tier === 'none';
}

export function splitZones(
  rows: UncategorizedSystem[]
): { zone1: UncategorizedSystem[]; zone2: UncategorizedSystem[] } {
  const zone1: UncategorizedSystem[] = [];
  const zone2: UncategorizedSystem[] = [];
  for (const r of rows) {
    if (isNeedsAttention(r)) zone1.push(r);
    else zone2.push(r);
  }
  return { zone1, zone2 };
}
