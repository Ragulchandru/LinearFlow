import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  PlusCircle,
  Inbox,
  UserCheck,
  Layers,
  FolderKanban,
  Settings,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    openCreateModal,
    issues,
    openIssueDetail,
    resetFilters,
    resetAllData,
  } = useApp();

  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Command items
  const navigationItems = [
    {
      id: 'nav-all',
      title: 'Go to All Issues',
      icon: <Layers size={16} />,
      shortcut: 'G A',
      action: () => {
        navigate('/issues');
        closeCommandPalette();
      },
    },
    {
      id: 'nav-my',
      title: 'Go to My Issues',
      icon: <UserCheck size={16} />,
      shortcut: 'G M',
      action: () => {
        navigate('/my-issues');
        closeCommandPalette();
      },
    },
    {
      id: 'nav-inbox',
      title: 'Go to Inbox',
      icon: <Inbox size={16} />,
      shortcut: 'G I',
      action: () => {
        navigate('/inbox');
        closeCommandPalette();
      },
    },
    {
      id: 'nav-projects',
      title: 'Go to Projects',
      icon: <FolderKanban size={16} />,
      shortcut: 'G P',
      action: () => {
        navigate('/projects');
        closeCommandPalette();
      },
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      icon: <Settings size={16} />,
      shortcut: 'G S',
      action: () => {
        navigate('/settings');
        closeCommandPalette();
      },
    },
  ];

  const actionItems = [
    {
      id: 'act-new',
      title: 'Create new issue',
      icon: <PlusCircle size={16} color="var(--accent-primary)" />,
      shortcut: 'C',
      action: () => {
        closeCommandPalette();
        openCreateModal();
      },
    },
    {
      id: 'act-reset-filters',
      title: 'Reset search and filters',
      icon: <SlidersHorizontal size={16} />,
      action: () => {
        resetFilters();
        closeCommandPalette();
      },
    },
    {
      id: 'act-reset-data',
      title: 'Reset workspace seed data',
      icon: <RotateCcw size={16} />,
      action: () => {
        resetAllData();
        closeCommandPalette();
      },
    },
  ];

  // Filter issues based on query
  const matchingIssues = query.trim()
    ? issues
        .filter(
          (i) =>
            i.identifier.toLowerCase().includes(query.toLowerCase()) ||
            i.title.toLowerCase().includes(query.toLowerCase()) ||
            i.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const filteredNav = navigationItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actionItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  // Combine visible items for arrow navigation
  const allSelectableItems = [
    ...matchingIssues.map((iss) => ({
      id: iss.id,
      action: () => {
        openIssueDetail(iss);
        closeCommandPalette();
      },
    })),
    ...filteredNav,
    ...filteredActions,
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allSelectableItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allSelectableItems.length) % Math.max(1, allSelectableItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allSelectableItems[selectedIndex]) {
        allSelectableItems[selectedIndex].action();
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  let currentIndex = 0;

  return (
    <div className="modal-backdrop" onClick={closeCommandPalette}>
      <div
        className="palette-dialog"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <div className="palette-search-wrapper">
          <Search size={18} color="var(--text-tertiary)" />
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
            placeholder="Type a command or search issues..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className="kbd-badge">ESC</span>
        </div>

        <div className="palette-results">
          {/* Issue Matches */}
          {matchingIssues.length > 0 && (
            <div>
              <div className="palette-section-title">Matching Issues</div>
              {matchingIssues.map((issue) => {
                const itemIndex = currentIndex++;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <div
                    key={issue.id}
                    className={`palette-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      openIssueDetail(issue);
                      closeCommandPalette();
                    }}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                  >
                    <div className="palette-item-left">
                      <StatusBadge status={issue.status} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                        {issue.identifier}
                      </span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {issue.title}
                      </span>
                    </div>
                    {issue.project && (
                      <span className="issue-project-pill">{issue.project.name}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Navigation Section */}
          {filteredNav.length > 0 && (
            <div>
              <div className="palette-section-title">Navigation</div>
              {filteredNav.map((item) => {
                const itemIndex = currentIndex++;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <div
                    key={item.id}
                    className={`palette-item ${isSelected ? 'selected' : ''}`}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                  >
                    <div className="palette-item-left">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.shortcut && <span className="palette-shortcut-badge">{item.shortcut}</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div className="palette-section-title">Actions</div>
              {filteredActions.map((item) => {
                const itemIndex = currentIndex++;
                const isSelected = selectedIndex === itemIndex;
                return (
                  <div
                    key={item.id}
                    className={`palette-item ${isSelected ? 'selected' : ''}`}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                  >
                    <div className="palette-item-left">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.shortcut && <span className="palette-shortcut-badge">{item.shortcut}</span>}
                  </div>
                );
              })}
            </div>
          )}

          {allSelectableItems.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              No commands or issues matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
