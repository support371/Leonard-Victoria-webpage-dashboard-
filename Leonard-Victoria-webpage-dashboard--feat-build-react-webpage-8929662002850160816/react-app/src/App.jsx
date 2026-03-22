import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './components/layout/PublicLayout';
import DashboardShell from './components/layout/DashboardShell';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Membership from './pages/public/Membership';
import Community from './pages/public/Community';
import Resources from './pages/public/Resources';
import Contact from './pages/public/Contact';
import PortalPreview from './pages/public/PortalPreview';

import LeonardPortal from './pages/dashboard/LeonardPortal';
import VictoriaPortal from './pages/dashboard/VictoriaPortal';
import BernardPortal from './pages/dashboard/BernardPortal';
import DeveloperPortal from './pages/dashboard/DeveloperPortal';

import ReviewCenter from './pages/modules/ReviewCenter';
import CentralRepository from './pages/modules/CentralRepository';
import LivePreview from './pages/modules/LivePreview';
import LiveStructure from './pages/modules/LiveStructure';
import LiveStatus from './pages/modules/LiveStatus';
import ActivityLogs from './pages/modules/ActivityLogs';
import Settings from './pages/modules/Settings';

import NotFound from './pages/NotFound';

const DashboardPage = ({ children, currentRole, setCurrentRole }) => (
  <DashboardShell currentRole={currentRole} setCurrentRole={setCurrentRole}>
    {children}
  </DashboardShell>
);

const App = () => {
  const [currentRole, setCurrentRole] = useState('leonard');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/membership" element={<PublicLayout><Membership /></PublicLayout>} />
        <Route path="/community" element={<PublicLayout><Community /></PublicLayout>} />
        <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/portals" element={<PublicLayout><PortalPreview /></PublicLayout>} />

        <Route path="/dashboard" element={<Navigate to="/dashboard/leonard" replace />} />

        <Route path="/dashboard/leonard" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <LeonardPortal />
          </DashboardPage>
        } />
        <Route path="/dashboard/victoria" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <VictoriaPortal />
          </DashboardPage>
        } />
        <Route path="/dashboard/bernard" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <BernardPortal />
          </DashboardPage>
        } />
        <Route path="/dashboard/developer" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <DeveloperPortal />
          </DashboardPage>
        } />

        <Route path="/dashboard/reviews" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <ReviewCenter />
          </DashboardPage>
        } />
        <Route path="/dashboard/repository" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <CentralRepository />
          </DashboardPage>
        } />
        <Route path="/dashboard/preview" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <LivePreview />
          </DashboardPage>
        } />
        <Route path="/dashboard/structure" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <LiveStructure />
          </DashboardPage>
        } />
        <Route path="/dashboard/status" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <LiveStatus />
          </DashboardPage>
        } />
        <Route path="/dashboard/activity" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <ActivityLogs />
          </DashboardPage>
        } />
        <Route path="/dashboard/settings" element={
          <DashboardPage currentRole={currentRole} setCurrentRole={setCurrentRole}>
            <Settings />
          </DashboardPage>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
