import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Search } from '@/components/atoms/Search';
import { Dropdown, DropdownOption } from '@/components/molecules/Dropdown';
import { Chips } from '@/components/atoms/Chips';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { SegmentedControl, SegmentedControlItemData } from '@/components/molecules/SegmentedControl';
import { BaseComponentProps } from '@/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import EditIcon from '@mui/icons-material/Edit';

export interface FilterOption {
  id: string;
  label: string;
  options: DropdownOption[];
  value?: string | number;
  placeholder?: string;
  icon?: React.ReactNode;
  /**
   * If true, shows a count badge next to the label (e.g., "Date (1)")
   */
  showCount?: boolean;
  /**
   * Count to display in the badge
   */
  count?: number;
}

export interface ActiveFilter {
  id: string;
  label: string;
  value: string;
  /**
   * The filter option ID this active filter belongs to
   */
  filterId: string;
}

export interface FilterControlsProps extends BaseComponentProps {
  /**
   * Search input configuration
   */
  search?: {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
  };
  /**
   * Array of filter dropdowns to display
   */
  filters?: FilterOption[];
  /**
   * Callback fired when a filter value changes
   */
  onFilterChange?: (filterId: string, value: string | number) => void;
  /**
   * Active filters to display as chips
   */
  activeFilters?: ActiveFilter[];
  /**
   * Callback fired when an active filter is removed
   */
  onFilterRemove?: (filterId: string) => void;
  /**
   * Callback fired when "Clear all filters" is clicked
   */
  onClearAll?: () => void;
  /**
   * Result count text to display (e.g., "1.3 million transfers")
   */
  resultCount?: string;
  /**
   * Time range selector configuration (uses SegmentedControl)
   */
  timeRange?: {
    items: SegmentedControlItemData[];
    selectedId?: string | number;
    onChange?: (selectedId: string | number) => void;
  };
  /**
   * Action buttons to display on the right side
   */
  actions?: {
    /**
     * Primary action button (e.g., "+ New Report")
     */
    primary?: {
      label: string;
      onClick?: () => void;
      icon?: React.ReactNode;
    };
    /**
     * Secondary action button/dropdown (e.g., "Actions", "Customize Columns")
     */
    secondary?: {
      label: string;
      onClick?: () => void;
      options?: DropdownOption[];
      onSelect?: (value: string | number) => void;
      disabled?: boolean;
    };
  };
  /**
   * Label for the clear-all-filters button (e.g. "Reset filters")
   */
  clearAllLabel?: string;
  /**
   * If true, the clear-all button is always shown and disabled when there are no active filters
   */
  alwaysShowClearAll?: boolean;
  /**
   * Layout toggle configuration
   */
  layoutToggle?: {
    /**
     * Current layout mode
     */
    mode?: 'list' | 'grid';
    /**
     * Callback fired when layout mode changes
     */
    onChange?: (mode: 'list' | 'grid') => void;
  };
  /**
   * Edit button configuration (typically for time range filters)
   */
  editButton?: {
    onClick?: () => void;
  };
  /**
   * If true, shows the "Clear all filters" button
   */
  showClearAll?: boolean;
}

/**
 * FilterControls component for filtering tables and content
 * Provides search, filter dropdowns, active filter chips, and action buttons
 * Based on Figma design system
 */
export const FilterControls: React.FC<FilterControlsProps> = ({
  className,
  'data-testid': testId,
  search,
  filters = [],
  onFilterChange,
  activeFilters = [],
  onFilterRemove,
  onClearAll,
  resultCount,
  timeRange,
  actions,
  layoutToggle,
  editButton,
  showClearAll = true,
  clearAllLabel = 'Clear all filters',
  alwaysShowClearAll = false,
}) => {
  const [filterOpenStates, setFilterOpenStates] = useState<Record<string, boolean>>({});

  const handleFilterSelect = (filterId: string, value: string | number) => {
    onFilterChange?.(filterId, value);
    setFilterOpenStates((prev) => ({ ...prev, [filterId]: false }));
  };

  const handleFilterToggle = (filterId: string, open: boolean) => {
    setFilterOpenStates((prev) => ({ ...prev, [filterId]: open }));
  };

  const hasActiveFilters = activeFilters.length > 0;
  const hasFilters = filters.length > 0 || timeRange;
  const showClearAllButton = showClearAll && (hasActiveFilters || alwaysShowClearAll);
  const clearAllDisabled = alwaysShowClearAll && !hasActiveFilters;

  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        padding: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
      }}
    >
      {/* Top Row: Search, Filters, Actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        {/* Search Input */}
        {search && (
          <Box sx={{ flex: search ? '0 1 auto' : 'none', minWidth: search ? '200px' : 'auto' }}>
            <Search
              placeholder={search.placeholder || 'Q Search'}
              value={search.value}
              onChange={(e) => search.onChange?.(e.target.value)}
              onSearch={search.onSearch}
              size="small"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>
        )}

        {/* Filter Dropdowns */}
        {filters.map((filter) => {
          const filterValue = filter.value;
          const selectedOption = filter.options.find((opt) => opt.value === filterValue);
          const displayLabel = filter.showCount && filter.count !== undefined
            ? `${filter.label} (${filter.count})`
            : filter.label;

          return (
            <Dropdown
              key={filter.id}
              options={filter.options}
              value={filterValue}
              onSelect={(value) => handleFilterSelect(filter.id, value)}
              open={filterOpenStates[filter.id]}
              onClose={() => handleFilterToggle(filter.id, false)}
              trigger={
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  endIcon={filter.icon || <ExpandMoreIcon />}
                  onClick={() => handleFilterToggle(filter.id, !filterOpenStates[filter.id])}
                  sx={{
                    minWidth: '120px',
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 400,
                  }}
                >
                  {selectedOption ? selectedOption.label : displayLabel}
                </Button>
              }
            />
          );
        })}

        {/* Time Range Selector */}
        {timeRange && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<ExpandMoreIcon />}
              sx={{
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 400,
              }}
            >
              Filters
            </Button>
            <SegmentedControl
              items={timeRange.items}
              defaultSelectedId={timeRange.selectedId}
              onChange={timeRange.onChange}
              size="sm"
            />
            {editButton && (
              <IconButton
                size="small"
                onClick={editButton.onClick}
                sx={{
                  height: 32,
                  width: 32,
                  padding: '6px 8px',
                }}
              >
                <EditIcon sx={{ width: 16, height: 16 }} />
              </IconButton>
            )}
          </Box>
        )}

        {/* Spacer (or replaced by Actions when actions.secondary is provided) */}
        {actions?.secondary ? (
          <Dropdown
            options={actions.secondary.options || []}
            onSelect={actions.secondary.onSelect}
            trigger={
              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={actions.secondary.disabled}
                onClick={actions.secondary.onClick}
                sx={{
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 400,
                }}
              >
                {actions.secondary.label}
              </Button>
            }
          />
        ) : null}
        <Box sx={{ flex: 1 }} />

        {/* Clear All / Reset Filters */}
        {showClearAllButton && (
          <Button
            variant="text"
            color="secondary"
            size="small"
            startIcon={<ClearIcon />}
            onClick={onClearAll}
            disabled={clearAllDisabled}
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 400,
              minWidth: 'auto',
              padding: '6px 8px',
            }}
          >
            {clearAllLabel}
          </Button>
        )}

        {/* Layout Toggle */}
        {layoutToggle && (
          <Box sx={{ display: 'flex', gap: 0.5, backgroundColor: 'grey.50', borderRadius: '8px', padding: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => layoutToggle.onChange?.('list')}
              sx={{
                height: 32,
                width: 32,
                padding: '6px 8px',
                backgroundColor: layoutToggle.mode === 'list' ? 'background.paper' : 'transparent',
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: layoutToggle.mode === 'list' ? 'background.paper' : 'action.hover',
                },
                boxShadow: layoutToggle.mode === 'list' ? 1 : 'none',
              }}
            >
              <ViewListIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => layoutToggle.onChange?.('grid')}
              sx={{
                height: 32,
                width: 32,
                padding: '6px 8px',
                backgroundColor: layoutToggle.mode === 'grid' ? 'background.paper' : 'transparent',
                borderRadius: '6px',
                '&:hover': {
                  backgroundColor: layoutToggle.mode === 'grid' ? 'background.paper' : 'action.hover',
                },
                boxShadow: layoutToggle.mode === 'grid' ? 1 : 'none',
              }}
            >
              <ViewModuleIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}

        {actions?.primary && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={actions.primary.icon}
            onClick={actions.primary.onClick}
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {actions.primary.label}
          </Button>
        )}
      </Box>

      {/* Active Filters and Result Count Row */}
      {(hasActiveFilters || resultCount) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {/* Result Count */}
          {resultCount && (
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: 1.5,
                color: 'text.primary',
                marginRight: hasActiveFilters ? 0 : 'auto',
              }}
            >
              {resultCount}
            </Typography>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
                flex: resultCount ? 1 : 'none',
              }}
            >
              {activeFilters.map((filter) => (
                <Chips
                  key={filter.id}
                  label={`${filter.label} = ${filter.value}`}
                  variant="rounded"
                  size="small"
                  onDelete={() => onFilterRemove?.(filter.id)}
                  sx={{
                    fontSize: '12px',
                    fontWeight: 400,
                    height: '24px',
                    '& .MuiChip-deleteIcon': {
                      fontSize: '16px',
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
