import React, { useState, useEffect } from 'react';
import MuiMenu, { MenuProps as MuiMenuProps } from '@mui/material/Menu';
import MuiList from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { ListItem } from '@/components/molecules/ListItem';
import { BaseComponentProps } from '@/types';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  /**
   * Icon element to display before the text
   */
  icon?: React.ReactElement;
  /**
   * Secondary text content
   */
  secondary?: React.ReactNode;
  /**
   * Action element to display after the text
   */
  action?: React.ReactNode;
}

export interface DropdownProps extends Omit<MuiMenuProps, 'open' | 'onClose' | 'anchorEl' | 'onSelect'>, BaseComponentProps {
  /**
   * The element that triggers the dropdown
   */
  trigger: React.ReactElement;
  /**
   * Options to display in the dropdown
   */
  options: DropdownOption[];
  /**
   * Callback fired when an option is selected
   */
  onSelect?: (value: string | number) => void;
  /**
   * Currently selected value
   */
  value?: string | number;
  /**
   * If true, the dropdown is open
   */
  open?: boolean;
  /**
   * Callback fired when the dropdown should close
   */
  onClose?: () => void;
  /**
   * If true, the menu width will hug its contents instead of matching the trigger width
   * @default false
   */
  hugContents?: boolean;
}

/**
 * Dropdown component for displaying a list of options
 * Extends MUI Menu with custom styling
 */
export const Dropdown: React.FC<DropdownProps> = ({
  className,
  'data-testid': testId,
  trigger,
  options,
  onSelect,
  open: controlledOpen,
  onClose: controlledOnClose,
  hugContents = false,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Update menu width when anchorEl changes and menu is open
  useEffect(() => {
    if (anchorEl && open && !hugContents) {
      const width = anchorEl.getBoundingClientRect().width;
      setMenuWidth(width);
    } else if (hugContents) {
      setMenuWidth(undefined);
    }
  }, [anchorEl, open, hugContents]);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalOpen(false);
    }
    setAnchorEl(null);
  };

  const handleTriggerClick = (event: React.MouseEvent<HTMLElement>) => {
    if (controlledOpen === undefined) {
      setInternalOpen(!internalOpen);
    }
    setAnchorEl(event.currentTarget);
    if ((trigger.props as any)?.onClick) {
      (trigger.props as any).onClick(event);
    }
  };

  const handleItemClick = (value: string | number) => {
    if (onSelect) {
      onSelect(value);
    }
    handleClose();
  };

  return (
    <>
      {React.cloneElement(trigger, {
        onClick: handleTriggerClick,
        'aria-controls': open ? 'dropdown-menu' : undefined,
        'aria-haspopup': true,
        'aria-expanded': open ? true : undefined,
      } as any)}
      <MuiMenu
        className={className}
        data-testid={testId}
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'dropdown-button',
        }}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            border: '1px solid rgba(33, 33, 33, 0.10)',
            background: '#FFF',
            boxShadow: '0 8px 8px -4px rgba(0, 0, 0, 0.04), 0 20px 24px -4px rgba(0, 0, 0, 0.08)',
            ...(menuWidth !== undefined && !hugContents && { width: menuWidth }),
            ...(hugContents && { width: 'auto', minWidth: 'auto' }),
          },
        }}
        {...props}
      >
        <MuiList disablePadding>
          {options.map((option) => (
            <ListItem
              key={option.value}
              button
              primary={<Typography variant="body2">{option.label}</Typography>}
              secondary={option.secondary}
              icon={option.icon}
              action={option.action}
              disabled={option.disabled}
              selected={option.value === props.value}
              onClick={() => handleItemClick(option.value)}
            />
          ))}
        </MuiList>
      </MuiMenu>
    </>
  );
};

