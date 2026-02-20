import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableColumn } from './Table';
import {
  TextCell,
  NumberCell,
  BadgeCell,
  TwoLineCell,
  EmptyCell,
  TextInputCell,
  NumberStepperCell,
  LabelCell,
  TagCell,
  TagsCell,
  CheckboxCell,
  ActionIconsCell,
} from './DataTableCells';
import { useState } from 'react';
import Box from '@mui/material/Box';

const meta = {
  title: 'Organisms/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Table component for displaying tabular data with various cell types. Extends MUI Table with custom styling based on Figma design.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    stickyHeader: {
      control: 'boolean',
      description: 'If true, shows sticky header',
    },
    striped: {
      control: 'boolean',
      description: 'If true, shows striped rows',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the table cells',
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data types
interface SampleRow {
  id: string;
  name: string;
  description: string;
  status: string;
  quantity: number;
  category: string;
  tags: string[];
  selected?: boolean;
}

const sampleData: SampleRow[] = [
  {
    id: '1',
    name: 'Item 1',
    description: 'Description for item 1',
    status: 'Active',
    quantity: 5,
    category: 'Category A',
    tags: ['Tag 1', 'Tag 2', 'Tag 3'],
    selected: false,
  },
  {
    id: '2',
    name: 'Item 2',
    description: 'Description for item 2',
    status: 'Pending',
    quantity: 10,
    category: 'Category B',
    tags: ['Tag 1'],
    selected: false,
  },
  {
    id: '3',
    name: 'Item 3',
    description: 'Description for item 3',
    status: 'Inactive',
    quantity: 0,
    category: 'Category A',
    tags: ['Tag 2', 'Tag 3'],
    selected: false,
  },
  {
    id: '4',
    name: 'Item 4',
    description: 'Description for item 4',
    status: 'Active',
    quantity: 15,
    category: 'Category C',
    tags: ['Tag 1', 'Tag 3'],
    selected: false,
  },
  {
    id: '5',
    name: 'Item 5',
    description: 'Description for item 5',
    status: 'Pending',
    quantity: 8,
    category: 'Category B',
    tags: ['Tag 2'],
    selected: false,
  },
];

export const Default: Story = {
  args: {
    columns: [
      {
        id: 'name',
        label: 'Name',
        align: 'left',
      },
      {
        id: 'status',
        label: 'Status',
        align: 'left',
      },
      {
        id: 'quantity',
        label: 'Quantity',
        align: 'center',
      },
    ],
    rows: sampleData,
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Table {...args} />
    </Box>
  ),
};

export const Sortable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Columns can be sortable. Click a sortable header to sort by that column (uncontrolled: table sorts rows in-memory).',
      },
    },
  },
  args: {
    columns: [
      { id: 'name', label: 'Name', align: 'left', sortable: true },
      { id: 'status', label: 'Status', align: 'left', sortable: true },
      { id: 'quantity', label: 'Quantity', align: 'center', sortable: true },
    ],
    rows: sampleData,
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Table {...args} />
    </Box>
  ),
};

export const SortableControlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Sorting can be controlled via sortBy, sortDirection, and onSort for server-side or custom sort logic.',
      },
    },
  },
  render: () => {
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
      setSortBy(columnId);
      setSortDirection(direction);
    };
    return (
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <Table
          columns={[
            { id: 'name', label: 'Name', align: 'left', sortable: true },
            { id: 'status', label: 'Status', align: 'left', sortable: true },
            { id: 'quantity', label: 'Quantity', align: 'center', sortable: true },
          ]}
          rows={sampleData}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </Box>
    );
  },
};

export const ResizableColumns: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When resizableColumns is true, drag the right edge of a header cell to resize the column.',
      },
    },
  },
  args: {
    columns: [
      { id: 'name', label: 'Name', align: 'left', width: 200, minWidth: 100, maxWidth: 400 },
      { id: 'status', label: 'Status', align: 'left', width: 120, minWidth: 80, maxWidth: 200 },
      { id: 'quantity', label: 'Quantity', align: 'center', width: 100, minWidth: 60, maxWidth: 150 },
      { id: 'category', label: 'Category', align: 'left', width: 150 },
    ],
    rows: sampleData,
    resizableColumns: true,
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Table {...args} />
    </Box>
  ),
};

export const SortableAndResizable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Table with both sortable columns and resizable columns.',
      },
    },
  },
  args: {
    columns: [
      { id: 'name', label: 'Name', align: 'left', sortable: true, width: 200, minWidth: 100, maxWidth: 400 },
      { id: 'status', label: 'Status', align: 'left', sortable: true, width: 120, minWidth: 80, maxWidth: 200 },
      { id: 'quantity', label: 'Quantity', align: 'center', sortable: true, width: 100, minWidth: 60, maxWidth: 150 },
    ],
    rows: sampleData,
    resizableColumns: true,
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Table {...args} />
    </Box>
  ),
};

export const WithDataTableCells: Story = {
  args: {
    columns: [
      {
        id: 'select',
        label: 'Heading',
        align: 'left',
        headerCheckbox: true,
        headerCheckboxChecked: false,
        render: (row: SampleRow) => (
          <CheckboxCell
            checked={row.selected || false}
            onChange={(e, checked) => {
              // Handle checkbox change
            }}
          />
        ),
      },
      {
        id: 'label',
        label: 'Heading',
        align: 'left',
        render: (row: SampleRow) => (
          <LabelCell label={row.name} secondaryText={row.description} />
        ),
      },
      {
        id: 'status',
        label: 'Heading',
        align: 'left',
        render: (row: SampleRow) => (
          <TagCell
            label={row.status}
            variant={
              row.status === 'Active'
                ? 'success'
                : row.status === 'Pending'
                ? 'warning'
                : 'neutral'
            }
          />
        ),
      },
      {
        id: 'quantity',
        label: 'Heading',
        align: 'center',
        render: (row: SampleRow) => (
          <NumberStepperCell
            value={row.quantity}
            onChange={(value) => {
              // Handle quantity change
            }}
          />
        ),
      },
      {
        id: 'text',
        label: 'Heading',
        align: 'left',
        render: (row: SampleRow) => <TextInputCell value={row.category} placeholder="Text" />,
      },
      {
        id: 'actions',
        label: 'Heading',
        align: 'right',
        render: (row: SampleRow) => (
          <ActionIconsCell
            radioCount={2}
            showDelete={true}
            showMore={true}
            onDeleteClick={() => {
              // Handle delete
            }}
            onMoreClick={() => {
              // Handle more options
            }}
          />
        ),
      },
    ],
    rows: sampleData,
  },
  render: (args) => {
    const [rows, setRows] = useState(sampleData);
    const [allSelected, setAllSelected] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);

    const handleHeaderCheckboxChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean
    ) => {
      const updatedRows = rows.map((row) => ({ ...row, selected: checked }));
      setRows(updatedRows);
      setAllSelected(checked);
      setIndeterminate(false);
    };

    const handleRowCheckboxChange = (rowId: string) => (
      event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean
    ) => {
      const updatedRows = rows.map((row) =>
        row.id === rowId ? { ...row, selected: checked } : row
      );
      setRows(updatedRows);

      const selectedCount = updatedRows.filter((r) => r.selected).length;
      setAllSelected(selectedCount === rows.length);
      setIndeterminate(selectedCount > 0 && selectedCount < rows.length);
    };

    const columns: TableColumn<SampleRow>[] = [
      {
        id: 'select',
        label: 'Heading',
        align: 'left',
        headerCheckbox: true,
        headerCheckboxChecked: allSelected,
        headerCheckboxIndeterminate: indeterminate,
        onHeaderCheckboxChange: handleHeaderCheckboxChange,
        render: (row: SampleRow) => (
          <CheckboxCell
            checked={row.selected || false}
            onChange={handleRowCheckboxChange(row.id)}
          />
        ),
      },
      {
        id: 'label',
        label: 'Heading',
        align: 'left',
        render: (row: SampleRow) => (
          <LabelCell label={row.name} secondaryText={row.description} />
        ),
      },
      {
        id: 'status',
        label: 'Heading',
        align: 'left',
        render: (row: SampleRow) => (
          <TagCell
            label={row.status}
            variant={
              row.status === 'Active'
                ? 'success'
                : row.status === 'Pending'
                ? 'warning'
                : 'neutral'
            }
          />
        ),
      },
      {
        id: 'quantity',
        label: 'Heading',
        align: 'center',
        render: (row: SampleRow) => (
          <NumberStepperCell
            value={row.quantity}
            onChange={(value) => {
              const updatedRows = rows.map((r) =>
                r.id === row.id ? { ...r, quantity: value } : r
              );
              setRows(updatedRows);
            }}
          />
        ),
      },
      {
        id: 'text',
        label: 'Heading',
        align: 'left',
        render: (row: SampleRow) => (
          <TextInputCell
            value={row.category}
            placeholder="Text"
            onChange={(e) => {
              const updatedRows = rows.map((r) =>
                r.id === row.id ? { ...r, category: e.target.value } : r
              );
              setRows(updatedRows);
            }}
          />
        ),
      },
      {
        id: 'actions',
        label: 'Heading',
        align: 'right',
        render: (row: SampleRow) => (
          <ActionIconsCell
            radioCount={2}
            showDelete={true}
            showMore={true}
            onDeleteClick={() => {
              const updatedRows = rows.filter((r) => r.id !== row.id);
              setRows(updatedRows);
            }}
            onMoreClick={() => {
              // Handle more options
            }}
          />
        ),
      },
    ];

    return (
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Table columns={columns} rows={rows} />
      </Box>
    );
  },
};

export const WithTags: Story = {
  args: {
    columns: [
      {
        id: 'name',
        label: 'Name',
        align: 'left',
        render: (row: SampleRow) => (
          <LabelCell label={row.name} secondaryText={row.description} />
        ),
      },
      {
        id: 'tags',
        label: 'Tags',
        align: 'left',
        render: (row: SampleRow) => <TagsCell tags={row.tags} variant="neutral" />,
      },
    ],
    rows: sampleData,
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Table {...args} />
    </Box>
  ),
};

export const Striped: Story = {
  args: {
    columns: [
      {
        id: 'name',
        label: 'Name',
        align: 'left',
      },
      {
        id: 'status',
        label: 'Status',
        align: 'left',
        render: (row: SampleRow) => (
          <TagCell
            label={row.status}
            variant={
              row.status === 'Active'
                ? 'success'
                : row.status === 'Pending'
                ? 'warning'
                : 'neutral'
            }
          />
        ),
      },
      {
        id: 'quantity',
        label: 'Quantity',
        align: 'center',
      },
    ],
    rows: sampleData,
    striped: true,
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Table {...args} />
    </Box>
  ),
};

export const SmallSize: Story = {
  args: {
    columns: [
      {
        id: 'name',
        label: 'Name',
        align: 'left',
      },
      {
        id: 'status',
        label: 'Status',
        align: 'left',
      },
      {
        id: 'quantity',
        label: 'Quantity',
        align: 'center',
      },
    ],
    rows: sampleData,
    size: 'small',
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Table {...args} />
    </Box>
  ),
};

export const WithStickyHeader: Story = {
  args: {
    columns: [
      {
        id: 'name',
        label: 'Name',
        align: 'left',
      },
      {
        id: 'status',
        label: 'Status',
        align: 'left',
      },
      {
        id: 'quantity',
        label: 'Quantity',
        align: 'center',
      },
      {
        id: 'category',
        label: 'Category',
        align: 'left',
      },
    ],
    rows: Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      name: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
      status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive',
      quantity: i * 2,
      category: `Category ${String.fromCharCode(65 + (i % 3))}`,
      tags: [],
    })),
    stickyHeader: true,
    maxHeight: 400,
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Table {...args} />
    </Box>
  ),
};

export const AllCellTypes: Story = {
  args: {
    columns: [
      {
        id: 'checkbox',
        label: 'Select',
        align: 'left',
        render: () => <CheckboxCell />,
      },
      {
        id: 'textInput',
        label: 'Text Input',
        align: 'left',
        render: () => <TextInputCell placeholder="Enter text" />,
      },
      {
        id: 'numberStepper',
        label: 'Quantity',
        align: 'center',
        render: () => <NumberStepperCell value={0} />,
      },
      {
        id: 'label',
        label: 'Label',
        align: 'left',
        render: () => <LabelCell label="Label" secondaryText="Secondary text" />,
      },
      {
        id: 'tag',
        label: 'Tag',
        align: 'left',
        render: () => <TagCell label="Label" variant="info" />,
      },
      {
        id: 'tags',
        label: 'Tags',
        align: 'left',
        render: () => <TagsCell tags={['Label', 'Label', 'Label']} variant="neutral" />,
      },
      {
        id: 'actions',
        label: 'Actions',
        align: 'right',
        render: () => <ActionIconsCell radioCount={2} showDelete={true} showMore={true} />,
      },
    ],
    rows: Array.from({ length: 3 }, (_, i) => ({ id: String(i + 1) })),
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 1200 }}>
      <Table {...args} />
    </Box>
  ),
};

// Transfers-style table using display-only cells (mirrors transfers dashboard)
interface TransferRow {
  id: string;
  senderFileName: string;
  sender: string;
  receiver: string | null;
  direction: 'inbound' | 'outbound' | 'unknown';
  status: 'success' | 'failed' | 'unknown';
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
}

const transfersData: TransferRow[] = [
  {
    id: '1',
    senderFileName: 'testfile-zilla.dat',
    sender: 'QA_COE_External_Partner',
    receiver: 'SFTP_syncrofy-sandbox.coenterprise.com_SYN_Producer',
    direction: 'inbound',
    status: 'success',
    startTime: '9:15 AM',
    startDate: 'Feb 1 2026',
    endTime: '12:58 PM',
    endDate: 'Feb 1 2026',
  },
  {
    id: '2',
    senderFileName: 'files_29285301154.dat',
    sender: 'SFTP_syncrofy-sandbox.coenterprise.com_SYN_Producer',
    receiver: null,
    direction: 'outbound',
    status: 'failed',
    startTime: '8:42 AM',
    startDate: 'Jan 31 2026',
    endTime: '8:43 AM',
    endDate: 'Jan 31 2026',
  },
  {
    id: '3',
    senderFileName: 'data-export.csv',
    sender: 'Internal_Export',
    receiver: 'Partner_A_Receiver',
    direction: 'outbound',
    status: 'success',
    startTime: '2:30 PM',
    startDate: 'Feb 1 2026',
    endTime: '2:35 PM',
    endDate: 'Feb 1 2026',
  },
  {
    id: '4',
    senderFileName: 'unknown_file.txt',
    sender: 'External_System',
    receiver: 'SFTP_syncrofy-sandbox.coenterprise.com_SYN_Producer',
    direction: 'unknown',
    status: 'unknown',
    startTime: '11:00 AM',
    startDate: 'Feb 1 2026',
    endTime: '—',
    endDate: '—',
  },
];

export const Transfers: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Transfers-style table using display-only cells: TextCell, BadgeCell (Direction & Status), TwoLineCell (Start/End), EmptyCell for missing receiver.',
      },
    },
  },
  args: {
    columns: [
      {
        id: 'senderFileName',
        label: 'Sender File Name',
        align: 'left',
        render: (row: TransferRow) => <TextCell value={row.senderFileName} />,
      },
      {
        id: 'sender',
        label: 'Sender',
        align: 'left',
        render: (row: TransferRow) => <TextCell value={row.sender} />,
      },
      {
        id: 'receiver',
        label: 'Receiver',
        align: 'left',
        render: (row: TransferRow) =>
          row.receiver ? <TextCell value={row.receiver} /> : <EmptyCell />,
      },
      {
        id: 'direction',
        label: 'Direction',
        align: 'left',
        render: (row: TransferRow) => (
          <BadgeCell
            label={row.direction.charAt(0).toUpperCase() + row.direction.slice(1)}
            variant={row.direction}
          />
        ),
      },
      {
        id: 'status',
        label: 'Status',
        align: 'left',
        render: (row: TransferRow) => (
          <BadgeCell
            label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            variant={row.status}
          />
        ),
      },
      {
        id: 'start',
        label: 'Start (MST)',
        align: 'left',
        render: (row: TransferRow) => (
          <TwoLineCell primary={row.startTime} secondary={row.startDate} />
        ),
      },
      {
        id: 'end',
        label: 'End (MST)',
        align: 'left',
        render: (row: TransferRow) => (
          <TwoLineCell primary={row.endTime} secondary={row.endDate} />
        ),
      },
    ],
    rows: transfersData,
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 1200 }}>
      <Table {...args} />
    </Box>
  ),
};

export const DisplayCells: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Display-only cell types: TextCell (primary, secondary, bold), NumberCell, BadgeCell, TwoLineCell, EmptyCell.',
      },
    },
  },
  args: {
    columns: [
      {
        id: 'text',
        label: 'Text',
        align: 'left',
        render: () => <TextCell value="Primary text" />,
      },
      {
        id: 'textSecondary',
        label: 'Secondary',
        align: 'left',
        render: () => <TextCell value="Secondary text" variant="secondary" />,
      },
      {
        id: 'textBold',
        label: 'Bold',
        align: 'left',
        render: () => <TextCell value="Bold text" bold />,
      },
      {
        id: 'number',
        label: 'Number',
        align: 'right',
        render: () => <NumberCell value={12345} />,
      },
      {
        id: 'badge',
        label: 'Badge',
        align: 'left',
        render: () => <BadgeCell label="Success" variant="success" />,
      },
      {
        id: 'twoLine',
        label: 'Two line',
        align: 'left',
        render: () => <TwoLineCell primary="9:15 AM" secondary="Feb 1 2026" />,
      },
      {
        id: 'empty',
        label: 'Empty',
        align: 'left',
        render: () => <EmptyCell />,
      },
    ],
    rows: [
      { id: '1' },
      { id: '2' },
      { id: '3' },
    ],
  },
  render: (args) => (
    <Box sx={{ width: '100%', maxWidth: 1200 }}>
      <Table {...args} />
    </Box>
  ),
};


