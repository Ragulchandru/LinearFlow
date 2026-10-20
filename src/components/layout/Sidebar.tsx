import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';
import {
  Inbox,
  UserCheck,
  Package,
  Layers,
  MoreHorizontal,
  CircleDot,
  FileDown,
  UserPlus,
  HelpCircle,
  Search,
  SquarePen,
  ChevronDown,
  Moon,
  Sun,
  LogOut,
  Command,
  Settings as SettingsIcon,
  User as UserIcon,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    openCommandPalette,
    openCreateModal,
    sidebarOpen,
    currentUser,
    users,
    setCurrentUser,
    addToast,
  } = useApp();

  const {
    user,
    workspace,
    workspaces,
    switchWorkspace,
    preferences,
    updatePreferences,
    signOut,
  } = useAuth();

  const navigate = useNavigate();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const wsInitials = workspace?.name
    ? workspace.name.split(' ').map((n) => n[0]).join('').substring(0, 3).toUpperCase()
    : 'TBW';

  return (
    <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Main sidebar">
      {/* Top Workspace & Quick Action Bar */}
      <div className="sidebar-top-row">
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <button
            className="sidebar-workspace-btn"
            onClick={() => setWorkspaceMenuOpen((prev) => !prev)}
            aria-label="Workspace menu"
            aria-expanded={workspaceMenuOpen}
          >
            <div className="sidebar-ws-badge">
              {wsInitials}
            </div>
            <span className="sidebar-ws-title">{workspace?.name || 'Test Blog Workspace'}</span>
            <ChevronDown size={12} color="var(--text-tertiary)" />
          </button>

          {workspaceMenuOpen && (
            <div className="sidebar-dropdown-menu" onClick={(e) => e.stopPropagation()}>
              <div className="sidebar-dropdown-label">Workspaces</div>
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className={`sidebar-dropdown-item ${ws.id === workspace?.id ? 'active' : ''}`}
                  onClick={() => {
                    switchWorkspace(ws.id);
                    setWorkspaceMenuOpen(false);
                    addToast({ title: `Switched to ${ws.name}`, type: 'info', duration: 2000 });
                  }}
                >
                  <div className="sidebar-ws-badge" style={{ width: '18px', height: '18px', fontSize: '9px' }}>
                    {ws.name.substring(0, 3).toUpperCase()}
                  </div>
                  <span>{ws.name}</span>
                </div>
              ))}
              <div
                className="sidebar-dropdown-item"
                style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '4px', paddingTop: '6px' }}
                onClick={() => {
                  setWorkspaceMenuOpen(false);
                  navigate('/settings');
                }}
              >
                <span>Workspace Settings...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Search & Compose Icons */}
        <div className="sidebar-top-actions">
          <button
            className="sidebar-action-icon-btn"
            onClick={openCommandPalette}
            title="Search (Ctrl+K)"
            aria-label="Search or command palette"
          >
            <Search size={14} />
          </button>
          <button
            className="sidebar-action-icon-btn"
            onClick={openCreateModal}
            title="New Issue (C)"
            aria-label="Create new issue"
          >
            <SquarePen size={14} />
          </button>
        </div>
      </div>

      {/* Nav List */}
      <div className="sidebar-scrollable-content">
        {/* Core Items */}
        <div className="sidebar-nav-group">
          <NavLink
            to="/inbox"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <Inbox size={14} className="sidebar-item-icon" />
            <span>Inbox</span>
          </NavLink>
          <NavLink
            to="/my-issues"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <UserCheck size={14} className="sidebar-item-icon" />
            <span>My issues</span>
          </NavLink>
        </div>

        {/* Workspace Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span>Workspace</span>
            <ChevronDown size={11} className="section-chevron" />
          </div>
          <div className="sidebar-nav-group">
            <NavLink
              to="/projects"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Package size={14} className="sidebar-item-icon" />
              <span>Projects</span>
            </NavLink>
            <NavLink
              to="/issues"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Layers size={14} className="sidebar-item-icon" />
              <span>Views</span>
            </NavLink>
            <div
              className="sidebar-item"
              onClick={() => {
                navigate('/settings');
                addToast({ title: 'Workspace options', type: 'info', duration: 1500 });
              }}
              role="button"
              tabIndex={0}
            >
              <MoreHorizontal size={14} className="sidebar-item-icon" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Your teams Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span>Your teams</span>
            <ChevronDown size={11} className="section-chevron" />
          </div>

          <div className="sidebar-team-header">
            <div className="sidebar-team-kite-icon" />
            <span className="sidebar-team-title">Test Blog Workspace</span>
            <ChevronDown size={11} color="var(--text-tertiary)" style={{ marginLeft: 'auto' }} />
          </div>

          <div className="sidebar-nav-group sub-items">
            <NavLink
              to="/issues"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <CircleDot size={13} className="sidebar-item-icon" />
              <span>Issues</span>
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Package size={13} className="sidebar-item-icon" />
              <span>Projects</span>
            </NavLink>
            <NavLink
              to="/issues"
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Layers size={13} className="sidebar-item-icon" />
              <span>Views</span>
            </NavLink>
          </div>
        </div>

        {/* Try Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span>Try</span>
            <ChevronDown size={11} className="section-chevron" />
          </div>
          <div className="sidebar-nav-group">
            <div
              className="sidebar-item"
              onClick={() => {
                addToast({
                  title: 'Import issues dialog',
                  description: 'Select Jira, GitHub, or CSV file to import.',
                  type: 'info',
                });
              }}
              role="button"
              tabIndex={0}
            >
              <FileDown size={14} className="sidebar-item-icon" />
              <span>Import issues</span>
            </div>
            <div
              className="sidebar-item"
              onClick={() => {
                addToast({
                  title: 'Invite link copied',
                  description: 'Share https://linearflow.app/invite/tbw with your team.',
                  type: 'success',
                });
              }}
              role="button"
              tabIndex={0}
            >
              <UserPlus size={14} className="sidebar-item-icon" />
              <span>Invite people</span>
            </div>
            <div
              className="sidebar-item"
              onClick={() => {
                addToast({
                  title: 'GitHub Integration',
                  description: 'Connect repository to sync PRs and commit SHAs.',
                  type: 'info',
                });
              }}
              role="button"
              tabIndex={0}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sidebar-item-icon"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>Link GitHub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer with Help icon and user switcher */}
      <div className="sidebar-bottom-row">
        <button
          className="sidebar-help-btn"
          title="Help & Support (?)"
          aria-label="Help and support"
          onClick={() => {
            addToast({
              title: 'LinearFlow Guide',
              description: 'Use Cmd+K to search, C to create, or ? for shortcuts.',
              type: 'info',
            });
          }}
        >
          <HelpCircle size={15} />
        </button>

        {/* Member profile indicator */}
        <div style={{ position: 'relative' }}>
          <div
            className="sidebar-mini-user-pill"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            role="button"
            tabIndex={0}
            title={`Active: ${user?.name || currentUser.name}`}
          >
            <div
              className="mini-avatar"
              style={{ backgroundColor: user?.color || currentUser.color || '#10b981' }}
            >
              {user?.initials || currentUser.initials || 'AM'}
            </div>
            <span className="mini-user-name">{user?.name || currentUser.name}</span>
          </div>

          {userMenuOpen && (
            <div className="sidebar-dropdown-menu user-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="user-dropdown-header">
                <div className="user-dropdown-name">{user?.name || currentUser.name}</div>
                <div className="user-dropdown-email">{user?.email || 'alex@linearflow.app'}</div>
              </div>

              <div
                className="sidebar-dropdown-item"
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/settings');
                }}
              >
                <UserIcon size={14} />
                <span>Profile</span>
              </div>

              <div
                className="sidebar-dropdown-item"
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate('/settings');
                }}
              >
                <SettingsIcon size={14} />
                <span>Account Settings</span>
              </div>

              <div
                className="sidebar-dropdown-item"
                onClick={() => {
                  const nextTheme = preferences.theme === 'dark' ? 'light' : 'dark';
                  updatePreferences({ theme: nextTheme });
                  addToast({ title: `Theme switched to ${nextTheme}`, type: 'info', duration: 1500 });
                }}
              >
                {preferences.theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                <span>Toggle {preferences.theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </div>

              <div
                className="sidebar-dropdown-item"
                onClick={() => {
                  setUserMenuOpen(false);
                  openCommandPalette();
                }}
              >
                <Command size={14} />
                <span>Keyboard Shortcuts</span>
              </div>

              <div className="sidebar-dropdown-label" style={{ marginTop: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                Switch Persona
              </div>
              {users.map((u) => (
                <div
                  key={u.id}
                  className={`sidebar-dropdown-item ${u.id === currentUser.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentUser(u);
                    setUserMenuOpen(false);
                    addToast({ title: `Switched persona to ${u.name}`, type: 'info', duration: 1500 });
                  }}
                >
                  <div
                    className="mini-avatar"
                    style={{ backgroundColor: u.color || '#3b82f6', width: '18px', height: '18px', fontSize: '9px' }}
                  >
                    {u.initials || 'U'}
                  </div>
                  <span>{u.name}</span>
                </div>
              ))}

              <div
                className="sidebar-dropdown-item text-destructive"
                style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '4px', paddingTop: '6px' }}
                onClick={() => {
                  setUserMenuOpen(false);
                  signOut();
                  addToast({ title: 'Signed out of LinearFlow', type: 'info', duration: 2000 });
                  navigate('/signin');
                }}
              >
                <LogOut size={14} />
                <span>Sign out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
