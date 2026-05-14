export type Factor = 1 | 2 | 3 | 4 | 5;

export interface PriorityInputs {
  severity: Factor;
  ttb: Factor;
  impact: Factor;
  tier: Factor;
}

/**
 * Composite priority score, 0–99.
 * Weights: severity 30%, ttb 30%, impact 20%, tier 20%. All inputs on a 1–5 scale.
 */
export function computePriority({ severity, ttb, impact, tier }: PriorityInputs): number {
  const weighted = 0.3 * severity + 0.3 * ttb + 0.2 * impact + 0.2 * tier;
  return Math.round(((weighted - 1) / 4) * 99);
}

export type PriorityBand = 'critical' | 'high' | 'medium' | 'low';

export function priorityBand(score: number): PriorityBand {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}
