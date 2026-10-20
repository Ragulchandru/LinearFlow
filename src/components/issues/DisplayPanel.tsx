import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutList,
  Kanban,
  Columns as ColumnsIcon,
  Rows as RowsIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const DisplayPanel: React.FC = () => {
  const {
    isDisplayPanelOpen,
    closeDisplayPanel,
    displayConfig,
    updateDisplayConfig,
    toggleDisplayProperty,
    resetDisplayConfig,
    addToast,
  } = useApp();

  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // Check if the click target is the display button itself
        const displayBtn = document.getElementById('display-toolbar-btn');
        if (displayBtn && displayBtn.contains(e.target as Node)) {
          return;
        }
        closeDisplayPanel();
      }
    };

    if (isDisplayPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDisplayPanelOpen, closeDisplayPanel]);

  if (!isDisplayPanelOpen) return null;

  const handleSetDefault = () => {
    addToast({
      title: 'Display settings saved as workspace default',
      type: 'success',
      duration: 3000,
    });
  };

  return (
    <div
      ref={panelRef}
      className="display-config-panel"
      role="dialog"
      aria-label="Display configuration panel"
      onClick={(e) => e.stopPropagation()}
    >
      {/* View Segmented Switcher */}
      <div className="display-segmented-control">
        <button
          className={`segmented-tab ${displayConfig.view === 'list' ? 'active' : ''}`}
          onClick={() => updateDisplayConfig({ view: 'list' })}
          aria-label="List view"
        >
          <LayoutList size={14} />
          <span>List</span>
        </button>
        <button
          className={`segmented-tab ${displayConfig.view === 'board' ? 'active' : ''}`}
          onClick={() => updateDisplayConfig({ view: 'board' })}
          aria-label="Board view"
        >
          <Kanban size={14} />
          <span>Board</span>
        </button>
      </div>

      {/* Main Settings List */}
      <div className="display-settings-rows">
        {/* Columns */}
        <div className="display-row">
          <div className="display-row-left">
            <ColumnsIcon size={14} className="display-row-icon" />
            <span>Columns</span>
          </div>
          <select
            className="display-select"
            value={displayConfig.columns}
            onChange={(e) => updateDisplayConfig({ columns: e.target.value as any })}
            aria-label="Group columns by"
          >
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="assignee">Assignee</option>
            <option value="project">Project</option>
          </select>
        </div>

        {/* Rows */}
        <div className="display-row">
          <div className="display-row-left">
            <RowsIcon size={14} className="display-row-icon" />
            <span>Rows</span>
          </div>
          <select
            className="display-select"
            value={displayConfig.rows}
            onChange={(e) => updateDisplayConfig({ rows: e.target.value as any })}
            aria-label="Group rows by"
          >
            <option value="no_grouping">No grouping</option>
            <option value="priority">Priority</option>
            <option value="project">Project</option>
            <option value="assignee">Assignee</option>
          </select>
        </div>

        {/* Ordering */}
        <div className="display-row">
          <div className="display-row-left">
            <ArrowUpDown size={14} className="display-row-icon" />
            <span>Ordering</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <select
              className="display-select"
              value={displayConfig.ordering}
              onChange={(e) => updateDisplayConfig({ ordering: e.target.value as any })}
              aria-label="Order by"
            >
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="createdAt">Created date</option>
              <option value="updatedAt">Updated date</option>
              <option value="title">Title</option>
            </select>
            <button
              className="display-sort-dir-btn"
              onClick={() =>
                updateDisplayConfig({
                  orderDirection: displayConfig.orderDirection === 'asc' ? 'desc' : 'asc',
                })
              }
              title={`Direction: ${displayConfig.orderDirection.toUpperCase()}`}
              aria-label="Toggle sort direction"
            >
              {displayConfig.orderDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            </button>
          </div>
        </div>

        {/* Order completed by recency */}
        <div className="display-row">
          <div className="display-row-left">
            <span>Order completed by recency</span>
          </div>
          <label className="linear-switch">
            <input
              type="checkbox"
              checked={displayConfig.orderCompletedByRecency}
              onChange={(e) => updateDisplayConfig({ orderCompletedByRecency: e.target.checked })}
              aria-label="Order completed by recency"
            />
            <span className="linear-slider" />
          </label>
        </div>

        {/* Completed issues */}
        <div className="display-row">
          <div className="display-row-left">
            <span>Completed issues</span>
          </div>
          <select
            className="display-select"
            value={displayConfig.completedIssues}
            onChange={(e) => updateDisplayConfig({ completedIssues: e.target.value as any })}
            aria-label="Show completed issues"
          >
            <option value="all">All</option>
            <option value="past_week">Past week</option>
            <option value="past_month">Past month</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Show sub-issues */}
        <div className="display-row">
          <div className="display-row-left">
            <span>Show sub-issues</span>
          </div>
          <label className="linear-switch">
            <input
              type="checkbox"
              checked={displayConfig.showSubIssues}
              onChange={(e) => updateDisplayConfig({ showSubIssues: e.target.checked })}
              aria-label="Show sub-issues"
            />
            <span className="linear-slider" />
          </label>
        </div>
      </div>

      {/* Board options Section */}
      <div className="display-section-header">Board options</div>
      <div className="display-settings-rows">
        <div className="display-row">
          <div className="display-row-left">
            <span>Show empty columns</span>
          </div>
          <label className="linear-switch">
            <input
              type="checkbox"
              checked={displayConfig.showEmptyColumns}
              onChange={(e) => updateDisplayConfig({ showEmptyColumns: e.target.checked })}
              aria-label="Show empty columns"
            />
            <span className="linear-slider" />
          </label>
        </div>

        <div className="display-row">
          <div className="display-row-left">
            <span>Show empty rows</span>
          </div>
          <label className="linear-switch">
            <input
              type="checkbox"
              checked={displayConfig.showEmptyRows}
              onChange={(e) => updateDisplayConfig({ showEmptyRows: e.target.checked })}
              aria-label="Show empty rows"
            />
            <span className="linear-slider" />
          </label>
        </div>
      </div>

      {/* Display properties Section */}
      <div className="display-section-header">Display properties</div>
      <div className="display-chips-container">
        {(
          [
            ['priority', 'Priority'],
            ['id', 'ID'],
            ['status', 'Status'],
            ['labels', 'Labels'],
            ['project', 'Project'],
            ['milestone', 'Milestone'],
            ['dueDate', 'Due date'],
            ['links', 'Links'],
            ['assignee', 'Assignee'],
          ] as const
        ).map(([key, label]) => {
          const isSelected = displayConfig.displayProperties[key];
          return (
            <button
              key={key}
              className={`display-property-chip ${isSelected ? 'active' : ''}`}
              onClick={() => toggleDisplayProperty(key)}
              type="button"
              aria-pressed={isSelected}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="display-panel-footer">
        <button
          className="display-footer-btn reset-btn"
          onClick={resetDisplayConfig}
          type="button"
        >
          Reset
        </button>
        <button
          className="display-footer-btn set-default-btn"
          onClick={handleSetDefault}
          type="button"
        >
          Set default for everyone
        </button>
      </div>
    </div>
  );
};
