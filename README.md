# Syncrofy Prototypes

This repository contains prototype web applications built using the Syncrofy Design System.

> 📖 **Workflow Guide**: See [WORKFLOW.md](./WORKFLOW.md) for detailed instructions on:
> - Viewing changes locally in both DS and prototypes
> - Syncing changes from DS to prototypes locally
> - Publishing design system updates to npm
> - Deploying prototypes to Vercel
> - Common workflows and troubleshooting

## Repository Rules

1. **Single source of truth** — The `design-system/` folder is the single source of truth for all UI components, tokens, and theme. Always use components from `design-system/` rather than creating new one-off components.

2. **Prototype scope** — When working on a prototype, only edit files inside `src/pages/` and `src/components/`. Never edit files inside `design-system/` unless explicitly asked to.

3. **Import alias** — Import design-system components using the `@design-system` alias.  
   Example: `import { Button } from '@design-system/components/atoms'`

4. **No external UI libraries** — Do not install or reference any external component libraries. Use the design-system components instead.

## Overview

This project uses the Syncrofy Design System published as `@syncrofy/design-system` on npm. The design system provides a comprehensive set of React components built on Material UI with custom theming.

For information on updating the design system, see [DESIGN_SYSTEM_PUBLISHING.md](./DESIGN_SYSTEM_PUBLISHING.md).

### Design system source (local development)

The app **loads the design system from the external syncrofy-ds repo** (not from the `design-system/` folder in this repo). In `vite.config.ts`, `@kyleboyd/design-system` is aliased to the built output of that repo.

- **To edit the design system:** Add the syncrofy-ds folder to your workspace and edit files there. Your changes apply to the real design system.
- **To see changes in this app:** Rebuild the design system, then restart or refresh the app.
  - From syncrofy-ds: `npm run build`
  - From this repo: `npm run build:design-system`
- **Note:** The `design-system/` folder in this repo is **not used** by the app when the external alias is configured. It is effectively a stale copy.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies (this includes the design system package):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
syncrofy-protoypes/
├── src/
│   ├── App.tsx          # Main app component with ThemeProvider
│   ├── main.tsx         # React entry point
│   ├── pages/           # Prototype pages
│   │   └── Home.tsx     # Example prototype page
│   └── vite-env.d.ts    # Vite type definitions
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## Using Design System Components

Import design-system components using the `@design-system` alias:

```tsx
import { Button } from '@design-system/components/atoms';
import { Modal } from '@design-system/components/organisms';
```

The design system is organized using atomic design principles:
- **Atoms**: Basic components (Button, Input, Badge, etc.)
- **Molecules**: Composite components (Dropdown, SegmentedControl, etc.)
- **Organisms**: Complex components (Modal, Table, Navigation, etc.)

## Available Components

The design system includes a wide range of components:

### Atoms
- Avatar, Badge, Breadcrumbs, Button, Checkbox, Chips, DatePicker, Divider
- Icon, IconButton, Input, Link, Logo, PasswordInput, Radio, Search
- SegmentedControlItem, Slot, Spinner, Tag, Toggle, ToggleButton, Tooltip

### Molecules
- ButtonGroup, Dropdown, ListItem, SegmentedControl, SnackBar, Stepper, Tabs, Typeahead

### Organisms
- Accordion, Modal, Navigation, Pagination, Table

## Theme

The design system theme is automatically applied via the `ThemeProvider` in `App.tsx`. The theme includes:
- Custom color palette
- Typography settings
- Component styling overrides
- Custom elevation/shadow values

## Development

This project uses:
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material UI** - Base component library
- **Emotion** - CSS-in-JS styling

## Creating New Prototypes

To create a new prototype:

1. Create a new file in `src/pages/` (e.g., `MyPrototype.tsx`)
2. Import and use design system components
3. Add routing or navigation to access your prototype

Example:

```tsx
import React from 'react';
import { Button } from '@design-system/components/atoms';

function MyPrototype() {
  return (
    <div>
      <h1>My Prototype</h1>
      <Button variant="contained">Click me</Button>
    </div>
  );
}

export default MyPrototype;
```

## Deployment

### Deploying to Vercel

This project is configured for easy deployment to Vercel. The `vercel.json` file handles SPA routing automatically.

#### Prerequisites for Vercel Deployment

The design system is now consumed as an npm package (`@syncrofy/design-system`). This means:
- ✅ No authentication needed
- ✅ Works immediately on Vercel
- ✅ No submodule setup required
- ✅ Automatic dependency management via npm

**Note:** To update the design system, simply update the version in `package.json` and run `npm install`. See [DESIGN_SYSTEM_PUBLISHING.md](./DESIGN_SYSTEM_PUBLISHING.md) for detailed workflow documentation.

#### Deployment Steps

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "Add New Project"
   - Import your `syncrofy-prototypes` repository

3. **Vercel will auto-detect**:
   - Framework: Vite
   - Build Command: `npm run build` (automatically runs `prepare-ds` first)
   - Output Directory: `dist`
   - The `vercel.json` file handles SPA routing

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like `your-project.vercel.app`

5. **Automatic deployments**:
   - Every push to your main branch triggers a new deployment
   - Pull requests get preview deployments automatically

#### Build Process

The build process automatically:
1. Installs dependencies (including `@syncrofy/design-system` from npm)
2. Compiles TypeScript
3. Builds the Vite project
4. Outputs to `dist` directory

The design system is installed automatically from npm during the build process.

## License

ISC

