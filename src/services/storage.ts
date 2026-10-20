import type {
  Issue,
  Project,
  User,
  Comment,
  ActivityItem,
  IssueStatus,
  DisplayConfig,
} from '../types';

export const USER_KAMIL: User = {
  id: 'usr_kamil',
  name: 'Kamil',
  email: 'kamil@testblog.workspace',
  initials: 'KL',
  color: '#10b981',
  role: 'Maintainer',
};

export const CURRENT_USER: User = {
  id: 'usr_1',
  name: 'Alex Morgan',
  email: 'alex@testblog.workspace',
  initials: 'AM',
  color: '#6366f1',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  role: 'Workspace Admin',
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  USER_KAMIL,
  {
    id: 'usr_2',
    name: 'Elena Rostova',
    email: 'elena@testblog.workspace',
    initials: 'ER',
    color: '#8b5cf6',
    role: 'Product Designer',
  },
  {
    id: 'usr_3',
    name: 'Marcus Chen',
    email: 'marcus@testblog.workspace',
    initials: 'MC',
    color: '#f59e0b',
    role: 'Software Engineer',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'prj_1',
    name: 'Test Blog Workspace',
    key: 'TES',
    description: 'Central engineering board for workspace onboarding, cycles, and feature tracks.',
    color: '#3b82f6',
    leadId: 'usr_1',
    targetDate: '2026-12-31',
    progress: 12,
  },
  {
    id: 'prj_2',
    name: 'Integrations & Sync',
    key: 'INT',
    description: 'GitHub, GitLab, and Slack automated webhooks and bi-directional status synchronization.',
    color: '#8b5cf6',
    leadId: 'usr_kamil',
    targetDate: '2026-11-30',
    progress: 45,
  },
];

export const DEFAULT_DISPLAY_CONFIG: DisplayConfig = {
  view: 'board',
  columns: 'status',
  rows: 'no_grouping',
  ordering: 'priority',
  orderDirection: 'desc',
  orderCompletedByRecency: false,
  completedIssues: 'all',
  showSubIssues: true,
  showEmptyColumns: false,
  showEmptyRows: false,
  displayProperties: {
    priority: true,
    id: true,
    status: true,
    labels: false,
    project: false,
    milestone: false,
    dueDate: false,
    links: false,
    assignee: true,
  },
};

// Seed content precisely matching the reference screenshot:
// Todo (8 issues): TES-1, TES-2, TES-4, TES-5, TES-3, TES-9, TES-7, TES-8
// Done (1 issue): TES-6
const INITIAL_ISSUES: Issue[] = [
  {
    id: 'iss_1',
    identifier: 'TES-1',
    title: 'Welcome to Linear 👋',
    description: 'Welcome to your new issue tracking workspace. Use command menu, keyboard shortcuts, or mouse to organize your projects.',
    status: 'todo',
    priority: 'medium',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: undefined,
    labels: ['Onboarding'],
    commentsCount: 0,
    hasLinks: true,
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'iss_2',
    identifier: 'TES-2',
    title: '3 ways to navigate Linear: Command menu, keyboard or mouse',
    description: 'Press Cmd+K or Ctrl+K to open the command menu anywhere. Press C to create issues, or G then I to go to Inbox.',
    status: 'todo',
    priority: 'medium',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: undefined,
    labels: ['Guide'],
    commentsCount: 1,
    hasLinks: true,
    createdAt: '2026-10-18T10:05:00Z',
    updatedAt: '2026-10-20T10:05:00Z',
  },
  {
    id: 'iss_4',
    identifier: 'TES-4',
    title: 'Connect GitHub or GitLab',
    description: 'Link your GitHub or GitLab repositories to automatically link PRs, automate issue closing, and sync commit SHAs.',
    status: 'todo',
    priority: 'low',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: undefined,
    labels: ['Integration'],
    commentsCount: 0,
    createdAt: '2026-10-18T10:15:00Z',
    updatedAt: '2026-10-20T10:15:00Z',
  },
  {
    id: 'iss_5',
    identifier: 'TES-5',
    title: 'Customize settings',
    description: 'Configure your notification preferences, theme tokens, team identifiers, and display configurations.',
    status: 'todo',
    priority: 'low',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: undefined,
    labels: ['Settings'],
    commentsCount: 0,
    createdAt: '2026-10-18T10:20:00Z',
    updatedAt: '2026-10-20T10:20:00Z',
  },
  {
    id: 'iss_3',
    identifier: 'TES-3',
    title: 'Connect to Slack',
    description: 'Receive real-time notifications in dedicated Slack channels when issues are created, assigned, or closed.',
    status: 'todo',
    priority: 'low',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: undefined,
    labels: ['Integration'],
    commentsCount: 0,
    createdAt: '2026-10-18T10:10:00Z',
    updatedAt: '2026-10-20T10:10:00Z',
  },
  {
    id: 'iss_9',
    identifier: 'TES-9',
    title: 'Next steps',
    description: 'Create your first custom project view, invite collaborators, and set up your initial 2-week cycle.',
    status: 'todo',
    priority: 'none',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: undefined,
    labels: ['Planning'],
    commentsCount: 0,
    createdAt: '2026-10-18T10:30:00Z',
    updatedAt: '2026-10-20T10:30:00Z',
  },
  {
    id: 'iss_7',
    identifier: 'TES-7',
    title: 'Set up custom triage workflow',
    description: 'Direct incoming bug reports and customer feedback into a triage queue for team review.',
    status: 'todo',
    priority: 'low',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: undefined,
    labels: ['Workflow'],
    commentsCount: 0,
    createdAt: '2026-10-18T10:25:00Z',
    updatedAt: '2026-10-20T10:25:00Z',
  },
  {
    id: 'iss_8',
    identifier: 'TES-8',
    title: 'Invite team members to workspace',
    description: 'Add engineers and designers to collaborate in real-time across cycles and projects.',
    status: 'todo',
    priority: 'none',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: undefined,
    labels: ['Team'],
    commentsCount: 0,
    createdAt: '2026-10-18T10:28:00Z',
    updatedAt: '2026-10-20T10:28:00Z',
  },
  {
    id: 'iss_6',
    identifier: 'TES-6',
    title: 'Use Cycles to focus work over n-weeks',
    description: 'Cycles are automated recurring timeboxes that help teams iterate with momentum without manual backlog grooming.',
    status: 'done',
    priority: 'medium',
    projectId: 'prj_1',
    creatorId: 'usr_1',
    creator: CURRENT_USER,
    assigneeId: 'usr_kamil',
    assignee: USER_KAMIL,
    labels: ['Cycles'],
    commentsCount: 2,
    createdAt: '2026-10-18T09:00:00Z',
    updatedAt: '2026-10-19T16:00:00Z',
  },
];

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'com_1',
    issueId: 'iss_6',
    userId: 'usr_kamil',
    user: USER_KAMIL,
    content: 'First cycle completed with 100% velocity target achieved.',
    createdAt: '2026-10-19T14:20:00Z',
  },
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_1',
    issueId: 'iss_6',
    userId: 'usr_kamil',
    user: USER_KAMIL,
    action: 'status_change',
    details: 'marked status as Done',
    createdAt: '2026-10-19T16:00:00Z',
  },
];

const STORAGE_KEYS = {
  ISSUES: 'linearflow_issues_v2',
  PROJECTS: 'linearflow_projects_v2',
  COMMENTS: 'linearflow_comments_v2',
  ACTIVITIES: 'linearflow_activities_v2',
  USERS: 'linearflow_users_v2',
  CURRENT_USER: 'linearflow_current_user_v2',
  DISPLAY_CONFIG: 'linearflow_display_config_v2',
  INITIALIZED: 'linearflow_initialized_v2',
};

export interface IStorageService {
  getIssues(): Issue[];
  getIssueById(id: string): Issue | undefined;
  createIssue(issue: Omit<Issue, 'id' | 'identifier' | 'commentsCount' | 'createdAt' | 'updatedAt'>): Issue;
  updateIssue(id: string, updates: Partial<Issue>, actionUser?: User): Issue;
  deleteIssue(id: string): boolean;
  getComments(issueId: string): Comment[];
  addComment(issueId: string, content: string, user: User): Comment;
  getActivities(issueId: string): ActivityItem[];
  addActivity(issueId: string, action: ActivityItem['action'], details: string, user: User): ActivityItem;
  getProjects(): Project[];
  getProjectById(id: string): Project | undefined;
  getUsers(): User[];
  getCurrentUser(): User;
  setCurrentUser(user: User): void;
  getDisplayConfig(): DisplayConfig;
  saveDisplayConfig(config: DisplayConfig): void;
  resetAll(): void;
}

class LocalStorageService implements IStorageService {
  constructor() {
    this.init();
  }

  private init() {
    try {
      const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!initialized) {
        this.resetAll();
      }
    } catch {
      // Fallback
    }
  }

  public resetAll() {
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(CURRENT_USER));
      localStorage.setItem(STORAGE_KEYS.DISPLAY_CONFIG, JSON.stringify(DEFAULT_DISPLAY_CONFIG));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } catch (e) {
      console.error('Failed to initialize localStorage', e);
    }
  }

  public getDisplayConfig(): DisplayConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISPLAY_CONFIG);
      return data ? JSON.parse(data) : DEFAULT_DISPLAY_CONFIG;
    } catch {
      return DEFAULT_DISPLAY_CONFIG;
    }
  }

  public saveDisplayConfig(config: DisplayConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DISPLAY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save display config', e);
    }
  }

  public getIssues(): Issue[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ISSUES);
      const issues: Issue[] = data ? JSON.parse(data) : INITIAL_ISSUES;
      const projects = this.getProjects();
      const users = this.getUsers();

      return issues.map((iss) => ({
        ...iss,
        project: projects.find((p) => p.id === iss.projectId),
        assignee: iss.assigneeId ? users.find((u) => u.id === iss.assigneeId) : undefined,
        creator: users.find((u) => u.id === iss.creatorId) || CURRENT_USER,
      }));
    } catch {
      return INITIAL_ISSUES;
    }
  }

  public getIssueById(id: string): Issue | undefined {
    const issues = this.getIssues();
    return issues.find((i) => i.id === id || i.identifier === id);
  }

  public createIssue(input: Omit<Issue, 'id' | 'identifier' | 'commentsCount' | 'createdAt' | 'updatedAt'>): Issue {
    const issues = this.getIssues();
    const count = issues.length + 10;
    const identifier = `TES-${count}`;
    const now = new Date().toISOString();
    const id = `iss_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newIssue: Issue = {
      ...input,
      id,
      identifier,
      commentsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    issues.unshift(newIssue);
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    } catch (e) {
      console.error('Error saving issue', e);
    }

    this.addActivity(id, 'created', `created ${identifier}`, input.creator || CURRENT_USER);
    return newIssue;
  }

  public updateIssue(id: string, updates: Partial<Issue>, actionUser: User = CURRENT_USER): Issue {
    const issues = this.getIssues();
    const index = issues.findIndex((i) => i.id === id || i.identifier === id);
    if (index === -1) {
      throw new Error(`Issue not found: ${id}`);
    }

    const current = issues[index];
    const now = new Date().toISOString();

    if (updates.status && updates.status !== current.status) {
      const formatStatus = (s: IssueStatus) => s.replace('_', ' ');
      this.addActivity(
        current.id,
        'status_change',
        `changed status from ${formatStatus(current.status)} to ${formatStatus(updates.status)}`,
        actionUser
      );
    }

    if (updates.priority && updates.priority !== current.priority) {
      this.addActivity(
        current.id,
        'priority_change',
        `updated priority to ${updates.priority}`,
        actionUser
      );
    }

    if ('assigneeId' in updates && updates.assigneeId !== current.assigneeId) {
      const users = this.getUsers();
      const newAssignee = users.find((u) => u.id === updates.assigneeId);
      this.addActivity(
        current.id,
        'assignee_change',
        newAssignee ? `assigned to ${newAssignee.name}` : 'unassigned issue',
        actionUser
      );
    }

    if (updates.title && updates.title !== current.title) {
      this.addActivity(current.id, 'title_change', `updated title`, actionUser);
    }

    const updatedIssue: Issue = {
      ...current,
      ...updates,
      updatedAt: now,
    };

    issues[index] = updatedIssue;
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    } catch (e) {
      console.error('Error updating issue', e);
    }

    return updatedIssue;
  }

  public deleteIssue(id: string): boolean {
    const issues = this.getIssues();
    const filtered = issues.filter((i) => i.id !== id && i.identifier !== id);
    if (filtered.length !== issues.length) {
      try {
        localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(filtered));
      } catch (e) {
        console.error('Error deleting issue', e);
      }
      return true;
    }
    return false;
  }

  public getComments(issueId: string): Comment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      const comments: Comment[] = data ? JSON.parse(data) : INITIAL_COMMENTS;
      return comments.filter((c) => c.issueId === issueId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } catch {
      return INITIAL_COMMENTS.filter((c) => c.issueId === issueId);
    }
  }

  public addComment(issueId: string, content: string, user: User = CURRENT_USER): Comment {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      const comments: Comment[] = data ? JSON.parse(data) : INITIAL_COMMENTS;
      const now = new Date().toISOString();
      const newComment: Comment = {
        id: `com_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        issueId,
        userId: user.id,
        user,
        content,
        createdAt: now,
      };

      comments.push(newComment);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

      const issues = this.getIssues();
      const issue = issues.find((i) => i.id === issueId);
      if (issue) {
        issue.commentsCount = (issue.commentsCount || 0) + 1;
        issue.updatedAt = now;
        localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
      }

      this.addActivity(issueId, 'comment_added', 'commented on this issue', user);
      return newComment;
    } catch (e) {
      console.error('Error adding comment', e);
      throw e;
    }
  }

  public getActivities(issueId: string): ActivityItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      const activities: ActivityItem[] = data ? JSON.parse(data) : INITIAL_ACTIVITIES;
      return activities
        .filter((a) => a.issueId === issueId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return INITIAL_ACTIVITIES.filter((a) => a.issueId === issueId);
    }
  }

  public addActivity(issueId: string, action: ActivityItem['action'], details: string, user: User = CURRENT_USER): ActivityItem {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      const activities: ActivityItem[] = data ? JSON.parse(data) : INITIAL_ACTIVITIES;
      const now = new Date().toISOString();
      const newActivity: ActivityItem = {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        issueId,
        userId: user.id,
        user,
        action,
        details,
        createdAt: now,
      };

      activities.unshift(newActivity);
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      return newActivity;
    } catch (e) {
      console.error('Error saving activity', e);
      return {
        id: `act_${Date.now()}`,
        issueId,
        userId: user.id,
        user,
        action,
        details,
        createdAt: new Date().toISOString(),
      };
    }
  }

  public getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : MOCK_PROJECTS;
    } catch {
      return MOCK_PROJECTS;
    }
  }

  public getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }

  public getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : MOCK_USERS;
    } catch {
      return MOCK_USERS;
    }
  }

  public getCurrentUser(): User {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  }

  public setCurrentUser(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to set current user', e);
    }
  }
}

export const StorageService: IStorageService = new LocalStorageService();
