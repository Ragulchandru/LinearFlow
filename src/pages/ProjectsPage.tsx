import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Avatar } from '../components/common/Avatar';
import type { Project, Issue, User } from '../types';
import { CheckCircle2, Clock } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, issues, users } = useApp();
  const navigate = useNavigate();

  return (
    <div className="app-main">
      <Navbar title="Projects" subtitle={`${projects.length} active initiatives`} />

      <div className="workspace-scroll-area" style={{ padding: '24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {projects.map((proj: Project) => {
            const projIssues = issues.filter((i: Issue) => i.projectId === proj.id);
            const doneIssues = projIssues.filter((i: Issue) => i.status === 'done');
            const inProgressIssues = projIssues.filter((i: Issue) => i.status === 'in_progress');
            const calcProgress = projIssues.length > 0 ? Math.round((doneIssues.length / projIssues.length) * 100) : 0;
            const leadUser = users.find((u: User) => u.id === proj.leadId);

            return (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}`)}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                className="kanban-card"
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: proj.color,
                        boxShadow: `0 0 10px ${proj.color}80`,
                      }}
                    />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {proj.name}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: 'var(--bg-surface-active)',
                      color: 'var(--text-tertiary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {proj.key}
                  </span>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {proj.description}
                </p>

                {/* Progress Bar */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                      marginBottom: '6px',
                    }}
                  >
                    <span>Completion</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {calcProgress}%
                    </span>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: 'var(--bg-surface-active)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${calcProgress}%`,
                        height: '100%',
                        background: proj.color,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Meta stats & Lead */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} color="var(--status-done)" />
                      <span>{doneIssues.length} done</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} color="var(--status-in-progress)" />
                      <span>{inProgressIssues.length} active</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Lead:</span>
                    <Avatar user={leadUser} size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
