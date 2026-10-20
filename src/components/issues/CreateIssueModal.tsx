import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { IssueStatus, IssuePriority } from '../../types';
import { X, PlusCircle } from 'lucide-react';

export const CreateIssueModal: React.FC = () => {
  const {
    isCreateModalOpen,
    closeCreateModal,
    createIssue,
    projects,
    users,
    currentUser,
    filters,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>('todo');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [projectId, setProjectId] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [labelText, setLabelText] = useState('Frontend');

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreateModalOpen) {
      setTitle('');
      setDescription('');
      setStatus(filters.status !== 'all' ? filters.status : 'todo');
      setPriority('medium');
      setProjectId(filters.projectId !== 'all' ? filters.projectId : (projects[0]?.id || ''));
      setAssigneeId(currentUser.id);
      setLabelText('Engineering');
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [isCreateModalOpen, filters, projects, currentUser]);

  if (!isCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    const labels = labelText
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    createIssue({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      projectId,
      assigneeId: assigneeId || undefined,
      labels,
    });

    closeCreateModal();
  };

  return (
    <div className="modal-backdrop" onClick={closeCreateModal}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Create New Issue"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="workspace-logo-badge" style={{ width: '20px', height: '20px', fontSize: '9px' }}>
              LF
            </div>
            <span className="modal-title">New Issue</span>
          </div>
          <button onClick={closeCreateModal} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">
              Issue Title <span style={{ color: 'var(--priority-urgent)' }}>*</span>
            </label>
            <input
              ref={titleInputRef}
              type="text"
              className="form-input"
              placeholder="e.g. Migrate client cache layer to IndexedDB"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              placeholder="Add details, reproduction criteria, links, or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Project</label>
              <select
                className="form-input"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-input"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Labels (comma separated)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Frontend, Performance, Sync"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ margin: '8px -20px -20px -20px' }}>
            <button type="button" className="btn-secondary" onClick={closeCreateModal}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!title.trim()}
              style={{ opacity: title.trim() ? 1 : 0.6 }}
            >
              <PlusCircle size={14} />
              <span>Create Issue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
