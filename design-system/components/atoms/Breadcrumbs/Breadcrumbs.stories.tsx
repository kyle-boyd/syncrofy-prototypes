import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from './Breadcrumbs';
import { Link } from '../Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

const meta = {
  title: 'Atoms/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Breadcrumbs component for navigation hierarchy. Extends MUI Breadcrumbs with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    separator: {
      control: 'text',
      description: 'Separator element',
    },
    maxItems: {
      control: 'number',
      description: 'Maximum number of breadcrumbs to display',
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <Link href="#">Home</Link>
      <Link href="#">Catalog</Link>
      <Typography color="text.primary">Product</Typography>
    </Breadcrumbs>
  ),
};

export const WithCustomSeparator: Story = {
  render: () => (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
      <Link href="#">Home</Link>
      <Link href="#">Catalog</Link>
      <Typography color="text.primary">Product</Typography>
    </Breadcrumbs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Breadcrumbs>
      <Link href="#" sx={{ display: 'flex', alignItems: 'center' }}>
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      <Link href="#">Catalog</Link>
      <Typography color="text.primary">Product</Typography>
    </Breadcrumbs>
  ),
};

export const LongPath: Story = {
  render: () => (
    <Breadcrumbs maxItems={2}>
      <Link href="#">Home</Link>
      <Link href="#">Category</Link>
      <Link href="#">Subcategory</Link>
      <Link href="#">Section</Link>
      <Typography color="text.primary">Product</Typography>
    </Breadcrumbs>
  ),
};

export const WithMaxItems: Story = {
  render: () => (
    <Breadcrumbs maxItems={3}>
      <Link href="#">Home</Link>
      <Link href="#">Category</Link>
      <Link href="#">Subcategory</Link>
      <Link href="#">Section</Link>
      <Typography color="text.primary">Product</Typography>
    </Breadcrumbs>
  ),
};

