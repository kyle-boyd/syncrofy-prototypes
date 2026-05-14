import { Navigate, Route } from 'react-router-dom';
import Home from './routes/Home';
import Inbox from './routes/Inbox';
import ExceptionDetail from './routes/ExceptionDetail';
import Recommendations from './routes/Recommendations';
import Transactions from './routes/Transactions';
import TransactionDetail from './routes/TransactionDetail';
import Documents from './routes/Documents';
import Partners from './routes/Partners';
import PartnerDetail from './routes/PartnerDetail';
import KitchenSink from './routes/KitchenSink';
import ReportsLayout from './routes/reports/ReportsLayout';
import OperationsToday from './routes/reports/OperationsToday';
import SLACompliance from './routes/reports/SLACompliance';
import PartnerHealth from './routes/reports/PartnerHealth';
import ErrorPatterns from './routes/reports/ErrorPatterns';
import AIPerformance from './routes/reports/AIPerformance';

export const SUPPLY_CHAIN_BASE = '/supplychainoverhaul';

export const supplyChainRoutes = (
  <>
    <Route path="/supplychainoverhaul" element={<Home />} />
    <Route path="/supplychainoverhaul/inbox" element={<Inbox />} />
    <Route path="/supplychainoverhaul/exception/:id" element={<ExceptionDetail />} />
    <Route path="/supplychainoverhaul/recommendations" element={<Recommendations />} />
    <Route path="/supplychainoverhaul/transactions" element={<Transactions />} />
    <Route path="/supplychainoverhaul/transactions/:poId" element={<TransactionDetail />} />
    <Route path="/supplychainoverhaul/documents" element={<Documents />} />
    <Route path="/supplychainoverhaul/partners" element={<Partners />} />
    <Route path="/supplychainoverhaul/partners/:partnerId" element={<PartnerDetail />} />
    <Route path="/supplychainoverhaul/reports" element={<ReportsLayout />}>
      <Route index element={<Navigate to="operations" replace />} />
      <Route path="operations" element={<OperationsToday />} />
      <Route path="sla" element={<SLACompliance />} />
      <Route path="partner-health" element={<PartnerHealth />} />
      <Route path="error-patterns" element={<ErrorPatterns />} />
      <Route path="ai-performance" element={<AIPerformance />} />
    </Route>
    <Route path="/supplychainoverhaul/_kitchen-sink" element={<KitchenSink />} />
  </>
);
