import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableSortLabel,
  type SxProps,
  type Theme,
} from '@mui/material';
import { BaseComponentProps } from '@/types';

export type SortDirection = 'asc' | 'desc';

export interface TableColumn<T = any> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  headerCheckbox?: boolean;
  headerCheckboxChecked?: boolean;
  headerCheckboxIndeterminate?: boolean;
  onHeaderCheckboxChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  render?: (row: T) => React.ReactNode;
  /** If true, column header shows sort indicator and is clickable to sort (default: true) */
  sortable?: boolean;
  /** For sortable columns with custom render, return a comparable value for sorting */
  sortValue?: (row: T) => string | number;
  /** Initial or constrained width (px) when resizableColumns is true */
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[];
  rows: T[];
  stickyHeader?: boolean;
  striped?: boolean;
  size?: 'small' | 'medium';
  maxHeight?: number;
  /** Column id currently sorted (controlled when onSort is provided) */
  sortBy?: string;
  /** Sort direction (controlled when onSort is provided) */
  sortDirection?: SortDirection;
  /** Called when user requests sort; when provided, sorting is controlled */
  onSort?: (columnId: string, direction: SortDirection) => void;
  /** When true, columns can be resized by dragging the header edge */
  resizableColumns?: boolean;
  /** MUI sx prop merged into the root Box */
  sx?: SxProps<Theme>;
}

const DEFAULT_MIN_WIDTH = 80;
const DEFAULT_MAX_WIDTH = 800;
const DEFAULT_COLUMN_WIDTH = 150;

function getSortValue<T>(row: T, column: TableColumn<T>): string | number {
  if (column.sortValue) {
    return column.sortValue(row);
  }
  const raw = (row as any)?.[column.id];
  if (raw === undefined || raw === null) return '';
  return raw;
}

function compareValues(a: string | number, b: string | number, direction: SortDirection): number {
  const empty = (v: string | number) => v === '' || v === undefined || v === null;
  if (empty(a) && empty(b)) return 0;
  if (empty(a)) return direction === 'asc' ? 1 : -1;
  if (empty(b)) return direction === 'asc' ? -1 : 1;
  const numA = typeof a === 'number' ? a : Number(a);
  const numB = typeof b === 'number' ? b : Number(b);
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
    return direction === 'asc' ? numA - numB : numB - numA;
  }
  const strA = String(a);
  const strB = String(b);
  const cmp = strA.localeCompare(strB, undefined, { numeric: true });
  return direction === 'asc' ? cmp : -cmp;
}

export function Table<T = any>({
  columns,
  rows,
  stickyHeader = false,
  striped = false,
  size = 'medium',
  maxHeight,
  sortBy: controlledSortBy,
  sortDirection: controlledSortDirection,
  onSort,
  resizableColumns = false,
  className,
  'data-testid': testId,
  sx: sxProp,
}: TableProps<T>) {
  const [internalSortBy, setInternalSortBy] = useState<string | null>(null);
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>('asc');

  const isControlledSort = onSort != null;
  const sortBy = isControlledSort ? controlledSortBy ?? undefined : (internalSortBy ?? undefined);
  const sortDirection = isControlledSort
    ? (controlledSortDirection ?? 'asc')
    : internalSortDirection;

  const handleSortClick = useCallback(
    (columnId: string) => {
      const nextDirection: SortDirection =
        sortBy === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
      if (onSort) {
        onSort(columnId, nextDirection);
      } else {
        setInternalSortBy(columnId);
        setInternalSortDirection(nextDirection);
      }
    },
    [sortBy, sortDirection, onSort]
  );

  const sortedRows = useMemo(() => {
    if (!sortBy) return rows;
    const col = columns.find((c) => c.id === sortBy && c.sortable !== false);
    if (!col) return rows;
    return [...rows].sort((rowA, rowB) => {
      const a = getSortValue(rowA, col);
      const b = getSortValue(rowB, col);
      return compareValues(a, b, sortDirection);
    });
  }, [rows, sortBy, sortDirection, columns]);

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    if (!resizableColumns) return {};
    const initial: Record<string, number> = {};
    columns.forEach((col) => {
      const min = col.minWidth ?? DEFAULT_MIN_WIDTH;
      const max = col.maxWidth ?? DEFAULT_MAX_WIDTH;
      let w = col.width ?? DEFAULT_COLUMN_WIDTH;
      w = Math.max(min, Math.min(max, w));
      initial[col.id] = w;
    });
    return initial;
  });

  const [resizing, setResizing] = useState<{
    columnId: string;
    startX: number;
    startWidth: number;
  } | null>(null);
  const [dragMarkerX, setDragMarkerX] = useState<number | null>(null);

  const handleResizeStart = useCallback(
    (columnId: string, clientX: number) => {
      const w = columnWidths[columnId] ?? DEFAULT_COLUMN_WIDTH;
      setResizing({ columnId, startX: clientX, startWidth: w });
      setDragMarkerX(clientX);
    },
    [columnWidths]
  );

  React.useEffect(() => {
    if (!resizing) return;
    const col = columns.find((c) => c.id === resizing.columnId);
    const min = col?.minWidth ?? DEFAULT_MIN_WIDTH;
    const max = col?.maxWidth ?? DEFAULT_MAX_WIDTH;

    const columnLeftEdge = resizing.startX - resizing.startWidth;

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizing.startX;
      const next = Math.min(max, Math.max(min, resizing.startWidth + delta));
      setColumnWidths((prev) => ({ ...prev, [resizing.columnId]: next }));
      setDragMarkerX(columnLeftEdge + next);
    };
    const onMouseUp = () => {
      setResizing(null);
      setDragMarkerX(null);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [resizing, columns]);

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (column.render) {
      return column.render(row);
    }
    return (row as any)?.[column.id] ?? '';
  };

  const tableLayout = resizableColumns ? 'fixed' : undefined;
  const totalTableWidth = resizableColumns
    ? columns.reduce((sum, col) => sum + (columnWidths[col.id] ?? DEFAULT_COLUMN_WIDTH), 0)
    : undefined;
  const tableWidth = resizableColumns ? totalTableWidth : undefined;

  const getCellWidthSx = (column: TableColumn<T>) => {
    if (!resizableColumns || !columnWidths[column.id]) return undefined;
    const min = column.minWidth ?? DEFAULT_MIN_WIDTH;
    const max = column.maxWidth ?? DEFAULT_MAX_WIDTH;
    return {
      width: columnWidths[column.id],
      minWidth: min,
      maxWidth: max,
    };
  };

  const resizeHandleWidth = 6;

  return (
    <Box
      className={className}
      data-testid={testId}
      sx={[
        {
          padding: 0,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
        },
        ...(Array.isArray(sxProp) ? sxProp : sxProp ? [sxProp] : []),
      ]}
    >
      {resizableColumns && dragMarkerX !== null && (
        <Box
          aria-hidden
          sx={{
            position: 'fixed',
            left: dragMarkerX,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'primary.main',
            opacity: 0.8,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          maxHeight: maxHeight || 'none',
          backgroundColor: 'transparent',
          ...(stickyHeader && {
            '& .MuiTableHead-root': {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: 'grey.100',
            },
          }),
        }}
      >
      <MuiTable
        stickyHeader={stickyHeader}
        size={size}
        sx={{
          tableLayout,
          ...(tableWidth != null && { width: tableWidth, minWidth: tableWidth }),
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.100' }}>
            {columns.map((column) => {
              const widthSx = getCellWidthSx(column);
              const isCustomLabel = React.isValidElement(column.label);
              const headerContent = column.headerCheckbox ? (
                <Checkbox
                  checked={column.headerCheckboxChecked || false}
                  indeterminate={column.headerCheckboxIndeterminate}
                  onChange={column.onHeaderCheckboxChange}
                />
              ) : isCustomLabel ? (
                column.label
              ) : column.sortable !== false ? (
                <TableSortLabel
                  active={sortBy === column.id}
                  direction={sortBy === column.id ? sortDirection : 'asc'}
                  onClick={() => handleSortClick(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              ) : (
                column.label
              );
              return (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    ...widthSx,
                    ...(resizableColumns && { position: 'relative' }),
                  }}
                >
                  {headerContent}
                  {resizableColumns && (
                    <Box
                      component="span"
                      role="separator"
                      aria-orientation="vertical"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleResizeStart(column.id, e.clientX);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: resizeHandleWidth,
                        height: '100%',
                        cursor: 'col-resize',
                        userSelect: 'none',
                        borderLeft: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    />
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row, rowIndex) => (
            <TableRow
              key={(row as any)?.id || rowIndex}
              sx={{
                ...(striped && rowIndex % 2 === 1 && {
                  backgroundColor: 'action.hover',
                }),
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={getCellWidthSx(column)}
                >
                  {getCellValue(row, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
    </Box>
  );
}




