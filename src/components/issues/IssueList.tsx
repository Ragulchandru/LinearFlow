import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Issue, IssuePriority } from '../../types';
import {
  Circle,
  CheckCircle2,
  SignalMedium,
  SignalLow,
  SignalHigh,
  AlertCircle,
  Minus,
  User,
  PlusCircle,
} from 'lucide-react';

interface IssueListProps {
  issues: Issue[];
}

export const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  const { openIssueDetail, activeIssue, openCreateModal, displayConfig } = useApp();

  const renderPriorityIcon = (priority: IssuePriority) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle size={13} className="card-priority-icon urgent" />;
      case 'high':
        return <SignalHigh size={13} className="card-priority-icon high" />;
      case 'medium':
        return <SignalMedium size={13} className="card-priority-icon medium" />;
      case 'low':
        return <SignalLow size={13} className="card-priority-icon low" />;
      default:
        return <Minus size={13} className="card-priority-icon none" />;
    }
  };

  if (issues.length === 0) {
    return (
      <div className="linear-empty-list-container">
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          No issues in this view
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', maxWidth: '300px', textAlign: 'center' }}>
          Try clearing filters or create a new issue.
        </p>
        <button className="btn-secondary" onClick={openCreateModal} style={{ fontSize: '12px' }}>
          <PlusCircle size={13} />
          <span>New Issue</span>
        </button>
      </div>
    );
  }

  return (
    <div className="linear-list-view-table">
      {issues.map((issue) => {
        const isDone = issue.status === 'done';
        const isActive = activeIssue?.id === issue.id;

        return (
          <div
            key={issue.id}
            className={`linear-list-row ${isActive ? 'active' : ''}`}
            onClick={() => openIssueDetail(issue)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') openIssueDetail(issue);
            }}
          >
            {/* Priority */}
            {displayConfig.displayProperties.priority && (
              <div className="list-cell priority-cell">
                {renderPriorityIcon(issue.priority)}
              </div>
            )}

            {/* Identifier */}
            {displayConfig.displayProperties.id && (
              <div className="list-cell id-cell">
                <span>{issue.identifier}</span>
              </div>
            )}

            {/* Status icon */}
            {displayConfig.displayProperties.status && (
              <div className="list-cell status-cell">
                {isDone ? (
                  <CheckCircle2 size={13} className="col-status-icon done" />
                ) : (
                  <Circle size={13} className="col-status-icon todo" />
                )}
              </div>
            )}

            {/* Title */}
            <div className="list-cell title-cell">
              <span className="list-title-text">{issue.title}</span>
            </div>

            {/* Project */}
            {displayConfig.displayProperties.project && issue.project && (
              <div className="list-cell project-cell">
                <span className="card-project-tag">{issue.project.name}</span>
              </div>
            )}

            {/* Labels */}
            {displayConfig.displayProperties.labels && issue.labels?.length > 0 && (
              <div className="list-cell labels-cell">
                {issue.labels.map((l, idx) => (
                  <span key={idx} className="card-label-tag">
                    {l}
                  </span>
                ))}
              </div>
            )}

            {/* Assignee */}
            {displayConfig.displayProperties.assignee && (
              <div className="list-cell assignee-cell">
                {issue.assignee ? (
                  issue.assignee.initials ? (
                    <div
                      className="card-avatar-initials"
                      style={{ backgroundColor: issue.assignee.color || '#10b981' }}
                      title={issue.assignee.name}
                    >
                      {issue.assignee.initials}
                    </div>
                  ) : (
                    <img
                      src={issue.assignee.avatar}
                      alt={issue.assignee.name}
                      className="card-avatar-img"
                    />
                  )
                ) : (
                  <div className="card-avatar-unassigned" title="Unassigned">
                    <User size={11} color="var(--text-tertiary)" />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
