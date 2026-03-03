import React from 'react';
import MuiBreadcrumbs, { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material/Breadcrumbs';
import { BaseComponentProps } from '../../../types';

export interface BreadcrumbsProps extends MuiBreadcrumbsProps, BaseComponentProps {
  /**
   * The content of the component
   */
  children?: React.ReactNode;
  /**
   * Separator element
   */
  separator?: React.ReactNode;
  /**
   * Maximum number of breadcrumbs to display
   */
  maxItems?: number;
}

/**
 * Breadcrumbs component for navigation hierarchy
 * Extends MUI Breadcrumbs with custom styling
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiBreadcrumbs className={className} data-testid={testId} {...props}>
      {props.children}
    </MuiBreadcrumbs>
  );
};

