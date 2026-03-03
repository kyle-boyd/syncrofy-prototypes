import React, { forwardRef } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { BaseComponentProps } from '../../../types';

export type SegmentedControlItemVariant = 'selected' | 'unselected';

export type SegmentedControlItemSize = 'sm' | 'md';

export type SegmentedControlItemContent = 'icon-only' | 'text-only' | 'icon-text';

export interface SegmentedControlItemProps extends BaseComponentProps {
  /**
   * The visual variant of the item
   * @default 'unselected'
   */
  variant?: SegmentedControlItemVariant;

  /**
   * The size variant of the item
   * @default 'md'
   */
  size?: SegmentedControlItemSize;

  /**
   * The content to display in the item
   * @default 'text-only'
   */
  content?: SegmentedControlItemContent;

  /**
   * The text content to display
   */
  children?: string;

  /**
   * The icon to display (when content includes icon)
   */
  icon?: React.ReactNode;

  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler for the item
   */
  onClick?: () => void;
}

/**
 * Segmented Control Item Component
 *
 * Individual item component for SegmentedControl. Supports selected/unselected variants,
 * different sizes, and various content options (icon-only, text-only, or icon + text).
 */
export const SegmentedControlItem = forwardRef<HTMLButtonElement, SegmentedControlItemProps>(({
  className,
  'data-testid': testId,
  variant = 'unselected',
  size = 'md',
  content = 'text-only',
  children,
  icon,
  disabled = false,
  onClick,
  ...rest
}, ref) => {
  const theme = useTheme();

  // Size configurations
  const sizeConfig = {
    sm: {
      height: '24px', // 24px height
      paddingX: '8px', // 8px horizontal padding
      borderRadius: '6px', // 6px border radius
      typography: 'caption', // caption text style
    },
    md: {
      height: '32px', // 32px height
      paddingX: '16px', // 16px horizontal padding
      borderRadius: '8px', // 8px border radius
      typography: 'body2', // body2 text style
    },
  };

  const currentSize = sizeConfig[size];

  // Base styles
  const baseStyles = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1, // 8px gap between icon and text (theme.spacing(1) = 8px)
    transition: theme.transitions.create(['background-color', 'color', 'border-color', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightMedium,
    border: '1px solid transparent',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    height: currentSize.height,
    paddingLeft: currentSize.paddingX,
    paddingRight: currentSize.paddingX,
    borderRadius: currentSize.borderRadius,
    typography: currentSize.typography,
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 1,
    },
  };

  // Variant styles
  const variantStyles = {
    unselected: {
      backgroundColor: 'transparent',
      color: theme.palette.text.secondary,
      borderColor: 'transparent',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.text.primary,
      },
      '&:active': {
        backgroundColor: theme.palette.action.selected,
      },
      ...(disabled && {
        color: theme.palette.text.disabled,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        boxShadow: 'none',
      }),
    },
    selected: {
      backgroundColor: '#FFFFFF', // elevation2 background color
      color: theme.palette.text.primary,
      borderColor: theme.palette.divider,
      boxShadow: theme.shadows[1], // elevation1
      // Selected items retain their colors on hover/press
      ...(disabled && {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.text.disabled,
        borderColor: 'transparent',
        boxShadow: 'none',
      }),
    },
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <Button
      ref={ref}
      className={className}
      data-testid={testId}
      disabled={disabled}
      onClick={handleClick}
      aria-pressed={variant === 'selected'}
      sx={{
        ...baseStyles,
        ...variantStyles[variant],
        width: 'auto', // Hug contents
        minWidth: 'auto', // No minimum width enforced
        textTransform: 'none', // Prevent text transformation
      } as any}
      {...rest}
    >
      {(content === 'icon-only' || content === 'icon-text') && icon && (
        <Box
          component="span"
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-hidden="true"
        >
          {icon}
        </Box>
      )}
      {(content === 'text-only' || content === 'icon-text') && children && (
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {children}
        </Box>
      )}
    </Button>
  );
});

SegmentedControlItem.displayName = 'SegmentedControlItem';
