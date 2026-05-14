import {
  RecommendationCard,
  type RecommendationCardProps,
  type RecommendationDisplayState,
} from './RecommendationCard';

export interface PatternBannerProps {
  onReviewDraftRule: () => void;
  onDismiss30Days: () => void;
  state?: RecommendationDisplayState;
  onCommittedExpire?: () => void;
}

const PROVENANCE: RecommendationCardProps['provenance'] = [
  { label: 'EX-44831' },
  { label: 'EX-44815' },
  { label: 'EX-44762' },
];

/**
 * Home-page pattern detection banner. Same RecommendationCard primitive,
 * rendered full-width above the page content.
 */
export function PatternBanner({
  onReviewDraftRule,
  onDismiss30Days,
  state = 'idle',
  onCommittedExpire,
}: PatternBannerProps) {
  return (
    <RecommendationCard
      confidence="moderate"
      headline="Pattern: 3 Walmart 856-late exceptions reassigned to Maria this week — make this a routing rule?"
      reasoning="Based on the last 7 days of triage activity. Routing rule would target Walmart 856-late exceptions past expected window > 15 minutes."
      provenance={PROVENANCE}
      primaryAction={{ label: 'Review draft rule', onClick: onReviewDraftRule }}
      alternatives={[{ label: 'Dismiss for 30 days', onClick: onDismiss30Days }]}
      onDismiss={onDismiss30Days}
      state={state}
      committedLabel="Dismissed for 30 days"
      onCommittedExpire={onCommittedExpire}
    />
  );
}

export default PatternBanner;
