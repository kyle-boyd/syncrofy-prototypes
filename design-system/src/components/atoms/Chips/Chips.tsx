import React from 'react';
import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';
import { BaseComponentProps } from '@/types';

export interface ChipsProps extends Omit<MuiChipProps, 'variant'>, BaseComponentProps {
  /**
   * The content of the chip
   */
  label: React.ReactNode;
  /**
   * The variant to use
   */
  variant?: 'filled' | 'outlined' | 'rounded';
  /**
   * The color of the component
   */
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /**
   * The size of the component
   */
  size?: 'small' | 'medium';
  /**
   * If true, the chip is disabled
   */
  disabled?: boolean;
  /**
   * If true, the chip will be displayed in a deleted state
   */
  onDelete?: () => void;
  /**
   * Icon element
   */
  icon?: React.ReactElement;
  /**
   * Avatar element
   */
  avatar?: React.ReactElement;
}

/**
 * Chip component for compact elements that can be entered, deleted, or selected
 * Extends MUI Chip with custom styling
 */
export const Chips: React.FC<ChipsProps> = ({
  className,
  'data-testid': testId,
  variant,
  sx,
  ...props
}) => {
  const isRounded = variant === 'rounded';

  return (
    <MuiChip
      className={className}
      data-testid={testId}
      variant={isRounded ? undefined : variant}
      sx={{
        ...(isRounded && {
          borderRadius: '50px !important',
        }),
        ...sx,
      }}
      {...props}
    />
  );
};

