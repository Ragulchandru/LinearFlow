import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/layout/Navbar';
import { Avatar } from '../components/common/Avatar';
import {
  User as UserIcon,
  Sliders,
  Building2,
  Users,
  Shield,
  Database,
  Check,
  Mail,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  AlertTriangle,
} from 'lucide-react';

type SettingsTab = 'profile' | 'preferences' | 'workspace' | 'members' | 'security' | 'data';

export const SettingsPage: React.FC = () => {
  const { resetAllData, addToast, issues, projects } = useApp();
  const {
    user,
    workspace,
    members,
    invitations,
    preferences,
    updateProfile,
    updateWorkspace,
    inviteMember,
    revokeInvitation,
    changeMemberRole,
    removeMember,
    updatePreferences,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileJobTitle, setProfileJobTitle] = useState(user?.jobTitle || '');
  const [profileTimezone, setProfileTimezone] = useState(
    user?.timezone || 'America/Los_Angeles (UTC-7)'
  );
  const [profileSaved, setProfileSaved] = useState(false);

  // Workspace Form State
  const [wsName, setWsName] = useState(workspace?.name || 'LinearFlow');
  const [wsSlug, setWsSlug] = useState(workspace?.slug || 'linearflow');
  const [wsSaved, setWsSaved] = useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName.trim(),
      jobTitle: profileJobTitle.trim(),
      timezone: profileTimezone,
    });
    setProfileSaved(true);
    addToast({ title: 'Profile updated successfully', type: 'success' });
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace({
      name: wsName.trim(),
      slug: wsSlug.trim().toLowerCase(),
    });
    setWsSaved(true);
    addToast({ title: 'Workspace settings saved', type: 'success' });
    setTimeout(() => setWsSaved(false), 2500);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      addToast({ title: 'Invalid email address', type: 'error' });
      return;
    }
    inviteMember(inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setIsInviteModalOpen(false);
    addToast({
      title: 'Invitation sent',
      description: `Dispatched invite to ${inviteEmail}`,
      type: 'success',
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!currentPassword) {
      setPasswordError('Please enter your existing password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    addToast({ title: 'Password changed successfully', type: 'success' });
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      workspace,
      user,
      members,
      invitations,
      issues,
      projects,
      preferences,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linearflow-backup-${workspace?.slug || 'workspace'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      title: 'Backup exported',
      description: 'Downloaded full workspace JSON state',
      type: 'info',
    });
  };

  const handleConfirmReset = () => {
    resetAllData();
    setIsResetConfirmOpen(false);
    addToast({
      title: 'Workspace reset to defaults',
      description: 'Loaded clean demo data set',
      type: 'info',
    });
  };

  return (
    <div className="app-main">
      <Navbar />

      <div className="workspace-scroll-area settings-layout-container">
        {/* Settings Navigation Sidebar */}
        <div className="settings-sidebar">
          <h2 className="settings-sidebar-title">Settings</h2>
          <nav className="settings-nav-list">
            <button
              className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <UserIcon size={16} />
              <span>Personal Profile</span>
            </button>
            <button
              className={`settings-nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <Sliders size={16} />
              <span>Preferences</span>
            </button>
            <button
              className={`settings-nav-btn ${activeTab === 'workspace' ? 'active' : ''}`}
              onClick={() => setActiveTab('workspace')}
            >
              <Building2 size={16} />
              <span>Workspace</span>
            </button>
            <button
              className={`settings-nav-btn ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <Users size={16} />
              <span>Team Members</span>
              {members.length > 0 && <span className="settings-nav-pill">{members.length}</span>}
            </button>
            <button
              className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={16} />
              <span>Security</span>
            </button>
            <button
              className={`settings-nav-btn ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              <Database size={16} />
              <span>Data & Backup</span>
            </button>
          </nav>
        </div>

        {/* Settings Content Area */}
        <div className="settings-content-pane">
          {/* 1. PERSONAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h3 className="settings-heading">Personal Profile</h3>
                <p className="settings-subtext">Manage your personal details and how you appear in issues and comments.</p>
              </div>

              <div className="profile-hero-row">
                {user ? (
                  <Avatar user={user} size="lg" />
                ) : (
                  <div className="avatar avatar-lg">AM</div>
                )}
                <div>
                  <h4 className="profile-hero-name">{user?.name}</h4>
                  <p className="profile-hero-email">{user?.email}</p>
                  <span className="role-tag-badge">Lead Architect & Workspace Owner</span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="name-input">Full Name</label>
                  <input
                    id="name-input"
                    type="text"
                    className="form-input"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email-input">Account Email</label>
                  <input
                    id="email-input"
                    type="email"
                    className="form-input form-input-disabled"
                    value={user?.email || ''}
                    disabled
                    title="Account email is tied to authentication credentials"
                  />
                  <span className="form-help-text">
                    Email address is managed via your authenticated credentials.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="title-input">Role or Job Title</label>
                  <input
                    id="title-input"
                    type="text"
                    className="form-input"
                    value={profileJobTitle}
                    onChange={(e) => setProfileJobTitle(e.target.value)}
                    placeholder="e.g. Principal Product Engineer"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="timezone-input">Time Zone</label>
                  <select
                    id="timezone-input"
                    className="form-input"
                    value={profileTimezone}
                    onChange={(e) => setProfileTimezone(e.target.value)}
                  >
                    <option value="America/Los_Angeles (UTC-7)">America/Los Angeles (UTC-7)</option>
                    <option value="America/New_York (UTC-4)">America/New York (UTC-4)</option>
                    <option value="Europe/London (UTC+1)">Europe/London (UTC+1)</option>
                    <option value="Europe/Berlin (UTC+2)">Europe/Berlin (UTC+2)</option>
                    <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9)</option>
                    <option value="Asia/Kolkata (UTC+5:30)">Asia/Kolkata (UTC+5:30)</option>
                  </select>
                </div>

                <div className="settings-form-actions">
                  <button type="submit" className="btn btn-primary">
                    {profileSaved ? (
                      <>
                        <Check size={16} /> Saved
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h3 className="settings-heading">Interface Preferences</h3>
                <p className="settings-subtext">Customize themes, view modes, and productivity shortcuts.</p>
              </div>

              <div className="settings-section-divider">
                <h4 className="settings-section-subtitle">Interface Theme</h4>
                <div className="theme-toggle-grid">
                  <button
                    type="button"
                    className={`theme-option-box ${preferences.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => updatePreferences({ theme: 'dark' })}
                  >
                    <Moon size={20} className="theme-option-icon" />
                    <span className="theme-option-name">Dark</span>
                    <span className="theme-option-desc">High contrast dark surface</span>
                  </button>

                  <button
                    type="button"
                    className={`theme-option-box ${preferences.theme === 'light' ? 'active' : ''}`}
                    onClick={() => updatePreferences({ theme: 'light' })}
                  >
                    <Sun size={20} className="theme-option-icon" />
                    <span className="theme-option-name">Light</span>
                    <span className="theme-option-desc">Crisp white paper aesthetic</span>
                  </button>

                  <button
                    type="button"
                    className={`theme-option-box ${preferences.theme === 'system' ? 'active' : ''}`}
                    onClick={() => updatePreferences({ theme: 'system' })}
                  >
                    <Laptop size={20} className="theme-option-icon" />
                    <span className="theme-option-name">System</span>
                    <span className="theme-option-desc">Sync with operating system</span>
                  </button>
                </div>
              </div>

              <div className="settings-section-divider mt-4">
                <h4 className="settings-section-subtitle">Default View Mode</h4>
                <div className="flex-center gap-4">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="defaultView"
                      checked={preferences.defaultIssueView === 'board'}
                      onChange={() => updatePreferences({ defaultIssueView: 'board' })}
                    />
                    <span>Kanban Board</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="defaultView"
                      checked={preferences.defaultIssueView === 'list'}
                      onChange={() => updatePreferences({ defaultIssueView: 'list' })}
                    />
                    <span>Dense List View</span>
                  </label>
                </div>
              </div>

              <div className="settings-section-divider mt-4">
                <h4 className="settings-section-subtitle">Keyboard Shortcuts</h4>
                <div className="shortcuts-table">
                  <div className="shortcut-row">
                    <span>Open Command Palette</span>
                    <kbd>Ctrl + K</kbd>
                  </div>
                  <div className="shortcut-row">
                    <span>Create New Issue</span>
                    <kbd>C</kbd>
                  </div>
                  <div className="shortcut-row">
                    <span>Navigate to All Issues</span>
                    <kbd>G then I</kbd>
                  </div>
                  <div className="shortcut-row">
                    <span>Navigate to Dashboard</span>
                    <kbd>G then D</kbd>
                  </div>
                  <div className="shortcut-row">
                    <span>Close Drawer / Modal</span>
                    <kbd>Esc</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. WORKSPACE SETTINGS */}
          {activeTab === 'workspace' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h3 className="settings-heading">Workspace Details</h3>
                <p className="settings-subtext">Manage organization name, URL slug, and project defaults.</p>
              </div>

              <form onSubmit={handleSaveWorkspace} className="settings-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="ws-name-input">Workspace Name</label>
                  <input
                    id="ws-name-input"
                    type="text"
                    className="form-input"
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ws-slug-input">Workspace Slug / URL</label>
                  <div className="url-slug-preview">
                    <span className="slug-prefix">linearflow.app/</span>
                    <input
                      id="ws-slug-input"
                      type="text"
                      className="slug-input"
                      value={wsSlug}
                      onChange={(e) => setWsSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    />
                  </div>
                </div>

                <div className="settings-form-actions">
                  <button type="submit" className="btn btn-primary">
                    {wsSaved ? (
                      <>
                        <Check size={16} /> Saved
                      </>
                    ) : (
                      'Save Workspace'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. TEAM MEMBERS & INVITATIONS */}
          {activeTab === 'members' && (
            <div className="settings-card">
              <div className="settings-card-header flex-between">
                <div>
                  <h3 className="settings-heading">Team Collaboration & Members</h3>
                  <p className="settings-subtext">Manage active collaborators, assigned roles, and pending invitations.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsInviteModalOpen(true)}
                >
                  <Plus size={15} /> Invite Teammate
                </button>
              </div>

              {/* Active Members Table */}
              <div className="members-table-wrapper">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Collaborator</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((mem) => {
                      const isSelf = mem.userId === user?.id;
                      return (
                        <tr key={mem.id}>
                          <td>
                            <div className="flex-center gap-2">
                              <Avatar user={mem.user} size="sm" />
                              <div>
                                <div className="member-name-text">
                                  {mem.user.name} {isSelf && <span className="text-muted">(You)</span>}
                                </div>
                                <div className="member-email-text">{mem.user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {isSelf || mem.role === 'owner' ? (
                              <span className="role-badge role-owner">{mem.role.toUpperCase()}</span>
                            ) : (
                              <select
                                className="role-select"
                                value={mem.role}
                                onChange={(e) => changeMemberRole(mem.id, e.target.value as any)}
                              >
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                              </select>
                            )}
                          </td>
                          <td className="text-secondary text-xs">
                            {new Date(mem.joinedAt).toLocaleDateString()}
                          </td>
                          <td className="text-right">
                            {!isSelf && mem.role !== 'owner' && (
                              <button
                                type="button"
                                className="btn-icon text-muted hover-destructive"
                                onClick={() => removeMember(mem.id)}
                                title="Remove member"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pending Invitations */}
              {invitations.length > 0 && (
                <div className="mt-4">
                  <h4 className="settings-section-subtitle">Pending Invitations ({invitations.length})</h4>
                  <div className="invitations-list">
                    {invitations.map((inv) => (
                      <div key={inv.id} className="invitation-row">
                        <div className="flex-center gap-2">
                          <Mail size={15} className="text-muted" />
                          <span className="invitation-email">{inv.email}</span>
                          <span className="badge badge-secondary">{inv.role}</span>
                        </div>
                        <div className="flex-center gap-2">
                          <span className="invitation-time text-xs text-muted">
                            Sent {new Date(inv.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm text-destructive"
                            onClick={() => revokeInvitation(inv.id)}
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. SECURITY */}
          {activeTab === 'security' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h3 className="settings-heading">Account Security</h3>
                <p className="settings-subtext">Manage your password, authentication sessions, and security credentials.</p>
              </div>

              {passwordError && (
                <div className="auth-alert auth-alert-error mb-3">
                  <AlertTriangle size={16} />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="settings-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="curr-pass">Current Password</label>
                  <input
                    id="curr-pass"
                    type="password"
                    className="form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="new-pass">New Password</label>
                  <input
                    id="new-pass"
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-new-pass">Confirm New Password</label>
                  <input
                    id="confirm-new-pass"
                    type="password"
                    className="form-input"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>

                <div className="settings-form-actions">
                  <button type="submit" className="btn btn-primary">
                    {passwordSaved ? (
                      <>
                        <Check size={16} /> Password Updated
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>

              <div className="settings-section-divider mt-4">
                <h4 className="settings-section-subtitle">Active Browser Sessions</h4>
                <div className="session-item-row">
                  <div>
                    <div className="session-name">This Device (Current Session)</div>
                    <div className="session-meta">Windows 11 • Chrome 134.0 • Active now</div>
                  </div>
                  <span className="badge badge-success">Online</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. DATA & BACKUP */}
          {activeTab === 'data' && (
            <div className="settings-card">
              <div className="settings-card-header">
                <h3 className="settings-heading">Data & Workspace Management</h3>
                <p className="settings-subtext">Export data snapshots, reset sample issues, or manage system persistence.</p>
              </div>

              <div className="data-action-card">
                <div>
                  <h4 className="data-action-title">Export Workspace Backup</h4>
                  <p className="data-action-desc">
                    Download a full JSON archive of all issues, comments, projects, members, and custom display views.
                  </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleExportData}>
                  <Download size={15} /> Export JSON
                </button>
              </div>

              <div className="data-action-card danger-zone mt-4">
                <div>
                  <h4 className="data-action-title text-destructive">Reset to Demo State</h4>
                  <p className="data-action-desc">
                    Re-seed the workspace with the default Linear reference dataset (9 issues, 3 active projects, and clean cycle state).
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-destructive"
                  onClick={() => setIsResetConfirmOpen(true)}
                >
                  <RotateCcw size={15} /> Reset Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3 className="modal-title">Invite New Team Member</h3>
            <p className="modal-desc">
              Send an invitation to join <strong className="text-primary">{workspace?.name}</strong>.
            </p>
            <form onSubmit={handleSendInvite} className="mt-3">
              <div className="form-group">
                <label className="form-label" htmlFor="inv-email">Teammate Email</label>
                <input
                  id="inv-email"
                  type="email"
                  className="form-input"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inv-role">Assigned Role</label>
                <select
                  id="inv-role"
                  className="form-input"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                >
                  <option value="member">Member — Can create, edit, and comment on issues</option>
                  <option value="admin">Admin — Can manage team members and workspace settings</option>
                </select>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsInviteModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="flex-center gap-2 text-destructive mb-2">
              <AlertTriangle size={24} />
              <h3 className="modal-title text-destructive">Reset Workspace Data?</h3>
            </div>
            <p className="modal-desc">
              This action will reset all issues, comments, and project statuses back to the default reference demo dataset. This action cannot be undone.
            </p>
            <div className="modal-actions-row mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-destructive"
                onClick={handleConfirmReset}
              >
                Yes, Reset Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsPage;
