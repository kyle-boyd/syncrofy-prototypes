/**
 * MCP Prompt templates for the Syncrofy Design System.
 * Prompts are user-controlled templates that guide LLM interactions.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function registerPrompts(server: McpServer): void {
  // Create component layout prompt
  server.registerPrompt(
    'create-component-layout',
    {
      title: 'Create Component Layout',
      description:
        'Guide for building a page section or layout using Syncrofy Design System components. Describe what you want to build and get a structured implementation plan.',
      argsSchema: {
        description: z
          .string()
          .describe(
            'Description of the page/section to build (e.g., "a data table with search, filters, and pagination")'
          ),
        requirements: z
          .string()
          .optional()
          .describe('Additional requirements or constraints'),
      },
    },
    ({ description, requirements }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are helping build a UI layout using the Syncrofy Design System (@kyleboyd/design-system).

## Design System Context

The Syncrofy Design System is built on Material UI v7 with:
- **Font**: Geist, sans-serif
- **Primary color**: #266079
- **Spacing**: 8px base unit
- **Border radius**: 8px default
- Components organized as atoms, molecules, and organisms

## Available Components

**Atoms**: Avatar, Badge, Breadcrumbs, Button, Checkbox, Chips, DatePicker, Divider, Icon, IconButton, Input, Link, Logo, PasswordInput, Radio, Search, SegmentedControlItem, Slot, Spinner, Tag, Toggle, ToggleButton, Tooltip

**Molecules**: ButtonGroup, Dropdown, ListItem, SegmentedControl, SnackBar, Stepper, Tabs, Typeahead

**Organisms**: Accordion, FilterControls, Modal, Navigation (SideNav, TopNav, CollapsibleSideNav, Header), PageHeader, Pagination, Table, ViewControls

## Task

Build a layout for: ${description}

${requirements ? `Additional requirements: ${requirements}` : ''}

Please:
1. List the components needed from the design system
2. Provide the correct import statements from '@kyleboyd/design-system'
3. Show the complete JSX structure with appropriate props
4. Wrap the app in ThemeProvider with the design system theme
5. Follow accessibility best practices
6. Use the search_components and get_component_info tools to look up exact prop types

Use the design system's tools to verify component APIs before writing code.`,
          },
        },
      ],
    })
  );

  // Migrate from MUI prompt
  server.registerPrompt(
    'migrate-from-mui',
    {
      title: 'Migrate from MUI',
      description:
        'Step-by-step migration workflow to convert Material UI code to use Syncrofy Design System components.',
      argsSchema: {
        code: z
          .string()
          .describe('The MUI code to migrate'),
        scope: z
          .string()
          .optional()
          .describe('Scope of migration: "full" for entire file, "component" for a single component'),
      },
    },
    ({ code, scope }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are helping migrate Material UI code to the Syncrofy Design System (@kyleboyd/design-system).

## Migration Scope: ${scope || 'full'}

## MUI Code to Migrate

\`\`\`tsx
${code}
\`\`\`

## Migration Steps

1. **Identify MUI components** - Use the migrate_mui_code tool to get automatic mappings
2. **Check component APIs** - Use get_component_info for each design system component to verify prop compatibility
3. **Update imports** - Replace @mui/material imports with @kyleboyd/design-system
4. **Adjust props** - Some props may differ (e.g., TextField -> Input, Dialog -> Modal)
5. **Verify theme** - Ensure ThemeProvider wraps the app with the design system theme

## Key MUI to DS Mappings
- Button -> Button
- TextField -> Input
- Switch -> Toggle
- Dialog -> Modal
- Menu -> Dropdown
- Chip -> Chips (note the plural)
- CircularProgress -> Spinner
- Snackbar -> SnackBar (note the casing)

Please migrate the code above, explaining each change. Use the design system tools to verify component APIs.`,
          },
        },
      ],
    })
  );

  // Choose component prompt
  server.registerPrompt(
    'choose-component',
    {
      title: 'Choose Component',
      description:
        'Interactive flow to pick the right design system component for a specific UI requirement.',
      argsSchema: {
        uiDescription: z
          .string()
          .describe('Description of what the UI element should do or look like'),
      },
    },
    ({ uiDescription }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Help me choose the right component from the Syncrofy Design System for this UI need:

"${uiDescription}"

Please:
1. Use the suggest_component tool with this description
2. For each suggested component, use get_component_info to get full details
3. Compare the top candidates and explain why each might be appropriate
4. Recommend the best option with a code example
5. Mention any accessibility considerations
6. Note if the component should be combined with others (e.g., Table + Pagination + FilterControls)`,
          },
        },
      ],
    })
  );

  // Apply theme prompt
  server.registerPrompt(
    'apply-theme',
    {
      title: 'Apply Theme',
      description:
        'Guide for applying and customizing the Syncrofy Design System theme in a React application.',
      argsSchema: {
        framework: z
          .string()
          .optional()
          .describe('Framework being used (e.g., "Next.js", "Vite", "Create React App")'),
        customizations: z
          .string()
          .optional()
          .describe('Any theme customizations needed'),
      },
    },
    ({ framework, customizations }) => ({
      messages: [
        {
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `Help me set up the Syncrofy Design System theme in my ${framework || 'React'} application.

${customizations ? `Customization needs: ${customizations}` : ''}

Please:
1. Use the get_design_tokens tool to show the current token values
2. Show how to install the package: npm install @kyleboyd/design-system
3. Demonstrate the ThemeProvider setup with CssBaseline
4. Show how to access theme values in custom styled components
5. Explain how the theme's palette, typography, and spacing work
6. If customizations are needed, show how to extend the theme

The package exports:
- \`theme\` - The MUI theme object
- \`palette\` - Color palette
- \`typography\` - Typography scale  
- \`components\` - Component overrides
- All UI components (Button, Input, etc.)`,
          },
        },
      ],
    })
  );
}
