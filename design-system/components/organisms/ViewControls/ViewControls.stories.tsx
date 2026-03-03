import type { Meta, StoryObj } from '@storybook/react';
import { ViewControls } from './ViewControls';
import { useState } from 'react';

const meta = {
  title: 'Organisms/ViewControls',
  component: ViewControls,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ViewControls component for managing views and view options. Supports two variants: Views (with dropdown and star button) and Exceptions (with segmented control) based on Figma design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['Views', 'Exceptions'],
      description: 'The variant type of the view controls',
    },
    viewName: {
      control: 'text',
      description: 'View name to display in the dropdown (Views variant only)',
    },
  },
} satisfies Meta<typeof ViewControls>;

export default meta;
type Story = StoryObj<typeof meta>;

// Views variant - Basic
export const ViewsBasic: Story = {
  args: {
    type: 'Views',
    viewName: 'View name',
  },
};

// Views variant - With dropdown options
export const ViewsWithDropdown: Story = {
  args: {
    type: 'Views',
    viewName: 'My Custom View',
    viewOptions: [
      { value: 'view1', label: 'My Custom View' },
      { value: 'view2', label: 'Default View' },
      { value: 'view3', label: 'Recent Transfers' },
      { value: 'view4', label: 'Pending Items' },
    ],
    selectedView: 'view1',
  },
  render: (args) => {
    const [selectedView, setSelectedView] = useState(args.selectedView);

    return (
      <ViewControls
        {...args}
        selectedView={selectedView}
        onViewSelect={(value) => {
          setSelectedView(value);
          args.onViewSelect?.(value);
        }}
        onStarClick={() => {
          console.log('Star clicked');
        }}
        onMoreOptionsClick={() => {
          console.log('More options clicked');
        }}
      />
    );
  },
};

// Views variant - With more options dropdown
export const ViewsWithMoreOptions: Story = {
  args: {
    type: 'Views',
    viewName: 'My Custom View',
    viewOptions: [
      { value: 'view1', label: 'My Custom View' },
      { value: 'view2', label: 'Default View' },
    ],
    moreOptions: [
      { value: 'edit', label: 'Edit View' },
      { value: 'duplicate', label: 'Duplicate View' },
      { value: 'delete', label: 'Delete View' },
    ],
  },
  render: (args) => {
    const [selectedView, setSelectedView] = useState(args.selectedView);

    return (
      <ViewControls
        {...args}
        selectedView={selectedView}
        onViewSelect={(value) => {
          setSelectedView(value);
          args.onViewSelect?.(value);
        }}
        onMoreOptionsSelect={(value) => {
          console.log('More options selected:', value);
          args.onMoreOptionsSelect?.(value);
        }}
      />
    );
  },
};

// Exceptions variant - Basic
export const ExceptionsBasic: Story = {
  args: {
    type: 'Exceptions',
    segmentedControlItems: [
      { id: 'all', text: 'All' },
      { id: 'active', text: 'Active' },
      { id: 'pending', text: 'Pending' },
      { id: 'resolved', text: 'Resolved' },
    ],
    selectedSegmentId: 'all',
  },
  render: (args) => {
    const [selectedSegmentId, setSelectedSegmentId] = useState(args.selectedSegmentId);

    return (
      <ViewControls
        {...args}
        selectedSegmentId={selectedSegmentId}
        onSegmentChange={(id) => {
          setSelectedSegmentId(id);
          args.onSegmentChange?.(id);
        }}
      />
    );
  },
};

// Exceptions variant - With more options
export const ExceptionsWithMoreOptions: Story = {
  args: {
    type: 'Exceptions',
    segmentedControlItems: [
      { id: 'all', text: 'All' },
      { id: 'active', text: 'Active' },
      { id: 'pending', text: 'Pending' },
      { id: 'resolved', text: 'Resolved' },
    ],
    selectedSegmentId: 'all',
    moreOptions: [
      { value: 'export', label: 'Export' },
      { value: 'filter', label: 'Filter Options' },
      { value: 'settings', label: 'View Settings' },
    ],
  },
  render: (args) => {
    const [selectedSegmentId, setSelectedSegmentId] = useState(args.selectedSegmentId);

    return (
      <ViewControls
        {...args}
        selectedSegmentId={selectedSegmentId}
        onSegmentChange={(id) => {
          setSelectedSegmentId(id);
          args.onSegmentChange?.(id);
        }}
        onMoreOptionsSelect={(value) => {
          console.log('More options selected:', value);
          args.onMoreOptionsSelect?.(value);
        }}
      />
    );
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    type: 'Views',
    viewName: 'View name',
    viewOptions: [
      { value: 'view1', label: 'My Custom View' },
      { value: 'view2', label: 'Default View' },
      { value: 'view3', label: 'Recent Transfers' },
    ],
    moreOptions: [
      { value: 'edit', label: 'Edit View' },
      { value: 'duplicate', label: 'Duplicate View' },
      { value: 'delete', label: 'Delete View' },
    ],
  },
  render: (args) => {
    const [selectedView, setSelectedView] = useState<string | number | undefined>(args.selectedView);
    const [isStarred, setIsStarred] = useState(false);

    return (
      <ViewControls
        {...args}
        selectedView={selectedView}
        onViewSelect={(value) => {
          setSelectedView(value);
          console.log('View selected:', value);
        }}
        onStarClick={() => {
          setIsStarred(!isStarred);
          console.log('Star toggled:', !isStarred);
        }}
        onMoreOptionsSelect={(value) => {
          console.log('More options selected:', value);
        }}
      />
    );
  },
};
