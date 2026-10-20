export type WorkspaceRole = 'owner' | 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  color?: string;
  role?: string;
  jobTitle?: string;
  timezone?: string;
  createdAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  role: WorkspaceRole;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  user: User;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'member';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  defaultIssueView: 'board' | 'list';
  sidebarCollapsed: boolean;
  emailNotifications: boolean;
  mentionNotifications: boolean;
  weeklyDigest: boolean;
}
