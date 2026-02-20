import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Stack, Paper } from '@mui/material';
import { Button } from '@kyleboyd/design-system';
import { ShareViewModal, User } from '../components/ShareViewModal';
import { RawEventsModal, RawFile } from '../components/RawEventsModal';

function Home() {
  const navigate = useNavigate();
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
    setFiles([]); // Clear files when modal closes
  };

  // Example files for file selection demo
  const [files, setFiles] = useState<RawFile[]>([]);

  // Example event data for different files
  const getEventsForFile = (fileId: string): unknown[] => {
    switch (fileId) {
      case 'file1':
        // Events for anderson_loan_funding.dat
        return [
          {
            ProducerPattern: "PUSH",
            direction: "R",
            status: "Success",
            username: "loanfund_user",
            producerUserId: "loanfund_user",
            producerMailboxPath: "/home/loanfund",
            producerFileSize: "909056",
            producerFilename: "anderson_loan_funding.dat",
            producerRemoteHost: "sftp.loanfund.bank.com",
            producerRemoteIp: "192.168.1.100",
            producerProtocol: "sftp",
            stage: "ARRIVED_FILE",
            event: "StartTransfer",
            time: "1734385232000",
            arrivedfile_KEY: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            event_KEY: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          },
          {
            stage: "PROCESSING",
            event: "FileUnzipped",
            time: "1734385232050",
            filename: "anderson_loan_funding.dat",
            arrivedfile_KEY: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            event_KEY: "a1b2c3d4-e5f6-7890-abcd-ef1234567891"
          },
          {
            consumerName: "anderson_sftp",
            consumerProtocol: "SFTP",
            consumerFilename: "anderson_loan_funding.dat",
            consumerMailboxPath: "/incoming/loans",
            consumerFileSize: "909056",
            stage: "DELIVERY",
            event: "StartedDelivery",
            time: "1734385232200",
            arrivedfile_KEY: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            event_KEY: "a1b2c3d4-e5f6-7890-abcd-ef1234567892"
          },
          {
            stage: "DELIVERY",
            event: "CompletedDelivery",
            time: "1734385232400",
            status: "Success",
            arrivedfile_KEY: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            event_KEY: "a1b2c3d4-e5f6-7890-abcd-ef1234567893"
          }
        ];
      case 'file2':
        // Events for funding_check.log
        return [
          {
            stage: "PROCESSING",
            event: "ValidationStarted",
            time: "1734385232100",
            filename: "funding_check.log",
            validationType: "LoanFundingValidation",
            arrivedfile_KEY: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
            event_KEY: "b2c3d4e5-f6a7-8901-bcde-f23456789012"
          },
          {
            stage: "PROCESSING",
            event: "ValidationCheck",
            time: "1734385232150",
            check: "AccountBalanceCheck",
            result: "Passed",
            arrivedfile_KEY: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
            event_KEY: "b2c3d4e5-f6a7-8901-bcde-f23456789013"
          },
          {
            stage: "PROCESSING",
            event: "ValidationCheck",
            time: "1734385232180",
            check: "CreditLimitCheck",
            result: "Passed",
            arrivedfile_KEY: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
            event_KEY: "b2c3d4e5-f6a7-8901-bcde-f23456789014"
          },
          {
            stage: "PROCESSING",
            event: "ValidationCompleted",
            time: "1734385232300",
            status: "Success",
            message: "Loan funding validations passed",
            arrivedfile_KEY: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
            event_KEY: "b2c3d4e5-f6a7-8901-bcde-f23456789015"
          }
        ];
      case 'file3':
        // Events for transfer_events.json
        return [
          {
            ProducerPattern: "PUSH",
            direction: "R",
            status: "Success",
            username: "loanfund_user",
            producerFileSize: "888.00 KB",
            producerFilename: "fund_notification_4744.dat",
            producerRemoteHost: "sftp.loanfund.bank.com",
            producerProtocol: "sftp",
            stage: "ARRIVED_FILE",
            event: "StartTransfer",
            time: "1734385232000",
            transactionId: "S73847958390500035265",
            arrivedfile_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901234",
            event_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901234"
          },
          {
            stage: "PROCESSING",
            event: "FileProcessing",
            time: "1734385232050",
            action: "Transform",
            arrivedfile_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901234",
            event_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901235"
          },
          {
            consumerName: "anderson_sftp",
            consumerProtocol: "SFTP",
            consumerFilename: "fund_notification_4744.dat",
            consumerMailboxPath: "/incoming/loans",
            stage: "DELIVERY",
            event: "ConnectionEstablished",
            time: "1734385232200",
            host: "sftp.anderson.com",
            port: "22",
            arrivedfile_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901234",
            event_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901236"
          },
          {
            stage: "DELIVERY",
            event: "FileUploaded",
            time: "1734385232350",
            filename: "fund_notification_4744.dat",
            status: "Success",
            arrivedfile_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901234",
            event_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901237"
          },
          {
            stage: "DELIVERY",
            event: "ConnectionClosed",
            time: "1734385232400",
            arrivedfile_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901234",
            event_KEY: "c3d4e5f6-a7b8-9012-cdef-345678901238"
          }
        ];
      default:
        return [];
    }
  };

  const loadRawEventsForFile = async (fileId: string) => {
    // Update the specific file's loading state
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, loading: true, error: null }
        : f
    ));

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get example events for this file
      const data = getEventsForFile(fileId);
      
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, data, loading: false, error: null }
          : f
      ));
    } catch (err) {
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, loading: false, error: err instanceof Error ? err.message : 'Failed to load file' }
          : f
      ));
    }
  };

  const handleOpenRawEventsWithFiles = () => {
    // Initialize example files
    setFiles([
      {
        id: 'file1',
        name: 'anderson_loan_funding.dat',
        onLoad: () => loadRawEventsForFile('file1'),
      },
      {
        id: 'file2',
        name: 'funding_check.log',
        onLoad: () => loadRawEventsForFile('file2'),
      },
      {
        id: 'file3',
        name: 'transfer_events.json',
        onLoad: () => loadRawEventsForFile('file3'),
      },
    ]);
    setRawEventsModalOpen(true);
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
        {/* Component Gallery */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Component Gallery
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Browse all design system components in a Storybook-like gallery.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/gallery')}
          >
            Open Component Gallery
          </Button>
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
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenRawEvents}
            >
              View Raw Events (Legacy)
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenRawEventsWithFiles}
            >
              View Raw Events (With File Selection)
            </Button>
          </Stack>
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

        {/* Integration Cloud (SIC) Demo */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Integration Cloud (SIC)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click the button below to navigate to the Supplier Integration Console prototype
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/integration-cloud')}
          >
            Open Integration Cloud
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
        events={files.length === 0 ? rawEvents : undefined}
        loading={files.length === 0 ? loading : false}
        error={files.length === 0 ? error : null}
        onRetry={files.length === 0 ? loadRawEvents : undefined}
        files={files.length > 0 ? files : undefined}
      />
    </Container>
  );
}

export default Home;

