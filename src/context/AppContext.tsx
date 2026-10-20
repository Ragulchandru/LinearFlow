import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Issue,
  Project,
  User,
  Comment,
  ActivityItem,
  FilterState,
  Toast,
  IssueStatus,
  IssuePriority,
  DisplayConfig,
} from '../types';
import { StorageService, DEFAULT_DISPLAY_CONFIG } from '../services/storage';

interface AppContextType {
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

const defaultFilters: FilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  assigneeId: 'all',
  projectId: 'all',
  sortBy: 'priority',
  sortOrder: 'desc',
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>(() => StorageService.getIssues());
  const [projects] = useState<Project[]>(() => StorageService.getProjects());
  const [users] = useState<User[]>(() => StorageService.getUsers());
  const [currentUser, setCurrentUserState] = useState<User>(() => StorageService.getCurrentUser());
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Open Display Panel by default to immediately match the reference screenshot!
  const [isDisplayPanelOpen, setIsDisplayPanelOpen] = useState(true);
  const [displayConfig, setDisplayConfigState] = useState<DisplayConfig>(() => StorageService.getDisplayConfig());

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const reloadIssues = useCallback(() => {
    setIssues(StorageService.getIssues());
  }, []);

  const setCurrentUser = useCallback((user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUserState(user);
    reloadIssues();
  }, [reloadIssues]);

  const updateDisplayConfig = useCallback((updates: Partial<DisplayConfig>) => {
    setDisplayConfigState((prev) => {
      const next = { ...prev, ...updates };
      StorageService.saveDisplayConfig(next);
      return next;
    });
  }, []);

  const toggleDisplayProperty = useCallback((prop: keyof DisplayConfig['displayProperties']) => {
    setDisplayConfigState((prev) => {
      const next: DisplayConfig = {
        ...prev,
        displayProperties: {
          ...prev.displayProperties,
          [prop]: !prev.displayProperties[prop],
        },
      };
      StorageService.saveDisplayConfig(next);
      return next;
    });
  }, []);

  const resetDisplayConfig = useCallback(() => {
    setDisplayConfigState(DEFAULT_DISPLAY_CONFIG);
    StorageService.saveDisplayConfig(DEFAULT_DISPLAY_CONFIG);
  }, []);

  const viewMode = displayConfig.view;
  const setViewMode = useCallback((mode: 'list' | 'board') => {
    updateDisplayConfig({ view: mode });
  }, [updateDisplayConfig]);

  const toggleDisplayPanel = useCallback(() => setIsDisplayPanelOpen((prev) => !prev), []);
  const openDisplayPanel = useCallback(() => setIsDisplayPanelOpen(true), []);
  const closeDisplayPanel = useCallback(() => setIsDisplayPanelOpen(false), []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const duration = toast.duration ?? 4000;
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const openIssueDetail = useCallback((issueOrId: string | Issue) => {
    const id = typeof issueOrId === 'string' ? issueOrId : issueOrId.id;
    setActiveIssueId(id);
  }, []);

  const closeIssueDetail = useCallback(() => {
    setActiveIssueId(null);
  }, []);

  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const openCommandPalette = useCallback(() => setIsCommandPaletteOpen(true), []);
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const createIssue = useCallback(
    (data: {
      title: string;
      description: string;
      status: IssueStatus;
      priority: IssuePriority;
      projectId: string;
      assigneeId?: string;
      labels?: string[];
    }) => {
      const created = StorageService.createIssue({
        title: data.title.trim(),
        description: data.description.trim(),
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        assigneeId: data.assigneeId || undefined,
        creatorId: currentUser.id,
        creator: currentUser,
        labels: data.labels && data.labels.length > 0 ? data.labels : ['Issue'],
      });

      reloadIssues();
      addToast({
        title: `Created ${created.identifier}`,
        description: created.title,
        type: 'success',
      });
      return created;
    },
    [currentUser, reloadIssues, addToast]
  );

  const updateIssue = useCallback(
    (id: string, updates: Partial<Issue>) => {
      const updated = StorageService.updateIssue(id, updates, currentUser);
      reloadIssues();
      addToast({
        title: `Updated ${updated.identifier}`,
        description: updates.status ? `Status changed to ${updates.status.replace('_', ' ')}` : 'Changes saved',
        type: 'info',
        duration: 2500,
      });
      return updated;
    },
    [currentUser, reloadIssues, addToast]
  );

  const deleteIssue = useCallback(
    (id: string) => {
      const target = issues.find((i) => i.id === id || i.identifier === id);
      const ident = target ? target.identifier : id;
      const success = StorageService.deleteIssue(id);
      if (success) {
        if (activeIssueId === id || (target && activeIssueId === target.id)) {
          setActiveIssueId(null);
        }
        reloadIssues();
        addToast({
          title: `Issue ${ident} deleted`,
          type: 'warning',
        });
      }
    },
    [issues, activeIssueId, reloadIssues, addToast]
  );

  const addComment = useCallback(
    (issueId: string, content: string) => {
      const comment = StorageService.addComment(issueId, content, currentUser);
      reloadIssues();
      addToast({
        title: 'Comment added',
        type: 'success',
        duration: 2500,
      });
      return comment;
    },
    [currentUser, reloadIssues, addToast]
  );

  const getComments = useCallback((issueId: string) => {
    return StorageService.getComments(issueId);
  }, []);

  const getActivities = useCallback((issueId: string) => {
    return StorageService.getActivities(issueId);
  }, []);

  const resetAllData = useCallback(() => {
    StorageService.resetAll();
    reloadIssues();
    setActiveIssueId(null);
    setFiltersState(defaultFilters);
    setDisplayConfigState(DEFAULT_DISPLAY_CONFIG);
    addToast({
      title: 'Workspace reset to default reference state',
      type: 'info',
    });
  }, [reloadIssues, addToast]);

  const activeIssue = useMemo(() => {
    if (!activeIssueId) return null;
    return issues.find((i) => i.id === activeIssueId || i.identifier === activeIssueId) || null;
  }, [activeIssueId, issues]);

  // Filtered and sorted issues taking into account DisplayConfig
  const filteredIssues = useMemo(() => {
    return issues
      .filter((issue) => {
        // Completed issues filter from DisplayConfig
        if (issue.status === 'done' || issue.status === 'canceled') {
          if (displayConfig.completedIssues === 'none') {
            return false;
          }
          if (displayConfig.completedIssues === 'past_week') {
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            if (new Date(issue.updatedAt).getTime() < weekAgo) return false;
          }
          if (displayConfig.completedIssues === 'past_month') {
            const monthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
            if (new Date(issue.updatedAt).getTime() < monthAgo) return false;
          }
        }

        // Search
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = issue.title.toLowerCase().includes(q);
          const matchIdent = issue.identifier.toLowerCase().includes(q);
          const matchDesc = issue.description?.toLowerCase().includes(q);
          const matchLabel = issue.labels?.some((l) => l.toLowerCase().includes(q));
          if (!matchTitle && !matchIdent && !matchDesc && !matchLabel) {
            return false;
          }
        }
        // Status
        if (filters.status !== 'all' && issue.status !== filters.status) {
          return false;
        }
        // Priority
        if (filters.priority !== 'all' && issue.priority !== filters.priority) {
          return false;
        }
        // Assignee
        if (filters.assigneeId !== 'all') {
          if (filters.assigneeId === 'unassigned') {
            if (issue.assigneeId) return false;
          } else if (issue.assigneeId !== filters.assigneeId) {
            return false;
          }
        }
        // Project
        if (filters.projectId !== 'all' && issue.projectId !== filters.projectId) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Ordering from displayConfig (or filters)
        const sortBy = displayConfig.ordering || filters.sortBy;
        const sortOrder = displayConfig.orderDirection || filters.sortOrder;
        const order = sortOrder === 'asc' ? 1 : -1;

        if (sortBy === 'priority') {
          const priorityWeights: Record<IssuePriority, number> = {
            urgent: 4,
            high: 3,
            medium: 2,
            low: 1,
            none: 0,
          };
          const pDiff = (priorityWeights[a.priority] - priorityWeights[b.priority]) * order;
          if (pDiff !== 0) return pDiff;
          return a.identifier.localeCompare(b.identifier);
        }
        if (sortBy === 'updatedAt') {
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * order;
        }
        if (sortBy === 'createdAt') {
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title) * order;
        }
        if (sortBy === 'status') {
          const statusOrder: Record<IssueStatus, number> = {
            todo: 5,
            in_progress: 4,
            in_review: 3,
            backlog: 2,
            done: 1,
            canceled: 0,
          };
          return (statusOrder[a.status] - statusOrder[b.status]) * order;
        }
        return 0;
      });
  }, [issues, filters, displayConfig]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setIsCreateModalOpen(true);
        return;
      }

      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          return;
        }
        if (isCreateModalOpen) {
          setIsCreateModalOpen(false);
          return;
        }
        if (activeIssueId) {
          setActiveIssueId(null);
          return;
        }
        if (isDisplayPanelOpen) {
          setIsDisplayPanelOpen(false);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, isCreateModalOpen, activeIssueId, isDisplayPanelOpen]);

  return (
    <AppContext.Provider
      value={{
        issues,
        projects,
        users,
        currentUser,
        setCurrentUser,
        activeIssue,
        openIssueDetail,
        closeIssueDetail,
        isCreateModalOpen,
        openCreateModal,
        closeCreateModal,
        isCommandPaletteOpen,
        openCommandPalette,
        closeCommandPalette,
        isDisplayPanelOpen,
        toggleDisplayPanel,
        openDisplayPanel,
        closeDisplayPanel,
        displayConfig,
        updateDisplayConfig,
        toggleDisplayProperty,
        resetDisplayConfig,
        viewMode,
        setViewMode,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        filters,
        setFilter,
        resetFilters,
        filteredIssues,
        toasts,
        addToast,
        removeToast,
        createIssue,
        updateIssue,
        deleteIssue,
        addComment,
        getComments,
        getActivities,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
