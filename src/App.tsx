import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/layout/Sidebar';
import { AllIssuesPage } from './pages/AllIssuesPage';
import { MyIssuesPage } from './pages/MyIssuesPage';
import { InboxPage } from './pages/InboxPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { IssueDetailDrawer } from './components/issues/IssueDetailDrawer';
import { CreateIssueModal } from './components/issues/CreateIssueModal';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';

// Protected App Layout Shell
const ProtectedShell: React.FC = () => {
  const { isAuthenticated, isOnboarded } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!isOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="/dashboard" element={<Navigate to="/issues" replace />} />
        <Route path="/issues" element={<AllIssuesPage />} />
        <Route path="/my-issues" element={<MyIssuesPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/issues" replace />} />
      </Routes>

      {/* Global Overlays */}
      <IssueDetailDrawer />
      <CreateIssueModal />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};

// Route Dispatcher
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isOnboarded } = useAuth();

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/signin"
        element={
          isAuthenticated ? (
            <Navigate to={isOnboarded ? '/issues' : '/onboarding'} replace />
          ) : (
            <SignInPage />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to={isOnboarded ? '/issues' : '/onboarding'} replace />
          ) : (
            <SignUpPage />
          )
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* First-Time Guided Onboarding */}
      <Route
        path="/onboarding"
        element={
          !isAuthenticated ? (
            <Navigate to="/signin" replace />
          ) : isOnboarded ? (
            <Navigate to="/issues" replace />
          ) : (
            <OnboardingPage />
          )
        }
      />

      {/* Authenticated Workspace Application Shell */}
      <Route path="/*" element={<ProtectedShell />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
