import type {
  IssueStatus,
  IssuePriority,
  User,
  Project,
  Comment,
  ActivityItem,
  Issue,
  DisplayConfig,
  FilterState,
  Toast,
} from '../types';

export interface AppContextType {
  issues: Issue[];
  projects: Project[];
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  activeIssue: Issue | null;
  openIssueDetail: (issueOrId: string | Issue) => void;
  closeIssueDetail: () => void;
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  isDisplayPanelOpen: boolean;
  toggleDisplayPanel: () => void;
  openDisplayPanel: () => void;
  closeDisplayPanel: () => void;
  displayConfig: DisplayConfig;
  updateDisplayConfig: (updates: Partial<DisplayConfig>) => void;
  toggleDisplayProperty: (prop: keyof DisplayConfig['displayProperties']) => void;
  resetDisplayConfig: () => void;
  viewMode: 'list' | 'board';
  setViewMode: (mode: 'list' | 'board') => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  filteredIssues: Issue[];
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  createIssue: (data: {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    projectId: string;
    assigneeId?: string;
    dueDate?: string;
    labels?: string[];
  }) => Issue;
  updateIssue: (id: string, updates: Partial<Issue>) => Issue;
  deleteIssue: (id: string) => void;
  addComment: (issueId: string, content: string) => Comment;
  getComments: (issueId: string) => Comment[];
  getActivities: (issueId: string) => ActivityItem[];
  resetAllData: () => void;
}
