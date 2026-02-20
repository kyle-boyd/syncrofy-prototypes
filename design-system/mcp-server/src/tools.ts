/**
 * MCP Tool handlers for the Syncrofy Design System.
 * Tools provide model-controlled actions for component lookup, code generation, and migration.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  loadTokens,
  loadComponentMetadata,
  searchComponents,
  loadAllComponentMetadata,
  getMuiMapping,
  loadRegistry,
  ComponentMetadata,
} from './utils.js';

export function registerTools(server: McpServer): void {
  // Get design tokens by category
  server.registerTool(
    'get_design_tokens',
    {
      title: 'Get Design Tokens',
      description:
        'Query design tokens by category (color, typography, spacing, shadows, borderRadius) or get the full token set. Use this to find exact color values, font sizes, spacing values, etc.',
      inputSchema: z.object({
        category: z
          .string()
          .optional()
          .describe(
            'Token category: "color", "typography", "spacing", "shadows", "borderRadius", "componentOverrides". Omit for all tokens.'
          ),
        search: z
          .string()
          .optional()
          .describe(
            'Search within tokens by key name (e.g., "primary", "h1", "error")'
          ),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ category, search }) => {
      const tokens = loadTokens();

      let result: any;
      if (category) {
        result = tokens[category];
        if (!result) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Token category "${category}" not found. Available categories: ${Object.keys(tokens).filter((k) => !k.startsWith('$')).join(', ')}`,
              },
            ],
          };
        }
      } else {
        result = tokens;
      }

      // Optional search within the result
      if (search) {
        const filtered = filterTokensByKey(result, search.toLowerCase());
        result = filtered;
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // Get component info
  server.registerTool(
    'get_component_info',
    {
      title: 'Get Component Info',
      description:
        'Get detailed metadata for a design system component by name, including props, examples, accessibility info, and usage guidelines.',
      inputSchema: z.object({
        componentName: z
          .string()
          .describe(
            'The component name (e.g., "Button", "Input", "Modal", "Table")'
          ),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ componentName }) => {
      const meta = loadComponentMetadata(componentName);
      if (!meta) {
        const registry = loadRegistry();
        const names = registry.components.map((c) => c.name).join(', ');
        return {
          content: [
            {
              type: 'text' as const,
              text: `Component "${componentName}" not found.\n\nAvailable components: ${names}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(meta, null, 2),
          },
        ],
      };
    }
  );

  // Search components
  server.registerTool(
    'search_components',
    {
      title: 'Search Components',
      description:
        'Search for components by name, description, prop, use case, or MUI equivalent. Returns matching component summaries.',
      inputSchema: z.object({
        query: z
          .string()
          .describe(
            'Search query (e.g., "input", "navigation", "date", "toggle")'
          ),
        category: z
          .enum(['atom', 'molecule', 'organism'])
          .optional()
          .describe('Filter by atomic design category'),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ query, category }) => {
      const results = searchComponents(query, category);

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No components found matching "${query}"${category ? ` in category "${category}"` : ''}. Try a broader search term.`,
            },
          ],
        };
      }

      const summaries = results.map((c) => ({
        name: c.name,
        category: c.category,
        description: c.description,
        muiComponent: c.muiComponent || null,
        propCount: c.props.length,
        importPath: c.importPath,
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(summaries, null, 2),
          },
        ],
      };
    }
  );

  // Generate component code
  server.registerTool(
    'generate_component_code',
    {
      title: 'Generate Component Code',
      description:
        'Generate a code snippet for a design system component with correct imports and prop usage based on a use case description.',
      inputSchema: z.object({
        componentName: z.string().describe('The component name'),
        props: z
          .record(z.any())
          .optional()
          .describe('Props to apply (e.g., { "variant": "contained", "color": "primary" })'),
        useCase: z
          .string()
          .optional()
          .describe('Description of the use case to generate appropriate code'),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ componentName, props, useCase }) => {
      const meta = loadComponentMetadata(componentName);
      if (!meta) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Component "${componentName}" not found. Use search_components to find available components.`,
            },
          ],
        };
      }

      let code = `import { ${meta.name} } from '@kyleboyd/design-system';\n\n`;

      // Build props string
      const propEntries = props ? Object.entries(props) : [];
      const propsString = propEntries
        .map(([key, value]) => {
          if (typeof value === 'string') return `${key}="${value}"`;
          if (typeof value === 'boolean') return value ? key : `${key}={false}`;
          return `${key}={${JSON.stringify(value)}}`;
        })
        .join('\n  ');

      // Determine if component needs children
      const hasChildren = meta.props.some(
        (p) => p.name === 'children' && p.required
      );
      const childrenProp = props?.children || (hasChildren ? `${meta.name} Content` : '');

      if (childrenProp) {
        const filteredProps = propsString
          .split('\n  ')
          .filter((p) => !p.startsWith('children'))
          .join('\n  ');
        code += `<${meta.name}${filteredProps ? `\n  ${filteredProps}` : ''}>\n  ${childrenProp}\n</${meta.name}>`;
      } else {
        code += `<${meta.name}${propsString ? `\n  ${propsString}` : ''} />`;
      }

      let response = '';
      if (useCase) {
        response += `// Use case: ${useCase}\n`;
      }
      response += `// Component: ${meta.name} (${meta.category})\n`;
      if (meta.muiComponent) {
        response += `// Replaces MUI: ${meta.muiComponent}\n`;
      }
      response += `\n${code}\n`;

      // Add relevant prop documentation
      response += `\n// Available props:\n`;
      for (const prop of meta.props.slice(0, 10)) {
        response += `//   ${prop.name}${prop.required ? ' (required)' : ''}: ${prop.type}${prop.defaultValue !== undefined ? ` = ${JSON.stringify(prop.defaultValue)}` : ''}\n`;
      }
      if (meta.props.length > 10) {
        response += `//   ... and ${meta.props.length - 10} more props\n`;
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: response,
          },
        ],
      };
    }
  );

  // Migrate MUI code
  server.registerTool(
    'migrate_mui_code',
    {
      title: 'Migrate MUI Code',
      description:
        'Convert Material UI component imports and usage to Syncrofy Design System equivalents. Provide MUI code and get the migrated version.',
      inputSchema: z.object({
        code: z
          .string()
          .describe('The MUI code (TypeScript/TSX) to migrate'),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ code }) => {
      const mapping = getMuiMapping();
      let migrated = code;
      const changes: string[] = [];

      // Replace imports
      for (const [muiName, ds] of Object.entries(mapping)) {
        const importRegex = new RegExp(
          `import\\s*\\{[^}]*\\b${muiName}\\b[^}]*\\}\\s*from\\s*['"]@mui/material['"]`,
          'g'
        );
        if (importRegex.test(migrated)) {
          changes.push(`${muiName} → ${ds.component}`);
        }

        // Replace component usage in JSX
        const usageRegex = new RegExp(`<${muiName}(\\s|>|/)`, 'g');
        const closingRegex = new RegExp(`</${muiName}>`, 'g');
        if (usageRegex.test(migrated) || closingRegex.test(migrated)) {
          migrated = migrated.replace(usageRegex, `<${ds.component}$1`);
          migrated = migrated.replace(closingRegex, `</${ds.component}>`);
          if (!changes.includes(`${muiName} → ${ds.component}`)) {
            changes.push(`${muiName} → ${ds.component}`);
          }
        }
      }

      // Replace MUI imports with design system imports
      const dsComponents = [...new Set(changes.map((c) => c.split(' → ')[1]))];
      if (dsComponents.length > 0) {
        // Remove MUI imports
        migrated = migrated.replace(
          /import\s*\{[^}]*\}\s*from\s*['"]@mui\/material['"]\s*;?\n?/g,
          ''
        );
        // Add design system import
        const dsImport = `import { ${dsComponents.join(', ')} } from '@kyleboyd/design-system';\n`;
        migrated = dsImport + migrated;
      }

      let response = '## Migration Result\n\n';
      if (changes.length > 0) {
        response += `### Changes Made\n${changes.map((c) => `- ${c}`).join('\n')}\n\n`;
        response += `### Migrated Code\n\`\`\`tsx\n${migrated.trim()}\n\`\`\`\n`;
      } else {
        response += 'No MUI components found to migrate. The code may already use the design system or contain components without direct mappings.\n';
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: response,
          },
        ],
      };
    }
  );

  // Get color palette
  server.registerTool(
    'get_color_palette',
    {
      title: 'Get Color Palette',
      description:
        'Return the complete color palette with semantic names and hex values. Useful for finding the right color for any use case.',
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true },
    },
    async () => {
      const tokens = loadTokens();
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(tokens.color, null, 2),
          },
        ],
      };
    }
  );

  // Get typography scale
  server.registerTool(
    'get_typography_scale',
    {
      title: 'Get Typography Scale',
      description:
        'Return the complete typography scale with all variants (h1-h6, body1, body2, caption, etc.) and their properties.',
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true },
    },
    async () => {
      const tokens = loadTokens();
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(tokens.typography, null, 2),
          },
        ],
      };
    }
  );

  // Suggest component
  server.registerTool(
    'suggest_component',
    {
      title: 'Suggest Component',
      description:
        'Given a UI description or use case, suggest the most appropriate design system component(s) to use.',
      inputSchema: z.object({
        description: z
          .string()
          .describe(
            'Description of the UI element or use case (e.g., "a form with text inputs and a submit button", "a data table with pagination")'
          ),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ description }) => {
      const allComponents = loadAllComponentMetadata();
      const desc = description.toLowerCase();

      // Score each component by relevance
      const scored = allComponents.map((c) => {
        let score = 0;
        const words = desc.split(/\s+/);

        for (const word of words) {
          if (word.length < 3) continue;
          if (c.name.toLowerCase().includes(word)) score += 10;
          if (c.description.toLowerCase().includes(word)) score += 5;
          if (c.usageGuidelines?.whenToUse?.some((u) => u.toLowerCase().includes(word))) score += 3;
          if (c.props.some((p) => p.name.toLowerCase().includes(word))) score += 1;
        }

        return { component: c, score };
      });

      const suggestions = scored
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (suggestions.length === 0) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `No specific component suggestions for: "${description}". Try describing the UI element more specifically, or use search_components to browse available components.`,
            },
          ],
        };
      }

      const result = suggestions.map((s) => ({
        name: s.component.name,
        category: s.component.category,
        description: s.component.description,
        relevanceScore: s.score,
        whenToUse: s.component.usageGuidelines?.whenToUse?.slice(0, 3) || [],
        importPath: s.component.importPath,
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // Validate component usage
  server.registerTool(
    'validate_component_usage',
    {
      title: 'Validate Component Usage',
      description:
        'Check if a component usage follows best practices from the design system guidelines. Returns suggestions and warnings.',
      inputSchema: z.object({
        componentName: z.string().describe('The component name'),
        props: z
          .record(z.any())
          .optional()
          .describe('Props being used'),
        context: z
          .string()
          .optional()
          .describe('Context of usage (e.g., "inside a form", "in a table header")'),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ componentName, props, context }) => {
      const meta = loadComponentMetadata(componentName);
      if (!meta) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Component "${componentName}" not found.`,
            },
          ],
        };
      }

      const warnings: string[] = [];
      const suggestions: string[] = [];

      // Check required props
      const usedProps = props ? Object.keys(props) : [];
      for (const prop of meta.props) {
        if (prop.required && !usedProps.includes(prop.name)) {
          warnings.push(`Missing required prop: "${prop.name}" (${prop.type}) - ${prop.description}`);
        }
      }

      // Check accessibility
      if (meta.accessibility) {
        if (
          componentName === 'IconButton' &&
          !usedProps.includes('aria-label')
        ) {
          warnings.push(
            'IconButton should have an aria-label since it has no visible text'
          );
        }
      }

      // Add best practices
      if (meta.usageGuidelines?.bestPractices) {
        suggestions.push(...meta.usageGuidelines.bestPractices);
      }

      // Check for "whenNotToUse" context
      if (context && meta.usageGuidelines?.whenNotToUse) {
        for (const warning of meta.usageGuidelines.whenNotToUse) {
          if (context.toLowerCase().includes(warning.toLowerCase().split('(')[0].trim())) {
            warnings.push(`Potential misuse: ${warning}`);
          }
        }
      }

      const result = {
        component: meta.name,
        category: meta.category,
        valid: warnings.length === 0,
        warnings,
        suggestions,
        accessibility: meta.accessibility || null,
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}

/**
 * Recursively filter a token object by key name
 */
function filterTokensByKey(obj: any, query: string, path = ''): any {
  if (typeof obj !== 'object' || obj === null) return undefined;

  const result: any = {};
  let hasMatch = false;

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) {
      result[key] = value;
      continue;
    }

    if (key.toLowerCase().includes(query)) {
      result[key] = value;
      hasMatch = true;
    } else if (typeof value === 'object' && value !== null) {
      const nested = filterTokensByKey(value, query, `${path}.${key}`);
      if (nested !== undefined && Object.keys(nested).some((k) => !k.startsWith('$'))) {
        result[key] = nested;
        hasMatch = true;
      }
    }
  }

  return hasMatch ? result : undefined;
}
