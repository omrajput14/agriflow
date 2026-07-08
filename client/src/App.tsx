import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Packhouse from './pages/Packhouse';
import ShipmentsTracker from './pages/ShipmentsTracker';
import BuyersCRM from './pages/BuyersCRM';
import ExportDocument from './pages/ExportDocument';
import ExportReport from './pages/ExportReport';
import MarketIntelligence from './pages/MarketIntelligence';
import QualityGrading from './pages/QualityGrading';
import RouteOptimization from './pages/RouteOptimization';
import InvestorDashboard from './pages/InvestorDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="farms" element={<Farms />} />
              <Route path="packhouse" element={<Packhouse />} />
              <Route path="shipments" element={<ShipmentsTracker />} />
              <Route path="buyers" element={<BuyersCRM />} />
              <Route path="export-doc" element={<ExportDocument />} />
              <Route path="export-report" element={<ExportReport />} />
              <Route path="market-intel" element={<MarketIntelligence />} />
              <Route path="compliance" element={<QualityGrading />} />
              <Route path="route-optimizer" element={<RouteOptimization />} />
              <Route path="investor-kpi" element={<InvestorDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
