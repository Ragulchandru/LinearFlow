import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Link as LinkIcon,
  PanelRight,
  SlidersHorizontal,
  Star,
  MoreHorizontal,
  FileText,
  ChevronRight,
  Filter as FilterIcon,
  X,
} from 'lucide-react';

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const {
    isDisplayPanelOpen,
    toggleDisplayPanel,
    filters,
    setFilter,
    resetFilters,
    addToast,
  } = useApp();

  const [isStarred, setIsStarred] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      title: 'Link copied to clipboard',
      type: 'info',
      duration: 2000,
    });
  };

  const hasActiveFilter = filters.search !== '' || filters.status !== 'all' || filters.priority !== 'all';

  return (
    <div className="workspace-header-container">
      {/* Top Breadcrumb and Actions Bar */}
      <header className="workspace-navbar">
        <div className="navbar-breadcrumb-area">
          <span className="breadcrumb-parent">Views</span>
          <ChevronRight size={12} color="var(--text-tertiary)" />
          <div className="breadcrumb-current">
            <FileText size={13} color="var(--text-secondary)" />
            <span>List</span>
          </div>
          <button
            className="navbar-mini-btn"
            title="More view options"
            aria-label="View options"
            onClick={() => addToast({ title: 'View settings', type: 'info', duration: 1500 })}
          >
            <MoreHorizontal size={13} />
          </button>
          <button
            className={`navbar-mini-btn ${isStarred ? 'starred' : ''}`}
            title="Favorite this view"
            aria-label="Favorite view"
            onClick={() => {
              setIsStarred((prev) => !prev);
              addToast({
                title: isStarred ? 'Removed from favorites' : 'Saved to favorites',
                type: 'info',
                duration: 1500,
              });
            }}
          >
            <Star size={13} fill={isStarred ? '#eab308' : 'none'} color={isStarred ? '#eab308' : 'currentColor'} />
          </button>
        </div>

        <div className="navbar-actions-area">
          <button
            className="navbar-icon-btn"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => addToast({ title: 'Inbox: 0 new unread mentions', type: 'info', duration: 2000 })}
          >
            <Bell size={14} />
          </button>

          <button
            className="navbar-icon-btn"
            title="Copy view link"
            aria-label="Copy view link"
            onClick={handleCopyLink}
          >
            <LinkIcon size={14} />
          </button>

          <button
            className="navbar-icon-btn"
            title="Toggle details panel"
            aria-label="Toggle details panel"
            onClick={() => addToast({ title: 'Toggled layout split', type: 'info', duration: 1500 })}
          >
            <PanelRight size={14} />
          </button>

          {/* Display Configuration Button */}
          <button
            id="display-toolbar-btn"
            className={`display-toolbar-btn ${isDisplayPanelOpen ? 'active' : ''}`}
            onClick={toggleDisplayPanel}
            aria-label="Open display settings"
            aria-expanded={isDisplayPanelOpen}
          >
            <SlidersHorizontal size={13} />
            <span>Display</span>
          </button>
        </div>
      </header>

      {/* Sub-toolbar: Filter Control */}
      <div className="workspace-filter-bar">
        <div style={{ position: 'relative' }}>
          <button
            className={`filter-toggle-btn ${hasActiveFilter ? 'active' : ''}`}
            onClick={() => setFilterMenuOpen((prev) => !prev)}
            aria-label="Filter issues"
          >
            <FilterIcon size={12} />
            <span>Filter</span>
          </button>

          {filterMenuOpen && (
            <div className="filter-dropdown-popover" onClick={(e) => e.stopPropagation()}>
              <div className="filter-popover-header">
                <span>Filter Issues</span>
                <button
                  className="btn-icon"
                  style={{ padding: '2px' }}
                  onClick={() => setFilterMenuOpen(false)}
                >
                  <X size={12} />
                </button>
              </div>

              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={filters.search}
                  onChange={(e) => setFilter('search', e.target.value)}
                  className="filter-search-input"
                  autoFocus
                />

                <div className="filter-select-group">
                  <label>Status:</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilter('status', e.target.value as any)}
                  >
                    <option value="all">All statuses</option>
                    <option value="todo">Todo</option>
                    <option value="done">Done</option>
                    <option value="in_progress">In Progress</option>
                    <option value="backlog">Backlog</option>
                  </select>
                </div>

                <div className="filter-select-group">
                  <label>Priority:</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilter('priority', e.target.value as any)}
                  >
                    <option value="all">All priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="none">None</option>
                  </select>
                </div>

                {hasActiveFilter && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      resetFilters();
                      setFilterMenuOpen(false);
                    }}
                    style={{ fontSize: '11px', padding: '4px 8px', marginTop: '4px' }}
                  >
                    Clear active filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
