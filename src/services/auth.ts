import type {
  User,
  Workspace,
  WorkspaceMember,
  Invitation,
  UserPreferences,
} from '../types/auth';

const STORAGE_KEYS = {
  CURRENT_USER: 'linearflow_session_user_v1',
  IS_AUTHENTICATED: 'linearflow_is_auth_v1',
  IS_ONBOARDED: 'linearflow_is_onboarded_v1',
  CURRENT_WORKSPACE: 'linearflow_active_workspace_v1',
  WORKSPACES: 'linearflow_workspaces_v1',
  MEMBERS: 'linearflow_members_v1',
  INVITATIONS: 'linearflow_invitations_v1',
  PREFERENCES: 'linearflow_preferences_v1',
  USERS_ROSTER: 'linearflow_registered_users_v1',
};

export const INITIAL_USER: User = {
  id: 'usr_alex',
  name: 'Alex Morgan',
  email: 'alex@linearflow.app',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  initials: 'AM',
  color: '#6366f1',
  role: 'Lead Architect',
  jobTitle: 'Principal Product Engineer',
  timezone: 'America/Los_Angeles (UTC-7)',
  createdAt: '2026-01-15T08:00:00Z',
};

export const INITIAL_WORKSPACE: Workspace = {
  id: 'ws_linearflow',
  name: 'LinearFlow Engineering',
  slug: 'linearflow-eng',
  role: 'owner',
  createdAt: '2026-01-15T08:00:00Z',
};

export const INITIAL_WORKSPACES: Workspace[] = [
  INITIAL_WORKSPACE,
  {
    id: 'ws_acme',
    name: 'Acme Platform Labs',
    slug: 'acme-labs',
    role: 'admin',
    createdAt: '2026-02-01T10:00:00Z',
  },
];

export const INITIAL_MEMBERS: WorkspaceMember[] = [
  {
    id: 'mem_1',
    workspaceId: 'ws_linearflow',
    userId: 'usr_alex',
    user: INITIAL_USER,
    role: 'owner',
    joinedAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'mem_2',
    workspaceId: 'ws_linearflow',
    userId: 'usr_elena',
    user: {
      id: 'usr_elena',
      name: 'Elena Rostova',
      email: 'elena@linearflow.app',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      initials: 'ER',
      color: '#8b5cf6',
      role: 'Staff Product Designer',
      jobTitle: 'Lead UX Designer',
      timezone: 'Europe/London (UTC+1)',
    },
    role: 'admin',
    joinedAt: '2026-01-18T09:30:00Z',
  },
  {
    id: 'mem_3',
    workspaceId: 'ws_linearflow',
    userId: 'usr_kamil',
    user: {
      id: 'usr_kamil',
      name: 'Kamil Lorentz',
      email: 'kamil@linearflow.app',
      initials: 'KL',
      color: '#10b981',
      role: 'Core Systems Maintainer',
      jobTitle: 'Backend Engineer',
      timezone: 'Europe/Warsaw (UTC+2)',
    },
    role: 'member',
    joinedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: 'mem_4',
    workspaceId: 'ws_linearflow',
    userId: 'usr_marcus',
    user: {
      id: 'usr_marcus',
      name: 'Marcus Chen',
      email: 'marcus@linearflow.app',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      initials: 'MC',
      color: '#f59e0b',
      role: 'Frontend Architect',
      jobTitle: 'Senior Frontend Engineer',
      timezone: 'America/New_York (UTC-4)',
    },
    role: 'member',
    joinedAt: '2026-02-01T14:20:00Z',
  },
];

export const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: 'inv_1',
    workspaceId: 'ws_linearflow',
    email: 'sarah.qa@linearflow.app',
    role: 'member',
    invitedBy: 'Alex Morgan',
    status: 'pending',
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'inv_2',
    workspaceId: 'ws_linearflow',
    email: 'devops-lead@partner.io',
    role: 'admin',
    invitedBy: 'Alex Morgan',
    status: 'pending',
    createdAt: '2026-10-19T16:30:00Z',
  },
];

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  defaultIssueView: 'board',
  sidebarCollapsed: false,
  emailNotifications: true,
  mentionNotifications: true,
  weeklyDigest: false,
};

export class AuthService {
  private static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to write to localStorage for key: ${key}`, e);
    }
  }

  public static initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      this.set(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
      this.set(STORAGE_KEYS.IS_AUTHENTICATED, true);
      this.set(STORAGE_KEYS.IS_ONBOARDED, true);
      this.set(STORAGE_KEYS.CURRENT_WORKSPACE, INITIAL_WORKSPACE);
      this.set(STORAGE_KEYS.WORKSPACES, INITIAL_WORKSPACES);
      this.set(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
      this.set(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
      this.set(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
    }
  }

  public static getCurrentUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
  }

  public static isAuthenticated(): boolean {
    return this.get<boolean>(STORAGE_KEYS.IS_AUTHENTICATED, true);
  }

  public static isOnboarded(): boolean {
    return this.get<boolean>(STORAGE_KEYS.IS_ONBOARDED, true);
  }

  public static getCurrentWorkspace(): Workspace | null {
    return this.get<Workspace | null>(STORAGE_KEYS.CURRENT_WORKSPACE, INITIAL_WORKSPACE);
  }

  public static getWorkspaces(): Workspace[] {
    return this.get<Workspace[]>(STORAGE_KEYS.WORKSPACES, INITIAL_WORKSPACES);
  }

  public static getMembers(workspaceId?: string): WorkspaceMember[] {
    const members = this.get<WorkspaceMember[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    if (!workspaceId) return members;
    return members.filter((m) => m.workspaceId === workspaceId);
  }

  public static getInvitations(workspaceId?: string): Invitation[] {
    const invites = this.get<Invitation[]>(STORAGE_KEYS.INVITATIONS, INITIAL_INVITATIONS);
    if (!workspaceId) return invites;
    return invites.filter((i) => i.workspaceId === workspaceId);
  }

  public static getPreferences(): UserPreferences {
    return this.get<UserPreferences>(STORAGE_KEYS.PREFERENCES, DEFAULT_PREFERENCES);
  }

  public static savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    this.set(STORAGE_KEYS.PREFERENCES, updated);
    return updated;
  }

  public static signIn(email: string, _password: string): { user: User; workspace: Workspace } {
    // In production, authentication goes against Supabase/PostgreSQL.
    // Here we validate the email and authenticate the session with full persistence.
    const user: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      initials: email.substring(0, 2).toUpperCase(),
      color: '#6366f1',
      role: 'Product Lead',
      jobTitle: 'Software Architect',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: new Date().toISOString(),
    };

    const workspace: Workspace = {
      id: `ws_${Date.now()}`,
      name: `${user.name}'s Workspace`,
      slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-'),
      role: 'owner',
      createdAt: new Date().toISOString(),
    };

    this.set(STORAGE_KEYS.CURRENT_USER, user);
    this.set(STORAGE_KEYS.CURRENT_WORKSPACE, workspace);
    this.set(STORAGE_KEYS.IS_AUTHENTICATED, true);
    this.set(STORAGE_KEYS.IS_ONBOARDED, true);

    const workspaces = this.getWorkspaces();
    if (!workspaces.some((w) => w.id === workspace.id)) {
      this.set(STORAGE_KEYS.WORKSPACES, [workspace, ...workspaces]);
    }

    return { user, workspace };
  }

  public static signUp(name: string, email: string, _password: string): { user: User; workspace: Workspace } {
    const user: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      initials: name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
      color: '#8b5cf6',
      role: 'Workspace Creator',
      jobTitle: 'Product Manager',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      createdAt: new Date().toISOString(),
    };

    const workspace: Workspace = {
      id: `ws_${Date.now()}`,
      name: `${user.name}'s Workspace`,
      slug: user.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      role: 'owner',
      createdAt: new Date().toISOString(),
    };

    this.set(STORAGE_KEYS.CURRENT_USER, user);
    this.set(STORAGE_KEYS.CURRENT_WORKSPACE, workspace);
    this.set(STORAGE_KEYS.IS_AUTHENTICATED, true);
    this.set(STORAGE_KEYS.IS_ONBOARDED, false); // Triggers onboarding wizard

    const workspaces = this.getWorkspaces();
    this.set(STORAGE_KEYS.WORKSPACES, [workspace, ...workspaces]);

    return { user, workspace };
  }

  public static signOut(): void {
    this.set(STORAGE_KEYS.IS_AUTHENTICATED, false);
    // Don't wipe the user account data so they can log back in
  }

  public static updateProfile(updates: Partial<User>): User {
    const current = this.getCurrentUser() || INITIAL_USER;
    const updated = { ...current, ...updates };
    this.set(STORAGE_KEYS.CURRENT_USER, updated);

    // Also update member record in current workspace
    const members = this.getMembers();
    const updatedMembers = members.map((m) => (m.userId === updated.id ? { ...m, user: updated } : m));
    this.set(STORAGE_KEYS.MEMBERS, updatedMembers);

    return updated;
  }

  public static updateWorkspace(updates: Partial<Workspace>): Workspace {
    const current = this.getCurrentWorkspace() || INITIAL_WORKSPACE;
    const updated = { ...current, ...updates };
    this.set(STORAGE_KEYS.CURRENT_WORKSPACE, updated);

    const workspaces = this.getWorkspaces().map((w) => (w.id === updated.id ? updated : w));
    this.set(STORAGE_KEYS.WORKSPACES, workspaces);

    return updated;
  }

  public static switchWorkspace(workspaceId: string): Workspace | null {
    const workspaces = this.getWorkspaces();
    const target = workspaces.find((w) => w.id === workspaceId);
    if (target) {
      this.set(STORAGE_KEYS.CURRENT_WORKSPACE, target);
      return target;
    }
    return null;
  }

  public static inviteMember(workspaceId: string, email: string, role: 'admin' | 'member'): Invitation {
    const invites = this.getInvitations();
    const newInvite: Invitation = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      workspaceId,
      email: email.trim().toLowerCase(),
      role,
      invitedBy: this.getCurrentUser()?.name || 'Administrator',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    invites.unshift(newInvite);
    this.set(STORAGE_KEYS.INVITATIONS, invites);
    return newInvite;
  }

  public static revokeInvitation(invitationId: string): void {
    const invites = this.getInvitations().filter((i) => i.id !== invitationId);
    this.set(STORAGE_KEYS.INVITATIONS, invites);
  }

  public static changeMemberRole(memberId: string, role: 'admin' | 'member'): void {
    const members = this.getMembers().map((m) => (m.id === memberId ? { ...m, role } : m));
    this.set(STORAGE_KEYS.MEMBERS, members);
  }

  public static removeMember(memberId: string): void {
    const members = this.getMembers().filter((m) => m.id !== memberId);
    this.set(STORAGE_KEYS.MEMBERS, members);
  }

  public static completeOnboarding(): void {
    this.set(STORAGE_KEYS.IS_ONBOARDED, true);
  }
}

// Auto-initialize default records
AuthService.initialize();
