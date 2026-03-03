import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { BaseComponentProps } from '../../../types';

export interface SlotProps extends BoxProps, BaseComponentProps {
  /**
   * The content of the slot
   */
  children?: React.ReactNode;
  /**
   * Flex direction
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /**
   * Flex alignment
   */
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  /**
   * Flex justification
   */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  /**
   * Gap between children
   */
  gap?: number | string;
  /**
   * Padding
   */
  padding?: number | string;
}

/**
 * Slot component for flexible layout containers
 * A utility component for creating flexible layouts
 */
export const Slot: React.FC<SlotProps> = ({
  className,
  'data-testid': testId,
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  gap,
  padding,
  sx,
  ...props
}) => {
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap: gap,
        padding: padding,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

