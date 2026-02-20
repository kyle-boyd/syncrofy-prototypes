# Publishing Workflow Guide

This guide explains how to make changes to the design system and ensure they're available in other repositories.

## Overview

The design system is published to npm as `@kyleboyd/design-system`. When you make changes:

1. **Make and test your changes locally**
2. **Publish a new version to npm** (automated via GitHub Actions)
3. **Other repos update their dependency** to get the new version

## Step-by-Step Workflow

### 1. Make Your Changes

Make your changes to components, theme, or other design system code in the `src/` directory.

### 2. Test Locally

Before publishing, always test your changes:

```bash
# Build the package
npm run build

# Test in Storybook
npm run storybook

# Run type checks
npm run build:check
```

### 3. Test in a Consuming Project (Optional but Recommended)

Use `npm link` to test your changes in another project before publishing:

**In syncrofy-ds:**
```bash
npm run build
npm link
```

**In your consuming project (e.g., syncrofy-prototypes):**
```bash
npm link @kyleboyd/design-system
npm run dev  # Start dev server to see changes
```

**When done testing:**
```bash
# In consuming project
npm unlink @kyleboyd/design-system
npm install  # Restore npm package

# In syncrofy-ds
npm unlink
```

### 4. Commit and Push Your Changes

```bash
git add .
git commit -m "Description of your changes"
git push origin main
```

### 5. Bump Version and Publish

The design system uses semantic versioning:
- **Patch** (`1.0.2` → `1.0.3`): Bug fixes, small changes
- **Minor** (`1.0.2` → `1.1.0`): New features, non-breaking changes
- **Major** (`1.0.2` → `2.0.0`): Breaking changes

```bash
# For bug fixes
npm version patch

# For new features
npm version minor

# For breaking changes
npm version major
```

This command:
- Updates `package.json` version
- Creates a git commit with the version change
- Creates a git tag (e.g., `v1.0.3`)

### 6. Push Version Tag

```bash
git push origin main
git push origin --tags
```

### 7. GitHub Actions Publishes Automatically

When you push a version tag (e.g., `v1.0.3`), GitHub Actions automatically:
- Detects the tag
- Builds the package
- Publishes to npm

This usually takes 2-5 minutes. You can check the status:
- In GitHub: Go to the "Actions" tab in your repository
- Via npm: `npm view @kyleboyd/design-system version`

## Getting Updates in Other Repositories

Once your new version is published to npm, other repositories need to update their dependency.

### Option 1: Update to Latest Version

In the consuming repository:

```bash
npm install @kyleboyd/design-system@latest
```

Or update `package.json` manually:
```json
{
  "dependencies": {
    "@kyleboyd/design-system": "^1.0.3"
  }
}
```

Then run:
```bash
npm install
```

### Option 2: Update to Specific Version

```bash
npm install @kyleboyd/design-system@1.0.3
```

### Option 3: Use Version Range (Recommended)

If you use a version range in `package.json`:
```json
{
  "dependencies": {
    "@kyleboyd/design-system": "^1.0.0"
  }
}
```

Then run:
```bash
npm update @kyleboyd/design-system
```

The `^` prefix means it will automatically get patch and minor updates (but not major).

## Version Strategy Recommendations

### For Consuming Repositories

**Recommended approach:**
```json
{
  "dependencies": {
    "@kyleboyd/design-system": "^1.0.0"
  }
}
```

This allows:
- ✅ Automatic patch updates (bug fixes)
- ✅ Automatic minor updates (new features)
- ❌ Blocks major updates (breaking changes)

**For more control:**
```json
{
  "dependencies": {
    "@kyleboyd/design-system": "~1.0.0"
  }
}
```

This only allows patch updates (bug fixes only).

**For exact version (not recommended):**
```json
{
  "dependencies": {
    "@kyleboyd/design-system": "1.0.0"
  }
}
```

This requires manual updates for every change.

### For Design System Maintainers

- Use **patch** versions for bug fixes and small tweaks
- Use **minor** versions for new components or features
- Use **major** versions only for breaking changes (API changes, removed components, etc.)

## Troubleshooting

### Changes Not Appearing in Other Repos

1. **Check if version was published:**
   ```bash
   npm view @kyleboyd/design-system version
   ```

2. **Verify the consuming repo has updated:**
   ```bash
   # In consuming repo
   npm list @kyleboyd/design-system
   ```

3. **Clear npm cache (if needed):**
   ```bash
   npm cache clean --force
   npm install
   ```

### GitHub Actions Not Publishing

1. Check the Actions tab in GitHub for errors
2. Verify `NPM_TOKEN` secret is set in repository settings
3. Ensure you pushed the version tag: `git push origin --tags`

### Local Testing Issues with npm link

If `npm link` isn't working:
1. Make sure you ran `npm run build` in syncrofy-ds
2. Try unlinking and re-linking:
   ```bash
   # In consuming project
   npm unlink @kyleboyd/design-system
   npm link @kyleboyd/design-system
   ```

## Quick Reference

### Publishing a Change
```bash
# 1. Make changes and test
npm run build
npm run storybook

# 2. Commit
git add .
git commit -m "Your changes"
git push origin main

# 3. Version and publish
npm version patch  # or minor/major
git push origin main
git push origin --tags
```

### Updating in Consuming Repo
```bash
npm install @kyleboyd/design-system@latest
# or
npm update @kyleboyd/design-system
```

## Best Practices

1. **Always test locally** before publishing
2. **Use semantic versioning** correctly (patch/minor/major)
3. **Write clear commit messages** describing changes
4. **Update CHANGELOG.md** (if you maintain one) with each release
5. **Communicate breaking changes** to team members
6. **Test in consuming repos** after publishing (especially for major versions)



