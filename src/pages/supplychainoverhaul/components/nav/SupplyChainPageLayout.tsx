import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from '@design-system';
import { SupplyChainSideNav } from './SupplyChainSideNav';

interface SupplyChainPageLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
  hideHeaderBorder?: boolean;
  contentPadding?: number | string;
}

export function SupplyChainPageLayout({
  children,
  backgroundColor = '#FAFCFC',
  hideHeaderBorder = true,
  contentPadding = 3,
}: SupplyChainPageLayoutProps) {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: backgroundColor }}>
      <SupplyChainSideNav />

      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <Box sx={{ borderBottom: hideHeaderBorder ? 'none' : '1px solid', borderColor: 'divider' }}>
          <Header
            searchPlaceholder="Search for files"
            environmentLabel="CoEnterprise - Production"
            userInitials="KB"
            userName="Kyle Boyd"
            userOrganization="CoEnterprise"
          />
        </Box>
        <Box sx={{ p: contentPadding, flex: 1, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
