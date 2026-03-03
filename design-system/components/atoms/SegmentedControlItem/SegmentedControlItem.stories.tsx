import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControlItem } from './SegmentedControlItem';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';

const meta = {
  title: 'Atoms/SegmentedControlItem',
  component: SegmentedControlItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Individual item component for SegmentedControl. Supports selected/unselected variants, different sizes, and various content options.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['selected', 'unselected'],
      description: 'The visual variant of the item',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
      description: 'The size variant of the item',
    },
    content: {
      control: { type: 'select' },
      options: ['icon-only', 'text-only', 'icon-text'],
      description: 'The content to display in the item',
    },
    children: {
      control: 'text',
      description: 'The text content to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the item is disabled',
    },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof SegmentedControlItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic stories
export const Default: Story = {
  args: {
    children: 'Option 1',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected Option',
    variant: 'selected',
    size: 'md',
    content: 'text-only',
  },
};

export const Unselected: Story = {
  args: {
    children: 'Unselected Option',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
};

// Size variants
export const Small: Story = {
  args: {
    children: 'Small',
    variant: 'unselected',
    size: 'sm',
    content: 'text-only',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
};

// Content options
export const TextOnly: Story = {
  args: {
    children: 'Text Only',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
};

export const IconOnly: Story = {
  args: {
    icon: <HomeIcon fontSize="small" />,
    variant: 'unselected',
    size: 'md',
    content: 'icon-only',
  },
};

export const IconText: Story = {
  args: {
    children: 'Icon + Text',
    icon: <FavoriteIcon fontSize="small" />,
    variant: 'unselected',
    size: 'md',
    content: 'icon-text',
  },
};

// State variations - Unselected
export const UnselectedDefault: Story = {
  args: {
    children: 'Default',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Unselected item in default state',
      },
    },
  },
};

export const UnselectedHover: Story = {
  args: {
    children: 'Hover',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Unselected item in hover state (visual indication only)',
      },
    },
    // Note: Hover state is handled by CSS :hover pseudo-class
  },
};

export const UnselectedPressed: Story = {
  args: {
    children: 'Pressed',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Unselected item in pressed state (visual indication only)',
      },
    },
    // Note: Pressed state is handled by CSS :active pseudo-class
  },
};

export const UnselectedFocused: Story = {
  args: {
    children: 'Focused',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Unselected item in focused state (visual indication only)',
      },
    },
    // Note: Focus state is handled by CSS :focus-visible pseudo-class
  },
};

export const UnselectedDisabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
    disabled: true,
  },
};

// State variations - Selected
export const SelectedDefault: Story = {
  args: {
    children: 'Default',
    variant: 'selected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Selected item in default state',
      },
    },
  },
};

export const SelectedHover: Story = {
  args: {
    children: 'Hover',
    variant: 'selected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Selected item in hover state (retains colors)',
      },
    },
  },
};

export const SelectedPressed: Story = {
  args: {
    children: 'Pressed',
    variant: 'selected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Selected item in pressed state (retains colors)',
      },
    },
  },
};

export const SelectedFocused: Story = {
  args: {
    children: 'Focused',
    variant: 'selected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Selected item in focused state',
      },
    },
  },
};

export const SelectedDisabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'selected',
    size: 'md',
    content: 'text-only',
    disabled: true,
  },
};

// Size and content combinations
export const SmallIconText: Story = {
  args: {
    children: 'Small Icon',
    icon: <StarIcon fontSize="small" />,
    variant: 'selected',
    size: 'sm',
    content: 'icon-text',
  },
};

export const MediumIconOnly: Story = {
  args: {
    icon: <HomeIcon fontSize="small" />,
    variant: 'selected',
    size: 'md',
    content: 'icon-only',
  },
};

// Interactive example
export const InteractiveExample: Story = {
  args: {
    children: 'Click me',
    variant: 'unselected',
    size: 'md',
    content: 'text-only',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example - click to see the onClick action',
      },
    },
  },
};
