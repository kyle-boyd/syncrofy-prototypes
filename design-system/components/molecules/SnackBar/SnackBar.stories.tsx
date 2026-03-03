import type { Meta, StoryObj } from '@storybook/react';
import { SnackBar } from './SnackBar';
import { Button } from '../../atoms/Button';
import { useState } from 'react';

const meta = {
  title: 'Molecules/SnackBar',
  component: SnackBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'SnackBar component for displaying brief messages. Extends MUI Snackbar with Alert styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The message to display',
    },
    severity: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
      description: 'The severity of the alert',
    },
    open: {
      control: 'boolean',
      description: 'If true, the snackbar is open',
    },
    autoHideDuration: {
      control: 'number',
      description: 'The duration to display the snackbar in milliseconds',
    },
  },
} satisfies Meta<typeof SnackBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    open: true,
    message: 'Operation completed successfully!',
    severity: 'success',
  },
};

export const Error: Story = {
  args: {
    open: true,
    message: 'An error occurred. Please try again.',
    severity: 'error',
  },
};

export const Warning: Story = {
  args: {
    open: true,
    message: 'Warning: This action cannot be undone.',
    severity: 'warning',
  },
};

export const Info: Story = {
  args: {
    open: true,
    message: 'Information: Check this out!',
    severity: 'info',
  },
};

export const Interactive: Story = {
  args: {
    open: false,
    message: 'Message',
    severity: 'success',
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
    const [message, setMessage] = useState('Operation completed successfully!');

    const handleOpen = (sev: typeof severity, msg: string) => {
      setSeverity(sev);
      setMessage(msg);
      setOpen(true);
    };

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Button onClick={() => handleOpen('success', 'Success message!')}>
            Show Success
          </Button>
          <Button onClick={() => handleOpen('error', 'Error message!')} color="error">
            Show Error
          </Button>
          <Button onClick={() => handleOpen('warning', 'Warning message!')} color="warning">
            Show Warning
          </Button>
          <Button onClick={() => handleOpen('info', 'Info message!')} color="info">
            Show Info
          </Button>
        </div>
        <SnackBar
          open={open}
          message={message}
          severity={severity}
          onClose={() => setOpen(false)}
          autoHideDuration={3000}
        />
      </>
    );
  },
};

export const TopLeft: Story = {
  args: {
    open: true,
    message: 'Top Left Position',
    severity: 'info',
    anchorOrigin: { vertical: 'top', horizontal: 'left' },
  },
};

export const TopCenter: Story = {
  args: {
    open: true,
    message: 'Top Center Position',
    severity: 'info',
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
  },
};

export const TopRight: Story = {
  args: {
    open: true,
    message: 'Top Right Position',
    severity: 'info',
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
  },
};

export const BottomLeft: Story = {
  args: {
    open: true,
    message: 'Bottom Left Position',
    severity: 'info',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  },
};

export const BottomCenter: Story = {
  args: {
    open: true,
    message: 'Bottom Center Position',
    severity: 'info',
    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  },
};

export const BottomRight: Story = {
  args: {
    open: true,
    message: 'Bottom Right Position',
    severity: 'info',
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
  },
};

export const LongDuration: Story = {
  args: {
    open: true,
    message: 'This message will stay for 10 seconds',
    severity: 'info',
    autoHideDuration: 10000,
  },
};

export const Persistent: Story = {
  args: {
    open: true,
    message: 'This message will not auto-hide',
    severity: 'info',
    autoHideDuration: null,
  },
};

