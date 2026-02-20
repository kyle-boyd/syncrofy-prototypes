# Syncrofy Design System

A comprehensive design system based on Material UI (MUI) with React and TypeScript, following atomic design principles.

## Features

- 🎨 **Custom Theming**: Extended MUI theme with custom colors, typography, and component overrides
- ⚛️ **Atomic Design**: Components organized into Atoms, Molecules, and Organisms
- 📦 **TypeScript**: Full type safety with exported prop types
- 🎯 **Tree-shakeable**: Barrel exports for optimal bundle size
- 🔧 **Extensible**: Easy to customize and extend

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

This builds the library package for npm publishing, generating:
- `dist/index.js` - Main entry point
- `dist/components.js` - Components-only export
- `dist/theme.js` - Theme-only export
- TypeScript declaration files (`.d.ts`)

## Publishing to npm

This package is published as `@syncrofy/design-system` on npm.

### Prerequisites

1. Ensure you have an npm account with access to publish `@syncrofy/design-system`
2. Set up an npm token as a GitHub secret named `NPM_TOKEN` in the repository settings

### Publishing a New Version

1. **Make your changes** to components, theme, or other design system code
2. **Test locally**:
   ```bash
   npm run build        # Verify build works
   npm run storybook    # Test in Storybook
   ```
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. **Bump version and create tag**:
   ```bash
   npm version patch    # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor    # for new features (1.0.0 -> 1.1.0)
   npm version major    # for breaking changes (1.0.0 -> 2.0.0)
   ```
   This automatically:
   - Updates version in `package.json`
   - Creates a git commit with version change
   - Creates a git tag (e.g., v1.0.1)
5. **Push version tag**:
   ```bash
   git push origin main
   git push origin --tags
   ```
6. **GitHub Actions automatically publishes**:
   - Detects the version tag
   - Builds the package
   - Runs type checks
   - Publishes to npm
   - Usually takes 2-5 minutes

The package will be available on npm within a few minutes. Check publication status:
```bash
npm view @syncrofy/design-system version
```

### Local Development with npm link

To test the package locally in another project before publishing:

```bash
# In syncrofy-ds
npm run build
npm link

# In your other project
npm link @syncrofy/design-system
```

See the workflow documentation below for more details.

## Testing

### Unit Tests

```bash
npm test
```

### UI Tests

```bash
npm run test:ui
```

### Testing Options

#### 1. Browser-Based Visual Testing (Recommended)

Run visual tests directly in your browser with interactive feedback:

```bash
npm run test:browser
```

Or use the browser UI for a visual test runner:
```bash
npm run test:browser:ui
```

#### 2. Terminal-Based Visual Regression Tests

The design system includes visual regression testing using Playwright to ensure components maintain their visual appearance across changes.

**Setup:**
1. Start Storybook (required for visual tests):
```bash
npm run storybook
```

2. In another terminal, run visual regression tests:
```bash
npm run test:visual
```

**Updating Baselines:**
When you intentionally change component appearance, update the visual baselines:
```bash
npm run test:visual:update
```

#### 3. Chromatic Visual Testing

For cloud-based visual testing with team collaboration:

```bash
npx chromatic --project-token=YOUR_PROJECT_TOKEN
```

#### Current Baselines

- Button component variants (Primary, Secondary, Outlined, Text, Small, Medium, Large, Disabled, Full Width)
- Baselines are stored in `tests/visual-regression/__screenshots__/`
- Your original Button.png screenshot serves as the primary baseline

#### Adding Screenshots for New Components

1. Add your desired screenshot to the `screenshots/` folder
2. Create visual regression tests in `tests/visual-regression/`
3. Copy screenshots to the `__screenshots__` directory as baselines

## Component Structure

### Atoms (23 components)
Base building blocks of the design system:
- Avatar
- Badge
- Breadcrumbs
- Button
- Checkbox
- Chips
- Date Picker
- Divider
- Icon
- Icon Button
- Input
- Link
- Logo
- Password Input
- Radio
- Search
- Segmented Control Item
- Slot
- Spinner
- Tag
- Toggle
- Toggle Button
- Tooltip

### Molecules (8 components)
Composite components built from atoms:
- Button Group
- Dropdown
- List Item
- Segmented Control
- Snack Bar
- Stepper
- Tabs
- Typeahead

### Organisms (11 components)
Complex components built from molecules and atoms:
- Accordion
- Collapsible Side Nav
- Filter Controls
- Header
- Modal
- Page Header
- Pagination
- Side Nav
- Table
- Top Nav
- View Controls

## Usage

### Basic Setup

```tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/components';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Using Components

```tsx
import { Button, Input, Modal, Table } from '@/components';

function MyComponent() {
  return (
    <>
      <Button variant="contained" color="primary">
        Click me
      </Button>
      <Input label="Email" />
      <Modal open={true} title="Example Modal">
        Content here
      </Modal>
    </>
  );
}
```

### Importing from Specific Categories

```tsx
// Import from atoms only
import { Button, Input } from '@/components/atoms';

// Import from molecules only
import { Dropdown, Tabs } from '@/components/molecules';

// Import from organisms only
import { Modal, Table } from '@/components/organisms';
```

## Theme Customization

The theme extends MUI's default theme and includes:

- **Custom Palette**: Based on design system color (#89C3E1)
- **Typography Scale**: Custom font sizes and weights
- **Component Overrides**: Pre-styled components with consistent spacing and borders
- **Spacing**: 8px base unit

### Customizing the Theme

```tsx
import { theme } from '@/components';
import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    primary: {
      main: '#YOUR_COLOR',
    },
  },
});
```

## TypeScript Support

All components export their prop types for full TypeScript support:

```tsx
import { Button, ButtonProps } from '@/components';

const buttonProps: ButtonProps = {
  variant: 'contained',
  color: 'primary',
  children: 'Click me',
};

<Button {...buttonProps} />;
```

## Path Aliases

The project uses path aliases for cleaner imports:

- `@/` - Points to `src/`
- `@/components` - All components
- `@/theme` - Theme configuration
- `@/types` - Type definitions

## Dependencies

- React 18+
- Material UI v7
- TypeScript 5+
- Emotion (for CSS-in-JS)

## MCP Server

The design system includes an MCP (Model Context Protocol) server that provides AI tools with structured access to components, design tokens, migration guides, and code generation.

### Setup

```bash
cd mcp-server
npm install
npm run build
```

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

### Resources

| URI | Description |
|---|---|
| `designsystem://tokens` | Design tokens (DTCG format) |
| `designsystem://tokens/{category}` | Token subset (color, typography, spacing, etc.) |
| `designsystem://components` | Component registry (42 components) |
| `component://{name}` | Individual component metadata |
| `components://{category}` | Components by category (atoms, molecules, organisms) |
| `migration://{muiComponent}` | MUI-to-DS migration guide |
| `designsystem://guidelines` | Design system usage guidelines |

### Tools

| Tool | Description |
|---|---|
| `get_design_tokens` | Query tokens by category with optional search |
| `get_component_info` | Get full metadata for a component |
| `search_components` | Search by name, description, or prop |
| `generate_component_code` | Generate TSX snippets with correct imports |
| `migrate_mui_code` | Convert MUI code to design system equivalents |
| `get_color_palette` | Get the color palette |
| `get_typography_scale` | Get the typography scale |
| `suggest_component` | Suggest components for a UI description |
| `validate_component_usage` | Check usage against best practices |

### Prompts

| Prompt | Description |
|---|---|
| `create-component-layout` | Guide for building layouts |
| `migrate-from-mui` | Step-by-step MUI migration |
| `choose-component` | Pick the right component |
| `apply-theme` | Theme setup and customization |

See [mcp-server/README.md](mcp-server/README.md) for full documentation.

## Publishing Workflow

### Daily Development Workflow

#### Viewing Changes Locally

**Viewing Design System Changes in Storybook:**
```bash
npm run storybook  # Runs on http://localhost:6006
```

#### Using npm link for Local Testing

To test design system changes in another project (like prototypes) without publishing:

**In syncrofy-ds:**
```bash
npm run build  # Build the design system
npm link       # Create a global symlink
```

**In your consuming project (e.g., syncrofy-prototypes):**
```bash
npm link @syncrofy/design-system  # Link to local build
npm run dev  # Start dev server to see changes
```

**To unlink when done:**
```bash
npm unlink @syncrofy/design-system
npm install  # Restore npm package
```

#### Syncing Changes Locally

1. Make changes in `syncrofy-ds`
2. Build: `npm run build`
3. If using `npm link`, changes are automatically reflected when you rebuild
4. Test in consuming project

#### Publishing Changes

1. Test locally (Storybook + build)
2. Commit changes: `git commit -m "Description"`
3. Push: `git push origin main`
4. Bump version: `npm version patch|minor|major`
5. Push tag: `git push origin main && git push origin --tags`
6. GitHub Actions publishes automatically

For more detailed workflow documentation, see [docs/PUBLISHING_WORKFLOW.md](docs/PUBLISHING_WORKFLOW.md).

## Migration Guide

See [docs/MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md) for a comprehensive guide on migrating from Material UI to the Syncrofy Design System.

## License

ISC
