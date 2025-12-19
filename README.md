# Syncrofy Prototypes

This repository contains prototype web applications built using the Syncrofy Design System.

## Overview

This project uses the Syncrofy Design System published as `@syncrofy/design-system` on npm. The design system provides a comprehensive set of React components built on Material UI with custom theming.

For information on updating the design system, see [DESIGN_SYSTEM_PUBLISHING.md](./DESIGN_SYSTEM_PUBLISHING.md).

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

Components from the design system can be imported from the npm package:

```tsx
import { Button, Input, Modal, theme } from '@syncrofy/design-system';
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
import { Container, Typography } from '@mui/material';
import { Button } from '@syncrofy/design-system';

function MyPrototype() {
  return (
    <Container>
      <Typography variant="h1">My Prototype</Typography>
      <Button variant="contained">Click me</Button>
    </Container>
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

