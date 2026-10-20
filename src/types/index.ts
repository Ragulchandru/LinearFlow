export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'canceled';

export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  color?: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  color: string;
  leadId: string;
  targetDate?: string;
  progress: number;
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityItem {
  id: string;
  issueId: string;
  userId: string;
  user: User;
  action: 'created' | 'status_change' | 'priority_change' | 'assignee_change' | 'comment_added' | 'title_change' | 'description_change';
  details: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  identifier: string; // e.g. TES-1, TES-2
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  projectId: string;
  project?: Project;
  creatorId: string;
  creator: User;
  assigneeId?: string;
  assignee?: User;
  labels: string[];
  commentsCount: number;
  milestone?: string;
  dueDate?: string;
  hasLinks?: boolean;
  subIssuesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DisplayProperties {
  priority: boolean;
  id: boolean;
  status: boolean;
  labels: boolean;
  project: boolean;
  milestone: boolean;
  dueDate: boolean;
  links: boolean;
  assignee: boolean;
}

export interface DisplayConfig {
  view: 'list' | 'board';
  columns: 'status' | 'priority' | 'assignee' | 'project';
  rows: 'no_grouping' | 'priority' | 'project' | 'assignee';
  ordering: 'priority' | 'status' | 'createdAt' | 'updatedAt' | 'title';
  orderDirection: 'asc' | 'desc';
  orderCompletedByRecency: boolean;
  completedIssues: 'all' | 'past_week' | 'past_month' | 'none';
  showSubIssues: boolean;
  showEmptyColumns: boolean;
  showEmptyRows: boolean;
  displayProperties: DisplayProperties;
}

export interface FilterState {
  search: string;
  status: IssueStatus | 'all';
  priority: IssuePriority | 'all';
  assigneeId: string | 'all';
  projectId: string | 'all';
  sortBy: 'updatedAt' | 'createdAt' | 'priority' | 'status' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
