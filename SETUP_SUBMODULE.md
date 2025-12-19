# Setting Up Design System as Git Submodule

> **⚠️ DEPRECATED**: This repository now uses the npm package `@syncrofy/design-system` instead of git submodules. See [DESIGN_SYSTEM_PUBLISHING.md](./DESIGN_SYSTEM_PUBLISHING.md) for the current setup.

This guide is kept for historical reference. The design system is now published to npm and consumed as a regular dependency.

---

## Legacy Instructions (Deprecated)

This guide will help you add the Syncrofy Design System as a git submodule to this repository.

## Step 1: Add the Submodule

Run this command in your terminal from the project root:

```bash
git submodule add https://github.com/kyle-boyd/syncrofy-ds.git design-system
```

**Note**: If you get authentication errors, you have two options:

### Option A: Use SSH (if you have SSH keys set up with GitHub)
```bash
git submodule add git@github.com:kyle-boyd/syncrofy-ds.git design-system
```

### Option B: Use HTTPS with authentication
Git will prompt you for your GitHub credentials. You may need to:
- Use a Personal Access Token instead of your password
- Or configure Git credential helper

## Step 2: Initialize and Update Submodules

After adding the submodule, initialize it:

```bash
git submodule update --init --recursive
```

## Step 3: Commit the Changes

```bash
git add .gitmodules design-system
git commit -m "Add design system as git submodule"
git push
```

## Step 4: Verify It Works

Test that the build works:

```bash
npm run build
```

## Working with Submodules

### Cloning a Repository with Submodules

If someone clones this repository, they need to initialize submodules:

```bash
git clone <repo-url>
cd syncrofy-protoypes
git submodule update --init --recursive
```

Or clone with submodules in one command:

```bash
git clone --recurse-submodules <repo-url>
```

### Updating the Submodule

To update the design system to the latest version:

```bash
cd design-system
git pull origin main
cd ..
git add design-system
git commit -m "Update design system submodule"
git push
```

### Checking Submodule Status

```bash
git submodule status
```

## For Vercel Deployment

Once the submodule is set up and committed:
1. Vercel will automatically clone submodules during build
2. The build process will find the design system at `./design-system/src`
3. No additional configuration needed!

## Troubleshooting

### Submodule appears empty
Run: `git submodule update --init --recursive`

### Authentication issues
- Use SSH URL instead of HTTPS
- Or configure Git credential helper
- Or use a Personal Access Token

### Build fails on Vercel
- Ensure the submodule is committed to your repository
- Vercel automatically initializes submodules, but you can verify in build logs







