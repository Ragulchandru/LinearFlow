import type { User } from '../../types';

interface AvatarProps {
  user?: User;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
}

const sizeMap: Record<string, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 36,
  xl: 48,
};

export const Avatar: React.FC<AvatarProps> = ({ user, size = 22, showName = false }) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 22;

  if (!user) {
    return (
      <div
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-surface-active)',
          border: '1px dashed var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: 'var(--text-tertiary)',
        }}
        title="Unassigned"
      >
        ?
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }} title={`${user.name} (${user.role})`}>
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="user-avatar"
          style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          style={{
            width: `${pixelSize}px`,
            height: `${pixelSize}px`,
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: `${Math.max(9, pixelSize * 0.4)}px`,
          }}
        >
          {initials}
        </div>
      )}
      {showName && <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>{user.name}</span>}
    </div>
  );
};
