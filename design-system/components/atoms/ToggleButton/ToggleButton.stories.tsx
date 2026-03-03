import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton } from './ToggleButton';
import { useState } from 'react';

const meta = {
  title: 'Atoms/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Toggle Button',
    value: 'default',
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected Button',
    selected: true,
    value: 'selected',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    color: 'primary',
    value: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    color: 'secondary',
    value: 'secondary',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
    value: 'small',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'medium',
    value: 'medium',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
    value: 'large',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    value: 'disabled',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    value: 'fullwidth',
  },
  parameters: {
    layout: 'padded',
  },
};

export const Colors: Story = {
  args: {
    children: 'Button',
    value: 'color',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <ToggleButton {...args} color="standard" value="standard">Standard</ToggleButton>
      <ToggleButton {...args} color="primary" value="primary">Primary</ToggleButton>
      <ToggleButton {...args} color="secondary" value="secondary">Secondary</ToggleButton>
      <ToggleButton {...args} color="error" value="error">Error</ToggleButton>
      <ToggleButton {...args} color="info" value="info">Info</ToggleButton>
      <ToggleButton {...args} color="success" value="success">Success</ToggleButton>
      <ToggleButton {...args} color="warning" value="warning">Warning</ToggleButton>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    children: 'Toggle Button',
    value: 'interactive',
    color: 'primary',
  },
  render: (args) => {
    const [selected, setSelected] = useState(false);

    return (
      <ToggleButton
        {...args}
        selected={selected}
        onChange={() => setSelected(!selected)}
      >
        {selected ? 'Selected' : 'Not Selected'}
      </ToggleButton>
    );
  },
};

export const MultipleButtons: Story = {
  args: {
    children: 'Multiple Buttons Example',
    value: 'multiple',
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);

    const handleChange = (value: string) => {
      setSelected(prev =>
        prev.includes(value)
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    };

    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <ToggleButton
          selected={selected.includes('bold')}
          onChange={() => handleChange('bold')}
          value="bold"
        >
          Bold
        </ToggleButton>
        <ToggleButton
          selected={selected.includes('italic')}
          onChange={() => handleChange('italic')}
          value="italic"
        >
          Italic
        </ToggleButton>
        <ToggleButton
          selected={selected.includes('underline')}
          onChange={() => handleChange('underline')}
          value="underline"
        >
          Underline
        </ToggleButton>
      </div>
    );
  },
};
