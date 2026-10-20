import React, { createContext, useState, useEffect, useCallback } from 'react';
import type {
  User,
  Workspace,
  WorkspaceMember,
  Invitation,
  UserPreferences,
} from '../types/auth';
import { AuthService, INITIAL_USER, INITIAL_WORKSPACE } from '../services/auth';

export interface AuthContextType {
  user: User | null;
  workspace: Workspace | null;
  workspaces: Workspace[];
  members: WorkspaceMember[];
  invitations: Invitation[];
  preferences: UserPreferences;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  completeOnboarding: (data: {
    workspaceName: string;
    workspaceSlug: string;
    jobTitle?: string;
    inviteEmails?: string[];
  }) => void;
  updateProfile: (updates: Partial<User>) => void;
  updateWorkspace: (updates: Partial<Workspace>) => void;
  switchWorkspace: (workspaceId: string) => void;
  inviteMember: (email: string, role?: 'admin' | 'member') => Invitation;
  revokeInvitation: (invitationId: string) => void;
  changeMemberRole: (memberId: string, role: 'admin' | 'member') => void;
  removeMember: (memberId: string) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => AuthService.getCurrentUser() || INITIAL_USER);
  const [workspace, setWorkspace] = useState<Workspace | null>(() => AuthService.getCurrentWorkspace() || INITIAL_WORKSPACE);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => AuthService.getWorkspaces());
  const [members, setMembers] = useState<WorkspaceMember[]>(() => AuthService.getMembers());
  const [invitations, setInvitations] = useState<Invitation[]>(() => AuthService.getInvitations());
  const [preferences, setPreferences] = useState<UserPreferences>(() => AuthService.getPreferences());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AuthService.isAuthenticated());
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => AuthService.isOnboarded());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync theme attribute to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else if (preferences.theme === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', 'light');
      }
    }
  }, [preferences.theme]);

  const refreshMembersAndInvites = useCallback((wsId?: string) => {
    const targetId = wsId || workspace?.id;
    setMembers(AuthService.getMembers(targetId));
    setInvitations(AuthService.getInvitations(targetId));
  }, [workspace?.id]);

  const signIn = async (email: string, password = ''): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (password && password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      // Simulate network latency for realistic feel
      await new Promise((r) => setTimeout(r, 400));

      const session = AuthService.signIn(email, password);
      setUser(session.user);
      setWorkspace(session.workspace);
      setWorkspaces(AuthService.getWorkspaces());
      setIsAuthenticated(true);
      setIsOnboarded(true);
      refreshMembersAndInvites(session.workspace.id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Authentication failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password = ''): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!name || name.trim().length < 2) {
        return { success: false, error: 'Please provide your full name.' };
      }
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (password && password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      await new Promise((r) => setTimeout(r, 450));

      const session = AuthService.signUp(name, email, password);
      setUser(session.user);
      setWorkspace(session.workspace);
      setWorkspaces(AuthService.getWorkspaces());
      setIsAuthenticated(true);
      setIsOnboarded(false); // Direct to onboarding
      refreshMembersAndInvites(session.workspace.id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    AuthService.signOut();
    setIsAuthenticated(false);
  };

  const completeOnboarding = ({
    workspaceName,
    workspaceSlug,
    jobTitle,
    inviteEmails,
  }: {
    workspaceName: string;
    workspaceSlug: string;
    jobTitle?: string;
    inviteEmails?: string[];
  }) => {
    if (jobTitle && user) {
      const updatedUser = AuthService.updateProfile({ jobTitle });
      setUser(updatedUser);
    }

    if (workspaceName) {
      const updatedWs = AuthService.updateWorkspace({
        name: workspaceName,
        slug: workspaceSlug || workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      });
      setWorkspace(updatedWs);
      setWorkspaces(AuthService.getWorkspaces());
    }

    if (inviteEmails && inviteEmails.length > 0 && workspace) {
      inviteEmails.forEach((email) => {
        if (email.trim()) {
          AuthService.inviteMember(workspace.id, email.trim(), 'member');
        }
      });
    }

    AuthService.completeOnboarding();
    setIsOnboarded(true);
    refreshMembersAndInvites();
  };

  const updateProfile = (updates: Partial<User>) => {
    const updated = AuthService.updateProfile(updates);
    setUser(updated);
    refreshMembersAndInvites();
  };

  const updateWorkspace = (updates: Partial<Workspace>) => {
    const updated = AuthService.updateWorkspace(updates);
    setWorkspace(updated);
    setWorkspaces(AuthService.getWorkspaces());
  };

  const switchWorkspace = (workspaceId: string) => {
    const switched = AuthService.switchWorkspace(workspaceId);
    if (switched) {
      setWorkspace(switched);
      refreshMembersAndInvites(switched.id);
    }
  };

  const inviteMember = (email: string, role: 'admin' | 'member' = 'member'): Invitation => {
    if (!workspace) throw new Error('No active workspace');
    const invite = AuthService.inviteMember(workspace.id, email, role);
    setInvitations(AuthService.getInvitations(workspace.id));
    return invite;
  };

  const revokeInvitation = (invitationId: string) => {
    AuthService.revokeInvitation(invitationId);
    if (workspace) {
      setInvitations(AuthService.getInvitations(workspace.id));
    }
  };

  const changeMemberRole = (memberId: string, role: 'admin' | 'member') => {
    AuthService.changeMemberRole(memberId, role);
    if (workspace) {
      setMembers(AuthService.getMembers(workspace.id));
    }
  };

  const removeMember = (memberId: string) => {
    AuthService.removeMember(memberId);
    if (workspace) {
      setMembers(AuthService.getMembers(workspace.id));
    }
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const updated = AuthService.savePreferences(updates);
    setPreferences(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        workspaces,
        members,
        invitations,
        preferences,
        isAuthenticated,
        isOnboarded,
        isLoading,
        signIn,
        signUp,
        signOut,
        completeOnboarding,
        updateProfile,
        updateWorkspace,
        switchWorkspace,
        inviteMember,
        revokeInvitation,
        changeMemberRole,
        removeMember,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
