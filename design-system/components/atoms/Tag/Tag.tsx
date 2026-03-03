import React, { ReactNode } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import DangerousIcon from '@mui/icons-material/Dangerous';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TagContainer } from './Tag.styled';

export interface TagProps {
  /**
   * The text content of the tag
   */
  label?: string;
  /**
   * The variant to use
   */
  variant?: 'info' | 'error' | 'warning' | 'success' | 'neutral' | 'primary';
  /**
   * The size of the component
   */
  size?: 'small' | 'medium';
  /**
   * Custom icon to display
   */
  icon?: ReactNode;
  /**
   * If true, hides the icon
   */
  hideIcon?: boolean;
  /**
   * If true, hides the label
   */
  hideLabel?: boolean;
  /**
   * Additional CSS class
   */
  className?: string;
  /**
   * Test id for testing
   */
  'data-testid'?: string;
}

/**
 * Tag component for displaying labels or categories
 */
export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'neutral',
  size = 'medium',
  icon,
  hideIcon = false,
  hideLabel = false,
  className,
  'data-testid': testId,
}) => {
  // Get default icon for variant
  const getDefaultIcon = () => {
    switch (variant) {
      case 'info':
      case 'neutral':
      case 'primary':
        return <InfoIcon className="tag-icon" />;
      case 'error':
        return <DangerousIcon className="tag-icon" />;
      case 'warning':
        return <WarningAmberIcon className="tag-icon" />;
      case 'success':
        return <CheckCircleIcon className="tag-icon" />;
      default:
        return <InfoIcon className="tag-icon" />;
    }
  };

  // Determine if icon should be rendered
  const shouldRenderIcon = !hideIcon && (icon || getDefaultIcon());
  // Determine if label should be rendered
  const shouldRenderLabel = !hideLabel && label;

  // Use custom icon if provided, otherwise use default
  const iconElement = icon || getDefaultIcon();

  return (
    <TagContainer
      $size={size}
      $variant={variant}
      className={className}
      data-testid={testId}
    >
      {shouldRenderIcon && iconElement}
      {shouldRenderLabel && <span>{label}</span>}
    </TagContainer>
  );
};
