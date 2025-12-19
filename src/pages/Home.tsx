import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Stack, Paper } from '@mui/material';
import { Button, Input, Badge, Tag, Checkbox, Radio } from '@kyleboyd/design-system';
import { ShareViewModal, User } from '../components/ShareViewModal';
import { RawEventsModal } from '../components/RawEventsModal';

function Home() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [rawEventsModalOpen, setRawEventsModalOpen] = useState(false);
  const [rawEvents, setRawEvents] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockAvailableUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com' },
    { id: '4', name: 'Alice Williams', email: 'alice.williams@example.com' },
    { id: '5', name: 'Charlie Brown', email: 'charlie.brown@example.com' },
    { id: '6', name: 'Diana Prince', email: 'diana.prince@example.com' },
    { id: '7', name: 'Edward Norton', email: 'edward.norton@example.com' },
    { id: '8', name: 'Fiona Apple', email: 'fiona.apple@example.com' },
  ];

  const [alreadySharedUsers, setAlreadySharedUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
  ]);

  const handleShare = (userIds: string[]) => {
    const newSharedUsers = mockAvailableUsers.filter((user) =>
      userIds.includes(user.id)
    );
    setAlreadySharedUsers([...alreadySharedUsers, ...newSharedUsers]);
    setShareModalOpen(false);
    console.log('Sharing view with users:', userIds);
  };

  // Load raw events from the example JSON file
  const loadRawEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/PUSH_PULL_A_pretty.json');
      if (!response.ok) {
        throw new Error('Failed to load raw events');
      }
      const data = await response.json();
      setRawEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load raw events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rawEventsModalOpen && !rawEvents && !loading) {
      loadRawEvents();
    }
  }, [rawEventsModalOpen]);

  const handleOpenRawEvents = () => {
    setRawEventsModalOpen(true);
  };

  const handleCloseRawEvents = () => {
    setRawEventsModalOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Syncrofy Design System Prototype
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is a prototype page demonstrating the use of components from the Syncrofy Design System.
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* Buttons Section */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Buttons
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
            <Button variant="contained" color="primary">
              Primary Button
            </Button>
            <Button variant="outlined" color="primary">
              Outlined Button
            </Button>
            <Button variant="text" color="primary">
              Text Button
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="contained" disabled>
              Disabled
            </Button>
          </Stack>
        </Paper>

        {/* Inputs Section */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Inputs
          </Typography>
          <Stack spacing={2} sx={{ mt: 2, maxWidth: 400 }}>
            <Input
              label="Text Input"
              placeholder="Enter text here"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            />
            <Input
              label="Required Input"
              required
              helperText="This field is required"
            />
            <Input
              label="Error Input"
              error
              helperText="This field has an error"
            />
            <Input
              label="Disabled Input"
              disabled
              value="Disabled value"
            />
          </Stack>
        </Paper>

        {/* Form Controls Section */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Form Controls
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box>
              <Checkbox
                checked={checked}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChecked(e.target.checked)}
              />
              <Typography component="span" sx={{ ml: 1 }}>
                Checkbox option
              </Typography>
            </Box>
            <Box>
              <Radio
                checked={radioValue === 'option1'}
                onChange={() => setRadioValue('option1')}
                value="option1"
              />
              <Typography component="span" sx={{ ml: 1 }}>
                Radio option 1
              </Typography>
            </Box>
            <Box>
              <Radio
                checked={radioValue === 'option2'}
                onChange={() => setRadioValue('option2')}
                value="option2"
              />
              <Typography component="span" sx={{ ml: 1 }}>
                Radio option 2
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Badges and Tags Section */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Badges & Tags
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
            <Badge badgeContent={4} color="primary">
              <Button variant="contained">Notifications</Button>
            </Badge>
            <Badge badgeContent={99} color="error">
              <Button variant="outlined">Messages</Button>
            </Badge>
            <Tag label="Tag 1" variant="primary" />
            <Tag label="Tag 2" variant="neutral" />
            <Tag label="Tag 3" variant="error" />
            <Tag label="Tag 4" variant="success" />
          </Stack>
        </Paper>

        {/* Share View Modal Demo */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Share View Modal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click the button below to open the Share View Modal
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShareModalOpen(true)}
          >
            Share View
          </Button>
        </Paper>

        {/* Raw Events Modal Demo */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Raw Events Modal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click the button below to open the Raw Events Modal with JSON viewer
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenRawEvents}
          >
            View Raw Events
          </Button>
        </Paper>

        {/* Transfer Details Page Demo */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Transfer Details Page
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click the button below to navigate to the Transfer Details page
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/transfers')}
          >
            View Transfer Details
          </Button>
        </Paper>
      </Stack>

      <ShareViewModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        viewName="Sales Dashboard"
        onShare={handleShare}
        alreadySharedUsers={alreadySharedUsers}
        availableUsers={mockAvailableUsers}
      />

      <RawEventsModal
        open={rawEventsModalOpen}
        onClose={handleCloseRawEvents}
        events={rawEvents}
        loading={loading}
        error={error}
        onRetry={loadRawEvents}
      />
    </Container>
  );
}

export default Home;

