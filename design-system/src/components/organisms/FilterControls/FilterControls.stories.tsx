import type { Meta, StoryObj } from '@storybook/react';
import { FilterControls, FilterOption, ActiveFilter } from './FilterControls';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

const meta = {
  title: 'Organisms/FilterControls',
  component: FilterControls,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'FilterControls component for filtering tables and content. Provides search, filter dropdowns, active filter chips, and action buttons based on Figma design system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showClearAll: {
      control: 'boolean',
      description: 'If true, shows the "Clear all filters" button',
    },
  },
} satisfies Meta<typeof FilterControls>;

export default meta;
type Story = StoryObj<typeof meta>;


// Basic example with search and filters
export const Basic: Story = {
  args: {
    search: {
      placeholder: 'Q Search',
      value: '',
    },
    filters: [
      {
        id: 'sender',
        label: 'Sender/Receiver',
        options: [
          { value: 'all', label: 'All' },
          { value: 'sender1', label: 'Sender 1' },
          { value: 'receiver1', label: 'Receiver 1' },
        ],
      },
      {
        id: 'status',
        label: 'Status',
        options: [
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
          { value: 'failed', label: 'Failed' },
        ],
      },
    ],
    resultCount: '1.3 million transfers',
    showClearAll: true,
  },
  render: (args) => {
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState<Record<string, string | number>>({});

    return (
      <FilterControls
        {...args}
        search={{
          ...args.search,
          value: searchValue,
          onChange: setSearchValue,
        }}
        filters={args.filters?.map((filter) => ({
          ...filter,
          value: filters[filter.id],
        }))}
        onFilterChange={(filterId, value) => {
          setFilters((prev) => ({ ...prev, [filterId]: value }));
        }}
        activeFilters={
          Object.entries(filters)
            .filter(([_, value]) => value && value !== 'all')
            .map(([filterId, value]) => {
              const filter = args.filters?.find((f) => f.id === filterId);
              const option = filter?.options.find((opt) => opt.value === value);
              return {
                id: filterId,
                label: filter?.label || '',
                value: option?.label || String(value),
                filterId,
              };
            })
        }
        onFilterRemove={(filterId) => {
          setFilters((prev) => {
            const next = { ...prev };
            delete next[filterId];
            return next;
          });
        }}
        onClearAll={() => {
          setFilters({});
          setSearchValue('');
        }}
      />
    );
  },
};

// With active filters
export const WithActiveFilters: Story = {
  args: {
    search: {
      placeholder: 'Q Search',
      value: '',
    },
    filters: [
      {
        id: 'date',
        label: 'Date',
        options: [
          { value: 'all', label: 'All' },
          { value: 'this-week', label: 'This Week' },
          { value: 'this-month', label: 'This Month' },
        ],
        showCount: true,
        count: 1,
      },
      {
        id: 'status',
        label: 'Status',
        options: [
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
        ],
      },
    ],
    activeFilters: [
      {
        id: 'date-filter',
        label: 'Date',
        value: 'This Week',
        filterId: 'date',
      },
    ],
    resultCount: '22 exceptions',
    showClearAll: true,
  },
};

// With actions and layout toggle
export const WithActions: Story = {
  args: {
    search: {
      placeholder: 'Q Search',
      value: '',
    },
    filters: [
      {
        id: 'type',
        label: 'Type',
        options: [
          { value: 'all', label: 'All' },
          { value: 'report', label: 'Report' },
          { value: 'dashboard', label: 'Dashboard' },
        ],
      },
      {
        id: 'frequency',
        label: 'Frequency',
        options: [
          { value: 'all', label: 'All' },
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
        ],
      },
    ],
    activeFilters: [
      {
        id: 'frequency-filter',
        label: 'Frequency',
        value: 'Hourly',
        filterId: 'frequency',
      },
    ],
    resultCount: '22 reports',
    actions: {
      primary: {
        label: 'New Report',
        icon: <AddIcon />,
        onClick: () => console.log('New Report clicked'),
      },
      secondary: {
        label: 'Actions',
        options: [
          { value: 'export', label: 'Export' },
          { value: 'import', label: 'Import' },
        ],
      },
    },
    layoutToggle: {
      mode: 'list',
      onChange: (mode) => console.log('Layout changed to:', mode),
    },
    showClearAll: true,
  },
};

// With time range selector
export const WithTimeRange: Story = {
  args: {
    timeRange: {
      items: [
        { id: '1D', text: '1D' },
        { id: '1W', text: '1W' },
        { id: '1M', text: '1M' },
        { id: '3M', text: '3M' },
        { id: '6M', text: '6M' },
        { id: '1Y', text: '1Y' },
        { id: 'custom', text: 'Custom' },
      ],
      selectedId: '1M',
    },
    activeFilters: [
      {
        id: 'date-filter',
        label: 'Date',
        value: 'This Month',
        filterId: 'date',
      },
    ],
    editButton: {
      onClick: () => console.log('Edit clicked'),
    },
  },
};

// Minimal - just search
export const Minimal: Story = {
  args: {
    search: {
      placeholder: 'Q Search',
      value: '',
    },
    resultCount: '18 Lines of Business',
    actions: {
      primary: {
        label: 'New LOB',
        icon: <AddIcon />,
      },
      secondary: {
        label: 'Actions',
      },
    },
  },
};

// Complex example matching Figma design
export const ComplexExample: Story = {
  args: {
    search: {
      placeholder: 'Q Search',
      value: '',
    },
    filters: [
      {
        id: 'sender',
        label: 'Sender/Receiver',
        options: [
          { value: 'all', label: 'All' },
          { value: 'sender1', label: 'Sender 1' },
          { value: 'receiver1', label: 'Receiver 1' },
        ],
      },
      {
        id: 'date',
        label: 'Date',
        options: [
          { value: 'all', label: 'All' },
          { value: 'this-week', label: 'This Week' },
          { value: 'this-month', label: 'This Month' },
        ],
        showCount: true,
        count: 1,
      },
      {
        id: 'status',
        label: 'Status',
        options: [
          { value: 'all', label: 'All' },
          { value: 'active', label: 'Active' },
          { value: 'pending', label: 'Pending' },
        ],
      },
      {
        id: 'more',
        label: 'More filters',
        options: [
          { value: 'all', label: 'All' },
          { value: 'option1', label: 'Option 1' },
        ],
      },
    ],
    activeFilters: [
      {
        id: 'date-filter',
        label: 'Date',
        value: 'This Week',
        filterId: 'date',
      },
    ],
    resultCount: '1.3 million transfers',
    actions: {
      secondary: {
        label: 'Customize Columns',
        onClick: () => console.log('Customize Columns clicked'),
      },
    },
    layoutToggle: {
      mode: 'list',
      onChange: (mode) => console.log('Layout changed to:', mode),
    },
    showClearAll: true,
  },
};
