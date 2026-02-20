import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export interface TagStyledProps {
  $size: 'small' | 'medium';
  $variant: 'info' | 'error' | 'warning' | 'success' | 'neutral' | 'primary';
}

export const TagContainer = styled(Box)<TagStyledProps>(({ theme, $size, $variant }) => {
  const isSmall = $size === 'small';
  const height = isSmall ? 24 : 28;
  const borderRadius = height / 2; // 12px for small, 14px for medium
  const iconSize = isSmall ? 16 : 20;

  // Get variant colors
  const getVariantColors = () => {
    switch ($variant) {
      case 'info':
        return {
          background: 'rgba(59, 130, 246, 0.08)', // info.main with 8% opacity
          text: theme.palette.info.dark,
          icon: theme.palette.info.main,
        };
      case 'error':
        return {
          background: 'rgba(199, 58, 58, 0.08)', // error.main with 8% opacity
          text: theme.palette.error.dark,
          icon: theme.palette.error.main,
        };
      case 'warning':
        return {
          background: 'rgba(143, 108, 26, 0.08)', // warning.main with 8% opacity
          text: theme.palette.warning.dark,
          icon: theme.palette.warning.main,
        };
      case 'success':
        return {
          background: 'rgba(6, 122, 87, 0.08)', // success.main with 8% opacity
          text: theme.palette.success.dark,
          icon: theme.palette.success.main,
        };
      case 'neutral':
        return {
          background: theme.palette.grey[50], // lightest grey
          text: theme.palette.grey[800],
          icon: theme.palette.grey[600],
        };
      case 'primary':
        return {
          background: 'rgba(38, 96, 121, 0.08)', // primary.main with 8% opacity
          text: theme.palette.primary.dark,
          icon: theme.palette.primary.main,
        };
      default:
        return {
          background: theme.palette.grey[50],
          text: theme.palette.grey[800],
          icon: theme.palette.grey[600],
        };
    }
  };

  const colors = getVariantColors();

  return {
    display: 'inline-flex',
    alignItems: 'center',
    height: `${height}px`,
    padding: '0 8px',
    borderRadius: `${borderRadius}px`,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: theme.typography.fontFamily,
    fontSize: isSmall ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
    fontWeight: isSmall ? theme.typography.caption.fontWeight : theme.typography.body2.fontWeight,
    lineHeight: isSmall ? theme.typography.caption.lineHeight : theme.typography.body2.lineHeight,
    gap: '8px',
    // Not clickable - no interaction states
    cursor: 'default',
    userSelect: 'none',
    '& .tag-icon': {
      fontSize: `${iconSize}px`,
      color: colors.icon,
      flexShrink: 0,
    },
  };
});
