import { useEffect, useState, useMemo } from 'react';
import { Box, Stack, Typography, IconButton, Popover, Divider, Menu, TextField, InputAdornment, MenuItem } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { Button } from '@kyleboyd/design-system';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface CustomizeColumnsModalProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  columns: ColumnConfig[];
  allAvailableColumns: ColumnConfig[];
  onApply: (visibleColumnIds: string[]) => void;
  onReset: () => void;
}

export function CustomizeColumnsModal({
  open,
  anchorEl,
  onClose,
  columns,
  allAvailableColumns,
  onApply,
  onReset,
}: CustomizeColumnsModalProps) {
  const [localColumns, setLocalColumns] = useState<ColumnConfig[]>(columns);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<{ element: HTMLElement; index: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetMenuAnchor, setResetMenuAnchor] = useState<HTMLElement | null>(null);

  // Keep local state in sync when the popover is opened or columns change
  useEffect(() => {
    if (open) {
      setLocalColumns(columns);
      setSearchQuery('');
    }
  }, [open, columns]);

  const handleRemoveColumn = (id: string) => {
    setLocalColumns((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, visible: false } : col,
      ),
    );
  };

  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setColumnMenuAnchor({ element: event.currentTarget, index });
    setSearchQuery('');
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
    setSearchQuery('');
  };

  const handleColumnToggle = (columnId: string) => {
    if (!columnMenuAnchor) return;
    const { index } = columnMenuAnchor;
    setLocalColumns((prev) => {
      const newColumns = [...prev];
      const selectedColumn = allAvailableColumns.find((col) => col.id === columnId);
      if (selectedColumn) {
        newColumns[index] = { ...selectedColumn, visible: true };
      }
      return newColumns;
    });
    handleColumnMenuClose();
  };

  // Filter available columns based on search
  const filteredAvailableColumns = useMemo(() => {
    if (!searchQuery.trim()) return allAvailableColumns;
    const query = searchQuery.toLowerCase();
    return allAvailableColumns.filter((col) =>
      col.label.toLowerCase().includes(query)
    );
  }, [allAvailableColumns, searchQuery]);

  const handleApply = () => {
    const visibleIds = localColumns.filter((c) => c.visible).map((c) => c.id);
    onApply(visibleIds);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleResetMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setResetMenuAnchor(event.currentTarget);
  };

  const handleResetMenuClose = () => {
    setResetMenuAnchor(null);
  };

  const handleResetColumns = () => {
    onReset();
    handleResetMenuClose();
  };

  const handleResetColumnWidths = () => {
    // TODO: Implement reset column widths functionality
    handleResetMenuClose();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleCancel}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 320,
          maxWidth: 400,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Select Columns
          </Typography>
          <IconButton
            size="small"
            onClick={handleResetMenuOpen}
            sx={{ 
              ml: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '50%',
              width: 32,
              height: 32,
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          {/* Column List */}
          <Box>
            <Divider sx={{ mx: -2 }} />
            <Box
              sx={{
                maxHeight: 360,
                overflow: 'auto',
              }}
            >
              {localColumns.map((column, index) => (
                <Box
                  key={column.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 0.5,
                    '&:hover .remove-column-button': {
                      opacity: 1,
                    },
                  }}
                >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                  <DragIndicatorIcon
                    fontSize="small"
                    sx={{ color: 'text.disabled', cursor: 'grab' }}
                  />
                  <Button
                    variant="text"
                    onClick={(e) => handleColumnMenuOpen(e, index)}
                    endIcon={
                      <ExpandMoreIcon
                        className="column-caret"
                        sx={{
                          fontSize: '16px',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                        }}
                      />
                    }
                    sx={{
                      minWidth: 180,
                      justifyContent: 'space-between',
                      textTransform: 'none',
                      fontSize: '14px',
                      color: 'text.primary',
                      border: 'none',
                      py: '4px',
                      '&:hover': {
                        border: '1px solid',
                        borderColor: 'divider',
                        '& .column-caret': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {column.label}
                  </Button>
                </Stack>
                <IconButton
                  size="small"
                  className="remove-column-button"
                  aria-label={`Remove ${column.label}`}
                  onClick={() => handleRemoveColumn(column.id)}
                  sx={{
                    padding: '4px',
                    color: 'text.secondary',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '16px',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
                </Box>
              ))}
            </Box>
            <Divider sx={{ mx: -2 }} />
          </Box>

          {/* Add Column Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
            >
              Add Column
            </Button>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              pt: 1,
            }}
          >
            <Button variant="text" size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleApply}
              disabled={localColumns.every((c) => !c.visible)}
            >
              Apply
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Column Selection Menu */}
      <Menu
        anchorEl={columnMenuAnchor?.element || null}
        open={Boolean(columnMenuAnchor)}
        onClose={handleColumnMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            maxWidth: 180,
            maxHeight: 400,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {/* Search Input */}
        <Box sx={{ px: 2, pt: 0.5, pb: 0.5, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            size="small"
            placeholder="Search Column..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: {
                fontSize: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                '& input': {
                  fontSize: '12px',
                  padding: '0px',
                  height: '16px',
                },
              },
            }}
          />
        </Box>

        {/* Column List */}
        <Box
          sx={{
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'grid',
          }}
        >
            {filteredAvailableColumns.map((availableCol) => {
              const isSelected = localColumns[columnMenuAnchor?.index || 0]?.id === availableCol.id;
              return (
                <Box
                  key={availableCol.id}
                  onClick={() => handleColumnToggle(availableCol.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', minWidth: 0 }}>
                  {isSelected ? (
                    <CheckIcon sx={{ fontSize: '20px', mr: 1, color: 'primary.main' }} />
                  ) : (
                    <Box sx={{ width: '20px', height: '20px', mr: 1 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      display: 'block',
                    }}
                    title={availableCol.label}
                  >
                    {availableCol.label}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Menu>

      {/* Reset Options Menu */}
      <Menu
        anchorEl={resetMenuAnchor}
        open={Boolean(resetMenuAnchor)}
        onClose={handleResetMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <MenuItem 
          onClick={handleResetColumns}
          sx={{ typography: 'body2' }}
        >
          <RestartAltIcon sx={{ mr: 1, fontSize: '20px' }} />
          Reset Columns to Default
        </MenuItem>
        <MenuItem 
          onClick={handleResetColumnWidths}
          sx={{ typography: 'body2' }}
        >
          <ViewColumnIcon sx={{ mr: 1, fontSize: '20px' }} />
          Reset Column Widths
        </MenuItem>
      </Menu>
    </Popover>
  );
}


