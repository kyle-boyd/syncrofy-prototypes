import React from 'react';
import MuiTabs, { TabsProps as MuiTabsProps } from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { BaseComponentProps } from '../../../types';

export interface Tab {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ReactElement;
  content?: React.ReactNode;
}

export interface TabsProps extends Omit<MuiTabsProps, 'children' | 'value' | 'onChange'>, BaseComponentProps {
  /**
   * Tabs to display
   */
  tabs: Tab[];
  /**
   * The currently selected tab value
   */
  value: string | number;
  /**
   * Callback fired when the tab changes
   */
  onChange?: (event: React.SyntheticEvent, newValue: string | number) => void;
  /**
   * The variant to use
   */
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  /**
   * The position of the tabs
   */
  scrollButtons?: 'auto' | true | false;
  /**
   * If true, shows tab panels
   */
  showPanels?: boolean;
}

/**
 * Tabs component for displaying tabbed content
 * Extends MUI Tabs with custom styling
 */
export const Tabs: React.FC<TabsProps> = ({
  className,
  'data-testid': testId,
  tabs,
  value,
  onChange,
  showPanels = false,
  ...props
}) => {
  return (
    <Box>
      <MuiTabs
        className={className}
        data-testid={testId}
        value={value}
        onChange={onChange}
        {...props}
      >
        {tabs.map((tab) => (
          <MuiTab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            disabled={tab.disabled}
            icon={tab.icon}
            iconPosition="start"
          />
        ))}
      </MuiTabs>
      {showPanels && (
        <Box sx={{ mt: 2 }}>
          {tabs.map((tab) => (
            <Box
              key={tab.value}
              role="tabpanel"
              hidden={value !== tab.value}
              sx={{ display: value === tab.value ? 'block' : 'none' }}
            >
              {tab.content}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

