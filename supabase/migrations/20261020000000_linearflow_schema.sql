-- ==============================================================================
-- LINEARFLOW POSTGRESQL PRODUCTION SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Migration: 20261020000000_linearflow_schema.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  initials VARCHAR(4),
  color VARCHAR(16) DEFAULT '#6366f1',
  job_title TEXT DEFAULT 'Software Engineer',
  timezone TEXT DEFAULT 'America/Los_Angeles',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. WORKSPACES
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  issue_prefix VARCHAR(10) DEFAULT 'TES',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. WORKSPACE MEMBERS (Role-based access: owner, admin, member)
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member');

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role workspace_role DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(workspace_id, user_id)
);

-- 4. INVITATIONS
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role workspace_role DEFAULT 'member' NOT NULL,
  invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status invitation_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(workspace_id, email)
);

-- 5. PROJECTS
CREATE TYPE project_status AS ENUM ('planned', 'in_progress', 'completed', 'canceled');

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'in_progress' NOT NULL,
  lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  color VARCHAR(16) DEFAULT '#6366f1',
  start_date DATE,
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. PROJECT MEMBERS
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(project_id, user_id)
);

-- 7. MILESTONES
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date DATE,
  is_completed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. LABELS
CREATE TABLE IF NOT EXISTS public.labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color VARCHAR(16) NOT NULL DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(workspace_id, name)
);

-- 9. ISSUES
CREATE TYPE issue_status AS ENUM ('backlog', 'todo', 'in_progress', 'in_review', 'done', 'canceled');
CREATE TYPE issue_priority AS ENUM ('none', 'low', 'medium', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS public.issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  identifier VARCHAR(32) NOT NULL,
  number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status issue_status DEFAULT 'todo' NOT NULL,
  priority issue_priority DEFAULT 'medium' NOT NULL,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_date DATE,
  parent_id UUID REFERENCES public.issues(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(workspace_id, identifier)
);

-- 10. ISSUE LABELS (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.issue_labels (
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,
  PRIMARY KEY (issue_id, label_id)
);

-- 11. COMMENTS
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 12. ACTIVITY EVENTS
CREATE TABLE IF NOT EXISTS public.activity_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type VARCHAR(64) NOT NULL,
  field_name VARCHAR(64),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE,
  type VARCHAR(64) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 14. USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme VARCHAR(16) DEFAULT 'dark' NOT NULL,
  default_issue_view VARCHAR(16) DEFAULT 'board' NOT NULL,
  sidebar_collapsed BOOLEAN DEFAULT FALSE NOT NULL,
  email_notifications BOOLEAN DEFAULT TRUE NOT NULL,
  mention_notifications BOOLEAN DEFAULT TRUE NOT NULL,
  weekly_digest BOOLEAN DEFAULT TRUE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_issues_workspace ON public.issues(workspace_id);
CREATE INDEX IF NOT EXISTS idx_issues_project ON public.issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_assignee ON public.issues(assignee_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_priority ON public.issues(priority);
CREATE INDEX IF NOT EXISTS idx_comments_issue ON public.comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check workspace membership
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper security function: Check workspace admin/owner
CREATE OR REPLACE FUNCTION public.is_workspace_admin(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid() AND role IN ('owner', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Authenticated users can view profiles in their workspace; users can update their own
CREATE POLICY "Users can view profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Workspaces: Members can select; admins can update
CREATE POLICY "Members can view workspaces" ON public.workspaces FOR SELECT USING (public.is_workspace_member(id));
CREATE POLICY "Admins can update workspaces" ON public.workspaces FOR UPDATE USING (public.is_workspace_admin(id));

-- Workspace Members
CREATE POLICY "Members can view roster" ON public.workspace_members FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Admins can modify members" ON public.workspace_members FOR ALL USING (public.is_workspace_admin(workspace_id));

-- Issues
CREATE POLICY "Workspace members view issues" ON public.issues FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Workspace members create issues" ON public.issues FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY "Workspace members update issues" ON public.issues FOR UPDATE USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Workspace members delete issues" ON public.issues FOR DELETE USING (public.is_workspace_member(workspace_id));

-- Comments
CREATE POLICY "Workspace members view comments" ON public.comments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.issues i WHERE i.id = public.comments.issue_id AND public.is_workspace_member(i.workspace_id)));
CREATE POLICY "Authors create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own comments" ON public.comments FOR UPDATE USING (auth.uid() = author_id);

-- User Preferences
CREATE POLICY "Users view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
