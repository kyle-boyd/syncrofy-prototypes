import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { BaseComponentProps } from '@/types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';

export interface PageHeaderProps extends BaseComponentProps {
  /**
   * The main title of the page
   */
  title: string;
  /**
   * If true, shows the breadcrumb section with back button
   */
  showBreadcrumb?: boolean;
  /**
   * The breadcrumb label (e.g., "Transfers")
   */
  breadcrumbLabel?: string;
  /**
   * Callback fired when the breadcrumb button is clicked
   */
  onBreadcrumbClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * If true, shows an info icon button next to the title
   */
  showInfoIcon?: boolean;
  /**
   * Callback fired when the info icon is clicked
   */
  onInfoClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The refresh status text (e.g., "Last refreshed 1 minute ago")
   */
  refreshStatus?: string;
  /**
   * Callback fired when the refresh button is clicked
   */
  onRefreshClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * PageHeader component for displaying page titles with optional breadcrumbs and refresh controls
 * This component provides a consistent header layout for pages
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  className,
  'data-testid': testId,
  title,
  showBreadcrumb = true,
  breadcrumbLabel = 'Transfers',
  onBreadcrumbClick,
  showInfoIcon = true,
  onInfoClick,
  refreshStatus = 'Last refreshed 1 minute ago',
  onRefreshClick,
}) => {
  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1,
        width: '100%',
      }}
    >
      {/* Breadcrumb Section */}
      {showBreadcrumb && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Button
            variant="text"
            size="small"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            onClick={onBreadcrumbClick}
            sx={{
              padding: '6px 8px',
              minWidth: 'auto',
              height: 32,
              fontSize: '12px',
              fontWeight: 600,
              color: 'text.primary',
              textTransform: 'none',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            {breadcrumbLabel}
          </Button>
        </Box>
      )}

      {/* Title and Actions Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Left: Title with Info Icon */}
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: 1.6,
              letterSpacing: '-0.4px',
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          {showInfoIcon && (
            <IconButton
              size="small"
              onClick={onInfoClick}
              sx={{
                width: 32,
                height: 32,
                padding: '6px 8px',
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.primary' }} />
            </IconButton>
          )}
        </Box>

        {/* Right: Refresh Status and Button */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.25,
            alignItems: 'center',
          }}
        >
          {refreshStatus && (
            <Typography
              variant="caption"
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: '16px',
                color: 'text.secondary',
                textAlign: 'right',
                width: '228px',
              }}
            >
              {refreshStatus}
            </Typography>
          )}
          <IconButton
            size="small"
            onClick={onRefreshClick}
            sx={{
              width: 32,
              height: 32,
              padding: '6px 8px',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '6px',
              boxShadow: '0px 1px 2px -2px rgba(0, 0, 0, 0.04), 0px 2px 4px -2px rgba(0, 0, 0, 0.08)',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <RefreshIcon sx={{ fontSize: 16, color: 'text.primary' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

