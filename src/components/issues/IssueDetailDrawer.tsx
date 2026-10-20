import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { IssueStatus, IssuePriority, Comment, ActivityItem } from '../../types';
import { Avatar } from '../common/Avatar';
import {
  X,
  Trash2,
  Send,
  MessageSquare,
  History,
  CircleDot,
  AlertCircle,
  User as UserIcon,
  Folder,
  Clock,
  Calendar,
} from 'lucide-react';

export const IssueDetailDrawer: React.FC = () => {
  const {
    activeIssue,
    closeIssueDetail,
    updateIssue,
    deleteIssue,
    projects,
    users,
    currentUser,
    addComment,
    getComments,
    getActivities,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
  const [commentText, setCommentText] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Sync inputs with active issue
  useEffect(() => {
    if (activeIssue) {
      setTitleInput(activeIssue.title);
      setDescInput(activeIssue.description || '');
      setComments(getComments(activeIssue.id));
      setActivities(getActivities(activeIssue.id));
    }
  }, [activeIssue, getComments, getActivities]);

  if (!activeIssue) return null;

  const handleTitleBlur = () => {
    if (titleInput.trim() && titleInput !== activeIssue.title) {
      updateIssue(activeIssue.id, { title: titleInput.trim() });
    }
  };

  const handleDescBlur = () => {
    if (descInput !== activeIssue.description) {
      updateIssue(activeIssue.id, { description: descInput.trim() });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(activeIssue.id, commentText.trim());
    setCommentText('');
    setComments(getComments(activeIssue.id));
    setActivities(getActivities(activeIssue.id));
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${activeIssue.identifier}?`)) {
      deleteIssue(activeIssue.id);
    }
  };

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={closeIssueDetail} />
      <div className="detail-drawer" role="dialog" aria-modal="true" aria-label={`Issue ${activeIssue.identifier}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {activeIssue.identifier}
            </span>
            {activeIssue.project && (
              <span className="issue-project-pill">
                {activeIssue.project.name}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleDelete}
              className="btn-icon"
              title="Delete issue"
              aria-label="Delete issue"
              style={{ color: 'var(--priority-urgent)' }}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={closeIssueDetail}
              className="btn-icon"
              title="Close panel (Esc)"
              aria-label="Close detail panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="drawer-body">
          {/* Editable Title */}
          <div>
            <input
              type="text"
              className="detail-title-input"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Issue title..."
              aria-label="Issue title"
            />
          </div>

          {/* Properties Meta Grid */}
          <div className="properties-grid">
            {/* Status */}
            <div className="property-label">
              <CircleDot size={14} />
              <span>Status</span>
            </div>
            <div className="property-control">
              <select
                value={activeIssue.status}
                onChange={(e) => {
                  updateIssue(activeIssue.id, { status: e.target.value as IssueStatus });
                  setActivities(getActivities(activeIssue.id));
                }}
                aria-label="Change status"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            {/* Priority */}
            <div className="property-label">
              <AlertCircle size={14} />
              <span>Priority</span>
            </div>
            <div className="property-control">
              <select
                value={activeIssue.priority}
                onChange={(e) => {
                  updateIssue(activeIssue.id, { priority: e.target.value as IssuePriority });
                  setActivities(getActivities(activeIssue.id));
                }}
                aria-label="Change priority"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Assignee */}
            <div className="property-label">
              <UserIcon size={14} />
              <span>Assignee</span>
            </div>
            <div className="property-control">
              <select
                value={activeIssue.assigneeId || 'unassigned'}
                onChange={(e) => {
                  const val = e.target.value === 'unassigned' ? undefined : e.target.value;
                  updateIssue(activeIssue.id, { assigneeId: val });
                  setActivities(getActivities(activeIssue.id));
                }}
                aria-label="Change assignee"
              >
                <option value="unassigned">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div className="property-label">
              <Folder size={14} />
              <span>Project</span>
            </div>
            <div className="property-control">
              <select
                value={activeIssue.projectId}
                onChange={(e) => {
                  updateIssue(activeIssue.id, { projectId: e.target.value });
                  setActivities(getActivities(activeIssue.id));
                }}
                aria-label="Change project"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="property-label">
              <Calendar size={14} />
              <span>Due Date</span>
            </div>
            <div className="property-control">
              <input
                type="date"
                value={activeIssue.dueDate || ''}
                onChange={(e) => {
                  updateIssue(activeIssue.id, { dueDate: e.target.value });
                  setActivities(getActivities(activeIssue.id));
                }}
                aria-label="Change due date"
                style={{
                  backgroundColor: '#0e0f14',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  maxWidth: '220px',
                }}
              />
            </div>

            {/* Creator / Date */}
            <div className="property-label">
              <Clock size={14} />
              <span>Created</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {formatTimestamp(activeIssue.createdAt)} by {activeIssue.creator?.name || 'User'}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="detail-description-input"
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              onBlur={handleDescBlur}
              placeholder="Add detailed description, reproduction steps, or context..."
              rows={4}
            />
          </div>

          {/* Tabs for Comments & Activity */}
          <div>
            <div className="detail-section-tabs">
              <button
                className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageSquare size={14} />
                  <span>Comments ({comments.length})</span>
                </div>
              </button>
              <button
                className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={14} />
                  <span>Activity ({activities.length})</span>
                </div>
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              {activeTab === 'comments' ? (
                <div>
                  {/* Comments List */}
                  <div className="comments-stream">
                    {comments.map((c) => (
                      <div key={c.id} className="comment-card">
                        <Avatar user={c.user} size={28} />
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-author">{c.user.name}</span>
                            <span className="comment-date">{formatTimestamp(c.createdAt)}</span>
                          </div>
                          <div className="comment-text">{c.content}</div>
                        </div>
                      </div>
                    ))}

                    {comments.length === 0 && (
                      <div
                        style={{
                          padding: '24px 12px',
                          textAlign: 'center',
                          color: 'var(--text-tertiary)',
                          fontSize: '12px',
                        }}
                      >
                        No comments yet. Leave a thought or status update below.
                      </div>
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <form onSubmit={handleCommentSubmit} className="comment-input-box">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <Avatar user={currentUser} size={26} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <textarea
                          className="form-input"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          rows={2}
                          style={{ resize: 'none' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="submit"
                            className="btn-primary"
                            disabled={!commentText.trim()}
                            style={{ opacity: commentText.trim() ? 1 : 0.5 }}
                          >
                            <Send size={13} />
                            <span>Comment</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* Activity History Timeline */
                <div className="activity-timeline">
                  {activities.map((act) => (
                    <div key={act.id} className="activity-item">
                      <div className="activity-dot" />
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', marginRight: '4px' }}>
                          {act.user.name}
                        </span>
                        <span>{act.details}</span>
                        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                          {formatTimestamp(act.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {activities.length === 0 && (
                    <div style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                      No activity recorded yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
