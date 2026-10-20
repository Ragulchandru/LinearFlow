import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { FilterToolbar } from '../components/issues/FilterToolbar';
import { IssueList } from '../components/issues/IssueList';
import { IssueBoard } from '../components/issues/IssueBoard';
import { Avatar } from '../components/common/Avatar';
import type { Project, Issue, User } from '../types';
import { ArrowLeft } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, issues, users, viewMode } = useApp();

  const project = useMemo(() => {
    return projects.find((p: Project) => p.id === id);
  }, [projects, id]);

  const projectIssues = useMemo(() => {
    return issues.filter((i: Issue) => i.projectId === id);
  }, [issues, id]);

  const doneCount = projectIssues.filter((i: Issue) => i.status === 'done').length;
  const progressPercent = projectIssues.length > 0 ? Math.round((doneCount / projectIssues.length) * 100) : 0;
  const leadUser = users.find((u: User) => u.id === project?.leadId);

  if (!project) {
    return (
      <div className="app-main" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Project not found</h2>
        <button className="btn-secondary" onClick={() => navigate('/projects')} style={{ marginTop: '16px' }}>
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="app-main">
      <Navbar title={project.name} subtitle={project.key} />

      {/* Project Overview Header Banner */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            className="btn-secondary"
            onClick={() => navigate('/projects')}
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            <ArrowLeft size={13} />
            <span>All Projects</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>Lead:</span>
            <Avatar user={leadUser} size={20} showName />
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {project.description}
        </p>

        {/* Progress summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              flex: 1,
              height: '6px',
              backgroundColor: 'var(--bg-surface-active)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: project.color,
                borderRadius: 'var(--radius-full)',
              }}
            />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
            {progressPercent}% Complete ({doneCount}/{projectIssues.length} issues)
          </span>
        </div>
      </div>

      <FilterToolbar />

      <div className="workspace-scroll-area">
        {viewMode === 'list' ? (
          <IssueList issues={projectIssues} />
        ) : (
          <IssueBoard issues={projectIssues} />
        )}
      </div>
    </div>
  );
};
