import React from 'react';
import { useApp } from '../../context/AppContext';
import type { IssuePriority, IssueStatus } from '../../types';
import {
  Search,
  ArrowUpDown,
  CircleDot,
  AlertCircle,
  User as UserIcon,
  Folder,
} from 'lucide-react';

export const FilterToolbar: React.FC = () => {
  const { filters, setFilter, projects, users } = useApp();

  return (
    <div className="filter-toolbar">
      <div className="filter-group">
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '4px 10px',
            minWidth: '200px',
          }}
        >
          <Search size={14} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Filter issues..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            style={{ fontSize: '12px', width: '100%' }}
          />
        </div>

        {/* Status Filter */}
        <div className="filter-chip-select">
          <CircleDot size={13} color="var(--text-tertiary)" />
          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value as IssueStatus | 'all')}
            aria-label="Filter by status"
          >
            <option value="all">Status: All</option>
            <option value="backlog">Backlog</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-chip-select">
          <AlertCircle size={13} color="var(--text-tertiary)" />
          <select
            value={filters.priority}
            onChange={(e) => setFilter('priority', e.target.value as IssuePriority | 'all')}
            aria-label="Filter by priority"
          >
            <option value="all">Priority: All</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="filter-chip-select">
          <UserIcon size={13} color="var(--text-tertiary)" />
          <select
            value={filters.assigneeId}
            onChange={(e) => setFilter('assigneeId', e.target.value)}
            aria-label="Filter by assignee"
          >
            <option value="all">Assignee: All</option>
            <option value="unassigned">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Project Filter */}
        <div className="filter-chip-select">
          <Folder size={13} color="var(--text-tertiary)" />
          <select
            value={filters.projectId}
            onChange={(e) => setFilter('projectId', e.target.value)}
            aria-label="Filter by project"
          >
            <option value="all">Project: All</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="filter-group">
        <div className="filter-chip-select">
          <ArrowUpDown size={13} color="var(--text-tertiary)" />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value as any)}
            aria-label="Sort by"
          >
            <option value="updatedAt">Sort: Updated</option>
            <option value="createdAt">Sort: Created</option>
            <option value="priority">Sort: Priority</option>
            <option value="status">Sort: Status</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>

        <button
          className="btn-icon"
          onClick={() => setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
          title={`Order: ${filters.sortOrder.toUpperCase()}`}
          style={{ padding: '5px 8px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}
        >
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            {filters.sortOrder === 'asc' ? 'ASC' : 'DESC'}
          </span>
        </button>
      </div>
    </div>
  );
};
