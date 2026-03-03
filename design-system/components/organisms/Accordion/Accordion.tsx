import React from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BaseComponentProps } from '../../../types';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends BaseComponentProps {
  /**
   * Accordion items to display
   */
  items: AccordionItem[];
  /**
   * If true, only one item can be expanded at a time
   */
  exclusive?: boolean;
  /**
   * Currently expanded item ID(s)
   */
  expanded?: string | string[];
  /**
   * Callback fired when expansion state changes
   */
  onChange?: (expanded: string | string[]) => void;
  /**
   * The variant to use
   */
  variant?: 'default' | 'outlined' | 'elevation';
}

/**
 * Accordion component for collapsible content sections
 * Extends MUI Accordion with custom styling
 */
export const Accordion: React.FC<AccordionProps> = ({
  className,
  'data-testid': testId,
  items,
  exclusive = false,
  expanded: controlledExpanded,
  onChange,
  variant = 'default',
}) => {
  const [internalExpanded, setInternalExpanded] = React.useState<string | string[]>(
    exclusive ? '' : []
  );

  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleChange = (itemId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    let newExpanded: string | string[];
    
    if (exclusive) {
      newExpanded = isExpanded ? itemId : '';
    } else {
      const currentExpanded = Array.isArray(expanded) ? expanded : [];
      newExpanded = isExpanded
        ? [...currentExpanded, itemId]
        : currentExpanded.filter((id) => id !== itemId);
    }

    if (onChange) {
      onChange(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  const isExpanded = (itemId: string) => {
    if (exclusive) {
      return expanded === itemId;
    }
    return Array.isArray(expanded) && expanded.includes(itemId);
  };

  return (
    <div className={className} data-testid={testId}>
      {items.map((item) => (
        <MuiAccordion
          key={item.id}
          expanded={isExpanded(item.id)}
          onChange={handleChange(item.id)}
          disabled={item.disabled}
          variant={variant === 'outlined' ? 'outlined' : undefined}
          elevation={variant === 'elevation' ? 1 : 0}
          sx={{ mb: variant === 'default' ? 1 : 0 }}
        >
          <MuiAccordionSummary expandIcon={<ExpandMoreIcon />}>
            {item.title}
          </MuiAccordionSummary>
          <MuiAccordionDetails>{item.content}</MuiAccordionDetails>
        </MuiAccordion>
      ))}
    </div>
  );
};

