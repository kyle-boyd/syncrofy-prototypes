import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from '@kyleboyd/design-system';
import Home from './pages/Home';
import ComponentGallery from './pages/ComponentGallery';
import TransferDetails from './pages/TransferDetails';
import Transfers from './pages/Transfers';
import Partners from './pages/Partners';
import PartnerDetail from './pages/PartnerDetail';
import IntegrationCloud from './pages/IntegrationCloud';
import Settings from './pages/Settings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<ComponentGallery />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/transfers/:id" element={<TransferDetails />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/partners/:id" element={<PartnerDetail />} />
          <Route path="/integration-cloud" element={<IntegrationCloud />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

