import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/layout/Navbar';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Layers,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  FolderKanban,
  ArrowRight,
  Plus,
  Flame,
  Check,
  UserCheck,
  Activity,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { issues, projects, users, openCreateModal, openIssueDetail, setFilter, setViewMode } = useApp();
  const { user, workspace } = useAuth();
  const navigate = useNavigate();

  // Current User Open Issues
  const myOpenIssues = issues.filter(
    (i) => i.assigneeId === user?.id && i.status !== 'done' && i.status !== 'canceled'
  );

  // Issues Requiring Attention: Urgent priority OR in review OR overdue
  const todayStr = new Date().toISOString().split('T')[0];
  const attentionIssues = issues.filter((i) => {
    if (i.status === 'done' || i.status === 'canceled') return false;
    const isUrgent = i.priority === 'urgent';
    const isInReview = i.status === 'in_review';
    const isOverdue = i.dueDate && i.dueDate < todayStr;
    return isUrgent || isInReview || isOverdue;
  });

  // Upcoming deadlines (issues with dueDate >= today, sorted ascending)
  const upcomingDeadlineIssues = issues
    .filter((i) => i.dueDate && i.dueDate >= todayStr && i.status !== 'done' && i.status !== 'canceled')
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
    .slice(0, 5);

  // Metrics derived from real data
  const totalOpen = issues.filter((i) => i.status !== 'done' && i.status !== 'canceled').length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length;
  const completedCount = issues.filter((i) => i.status === 'done').length;
  const urgentCount = issues.filter((i) => i.priority === 'urgent' && i.status !== 'done').length;

  const handleMetricClick = (filterType: 'status' | 'priority', value: any) => {
    setFilter(filterType, value);
    setViewMode('list');
    navigate('/issues');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="app-main">
      <Navbar />

      <div className="workspace-scroll-area dashboard-container">
        {/* Header Hero */}
        <div className="dashboard-hero-header">
          <div className="hero-text-block">
            <div className="dashboard-date-badge">
              <Calendar size={13} />
              <span>{formattedDate}</span>
              <span className="bullet-sep">•</span>
              <span>{workspace?.name || 'Workspace'}</span>
            </div>
            <h1 className="dashboard-page-title">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Engineer'}
            </h1>
            <p className="dashboard-page-subtitle">
              Here is what's happening across your active issues, team priorities, and release cycles today.
            </p>
          </div>

          <div className="hero-actions-row">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setViewMode('board');
                navigate('/issues');
              }}
            >
              <Layers size={15} />
              <span>Issue Board</span>
            </button>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus size={16} />
              <span>New Issue</span>
            </button>
          </div>
        </div>

        {/* Real-Data Interactive Metric Cards */}
        <div className="dashboard-metrics-strip">
          <div
            className="metric-card metric-interactive"
            onClick={() => handleMetricClick('status', 'all')}
            title="View all open issues"
          >
            <div className="metric-header">
              <span className="metric-title">Total Open</span>
              <Layers size={16} className="text-muted" />
            </div>
            <div className="metric-value">{totalOpen}</div>
            <div className="metric-sub">Across all projects</div>
          </div>

          <div
            className="metric-card metric-interactive"
            onClick={() => handleMetricClick('status', 'in_progress')}
            title="Filter by In Progress"
          >
            <div className="metric-header">
              <span className="metric-title">In Progress</span>
              <Activity size={16} className="text-primary" />
            </div>
            <div className="metric-value text-primary">{inProgressCount}</div>
            <div className="metric-sub">Currently underway</div>
          </div>

          <div
            className="metric-card metric-interactive"
            onClick={() => handleMetricClick('priority', 'urgent')}
            title="Filter by Urgent issues"
          >
            <div className="metric-header">
              <span className="metric-title">Urgent</span>
              <Flame size={16} className="text-destructive" />
            </div>
            <div className="metric-value text-destructive">{urgentCount}</div>
            <div className="metric-sub">Requiring swift resolution</div>
          </div>

          <div
            className="metric-card metric-interactive"
            onClick={() => handleMetricClick('status', 'done')}
            title="Filter by Done"
          >
            <div className="metric-header">
              <span className="metric-title">Completed</span>
              <CheckCircle2 size={16} className="text-emerald" />
            </div>
            <div className="metric-value text-emerald">{completedCount}</div>
            <div className="metric-sub">Resolved and shipped</div>
          </div>
        </div>

        {/* Priority 1 & 2: My Open Issues & Issues Requiring Attention */}
        <div className="dashboard-grid-dual">
          {/* Section 1: My Open Issues */}
          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div className="flex-center gap-2">
                <UserCheck size={18} className="text-primary" />
                <h2 className="section-title">My Open Issues</h2>
                <span className="counter-pill">{myOpenIssues.length}</span>
              </div>
              <button
                className="btn-link"
                onClick={() => navigate('/my-issues')}
              >
                View all <ArrowRight size={14} />
              </button>
            </div>

            {myOpenIssues.length === 0 ? (
              <div className="empty-state-compact">
                <Check size={20} className="text-emerald" />
                <p>You have no pending issues assigned to you. Great job!</p>
              </div>
            ) : (
              <div className="dashboard-issue-list">
                {myOpenIssues.slice(0, 5).map((issue) => {
                  const project = projects.find((p) => p.id === issue.projectId);
                  return (
                    <div
                      key={issue.id}
                      className="dashboard-issue-row"
                      onClick={() => openIssueDetail(issue)}
                    >
                      <div className="issue-row-main">
                        <span className="issue-id-tag">{issue.identifier}</span>
                        <span className="issue-title-text">{issue.title}</span>
                      </div>
                      <div className="issue-row-meta">
                        {project && <span className="project-sub-tag">{project.name}</span>}
                        <StatusBadge status={issue.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Issues Requiring Attention */}
          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div className="flex-center gap-2">
                <AlertTriangle size={18} className="text-warning" />
                <h2 className="section-title">Needs Attention</h2>
                <span className="counter-pill counter-pill-warn">{attentionIssues.length}</span>
              </div>
              <span className="section-caption">Urgent, In Review, or Overdue</span>
            </div>

            {attentionIssues.length === 0 ? (
              <div className="empty-state-compact">
                <CheckCircle2 size={20} className="text-emerald" />
                <p>No critical blockers or overdue issues right now.</p>
              </div>
            ) : (
              <div className="dashboard-issue-list">
                {attentionIssues.slice(0, 5).map((issue) => {
                  const assignee = users.find((u) => u.id === issue.assigneeId);
                  const isUrgent = issue.priority === 'urgent';
                  const isOverdue = issue.dueDate && issue.dueDate < todayStr;
                  return (
                    <div
                      key={issue.id}
                      className="dashboard-issue-row"
                      onClick={() => openIssueDetail(issue)}
                    >
                      <div className="issue-row-main">
                        <span className="issue-id-tag">{issue.identifier}</span>
                        <span className="issue-title-text">{issue.title}</span>
                      </div>
                      <div className="issue-row-meta">
                        {isUrgent && <span className="badge badge-urgent">Urgent</span>}
                        {isOverdue && <span className="badge badge-overdue">Overdue</span>}
                        {issue.status === 'in_review' && <span className="badge badge-review">In Review</span>}
                        {assignee && <Avatar user={assignee} size="sm" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section 3 & 4: Active Projects & Upcoming Deadlines */}
        <div className="dashboard-grid-dual">
          {/* Active Projects */}
          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div className="flex-center gap-2">
                <FolderKanban size={18} className="text-primary" />
                <h2 className="section-title">Active Projects</h2>
                <span className="counter-pill">{projects.length}</span>
              </div>
              <button className="btn-link" onClick={() => navigate('/projects')}>
                All projects <ArrowRight size={14} />
              </button>
            </div>

            <div className="dashboard-project-list">
              {projects.map((proj) => {
                const projIssues = issues.filter((i) => i.projectId === proj.id);
                const projDone = projIssues.filter((i) => i.status === 'done').length;
                const progressPct = projIssues.length > 0 ? Math.round((projDone / projIssues.length) * 100) : 0;
                const leadUser = users.find((u) => u.id === proj.leadId);

                return (
                  <div
                    key={proj.id}
                    className="dashboard-project-row"
                    onClick={() => navigate(`/projects/${proj.id}`)}
                  >
                    <div className="project-row-top">
                      <div className="flex-center gap-2">
                        <span className="project-color-dot" style={{ backgroundColor: proj.color || '#6366f1' }} />
                        <span className="project-row-name">{proj.name}</span>
                      </div>
                      <span className="project-pct-text">{progressPct}%</span>
                    </div>

                    <p className="project-row-desc">{proj.description}</p>

                    <div className="project-progress-bar-bg">
                      <div
                        className="project-progress-bar-fill"
                        style={{ width: `${progressPct}%`, backgroundColor: proj.color || '#6366f1' }}
                      />
                    </div>

                    <div className="project-row-footer">
                      <span className="text-secondary text-xs">{projIssues.length} issues total</span>
                      {leadUser && (
                        <div className="flex-center gap-1 text-xs text-muted">
                          <Avatar user={leadUser} size="xs" />
                          <span>{leadUser.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="dashboard-section-card">
            <div className="section-card-header">
              <div className="flex-center gap-2">
                <Clock size={18} className="text-primary" />
                <h2 className="section-title">Upcoming Deadlines</h2>
              </div>
              <span className="section-caption">Scheduled milestones</span>
            </div>

            {upcomingDeadlineIssues.length === 0 ? (
              <div className="empty-state-compact">
                <Calendar size={20} className="text-muted" />
                <p>No upcoming issue due dates scheduled this week.</p>
              </div>
            ) : (
              <div className="dashboard-issue-list">
                {upcomingDeadlineIssues.map((issue) => {
                  const assignee = users.find((u) => u.id === issue.assigneeId);
                  return (
                    <div
                      key={issue.id}
                      className="dashboard-issue-row"
                      onClick={() => openIssueDetail(issue)}
                    >
                      <div className="issue-row-main">
                        <span className="issue-id-tag">{issue.identifier}</span>
                        <span className="issue-title-text">{issue.title}</span>
                      </div>
                      <div className="issue-row-meta">
                        <span className="deadline-tag">
                          <Calendar size={12} />
                          {issue.dueDate}
                        </span>
                        {assignee && <Avatar user={assignee} size="sm" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Tips or Workspace Info Box */}
            <div className="dashboard-info-box mt-4">
              <div className="info-box-header">
                <span className="info-box-title">Keyboard Navigation Pro-tip</span>
              </div>
              <p className="info-box-text">
                Press <kbd>Ctrl</kbd> + <kbd>K</kbd> anywhere in LinearFlow to open the Command Palette, switch views, or search across issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
