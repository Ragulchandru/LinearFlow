import type { IssuePriority } from '../../types';
import { AlertCircle, SignalHigh, SignalMedium, SignalLow, Minus } from 'lucide-react';

interface PriorityBadgeProps {
  priority: IssuePriority;
  showLabel?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, showLabel = false }) => {
  const getIcon = () => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle size={14} className="priority-badge urgent" />;
      case 'high':
        return <SignalHigh size={14} className="priority-badge high" />;
      case 'medium':
        return <SignalMedium size={14} className="priority-badge medium" />;
      case 'low':
        return <SignalLow size={14} className="priority-badge low" />;
      case 'none':
      default:
        return <Minus size={14} className="priority-badge none" />;
    }
  };

  const getLabel = () => {
    if (priority === 'none') return 'No Priority';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} title={`Priority: ${getLabel()}`}>
      {getIcon()}
      {showLabel && <span style={{ fontSize: '12px' }}>{getLabel()}</span>}
    </div>
  );
};
