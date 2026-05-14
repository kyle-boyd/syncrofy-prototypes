import React from 'react';
import { Box, Typography, TextField, IconButton, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  author?: string;
  content: React.ReactNode;
  timestamp?: string;
  avatar?: string;
}

export interface ChatThreadProps {
  messages: ChatMessage[];
  onSend?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyState?: React.ReactNode;
}

export function ChatThread({
  messages,
  onSend,
  placeholder = 'Type a message…',
  disabled,
  emptyState,
}: ChatThreadProps) {
  const [draft, setDraft] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  const submit = () => {
    const text = draft.trim();
    if (!text || !onSend) return;
    onSend(text);
    setDraft('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.length === 0 && emptyState}
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <Box
              key={m.id}
              sx={{
                display: 'flex',
                gap: 1.5,
                flexDirection: isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              <Avatar src={m.avatar} sx={{ width: 32, height: 32, fontSize: 14 }}>
                {(m.author ?? m.role).charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ maxWidth: '75%' }}>
                {(m.author || m.timestamp) && (
                  <Box sx={{ display: 'flex', gap: 1, mb: 0.5, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                    {m.author && (
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {m.author}
                      </Typography>
                    )}
                    {m.timestamp && (
                      <Typography variant="caption" color="text.secondary">
                        {m.timestamp}
                      </Typography>
                    )}
                  </Box>
                )}
                <Box
                  sx={{
                    p: 1.25,
                    px: 1.75,
                    borderRadius: 2,
                    bgcolor: isUser ? 'primary.main' : 'grey.100',
                    color: isUser ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="body2" component="div">
                    {m.content}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
      {onSend && (
        <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            multiline
            maxRows={4}
            placeholder={placeholder}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            disabled={disabled}
          />
          <IconButton color="primary" onClick={submit} disabled={disabled || !draft.trim()} aria-label="Send">
            <SendIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default ChatThread;
