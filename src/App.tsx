import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { AllIssuesPage } from './pages/AllIssuesPage';
import { MyIssuesPage } from './pages/MyIssuesPage';
import { InboxPage } from './pages/InboxPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { IssueDetailDrawer } from './components/issues/IssueDetailDrawer';
import { CreateIssueModal } from './components/issues/CreateIssueModal';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="app-container">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/issues" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/issues" element={<AllIssuesPage />} />
            <Route path="/my-issues" element={<MyIssuesPage />} />
            <Route path="/inbox" element={<InboxPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/issues" replace />} />
          </Routes>

          {/* Global Modals, Drawers & Overlays */}
          <IssueDetailDrawer />
          <CreateIssueModal />
          <CommandPalette />
          <ToastContainer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
