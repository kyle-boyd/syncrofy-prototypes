# Migration Guide: Material UI → Syncrofy Design System

This guide helps you migrate from Material UI components to the Syncrofy Design System components.

## Overview

The Syncrofy Design System provides custom-styled components that replace Material UI components while maintaining the same functionality. All design system components extend their MUI counterparts and apply custom theming, spacing, and visual design consistent with the Syncrofy brand.

## Quick Reference: Component Mapping

| Material UI Component | Design System Component | Category |
|---------------------|------------------------|----------|
| `Button` | `Button` | Atom |
| `TextField` | `Input` | Atom |
| `Checkbox` | `Checkbox` | Atom |
| `Radio` | `Radio` | Atom |
| `Switch` | `Toggle` | Atom |
| `IconButton` | `IconButton` | Atom |
| `Chip` | `Chips` | Atom |
| `Avatar` | `Avatar` | Atom |
| `Badge` | `Badge` | Atom |
| `Link` | `Link` | Atom |
| `Divider` | `Divider` | Atom |
| `CircularProgress` | `Spinner` | Atom |
| `Tooltip` | `Tooltip` | Atom |
| `Breadcrumbs` | `Breadcrumbs` | Atom |
| `Menu` | `Dropdown` | Molecule |
| `Tabs` | `Tabs` | Molecule |
| `Snackbar` | `SnackBar` | Molecule |
| `Dialog` | `Modal` | Organism |
| `Accordion` | `Accordion` | Organism |
| `Table` | `Table` | Organism |
| `Pagination` | `Pagination` | Organism |

## Migration Steps

### 1. Update Imports

**Before:**
```tsx
import { Button, TextField, Dialog } from '@mui/material';
```

**After:**
```tsx
import { Button, Input, Modal } from '@/components';
```

### 2. Replace Component Usage

Most components have the same API, so you can simply replace the component name. However, some components have API differences (see below).

## Component-Specific Migration

### Button

**Migration:** Direct replacement, same API.

```tsx
// Before
import { Button } from '@mui/material';
<Button variant="contained" color="primary">Click me</Button>

// After
import { Button } from '@/components';
<Button variant="contained" color="primary">Click me</Button>
```

**No breaking changes** - All MUI Button props are supported.

---

### TextField → Input

**Migration:** Replace `TextField` with `Input`. The API is mostly the same, but `Input` has enhanced label formatting for required fields.

```tsx
// Before
import { TextField } from '@mui/material';
<TextField 
  label="Email" 
  variant="outlined" 
  required 
  error={hasError}
  helperText={errorMessage}
/>

// After
import { Input } from '@/components';
<Input 
  label="Email" 
  variant="outlined" 
  required 
  error={hasError}
  helperText={errorMessage}
/>
```

**Key Differences:**
- Required labels display as "Label (required) *" format automatically
- Error states show custom error icon (red circle with ×)
- Custom label styling with Geist font family

---

### Checkbox

**Migration:** Direct replacement, same API.

```tsx
// Before
import { Checkbox } from '@mui/material';
<Checkbox checked={checked} onChange={handleChange} />

// After
import { Checkbox } from '@/components';
<Checkbox checked={checked} onChange={handleChange} />
```

**No breaking changes** - All MUI Checkbox props are supported.

---

### Dialog → Modal

**Migration:** `Modal` provides a simplified API compared to MUI's `Dialog`.

```tsx
// Before
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>
    Content here
  </DialogContent>
  <DialogActions>
    <Button>Cancel</Button>
    <Button>Confirm</Button>
  </DialogActions>
</Dialog>

// After
import { Modal } from '@/components';

<Modal 
  open={open} 
  onClose={handleClose}
  title="Title"
  actions={
    <>
      <Button>Cancel</Button>
      <Button>Confirm</Button>
    </>
  }
>
  Content here
</Modal>
```

**Key Differences:**
- Simplified API with `title` and `actions` props
- Built-in close button in title (can be disabled with `showCloseButton={false}`)
- `closeOnBackdropClick` prop to control backdrop behavior

---

### Menu → Dropdown

**Migration:** `Dropdown` provides a declarative API compared to MUI's `Menu`.

```tsx
// Before
import { Menu, MenuItem } from '@mui/material';

const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

<Button onClick={(e) => setAnchorEl(e.currentTarget)}>Open</Button>
<Menu 
  anchorEl={anchorEl} 
  open={open} 
  onClose={() => setAnchorEl(null)}
>
  <MenuItem onClick={handleOption1}>Option 1</MenuItem>
  <MenuItem onClick={handleOption2}>Option 2</MenuItem>
</Menu>

// After
import { Dropdown } from '@/components';

<Dropdown
  trigger={<Button>Open</Button>}
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  onSelect={(value) => handleSelect(value)}
/>
```

**Key Differences:**
- Declarative `options` array instead of `MenuItem` children
- `trigger` prop for the element that opens the dropdown
- `onSelect` callback receives the option value
- Supports icons, secondary text, and actions in options

---

### Snackbar → SnackBar

**Migration:** Direct replacement, same API (note the capitalization difference).

```tsx
// Before
import { Snackbar } from '@mui/material';
<Snackbar open={open} message="Message" onClose={handleClose} />

// After
import { SnackBar } from '@/components';
<SnackBar open={open} message="Message" onClose={handleClose} />
```

---

## Common Patterns

### Form Components

```tsx
// Before
import { TextField, Button, Checkbox } from '@mui/material';

// After
import { Input, Button, Checkbox } from '@/components';
```

### Navigation Components

```tsx
// Before
import { Breadcrumbs, Link } from '@mui/material';

// After
import { Breadcrumbs, Link } from '@/components';
```

### Feedback Components

```tsx
// Before
import { Dialog, Snackbar, Tooltip } from '@mui/material';

// After
import { Modal, SnackBar, Tooltip } from '@/components';
```

## Breaking Changes

### None Currently

All design system components are designed to be drop-in replacements for their MUI counterparts. If you encounter any issues, please check:

1. Import paths - Use `@/components` instead of `@mui/material`
2. Component names - Some have different names (e.g., `TextField` → `Input`, `Dialog` → `Modal`)
3. API differences - Some components have simplified APIs (see component-specific sections above)

## Best Practices

1. **Use Design System Components First**: Always check if a design system component exists before using a raw MUI component.

2. **Import from Barrel Export**: Use `@/components` for cleaner imports:
   ```tsx
   import { Button, Input, Modal } from '@/components';
   ```

3. **Category-Specific Imports**: For tree-shaking, you can import from specific categories:
   ```tsx
   import { Button, Input } from '@/components/atoms';
   import { Dropdown, Tabs } from '@/components/molecules';
   import { Modal, Table } from '@/components/organisms';
   ```

4. **TypeScript Support**: All components export their prop types:
   ```tsx
   import { Button, ButtonProps } from '@/components';
   ```

## Getting Help

- Check component Storybook stories for examples
- Review component JSDoc comments in the source code
- Use the MCP server for AI-assisted migration and code generation

## Migration Checklist

- [ ] Update all imports from `@mui/material` to `@/components`
- [ ] Replace `TextField` with `Input`
- [ ] Replace `Dialog` with `Modal` (update API if needed)
- [ ] Replace `Menu` with `Dropdown` (update API if needed)
- [ ] Replace `Snackbar` with `SnackBar`
- [ ] Test all components for visual consistency
- [ ] Verify accessibility features still work
- [ ] Update any custom styling that relied on MUI internals



