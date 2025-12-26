import { cn } from '@/lib/utils';

interface UserStatusProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserStatus = ({ isOnline, size = 'md', className }: UserStatusProps) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <span
      className={cn(
        'rounded-full border-2 border-background',
        sizeClasses[size],
        isOnline ? 'bg-chat-online' : 'bg-chat-offline',
        className
      )}
      aria-label={isOnline ? 'Online' : 'Offline'}
    />
  );
};

export default UserStatus;
