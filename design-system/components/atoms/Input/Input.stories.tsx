import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input component for text input fields. Extends MUI TextField with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label content',
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      description: 'The variant to use',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'The size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'If true, the input is required',
    },
    error: {
      control: 'boolean',
      description: 'If true, the input will be in an error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    placeholder: {
      control: 'text',
      description: 'The placeholder content',
    },
    type: {
      control: 'text',
      description: 'Type of the input element',
    },
    multiline: {
      control: 'boolean',
      description: 'If true, the input will be multiline',
    },
    rows: {
      control: 'number',
      description: 'Number of rows to display when multiline option is set',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    placeholder: 'Enter text',
    variant: 'outlined',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined Input',
    placeholder: 'Enter text',
    variant: 'outlined',
  },
};

export const Filled: Story = {
  args: {
    label: 'Filled Input',
    placeholder: 'Enter text',
    variant: 'filled',
  },
};

export const Standard: Story = {
  args: {
    label: 'Standard Input',
    placeholder: 'Enter text',
    variant: 'standard',
  },
};

export const Small: Story = {
  args: {
    label: 'Small Input',
    size: 'small',
    variant: 'outlined',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Input with Helper Text',
    helperText: 'Some helpful text',
    variant: 'outlined',
  },
};

export const Error: Story = {
  args: {
    label: 'Error Input',
    error: true,
    helperText: 'Error message',
    variant: 'outlined',
  },
};

export const Required: Story = {
  args: {
    label: 'Required Input',
    required: true,
    variant: 'outlined',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    value: 'Disabled value',
    variant: 'outlined',
  },
};

export const Multiline: Story = {
  args: {
    label: 'Multiline Input',
    multiline: true,
    rows: 4,
    placeholder: 'Enter multiple lines of text',
    variant: 'outlined',
  },
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input label="Text" type="text" variant="outlined" />
      <Input label="Email" type="email" variant="outlined" />
      <Input label="Password" type="password" variant="outlined" />
      <Input label="Number" type="number" variant="outlined" />
      <Input label="Date" type="date" variant="outlined" />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Input
        label="Interactive Input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        variant="outlined"
        helperText={`Character count: ${value.length}`}
      />
    );
  },
};

