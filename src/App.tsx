import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from '@design-system';
import Home from './pages/Home';
import ComponentGallery from './pages/ComponentGallery';
import TransferDetails from './pages/TransferDetails';
import Transfers from './pages/Transfers';
import Partners from './pages/Partners';
import PartnerDetail from './pages/PartnerDetail';
import IntegrationCloud from './pages/IntegrationCloud';
import Settings from './pages/Settings';
import UserDetail from './pages/UserDetail';
import Exceptions from './pages/Exceptions';
import ExceptionRuleConfig from './pages/ExceptionRuleConfig';
import ScheduledReports from './pages/ScheduledReports';
import ScrollTestIndex from './pages/ScrollTestIndex';
import ScrollTest2 from './pages/ScrollTest2';
import ScrollTest3 from './pages/ScrollTest3';
import CompanyMismatchIndex from './pages/CompanyMismatchIndex';
import CompanyMismatch1 from './pages/CompanyMismatch1';
import CompanyMismatch2 from './pages/CompanyMismatch2';
import CompanyMismatch3 from './pages/CompanyMismatch3';
import DashboardsHome from './pages/DashboardsHome';
import DashboardDetail from './pages/DashboardDetail';
import IconButtonTooltips from './pages/IconButtonTooltips';
import AITransfers from './pages/ai/AITransfers';
import AIFingerprints from './pages/ai/AIFingerprints';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboards" element={<DashboardsHome />} />
          <Route path="/dashboards/:id" element={<DashboardDetail />} />
          <Route path="/gallery" element={<ComponentGallery />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/transfers/:id" element={<TransferDetails />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/partners/:id" element={<PartnerDetail />} />
          <Route path="/integration-cloud" element={<IntegrationCloud />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/users/:id" element={<UserDetail />} />
          <Route path="/exceptions" element={<Exceptions />} />
          <Route path="/exceptions/rules" element={<ExceptionRuleConfig />} />
          <Route path="/reports" element={<ScheduledReports />} />
          <Route path="/scroll-test" element={<ScrollTestIndex />} />
          <Route path="/scroll-test/2" element={<ScrollTest2 />} />
          <Route path="/scroll-test/3" element={<ScrollTest3 />} />
          <Route path="/company-mismatch" element={<CompanyMismatchIndex />} />
          <Route path="/company-mismatch/1" element={<CompanyMismatch1 />} />
          <Route path="/company-mismatch/2" element={<CompanyMismatch2 />} />
          <Route path="/company-mismatch/3" element={<CompanyMismatch3 />} />
          <Route path="/icon-button-tooltips" element={<IconButtonTooltips />} />
          <Route path="/ai/transfers" element={<AITransfers />} />
          <Route path="/ai/fingerprints" element={<AIFingerprints />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

