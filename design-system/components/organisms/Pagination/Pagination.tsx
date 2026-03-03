import React from 'react';
import MuiPagination, { PaginationProps as MuiPaginationProps } from '@mui/material/Pagination';
import { BaseComponentProps } from '../../../types';

export interface PaginationProps extends MuiPaginationProps, BaseComponentProps {
  /**
   * The current page (1-indexed)
   */
  page: number;
  /**
   * The total number of pages
   */
  count: number;
  /**
   * Callback fired when the page changes
   */
  onChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
  /**
   * The variant to use
   */
  variant?: 'outlined' | 'text';
  /**
   * The shape of the pagination buttons
   */
  shape?: 'circular' | 'rounded';
  /**
   * The size of the component
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * If true, displays the number of pages
   */
  showFirstButton?: boolean;
  /**
   * If true, displays the last button
   */
  showLastButton?: boolean;
  /**
   * If true, hides the previous and next buttons
   */
  hidePrevButton?: boolean;
  /**
   * If true, hides the next button
   */
  hideNextButton?: boolean;
}

/**
 * Pagination component for navigating through pages
 * Extends MUI Pagination with custom styling
 */
export const Pagination: React.FC<PaginationProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiPagination className={className} data-testid={testId} {...props} />
  );
};

