import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { IssueList } from '../components/issues/IssueList';
import { IssueBoard } from '../components/issues/IssueBoard';
import { DisplayPanel } from '../components/issues/DisplayPanel';
import type { Issue } from '../types';

export const MyIssuesPage: React.FC = () => {
  const { filteredIssues, currentUser, viewMode } = useApp();

  const myIssues = useMemo(() => {
    return filteredIssues.filter((i: Issue) => i.assigneeId === currentUser.id);
  }, [filteredIssues, currentUser]);

  return (
    <div className="app-main">
      <Navbar />
      <div className="workspace-content-relative">
        <DisplayPanel />
        <div className="workspace-scroll-area">
          {viewMode === 'list' ? (
            <IssueList issues={myIssues} />
          ) : (
            <IssueBoard issues={myIssues} />
          )}
        </div>
      </div>
    </div>
  );
};
