import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Checkbox component for selection states. Extends MUI Checkbox with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'If true, the component is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the component is disabled',
    },
    indeterminate: {
      control: 'boolean',
      description: 'If true, the checkbox is indeterminate',
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
      description: 'The color of the component',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'The size of the component',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const WithLabel: Story = {
  args: {},
  render: () => (
    <FormControlLabel control={<Checkbox />} label="Checkbox Label" />
  ),
};

export const Primary: Story = {
  args: {
    checked: true,
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    checked: true,
    color: 'secondary',
  },
};

export const Small: Story = {
  args: {
    checked: true,
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const Colors: Story = {
  args: {
    checked: true,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FormControlLabel control={<Checkbox {...args} color="default" />} label="Default" />
      <FormControlLabel control={<Checkbox {...args} color="primary" />} label="Primary" />
      <FormControlLabel control={<Checkbox {...args} color="secondary" />} label="Secondary" />
      <FormControlLabel control={<Checkbox {...args} color="error" />} label="Error" />
      <FormControlLabel control={<Checkbox {...args} color="info" />} label="Info" />
      <FormControlLabel control={<Checkbox {...args} color="success" />} label="Success" />
      <FormControlLabel control={<Checkbox {...args} color="warning" />} label="Warning" />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    checked: false,
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <FormControlLabel
        control={
          <Checkbox
            {...args}
            checked={checked}
            onChange={(_, checked) => setChecked(checked)}
          />
        }
        label="Click to toggle"
      />
    );
  },
};

