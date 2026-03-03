import React from 'react';
import { Box, BoxProps } from '@mui/material';
import { BaseComponentProps } from '../../../types';

export interface LogoProps extends BoxProps, BaseComponentProps {
  /**
   * The source URL of the logo image
   */
  src?: string;
  /**
   * Alt text for the logo
   */
  alt?: string;
  /**
   * The width of the logo
   */
  width?: number | string;
  /**
   * The height of the logo
   */
  height?: number | string;
  /**
   * Custom logo content (text or SVG)
   */
  children?: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Logo component for displaying application or brand logos
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  'data-testid': testId,
  src,
  alt = 'Logo',
  width,
  height,
  children,
  ...props
}) => {
  return (
    <Box
      className={className}
      data-testid={testId}
      component="div"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width || 'auto',
        height: height || 'auto',
      }}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        children
      )}
    </Box>
  );
};

