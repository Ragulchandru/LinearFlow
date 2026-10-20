import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import type { Issue } from '../types';
import {
  Inbox as InboxIcon,
  CheckCheck,
  Bell,
  ArrowRight,
} from 'lucide-react';

interface InboxNotification {
  id: string;
  issueId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  actionText: string;
  snippet?: string;
  time: string;
  read: boolean;
}

export const InboxPage: React.FC = () => {
  const { issues, openIssueDetail, addToast } = useApp();

  const [notifications, setNotifications] = useState<InboxNotification[]>([
    {
      id: 'notif_1',
      issueId: 'iss_1',
      authorName: 'Elena Rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      title: 'LF-101 Implement optimistic UI updates for comment submission',
      actionText: 'commented on your assigned issue:',
      snippet: '"We need to handle network failure rollback smoothly so the user sees a retry button."',
      time: '12m ago',
      read: false,
    },
    {
      id: 'notif_2',
      issueId: 'iss_2',
      authorName: 'Alex Morgan',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      title: 'LF-102 Audit WCAG AA dark-mode contrast ratios across subtle borders',
      actionText: 'escalated priority to Urgent',
      time: '1h ago',
      read: false,
    },
    {
      id: 'notif_3',
      issueId: 'iss_3',
      authorName: 'Marcus Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      title: 'LF-103 Add Ctrl+K command palette with fuzzy navigation',
      actionText: 'completed and closed issue',
      snippet: '"Shortcuts tested on Windows (Ctrl+K) and Mac (Cmd+K). Navigation is instant!"',
      time: '3h ago',
      read: false,
    },
    {
      id: 'notif_4',
      issueId: 'iss_6',
      authorName: 'Sophia Patel',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      title: 'LF-106 Resolve cursor drift during concurrent title edits',
      actionText: 'assigned an issue to you',
      time: '1d ago',
      read: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      title: 'All notifications marked as read',
      type: 'info',
    });
  };

  const handleOpenNotif = (notif: InboxNotification) => {
    // mark read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    const target = issues.find((i: Issue) => i.id === notif.issueId);
    if (target) {
      openIssueDetail(target);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="app-main">
      <Navbar title="Inbox" subtitle={`${unreadCount} unread`} />

      <div className="workspace-scroll-area" style={{ padding: '20px 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
              Activity Feed & Mentions
            </span>
          </div>

          {unreadCount > 0 && (
            <button className="btn-secondary" onClick={handleMarkAllRead} style={{ fontSize: '12px' }}>
              <CheckCheck size={14} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleOpenNotif(notif)}
              style={{
                backgroundColor: notif.read ? 'var(--bg-card)' : 'var(--bg-elevated)',
                border: notif.read ? '1px solid var(--border-subtle)' : '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                cursor: 'pointer',
                transition: 'all 0.12s ease',
                boxShadow: notif.read ? 'none' : 'var(--shadow-sm)',
              }}
              className="notification-card"
            >
              <img
                src={notif.authorAvatar}
                alt={notif.authorName}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--border-default)',
                }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{notif.authorName}</span>
                  <span style={{ color: 'var(--text-tertiary)' }}>{notif.actionText}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)', fontSize: '11px' }}>
                    {notif.time}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{notif.title}</span>
                </div>

                {notif.snippet && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginTop: '6px',
                      padding: '6px 10px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '2px solid var(--accent-primary)',
                    }}
                  >
                    {notif.snippet}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                <ArrowRight size={14} color="var(--text-tertiary)" />
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)' }}>
              <InboxIcon size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <div>All caught up! No new notifications.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
