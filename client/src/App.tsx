import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Farms from './pages/Farms';
import Packhouse from './pages/Packhouse';
import ShipmentsTracker from './pages/ShipmentsTracker';
import BuyersCRM from './pages/BuyersCRM';
import ExportDocument from './pages/ExportDocument';

function App() {
  return (
    <BrowserRouter>
      {/* AnimatePresence allows components to animate out when they're removed from the React tree */}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="farms" element={<Farms />} />
            <Route path="packhouse" element={<Packhouse />} />
            <Route path="shipments" element={<ShipmentsTracker />} />
            <Route path="buyers" element={<BuyersCRM />} />
            <Route path="export-doc" element={<ExportDocument />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
