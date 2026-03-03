import React from 'react';
import MuiTooltip, { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';
import { BaseComponentProps } from '../../../types';

export interface TooltipProps extends Omit<MuiTooltipProps, 'children'>, BaseComponentProps {
  /**
   * Tooltip title
   */
  title: React.ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement;
  /**
   * The placement of the tooltip
   */
  placement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
  /**
   * If true, the tooltip is shown
   */
  open?: boolean;
  /**
   * If true, the tooltip is disabled
   */
  disabled?: boolean;
  /**
   * The number of milliseconds to wait before showing the tooltip
   */
  enterDelay?: number;
  /**
   * The number of milliseconds to wait before hiding the tooltip
   */
  leaveDelay?: number;
}

/**
 * Tooltip component for displaying additional information on hover
 * Extends MUI Tooltip with custom styling
 */
export const Tooltip: React.FC<TooltipProps> = ({
  className,
  'data-testid': testId,
  children,
  ...props
}) => {
  return (
    <MuiTooltip className={className} {...props}>
      {React.cloneElement(children, { 'data-testid': testId } as any)}
    </MuiTooltip>
  );
};

