import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../../../atoms/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const meta = {
  title: 'Organisms/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modal component for displaying dialog content. Extends MUI Dialog with custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'If true, the modal is open',
    },
    title: {
      control: 'text',
      description: 'The title of the modal',
    },
    maxWidth: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', false],
      description: 'The maximum width of the modal',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'If true, displays a close button in the title',
    },
    closeOnBackdropClick: {
      control: 'boolean',
      description: 'If true, clicking the backdrop will close the modal',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: false,
    title: 'Modal Title',
    children: (
      <Typography>
        This is the modal content. You can add any content here.
      </Typography>
    ),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const WithActions: Story = {
  args: {
    open: false,
    title: 'Confirm Action',
    children: (
      <Typography>
        Are you sure you want to perform this action?
      </Typography>
    ),
    actions: (
      <>
        <Button variant="text" color="secondary">Cancel</Button>
        <Button variant="contained">Confirm</Button>
      </>
    ),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Actions</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          actions={
            <>
              <Button variant="text" color="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        />
      </>
    );
  },
};

export const WithoutCloseButton: Story = {
  args: {
    open: false,
    title: 'Modal Without Close Button',
    showCloseButton: false,
    children: (
      <Typography>
        This modal doesn't have a close button in the title.
      </Typography>
    ),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal (No Close Button)</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const Sizes: Story = {
  args: {
    open: false,
    title: 'Modal Size',
    children: <Typography>Modal content</Typography>,
  },
  render: (args) => {
    const [openXs, setOpenXs] = useState(false);
    const [openSm, setOpenSm] = useState(false);
    const [openMd, setOpenMd] = useState(false);
    const [openLg, setOpenLg] = useState(false);
    const [openXl, setOpenXl] = useState(false);

    return (
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button onClick={() => setOpenXs(true)}>Extra Small</Button>
        <Button onClick={() => setOpenSm(true)}>Small</Button>
        <Button onClick={() => setOpenMd(true)}>Medium</Button>
        <Button onClick={() => setOpenLg(true)}>Large</Button>
        <Button onClick={() => setOpenXl(true)}>Extra Large</Button>

        <Modal {...args} open={openXs} onClose={() => setOpenXs(false)} title="Extra Small" maxWidth="xs" />
        <Modal {...args} open={openSm} onClose={() => setOpenSm(false)} title="Small" maxWidth="sm" />
        <Modal {...args} open={openMd} onClose={() => setOpenMd(false)} title="Medium" maxWidth="md" />
        <Modal {...args} open={openLg} onClose={() => setOpenLg(false)} title="Large" maxWidth="lg" />
        <Modal {...args} open={openXl} onClose={() => setOpenXl(false)} title="Extra Large" maxWidth="xl" />
      </Box>
    );
  },
};

export const LongContent: Story = {
  args: {
    open: false,
    title: 'Long Content Modal',
    children: (
      <Box sx={{ height: 400, overflow: 'auto' }}>
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>
        {Array.from({ length: 20 }).map((_, i) => (
          <Typography key={i} paragraph>
            Paragraph {i + 1}: Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
        ))}
      </Box>
    ),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Long Content</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const WithoutBackdropClick: Story = {
  args: {
    open: false,
    title: 'Modal Without Backdrop Close',
    closeOnBackdropClick: false,
    children: (
      <>
        <Typography>
          This modal cannot be closed by clicking the backdrop. You must use the close button or action buttons.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button>Close</Button>
        </Box>
      </>
    ),
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal (No Backdrop Close)</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        >
          <Typography>
            This modal cannot be closed by clicking the backdrop. You must use the close button or action buttons.
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </Box>
        </Modal>
      </>
    );
  },
};

