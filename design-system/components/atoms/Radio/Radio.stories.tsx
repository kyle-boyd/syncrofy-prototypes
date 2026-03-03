import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Radio component for single selection from a group. Extends MUI Radio with custom styling.',
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
} satisfies Meta<typeof Radio>;

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
  render: () => (
    <FormControlLabel control={<Radio />} label="Radio Label" />
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

export const RadioGroupExample: Story = {
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <FormControl>
        <FormLabel>Choose an option</FormLabel>
        <RadioGroup value={value} onChange={(e) => setValue(e.target.value)}>
          <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
          <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
          <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
        </RadioGroup>
      </FormControl>
    );
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FormControlLabel control={<Radio checked color="default" />} label="Default" />
      <FormControlLabel control={<Radio checked color="primary" />} label="Primary" />
      <FormControlLabel control={<Radio checked color="secondary" />} label="Secondary" />
      <FormControlLabel control={<Radio checked color="error" />} label="Error" />
      <FormControlLabel control={<Radio checked color="info" />} label="Info" />
      <FormControlLabel control={<Radio checked color="success" />} label="Success" />
      <FormControlLabel control={<Radio checked color="warning" />} label="Warning" />
    </div>
  ),
};

