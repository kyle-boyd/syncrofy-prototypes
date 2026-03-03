import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const meta = {
  title: 'Organisms/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accordion component for collapsible content sections. Extends MUI Accordion with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    exclusive: {
      control: 'boolean',
      description: 'If true, only one item can be expanded at a time',
    },
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevation'],
      description: 'The variant to use',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  {
    id: 'item1',
    title: 'Accordion Item 1',
    content: (
      <Typography>
        This is the content for the first accordion item. You can add any content here.
      </Typography>
    ),
  },
  {
    id: 'item2',
    title: 'Accordion Item 2',
    content: (
      <Typography>
        This is the content for the second accordion item. You can add any content here.
      </Typography>
    ),
  },
  {
    id: 'item3',
    title: 'Accordion Item 3',
    content: (
      <Typography>
        This is the content for the third accordion item. You can add any content here.
      </Typography>
    ),
  },
];

export const Default: Story = {
  args: {
    items: basicItems,
  },
};

export const Exclusive: Story = {
  args: {
    items: basicItems,
    exclusive: true,
  },
};

export const Multiple: Story = {
  args: {
    items: basicItems,
    exclusive: false,
  },
};

export const Outlined: Story = {
  args: {
    items: basicItems,
    variant: 'outlined',
  },
};

export const Elevation: Story = {
  args: {
    items: basicItems,
    variant: 'elevation',
  },
};

export const WithDisabled: Story = {
  args: {
    items: [
      {
        id: 'item1',
        title: 'Enabled Item',
        content: <Typography>This item can be expanded.</Typography>,
      },
      {
        id: 'item2',
        title: 'Disabled Item',
        content: <Typography>This item is disabled.</Typography>,
        disabled: true,
      },
      {
        id: 'item3',
        title: 'Another Enabled Item',
        content: <Typography>This item can also be expanded.</Typography>,
      },
    ],
  },
};

export const LongContent: Story = {
  args: {
    items: [
      {
        id: 'item1',
        title: 'Item with Long Content',
        content: (
          <div>
            {Array.from({ length: 10 }).map((_, i) => (
              <Typography key={i} paragraph>
                Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris.
              </Typography>
            ))}
          </div>
        ),
      },
      {
        id: 'item2',
        title: 'Another Item',
        content: <Typography>Regular content here.</Typography>,
      },
    ],
  },
};

export const Controlled: Story = {
  args: {
    items: basicItems,
    exclusive: false,
    expanded: [],
  },
  render: (args) => {
    const [expanded, setExpanded] = useState<string | string[]>([]);
    return (
      <div style={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Currently expanded: {Array.isArray(expanded) ? expanded.join(', ') || 'none' : expanded || 'none'}
        </Typography>
        <Accordion
          {...args}
          expanded={expanded}
          onChange={setExpanded}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

