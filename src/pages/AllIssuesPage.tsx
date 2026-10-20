import React from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { IssueList } from '../components/issues/IssueList';
import { IssueBoard } from '../components/issues/IssueBoard';
import { DisplayPanel } from '../components/issues/DisplayPanel';

export const AllIssuesPage: React.FC = () => {
  const { filteredIssues, viewMode } = useApp();

  return (
    <div className="app-main">
      <Navbar />
      <div className="workspace-content-relative">
        <DisplayPanel />
        <div className="workspace-scroll-area">
          {viewMode === 'list' ? (
            <IssueList issues={filteredIssues} />
          ) : (
            <IssueBoard issues={filteredIssues} />
          )}
        </div>
      </div>
    </div>
  );
};
