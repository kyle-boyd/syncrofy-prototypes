/**
 * Component metadata structure and utilities
 * Used for generating AI-friendly documentation and MCP server resources
 */

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description: string;
  examples?: string[];
}

export interface ComponentExample {
  title: string;
  description: string;
  code: string;
  muiEquivalent?: string;
}

export interface ComponentMetadata {
  name: string;
  displayName: string;
  category: 'atom' | 'molecule' | 'organism';
  description: string;
  muiComponent?: string;
  muiPackage?: string;
  props: ComponentProp[];
  examples: ComponentExample[];
  migrationExamples?: {
    mui: string;
    designSystem: string;
    description: string;
  }[];
  relatedComponents?: string[];
  accessibility?: {
    ariaAttributes?: string[];
    keyboardNavigation?: string;
    screenReaderNotes?: string;
  };
  usageGuidelines?: {
    whenToUse: string[];
    whenNotToUse: string[];
    bestPractices: string[];
    commonPatterns: string[];
  };
  importPath: string;
  exportPath: string;
}

/**
 * MUI Component mapping - maps MUI components to design system components
 */
export const MUI_COMPONENT_MAP: Record<string, { component: string; category: 'atom' | 'molecule' | 'organism' }> = {
  'Button': { component: 'Button', category: 'atom' },
  'TextField': { component: 'Input', category: 'atom' },
  'Checkbox': { component: 'Checkbox', category: 'atom' },
  'Radio': { component: 'Radio', category: 'atom' },
  'Switch': { component: 'Toggle', category: 'atom' },
  'IconButton': { component: 'IconButton', category: 'atom' },
  'Chip': { component: 'Chips', category: 'atom' },
  'Avatar': { component: 'Avatar', category: 'atom' },
  'Badge': { component: 'Badge', category: 'atom' },
  'Link': { component: 'Link', category: 'atom' },
  'Divider': { component: 'Divider', category: 'atom' },
  'CircularProgress': { component: 'Spinner', category: 'atom' },
  'Tooltip': { component: 'Tooltip', category: 'atom' },
  'Breadcrumbs': { component: 'Breadcrumbs', category: 'atom' },
  'Menu': { component: 'Dropdown', category: 'molecule' },
  'Tabs': { component: 'Tabs', category: 'molecule' },
  'Snackbar': { component: 'SnackBar', category: 'molecule' },
  'Dialog': { component: 'Modal', category: 'organism' },
  'Accordion': { component: 'Accordion', category: 'organism' },
  'Table': { component: 'Table', category: 'organism' },
  'Pagination': { component: 'Pagination', category: 'organism' },
};

/**
 * Get MUI component replacement for a design system component
 */
export function getMUIReplacement(componentName: string): string | undefined {
  const entry = Object.entries(MUI_COMPONENT_MAP).find(
    ([_, value]) => value.component === componentName
  );
  return entry ? entry[0] : undefined;
}

/**
 * Get design system component for a MUI component
 */
export function getDesignSystemComponent(muiComponent: string): { component: string; category: string } | undefined {
  return MUI_COMPONENT_MAP[muiComponent];
}



