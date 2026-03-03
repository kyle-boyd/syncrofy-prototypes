import React from 'react';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { BaseComponentProps } from '../../../types';

export interface LinkProps extends MuiLinkProps, BaseComponentProps {
  /**
   * The content of the link
   */
  children: React.ReactNode;
  /**
   * The URL to link to
   */
  href?: string;
  /**
   * The color of the link
   */
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  /**
   * If true, the link will be displayed with underline
   */
  underline?: 'none' | 'hover' | 'always';
  /**
   * If true, the link will open in a new tab
   */
  target?: string;
  /**
   * Callback fired when the link is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Link component for navigation
 * Extends MUI Link with custom styling
 */
export const Link: React.FC<LinkProps> = ({
  className,
  'data-testid': testId,
  ...props
}) => {
  return (
    <MuiLink className={className} data-testid={testId} {...props}>
      {props.children}
    </MuiLink>
  );
};

