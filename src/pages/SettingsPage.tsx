import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { Avatar } from '../components/common/Avatar';
import type { User } from '../types';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Download,
  UserCheck,
  Palette,
  Database,
  Check,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    users,
    issues,
    projects,
    resetAllData,
    addToast,
  } = useApp();

  const [workspaceName, setWorkspaceName] = useState('LinearFlow');
  const [issuePrefix, setIssuePrefix] = useState('LF');
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    addToast({
      title: 'Workspace settings saved',
      type: 'success',
    });
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      workspace: { name: workspaceName, prefix: issuePrefix },
      issues,
      projects,
      users,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linearflow-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      title: 'Workspace data exported',
      description: 'Downloaded JSON backup file',
      type: 'info',
    });
  };

  return (
    <div className="app-main">
      <Navbar title="Settings" subtitle="Workspace & Preferences" />

      <div className="workspace-scroll-area" style={{ padding: '28px', maxWidth: '780px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Workspace General Config */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <SettingsIcon size={18} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Workspace Details</h2>
            </div>

            <form onSubmit={handleSaveWorkspace} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Workspace Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  style={{ maxWidth: '340px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Issue Key Prefix</label>
                <input
                  type="text"
                  className="form-input"
                  value={issuePrefix}
                  onChange={(e) => setIssuePrefix(e.target.value)}
                  style={{ maxWidth: '120px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <button type="submit" className="btn-primary" style={{ marginTop: '6px' }}>
                  {savedSettings ? <Check size={14} /> : null}
                  <span>{savedSettings ? 'Saved' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Current Profile Switcher */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <UserCheck size={18} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Active Member Persona</h2>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Switch which team member you are currently acting as. Assigned issues, activity authoring, and comments will reflect this user.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {users.map((u: User) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      addToast({
                        title: `Switched user to ${u.name}`,
                        type: 'info',
                        duration: 2000,
                      });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      backgroundColor: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <Avatar user={u} size={28} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{u.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Design System & Theme */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Palette size={18} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Design System Tokens</h2>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              LinearFlow uses custom CSS variables with WCAG AA verified contrast ratios.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ padding: '8px 12px', background: '#0c0d12', border: '1px solid var(--border-default)', borderRadius: '6px', fontSize: '11px' }}>
                --bg-app: #0c0d12
              </div>
              <div style={{ padding: '8px 12px', background: '#14161f', border: '1px solid var(--border-default)', borderRadius: '6px', fontSize: '11px' }}>
                --bg-surface: #14161f
              </div>
              <div style={{ padding: '8px 12px', background: '#5e6ad2', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                --accent-primary: #5e6ad2
              </div>
              <div style={{ padding: '8px 12px', background: '#10b981', color: '#000', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                --status-done: #10b981
              </div>
              <div style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                --priority-urgent: #ef4444
              </div>
            </div>
          </div>

          {/* Data Persistence & Reset */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Database size={18} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '15px', fontWeight: 600 }}>Data Storage & Backup</h2>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Currently storing <strong>{issues.length}</strong> issues, <strong>{projects.length}</strong> projects, and associated activity records locally.
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-secondary" onClick={handleExportData}>
                <Download size={14} />
                <span>Export JSON Backup</span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => {
                  if (window.confirm('Reset all issues, comments, and activities back to seed defaults?')) {
                    resetAllData();
                  }
                }}
                style={{ color: 'var(--priority-urgent)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <RotateCcw size={14} />
                <span>Reset to Default Seed Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
