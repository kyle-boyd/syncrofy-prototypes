import React from 'react';
import MuiListItem, { ListItemProps as MuiListItemProps } from '@mui/material/ListItem';
import MuiListItemText from '@mui/material/ListItemText';
import MuiListItemIcon from '@mui/material/ListItemIcon';
import MuiListItemButton from '@mui/material/ListItemButton';
import { BaseComponentProps } from '../../../types';

export interface ListItemProps extends Omit<MuiListItemProps, 'children' | 'onClick'>, BaseComponentProps {
  /**
   * Primary text content
   */
  primary?: React.ReactNode;
  /**
   * Secondary text content
   */
  secondary?: React.ReactNode;
  /**
   * Icon element to display before the text
   */
  icon?: React.ReactElement;
  /**
   * Action element to display after the text
   */
  action?: React.ReactNode;
  /**
   * If true, the list item is clickable
   */
  button?: boolean;
  /**
   * If true, the list item is selected
   */
  selected?: boolean;
  /**
   * If true, the list item is disabled
   */
  disabled?: boolean;
  /**
   * Callback fired when the item is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * Custom content (overrides primary/secondary)
   */
  children?: React.ReactNode;
}

/**
 * ListItem component for displaying items in a list
 * Extends MUI ListItem with custom styling
 */
export const ListItem: React.FC<ListItemProps> = ({
  className,
  'data-testid': testId,
  primary,
  secondary,
  icon,
  action,
  button = false,
  disabled,
  children,
  ...props
}) => {
  const content = children || (
    <>
      {icon && <MuiListItemIcon>{icon}</MuiListItemIcon>}
      <MuiListItemText primary={primary} secondary={secondary} />
      {action}
    </>
  );

  if (button) {
    return (
      <MuiListItem
        className={className}
        data-testid={testId}
        disablePadding
        {...props}
      >
        <MuiListItemButton onClick={props.onClick as any} disabled={disabled}>
          {content}
        </MuiListItemButton>
      </MuiListItem>
    );
  }

  return (
    <MuiListItem className={className} data-testid={testId} onClick={props.onClick as any} {...props}>
      {content}
    </MuiListItem>
  );
};

