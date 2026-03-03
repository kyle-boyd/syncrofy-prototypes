import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tooltip component for displaying additional information on hover. Extends MUI Tooltip with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Tooltip title',
    },
    placement: {
      control: 'select',
      options: ['bottom-end', 'bottom-start', 'bottom', 'left-end', 'left-start', 'left', 'right-end', 'right-start', 'right', 'top-end', 'top-start', 'top'],
      description: 'The placement of the tooltip',
    },
    enterDelay: {
      control: 'number',
      description: 'The number of milliseconds to wait before showing the tooltip',
    },
    leaveDelay: {
      control: 'number',
      description: 'The number of milliseconds to wait before hiding the tooltip',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Tooltip text',
    children: <Button>Hover me</Button>,
  },
};

export const WithIconButton: Story = {
  args: {
    title: 'Delete item',
    children: <IconButton><DeleteIcon /></IconButton>,
  },
};

export const WithInfoIcon: Story = {
  args: {
    title: 'Additional information about this field',
    children: <IconButton><InfoIcon /></IconButton>,
  },
};

export const LongText: Story = {
  args: {
    title: 'This is a longer tooltip message that provides more detailed information about the element',
    children: <Button>Hover for details</Button>,
  },
};

export const Placements: Story = {
  args: {
    title: 'Tooltip',
    children: <Button>Button</Button>,
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', padding: '50px' }}>
      <Tooltip {...args} title="Top Start" placement="top-start">
        <Button>Top Start</Button>
      </Tooltip>
      <Tooltip {...args} title="Top" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip {...args} title="Top End" placement="top-end">
        <Button>Top End</Button>
      </Tooltip>
      <Tooltip {...args} title="Left Start" placement="left-start">
        <Button>Left Start</Button>
      </Tooltip>
      <Tooltip {...args} title="Left" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip {...args} title="Left End" placement="left-end">
        <Button>Left End</Button>
      </Tooltip>
      <Tooltip {...args} title="Right Start" placement="right-start">
        <Button>Right Start</Button>
      </Tooltip>
      <Tooltip {...args} title="Right" placement="right">
        <Button>Right</Button>
      </Tooltip>
      <Tooltip {...args} title="Right End" placement="right-end">
        <Button>Right End</Button>
      </Tooltip>
      <Tooltip {...args} title="Bottom Start" placement="bottom-start">
        <Button>Bottom Start</Button>
      </Tooltip>
      <Tooltip {...args} title="Bottom" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip {...args} title="Bottom End" placement="bottom-end">
        <Button>Bottom End</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const Delayed: Story = {
  args: {
    title: 'Delayed tooltip',
    enterDelay: 1000,
    children: <Button>Hover and wait</Button>,
  },
};

