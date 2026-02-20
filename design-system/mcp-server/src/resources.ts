/**
 * MCP Resource handlers for the Syncrofy Design System.
 * Resources expose structured data for LLM context.
 */

import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  loadTokens,
  loadRegistry,
  loadComponentMetadata,
  loadComponentsByCategory,
  getMuiMapping,
} from './utils.js';

export function registerResources(server: McpServer): void {
  // Full design tokens
  server.registerResource(
    'design-tokens',
    'designsystem://tokens',
    {
      title: 'Design Tokens',
      description:
        'Complete design token set including colors, typography, spacing, shadows, and border radius in DTCG format',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(loadTokens(), null, 2),
        },
      ],
    })
  );

  // Token subset by category
  server.registerResource(
    'design-tokens-category',
    new ResourceTemplate('designsystem://tokens/{category}', {
      list: async () => ({
        resources: [
          { uri: 'designsystem://tokens/color', name: 'Color Tokens' },
          { uri: 'designsystem://tokens/typography', name: 'Typography Tokens' },
          { uri: 'designsystem://tokens/spacing', name: 'Spacing Tokens' },
          { uri: 'designsystem://tokens/shadows', name: 'Shadow Tokens' },
          { uri: 'designsystem://tokens/borderRadius', name: 'Border Radius Tokens' },
          { uri: 'designsystem://tokens/componentOverrides', name: 'Component Override Tokens' },
        ],
      }),
    }),
    {
      title: 'Design Tokens by Category',
      description: 'Token subset filtered by category: color, typography, spacing, shadows, borderRadius, componentOverrides',
      mimeType: 'application/json',
    },
    async (uri, { category }) => {
      const tokens = loadTokens();
      const subset = tokens[category as string];
      if (!subset) {
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(
                {
                  error: `Token category '${category}' not found. Available: color, typography, spacing, shadows, borderRadius, componentOverrides`,
                },
                null,
                2
              ),
            },
          ],
        };
      }
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(subset, null, 2),
          },
        ],
      };
    }
  );

  // Component registry
  server.registerResource(
    'component-registry',
    'designsystem://components',
    {
      title: 'Component Registry',
      description:
        'Full list of all design system components with category, MUI mapping, and status',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(loadRegistry(), null, 2),
        },
      ],
    })
  );

  // Individual component metadata
  server.registerResource(
    'component-info',
    new ResourceTemplate('component://{name}', {
      list: async () => {
        const registry = loadRegistry();
        return {
          resources: registry.components.map((c) => ({
            uri: `component://${c.name}`,
            name: c.displayName,
            description: `${c.category} component`,
          })),
        };
      },
    }),
    {
      title: 'Component Metadata',
      description: 'Detailed metadata for a specific component including props, examples, accessibility, and usage guidelines',
      mimeType: 'application/json',
    },
    async (uri, { name }) => {
      const meta = loadComponentMetadata(name as string);
      if (!meta) {
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(
                {
                  error: `Component '${name}' not found. Use designsystem://components to see available components.`,
                },
                null,
                2
              ),
            },
          ],
        };
      }
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(meta, null, 2),
          },
        ],
      };
    }
  );

  // Components by category
  server.registerResource(
    'components-by-category',
    new ResourceTemplate('components://{category}', {
      list: async () => ({
        resources: [
          { uri: 'components://atoms', name: 'Atom Components' },
          { uri: 'components://molecules', name: 'Molecule Components' },
          { uri: 'components://organisms', name: 'Organism Components' },
        ],
      }),
    }),
    {
      title: 'Components by Category',
      description: 'All component metadata filtered by atomic design category: atoms, molecules, or organisms',
      mimeType: 'application/json',
    },
    async (uri, { category }) => {
      const categoryMap: Record<string, 'atom' | 'molecule' | 'organism'> = {
        atoms: 'atom',
        molecules: 'molecule',
        organisms: 'organism',
      };
      const cat = categoryMap[category as string];
      if (!cat) {
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify(
                {
                  error: `Category '${category}' not found. Use: atoms, molecules, or organisms`,
                },
                null,
                2
              ),
            },
          ],
        };
      }
      const components = loadComponentsByCategory(cat);
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(components, null, 2),
          },
        ],
      };
    }
  );

  // MUI migration guide
  server.registerResource(
    'migration-guide',
    new ResourceTemplate('migration://{muiComponent}', {
      list: async () => {
        const mapping = getMuiMapping();
        return {
          resources: Object.entries(mapping).map(([mui, ds]) => ({
            uri: `migration://${mui}`,
            name: `${mui} → ${ds.component}`,
            description: `Migration guide from MUI ${mui} to ${ds.component}`,
          })),
        };
      },
    }),
    {
      title: 'MUI Migration Guide',
      description: 'Migration instructions from a Material UI component to its design system equivalent',
      mimeType: 'text/markdown',
    },
    async (uri, { muiComponent }) => {
      const mapping = getMuiMapping();
      const ds = mapping[muiComponent as string];

      if (!ds) {
        return {
          contents: [
            {
              uri: uri.href,
              text: `# Migration: ${muiComponent}\n\nNo design system equivalent found for MUI component "${muiComponent}".\n\nAvailable mappings:\n${Object.entries(mapping)
                .map(([mui, d]) => `- ${mui} → ${d.component}`)
                .join('\n')}`,
            },
          ],
        };
      }

      const meta = loadComponentMetadata(ds.component);
      let guide = `# Migrate MUI ${muiComponent} → ${ds.component}\n\n`;
      guide += `**Category:** ${ds.category}\n`;
      guide += `**Import:** \`import { ${ds.component} } from '@kyleboyd/design-system';\`\n\n`;

      if (meta?.description) {
        guide += `## About ${ds.component}\n\n${meta.description}\n\n`;
      }

      if (meta?.migrationExamples?.length) {
        guide += `## Migration Examples\n\n`;
        for (const example of meta.migrationExamples) {
          guide += `### ${example.description}\n\n`;
          guide += `**Before (MUI):**\n\`\`\`tsx\n${example.mui}\n\`\`\`\n\n`;
          guide += `**After (Design System):**\n\`\`\`tsx\n${example.designSystem}\n\`\`\`\n\n`;
        }
      }

      if (meta?.props?.length) {
        guide += `## Props\n\n`;
        guide += `| Prop | Type | Required | Default | Description |\n`;
        guide += `|------|------|----------|---------|-------------|\n`;
        for (const prop of meta.props) {
          guide += `| ${prop.name} | \`${prop.type}\` | ${prop.required ? 'Yes' : 'No'} | ${prop.defaultValue !== undefined ? `\`${prop.defaultValue}\`` : '-'} | ${prop.description} |\n`;
        }
        guide += '\n';
      }

      return {
        contents: [
          {
            uri: uri.href,
            text: guide,
          },
        ],
      };
    }
  );

  // Design system guidelines
  server.registerResource(
    'guidelines',
    'designsystem://guidelines',
    {
      title: 'Design System Guidelines',
      description: 'General usage principles, naming conventions, and patterns for the Syncrofy Design System',
      mimeType: 'text/markdown',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: `# Syncrofy Design System Guidelines

## Overview

The Syncrofy Design System is built on Material UI v7 and follows atomic design principles. All components use the Geist font family and a custom color palette anchored by primary color #266079.

## Architecture

- **Atoms**: Basic building blocks (Button, Input, Avatar, etc.)
- **Molecules**: Combinations of atoms (Dropdown, Tabs, SnackBar, etc.)
- **Organisms**: Complex, self-contained UI sections (Table, FilterControls, Header, etc.)

## Theme

- **Primary Color**: #266079
- **Font Family**: Geist, sans-serif
- **Base Spacing**: 8px
- **Default Border Radius**: 8px
- **Mode**: Light

## Import Patterns

\`\`\`tsx
// Import components
import { Button, Input, Modal } from '@kyleboyd/design-system';

// Import theme for custom ThemeProvider wrapping
import { theme } from '@kyleboyd/design-system';
\`\`\`

## Component Conventions

1. All components accept \`className\` and \`data-testid\` props
2. Components extend MUI counterparts where applicable
3. Use the design system component instead of raw MUI components
4. Wrap your app in \`<ThemeProvider theme={theme}>\` and \`<CssBaseline />\`

## Naming Conventions

- Components use PascalCase: \`Button\`, \`FilterControls\`
- Some differ from MUI names: \`Toggle\` (not Switch), \`Chips\` (not Chip), \`Spinner\` (not CircularProgress)
- Props follow MUI conventions where possible

## Accessibility

- All interactive components support keyboard navigation
- Use \`aria-label\` for icon-only buttons
- Form inputs should have associated labels
- Color choices meet WCAG contrast requirements
`,
        },
      ],
    })
  );
}
