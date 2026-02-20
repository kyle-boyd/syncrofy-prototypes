import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BaseComponentProps } from '@/types';
import { Tooltip } from '@/components/atoms/Tooltip';

export interface CollapsibleSideNavItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  onClick?: () => void;
  disabled?: boolean;
}

export interface CollapsibleSideNavProps extends BaseComponentProps {
  /**
   * Navigation items to display
   */
  items: CollapsibleSideNavItem[];
  /**
   * Currently selected item ID
   */
  selectedItemId?: string;
  /**
   * Callback when an item is selected
   */
  onItemSelect?: (itemId: string) => void;
  /**
   * Whether the sidebar is expanded
   */
  expanded?: boolean;
  /**
   * Callback when expand state changes
   */
  onExpandedChange?: (expanded: boolean) => void;
}

/**
 * CollapsibleSideNav component for side navigation with smooth expand/collapse animation
 */
export const CollapsibleSideNav: React.FC<CollapsibleSideNavProps> = ({
  className,
  'data-testid': testId,
  items,
  selectedItemId,
  onItemSelect,
  expanded = true,
  onExpandedChange,
  ...props
}) => {
  const theme = useTheme();

  const handleItemClick = (item: CollapsibleSideNavItem) => {
    if (item.disabled) return;
    onItemSelect?.(item.id);
    item.onClick?.();
  };

  const handleToggleExpand = () => {
    onExpandedChange?.(!expanded);
  };

  const sidebarVariants = {
    expanded: {
      width: 240,
      transition: {
        duration: 0.3,
      },
    },
    collapsed: {
      width: 48,
      transition: {
        duration: 0.3,
      },
    },
  };

  const textVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        delay: 0.1,
      },
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Box
      className={className}
      data-testid={testId}
      sx={{
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
      }}
      {...props}
    >
      <motion.div
        variants={sidebarVariants}
        animate={expanded ? 'expanded' : 'collapsed'}
        initial={expanded ? 'expanded' : 'collapsed'}
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 64,
          }}
        >
          <img
            src={expanded ? '/logos/Syncrofy Logo.svg' : '/logos/Syncrofy Logo Collapsed.svg'}
            alt="Syncrofy Logo"
          />
        </Box>

        {/* Navigation items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
          {items.map((item) => {
            const isSelected = selectedItemId === item.id;

            const itemContent = (
              <Box
                onClick={() => handleItemClick(item)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 32,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.5 : 1,
                  backgroundColor: isSelected
                    ? theme.palette.primary.main
                    : 'transparent',
                  color: isSelected
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.action.hover,
                  },
                  transition: 'background-color 0.2s ease-in-out',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: expanded ? 24 : 32,
                    height: expanded ? 24 : 32,
                    mr: expanded ? 1.5 : 0,
                    color: 'inherit',
                    '& svg': {
                      fontSize: 16,
                    },
                  }}
                >
                  {item.icon}
                </Box>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: 'inherit',
                        }}
                      >
                        {item.label}
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            );

            if (!expanded) {
              return (
                <Tooltip
                  key={item.id}
                  title={item.label}
                  placement="right"
                  enterDelay={300}
                  leaveDelay={0}
                >
                  {itemContent}
                </Tooltip>
              );
            }

            return (
              <Box key={item.id}>
                {itemContent}
              </Box>
            );
          })}
        </Box>

        {/* Bottom toggle button - medium size */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            minHeight: 48,
          }}
        >
          <Box
            onClick={handleToggleExpand}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: expanded ? 1.5 : 0,
              py: 0.5,
              borderRadius: 999,
              cursor: 'pointer',
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              {expanded ? '«' : '»'}
            </Box>
            {expanded && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  fontSize: 12,
                }}
              >
                Collapse
              </Box>
            )}
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};
