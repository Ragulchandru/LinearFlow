import type { IssueStatus } from '../../types';
import { CircleDot, CircleDashed, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';

interface StatusBadgeProps {
  status: IssueStatus;
  showLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showLabel = false }) => {
  const getIcon = () => {
    switch (status) {
      case 'backlog':
        return <CircleDashed size={14} className="status-indicator backlog" />;
      case 'todo':
        return <CircleDot size={14} className="status-indicator todo" />;
      case 'in_progress':
        return <Clock size={14} className="status-indicator in_progress" />;
      case 'in_review':
        return <Eye size={14} className="status-indicator in_review" color="#a855f7" />;
      case 'done':
        return <CheckCircle2 size={14} className="status-indicator done" />;
      case 'canceled':
        return <XCircle size={14} className="status-indicator canceled" />;
      default:
        return <CircleDot size={14} className="status-indicator todo" />;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'in_review':
        return 'In Review';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      {getIcon()}
      {showLabel && <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{getLabel()}</span>}
    </div>
  );
};
