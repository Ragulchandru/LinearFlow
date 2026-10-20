import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 size={16} color="var(--status-done)" />;
            case 'error':
              return <AlertCircle size={16} color="var(--priority-urgent)" />;
            case 'warning':
              return <AlertTriangle size={16} color="var(--priority-high)" />;
            case 'info':
            default:
              return <Info size={16} color="var(--accent-primary)" />;
          }
        };

        return (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <div style={{ marginTop: '2px' }}>{getIcon()}</div>
            <div style={{ flex: 1 }}>
              <div className="toast-title">{toast.title}</div>
              {toast.description && <div className="toast-desc">{toast.description}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="btn-icon"
              style={{ padding: '2px', color: 'var(--text-tertiary)' }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
