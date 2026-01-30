'use client';

export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  onClick,
  ...props 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
    primary: 'bg-black text-white border border-black',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    danger: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
    outline: 'bg-transparent text-black border border-black'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200';

  const clickableClasses = onClick 
    ? 'cursor-pointer hover:scale-105 active:scale-95' 
    : '';

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${clickableClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const statusConfig = {
    PENDING: { variant: 'warning', label: 'Pending' },
    ASSIGNED: { variant: 'info', label: 'Assigned' },
    IN_PROGRESS: { variant: 'info', label: 'In Progress' },
    READY: { variant: 'success', label: 'Ready' },
    COMPLETED: { variant: 'success', label: 'Completed' },
    DONE: { variant: 'success', label: 'Done' },
    PAID: { variant: 'primary', label: 'Paid' },
    READY: { variant: 'success', label: 'Ready' },
    ON_PROGRESS: { variant: 'info', label: 'In Progress' },
    CREATED: { variant: 'warning', label: 'Created' }
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <Badge 
      variant={config.variant} 
      size="sm" 
      className={className}
    >
      {config.label}
    </Badge>
  );
}

export function CountBadge({ count, max = 99, className = '' }) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge 
      variant="danger" 
      size="sm" 
      className={`min-w-[20px] text-center ${className}`}
    >
      {displayCount}
    </Badge>
  );
}
