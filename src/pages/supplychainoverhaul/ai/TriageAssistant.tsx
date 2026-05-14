import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import { Textarea } from '../../../components/Textarea';
import { RecommendationCard, type RecommendationDisplayState } from './RecommendationCard';
import type { Exception, TriageMessage, TriageRecommendation } from '../fixtures/exceptions';

const CANNED_REPLY: TriageRecommendation = {
  confidence: 'exploratory',
  headline: 'Wire submission in build phase',
  reasoning: "Static prototype — submitted turns aren't routed anywhere yet.",
  provenance: [{ label: 'Prototype' }],
  primaryLabel: 'Acknowledge',
  committedLabel: 'Acknowledged',
};

interface TurnState {
  state: RecommendationDisplayState;
}

export interface TriageAssistantProps {
  exception: Exception;
}

export function TriageAssistant({ exception }: TriageAssistantProps) {
  const [open, setOpen] = React.useState(true);
  const [draft, setDraft] = React.useState('');
  const [conversation, setConversation] = React.useState<TriageMessage[]>(exception.triageConversation);
  const [openingState, setOpeningState] = React.useState<RecommendationDisplayState>('idle');
  const [turnStates, setTurnStates] = React.useState<Record<number, TurnState>>({});
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setConversation(exception.triageConversation);
    setOpeningState('idle');
    setTurnStates({});
  }, [exception.id, exception.triageConversation]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [conversation.length]);

  const setTurn = (idx: number, state: RecommendationDisplayState) =>
    setTurnStates((s) => ({ ...s, [idx]: { state } }));

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setConversation((c) => [
      ...c,
      { role: 'user', content: text },
      {
        role: 'ai',
        content: 'Static prototype — message submission is not wired in this build.',
        recommendation: CANNED_REPLY,
      },
    ]);
    setDraft('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.25,
          borderBottom: open ? '1px solid' : 'none',
          borderColor: 'divider',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          Triage assistant
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {exception.id}
        </Typography>
        <IconButton size="small" aria-label={open ? 'Collapse' : 'Expand'}>
          {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      {open && (
        <>
          <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                Opening recommendation
              </Typography>
              <RecommendationCard
                confidence={exception.triageRecommendation.confidence}
                headline={exception.triageRecommendation.headline || 'Choose action'}
                reasoning={exception.triageRecommendation.reasoning}
                provenance={exception.triageRecommendation.provenance}
                primaryAction={{
                  label: exception.triageRecommendation.primaryLabel,
                  onClick: () => setOpeningState('committed'),
                }}
                onDismiss={() => setOpeningState('dismissed')}
                state={openingState}
                committedLabel={exception.triageRecommendation.committedLabel}
                onUndo={() => setOpeningState('idle')}
                onCommittedExpire={() => setOpeningState('idle')}
              />
            </Box>

            {conversation.map((m, idx) => {
              if (m.role === 'user') {
                return <UserBubble key={idx} content={m.content} />;
              }
              if (m.recommendation) {
                const ts = turnStates[idx]?.state ?? 'idle';
                return (
                  <Box key={idx} sx={{ display: 'flex', gap: 1 }}>
                    <AssistantMarker />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {m.content && (
                        <Typography variant="body2" color="text.primary" sx={{ mb: 0.75 }}>
                          {m.content}
                        </Typography>
                      )}
                      <RecommendationCard
                        confidence={m.recommendation.confidence}
                        headline={m.recommendation.headline}
                        reasoning={m.recommendation.reasoning}
                        provenance={m.recommendation.provenance}
                        primaryAction={{
                          label: m.recommendation.primaryLabel,
                          onClick: () => setTurn(idx, 'committed'),
                        }}
                        onDismiss={() => setTurn(idx, 'dismissed')}
                        state={ts}
                        committedLabel={m.recommendation.committedLabel}
                        onUndo={() => setTurn(idx, 'idle')}
                        onCommittedExpire={() => setTurn(idx, 'idle')}
                      />
                    </Box>
                  </Box>
                );
              }
              return <AiBubble key={idx} content={m.content} />;
            })}
          </Box>

          <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <Textarea
                placeholder="Ask about this exception…"
                minRows={1}
                maxRows={4}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
              />
              <IconButton color="primary" onClick={submit} disabled={!draft.trim()} aria-label="Send">
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}

function AssistantMarker() {
  return (
    <Box
      aria-hidden
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        bgcolor: 'primary.light',
        flex: '0 0 auto',
      }}
    />
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Box
        sx={{
          maxWidth: '85%',
          px: 1.5,
          py: 1,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="body2">{content}</Typography>
      </Box>
    </Box>
  );
}

function AiBubble({ content }: { content: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <AssistantMarker />
      <Box
        sx={{
          maxWidth: '85%',
          px: 1.5,
          py: 1,
          borderRadius: 2,
          bgcolor: 'grey.100',
          color: 'text.primary',
        }}
      >
        <Typography variant="body2">{content}</Typography>
      </Box>
    </Box>
  );
}

export default TriageAssistant;
