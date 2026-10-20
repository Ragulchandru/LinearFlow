import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Layers,
  Clock,
  Eye,
  CheckCircle2,
  FolderKanban,
  TrendingUp,
  Activity,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import type { Project, User } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    issues,
    projects,
    users,
    openCreateModal,
    openIssueDetail,
  } = useApp();

  const navigate = useNavigate();

  // Statistics
  const totalCount = issues.length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length;
  const inReviewCount = issues.filter((i) => i.status === 'in_review').length;
  const doneCount = issues.filter((i) => i.status === 'done').length;
  const todoCount = issues.filter((i) => i.status === 'todo').length;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Recent 6 issues
  const recentIssues = [...issues]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  return (
    <div className="app-main">
      <Navbar />

      <div className="workspace-scroll-area" style={{ padding: '24px 28px', maxWidth: '1200px' }}>
        {/* Welcome Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              LinearFlow Workspace Overview
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              High-throughput issue velocity, project milestones, and real-time team throughput.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={() => navigate('/issues')}>
              <Layers size={14} />
              <span>Open Board</span>
            </button>
            <button className="btn-primary" onClick={openCreateModal}>
              <PlusCircle size={14} />
              <span>Create Issue</span>
            </button>
          </div>
        </div>

        {/* Issue Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginBottom: '28px',
          }}
        >
          <div className="dashboard-metric-card">
            <div className="metric-header">
              <span className="metric-title">Total Issues</span>
              <Layers size={15} color="var(--text-tertiary)" />
            </div>
            <div className="metric-value">{totalCount}</div>
            <div className="metric-sub">Active in workspace</div>
          </div>

          <div className="dashboard-metric-card">
            <div className="metric-header">
              <span className="metric-title">In Progress</span>
              <Clock size={15} color="#f59e0b" />
            </div>
            <div className="metric-value">{inProgressCount}</div>
            <div className="metric-sub" style={{ color: '#f59e0b' }}>Actively developing</div>
          </div>

          <div className="dashboard-metric-card">
            <div className="metric-header">
              <span className="metric-title">In Review</span>
              <Eye size={15} color="#a855f7" />
            </div>
            <div className="metric-value">{inReviewCount}</div>
            <div className="metric-sub" style={{ color: '#a855f7' }}>Awaiting PR approval</div>
          </div>

          <div className="dashboard-metric-card">
            <div className="metric-header">
              <span className="metric-title">Completed</span>
              <CheckCircle2 size={15} color="#10b981" />
            </div>
            <div className="metric-value">{doneCount}</div>
            <div className="metric-sub" style={{ color: '#10b981' }}>{completionRate}% completion rate</div>
          </div>

          <div className="dashboard-metric-card">
            <div className="metric-header">
              <span className="metric-title">Todo Queue</span>
              <TrendingUp size={15} color="#3b82f6" />
            </div>
            <div className="metric-value">{todoCount}</div>
            <div className="metric-sub">Ready to start</div>
          </div>
        </div>

        {/* Two-Column Layout: Project Summaries & Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Projects Summary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <FolderKanban size={15} color="var(--accent-primary)" />
                <span>Active Projects</span>
              </div>
              <button
                className="btn-secondary"
                onClick={() => navigate('/projects')}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                <span>All Projects</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projects.map((proj: Project) => {
                const projIssues = issues.filter((i) => i.projectId === proj.id);
                const pDone = projIssues.filter((i) => i.status === 'done').length;
                const pPercent = projIssues.length > 0 ? Math.round((pDone / projIssues.length) * 100) : 0;
                const lead = users.find((u: User) => u.id === proj.leadId);

                return (
                  <div
                    key={proj.id}
                    onClick={() => navigate(`/projects/${proj.id}`)}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-card)',
                    }}
                    className="linear-issue-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: proj.color,
                          }}
                        />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {proj.name}
                        </span>
                      </div>
                      <span className="card-identifier">{proj.key}</span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>
                      {proj.description}
                    </p>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                        <span>Progress</span>
                        <span>{pPercent}% ({pDone}/{projIssues.length} issues)</span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '5px',
                          backgroundColor: '#1b1d24',
                          borderRadius: 'var(--radius-full)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pPercent}%`,
                            height: '100%',
                            backgroundColor: proj.color,
                            borderRadius: 'var(--radius-full)',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Lead:</span>
                        <Avatar user={lead} size={18} showName />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity / Issues Stream */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                <Activity size={15} color="var(--accent-primary)" />
                <span>Recent Updates</span>
              </div>
              <button
                className="btn-secondary"
                onClick={() => navigate('/issues')}
                style={{ fontSize: '11px', padding: '3px 8px' }}
              >
                <span>View All</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentIssues.map((iss) => (
                <div
                  key={iss.id}
                  onClick={() => openIssueDetail(iss)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  className="linear-issue-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <span className="card-identifier">{iss.identifier}</span>
                    <StatusBadge status={iss.status} />
                    <span
                      style={{
                        fontSize: '12.5px',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {iss.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <Avatar user={iss.assignee} size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
