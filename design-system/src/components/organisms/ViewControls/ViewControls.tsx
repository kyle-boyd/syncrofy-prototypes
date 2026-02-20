import React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { Dropdown, DropdownOption } from '@/components/molecules/Dropdown';
import { SegmentedControl, SegmentedControlItemData } from '@/components/molecules/SegmentedControl';
import { BaseComponentProps } from '@/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface ViewControlsProps extends BaseComponentProps {
  /**
   * The variant type of the view controls
   * @default 'Views'
   */
  type?: 'Views' | 'Exceptions';
  /**
   * View name to display in the dropdown (Views variant only)
   */
  viewName?: string;
  /**
   * Callback fired when view name dropdown is clicked (Views variant only)
   */
  onViewNameClick?: () => void;
  /**
   * Options for the view name dropdown (Views variant only)
   */
  viewOptions?: DropdownOption[];
  /**
   * Callback fired when a view option is selected (Views variant only)
   */
  onViewSelect?: (value: string | number) => void;
  /**
   * Currently selected view value (Views variant only)
   */
  selectedView?: string | number;
  /**
   * Callback fired when the star icon button is clicked (Views variant only)
   */
  onStarClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Callback fired when the more options icon button is clicked
   */
  onMoreOptionsClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Options for the more options dropdown
   */
  moreOptions?: DropdownOption[];
  /**
   * Callback fired when a more options item is selected
   */
  onMoreOptionsSelect?: (value: string | number) => void;
  /**
   * Segmented control items (Exceptions variant only)
   */
  segmentedControlItems?: SegmentedControlItemData[];
  /**
   * Selected segmented control item ID (Exceptions variant only)
   */
  selectedSegmentId?: string | number;
  /**
   * Callback fired when segmented control selection changes (Exceptions variant only)
   */
  onSegmentChange?: (selectedId: string | number) => void;
}

/**
 * ViewControls component for managing views and view options
 * Supports two variants: Views (with dropdown and star button) and Exceptions (with segmented control)
 * Based on Figma design system
 */
export const ViewControls: React.FC<ViewControlsProps> = ({
  className,
  'data-testid': testId,
  type = 'Views',
  viewName = 'View name',
  onViewNameClick,
  viewOptions = [],
  onViewSelect,
  selectedView,
  onStarClick,
  onMoreOptionsClick,
  moreOptions = [],
  onMoreOptionsSelect,
  segmentedControlItems = [],
  selectedSegmentId,
  onSegmentChange,
}) => {
  const handleMoreOptionsSelect = (value: string | number) => {
    onMoreOptionsSelect?.(value);
  };

  // More options dropdown trigger
  const moreOptionsTrigger = (
    <IconButton
      size="small"
      onClick={onMoreOptionsClick}
      sx={{
        height: 36,
        width: 36,
        padding: '6px 12px',
        border: '1px solid',
        borderColor: 'rgba(33, 33, 33, 0.2)',
        borderRadius: '6px',
        boxShadow: '0px 1px 2px -2px rgba(0, 0, 0, 0.04), 0px 2px 4px -2px rgba(0, 0, 0, 0.08)',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <MoreVertIcon sx={{ fontSize: 20, color: '#424242' }} />
    </IconButton>
  );

  if (type === 'Exceptions') {
    return (
      <Box
        className={className}
        data-testid={testId}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          height: 36,
        }}
      >
        {/* Segmented Control */}
        {segmentedControlItems.length > 0 && (
          <Box
            sx={{
              backgroundColor: 'rgba(33, 33, 33, 0.05)',
              borderRadius: '12px',
              padding: '4px',
            }}
          >
            <SegmentedControl
              items={segmentedControlItems}
              defaultSelectedId={selectedSegmentId}
              onChange={onSegmentChange}
              size="sm"
            />
          </Box>
        )}

        {/* More Options Button */}
        {moreOptions.length > 0 ? (
          <Dropdown
            trigger={moreOptionsTrigger}
            options={moreOptions}
            onSelect={handleMoreOptionsSelect}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          />
        ) : (
          moreOptionsTrigger
        )}
      </Box>
    );
  }

  // Views variant
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        height: 36,
      }}
    >
      {/* View Name Dropdown */}
      {viewOptions.length > 0 ? (
        <Dropdown
          trigger={
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              endIcon={<ExpandMoreIcon />}
              onClick={onViewNameClick}
              sx={{
                width: 280,
                height: 36,
                padding: '6px 12px',
                justifyContent: 'space-between',
                borderColor: 'rgba(33, 33, 33, 0.2)',
                borderRadius: '6px',
                boxShadow: '0px 1px 2px -2px rgba(0, 0, 0, 0.04), 0px 2px 4px -2px rgba(0, 0, 0, 0.08)',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                color: '#212121',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {viewName}
            </Button>
          }
          options={viewOptions}
          onSelect={onViewSelect}
          value={selectedView}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        />
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          size="medium"
          endIcon={<ExpandMoreIcon />}
          onClick={onViewNameClick}
          sx={{
            width: 280,
            height: 36,
            padding: '6px 12px',
            justifyContent: 'space-between',
            borderColor: 'rgba(33, 33, 33, 0.2)',
            borderRadius: '6px',
            boxShadow: '0px 1px 2px -2px rgba(0, 0, 0, 0.04), 0px 2px 4px -2px rgba(0, 0, 0, 0.08)',
            fontSize: '14px',
            fontWeight: 500,
            textTransform: 'none',
            color: '#212121',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {viewName}
        </Button>
      )}

      {/* Star Icon Button */}
      <IconButton
        size="small"
        onClick={onStarClick}
        sx={{
          height: 36,
          width: 36,
          padding: '6px 12px',
          border: '1px solid',
          borderColor: 'rgba(33, 33, 33, 0.2)',
          borderRadius: '6px',
          boxShadow: '0px 1px 2px -2px rgba(0, 0, 0, 0.04), 0px 2px 4px -2px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <StarBorderIcon sx={{ fontSize: 20, color: '#424242' }} />
      </IconButton>

      {/* More Options Button */}
      {moreOptions.length > 0 ? (
        <Dropdown
          trigger={moreOptionsTrigger}
          options={moreOptions}
          onSelect={handleMoreOptionsSelect}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        />
      ) : (
        moreOptionsTrigger
      )}
    </Box>
  );
};

