import React from 'react';
import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import { BaseComponentProps } from '../../../types';
import { Box } from '@mui/material';

export interface AvatarProps extends MuiAvatarProps, BaseComponentProps {
  /**
   * Image source URL
   */
  src?: string;
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  /**
   * Initials or text to display when no image is provided
   */
  children?: React.ReactNode;
  /**
   * Size of the avatar
   */
  size?: '40px' | '32px' | '24px' | '18px';
  /**
   * Show a status badge indicator
   */
  badge?: boolean;
}

/**
 * Avatar component for displaying user profile pictures or initials
 * Extends MUI Avatar with custom styling
 */
export const Avatar: React.FC<AvatarProps> = ({
  className,
  'data-testid': testId,
  size = '40px',
  badge = false,
  sx,
  ...props
}) => {
  // Calculate badge position based on size
  const getBadgePosition = () => {
    if (size === '40px' || size === '32px') {
      return { bottom: '-3px', right: '-3px' };
    }
    return { bottom: '-7px', right: '-7px' };
  };

  const badgePosition = getBadgePosition();

  // Get font size based on avatar size
  const getFontSize = () => {
    if (size === '40px') return '16px';
    if (size === '32px') return '14px';
    if (size === '24px') return '12px';
    return '10px';
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
      }}
      className={className}
      data-testid={testId}
    >
      <MuiAvatar
        sx={{
          width: size,
          height: size,
          fontSize: getFontSize(),
          ...(props.src ? {} : {
            backgroundColor: 'rgba(33, 33, 33, 0.05)',
            color: 'rgba(33, 33, 33, 0.65)',
          }),
          border: '1px solid rgba(33, 33, 33, 0.1)',
          ...sx,
        }}
        {...props}
      >
        {props.children}
      </MuiAvatar>
      {badge && (
        <Box
          sx={{
            position: 'absolute',
            ...badgePosition,
            width: '12px',
            height: '12px',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              width: '8px',
              height: '8px',
              borderRadius: '100px',
              backgroundColor: 'rgba(6, 122, 87, 0.8)',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

