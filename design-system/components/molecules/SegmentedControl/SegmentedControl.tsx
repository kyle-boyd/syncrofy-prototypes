import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { SegmentedControlItem, SegmentedControlItemSize } from '../../atoms/SegmentedControlItem/SegmentedControlItem';
import { BaseComponentProps } from '../../../types';

export interface SegmentedControlItemData {
  id: string | number;
  text?: string;
  icon?: React.ReactNode;
  size?: SegmentedControlItemSize;
  disabled?: boolean;
}

export interface SegmentedControlProps extends BaseComponentProps {
  /**
   * Array of items to display in the segmented control
   */
  items: SegmentedControlItemData[];

  /**
   * The ID of the initially selected item
   */
  defaultSelectedId?: string | number;

  /**
   * Callback fired when the selected item changes
   */
  onChange?: (selectedId: string | number) => void;

  /**
   * The size variant for all items (can be overridden per item)
   * @default 'md'
   */
  size?: SegmentedControlItemSize;

  /**
   * Whether the entire control is disabled
   * @default false
   */
  disabled?: boolean;
}

/**
 * SegmentedControl component for selecting between multiple options
 * Uses SegmentedControlItem atoms with keyboard navigation and smooth animations
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  className,
  'data-testid': testId,
  items,
  defaultSelectedId,
  onChange,
  size = 'md',
  disabled = false,
  ...rest
}) => {
  const [selectedId, setSelectedId] = useState<string | number | undefined>(defaultSelectedId);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update selectedId when defaultSelectedId changes
  useEffect(() => {
    setSelectedId(defaultSelectedId);
  }, [defaultSelectedId]);

  const handleItemClick = useCallback((itemId: string | number) => {
    const item = items.find(i => i.id === itemId);
    if (item?.disabled || disabled) return;

    setSelectedId(itemId);
    onChange?.(itemId);
  }, [items, disabled, onChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    const enabledItems = items.filter(item => !item.disabled);
    const currentSelectedIndex = enabledItems.findIndex(item => item.id === selectedId);

    let newIndex = currentSelectedIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentSelectedIndex > 0 ? currentSelectedIndex - 1 : enabledItems.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentSelectedIndex < enabledItems.length - 1 ? currentSelectedIndex + 1 : 0;
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < items.length) {
          const focusedItem = items[focusedIndex];
          if (!focusedItem.disabled) {
            handleItemClick(focusedItem.id);
          }
        }
        return;
      default:
        return;
    }

    if (newIndex >= 0 && newIndex < enabledItems.length) {
      const newItem = enabledItems[newIndex];
      handleItemClick(newItem.id);
      setFocusedIndex(items.findIndex(item => item.id === newItem.id));
    }
  }, [disabled, items, selectedId, focusedIndex, handleItemClick]);


  // Determine content type for each item
  const getContentType = (item: SegmentedControlItemData) => {
    if (item.icon && item.text) return 'icon-text';
    if (item.icon) return 'icon-only';
    return 'text-only';
  };

  // Determine item size (use item-specific size or fallback to control size)
  const getItemSize = (item: SegmentedControlItemData): SegmentedControlItemSize => {
    return item.size || size;
  };

  return (
    <Box
      ref={containerRef}
      className={className}
      data-testid={testId}
      component="div"
      role="radiogroup"
      onKeyDown={handleKeyDown}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        gap: 0.5, // 4px gap between items
        padding: 0.5, // 4px padding around the container
        borderRadius: size === 'sm' ? '10px' : '12px', // 10px for small, 12px for medium
        backgroundColor: 'grey.50', // Light background for the container
        ...(disabled && {
          opacity: 0.5,
          pointerEvents: 'none',
        }),
      }}
      {...rest}
    >
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        const itemSize = getItemSize(item);
        const isDisabled = item.disabled || disabled;

        return (
          <motion.div
            key={item.id}
            layout
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          >
            <SegmentedControlItem
              variant={isSelected ? 'selected' : 'unselected'}
              size={itemSize}
              content={getContentType(item)}
              children={item.text}
              icon={item.icon}
              disabled={isDisabled}
              onClick={() => handleItemClick(item.id)}
              data-testid={`segmented-control-item-${item.id}`}
            />
          </motion.div>
        );
      })}
    </Box>
  );
};

SegmentedControl.displayName = 'SegmentedControl';

