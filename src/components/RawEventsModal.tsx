import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Stack,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  List,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import { Button, ListItem } from '@kyleboyd/design-system';

export interface RawFile {
  id: string;
  name: string;
  data?: unknown[] | null;
  loading?: boolean;
  error?: string | null;
  onLoad?: () => Promise<void>;
}

interface RawEventsModalProps {
  open: boolean;
  onClose: () => void;
  events?: unknown[] | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  files?: RawFile[];
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

type ModalStep = 'file-selection' | 'viewing';

export function RawEventsModal({
  open,
  onClose,
  events,
  loading = false,
  error = null,
  onRetry,
  files,
}: RawEventsModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [step, setStep] = useState<ModalStep>('file-selection');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Determine if we should show file selection (if files prop is provided with more than one file)
  const showFileSelection = files && files.length > 1;
  
  // Get the currently selected file or use the legacy events prop
  const selectedFile = files?.find(f => f.id === selectedFileId);
  const currentEvents = selectedFile?.data ?? events;
  const currentLoading = selectedFile?.loading ?? loading;
  const currentError = selectedFile?.error ?? error;
  const currentOnRetry = selectedFile?.onLoad ?? onRetry;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setCopySuccess(false);
      setStep(showFileSelection ? 'file-selection' : 'viewing');
      setSelectedFileId(null);
    } else if (open && !showFileSelection) {
      // If there's only one file or using legacy events, go directly to viewing
      setStep('viewing');
      if (files && files.length === 1) {
        setSelectedFileId(files[0].id);
      }
    }
  }, [open, showFileSelection, files]);

  // Load file data when a file is selected (if onLoad is provided and data is not already loaded)
  useEffect(() => {
    if (selectedFile && selectedFile.onLoad && !selectedFile.data && !selectedFile.loading) {
      selectedFile.onLoad();
    }
  }, [selectedFile]);

  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);
    setStep('viewing');
  };

  const handleBackToFileSelection = () => {
    setStep('file-selection');
  };

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
    if (!currentEvents) return;

    try {
      const jsonString = JSON.stringify(currentEvents, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  }, [currentEvents]);

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {step === 'viewing' && showFileSelection && (
              <IconButton
                aria-label="back to file selection"
                onClick={handleBackToFileSelection}
                sx={{
                  color: 'text.secondary',
                  mr: 1,
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="h6" sx={{ fontWeight: 600 }}>
              {step === 'file-selection' ? 'Select File to View' : selectedFile ? `Raw Data: ${selectedFile.name}` : 'Raw Transfer Events'}
            </Typography>
          </Box>
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
          {step === 'file-selection' && showFileSelection ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select a file to view its raw JSON data:
              </Typography>
              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {files?.map((file) => (
                  <ListItem
                    key={file.id}
                    button
                    onClick={() => handleFileSelect(file.id)}
                    primary={file.name}
                    icon={<DescriptionIcon />}
                    selected={selectedFileId === file.id}
                  />
                ))}
              </List>
            </Box>
          ) : (
            <>
              {currentLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {currentError && (
                <Alert
                  severity="error"
                  action={
                    currentOnRetry && (
                      <Button size="small" onClick={currentOnRetry}>
                        Retry
                      </Button>
                    )
                  }
                  sx={{ mb: 2 }}
                >
                  {currentError}
                </Alert>
              )}

              {!currentLoading && !currentError && (!currentEvents || (Array.isArray(currentEvents) && currentEvents.length === 0)) && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 8,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No raw events are available for this file.
                  </Typography>
                </Box>
              )}

              {!currentLoading && !currentError && currentEvents && !(Array.isArray(currentEvents) && currentEvents.length === 0) && (
                <JsonViewer data={currentEvents} />
              )}
            </>
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
            {step === 'viewing' && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyJson}
                  disabled={!currentEvents || (Array.isArray(currentEvents) && currentEvents.length === 0)}
                >
                  Copy JSON
                </Button>
                {copySuccess && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                    <CheckIcon fontSize="small" />
                    <Typography variant="body2">Copied!</Typography>
                  </Box>
                )}
              </>
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

