import React, { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Stack,
  List,
} from '@mui/material';
import { Modal, Button, Input, Avatar, Divider, Chips, ListItem } from '@kyleboyd/design-system';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ShareViewModalProps {
  open: boolean;
  onClose: () => void;
  viewName: string;
  onShare: (userIds: string[]) => void;
  alreadySharedUsers?: User[];
  availableUsers?: User[];
}

export function ShareViewModal({
  open,
  onClose,
  viewName,
  onShare,
  alreadySharedUsers = [],
  availableUsers = [],
}: ShareViewModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Filter out already shared users and selected users from available users
  const filteredUsers = useMemo(() => {
    const alreadySharedIds = new Set(alreadySharedUsers.map((u) => u.id));
    const selectedIds = new Set(selectedUsers.map((u) => u.id));
    const excludedIds = new Set([...alreadySharedIds, ...selectedIds]);

    return availableUsers.filter((user) => {
      if (excludedIds.has(user.id)) return false;
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });
  }, [availableUsers, alreadySharedUsers, selectedUsers, searchQuery]);

  const handleUserSelect = (user: User) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchQuery('');
  };

  const handleRemoveSelected = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleShare = () => {
    if (selectedUsers.length > 0) {
      onShare(selectedUsers.map((u) => u.id));
      setSelectedUsers([]);
      setSearchQuery('');
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchQuery('');
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const modalTitle = (
    <Box>
      <Typography variant="h6" component="span">
        Share View
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, fontWeight: 500 }}
      >
        {viewName}
      </Typography>
    </Box>
  );

  const modalActions = (
    <>
      <Button variant="text" onClick={handleClose}>
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleShare}
        disabled={selectedUsers.length === 0}
        color="primary"
      >
        Share View
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title={modalTitle}
      actions={modalActions}
      showCloseButton={true}
    >
        <Stack spacing={3}>
          {/* Search Section */}
          <Box>
            <Input
              label="Search users"
              placeholder="Type to search for users..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              fullWidth
            />

            {/* Search Results */}
            {searchQuery.trim() && filteredUsers.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                <List dense>
                  {filteredUsers.map((user) => (
                    <ListItem
                      key={user.id}
                      button
                      onClick={() => handleUserSelect(user)}
                      primary={user.name}
                      secondary={user.email}
                      icon={
                        <Avatar
                          src={user.avatar}
                          size="32px"
                        >
                          {getInitials(user.name)}
                        </Avatar>
                      }
                    />
                  ))}
                </List>
              </Box>
            )}

            {searchQuery.trim() && filteredUsers.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, textAlign: 'center' }}
              >
                No users found
              </Typography>
            )}
          </Box>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Selected Users ({selectedUsers.length})
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 1,
                }}
              >
                {selectedUsers.map((user) => (
                  <Chips
                    key={user.id}
                    label={user.name}
                    onDelete={() => handleRemoveSelected(user.id)}
                    size="small"
                    avatar={
                      <Avatar
                        src={user.avatar}
                        size="24px"
                      >
                        {getInitials(user.name)}
                      </Avatar>
                    }
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider />

          {/* Already Shared Users */}
          {alreadySharedUsers.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Already Shared With ({alreadySharedUsers.length})
              </Typography>
              <List dense>
                {alreadySharedUsers.map((user) => (
                  <ListItem
                    key={user.id}
                    primary={user.name}
                    secondary={user.email}
                    icon={
                      <Avatar
                        src={user.avatar}
                        size="32px"
                      >
                        {getInitials(user.name)}
                      </Avatar>
                    }
                  />
                ))}
              </List>
            </Box>
          )}

          {alreadySharedUsers.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', py: 2 }}
            >
              No users have been shared with yet
            </Typography>
          )}
        </Stack>
    </Modal>
  );
}

