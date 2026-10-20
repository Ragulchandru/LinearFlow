import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Issue, IssueStatus, IssuePriority } from '../../types';
import {
  Circle,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  SignalMedium,
  SignalLow,
  SignalHigh,
  AlertCircle,
  Minus,
  FileText,
  User,
} from 'lucide-react';

interface IssueBoardProps {
  issues: Issue[];
}

export const IssueBoard: React.FC<IssueBoardProps> = ({ issues }) => {
  const {
    openIssueDetail,
    updateIssue,
    openCreateModal,
    displayConfig,
    setFilter,
  } = useApp();

  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);

  // Group columns according to displayConfig.columns
  // By default: 'status' (Todo, Done, In Progress, Backlog)
  const columns: { key: IssueStatus; label: string; icon: React.ReactNode; showAllTag?: boolean }[] = [
    {
      key: 'todo',
      label: 'Todo',
      icon: <Circle size={14} className="col-status-icon todo" />,
    },
    {
      key: 'done',
      label: 'Done',
      icon: <CheckCircle2 size={14} className="col-status-icon done" />,
      showAllTag: true,
    },
    ...(displayConfig.showEmptyColumns || issues.some((i) => i.status === 'in_progress')
      ? [
          {
            key: 'in_progress' as IssueStatus,
            label: 'In Progress',
            icon: <Circle size={14} className="col-status-icon in_progress" />,
          },
        ]
      : []),
    ...(displayConfig.showEmptyColumns || issues.some((i) => i.status === 'backlog')
      ? [
          {
            key: 'backlog' as IssueStatus,
            label: 'Backlog',
            icon: <Circle size={14} className="col-status-icon backlog" />,
          },
        ]
      : []),
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedIssueId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: IssueStatus) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    if (issueId) {
      updateIssue(issueId, { status: targetStatus });
    }
    setDraggedIssueId(null);
  };

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

  return (
    <div className="linear-board-container">
      {/* Board Columns Area */}
      <div className="board-columns-scrollable">
        {columns.map((col) => {
          const colIssues = issues.filter((i) => i.status === col.key);

          return (
            <div
              key={col.key}
              className="linear-board-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key)}
            >
              {/* Column Header */}
              <div className="linear-column-header">
                <div className="col-header-left">
                  {col.icon}
                  <span className="col-header-label">{col.label}</span>
                  <span className="col-header-count">{colIssues.length}</span>
                  {col.showAllTag && <span className="col-header-all-tag">All</span>}
                </div>

                <div className="col-header-actions">
                  <button
                    className="col-action-btn"
                    title="Column options"
                    aria-label={`${col.label} column options`}
                  >
                    <MoreHorizontal size={13} />
                  </button>
                  <button
                    className="col-action-btn"
                    onClick={() => {
                      setFilter('status', col.key);
                      openCreateModal();
                    }}
                    title={`Add issue to ${col.label}`}
                    aria-label={`Add issue to ${col.label}`}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Card List in Column */}
              <div className="linear-column-cards">
                {colIssues.map((issue) => {
                  const isDone = issue.status === 'done';

                  return (
                    <div
                      key={issue.id}
                      className={`linear-issue-card ${isDone ? 'is-done' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, issue.id)}
                      onClick={() => openIssueDetail(issue)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') openIssueDetail(issue);
                      }}
                    >
                      {/* ID row */}
                      {displayConfig.displayProperties.id && (
                        <div className="card-id-row">
                          <span className="card-identifier">{issue.identifier}</span>
                        </div>
                      )}

                      {/* Title & Status indicator */}
                      <div className="card-title-row">
                        {displayConfig.displayProperties.status && (
                          <div className="card-status-dot">
                            {isDone ? (
                              <CheckCircle2 size={13} className="col-status-icon done" />
                            ) : (
                              <Circle size={13} className="col-status-icon todo" />
                            )}
                          </div>
                        )}
                        <span className="card-title-text">{issue.title}</span>
                      </div>

                      {/* Labels (if configured) */}
                      {displayConfig.displayProperties.labels && issue.labels?.length > 0 && (
                        <div className="card-labels-row">
                          {issue.labels.map((l, idx) => (
                            <span key={idx} className="card-label-tag">
                              {l}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Project (if configured) */}
                      {displayConfig.displayProperties.project && issue.project && (
                        <div className="card-project-tag">
                          {issue.project.name}
                        </div>
                      )}

                      {/* Card Bottom Meta Bar: Priority on left, Assignee on right */}
                      <div className="card-bottom-bar">
                        {displayConfig.displayProperties.priority ? (
                          <div className="card-priority-wrapper">
                            {renderPriorityIcon(issue.priority)}
                          </div>
                        ) : (
                          <div />
                        )}

                        {displayConfig.displayProperties.assignee && (
                          <div className="card-assignee-wrapper">
                            {issue.assignee ? (
                              issue.assignee.initials ? (
                                <div
                                  className="card-avatar-initials"
                                  style={{
                                    backgroundColor: issue.assignee.color || '#10b981',
                                  }}
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
                    </div>
                  );
                })}

                {colIssues.length === 0 && (
                  <div className="linear-empty-column-placeholder">
                    No issues in {col.label.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Adjacent Right Side Context (visible behind floating Display panel as in reference) */}
        <div className="board-adjacent-sidebar">
          <div className="adjacent-header">
            <FileText size={13} color="var(--text-secondary)" />
            <span>List</span>
          </div>
          <div className="adjacent-rows">
            <div className="adjacent-row">
              <span className="adjacent-label">Visibility</span>
              <span className="adjacent-value">Workspace</span>
            </div>
            <div className="adjacent-row">
              <span className="adjacent-label">Owner</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="mini-avatar" style={{ backgroundColor: '#10b981', width: '16px', height: '16px', fontSize: '8px' }}>
                  KL
                </div>
                <span className="adjacent-value">kamil</span>
              </div>
            </div>
            <div className="adjacent-row">
              <span className="adjacent-label">Assignee</span>
              <span className="adjacent-value" style={{ color: 'var(--text-tertiary)' }}>No assignee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
