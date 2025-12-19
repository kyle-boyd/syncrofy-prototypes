import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@kyleboyd/design-system';

interface RawEventsModalProps {
  open: boolean;
  onClose: () => void;
  events?: unknown[] | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

interface JsonNode {
  key: string | number;
  value: unknown;
  type: 'object' | 'array' | 'primitive';
  level: number;
}

// Recursive component to render JSON
interface JsonNodeRendererProps {
  node: JsonNode;
}

function JsonNodeRenderer({ node }: JsonNodeRendererProps) {
  const indent = node.level * 20;

  const getValueColor = (value: unknown): string => {
    if (value === null) return '#808080';
    if (typeof value === 'string') return '#0b8043';
    if (typeof value === 'number') return '#1f4788';
    if (typeof value === 'boolean') return '#c7254e';
    return 'inherit';
  };

  const formatValue = (value: unknown): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    return String(value);
  };

  if (node.type === 'primitive') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          py: 0.25,
          pl: `${indent}px`,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: 1.8,
        }}
      >
        {node.key !== '' && (
          <Typography
            component="span"
            sx={{
              color: '#881391',
              mr: 1,
              userSelect: 'none',
            }}
          >
            {typeof node.key === 'number' ? `[${node.key}]` : `"${node.key}"`}:
          </Typography>
        )}
        <Typography
          component="span"
          sx={{
            color: getValueColor(node.value),
            wordBreak: 'break-word',
          }}
        >
          {formatValue(node.value)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          py: 0.25,
          pl: `${indent}px`,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}
      >
        {node.key !== '' && (
          <Typography
            component="span"
            sx={{
              color: '#881391',
              mr: 1,
              userSelect: 'none',
            }}
          >
            {typeof node.key === 'number' ? `[${node.key}]` : `"${node.key}"`}:
          </Typography>
        )}
        <Typography
          component="span"
          sx={{
            color: '#1f4788',
            userSelect: 'none',
          }}
        >
          {node.type === 'array' ? '[' : '{'}
        </Typography>
      </Box>

      <Box>
        {Array.isArray(node.value) ? (
          (node.value as unknown[]).map((item, index) => {
            const childNode: JsonNode = {
              key: index,
              value: item,
              type:
                typeof item === 'object' && item !== null
                  ? Array.isArray(item)
                    ? 'array'
                    : 'object'
                  : 'primitive',
              level: node.level + 1,
            };
            return <JsonNodeRenderer key={index} node={childNode} />;
          })
        ) : (
          Object.entries(node.value as Record<string, unknown>).map(([key, value]) => {
            const childNode: JsonNode = {
              key,
              value,
              type:
                typeof value === 'object' && value !== null
                  ? Array.isArray(value)
                    ? 'array'
                    : 'object'
                  : 'primitive',
              level: node.level + 1,
            };
            return <JsonNodeRenderer key={key} node={childNode} />;
          })
        )}
        <Box
          sx={{
            pl: `${indent}px`,
            py: 0.25,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#1f4788',
          }}
        >
          {node.type === 'array' ? ']' : '}'}
        </Box>
      </Box>
    </Box>
  );
}

interface JsonViewerProps {
  data: unknown;
}

function JsonViewer({ data }: JsonViewerProps) {
  const rootNode: JsonNode = (() => {
    if (Array.isArray(data)) {
      return {
        key: '',
        value: data,
        type: 'array',
        level: 0,
      };
    } else if (typeof data === 'object' && data !== null) {
      return {
        key: '',
        value: data,
        type: 'object',
        level: 0,
      };
    } else {
      return {
        key: '',
        value: data,
        type: 'primitive',
        level: 0,
      };
    }
  })();

  return (
    <Box
      sx={{
        backgroundColor: 'grey.50',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
      }}
    >
      <JsonNodeRenderer node={rootNode} />
    </Box>
  );
}

export function RawEventsModal({
  open,
  onClose,
  events,
  loading = false,
  error = null,
  onRetry,
}: RawEventsModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setCopySuccess(false);
    }
  }, [open]);

  // Handle Esc key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [open, onClose]);

  const handleCopyJson = useCallback(async () => {
    if (!events) return;

    try {
      const jsonString = JSON.stringify(events, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  }, [events]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '90%',
          maxWidth: '90%',
          height: '90%',
          maxHeight: '90%',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" component="h2">
            Raw Transfer Events
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'text.secondary',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, minHeight: 0 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert
              severity="error"
              action={
                onRetry && (
                  <Button size="small" onClick={onRetry}>
                    Retry
                  </Button>
                )
              }
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          {!loading && !error && (!events || events.length === 0) && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 8,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No raw events are available for this transfer.
              </Typography>
            </Box>
          )}

          {!loading && !error && events && events.length > 0 && (
            <JsonViewer data={events} />
          )}
        </Box>

        {/* Footer with Copy JSON and Close Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyJson}
              disabled={!events || events.length === 0}
            >
              Copy JSON
            </Button>
            {copySuccess && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                <CheckIcon fontSize="small" />
                <Typography variant="body2">Copied!</Typography>
              </Box>
            )}
          </Stack>
          <Button
            variant="contained"
            onClick={onClose}
            color="primary"
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

