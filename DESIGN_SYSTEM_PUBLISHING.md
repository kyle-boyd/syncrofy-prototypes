# Design System Publishing Guide

This document explains how to update and publish the Syncrofy Design System as an npm package, and how to consume it in this repository.

## Overview

The design system is now published as `@syncrofy/design-system` on npm. This replaces the previous approach of using git submodules or copying files directly.

## Publishing a New Version

### Prerequisites

1. Ensure you have an npm account with access to publish `@syncrofy/design-system`
2. Set up an npm token as a GitHub secret named `NPM_TOKEN` in the design system repository

### Steps to Publish

1. **Navigate to the design system repository** (`syncrofy-ds`)

2. **Make your changes** to components, theme, or other design system code

3. **Commit your changes** (if not already committed):
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

4. **Bump version and create tag**:
   ```bash
   npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # for new features (1.0.0 -> 1.1.0)
   npm version major  # for breaking changes (1.0.0 -> 2.0.0)
   ```
   This command automatically:
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

The package will be available on npm within a few minutes. Verify publication:
```bash
npm view @syncrofy/design-system version
```

## Consuming Updates in This Repository

### Initial Setup

The design system is already configured as a dependency in `package.json`:

```json
"@syncrofy/design-system": "^0.1.0"
```

### Updating to a New Version

1. **Update the version** in `package.json`:
   ```json
   "@syncrofy/design-system": "^0.2.0"
   ```

2. **Install the new version**:
   ```bash
   npm install
   ```

3. **Verify the update**:
   ```bash
   npm list @syncrofy/design-system
   ```

4. **Test your application**:
   ```bash
   npm run dev
   ```

### Using the Design System

Import components and theme from the package:

```tsx
// Import everything you need from the main entry
import { Button, Input, Modal, theme } from '@syncrofy/design-system';

// Or import theme separately
import { theme } from '@syncrofy/design-system';

// Or import just components
import { Button, Input } from '@syncrofy/design-system/components';
```

### Available Exports

- **Main entry** (`@syncrofy/design-system`): Exports all components and theme
- **Components** (`@syncrofy/design-system/components`): Exports only components
- **Theme** (`@syncrofy/design-system/theme`): Exports only theme utilities

## Daily Development Workflow

### Viewing Changes Locally in Both DS and Prototypes

#### Option A: Using npm link (Recommended for rapid iteration)

This allows you to test design system changes in prototypes without publishing to npm.

**In syncrofy-ds:**
```bash
cd syncrofy-ds
npm run build  # Build the design system
npm link       # Create a global symlink
```

**In syncrofy-prototypes:**
```bash
cd syncrofy-prototypes
npm link @syncrofy/design-system  # Link to local build
npm run dev  # Start dev server to see changes
```

**To unlink when done:**
```bash
cd syncrofy-prototypes
npm unlink @syncrofy/design-system
npm install  # Restore npm package
```

#### Option B: Using file: reference (Alternative)

Temporarily change `package.json` in prototypes:
```json
"@syncrofy/design-system": "file:../syncrofy-ds"
```
Then run `npm install` in prototypes. Remember to change it back before committing.

### Syncing Changes from DS to Prototypes Locally

**Step 1: Make changes in syncrofy-ds**
```bash
cd syncrofy-ds
# Edit component files, theme, etc.
```

**Step 2: Build the design system**
```bash
cd syncrofy-ds
npm run build
```

**Step 3: If using npm link**
- Changes are automatically reflected when you rebuild
- Just run `npm run build` in syncrofy-ds again
- Refresh prototype dev server

**Step 4: Test in prototypes**
```bash
cd syncrofy-prototypes
npm run dev  # View changes in browser
```

### Syncing Changes to GitHub / Vercel

See the "Publishing a New Version" section above for publishing design system changes.

#### Updating Prototypes to Use New Design System Version:

**Step 1: Update package.json**
```bash
cd syncrofy-prototypes
# Edit package.json, change version:
# "@syncrofy/design-system": "^1.0.1"  # or whatever new version
```

**Step 2: Install new version**
```bash
cd syncrofy-prototypes
npm install
```

**Step 3: Test locally**
```bash
cd syncrofy-prototypes
npm run dev  # Verify everything works
npm run build  # Verify build works
```

**Step 4: Commit and push**
```bash
cd syncrofy-prototypes
git add package.json package-lock.json
git commit -m "Update design system to v1.0.1"
git push origin main
```

**Step 5: Vercel automatically deploys**
- Vercel detects the push to main branch
- Runs `npm install` (gets new design system version)
- Builds the prototype
- Deploys to production
- Usually takes 2-3 minutes

## Migration from Old Approach

If you're migrating from the old submodule/copy approach:

1. ✅ All imports have been updated to use `@syncrofy/design-system`
2. ✅ Vite configuration has been simplified (removed submodule alias)
3. ✅ Dependencies now use npm package instead of local file reference
4. ✅ The `design-system/` submodule folder can be removed

### What Changed

- **Dependencies**: Changed from `"file:./design-system"` to `"^1.0.0"` (npm version)
- **Configuration**: Removed `@syncrofy/design-system` alias from `vite.config.ts` pointing to local folder
- **Imports**: Continue using `@syncrofy/design-system` (works the same way)

## Troubleshooting

### Package not found

If you get an error that the package cannot be found:

1. Verify the package exists on npm: https://www.npmjs.com/package/@syncrofy/design-system
2. Check that you're using the correct package name: `@syncrofy/design-system`
3. Ensure your npm registry is set correctly: `npm config get registry`

### Version conflicts

If you encounter peer dependency warnings:

1. Ensure your React, MUI, and Emotion versions match the design system's peer dependencies
2. Check `package.json` for version compatibility
3. Run `npm install` to resolve dependencies

### Build errors

If the build fails after updating:

1. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
2. Check that the design system version you're using is actually published
3. Verify TypeScript types are being resolved correctly

## CI/CD Integration

### Design System Repository

The design system repository uses GitHub Actions to automatically publish when a version tag is pushed:

- Workflow: `.github/workflows/publish.yml`
- Trigger: Tags matching `v*.*.*` pattern
- Steps: Install → Type check → Build → Publish

### This Repository

No special CI configuration is needed. The design system is consumed as a regular npm dependency.

## Best Practices

1. **Version Management**: Use semantic versioning (semver) for releases
2. **Testing**: Test the design system package locally before publishing
3. **Documentation**: Update component documentation when making changes
4. **Breaking Changes**: Use major version bumps and document migration paths
5. **Dependency Updates**: Regularly update to the latest design system version

## Support

For issues or questions:
- Design System Repository: https://github.com/kyle-boyd/syncrofy-ds
- This Repository: Check the main README.md





