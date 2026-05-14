import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { SupplyChainPageLayout } from '../components/nav/SupplyChainPageLayout';
import {
  RecommendationCard,
  ShowRecommendationAffordance,
  type RecommendationCardProps,
  type RecommendationConfidence,
  type RecommendationDisplayState,
} from '../ai/RecommendationCard';

const baseProps: Omit<RecommendationCardProps, 'confidence' | 'state'> = {
  headline: 'Reassign to Priya Natarajan',
  reasoning:
    'Priya has resolved 7 Walmart ASN issues in the last 30 days with a median time-to-resolution of 22 minutes.',
  provenance: [
    { label: 'EXC-001', onClick: () => console.log('open EXC-001') },
    { label: 'Walmart · Tier 1' },
    { label: '30d history' },
  ],
  primaryAction: { label: 'Reassign', onClick: () => console.log('Reassign') },
  alternatives: [
    { label: 'Snooze 1h', onClick: () => console.log('Snooze') },
    { label: 'Escalate', onClick: () => console.log('Escalate') },
  ],
  onDismiss: () => console.log('dismiss'),
};

interface CellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Cell({ title, subtitle, children }: CellProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1, letterSpacing: '0.08em' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ width: 360 }}>{children}</Box>
    </Box>
  );
}

export default function KitchenSink() {
  const [dismissed, setDismissed] = React.useState(false);

  const confidences: { c: RecommendationConfidence; subtitle: string }[] = [
    { c: 'high', subtitle: 'Green dot, 2px primary left rule' },
    { c: 'moderate', subtitle: 'Amber dot, 2px primary left rule' },
    { c: 'exploratory', subtitle: 'Gray dot, no left rule, hedged copy' },
  ];

  return (
    <SupplyChainPageLayout>
      <Typography variant="h4" gutterBottom>
        Recommendation Card · kitchen sink
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Visual QA for all six states. Internal — not linked from nav.
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {confidences.map(({ c, subtitle }) => (
          <Cell key={c} title={c} subtitle={subtitle}>
            <RecommendationCard {...baseProps} confidence={c} />
          </Cell>
        ))}

        <Cell
          title="none"
          subtitle="Neutral picker, no recommendation styling"
        >
          <RecommendationCard
            {...baseProps}
            confidence="none"
            primaryAction={{ label: 'Reassign', onClick: () => {} }}
            alternatives={[
              { label: 'Snooze 1h', onClick: () => {} },
              { label: 'Escalate', onClick: () => {} },
              { label: 'Resolve', onClick: () => {} },
            ]}
          />
        </Cell>

        <Cell title="committed" subtitle="Collapsed row, 10s undo">
          <RecommendationCard
            {...baseProps}
            confidence="high"
            state={'committed' as RecommendationDisplayState}
            committedLabel="Reassigned to Priya Natarajan"
            onUndo={() => console.log('undo')}
          />
        </Cell>

        <Cell title="dismissed" subtitle="Renders nothing; affordance below">
          {dismissed ? (
            <ShowRecommendationAffordance onClick={() => setDismissed(false)} />
          ) : (
            <RecommendationCard
              {...baseProps}
              confidence="moderate"
              onDismiss={() => setDismissed(true)}
            />
          )}
        </Cell>
      </Box>

      <Divider sx={{ my: 4 }} />
      <Typography variant="overline" color="text.secondary">
        Long-headline / hedge-prepend test
      </Typography>
      <Box sx={{ width: 360, mt: 1 }}>
        <RecommendationCard
          {...baseProps}
          confidence="exploratory"
          headline="Auto-snooze Kroger 997 lateness when under 30 minutes"
          reasoning="Pattern observed 4 times in 7 days, but the sample size is small and the partner SLA window is forgiving."
        />
      </Box>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" gutterBottom>
        Compact (inline / inbox-row) variant
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Multi-line card used in the Inbox Suggested Action column. All six states.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {confidences.map(({ c, subtitle }) => (
          <Cell key={`compact-${c}`} title={`compact · ${c}`} subtitle={subtitle}>
            <RecommendationCard
              {...baseProps}
              confidence={c}
              layout="compact"
              primaryAction={{ label: 'Reassign', onClick: () => {} }}
            />
          </Cell>
        ))}

        <Cell title="compact · none" subtitle="Neutral picker (Select action)">
          <RecommendationCard
            {...baseProps}
            confidence="none"
            layout="compact"
            primaryAction={{ label: 'Select action', onClick: () => {} }}
          />
        </Cell>

        <Cell title="compact · committed" subtitle="Collapsed row, 10s undo">
          <RecommendationCard
            {...baseProps}
            confidence="high"
            layout="compact"
            state={'committed' as RecommendationDisplayState}
            committedLabel="Reassigned to Priya Natarajan"
            onUndo={() => console.log('undo')}
          />
        </Cell>

        <Cell title="compact · dismissed" subtitle="Renders nothing">
          <RecommendationCard
            {...baseProps}
            confidence="moderate"
            layout="compact"
            state={'dismissed' as RecommendationDisplayState}
          />
        </Cell>
      </Box>
    </SupplyChainPageLayout>
  );
}
