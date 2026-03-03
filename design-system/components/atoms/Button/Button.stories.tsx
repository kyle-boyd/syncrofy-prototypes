import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: "primary",
  },
};

export const SimpleTest: Story = {
  args: {
    children: 'Simple Test',
  },
  render: (args) => (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h3>Button Component Test</h3>
      <Button {...args} />
      <p>This is a simple test to verify the Button component loads in Storybook.</p>
    </div>
  ),
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'secondary',
  },
};

export const Outlined: Story = {
  args: {
    children: 'Button',
    variant: 'outlined',
    color: 'primary',
  },
};

export const Text: Story = {
  args: {
    children: 'Button',
    variant: 'text',
    color: 'primary',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
    variant: 'contained',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'medium',
    variant: 'contained',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
    variant: 'contained',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    variant: 'contained',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    variant: 'contained',
  },
  parameters: {
    layout: 'padded',
  },
};

export const Colors: Story = {
  args: {
    children: 'Button',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button {...args} color="primary" variant="contained">Primary</Button>
      <Button {...args} color="secondary" variant="contained">Secondary</Button>
      <Button {...args} color="error" variant="contained">Error</Button>
      <Button {...args} color="info" variant="contained">Info</Button>
      <Button {...args} color="success" variant="contained">Success</Button>
      <Button {...args} color="warning" variant="contained">Warning</Button>
    </div>
  ),
};

export const Variants: Story = {
  args: {
    children: 'Button',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button {...args} variant="contained">Contained</Button>
      <Button {...args} variant="outlined">Outlined</Button>
      <Button {...args} variant="text">Text</Button>
    </div>
  ),
};

/**
 * Button with Icons example (startIcon, endIcon)
 */
export const WithIcons: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button variant="contained" startIcon={<ArrowBackIcon />}>Start Icon</Button>
      <Button variant="contained" endIcon={<ArrowForwardIcon />}>End Icon</Button>
      <Button variant="contained" startIcon={<ArrowBackIcon />} endIcon={<ArrowForwardIcon />}>
        Both Icons
      </Button>
    </div>
  )
};

