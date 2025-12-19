# Syncrofy Design System

Material UI-based component library following atomic design principles.

## Package Information

- **Package Name**: `@syncrofy/design-system`
- **Version**: See `package.json`
- **Registry**: npm (public)

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

This will:
1. Build the library using Vite
2. Generate TypeScript declaration files

### Type Check

```bash
npm run build:check
```

## Publishing

This package is automatically published to npm when a version tag is pushed to the repository.

### Publishing a New Version

1. Update version in `package.json`:
   ```bash
   npm version patch  # 0.1.0 -> 0.1.1
   npm version minor  # 0.1.0 -> 0.2.0
   npm version major  # 0.1.0 -> 1.0.0
   ```

2. Commit and push:
   ```bash
   git push && git push --tags
   ```

3. GitHub Actions will automatically build and publish to npm.

### Manual Publishing (if needed)

```bash
npm run build
npm publish
```

## Package Structure

- **Main Entry**: `dist/index.js` - Exports all components and theme
- **Components**: `dist/components.js` - Exports only components
- **Theme**: `dist/theme.js` - Exports only theme utilities

## Usage

```tsx
// Import everything
import { Button, Input, Modal, theme } from '@syncrofy/design-system';

// Import theme only
import { theme } from '@syncrofy/design-system';

// Import components only
import { Button, Input } from '@syncrofy/design-system/components';
```

## Peer Dependencies

This package requires the following peer dependencies:
- React 19.2.0+
- Material UI 7.3.5+
- Emotion 11.14.0+
- Framer Motion 12.23.25+

Make sure these are installed in your consuming project.

## CI/CD

The `.github/workflows/publish.yml` workflow automatically:
- Runs on version tags (v*.*.*)
- Installs dependencies
- Runs type checks
- Builds the package
- Publishes to npm

Requires `NPM_TOKEN` secret in GitHub repository settings.






