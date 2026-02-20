# Syncrofy Design System MCP Server

MCP (Model Context Protocol) server that provides AI tools with structured access to the Syncrofy Design System -- components, design tokens, migration guides, and code generation.

## Quick Start

```bash
cd mcp-server
npm install
npm run build
npm start
```

## Configuration

### Cursor IDE

Add to your Cursor MCP configuration (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "syncrofy-design-system": {
      "command": "node",
      "args": ["/absolute/path/to/syncrofy-ds/mcp-server/dist/index.js"]
    }
  }
}
```

### Other MCP Clients

The server uses stdio transport and works with any MCP-compatible client. Configure according to your client's documentation.

## Resources

| URI Pattern | Description |
|---|---|
| `designsystem://tokens` | Full design token set (DTCG format) |
| `designsystem://tokens/{category}` | Token subset: `color`, `typography`, `spacing`, `borderRadius`, `shadows` |
| `designsystem://components` | Component registry with all 42 components |
| `component://{name}` | Individual component metadata (e.g. `component://Button`) |
| `components://{category}` | Components by category: `atoms`, `molecules`, `organisms` |
| `migration://{muiComponent}` | Migration guide from a specific MUI component |
| `designsystem://guidelines` | General design system usage guidelines |

## Tools

### `get_design_tokens`

Query design tokens by category with optional keyword search.

```json
{ "category": "color", "search": "primary" }
```

### `get_component_info`

Get full metadata for a component including props, examples, and accessibility info.

```json
{ "componentName": "Button" }
```

### `search_components`

Search components by name, description, prop, or use case.

```json
{ "query": "input", "category": "atom" }
```

### `generate_component_code`

Generate a TSX code snippet with correct imports.

```json
{
  "componentName": "Button",
  "props": { "variant": "contained", "color": "primary" },
  "children": "Submit"
}
```

### `migrate_mui_code`

Convert MUI code to design system equivalents.

```json
{ "code": "import { Button, TextField } from '@mui/material';" }
```

### `get_color_palette`

Returns the full color palette from design tokens.

### `get_typography_scale`

Returns the typography scale from design tokens.

### `suggest_component`

Suggest design system components for a UI description.

```json
{ "description": "A form with text fields and a submit button" }
```

### `validate_component_usage`

Check component usage against best practices and provide suggestions.

```json
{ "componentName": "Button", "props": { "variant": "contained" } }
```

## Prompts

| Prompt | Arguments | Description |
|---|---|---|
| `create-component-layout` | `description`, `requirements?` | Guide for building UI layouts with DS components |
| `migrate-from-mui` | `code`, `targetComponents?` | Step-by-step MUI migration workflow |
| `choose-component` | `uiNeed`, `context?` | Interactive flow to pick the right component |
| `apply-theme` | `scope`, `customizations?` | Guide for theme setup and customization |

## Development

```bash
npm run build    # Compile TypeScript
npm run dev      # Watch mode
npm start        # Run the server
```

## Architecture

```
mcp-server/src/
├── index.ts       # Entry point, creates McpServer and connects via stdio
├── resources.ts   # 7 resource handlers (tokens, components, migration)
├── tools.ts       # 9 tool handlers (query, generate, migrate, validate)
├── prompts.ts     # 4 prompt templates (layout, migration, selection, theme)
└── utils.ts       # Data loading from tokens.json, registry, and .meta.json files
```

The server reads data from:

- `src/tokens/tokens.json` -- Design tokens in DTCG format
- `src/tokens/components-registry.json` -- Component manifest
- `src/components/**/*.meta.json` -- Per-component metadata (42 files)

## Troubleshooting

**Server not starting:**
- Run `npm install && npm run build` in the `mcp-server/` directory
- Verify the path in your MCP config is absolute

**Component not found:**
- Names are case-sensitive PascalCase (e.g. `Button`, not `button`)
- Check `src/tokens/components-registry.json` for valid names

**Stale data:**
- Rebuild after changing tokens: `npx tsx scripts/generateTokens.ts`
- Rebuild after changing components: `npx tsx scripts/generateAllMetadata.ts`
- Then rebuild the server: `cd mcp-server && npm run build`
